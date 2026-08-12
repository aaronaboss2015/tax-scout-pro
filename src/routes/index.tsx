import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Wallet,
  Receipt,
  Plug,
  Brain,
  FileDown,
  Home,
  Car,
  Utensils,
  Cloud,
  Check,
  ChevronDown,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { buildCheckoutUrl } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <TrustBar />
      <HowItWorks />
      <WhatWeFind />
      <Calculator />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-lg font-bold tracking-tight">TaxScout</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#find" className="hover:text-foreground">What we find</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">Sign in</Link>
          <Link to="/signup">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start free trial
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
      <Sparkles className="h-4 w-4" />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--primary-soft),_transparent_60%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
        <div>
          <Badge variant="secondary" className="mb-5 rounded-full bg-accent text-accent-foreground">
            <Sparkles className="mr-1 h-3 w-3" /> Built for 1099 freelancers
          </Badge>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Stop overpaying the <span className="text-primary">IRS</span> by $5,000+ every year.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            The average freelancer overpays the IRS by $5,000–$10,000 every year. TaxScout connects to your accounts, finds every deductible expense automatically, and exports a Schedule C-ready summary in one click.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Start 14-day free trial <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline">See live demo</Button>
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Check className="h-4 w-4 text-primary" /> No credit card</span>
            <span className="flex items-center gap-1"><Check className="h-4 w-4 text-primary" /> Read-only access</span>
          </div>
        </div>
        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  const rows = [
    { m: "Adobe Creative Cloud", a: 54.99, c: "Software", conf: 98, cls: "from-primary/20 to-primary/5" },
    { m: "Uber", a: 24.4, c: "Travel", conf: 92, cls: "from-primary/20 to-primary/5" },
    { m: "Office Depot", a: 87.5, c: "Supplies", conf: 95, cls: "from-primary/20 to-primary/5" },
    { m: "Starbucks", a: 6.85, c: "Meals (50%)", conf: 71, cls: "from-warning/20 to-warning/5" },
    { m: "AWS", a: 142.0, c: "Hosting", conf: 99, cls: "from-primary/20 to-primary/5" },
  ];
  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-transparent blur-2xl" />
      <Card className="overflow-hidden rounded-2xl border-border/60 p-0 shadow-2xl shadow-primary/10">
        <div className="flex items-center justify-between border-b bg-muted/40 px-5 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Brain className="h-4 w-4 text-primary" /> AI categorizing transactions…
          </div>
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
            <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
            <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          </div>
        </div>
        <div className="space-y-1 p-3">
          {rows.map((r, i) => (
            <div
              key={r.m}
              className={`flex items-center justify-between rounded-lg bg-gradient-to-r ${r.cls} px-3 py-2.5 text-sm`}
              style={{ animation: `fadeIn 0.5s ease ${i * 0.15}s both` }}
            >
              <div className="flex flex-col">
                <span className="font-medium">{r.m}</span>
                <span className="text-xs text-muted-foreground">{r.c}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">${r.a.toFixed(2)}</span>
                <Badge
                  className={`rounded-full ${
                    r.conf >= 90 ? "bg-primary text-primary-foreground" : "bg-warning/20 text-foreground"
                  }`}
                >
                  {r.conf}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t bg-muted/30 px-5 py-3 text-sm">
          <span className="text-muted-foreground">Deductions found this month</span>
          <span className="text-lg font-bold text-primary">+$1,247.84</span>
        </div>
      </Card>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }`}</style>
    </div>
  );
}

function TrustBar() {
  const items = [
    { i: <Wallet className="h-4 w-4" />, t: "Trusted by 10,000+ freelancers" },
    { i: <ShieldCheck className="h-4 w-4" />, t: "Bank-level 256-bit encryption" },
    { i: <Receipt className="h-4 w-4" />, t: "Read-only account access" },
    { i: <Star className="h-4 w-4" />, t: "4.9/5 average rating" },
  ];
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-6 text-sm text-muted-foreground md:grid-cols-4">
        {items.map((x) => (
          <div key={x.t} className="flex items-center justify-center gap-2 font-medium">
            <span className="text-primary">{x.i}</span>
            {x.t}
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { i: <Plug className="h-5 w-5" />, t: "Connect accounts via Plaid", d: "Securely link your bank, credit cards, and payment apps in 30 seconds." },
    { i: <Brain className="h-5 w-5" />, t: "AI categorizes every transaction", d: "Our model maps each charge to the correct IRS Schedule C line with 96% accuracy." },
    { i: <FileDown className="h-5 w-5" />, t: "Export Schedule C", d: "Download an IRS-ready PDF, send to TurboTax, QuickBooks, or your CPA." },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader eyebrow="How it works" title="From bank statement to tax return in three steps." />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <Card key={s.t} className="relative p-6">
            <div className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
              Step {i + 1}
            </div>
            <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
              {s.i}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function WhatWeFind() {
  const items = [
    { i: <Home className="h-5 w-5" />, t: "Home office", d: "Rent, utilities, and a portion of your internet — calculated by square footage." },
    { i: <Cloud className="h-5 w-5" />, t: "Software & subscriptions", d: "Adobe, Notion, AWS, and the 47 other tools you forgot about." },
    { i: <Car className="h-5 w-5" />, t: "Mileage", d: "Auto-tracked rideshare and gas, converted to IRS standard mileage rate." },
    { i: <Utensils className="h-5 w-5" />, t: "Meals & travel", d: "Client lunches, conferences, hotels — at the right deductible percentage." },
  ];
  return (
    <section id="find" className="bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="What we find" title="The deductions you're leaving on the table." />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map((x) => (
            <Card key={x.t} className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                {x.i}
              </div>
              <h3 className="mt-4 font-semibold">{x.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{x.d}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Calculator() {
  const [income, setIncome] = useState(87000);
  const found = Math.round(income * 0.12);
  const saved = Math.round(found * 0.25);
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-primary-soft via-background to-background p-8 md:p-12">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeader eyebrow="Savings calculator" title="See how much you could save." align="left" />
            <label className="mt-6 block text-sm font-medium text-muted-foreground">Annual freelance income</label>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-2xl font-semibold text-muted-foreground">$</span>
              <Input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value) || 0)}
                className="h-14 max-w-[220px] text-2xl font-semibold"
              />
            </div>
            <input
              type="range"
              min={10000}
              max={300000}
              step={1000}
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="mt-5 w-full accent-[var(--primary)]"
            />
          </div>
          <div className="space-y-4">
            <div className="rounded-xl bg-background p-5 shadow-sm">
              <div className="text-sm text-muted-foreground">Estimated deductions found</div>
              <div className="mt-1 text-3xl font-bold text-primary">${found.toLocaleString()}</div>
            </div>
            <div className="rounded-xl bg-background p-5 shadow-sm">
              <div className="text-sm text-muted-foreground">Estimated tax saved</div>
              <div className="mt-1 text-3xl font-bold">${saved.toLocaleString()}</div>
            </div>
            <Link to="/signup">
              <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Find my deductions <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
}

function Pricing() {
  const { user } = useAuth();

  function checkoutHref(plan: "monthly" | "annual") {
    if (!user) return "/signup";
    return buildCheckoutUrl(plan, user.id, user.email);
  }

  const tiers = [
    { name: "Free trial", price: "$0", per: "for 14 days", desc: "Full access. No card required.", cta: "Start trial", features: ["Unlimited transactions", "AI categorization", "Schedule C preview"], href: "/signup" as const },
    { name: "Monthly", price: "$19", per: "/ month", desc: "Cancel anytime.", cta: user ? "Choose monthly" : "Sign up to subscribe", features: ["Everything in trial", "Quarterly tax estimator", "Schedule C export", "Email support"], href: checkoutHref("monthly") },
    { name: "Annual", price: "$99", per: "/ year", desc: "Save $129 vs monthly.", cta: user ? "Choose annual" : "Sign up to subscribe", features: ["Everything in monthly", "Audit support", "CPA handoff", "Priority support"], featured: true, href: checkoutHref("annual") },
  ];
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader eyebrow="Pricing" title="Pays for itself 50× over." />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <Card
            key={t.name}
            className={`relative p-7 ${t.featured ? "border-primary shadow-xl shadow-primary/10 ring-1 ring-primary" : ""}`}
          >
            {t.featured && (
              <div className="absolute -top-3 right-6 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                Save $129
              </div>
            )}
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold">{t.price}</span>
              <span className="text-sm text-muted-foreground">{t.per}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /> {f}
                </li>
              ))}
            </ul>
            {t.href === "/signup" ? (
              <Link to="/signup" className="mt-7 block">
                <Button className={`w-full ${t.featured ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`} variant={t.featured ? "default" : "outline"}>
                  {t.cta}
                </Button>
              </Link>
            ) : (
              <a href={t.href} className="mt-7 block">
                <Button className={`w-full ${t.featured ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`} variant={t.featured ? "default" : "outline"}>
                  {t.cta}
                </Button>
              </a>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const t = [
    { n: "Maya P.", r: "Freelance designer", q: "TaxScout found $6,800 in deductions I would have missed. I made my annual fee back in the first hour." },
    { n: "Devon K.", r: "Independent developer", q: "I used to dread Q4. Now I just hit export and email it to my CPA. It's almost too easy." },
    { n: "Sara L.", r: "Marketing consultant", q: "The AI caught subscriptions on three different cards I had completely forgotten about. $1,400 right there." },
  ];
  return (
    <section className="bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Loved by freelancers" title="What our customers say." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.map((x) => (
            <Card key={x.n} className="p-6">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground">"{x.q}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
                  {x.n[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold">{x.n}</div>
                  <div className="text-xs text-muted-foreground">{x.r}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    ["Is my financial data safe?", "Yes. We use bank-level 256-bit encryption and read-only Plaid connections. We never see or store your login credentials."],
    ["What if I get audited?", "Annual plan includes audit support — we'll provide documentation for every deduction we found and a CPA will help you respond to the IRS."],
    ["Can I cancel anytime?", "Yes. Cancel from your billing portal in one click. Your data stays accessible for 30 days after cancellation."],
    ["Do you support state taxes?", "Yes. We calculate state income tax for all 50 states based on the address in your tax profile."],
    ["Does it work with TurboTax?", "Yes. Export a CSV that imports directly into TurboTax Self-Employed, plus QuickBooks .QBO and IRS Schedule C PDF."],
    ["What if the AI gets a category wrong?", "Click any transaction to see the AI's reasoning, then re-categorize in one tap. The model learns from your corrections."],
    ["How is this different from QuickBooks?", "We're built specifically for solo freelancers — no double-entry bookkeeping, no chart of accounts. Just deductions, fast."],
    ["Is there a contract?", "No. Monthly is month-to-month, annual is one year. Both can be cancelled anytime."],
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <SectionHeader eyebrow="FAQ" title="Questions, answered." />
      <Accordion type="single" collapsible className="mt-10">
        {faqs.map(([q, a]) => (
          <AccordionItem key={q} value={q}>
            <AccordionTrigger className="text-left text-base font-medium">{q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-semibold">TaxScout</span>
            <span className="text-sm text-muted-foreground">© 2026</span>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Security</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </nav>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          TaxScout is not a CPA firm. The information provided is for educational purposes — consult a tax professional for advice specific to your situation.
        </p>
      </div>
    </footer>
  );
}

function SectionHeader({ eyebrow, title, align = "center" }: { eyebrow: string; title: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <div className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</div>
      <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
    </div>
  );
}
