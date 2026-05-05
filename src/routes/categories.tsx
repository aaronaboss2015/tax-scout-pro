import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/taxscout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { CATEGORIES, categoryTotals } from "@/lib/mockData";

export const Route = createFileRoute("/categories")({ component: Categories });

function Categories() {
  const totals = categoryTotals();
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
              <div className="mt-1 text-4xl font-bold">${grand.toLocaleString()}</div>
            </div>
            <div className="text-right text-sm">
              <div className="text-muted-foreground">Estimated tax saved</div>
              <div className="text-2xl font-semibold text-primary">${Math.round(grand * 0.25).toLocaleString()}</div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          {rows.map((r, i) => {
            const pct = grand ? (r.total / grand) * 100 : 0;
            return (
              <div key={r.name} className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t" : ""} hover:bg-muted/40`}>
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
                <Button variant="ghost" size="icon"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            );
          })}
        </Card>
      </div>
    </AppShell>
  );
}
