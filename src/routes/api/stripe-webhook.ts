import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { trackServerEvent } from "@/lib/track";

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
            const newStatus = subscription.status;

            // Look up the profile first (not just blind-update) so we know the
            // previous status and the user id -- both needed to log the right
            // analytics event below.
            const { data: existingProfile } = await supabase
              .from("profiles")
              .select("id, subscription_status")
              .eq("stripe_customer_id", subscription.customer as string)
              .maybeSingle();

            await supabase
              .from("profiles")
              .update({
                subscription_status: newStatus,
                subscription_plan: plan,
                current_period_end: new Date(subscription.items.data[0].current_period_end * 1000).toISOString(),
              })
              .eq("stripe_customer_id", subscription.customer as string);

            if (existingProfile) {
              // Fires once, at the moment Stripe reports the subscription
              // leaving "trialing" -- whether it converted to paid or lapsed.
              // Only fires if trial_period_days is actually configured on the
              // Stripe Price; if the trial is enforced purely at the app
              // layer, this event never occurs and trial tracking needs a
              // different (scheduled) mechanism instead.
              if (existingProfile.subscription_status === "trialing" && newStatus !== "trialing") {
                await trackServerEvent(supabase, {
                  userId: existingProfile.id,
                  eventName: "trial_ended",
                  properties: { outcome: newStatus, plan },
                });
              }
              if (event.type === "customer.subscription.deleted") {
                await trackServerEvent(supabase, {
                  userId: existingProfile.id,
                  eventName: "subscription_cancelled",
                  properties: { plan, previous_status: existingProfile.subscription_status },
                });
              }
            }
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
