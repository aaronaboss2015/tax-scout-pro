import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/taxscout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus } from "lucide-react";
import { useTransactions, addTransaction, setTransactionStatus, CATEGORIES, type DbTransaction, type Status } from "@/lib/data";
import { ConfidenceBadge } from "./dashboard";

export const Route = createFileRoute("/transactions")({ component: Transactions });

const FILTERS = ["All", "Deductible", "Personal", "Needs Review"] as const;

function Transactions() {
  const { transactions, loading, refresh } = useTransactions();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<DbTransaction | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const rows = useMemo(() => {
    return transactions.filter(t => {
      if (filter === "Deductible" && t.status !== "deductible") return false;
      if (filter === "Personal" && t.status !== "personal") return false;
      if (filter === "Needs Review" && t.status !== "review") return false;
      if (q && !t.merchant.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    }).slice(0, 200);
  }, [transactions, filter, q]);

  async function handleStatusChange(id: string, status: Status) {
    await setTransactionStatus(id, status);
    setActive(null);
    refresh();
  }

  return (
    <AppShell title="Transactions">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">All transactions</h2>
            <p className="text-sm text-muted-foreground">{transactions.length.toLocaleString()} logged</p>
          </div>
          <div className="flex gap-2">
            <AddTransactionDialog open={addOpen} onOpenChange={setAddOpen} onAdded={refresh} />
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
                {!loading && rows.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">No transactions yet. Add your first one above.</td></tr>
                )}
                {rows.map(t => (
                  <tr key={t.id} onClick={() => setActive(t)} className="cursor-pointer border-b last:border-0 hover:bg-muted/40">
                    <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                    <td className="px-4 py-3 font-medium">{t.merchant}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold">${t.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.irs_line}</td>
                    <td className="px-4 py-3"><ConfidenceBadge value={t.confidence} /></td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
            <span>Showing {rows.length} of {transactions.length}</span>
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
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</div>
                  <div className="mt-1.5 font-medium">{active.category} → {active.irs_line}</div>
                </div>
                {active.reasoning && (
                  <div className="rounded-lg border bg-primary-soft p-3">
                    <p className="text-sm leading-relaxed">{active.reasoning}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleStatusChange(active.id, "deductible")}>Mark deductible</Button>
                  <Button variant="outline" size="sm" onClick={() => handleStatusChange(active.id, "personal")}>Mark personal</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}

function AddTransactionDialog({ open, onOpenChange, onAdded }: { open: boolean; onOpenChange: (o: boolean) => void; onAdded: () => void }) {
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [categoryName, setCategoryName] = useState(CATEGORIES[0].name);
  const [status, setStatus] = useState<Status>("deductible");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const amt = parseFloat(amount);
    if (!merchant.trim() || !amt || amt <= 0) {
      setError("Enter a merchant and a valid amount.");
      return;
    }
    const cat = CATEGORIES.find(c => c.name === categoryName)!;
    setSaving(true);
    setError(null);
    try {
      await addTransaction({ date, merchant: merchant.trim(), amount: amt, category: cat.name, irs_line: cat.line, status });
      setMerchant("");
      setAmount("");
      onOpenChange(false);
      onAdded();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="mr-2 h-4 w-4" /> Add transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="merchant">Merchant</Label>
            <Input id="merchant" value={merchant} onChange={(e) => setMerchant(e.target.value)} className="mt-1.5" placeholder="e.g. Adobe Creative Cloud" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5" placeholder="0.00" />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label>Category</Label>
            <Select value={categoryName} onValueChange={setCategoryName}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c.name} value={c.name}>{c.name} ({c.line})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="deductible">Deductible</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="review">Needs review</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {saving ? "Saving…" : "Save transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatusBadge({ status }: { status: DbTransaction["status"] }) {
  const map = {
    deductible: { cls: "bg-primary text-primary-foreground", label: "Deductible" },
    personal: { cls: "bg-muted text-muted-foreground", label: "Personal" },
    review: { cls: "bg-warning/20 text-foreground", label: "Review" },
  } as const;
  const c = map[status];
  return <Badge className={`rounded-full text-[10px] ${c.cls}`}>{c.label}</Badge>;
}
