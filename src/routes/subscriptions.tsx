import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/taxscout/AppShell";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Repeat, AlertCircle } from "lucide-react";
import { useTransactions, detectSubscriptions, type Subscription } from "@/lib/data";

export const Route = createFileRoute("/subscriptions")({ component: Subs });

function Subs() {
  const { transactions } = useTransactions();
  const [items, setItems] = useState<Subscription[]>([]);

  useEffect(() => {
    setItems(detectSubscriptions(transactions));
  }, [transactions]);

  const monthly = items.reduce((s, x) => s + x.amount, 0);
  const deductible = items.filter(x => x.deductible).reduce((s, x) => s + x.amount, 0);
  const annualDeduct = deductible * 12;

  return (
    <AppShell title="Subscriptions">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Recurring subscriptions</h2>
          <p className="text-sm text-muted-foreground">Detected from merchants that bill you more than once.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Monthly total</div>
            <div className="mt-2 text-3xl font-bold">${monthly.toFixed(2)}</div>
          </Card>
          <Card className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Deductible / month</div>
            <div className="mt-2 text-3xl font-bold text-primary">${deductible.toFixed(2)}</div>
          </Card>
          <Card className="border-primary bg-primary-soft p-5">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary"><AlertCircle className="h-3 w-3" /> Unclaimed annual</div>
            <div className="mt-2 text-3xl font-bold text-primary">${Math.round(annualDeduct).toLocaleString()}</div>
            <div className="mt-1 text-xs text-muted-foreground">in deductions if you mark them all</div>
          </Card>
        </div>

        <Card className="overflow-hidden">
          {items.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No recurring merchants detected yet — a merchant needs 2+ logged transactions to show up here.
            </div>
          )}
          {items.map((s, i) => (
            <div key={s.name} className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t" : ""}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary"><Repeat className="h-4 w-4" /></div>
              <div className="flex-1">
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.category}</div>
              </div>
              <div className="text-right">
                <div className="font-bold tabular-nums">${s.amount.toFixed(2)}<span className="text-xs font-normal text-muted-foreground">/mo</span></div>
                <div className="text-xs text-muted-foreground">${(s.amount * 12).toFixed(0)}/yr</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Deductible</span>
                <Switch checked={s.deductible} onCheckedChange={v => setItems(prev => prev.map((x, j) => j === i ? { ...x, deductible: v } : x))} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </AppShell>
  );
}
