import { createFileRoute } from "@tanstack/react-router";
import { getAuthedUser, serviceClient } from "@/lib/server";

export const Route = createFileRoute("/api/delete-account")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getAuthedUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        const supabase = serviceClient();
        const { error } = await supabase.auth.admin.deleteUser(user.id);
        if (error) return new Response(error.message, { status: 500 });

        return Response.json({ ok: true });
      },
    },
  },
});
