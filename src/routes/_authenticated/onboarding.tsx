import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Building2, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/hooks/use-me";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [{ title: "Choose your account type — Bridgework" }, { name: "description", content: "Tell us whether you're an organization or a solution provider." }] }),
  component: Onboarding,
});

function Onboarding() {
  const { user, role } = useMe();
  const [pick, setPick] = useState<"organization" | "business" | null>(null);
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate();

  if (role) {
    navigate({ to: "/dashboard" });
    return null;
  }

  async function save() {
    if (!pick || !user) return;
    setBusy(true);
    const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: pick });
    setBusy(false);
    if (error) return toast.error("Could not save your account type.");
    await qc.invalidateQueries({ queryKey: ["me"] });
    navigate({ to: pick === "organization" ? "/assess/new" : "/needs" });
  }

  const opts = [
    { v: "organization" as const, icon: Building2, t: "Organization or community", d: "Assess your technology needs and receive proposals from providers." },
    { v: "business" as const, icon: Briefcase, t: "Business or contractor", d: "Browse published needs and compete with a solution proposal." },
  ];

  return (
    <div className="mx-auto max-w-2xl py-10">
      <h1 className="text-3xl font-semibold">How will you use Bridgework?</h1>
      <p className="mt-2 text-muted-foreground">This can't be changed later, so pick the one that fits.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {opts.map((o) => (
          <button key={o.v} onClick={() => setPick(o.v)}
            className={cn("rounded-lg border bg-card p-5 text-left shadow-card transition-colors", pick === o.v ? "border-primary ring-2 ring-primary/30" : "hover:border-primary/50")}>
            <o.icon className="h-6 w-6 text-primary" />
            <div className="mt-3 font-semibold">{o.t}</div>
            <p className="mt-1 text-sm text-muted-foreground">{o.d}</p>
          </button>
        ))}
      </div>
      <Button className="mt-6" size="lg" disabled={!pick || busy} onClick={save}>Continue</Button>
    </div>
  );
}
