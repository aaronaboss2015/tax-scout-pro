import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/taxscout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileDown, FileText, Sparkles } from "lucide-react";
import { CATEGORIES, categoryTotals, useTransactions } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/export")({ component: Export });

function downloadCsv(rows: Array<Record<string, string | number>>, filename: string) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => escape(r[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function Export() {
  const { user } = useAuth();
  const { transactions } = useTransactions();
  const name = (user?.user_metadata?.name as string | undefined) ?? user?.email?.split("@")[0] ?? "—";
  const profession = (user?.user_metadata?.profession as string | undefined) ?? "—";
  const totals = categoryTotals(transactions);
  const rows = CATEGORIES.map(c => ({ ...c, total: Math.round(totals[c.name]?.total || 0) })).filter(r => r.total > 0);
  const grand = rows.reduce((s, r) => s + r.total, 0);

  function handleExportCsv() {
    downloadCsv(
      transactions.map(t => ({
        date: t.date,
        merchant: t.merchant,
        amount: t.amount,
        category: t.category,
        irs_line: t.irs_line,
        status: t.status,
      })),
      "taxscout-transactions.csv",
    );
  }

  function handlePrintSchedule() {
    window.print();
  }

  return (
    <AppShell title="Export">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4 print:hidden">
          <Card className="p-6">
            <h2 className="text-xl font-bold">Generate Schedule C</h2>
            <p className="mt-1 text-sm text-muted-foreground">Summary based on your reviewed transactions.</p>
            <div className="mt-5 space-y-4">
              <div>
                <Label>Tax year</Label>
                <Select defaultValue="2026">
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{["2026", "2025", "2024"].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button onClick={handlePrintSchedule} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                <Sparkles className="mr-2 h-4 w-4" /> Generate Schedule C summary
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold">Download options</h3>
            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={handlePrintSchedule}><FileDown className="mr-2 h-4 w-4" /> Schedule C PDF (print to PDF)</Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleExportCsv}><FileDown className="mr-2 h-4 w-4" /> CSV (TurboTax import)</Button>
              <Button variant="outline" className="w-full justify-start" disabled><FileDown className="mr-2 h-4 w-4" /> QuickBooks .QBO <span className="ml-auto text-xs text-muted-foreground">Coming soon</span></Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold">Send to your CPA</h3>
            <p className="mt-1 text-xs text-muted-foreground">Emailing a copy directly isn't available yet — download the PDF above and send it yourself for now.</p>
          </Card>
        </div>

        <Card className="p-0 overflow-hidden print:border-none print:shadow-none">
          <div className="flex items-center gap-2 border-b bg-muted/40 px-5 py-3 print:hidden">
            <FileText className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-semibold">Preview — Schedule C (Form 1040), 2026</span>
          </div>
          <div className="space-y-6 p-8">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Schedule C</div>
              <div className="mt-1 text-lg font-bold">Profit or Loss From Business</div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-y py-4 text-sm">
              <div><div className="text-xs text-muted-foreground">Name of proprietor</div><div className="font-semibold">{name}</div></div>
              <div><div className="text-xs text-muted-foreground">Principal business</div><div className="font-semibold">{profession}</div></div>
            </div>
            <div>
              <div className="mb-2 text-sm font-bold">Part II — Expenses</div>
              {rows.length === 0 ? (
                <p className="text-sm text-muted-foreground">No deductible transactions yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {rows.map(r => (
                      <tr key={r.name} className="border-b last:border-0">
                        <td className="py-2 text-muted-foreground">{r.line}</td>
                        <td className="py-2">{r.name}</td>
                        <td className="py-2 text-right tabular-nums font-semibold">${r.total.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-primary-soft">
                      <td colSpan={2} className="py-3 pl-2 font-bold">Line 28 — Total expenses</td>
                      <td className="py-3 text-right text-lg font-bold tabular-nums text-primary">${grand.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Generated by TaxScout from your reviewed and manually-marked-deductible transactions. Not tax advice — verify with a professional before filing.</p>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
