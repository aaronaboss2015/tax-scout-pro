// Fictional sample data for the public demo page. Every value here is
// invented for illustration -- never presented as a real customer or
// real result anywhere else in the app.
export interface DemoTransaction {
  date: string;
  merchant: string;
  amount: number;
  category: string;
  irsLine: string;
  confidence: number;
  status: "deductible" | "personal" | "review";
  reasoning: string;
}

export const DEMO_TRANSACTIONS: DemoTransaction[] = [
  { date: "2026-08-01", merchant: "Adobe Creative Cloud", amount: 54.99, category: "Office expense", irsLine: "Line 18", confidence: 92, status: "deductible", reasoning: "Recurring software subscription, commonly used for client design work." },
  { date: "2026-07-28", merchant: "Uber", amount: 24.4, category: "Car & truck", irsLine: "Line 9", confidence: 74, status: "review", reasoning: "Rideshare charge — could be a client meeting or personal travel. Flagged for your review." },
  { date: "2026-07-22", merchant: "Office Depot", amount: 87.5, category: "Supplies", irsLine: "Line 22", confidence: 88, status: "deductible", reasoning: "Office supply purchase, consistent with prior business-expense pattern." },
  { date: "2026-07-19", merchant: "Whole Foods", amount: 62.1, category: "Personal", irsLine: "—", confidence: 95, status: "personal", reasoning: "Grocery purchase, typically personal unless flagged otherwise." },
  { date: "2026-07-15", merchant: "AWS", amount: 142.0, category: "Office expense", irsLine: "Line 18", confidence: 90, status: "deductible", reasoning: "Cloud hosting charge for a client project." },
  { date: "2026-07-10", merchant: "Starbucks", amount: 6.85, category: "Meals (50%)", irsLine: "Line 24b", confidence: 61, status: "review", reasoning: "Meal purchase — deductible only if it was a client meeting. Flagged for your review." },
];

export function demoTotals() {
  const deductible = DEMO_TRANSACTIONS.filter((t) => t.status === "deductible");
  const total = deductible.reduce((s, t) => s + (t.irsLine === "Line 24b" ? t.amount * 0.5 : t.amount), 0);
  return {
    deductionsFound: Math.round(total),
    reviewCount: DEMO_TRANSACTIONS.filter((t) => t.status === "review").length,
    totalCount: DEMO_TRANSACTIONS.length,
  };
}
