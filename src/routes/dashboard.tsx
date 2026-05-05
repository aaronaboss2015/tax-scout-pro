import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/taxscout/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart,
} from "recharts";
import { TrendingUp, DollarSign, CheckCircle2, Activity, Check, X, HelpCircle } from "lucide-react";
import { KPI, REVIEW_QUEUE, categoryTotals, monthlyTrend, TRANSACTIONS } from "@/lib/mockData";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

const COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#0d9488", "#0891b2", "#0284c7", "#6366f1", "#8b5cf6"];

function Dashboard() {
  const cats = Object.entries(categoryTotals())
    .map(([name, v]) => ({ name, value: Math.round(v.total) }))
    .sort((a, b) => b.value - a.value);
  const trend = monthlyTrend();
  const kpis = [
    { label: "Deductions found YTD", value: `$${KPI.deductionsYTD.toLocaleString()}`, delta: "+18% vs last yr", icon: DollarSign, accent: "text-primary" },
    { label: "Estimated tax saved", value: `$${KPI.taxSaved.toLocaleString()}`, delta: "Based on 25% bracket", icon: TrendingUp, accent: "text-primary" },
    { label: "Transactions reviewed", value: KPI.reviewed.toLocaleString(), delta: "Across 3 accounts", icon: Activity, accent: "" },
    { label: "AI confidence", value: `${KPI.confidence}%`, delta: "5 need review", icon: CheckCircle2, accent: "text-primary" },
  ];

  return (
    <AppShell title="Dashboard">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, Jordan 👋</h2>
            <p className="text-sm text-muted-foreground">Here's how your 2026 tax year is shaping up.</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Generate Schedule C</Button>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <Card key={k.label} className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{k.label}</span>
                <k.icon className={`h-4 w-4 ${k.accent || "text-muted-foreground"}`} />
              </div>
              <div className="mt-2 text-3xl font-bold">{k.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{k.delta}</div>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Monthly deductions</h3>
                <p className="text-xs text-muted-foreground">Last 12 months</p>
              </div>
              <Badge variant="secondary" className="bg-primary-soft text-primary">+18% YoY</Badge>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(0 0% 90%)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Area type="monotone" dataKey="total" stroke="#059669" strokeWidth={2.5} fill="url(#grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold">By IRS category</h3>
            <p className="text-xs text-muted-foreground">Schedule C breakdown</p>
            <div className="relative mt-3">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={cats} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={2}>
                    {cats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xs text-muted-foreground">Total</div>
                <div className="text-lg font-bold">${cats.reduce((s, c) => s + c.value, 0).toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              {cats.slice(0, 5).map((c, i) => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} /> {c.name}</span>
                  <span className="font-medium">${c.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Review + Activity */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Needs your review</h3>
                <p className="text-xs text-muted-foreground">Confirm whether these are business expenses</p>
              </div>
              <Badge className="bg-warning/20 text-foreground">{REVIEW_QUEUE.length} items</Badge>
            </div>
            <div className="space-y-2">
              {REVIEW_QUEUE.map(t => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border bg-card p-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t.merchant}</span>
                      <ConfidenceBadge value={t.confidence} />
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">{t.reasoning}</div>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <span className="font-semibold tabular-nums">${t.amount.toFixed(2)}</span>
                    <Button size="icon" variant="outline" className="h-8 w-8 text-primary"><Check className="h-4 w-4" /></Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 text-muted-foreground"><X className="h-4 w-4" /></Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 text-muted-foreground"><HelpCircle className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold">Recent activity</h3>
            <p className="text-xs text-muted-foreground">From your linked accounts</p>
            <div className="mt-4 space-y-3">
              {TRANSACTIONS.slice(0, 8).map(t => (
                <div key={t.id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{t.merchant}</div>
                    <div className="text-xs text-muted-foreground">{t.date} • {t.category}</div>
                  </div>
                  <span className={`tabular-nums font-medium ${t.status === "deductible" ? "text-primary" : "text-muted-foreground"}`}>
                    ${t.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

export function ConfidenceBadge({ value }: { value: number }) {
  const cls = value >= 90 ? "bg-primary text-primary-foreground" : value >= 70 ? "bg-warning/20 text-foreground" : "bg-destructive/20 text-destructive";
  return <Badge className={`rounded-full text-[10px] ${cls}`}>{value}%</Badge>;
}
