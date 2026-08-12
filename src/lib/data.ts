import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Status = "deductible" | "personal" | "review";

export interface DbTransaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  irs_line: string;
  confidence: number;
  status: Status;
  note: string | null;
  reasoning: string | null;
}

export const CATEGORIES = [
  { name: "Advertising", line: "Line 8" },
  { name: "Car & truck", line: "Line 9" },
  { name: "Insurance", line: "Line 15" },
  { name: "Legal & professional", line: "Line 17" },
  { name: "Office expense", line: "Line 18" },
  { name: "Rent or lease", line: "Line 20b" },
  { name: "Supplies", line: "Line 22" },
  { name: "Travel", line: "Line 24a" },
  { name: "Meals (50%)", line: "Line 24b" },
  { name: "Utilities", line: "Line 25" },
];

export function useTransactions() {
  const [transactions, setTransactions] = useState<DbTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });
    if (error) setError(error.message);
    else {
      setError(null);
      setTransactions((data ?? []) as DbTransaction[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { transactions, loading, error, refresh };
}

export async function addTransaction(input: {
  date: string;
  merchant: string;
  amount: number;
  category: string;
  irs_line: string;
  status: Status;
  note?: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    date: input.date,
    merchant: input.merchant,
    amount: input.amount,
    category: input.category,
    irs_line: input.irs_line,
    status: input.status,
    note: input.note ?? null,
    confidence: 100,
    reasoning: "Manually entered.",
  });
  if (error) throw error;
}

export async function setTransactionStatus(id: string, status: Status) {
  const { error } = await supabase.from("transactions").update({ status }).eq("id", id);
  if (error) throw error;
}

function effectiveAmount(t: DbTransaction) {
  return t.irs_line === "Meals (50%)" ? t.amount * 0.5 : t.amount;
}

export function categoryTotals(transactions: DbTransaction[]) {
  const totals: Record<string, { total: number; count: number }> = {};
  for (const t of transactions) {
    if (t.status !== "deductible") continue;
    const key = t.irs_line;
    if (!totals[key]) totals[key] = { total: 0, count: 0 };
    totals[key].total += effectiveAmount(t);
    totals[key].count += 1;
  }
  return totals;
}

export function monthlyTrend(transactions: DbTransaction[]) {
  const buckets: Record<string, number> = {};
  for (const t of transactions) {
    if (t.status !== "deductible") continue;
    const key = t.date.slice(0, 7);
    buckets[key] = (buckets[key] || 0) + effectiveAmount(t);
  }
  return Object.entries(buckets)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .slice(-12)
    .map(([month, total]) => ({ month: month.slice(5), total: Math.round(total) }));
}

export function computeKPI(transactions: DbTransaction[]) {
  const currentYear = new Date().getFullYear();
  const ytdDeductible = transactions
    .filter((t) => t.status === "deductible" && new Date(t.date).getFullYear() === currentYear)
    .reduce((s, t) => s + effectiveAmount(t), 0);
  const confidenceValues = transactions.map((t) => t.confidence);
  return {
    deductionsYTD: Math.round(ytdDeductible),
    taxSaved: Math.round(ytdDeductible * 0.25),
    reviewed: transactions.length,
    confidence: confidenceValues.length
      ? Math.round(confidenceValues.reduce((s, c) => s + c, 0) / confidenceValues.length)
      : 0,
  };
}

export function reviewQueue(transactions: DbTransaction[]) {
  return transactions.filter((t) => t.status === "review").slice(0, 5);
}

export interface Subscription {
  name: string;
  amount: number;
  deductible: boolean;
  category: string;
}

/** Recurring subscriptions are inferred: a merchant billed 2+ times is treated as recurring. */
export function detectSubscriptions(transactions: DbTransaction[]): Subscription[] {
  const byMerchant = new Map<string, DbTransaction[]>();
  for (const t of transactions) {
    if (!byMerchant.has(t.merchant)) byMerchant.set(t.merchant, []);
    byMerchant.get(t.merchant)!.push(t);
  }
  const out: Subscription[] = [];
  for (const [name, txns] of byMerchant) {
    if (txns.length < 2) continue;
    const latest = txns.reduce((a, b) => (a.date > b.date ? a : b));
    const deductibleCount = txns.filter((t) => t.status === "deductible").length;
    out.push({
      name,
      amount: latest.amount,
      deductible: deductibleCount >= txns.length / 2,
      category: latest.category,
    });
  }
  return out.sort((a, b) => b.amount - a.amount);
}
