import { env } from "cloudflare:workers";
import { createClient } from "@supabase/supabase-js";

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
