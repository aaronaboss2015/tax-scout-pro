import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/taxscout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CATEGORIES, categoryTotals, useTransactions } from "@/lib/data";

export const Route = createFileRoute("/categories")({ component: Categories });

function Categories() {
  const { transactions } = useTransactions();
  const totals = categoryTotals(transactions);
  const rows = CATEGORIES.map(c => ({
    ...c,
    total: Math.round(totals[c.name]?.total || 0),
    count: totals[c.name]?.count || 0,
  }));
  const grand = rows.reduce((s, r) => s + r.total, 0);

  return (
    <AppShell title="Categories">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold">IRS Schedule C categories</h2>
          <p className="text-sm text-muted-foreground">Year-to-date totals mapped to your Schedule C lines.</p>
        </div>

        <Card className="p-6">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Total deductions YTD</div>
              <div className="mt-1 font-mono-nums text-4xl font-bold">${grand.toLocaleString()}</div>
            </div>
            <div className="text-right text-sm">
              <div className="text-muted-foreground">Estimated tax saved</div>
              <div className="font-mono-nums text-2xl font-semibold text-primary">${Math.round(grand * 0.25).toLocaleString()}</div>
            </div>
          </div>
        </Card>

        {grand === 0 ? (
          <Card className="border-dashed p-10 text-center">
            <p className="font-medium">No deductible transactions yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Add a transaction and mark it deductible to see your category breakdown here.</p>
            <Button asChild className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/transactions">Add a transaction</Link>
            </Button>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            {rows.filter(r => r.total > 0).map((r, i) => {
              const pct = grand ? (r.total / grand) * 100 : 0;
              return (
                <div key={r.name} className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t" : ""}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{r.name}</span>
                      <span className="text-xs text-muted-foreground">{r.line}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold tabular-nums">${r.total.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{r.count} transactions</div>
                  </div>
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </AppShell>
  );
}
