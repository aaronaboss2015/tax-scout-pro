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
