import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Building2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { ConnectBankButton } from "@/components/taxscout/ConnectBankButton";
import { track } from "@/lib/track";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const INCOME_RANGES = [
  { label: "$0 – $25K", estimate: 12500 },
  { label: "$25K – $50K", estimate: 37500 },
  { label: "$50K – $100K", estimate: 75000 },
  { label: "$100K+", estimate: 125000 },
];

function Onboarding() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("designer");
  const [incomePick, setIncomePick] = useState(2);

  const next = async () => {
    if (step === 4) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await supabase.auth.updateUser({ data: { name, profession } });
      if (user) {
        await supabase
          .from("profiles")
          .update({ annual_income: INCOME_RANGES[incomePick].estimate })
          .eq("id", user.id);
      }
      track("onboarding_completed");
      nav({ to: "/dashboard" });
      return;
    }
    setStep(step + 1);
  };

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
          {step === 1 && <Step1 name={name} onNameChange={setName} profession={profession} onProfessionChange={setProfession} />}
          {step === 2 && <Step2 pick={incomePick} onPickChange={setIncomePick} />}
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

function Step1({ name, onNameChange, profession, onProfessionChange }: {
  name: string; onNameChange: (v: string) => void; profession: string; onProfessionChange: (v: string) => void;
}) {
  return (
    <>
      <h2 className="text-2xl font-bold">Tell us about you</h2>
      <p className="mt-1 text-sm text-muted-foreground">We'll personalize your deduction categories.</p>
      <div className="mt-6 space-y-4">
        <div><Label>Full name</Label><Input className="mt-1.5" value={name} onChange={e => onNameChange(e.target.value)} /></div>
        <div>
          <Label>What do you do?</Label>
          <Select value={profession} onValueChange={onProfessionChange}>
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

function Step2({ pick, onPickChange }: { pick: number; onPickChange: (i: number) => void }) {
  return (
    <>
      <h2 className="text-2xl font-bold">Estimated annual income</h2>
      <p className="mt-1 text-sm text-muted-foreground">Used to calculate your tax bracket and quarterly estimates.</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {INCOME_RANGES.map((r, i) => (
          <button key={r.label} onClick={() => onPickChange(i)} className={`rounded-xl border p-4 text-left transition ${pick === i ? "border-primary bg-primary-soft" : "hover:border-primary/40"}`}>
            <div className="text-sm font-semibold">{r.label}</div>
          </button>
        ))}
      </div>
    </>
  );
}

function Step3() {
  const [connected, setConnected] = useState(false);
  return (
    <>
      <h2 className="text-2xl font-bold">Connect your accounts</h2>
      <p className="mt-1 text-sm text-muted-foreground">Read-only access via Plaid. We never store your credentials. You can skip this and add expenses manually instead.</p>
      <div className="mt-6">
        {connected ? (
          <div className="flex items-center gap-3 rounded-xl border-2 border-primary bg-primary-soft p-6">
            <Building2 className="h-8 w-8 text-primary" />
            <div className="font-semibold">Bank connected — importing your transactions.</div>
          </div>
        ) : (
          <ConnectBankButton onConnected={() => setConnected(true)} />
        )}
      </div>
    </>
  );
}

function Step4() {
  return (
    <>
      <h2 className="text-2xl font-bold">Track income too (optional)</h2>
      <p className="mt-1 text-sm text-muted-foreground">Payment app sync isn't available yet.</p>
      <div className="mt-6 space-y-2">
        {[
          { n: "Stripe", d: "For client invoicing" },
          { n: "PayPal", d: "Personal & business" },
          { n: "Venmo", d: "Business profile" },
        ].map(x => (
          <div key={x.n} className="flex w-full items-center gap-4 rounded-lg border p-4 opacity-60">
            <Wallet className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <div className="text-sm font-semibold">{x.n}</div>
              <div className="text-xs text-muted-foreground">{x.d}</div>
            </div>
            <span className="text-xs font-medium text-muted-foreground">Coming soon</span>
          </div>
        ))}
      </div>
    </>
  );
}
