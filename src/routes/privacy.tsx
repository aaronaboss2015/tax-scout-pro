import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, Eye, KeyRound, Trash2, Clock } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & Security — TaxScout" },
      { name: "description", content: "What TaxScout can and can't access, how bank connections work, and how to delete your data." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link to="/" className="mb-10 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></div>
        <span className="font-bold">TaxScout</span>
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">Privacy & Security</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated August 2026. Plain language, no legalese, no unverifiable claims.</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed">
        <section>
          <div className="flex items-center gap-2 font-semibold"><Eye className="h-4 w-4 text-primary" /> What we collect, and why</div>
          <p className="mt-2 text-muted-foreground">
            Your email and password (for your account), transaction data you add manually or import via a connected
            bank (to categorize and total your deductions), and basic profile info you choose to provide (name, state,
            estimated income — used to seed the quarterly tax estimator). We don't collect anything beyond what the
            product actually uses.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2 font-semibold"><KeyRound className="h-4 w-4 text-primary" /> Bank connections are read-only, and we never see your bank login</div>
          <p className="mt-2 text-muted-foreground">
            When you connect a bank, the login screen is Plaid's, not ours — TaxScout never sees or stores your bank
            username or password. Plaid gives us back an access token scoped to read transaction and account data
            only; nothing about our integration can move money, make payments, or change anything in your bank
            account. That access token is stored in a database table with no read or write permissions granted to
            the application's normal user-facing access key — only a separate, server-only key can touch it, and
            that key is never exposed to your browser.
          </p>
          <p className="mt-2 text-muted-foreground">
            You can disconnect any linked bank at any time from Settings. Disconnecting revokes the access token with
            Plaid and deletes our stored record of it immediately — it doesn't wait, and it isn't recoverable once
            done.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-primary" /> Payments</div>
          <p className="mt-2 text-muted-foreground">
            Payments are handled entirely by Stripe's hosted checkout. TaxScout never sees, receives, or stores your
            card number — Stripe tells us only whether your subscription is active and when it renews.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-primary" /> How your data is protected</div>
          <p className="mt-2 text-muted-foreground">
            All traffic to and from TaxScout is encrypted in transit (HTTPS). Your data is stored in a managed
            Postgres database (Supabase), which encrypts data at rest as part of its infrastructure. Every table
            containing your data enforces row-level access rules at the database level, so your transactions and
            profile are scoped to your account specifically — not just filtered in the app, but denied outright by
            the database for anyone else's session.
          </p>
          <p className="mt-2 text-muted-foreground">
            We don't currently hold any third-party security certifications (e.g. SOC 2), and we're not claiming any
            we don't have. If that changes, this page will say so specifically.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2 font-semibold"><Clock className="h-4 w-4 text-primary" /> How long we keep your data</div>
          <p className="mt-2 text-muted-foreground">
            Your data is kept for as long as your account exists. There's no automatic deletion after a period of
            inactivity today — if that changes, this page will be updated to say so before it happens.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2 font-semibold"><Trash2 className="h-4 w-4 text-primary" /> Deleting your data</div>
          <p className="mt-2 text-muted-foreground">
            Go to <Link to="/settings" className="text-primary hover:underline">Settings → Danger zone → Delete account</Link>.
            This is immediate and permanent: your account, all transactions, and any linked bank connections are
            deleted right away, with no 30-day grace period and no way to undo it. If you only want to disconnect a
            bank without deleting your whole account, do that from the same Settings page instead.
          </p>
        </section>

        <section>
          <p className="text-muted-foreground">
            Questions not answered here — <a href="mailto:privacy@taxscout.dev" className="text-primary hover:underline">privacy@taxscout.dev</a>.
            See also <Link to="/terms" className="text-primary hover:underline">Terms</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
