import { createFileRoute } from "@tanstack/react-router";
import { getAuthedUser, plaidFetch, serviceClient } from "@/lib/server";

export const Route = createFileRoute("/api/plaid/disconnect")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getAuthedUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        const body = (await request.json()) as { institution_id: string };
        if (!body.institution_id) return new Response("Missing institution_id", { status: 400 });

        const supabase = serviceClient();
        const { data: item, error: fetchError } = await supabase
          .from("plaid_items")
          .select("access_token")
          .eq("id", body.institution_id)
          .eq("user_id", user.id)
          .single();
        if (fetchError || !item) return new Response("Not found", { status: 404 });

        try {
          await plaidFetch("/item/remove", { access_token: item.access_token });
        } catch {
          // If Plaid-side removal fails (e.g. already revoked), still remove our
          // record -- the user's intent is clear and the token would otherwise
          // sit around unusable.
        }

        const { error: deleteError } = await supabase
          .from("plaid_items")
          .delete()
          .eq("id", body.institution_id)
          .eq("user_id", user.id);
        if (deleteError) return new Response(deleteError.message, { status: 500 });

        return Response.json({ ok: true });
      },
    },
  },
});
