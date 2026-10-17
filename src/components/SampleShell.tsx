import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import logoMark from "@/assets/logo-circle-mark.png.asset.json";

export function SampleShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen">
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoMark.url} alt="" aria-hidden="true" className="h-10 w-10 shrink-0" />
          <span className="font-display text-xl font-semibold text-primary">TechBridge Consulting</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm"><Link to="/samples">Sample projects</Link></Button>
          <Button asChild size="sm"><Link to="/auth">Sign in</Link></Button>
        </nav>
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-8">
      <p className="mb-6 border-l-2 border-accent pl-3 text-sm text-muted-foreground">Sample data · Organization names and contacts from your screenshot; technology needs, contractors and outcomes are fictional.</p>
      {children}
    </main>
  </div>;
}