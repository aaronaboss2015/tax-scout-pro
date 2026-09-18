import { env } from "cloudflare:workers";
import { createClient } from "@supabase/supabase-js";
import { TRIAL_DAYS } from "@/lib/constants";

export function serviceClient() {
  return createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Verifies the caller's Supabase access token and returns the authenticated user, or null. */
export async function getAuthedUser(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice("Bearer ".length);

  const supabase = serviceClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

/**
 * Bank sync (Plaid) is available during the 14-day free trial (matches the
 * "no credit card, read-only access" homepage promise) and to paid
 * subscribers. It costs money per connected account in Production, so this
 * is enforced server-side, not just hidden in the UI -- mirrors the
 * client-side computeEntitlements().canSync logic in data.ts.
 */
export async function userCanSync(userId: string): Promise<boolean> {
  const supabase = serviceClient();
  const { data } = await supabase
    .from("profiles")
    .select("subscription_status, created_at")
    .eq("id", userId)
    .single();

  if (data?.subscription_status === "active") return true;

  if (data?.created_at) {
    const trialEndsAt = new Date(data.created_at).getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000;
    if (Date.now() < trialEndsAt) return true;
  }

  return false;
}

const PLAID_BASE_URLS: Record<string, string> = {
  sandbox: "https://sandbox.plaid.com",
  development: "https://development.plaid.com",
  production: "https://production.plaid.com",
};

export class PlaidError extends Error {
  details: unknown;
  constructor(details: unknown) {
    super("Plaid API error");
    this.details = details;
  }
}

/**
 * Calls the Plaid REST API directly via fetch, with client_id/secret in the
 * request body. The official Plaid Node SDK is axios-based and doesn't
 * reliably send custom headers in the Cloudflare Workers runtime, so we
 * bypass it entirely -- body-based auth is an equally supported, documented
 * Plaid authentication method.
 */
export async function plaidFetch<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const baseUrl = PLAID_BASE_URLS[env.PLAID_ENV || "sandbox"];
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.PLAID_CLIENT_ID,
      secret: env.PLAID_SECRET,
      ...body,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new PlaidError(data);
  return data as T;
}
