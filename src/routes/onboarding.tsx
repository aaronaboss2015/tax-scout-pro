import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Check, Building2, CreditCard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

function Onboarding() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const next = () => (step === 4 ? nav({ to: "/dashboard" }) : setStep(step + 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft via-background to-background p-6">
      <div className="mx-auto max-w-2xl pt-10">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></div>
          <span className="font-bold">TaxScout</span>
        </div>
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>Step {step} of 4</span><span>{Math.round((step / 4) * 100)}% complete</span>
        </div>
        <Progress value={(step / 4) * 100} className="mb-8 h-2" />
        <Card className="p-8">
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
          <div className="mt-8 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>Back</Button>
            <Button onClick={next} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {step === 4 ? "Go to dashboard" : "Continue"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Step1() {
  return (
    <>
      <h2 className="text-2xl font-bold">Tell us about you</h2>
      <p className="mt-1 text-sm text-muted-foreground">We'll personalize your deduction categories.</p>
      <div className="mt-6 space-y-4">
        <div><Label>Full name</Label><Input className="mt-1.5" defaultValue="Jordan Reyes" /></div>
        <div>
          <Label>What do you do?</Label>
          <Select defaultValue="designer">
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["designer","developer","consultant","coach","writer","photographer","real-estate","other"].map(v => (
                <SelectItem key={v} value={v}>{v.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}

function Step2() {
  const ranges = ["$0 – $25K", "$25K – $50K", "$50K – $100K", "$100K+"];
  const [pick, setPick] = useState(2);
  return (
    <>
      <h2 className="text-2xl font-bold">Estimated annual income</h2>
      <p className="mt-1 text-sm text-muted-foreground">Used to calculate your tax bracket and quarterly estimates.</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {ranges.map((r, i) => (
          <button key={r} onClick={() => setPick(i)} className={`rounded-xl border p-4 text-left transition ${pick === i ? "border-primary bg-primary-soft" : "hover:border-primary/40"}`}>
            <div className="text-sm font-semibold">{r}</div>
          </button>
        ))}
      </div>
    </>
  );
}

function Step3() {
  const [linked, setLinked] = useState(false);
  return (
    <>
      <h2 className="text-2xl font-bold">Connect your accounts</h2>
      <p className="mt-1 text-sm text-muted-foreground">Read-only access via Plaid. We never store your credentials.</p>
      {!linked ? (
        <button onClick={() => setLinked(true)} className="mt-6 flex w-full items-center gap-4 rounded-xl border-2 border-dashed border-primary/40 bg-primary-soft p-6 text-left transition hover:bg-accent">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <div className="font-semibold">Connect bank or credit card</div>
            <div className="text-xs text-muted-foreground">Plaid securely links 12,000+ institutions</div>
          </div>
        </button>
      ) : (
        <div className="mt-6 space-y-2">
          {["Chase Sapphire", "Amex Business", "Bank of America Checking"].map(n => (
            <div key={n} className="flex items-center justify-between rounded-lg border bg-card p-3">
              <div className="flex items-center gap-3"><CreditCard className="h-5 w-5 text-primary" /><span className="text-sm font-medium">{n}</span></div>
              <span className="flex items-center gap-1 text-xs font-medium text-primary"><Check className="h-3.5 w-3.5" /> Connected</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Step4() {
  return (
    <>
      <h2 className="text-2xl font-bold">Track income too (optional)</h2>
      <p className="mt-1 text-sm text-muted-foreground">Connect payment apps to estimate quarterly taxes accurately.</p>
      <div className="mt-6 space-y-2">
        {[
          { n: "Stripe", d: "For client invoicing" },
          { n: "PayPal", d: "Personal & business" },
          { n: "Venmo", d: "Business profile" },
        ].map(x => (
          <button key={x.n} className="flex w-full items-center gap-4 rounded-lg border p-4 text-left hover:border-primary/40">
            <Wallet className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="text-sm font-semibold">{x.n}</div>
              <div className="text-xs text-muted-foreground">{x.d}</div>
            </div>
            <span className="text-xs font-medium text-primary">Connect</span>
          </button>
        ))}
      </div>
    </>
  );
}
