import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_TRANSACTIONS, demoTotals } from "@/lib/demoData";
import { track } from "@/lib/track";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "See TaxScout in action — Demo" },
      { name: "description", content: "A sample-data preview of how TaxScout categorizes transactions and flags potential deductions. No signup required." },
    ],
  }),
  component: Demo,
});

function Demo() {
  const nav = useNavigate();
  const totals = demoTotals();

  useEffect(() => {
    track("demo_page_view");
  }, []);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></div>
            <span className="font-bold">TaxScout</span>
          </Link>
          <Link to="/signup" onClick={() => track("demo_signup_clicked")}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start free trial <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-6 px-6 py-10">
        <div className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          <strong>This is sample data</strong> — six invented transactions to show how categorization and review work. Nothing here is a real customer or real result.
        </div>

        <div>
          <h1 className="text-2xl font-bold">How TaxScout categorizes your expenses</h1>
          <p className="mt-1 text-sm text-muted-foreground">Connect your accounts, and this is the kind of thing you'd see with your own transactions.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Potential deductions found</div>
            <div className="mt-2 font-mono-nums text-3xl font-bold text-primary">${totals.deductionsFound.toLocaleString()}</div>
            <div className="mt-1 text-xs text-muted-foreground">From transactions marked deductible below — not a guarantee, review before filing</div>
          </Card>
          <Card className="p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Needs your review</div>
            <div className="mt-2 text-3xl font-bold">{totals.reviewCount}</div>
            <div className="mt-1 text-xs text-muted-foreground">Ambiguous transactions, flagged instead of guessed</div>
          </Card>
          <Card className="p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Transactions shown</div>
            <div className="mt-2 text-3xl font-bold">{totals.totalCount}</div>
            <div className="mt-1 text-xs text-muted-foreground">Sample set — your real dashboard shows everything you connect</div>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="border-b bg-muted/40 px-5 py-3 text-sm font-semibold">Sample transactions</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/20 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Merchant</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-left font-medium">Why</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_TRANSACTIONS.map((t) => (
                  <tr key={t.merchant + t.date} className="border-b last:border-0">
                    <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                    <td className="px-4 py-3 font-medium">{t.merchant}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold">${t.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.category}</td>
                    <td className="px-4 py-3 max-w-xs text-xs text-muted-foreground">{t.reasoning}</td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`rounded-full text-[10px] ${
                          t.status === "deductible"
                            ? "bg-primary text-primary-foreground"
                            : t.status === "review"
                              ? "bg-warning/20 text-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {t.status === "deductible" ? "Deductible" : t.status === "review" ? "Needs review" : "Personal"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="border-primary/30 bg-primary-soft p-6 text-center">
          <h2 className="text-lg font-semibold">Want to see this with your own transactions?</h2>
          <p className="mt-1 text-sm text-muted-foreground">14-day free trial. No credit card required.</p>
          <Button
            size="lg"
            className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              track("demo_signup_clicked");
              nav({ to: "/signup" });
            }}
          >
            Start free trial <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Card>
      </div>
    </div>
  );
}
