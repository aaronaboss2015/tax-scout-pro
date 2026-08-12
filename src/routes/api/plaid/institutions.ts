import { createFileRoute } from "@tanstack/react-router";
import { getAuthedUser, serviceClient } from "@/lib/server";

export const Route = createFileRoute("/api/plaid/institutions")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const user = await getAuthedUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        const supabase = serviceClient();
        const { data, error } = await supabase
          .from("plaid_items")
          .select("id, institution_name, created_at")
          .eq("user_id", user.id);
        if (error) return new Response(error.message, { status: 500 });

        return Response.json({ institutions: data });
      },
    },
  },
});
