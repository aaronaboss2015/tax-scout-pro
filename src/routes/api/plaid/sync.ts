import { createFileRoute } from "@tanstack/react-router";
import { getAuthedUser, plaidFetch, serviceClient } from "@/lib/server";
import { guessCategory, shouldSkipTransaction } from "@/lib/plaidCategorize";

interface PlaidTransaction {
  transaction_id: string;
  date: string;
  merchant_name?: string | null;
  name: string;
  amount: number;
  personal_finance_category?: { primary?: string } | null;
}

interface SyncResponse {
  added: PlaidTransaction[];
  has_more: boolean;
  next_cursor: string;
}

export const Route = createFileRoute("/api/plaid/sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getAuthedUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        const supabase = serviceClient();

        const { data: items, error: itemsError } = await supabase
          .from("plaid_items")
          .select("*")
          .eq("user_id", user.id);
        if (itemsError) return new Response(itemsError.message, { status: 500 });
        if (!items || items.length === 0) return Response.json({ imported: 0 });

        let imported = 0;

        for (const item of items) {
          let cursor: string | undefined = item.cursor ?? undefined;
          let hasMore = true;
          const added: PlaidTransaction[] = [];

          while (hasMore) {
            const response = await plaidFetch<SyncResponse>("/transactions/sync", {
              access_token: item.access_token,
              cursor,
            });
            added.push(...response.added);
            hasMore = response.has_more;
            cursor = response.next_cursor;
          }

          const rows = added
            .filter((t) => !shouldSkipTransaction(t.personal_finance_category?.primary))
            .filter((t) => t.amount > 0)
            .map((t) => {
              const guess = guessCategory(t.personal_finance_category?.primary);
              return {
                user_id: user.id,
                date: t.date,
                merchant: t.merchant_name ?? t.name,
                amount: t.amount,
                category: guess.category,
                irs_line: guess.irsLine,
                status: guess.status,
                confidence: guess.confidence,
                reasoning: `Imported from linked bank account, categorized as "${guess.category}" based on transaction type.`,
              };
            });

          if (rows.length > 0) {
            const { error: insertError } = await supabase.from("transactions").insert(rows);
            if (!insertError) imported += rows.length;
          }

          await supabase.from("plaid_items").update({ cursor }).eq("id", item.id);
        }

        return Response.json({ imported });
      },
    },
  },
});
