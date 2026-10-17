import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/hooks/use-me";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, role, isLoading } = useMe();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!isLoading && user && !role && path !== "/onboarding") navigate({ to: "/onboarding" });
  }, [isLoading, user, role, path, navigate]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const linkCls = "rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground";
  const active = { className: "rounded-md px-3 py-1.5 text-sm bg-secondary text-foreground font-medium" };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Link to="/" className="font-display text-lg font-semibold text-primary">Bridgework</Link>
          {role && (
            <nav className="flex items-center gap-1">
              <Link to="/dashboard" className={linkCls} activeProps={active}>Dashboard</Link>
              <Link to="/needs" className={linkCls} activeProps={active} activeOptions={{ exact: true }}>Needs board</Link>
              {role === "organization" && (
                <Link to="/assess/new" className={linkCls} activeProps={active}>New assessment</Link>
              )}
            </nav>
          )}
          <div className="ml-auto flex items-center gap-3">
            {role && <span className="hidden rounded-full bg-secondary px-2.5 py-0.5 text-xs capitalize text-secondary-foreground sm:inline">{role}</span>}
            <span className="hidden text-sm text-muted-foreground md:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="h-4 w-4" /> Sign out</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
