export type Confidence = "high" | "medium" | "low";
export type Status = "deductible" | "personal" | "review";

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  irsLine: string;
  confidence: number;
  status: Status;
  note?: string;
  reasoning: string;
}

const merchants: Array<{
  name: string;
  category: string;
  irs: string;
  status: Status;
  conf: number;
  range: [number, number];
}> = [
  { name: "Adobe Creative Cloud", category: "Software", irs: "Office expense", status: "deductible", conf: 98, range: [54, 54] },
  { name: "Notion", category: "Software", irs: "Office expense", status: "deductible", conf: 97, range: [10, 20] },
  { name: "Slack", category: "Software", irs: "Office expense", status: "deductible", conf: 96, range: [12, 25] },
  { name: "Figma", category: "Software", irs: "Office expense", status: "deductible", conf: 99, range: [15, 45] },
  { name: "GitHub", category: "Software", irs: "Office expense", status: "deductible", conf: 98, range: [4, 21] },
  { name: "AWS", category: "Hosting", irs: "Office expense", status: "deductible", conf: 95, range: [22, 180] },
  { name: "Zoom", category: "Software", irs: "Office expense", status: "deductible", conf: 94, range: [14, 19] },
  { name: "Uber", category: "Travel", irs: "Travel", status: "deductible", conf: 88, range: [9, 48] },
  { name: "Lyft", category: "Travel", irs: "Travel", status: "deductible", conf: 86, range: [8, 52] },
  { name: "DoorDash", category: "Meals", irs: "Meals (50%)", status: "review", conf: 72, range: [18, 60] },
  { name: "Starbucks", category: "Meals", irs: "Meals (50%)", status: "review", conf: 65, range: [5, 14] },
  { name: "Office Depot", category: "Supplies", irs: "Supplies", status: "deductible", conf: 92, range: [22, 145] },
  { name: "Best Buy", category: "Supplies", irs: "Supplies", status: "review", conf: 78, range: [49, 1200] },
  { name: "AT&T Wireless", category: "Utilities", irs: "Utilities", status: "deductible", conf: 90, range: [85, 110] },
  { name: "Chevron", category: "Car/Truck", irs: "Car & truck", status: "deductible", conf: 84, range: [32, 78] },
  { name: "Shell", category: "Car/Truck", irs: "Car & truck", status: "deductible", conf: 84, range: [28, 72] },
  { name: "USPS", category: "Postage", irs: "Office expense", status: "deductible", conf: 95, range: [4, 28] },
  { name: "Whole Foods", category: "Groceries", irs: "—", status: "personal", conf: 99, range: [38, 220] },
  { name: "Trader Joe's", category: "Groceries", irs: "—", status: "personal", conf: 99, range: [25, 140] },
  { name: "Netflix", category: "Personal", irs: "—", status: "personal", conf: 99, range: [15, 22] },
  { name: "Google Workspace", category: "Software", irs: "Office expense", status: "deductible", conf: 99, range: [12, 18] },
  { name: "LinkedIn Premium", category: "Marketing", irs: "Advertising", status: "deductible", conf: 91, range: [40, 60] },
  { name: "Meta Ads", category: "Marketing", irs: "Advertising", status: "deductible", conf: 96, range: [50, 600] },
  { name: "American Airlines", category: "Travel", irs: "Travel", status: "deductible", conf: 93, range: [180, 720] },
  { name: "Hilton Hotels", category: "Travel", irs: "Travel", status: "deductible", conf: 92, range: [140, 380] },
  { name: "WeWork", category: "Rent", irs: "Rent or lease", status: "deductible", conf: 95, range: [220, 480] },
  { name: "State Farm", category: "Insurance", irs: "Insurance", status: "deductible", conf: 88, range: [110, 180] },
  { name: "LegalZoom", category: "Legal", irs: "Legal & professional", status: "deductible", conf: 90, range: [49, 320] },
];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generate(): Transaction[] {
  const rand = seeded(42);
  const out: Transaction[] = [];
  const start = new Date();
  start.setMonth(start.getMonth() - 17);
  for (let i = 0; i < 1247; i++) {
    const m = merchants[Math.floor(rand() * merchants.length)];
    const date = new Date(start.getTime() + rand() * (Date.now() - start.getTime()));
    const amount = +(m.range[0] + rand() * (m.range[1] - m.range[0])).toFixed(2);
    out.push({
      id: `tx_${i}`,
      date: date.toISOString().slice(0, 10),
      merchant: m.name,
      amount,
      category: m.category,
      irsLine: m.irs,
      confidence: m.conf + Math.floor(rand() * 4 - 2),
      status: m.status,
      reasoning: `Categorized as "${m.category}" because merchant "${m.name}" matches ${Math.floor(rand() * 400 + 50)} prior cases. ${m.status === "deductible" ? `Deductible under IRS line "${m.irs}".` : m.status === "review" ? "Mixed personal/business pattern — please confirm." : "Recurring personal spend."}`,
    });
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const TRANSACTIONS: Transaction[] = generate();

export const ytdDeductible = TRANSACTIONS.filter(
  (t) => t.status === "deductible" && new Date(t.date).getFullYear() === new Date().getFullYear(),
).reduce((s, t) => s + (t.irsLine === "Meals (50%)" ? t.amount * 0.5 : t.amount), 0);

export const KPI = {
  deductionsYTD: Math.round(ytdDeductible),
  taxSaved: Math.round(ytdDeductible * 0.25),
  reviewed: TRANSACTIONS.length,
  confidence: 96,
};

export const CATEGORIES = [
  { name: "Advertising", line: "Line 8", color: "var(--chart-1)" },
  { name: "Car & truck", line: "Line 9", color: "var(--chart-2)" },
  { name: "Insurance", line: "Line 15", color: "var(--chart-3)" },
  { name: "Legal & professional", line: "Line 17", color: "var(--chart-4)" },
  { name: "Office expense", line: "Line 18", color: "var(--chart-5)" },
  { name: "Rent or lease", line: "Line 20b", color: "var(--chart-1)" },
  { name: "Supplies", line: "Line 22", color: "var(--chart-2)" },
  { name: "Travel", line: "Line 24a", color: "var(--chart-3)" },
  { name: "Meals (50%)", line: "Line 24b", color: "var(--chart-4)" },
  { name: "Utilities", line: "Line 25", color: "var(--chart-5)" },
];

export function categoryTotals() {
  const totals: Record<string, { total: number; count: number }> = {};
  for (const t of TRANSACTIONS) {
    if (t.status !== "deductible") continue;
    const key = t.irsLine;
    if (!totals[key]) totals[key] = { total: 0, count: 0 };
    totals[key].total += t.irsLine === "Meals (50%)" ? t.amount * 0.5 : t.amount;
    totals[key].count += 1;
  }
  return totals;
}

export function monthlyTrend() {
  const buckets: Record<string, number> = {};
  for (const t of TRANSACTIONS) {
    if (t.status !== "deductible") continue;
    const key = t.date.slice(0, 7);
    buckets[key] = (buckets[key] || 0) + (t.irsLine === "Meals (50%)" ? t.amount * 0.5 : t.amount);
  }
  return Object.entries(buckets)
    .sort()
    .slice(-12)
    .map(([month, total]) => ({ month: month.slice(5), total: Math.round(total) }));
}

export const SUBSCRIPTIONS = [
  { name: "Adobe Creative Cloud", amount: 54.99, deductible: true, category: "Software" },
  { name: "Notion Team", amount: 16, deductible: true, category: "Software" },
  { name: "Figma Professional", amount: 15, deductible: true, category: "Software" },
  { name: "GitHub Pro", amount: 21, deductible: true, category: "Software" },
  { name: "Google Workspace", amount: 14.4, deductible: true, category: "Software" },
  { name: "Zoom Pro", amount: 14.99, deductible: true, category: "Software" },
  { name: "AWS", amount: 89, deductible: true, category: "Hosting" },
  { name: "LinkedIn Premium", amount: 59.99, deductible: true, category: "Marketing" },
  { name: "Slack Pro", amount: 12.5, deductible: true, category: "Software" },
  { name: "Netflix", amount: 22.99, deductible: false, category: "Personal" },
  { name: "Spotify Family", amount: 16.99, deductible: false, category: "Personal" },
  { name: "1Password", amount: 7.99, deductible: true, category: "Software" },
];

export const REVIEW_QUEUE = TRANSACTIONS.filter((t) => t.status === "review").slice(0, 5);

export const USER = {
  name: "Jordan Reyes",
  email: "jordan@reyes.studio",
  profession: "Freelance Designer",
  city: "New York, NY",
  income: 87000,
  initials: "JR",
};