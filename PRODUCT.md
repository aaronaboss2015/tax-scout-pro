# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Freelancers and self-employed individuals (1099 contractors, Schedule C filers) who need to track deductible business expenses and estimate quarterly self-employment taxes without manual bookkeeping or reconstructing expenses from receipts at tax time.

## Product Purpose

TaxScout connects to a user's bank/card accounts via Plaid, automatically categorizes transactions into IRS Schedule C expense categories, flags ambiguous transactions for the user to review instead of guessing, and estimates quarterly self-employment tax liability. Success means the user has an accurate, review-confirmed picture of their deductible expenses and quarterly tax obligation without manual receipt-tracking.

## Positioning

No confirmed differentiator yet against adjacent products (Keeper, Bonsai, QuickBooks Self-Employed, FlyFin) that also do bank-linked expense tracking for freelancers. This is explicitly undecided — an early-stage product still finding its wedge. Do not invent a differentiator; the honest current position is narrower scope (deduction-finding + quarterly estimate only, no invoicing/bookkeeping suite) rather than a proven unique mechanism.

## Operating Context

User connects a bank account once via Plaid Link, then periodically reviews transactions flagged as ambiguous, checks the quarterly tax estimate near quarterly due dates (Apr/Jun/Sep/Jan), and exports a Schedule C-ready summary at tax filing time. Single-user accounts; no team/multi-user workflows.

## Capabilities and Constraints

- Bank/card sync via Plaid, now on Production access (real institutions supported as of this session; previously Sandbox-only).
- Transaction categorization is **rule-based**, not ML/AI — this is a real gap between some existing marketing copy ("AI Tax Deductions") and actual implementation. Future design/copy work should not deepen this mismatch, and flag it for resolution rather than reinforcing it.
- 10 IRS Schedule C expense categories; ambiguous transactions are flagged for user review with a visible reasoning string rather than silently auto-categorized.
- Quarterly tax estimator uses approximate state tax rates, not authoritative figures.
- No feature gating exists — every signed-up account gets full functionality free, indefinitely. This is an explicit, twice-confirmed founder decision (deferred deliberately, not an oversight) and should not be silently "fixed" by future design work implying paywalls/tiers that don't exist.
- No consumer-facing MFA yet (roadmap item, not yet built).
- Solo-founder operated — no team, no dedicated support staff, no enterprise-style access controls (RBAC, SSO, audit review cadence). Design/copy should not imply organizational scale that doesn't exist.
- Self-hosted, privacy-first analytics only (a Supabase table with insert-only RLS) — no third-party trackers (no GA/PostHog/etc.).
- Stack: React 19 + TanStack Start (SSR) + TanStack Router, Tailwind CSS v4 + shadcn/ui, Cloudflare Workers hosting, Supabase (Postgres + Auth), Stripe (payment links), Plaid (Transactions product only).

## Brand Commitments

- Name: **TaxScout**, domain **taxscout.dev**.
- Logo mark: magnifying glass over a receipt/document with a $ sign, navy (near-black) + green, user-provided asset. A recolored light variant exists for dark mode (`/logo-dark.png`).
- Primary brand color: green (`--primary`, oklch(0.62 0.15 160) in light mode).
- Tagline **"Develop smarter. File better."** appeared as placeholder text on a generated logo asset — explicitly **not confirmed** as binding brand copy. Do not treat it as locked; it reads as software-dev-tool copy, not freelancer-tax copy, and needs its own decision if adopted.

## Evidence on Hand

No external customer evidence exists yet — no beta users, no real testimonials, no usage data beyond the founder's own test accounts (created during development/QA). Future design and copywriting work must not fabricate stats, testimonials, customer counts, ratings, or savings figures. Prior work this session already removed fabricated claims of this kind ("10,000+ freelancers," "4.9 rating," invented testimonials, "96% accuracy") — do not reintroduce anything in that category.

## Product Principles

1. **Trust over persuasion.** This product touches real financial/bank data; never claim accuracy percentages, savings amounts, certifications, or user counts that aren't real and verifiable.
2. **Show your work.** Categorization decisions surface a visible reasoning string; ambiguous transactions are flagged for review rather than silently auto-approved.
3. **Do less, honestly.** Narrow scope (deductions + quarterly estimate) rather than an all-in-one suite, until a real differentiator is found — don't visually or verbally imply a broader product than exists.
4. **Solo-operator constraints are real constraints.** Enterprise-style controls, team workflows, or a support org don't exist yet; design should not imply otherwise.
