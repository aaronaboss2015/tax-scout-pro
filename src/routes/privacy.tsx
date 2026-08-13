import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/privacy")({ component: Privacy });

function Privacy() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link to="/" className="mb-10 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></div>
        <span className="font-bold">TaxScout</span>
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">Privacy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated August 2026.</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          A full privacy policy is still being finalized. In the meantime, here's plainly what we
          do with your data: bank connections are read-only, handled by Plaid — we never see or
          store your bank login credentials. Payments are processed by Stripe; we don't store your
          card details. Your transaction and account data is stored in our database, scoped so
          only you can access it.
        </p>
        <p>
          Questions before the formal policy is published — reach out at{" "}
          <a href="mailto:privacy@taxscout.dev" className="text-primary hover:underline">privacy@taxscout.dev</a>.
        </p>
      </div>
    </div>
  );
}
