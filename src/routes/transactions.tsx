import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/taxscout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Search, Filter, Download, Brain, Paperclip, Edit3 } from "lucide-react";
import { TRANSACTIONS, type Transaction } from "@/lib/mockData";
import { ConfidenceBadge } from "./dashboard";

export const Route = createFileRoute("/transactions")({ component: Transactions });

const FILTERS = ["All", "Deductible", "Personal", "Needs Review"] as const;

function Transactions() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Transaction | null>(null);

  const rows = useMemo(() => {
    return TRANSACTIONS.filter(t => {
      if (filter === "Deductible" && t.status !== "deductible") return false;
      if (filter === "Personal" && t.status !== "personal") return false;
      if (filter === "Needs Review" && t.status !== "review") return false;
      if (q && !t.merchant.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    }).slice(0, 100);
  }, [filter, q]);

  return (
    <AppShell title="Transactions">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">All transactions</h2>
            <p className="text-sm text-muted-foreground">{TRANSACTIONS.length.toLocaleString()} reviewed across 3 accounts</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filters</Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search merchant…" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
                  {f}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="ml-auto">Approve all &gt; 90% confidence</Button>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Merchant</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-left font-medium">IRS Line</th>
                  <th className="px-4 py-3 text-left font-medium">Confidence</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(t => (
                  <tr key={t.id} onClick={() => setActive(t)} className="cursor-pointer border-b last:border-0 hover:bg-muted/40">
                    <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                    <td className="px-4 py-3 font-medium">{t.merchant}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold">${t.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.irsLine}</td>
                    <td className="px-4 py-3"><ConfidenceBadge value={t.confidence} /></td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
            <span>Showing {rows.length} of {TRANSACTIONS.length}</span>
            <div className="flex gap-1"><Button variant="ghost" size="sm">Previous</Button><Button variant="ghost" size="sm">Next</Button></div>
          </div>
        </Card>
      </div>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">{active.merchant}<ConfidenceBadge value={active.confidence} /></SheetTitle>
                <SheetDescription>{active.date} • ${active.amount.toFixed(2)}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-5 px-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</div>
                  <div className="mt-1.5"><StatusBadge status={active.status} /></div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI category</div>
                  <div className="mt-1.5 font-medium">{active.category} → {active.irsLine}</div>
                </div>
                <div className="rounded-lg border bg-primary-soft p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary"><Brain className="h-3.5 w-3.5" /> AI reasoning</div>
                  <p className="mt-1.5 text-sm leading-relaxed">{active.reasoning}</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm"><Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit</Button>
                  <Button variant="outline" size="sm">Mark personal</Button>
                  <Button variant="outline" size="sm"><Paperclip className="mr-1.5 h-3.5 w-3.5" /> Receipt</Button>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Note</div>
                  <Input placeholder="Add a note for your records…" className="mt-1.5" />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const map = {
    deductible: { cls: "bg-primary text-primary-foreground", label: "Deductible" },
    personal: { cls: "bg-muted text-muted-foreground", label: "Personal" },
    review: { cls: "bg-warning/20 text-foreground", label: "Review" },
  } as const;
  const c = map[status];
  return <Badge className={`rounded-full text-[10px] ${c.cls}`}>{c.label}</Badge>;
}
