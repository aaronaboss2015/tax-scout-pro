import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
          httpClient: Stripe.createFetchHttpClient(),
        });

        const signature = request.headers.get("stripe-signature");
        const body = await request.text();

        if (!signature) {
          return new Response("Missing signature", { status: 400 });
        }

        let event: Stripe.Event;
        try {
          event = await stripe.webhooks.constructEventAsync(body, signature, env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
          return new Response(`Signature verification failed: ${err instanceof Error ? err.message : "unknown"}`, { status: 400 });
        }

        const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.client_reference_id;
            if (!userId || !session.customer || !session.subscription) break;

            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            const price = subscription.items.data[0]?.price;
            const plan = price?.recurring?.interval === "year" ? "annual" : "monthly";

            await supabase
              .from("profiles")
              .update({
                stripe_customer_id: session.customer as string,
                subscription_status: subscription.status,
                subscription_plan: plan,
                current_period_end: new Date(subscription.items.data[0].current_period_end * 1000).toISOString(),
              })
              .eq("id", userId);
            break;
          }
          case "customer.subscription.updated":
          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const price = subscription.items.data[0]?.price;
            const plan = price?.recurring?.interval === "year" ? "annual" : "monthly";

            await supabase
              .from("profiles")
              .update({
                subscription_status: subscription.status,
                subscription_plan: plan,
                current_period_end: new Date(subscription.items.data[0].current_period_end * 1000).toISOString(),
              })
              .eq("stripe_customer_id", subscription.customer as string);
            break;
          }
          default:
            break;
        }

        return Response.json({ received: true });
      },
    },
  },
});
