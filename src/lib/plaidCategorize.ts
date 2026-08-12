// Maps Plaid's personal finance category taxonomy to TaxScout's IRS Schedule C
// categories. This is a rule-based mapping (not machine learning) -- it's a
// reasonable starting guess, flagged for review rather than auto-approved,
// except for categories that are unambiguously business or unambiguously
// personal.
export interface CategoryGuess {
  category: string;
  irsLine: string;
  status: "deductible" | "personal" | "review";
  confidence: number;
}

const SKIP_PRIMARY = new Set(["INCOME", "TRANSFER_IN", "TRANSFER_OUT", "LOAN_PAYMENTS"]);

const MAP: Record<string, CategoryGuess> = {
  TRAVEL: { category: "Travel", irsLine: "Travel", status: "review", confidence: 65 },
  TRANSPORTATION: { category: "Car & truck", irsLine: "Car & truck", status: "review", confidence: 65 },
  FOOD_AND_DRINK: { category: "Meals", irsLine: "Meals (50%)", status: "review", confidence: 55 },
  RENT_AND_UTILITIES: { category: "Utilities", irsLine: "Utilities", status: "review", confidence: 60 },
  GENERAL_MERCHANDISE: { category: "Office expense", irsLine: "Office expense", status: "review", confidence: 55 },
  GENERAL_SERVICES: { category: "Office expense", irsLine: "Office expense", status: "review", confidence: 60 },
  GOVERNMENT_AND_NON_PROFIT: { category: "Legal & professional", irsLine: "Legal & professional", status: "review", confidence: 50 },
  BANK_FEES: { category: "Office expense", irsLine: "Office expense", status: "review", confidence: 60 },
  ENTERTAINMENT: { category: "Personal", irsLine: "—", status: "personal", confidence: 80 },
  MEDICAL: { category: "Personal", irsLine: "—", status: "personal", confidence: 80 },
  PERSONAL_CARE: { category: "Personal", irsLine: "—", status: "personal", confidence: 85 },
};

const DEFAULT_GUESS: CategoryGuess = { category: "Uncategorized", irsLine: "Office expense", status: "review", confidence: 40 };

export function shouldSkipTransaction(primaryCategory: string | null | undefined) {
  return !primaryCategory || SKIP_PRIMARY.has(primaryCategory);
}

export function guessCategory(primaryCategory: string | null | undefined): CategoryGuess {
  if (!primaryCategory) return DEFAULT_GUESS;
  return MAP[primaryCategory] ?? DEFAULT_GUESS;
}
