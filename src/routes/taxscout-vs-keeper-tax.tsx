import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { Logo } from "@/components/taxscout/Logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { track } from "@/lib/track";

export const Route = createFileRoute("/taxscout-vs-keeper-tax")({
  head: () => ({
    meta: [
      { title: "TaxScout vs. Keeper Tax: Which One Do You Actually Need?" },
      { name: "description", content: "Keeper files your full tax return for $199–399/yr. TaxScout tracks deductions and estimates quarterly tax for $19/mo. An honest, side-by-side comparison." },
      { property: "og:url", content: "https://taxscout.dev/taxscout-vs-keeper-tax" },
    ],
    links: [{ rel: "canonical", href: "https://taxscout.dev/taxscout-vs-keeper-tax" }],
  }),
  component: TaxScoutVsKeeper,
});

const ROWS: [string, string, string][] = [
  ["Price", "$19/mo or $99/yr", "$199/yr (Standard) or $399/yr (Premium)"],
  ["What it does", "Tracks deductions and estimates quarterly tax", "Prepares and e-files your full federal (and state) return"],
  ["Who files your return", "You do — export a Schedule C-ready summary to TurboTax or your CPA", "A dedicated tax pro reviews, signs, and e-files it for you"],
  ["Categorization", "Rule-based — every match shows its reasoning", "AI-assisted, reviewed by a human before filing"],
  ["Free trial", "14 days, no credit card, full bank sync access", "See keepertax.com for current trial terms"],
  ["State filing", "Quarterly estimate only — not e-filed", "E-file up to 2 states (Standard), more on Premium"],
  ["Audit help", "Export your reasoning to hand a CPA", "Audit protection included (Premium tier)"],
];

function TaxScoutVsKeeper() {
  useEffect(() => {
    track("comparison_page_view", { competitor: "keeper" });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-bold tracking-tight">TaxScout</span>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start free trial
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">TaxScout vs. Keeper Tax</h1>
          <p className="mt-3 text-muted-foreground">
            Both help freelancers find deductions. Here's what you're actually paying for — no spin.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Card className="border-primary/40 bg-primary-soft p-6">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">TaxScout — $19/mo or $99/yr</div>
            <p className="mt-2 text-sm text-foreground">
              Deduction tracking and a quarterly tax estimate. You still file the return yourself — TurboTax, a CPA,
              or however you already do it.
            </p>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Keeper — $199/yr or $399/yr</div>
            <p className="mt-2 text-sm text-muted-foreground">
              A dedicated tax pro reviews and files your full federal (and state) return for you, with AI-assisted
              deduction-finding built in.
            </p>
          </Card>
        </div>

        <div className="mt-10 overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium"></th>
                <th className="px-4 py-3 text-left font-medium text-primary">TaxScout</th>
                <th className="px-4 py-3 text-left font-medium">Keeper Tax</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, taxscout, keeper]) => (
                <tr key={label} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium text-muted-foreground">{label}</td>
                  <td className="px-4 py-3">{taxscout}</td>
                  <td className="px-4 py-3 text-muted-foreground">{keeper}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Keeper pricing reflects their published rates as of September 2026 — check{" "}
          <a href="https://www.keepertax.com/pricing" target="_blank" rel="noreferrer" className="underline underline-offset-2">
            keepertax.com/pricing
          </a>{" "}
          for current terms.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <Card className="p-6">
            <h2 className="font-semibold">Choose TaxScout if…</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /> You already file with TurboTax or a CPA and just want deduction-tracking automated</li>
              <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /> You want to see the reasoning behind every match, not just trust an AI</li>
              <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /> You want the cheaper option and don't need someone else to file for you</li>
            </ul>
          </Card>
          <Card className="p-6">
            <h2 className="font-semibold">Choose Keeper if…</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><X className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" /> You want a professional to prepare and file your entire return</li>
              <li className="flex items-start gap-2"><X className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" /> You need multi-state filing, K-1s, or other complex situations</li>
              <li className="flex items-start gap-2"><X className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" /> You'd rather pay more up front and hand off filing entirely</li>
            </ul>
          </Card>
        </div>

        <Card className="mt-10 border-border/60 bg-muted/30 p-6 text-sm text-muted-foreground">
          We're not trying to be Keeper. TaxScout is a narrower, cheaper tool built for one job: finding your
          deductions and showing you why. If you want your whole return handled by a professional, Keeper is a
          legitimate choice — just make sure you're paying for the tool that matches what you actually need.
        </Card>

        <div className="mt-10 text-center">
          <Link to="/signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start your free trial <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-2 text-xs text-muted-foreground">14 days, no credit card required.</p>
        </div>
      </div>
    </div>
  );
}
