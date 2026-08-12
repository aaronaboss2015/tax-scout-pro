import { createFileRoute } from "@tanstack/react-router";
import { CountryCode, Products } from "plaid";
import { getAuthedUser, plaidClient } from "@/lib/server";

export const Route = createFileRoute("/api/plaid/create-link-token")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getAuthedUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        const plaid = plaidClient();
        const response = await plaid.linkTokenCreate({
          user: { client_user_id: user.id },
          client_name: "TaxScout",
          products: [Products.Transactions],
          country_codes: [CountryCode.Us],
          language: "en",
        });

        return Response.json({ link_token: response.data.link_token });
      },
    },
  },
});
