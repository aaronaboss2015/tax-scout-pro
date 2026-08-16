import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — TaxScout" },
      { name: "description", content: "TaxScout's terms of service: billing, cancellation, and what the product is and isn't." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link to="/" className="mb-10 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></div>
        <span className="font-bold">TaxScout</span>
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">Terms</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated August 2026.</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          Formal terms of service are still being finalized. TaxScout is not a CPA firm, and
          nothing in the app is professional tax advice — every categorization is a suggestion for
          you to review, not a filing recommendation. You're responsible for verifying your own
          tax return before submitting it to the IRS.
        </p>
        <p>
          Monthly plans are billed month-to-month and can be cancelled anytime from Settings.
          Annual plans are billed yearly. Questions — reach out at{" "}
          <a href="mailto:hello@taxscout.dev" className="text-primary hover:underline">hello@taxscout.dev</a>.
        </p>
      </div>
    </div>
  );
}
