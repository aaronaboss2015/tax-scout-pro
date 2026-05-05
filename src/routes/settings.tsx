import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/taxscout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Trash2, ExternalLink } from "lucide-react";
import { USER } from "@/lib/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/settings")({ component: Settings });

function Settings() {
  return (
    <AppShell title="Settings">
      <div className="mx-auto max-w-3xl space-y-6">
        <Card className="p-6">
          <h3 className="font-semibold">Profile</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><Label>Name</Label><Input className="mt-1.5" defaultValue={USER.name} /></div>
            <div><Label>Email</Label><Input className="mt-1.5" defaultValue={USER.email} /></div>
            <div><Label>Profession</Label><Input className="mt-1.5" defaultValue={USER.profession} /></div>
            <div><Label>City / State</Label><Input className="mt-1.5" defaultValue={USER.city} /></div>
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
          <div className="mt-4 space-y-2">
            {["Chase Sapphire", "Amex Business", "Bank of America Checking"].map(n => (
              <div key={n} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3"><CreditCard className="h-4 w-4 text-primary" /><span className="text-sm font-medium">{n}</span></div>
                <Button variant="ghost" size="sm">Disconnect</Button>
              </div>
            ))}
            <Button variant="outline" className="w-full">+ Connect another account</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold">Billing</h3>
          <div className="mt-4 flex items-center justify-between rounded-lg border bg-primary-soft p-4">
            <div>
              <div className="font-semibold">Annual plan</div>
              <div className="text-xs text-muted-foreground">$99/year • Renews Mar 14, 2027</div>
            </div>
            <Button variant="outline">Manage <ExternalLink className="ml-1.5 h-3.5 w-3.5" /></Button>
          </div>
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
