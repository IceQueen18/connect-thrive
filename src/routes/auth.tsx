import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoFull from "@/assets/logo-full.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — TechBridge Consulting" },
      { name: "description", content: "Sign in to assess your technology needs or propose solutions." },
      { property: "og:title", content: "Sign in — TechBridge Consulting" },
      { property: "og:description", content: "Sign in to assess your technology needs or propose solutions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({ email: z.string().trim().email().max(255), password: z.string().min(8, "Use at least 8 characters").max(72) });

function AuthPage() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => data.user && navigate({ to: "/dashboard" }));
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) return void toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
    setBusy(true);
    if (mode === "up") {
      const { error } = await supabase.auth.signUp({ ...parsed.data, options: { emailRedirectTo: window.location.origin + "/dashboard" } });
      setBusy(false);
      if (error) return void toast.error(error.message);
      setSent(true);
    } else {
      const { error } = await supabase.auth.signInWithPassword(parsed.data);
      setBusy(false);
      if (error) return void toast.error(error.message);
      navigate({ to: "/dashboard" });
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) return void toast.error("Google sign-in failed.");
    if (r.redirected) return;
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-hero p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <a href="/" className="inline-flex w-fit rounded-2xl bg-background p-5 shadow-card">
          <img src={logoFull.url} alt="TechBridge Consulting — Your Bridge to Technology, Impact, and Success. Minneapolis, MN." className="w-56" />
        </a>
        <blockquote className="max-w-md font-display text-3xl leading-snug">
          Clear needs in. Lasting solutions out — with both sides signing off.
        </blockquote>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {sent ? (
            <div>
              <h1 className="text-2xl font-semibold">Check your email</h1>
              <p className="mt-2 text-muted-foreground">We sent a confirmation link to {email}. Open it to finish creating your account.</p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold">{mode === "in" ? "Welcome back" : "Create your account"}</h1>
              <Button variant="outline" className="mt-6 w-full" onClick={google}>Continue with Google</Button>
              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />or<div className="h-px flex-1 bg-border" /></div>
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div className="space-y-1.5"><Label htmlFor="pw">Password</Label><Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <Button type="submit" className="w-full" disabled={busy}>{mode === "in" ? "Sign in" : "Create account"}</Button>
              </form>
              <button className="mt-4 text-sm text-primary hover:underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
                {mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
