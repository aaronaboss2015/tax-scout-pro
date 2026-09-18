import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

function getSessionId(): string {
  const key = "taxscout_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

/**
 * Minimal self-hosted funnel tracking -- writes to Supabase directly.
 * No third-party analytics, no ad-tech cookies. Fire-and-forget: never
 * blocks or throws on the caller.
 */
export function track(eventName: string, properties?: Record<string, unknown>) {
  try {
    const sessionId = getSessionId();
    supabase.auth.getUser().then(
      ({ data: { user } }) => {
        supabase
          .from("analytics_events")
          .insert({
            session_id: sessionId,
            user_id: user?.id ?? null,
            event_name: eventName,
            properties: properties ?? null,
          })
          .then(
            () => {},
            () => {},
          );
      },
      () => {},
    );
  } catch {
    // Never let tracking break the app.
  }
}

/**
 * Server-side variant for events with no browser session -- e.g. the Stripe
 * webhook, where trial/cancellation state changes happen. Takes an
 * already-authenticated (service role) Supabase client and writes directly;
 * there's no localStorage session id server-side, so these rows are tagged
 * with a fixed "server" session_id instead.
 */
export async function trackServerEvent(
  supabase: SupabaseClient,
  params: { userId: string; eventName: string; properties?: Record<string, unknown> },
) {
  try {
    await supabase.from("analytics_events").insert({
      session_id: "server",
      user_id: params.userId,
      event_name: params.eventName,
      properties: params.properties ?? null,
    });
  } catch {
    // Never let tracking break the webhook.
  }
}
