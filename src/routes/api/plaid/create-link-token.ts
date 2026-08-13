import { createFileRoute } from "@tanstack/react-router";
import { getAuthedUser, plaidFetch, PlaidError } from "@/lib/server";

export const Route = createFileRoute("/api/plaid/create-link-token")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getAuthedUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        try {
          const data = await plaidFetch<{ link_token: string }>("/link/token/create", {
            user: { client_user_id: user.id },
            client_name: "TaxScout",
            products: ["transactions"],
            country_codes: ["US"],
            language: "en",
          });
          return Response.json({ link_token: data.link_token });
        } catch (err) {
          const details = err instanceof PlaidError ? err.details : String(err);
          return Response.json({ error: "plaid_error", details }, { status: 502 });
        }
      },
    },
  },
});
