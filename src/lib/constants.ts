/**
 * Length of the free trial in days, counted from account creation.
 * Shared by the client-side entitlements calculation (data.ts) and the
 * server-side Plaid sync gate (server.ts) -- import this instead of
 * redefining the number so the two stay in sync.
 */
export const TRIAL_DAYS = 14;
