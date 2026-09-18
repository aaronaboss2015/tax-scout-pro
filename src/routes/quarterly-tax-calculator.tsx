import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Logo } from "@/components/taxscout/Logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { track } from "@/lib/track";

export const Route = createFileRoute("/quarterly-tax-calculator")({
  head: () => ({
    meta: [
      { title: "Quarterly Tax Calculator for Freelancers — TaxScout" },
      { name: "description", content: "Estimate your deductible expenses and quarterly tax savings as a 1099 freelancer. Free calculator, no signup required." },
      { property: "og:url", content: "https://taxscout.dev/quarterly-tax-calculator" },
    ],
    links: [{ rel: "canonical", href: "https://taxscout.dev/quarterly-tax-calculator" }],
  }),
  component: QuarterlyTaxCalculator,
});

function QuarterlyTaxCalculator() {
  const [income, setIncome] = useState(87000);
  const found = Math.round(income * 0.12);
  const saved = Math.round(found * 0.25);
  const hasTrackedInteraction = useRef(false);

  useEffect(() => {
    track("calculator_page_view");
  }, []);

  function handleIncomeChange(next: number) {
    setIncome(next);
    if (!hasTrackedInteraction.current) {
      hasTrackedInteraction.current = true;
      track("calculator_interacted");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
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

      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Estimate your freelance tax deductions</h1>
          <p className="mt-3 text-muted-foreground">
            A quick, ballpark estimate based on typical freelance spending patterns — connect your real accounts for your actual numbers.
          </p>
        </div>

        <Card className="mt-10 overflow-hidden border-border/60 bg-gradient-to-br from-primary-soft via-background to-background p-8 md:p-12">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Annual freelance income</label>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-2xl font-semibold text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={income}
                  onChange={(e) => handleIncomeChange(Number(e.target.value) || 0)}
                  className="h-14 max-w-[220px] text-2xl font-semibold"
                />
              </div>
              <input
                type="range"
                min={10000}
                max={300000}
                step={1000}
                value={income}
                onChange={(e) => handleIncomeChange(Number(e.target.value))}
                className="mt-5 w-full accent-[var(--primary)]"
              />
            </div>
            <div className="space-y-4">
              <div className="rounded-xl bg-background p-5 shadow-sm">
                <div className="text-sm text-muted-foreground">Estimated deductions found</div>
                <div className="mt-1 text-3xl font-bold text-primary">${found.toLocaleString()}</div>
              </div>
              <div className="rounded-xl bg-background p-5 shadow-sm">
                <div className="text-sm text-muted-foreground">Estimated tax saved</div>
                <div className="mt-1 text-3xl font-bold">${saved.toLocaleString()}</div>
              </div>
              <Link to="/signup">
                <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Find my deductions <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-primary" /> No credit card</span>
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-primary" /> Read-only access</span>
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-primary" /> 14-day free trial</span>
        </div>
      </div>
    </div>
  );
}
