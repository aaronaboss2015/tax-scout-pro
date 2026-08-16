import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/taxscout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Trash2, Building2, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase, authedFetch } from "@/lib/supabase";
import { useProfile, buildCheckoutUrl } from "@/lib/data";
import { STATE_CODES, STATE_TAX_RATES } from "@/lib/stateTax";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConnectBankButton } from "@/components/taxscout/ConnectBankButton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/settings")({ component: Settings });

interface Institution {
  id: string;
  institution_name: string | null;
  created_at: string;
}

function Settings() {
  const { user } = useAuth();
  const nav = useNavigate();
  const { profile, loading: profileLoading, refresh: refreshProfile } = useProfile();
  const [taxState, setTaxState] = useState("");
  const [taxStateSeeded, setTaxStateSeeded] = useState(false);
  const [savingTaxProfile, setSavingTaxProfile] = useState(false);
  const [taxProfileSaved, setTaxProfileSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!profileLoading && !taxStateSeeded) {
      setTaxState(profile?.state ?? "");
      setTaxStateSeeded(true);
    }
  }, [profileLoading, taxStateSeeded, profile]);

  async function handleSaveTaxProfile() {
    if (!user) return;
    setSavingTaxProfile(true);
    setTaxProfileSaved(false);
    await supabase.from("profiles").update({ state: taxState || null }).eq("id", user.id);
    await refreshProfile();
    setSavingTaxProfile(false);
    setTaxProfileSaved(true);
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    const res = await authedFetch("/api/delete-account", { method: "POST" });
    if (res.ok) {
      await supabase.auth.signOut();
      nav({ to: "/" });
    } else {
      setDeleting(false);
    }
  }
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);

  async function handleDisconnect(institutionId: string) {
    setDisconnectingId(institutionId);
    const res = await authedFetch("/api/plaid/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ institution_id: institutionId }),
    });
    if (res.ok) {
      setInstitutions((prev) => prev.filter((i) => i.id !== institutionId));
    }
    setDisconnectingId(null);
  }

  const refreshInstitutions = useCallback(async () => {
    const res = await authedFetch("/api/plaid/institutions");
    if (res.ok) {
      const data = (await res.json()) as { institutions: Institution[] };
      setInstitutions(data.institutions);
    }
  }, []);

  useEffect(() => {
    refreshInstitutions();
  }, [refreshInstitutions]);

  async function handleSyncNow() {
    setSyncing(true);
    setSyncMessage(null);
    const res = await authedFetch("/api/plaid/sync", { method: "POST" });
    if (res.ok) {
      const data = (await res.json()) as { imported: number };
      setSyncMessage(`Imported ${data.imported} new transaction${data.imported === 1 ? "" : "s"}.`);
    } else {
      setSyncMessage("Sync failed.");
    }
    setSyncing(false);
  }
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
          <p className="mt-1 text-xs text-muted-foreground">Used to default your state in the quarterly tax estimator.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <Label>State</Label>
              <Select value={taxState || undefined} onValueChange={setTaxState}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select a state" /></SelectTrigger>
                <SelectContent>
                  {STATE_CODES.map(code => (
                    <SelectItem key={code} value={code}>{STATE_TAX_RATES[code].name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={handleSaveTaxProfile} disabled={savingTaxProfile} variant="outline">
              {savingTaxProfile ? "Saving…" : "Save"}
            </Button>
            {taxProfileSaved && <span className="text-sm text-muted-foreground">Saved.</span>}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold">Linked accounts</h3>
          <p className="mt-1 text-xs text-muted-foreground">Connect a bank to automatically import transactions.</p>
          {institutions.length > 0 && (
            <div className="mt-4 space-y-2">
              {institutions.map((inst) => (
                <div key={inst.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-sm font-medium">{inst.institution_name ?? "Connected bank"}</div>
                      <div className="text-xs text-muted-foreground">
                        Connected {new Date(inst.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleDisconnect(inst.id)}
                    disabled={disconnectingId === inst.id}
                  >
                    {disconnectingId === inst.id ? "Disconnecting…" : "Disconnect"}
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleSyncNow} disabled={syncing}>
                <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing…" : "Sync now"}
              </Button>
              {syncMessage && <p className="text-xs text-muted-foreground">{syncMessage}</p>}
            </div>
          )}
          <div className="mt-4">
            <ConnectBankButton onConnected={refreshInstitutions} />
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
          <p className="mt-1 text-xs text-muted-foreground">Not available yet — we don't send any emails or push notifications currently.</p>
          <div className="mt-4 space-y-3">
            {["Quarterly tax reminders", "New deductions found weekly", "Subscription auto-detected", "Product updates"].map(n => (
              <div key={n} className="flex items-center justify-between opacity-60"><span className="text-sm">{n}</span><Switch disabled /></div>
            ))}
          </div>
        </Card>

        <Card className="border-destructive/30 p-6">
          <h3 className="font-semibold text-destructive">Danger zone</h3>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Delete account</div>
              <div className="text-xs text-muted-foreground">Immediately and permanently deletes your account and all data. This cannot be undone.</div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                  <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently deletes your account, all transactions, and all linked bank connections. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? "Deleting…" : "Delete my account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
