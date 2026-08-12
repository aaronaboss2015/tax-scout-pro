import { createFileRoute } from "@tanstack/react-router";
import { getAuthedUser, plaidClient, serviceClient } from "@/lib/server";

export const Route = createFileRoute("/api/plaid/exchange-token")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getAuthedUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        const body = (await request.json()) as { public_token: string; institution_name?: string };
        if (!body.public_token) return new Response("Missing public_token", { status: 400 });

        const plaid = plaidClient();
        const exchange = await plaid.itemPublicTokenExchange({ public_token: body.public_token });

        const supabase = serviceClient();
        const { error } = await supabase.from("plaid_items").insert({
          user_id: user.id,
          access_token: exchange.data.access_token,
          item_id: exchange.data.item_id,
          institution_name: body.institution_name ?? null,
        });
        if (error) return new Response(error.message, { status: 500 });

        return Response.json({ ok: true });
      },
    },
  },
});
