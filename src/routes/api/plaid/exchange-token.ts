import { createFileRoute } from "@tanstack/react-router";
import { getAuthedUser, plaidFetch, PlaidError, serviceClient } from "@/lib/server";

export const Route = createFileRoute("/api/plaid/exchange-token")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getAuthedUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        const body = (await request.json()) as { public_token: string; institution_name?: string };
        if (!body.public_token) return new Response("Missing public_token", { status: 400 });

        try {
          const exchange = await plaidFetch<{ access_token: string; item_id: string }>(
            "/item/public_token/exchange",
            { public_token: body.public_token },
          );

          const supabase = serviceClient();
          const { error } = await supabase.from("plaid_items").insert({
            user_id: user.id,
            access_token: exchange.access_token,
            item_id: exchange.item_id,
            institution_name: body.institution_name ?? null,
          });
          if (error) return new Response(error.message, { status: 500 });

          return Response.json({ ok: true });
        } catch (err) {
          const details = err instanceof PlaidError ? err.details : String(err);
          return Response.json({ error: "plaid_error", details }, { status: 502 });
        }
      },
    },
  },
});
