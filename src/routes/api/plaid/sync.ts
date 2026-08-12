import { createFileRoute } from "@tanstack/react-router";
import type { Transaction } from "plaid";
import { getAuthedUser, plaidClient, serviceClient } from "@/lib/server";
import { guessCategory, shouldSkipTransaction } from "@/lib/plaidCategorize";

export const Route = createFileRoute("/api/plaid/sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getAuthedUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        const supabase = serviceClient();
        const plaid = plaidClient();

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
          const added: Transaction[] = [];

          while (hasMore) {
            const response = await plaid.transactionsSync({
              access_token: item.access_token,
              cursor,
            });
            added.push(...response.data.added);
            hasMore = response.data.has_more;
            cursor = response.data.next_cursor;
          }

          const rows = added
            .filter((t) => !shouldSkipTransaction((t.personal_finance_category as { primary?: string } | undefined)?.primary))
            .filter((t) => (t.amount as number) > 0)
            .map((t) => {
              const guess = guessCategory((t.personal_finance_category as { primary?: string } | undefined)?.primary);
              return {
                user_id: user.id,
                date: t.date as string,
                merchant: (t.merchant_name as string | undefined) ?? (t.name as string),
                amount: t.amount as number,
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
