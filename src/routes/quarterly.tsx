import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/taxscout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, AlertCircle, PiggyBank } from "lucide-react";
import { useTransactions, computeKPI } from "@/lib/data";

export const Route = createFileRoute("/quarterly")({ component: Quarterly });

function Quarterly() {
  const { transactions, loading } = useTransactions();
  const kpi = computeKPI(transactions);
  const [income, setIncome] = useState(87000);
  const [deductions, setDeductions] = useState(0);
  const [deductionsSeeded, setDeductionsSeeded] = useState(false);

  useEffect(() => {
    if (!loading && !deductionsSeeded) {
      setDeductions(kpi.deductionsYTD);
      setDeductionsSeeded(true);
    }
  }, [loading, deductionsSeeded, kpi.deductionsYTD]);

  const taxable = Math.max(0, income - deductions);
  const seTax = taxable * 0.9235 * 0.153;
  const fedTax = taxable * 0.22;
  const stateTax = taxable * 0.065;
  const total = seTax + fedTax + stateTax;
  const quarterly = total / 4;

  const quarters = [
    { q: "Q1", due: "Apr 15, 2026", paid: true },
    { q: "Q2", due: "Jun 17, 2026", paid: true },
    { q: "Q3", due: "Sep 16, 2026", paid: false, next: true },
    { q: "Q4", due: "Jan 15, 2027", paid: false },
  ];

  return (
    <AppShell title="Quarterly Taxes">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Quarterly tax estimator</h2>
          <p className="text-sm text-muted-foreground">Pay-as-you-go to avoid IRS underpayment penalties.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <h3 className="font-semibold">Your numbers</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><Label>Projected annual income</Label><Input type="number" className="mt-1.5" value={income} onChange={e => setIncome(+e.target.value || 0)} /></div>
              <div><Label>Deductions found</Label><Input type="number" className="mt-1.5" value={deductions} onChange={e => setDeductions(+e.target.value || 0)} /></div>
            </div>
            <div className="mt-6 space-y-3 rounded-lg border bg-muted/30 p-4 text-sm">
              {[
                ["Taxable income", taxable],
                ["Self-employment tax (15.3%)", seTax],
                ["Federal income tax (~22%)", fedTax],
                ["State tax (NY, ~6.5%)", stateTax],
              ].map(([l, v]) => (
                <div key={l as string} className="flex justify-between"><span className="text-muted-foreground">{l}</span><span className="font-semibold tabular-nums">${Math.round(v as number).toLocaleString()}</span></div>
              ))}
              <div className="flex justify-between border-t pt-3"><span className="font-semibold">Total tax owed</span><span className="text-lg font-bold text-primary tabular-nums">${Math.round(total).toLocaleString()}</span></div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 text-primary"><PiggyBank className="h-5 w-5" /><h3 className="font-semibold">Set aside</h3></div>
            <div className="mt-3 text-sm text-muted-foreground">For each $1 you earn, save:</div>
            <div className="mt-1 text-4xl font-bold">{Math.round((total / income) * 100)}¢</div>
            <div className="mt-4 rounded-lg bg-primary-soft p-4">
              <div className="text-xs font-medium text-primary">Recommended quarterly payment</div>
              <div className="mt-1 text-2xl font-bold">${Math.round(quarterly).toLocaleString()}</div>
            </div>
            <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"><Calendar className="mr-2 h-4 w-4" /> Add reminders</Button>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold">2026 quarterly schedule</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {quarters.map(q => (
              <div key={q.q} className={`rounded-xl border p-4 ${q.next ? "border-primary bg-primary-soft" : ""}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{q.q}</span>
                  {q.paid ? <span className="text-xs font-medium text-primary">Paid ✓</span> : q.next ? <span className="flex items-center gap-1 text-xs font-medium text-primary"><AlertCircle className="h-3 w-3" /> Up next</span> : <span className="text-xs text-muted-foreground">Upcoming</span>}
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">Due {q.due}</div>
                <div className="mt-3 text-xl font-bold">${Math.round(quarterly).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
