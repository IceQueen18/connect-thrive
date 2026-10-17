import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/hooks/use-me";
import { ORG_SECTIONS, missingRequired, readinessScore, type Answers } from "@/lib/assessment";
import { SectionFields } from "@/components/QuestionForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/assess/new")({
  head: () => ({ meta: [{ title: "New tech assessment — Bridgework" }, { name: "description", content: "Describe your organization's technology request, current setup and in-house knowledge." }] }),
  component: NewAssessment,
});

function NewAssessment() {
  const { user, role } = useMe();
  const [step, setStep] = useState(0);
  const [orgName, setOrgName] = useState("");
  const [title, setTitle] = useState("");
  const [answers, setAnswers] = useState<Answers>({});
  const [missing, setMissing] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();

  if (role && role !== "organization") return <p className="text-muted-foreground">Only organization accounts can create assessments.</p>;

  const section = ORG_SECTIONS[step];
  const last = step === ORG_SECTIONS.length - 1;

  function next() {
    const m = missingRequired([section], answers);
    if (step === 0 && (!orgName.trim() || !title.trim())) return toast.error("Add your organization name and a short title.");
    setMissing(m);
    if (m.length) return toast.error("Please answer the required questions.");
    if (!last) { setStep(step + 1); window.scrollTo({ top: 0 }); return; }
    publish();
  }

  async function publish() {
    if (!user) return;
    setBusy(true);
    const { data, error } = await supabase.from("org_assessments").insert({
      owner_id: user.id, org_name: orgName.trim().slice(0, 150), title: title.trim().slice(0, 150),
      answers, readiness_score: readinessScore(answers), status: "published",
    }).select("id").single();
    setBusy(false);
    if (error || !data) return toast.error("Could not publish the assessment.");
    await qc.invalidateQueries({ queryKey: ["assessments"] });
    toast.success("Assessment published to the needs board.");
    navigate({ to: "/needs/$id", params: { id: data.id } });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold">Technology needs assessment</h1>
      <div className="mt-6 flex gap-2">
        {ORG_SECTIONS.map((s, i) => (
          <div key={s.id} className="flex-1">
            <div className={cn("h-1.5 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />
            <div className={cn("mt-1.5 text-xs", i === step ? "font-medium" : "text-muted-foreground")}>{i + 1}. {s.title}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-lg border bg-card p-6 shadow-card">
        <h2 className="text-2xl font-semibold">{section.title}</h2>
        <p className="mt-1 text-muted-foreground">{section.intro}</p>
        {step === 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Organization or community name *</Label><Input value={orgName} maxLength={150} onChange={(e) => setOrgName(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Short title for this need *</Label><Input value={title} maxLength={150} placeholder="e.g. Volunteer sign-up website" onChange={(e) => setTitle(e.target.value)} /></div>
          </div>
        )}
        <div className="mt-7">
          <SectionFields section={section} answers={answers} missing={missing} onChange={(id, v) => setAnswers((a) => ({ ...a, [id]: v }))} />
        </div>
      </div>
      <div className="mt-6 flex justify-between">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
        <Button onClick={next} disabled={busy}>{last ? "Publish to needs board" : "Continue"}</Button>
      </div>
    </div>
  );
}
