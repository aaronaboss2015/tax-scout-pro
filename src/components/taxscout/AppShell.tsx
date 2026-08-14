import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard, Receipt, Tags, Calculator, FileDown,
  Repeat, Settings, Sparkles, Search, ChevronDown, LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/quarterly", label: "Quarterly", icon: Calculator },
  { to: "/export", label: "Export", icon: FileDown },
  { to: "/subscriptions", label: "Subscriptions", icon: Repeat },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children, title }: { children: React.ReactNode; title?: string }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const nav = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      nav({ to: "/login" });
    }
  }, [loading, user, nav]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  const email = user.email ?? "";
  const name = (user.user_metadata?.name as string | undefined) ?? email.split("@")[0] ?? "Account";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleSignOut() {
    await supabase.auth.signOut();
    nav({ to: "/" });
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden w-60 flex-shrink-0 flex-col border-r bg-sidebar md:flex">
        <Link to="/dashboard" className="flex h-16 items-center gap-2 border-b px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></div>
          <span className="font-bold">TaxScout</span>
        </Link>
        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = path === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                  active ? "bg-primary-soft text-primary" : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                {active && <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary" />}
                <Icon className="h-4 w-4" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-sidebar-accent">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{initials}</div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{name}</div>
                <div className="truncate text-xs text-muted-foreground">{email}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" /> Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transactions…"
                aria-label="Search transactions"
                className="h-9 w-72 pl-9"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const q = e.currentTarget.value.trim();
                    nav({ to: "/transactions", search: q ? { q } : undefined });
                  }
                }}
              />
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 pb-24 md:pb-6">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t bg-background md:hidden">
          {NAV.slice(0, 5).map(({ to, label, icon: Icon }) => {
            const active = path === to;
            return (
              <Link key={to} to={to} className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                <Icon className="h-5 w-5" /> {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
