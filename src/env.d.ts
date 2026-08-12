declare module "cloudflare:workers" {
  interface Env {
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    VITE_SUPABASE_URL: string;
    PLAID_CLIENT_ID: string;
    PLAID_SECRET: string;
    PLAID_ENV: string;
  }
  export const env: Env;
}
