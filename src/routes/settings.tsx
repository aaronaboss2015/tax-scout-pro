import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/taxscout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useProfile, buildCheckoutUrl } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/settings")({ component: Settings });

function Settings() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [name, setName] = useState((user?.user_metadata?.name as string | undefined) ?? "");
  const [profession, setProfession] = useState((user?.user_metadata?.profession as string | undefined) ?? "");
  const [city, setCity] = useState((user?.user_metadata?.city as string | undefined) ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSaveProfile() {
    setSaving(true);
    setSaved(false);
    await supabase.auth.updateUser({ data: { name, profession, city } });
    setSaving(false);
    setSaved(true);
  }

  return (
    <AppShell title="Settings">
      <div className="mx-auto max-w-3xl space-y-6">
        <Card className="p-6">
          <h3 className="font-semibold">Profile</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><Label>Name</Label><Input className="mt-1.5" value={name} onChange={e => setName(e.target.value)} /></div>
            <div><Label>Email</Label><Input className="mt-1.5" value={user?.email ?? ""} disabled /></div>
            <div><Label>Profession</Label><Input className="mt-1.5" value={profession} onChange={e => setProfession(e.target.value)} /></div>
            <div><Label>City / State</Label><Input className="mt-1.5" value={city} onChange={e => setCity(e.target.value)} /></div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={handleSaveProfile} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {saving ? "Saving…" : "Save profile"}
            </Button>
            {saved && <span className="text-sm text-muted-foreground">Saved.</span>}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold">Tax profile</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <Label>Filing status</Label>
              <Select defaultValue="single"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{["single", "married", "hoh"].map(s => <SelectItem key={s} value={s}>{s.toUpperCase()}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>State</Label>
              <Select defaultValue="ny"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{["ny","ca","tx","fl","wa"].map(s => <SelectItem key={s} value={s}>{s.toUpperCase()}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Dependents</Label><Input className="mt-1.5" type="number" defaultValue={0} /></div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold">Linked accounts</h3>
          <p className="mt-1 text-xs text-muted-foreground">Bank sync isn't set up yet — add transactions manually for now.</p>
          <div className="mt-4">
            <Button variant="outline" className="w-full" disabled>+ Connect a bank account (coming soon)</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold">Billing</h3>
          {profileLoading ? (
            <div className="mt-4 text-sm text-muted-foreground">Loading…</div>
          ) : profile?.subscription_status === "active" || profile?.subscription_status === "trialing" ? (
            <div className="mt-4 flex items-center justify-between rounded-lg border bg-primary-soft p-4">
              <div>
                <div className="font-semibold capitalize">{profile.subscription_plan ?? "Active"} plan</div>
                <div className="text-xs text-muted-foreground">
                  {profile.current_period_end
                    ? `Renews ${new Date(profile.current_period_end).toLocaleDateString()}`
                    : "Active subscription"}
                </div>
              </div>
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
          ) : (
            <>
              <div className="mt-4 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="font-semibold">
                    {profile?.subscription_status ? `Subscription ${profile.subscription_status}` : "No active subscription"}
                  </div>
                  <div className="text-xs text-muted-foreground">Choose a plan to unlock automatic categorization.</div>
                </div>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              {user && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a href={buildCheckoutUrl("monthly", user.id, user.email)}>
                    <Button variant="outline" className="w-full">Monthly — $19/mo</Button>
                  </a>
                  <a href={buildCheckoutUrl("annual", user.id, user.email)}>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Annual — $99/yr</Button>
                  </a>
                </div>
              )}
            </>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold">Notifications</h3>
          <div className="mt-4 space-y-3">
            {["Quarterly tax reminders", "New deductions found weekly", "Subscription auto-detected", "Product updates"].map(n => (
              <div key={n} className="flex items-center justify-between"><span className="text-sm">{n}</span><Switch defaultChecked /></div>
            ))}
          </div>
        </Card>

        <Card className="border-destructive/30 p-6">
          <h3 className="font-semibold text-destructive">Danger zone</h3>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Delete account</div>
              <div className="text-xs text-muted-foreground">All data is permanently erased after 30 days.</div>
            </div>
            <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10"><Trash2 className="mr-1.5 h-4 w-4" /> Delete</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
