import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/hooks/use-me";
import { BUSINESS_SECTIONS, ORG_SECTIONS, missingRequired, stageIndex, type Answers, type MatchBreakdown } from "@/lib/assessment";
import { defaultChecklist, DOC_TEMPLATE, KB_TEMPLATE } from "@/lib/handoff";
import { submitProposal } from "@/lib/proposals.functions";
import { AnswerSummary, SectionFields } from "@/components/QuestionForm";
import { StageBar } from "@/components/StageBar";
import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/needs/$id")({
  head: () => ({ meta: [{ title: "Need details — TechBridge Consulting" }, { name: "description", content: "Organization tech assessment and competing proposals." }] }),
  component: NeedPage,
});

function NeedPage() {
  const { id } = Route.useParams();
  const { user, role } = useMe();
  const need = useQuery({
    queryKey: ["assessment", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("org_assessments").select("*, projects(id)").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });
  const proposals = useQuery({
    queryKey: ["proposals", id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("proposals").select("*").eq("assessment_id", id).order("match_score", { ascending: false });
      return data ?? [];
    },
  });

  if (need.isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!need.data) return <p>Need not found.</p>;
  const n = need.data;
  const isOwner = user?.id === n.owner_id || role === "admin";
  const list = proposals.data ?? [];
  const mine = list.find((p) => p.business_id === user?.id);
  const proj = Array.isArray(n.projects) ? n.projects[0] : (n.projects as { id: string } | null);

  return (
    <div>
      <div className="text-sm text-muted-foreground">{n.org_name}</div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-semibold">{n.title}</h1>
        <div className="text-right"><span className="font-display text-3xl text-primary">{n.readiness_score}</span><span className="text-sm text-muted-foreground"> /100 readiness</span></div>
      </div>
      <div className="mt-6 max-w-3xl"><StageBar index={stageIndex(n.status, isOwner ? list.length : 1)} /></div>
      {proj && (isOwner || mine?.status === "selected") && (
        <Button asChild className="mt-6"><Link to="/projects/$id" params={{ id: proj.id }}>Open handoff workspace</Link></Button>
      )}

      <Tabs defaultValue={isOwner ? "proposals" : "need"} className="mt-8">
        <TabsList>
          <TabsTrigger value="need">Assessment</TabsTrigger>
          {isOwner && <TabsTrigger value="proposals">Proposals ({list.length})</TabsTrigger>}
          {role === "business" && <TabsTrigger value="propose">{mine ? "Your proposal" : "Submit a proposal"}</TabsTrigger>}
        </TabsList>
        <TabsContent value="need" className="mt-6"><AnswerSummary sections={ORG_SECTIONS} answers={n.answers as Answers} /></TabsContent>
        {isOwner && (
          <TabsContent value="proposals" className="mt-6">
            <ProposalList needId={id} need={n} proposals={list} locked={n.status !== "published"} />
          </TabsContent>
        )}
        {role === "business" && (
          <TabsContent value="propose" className="mt-6">
            {mine ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3"><StatusPill status={mine.status} /><span>Fit score <b className="text-primary">{mine.match_score}</b>/100</span></div>
                <AnswerSummary sections={BUSINESS_SECTIONS} answers={mine.answers as Answers} />
              </div>
            ) : n.status !== "published" ? (
              <p className="text-muted-foreground">This need is no longer accepting proposals.</p>
            ) : (
              <ProposalForm needId={id} />
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

type Need = { id: string; owner_id: string; answers: unknown };
type Proposal = { id: string; business_id: string; business_name: string; answers: unknown; match_score: number; score_breakdown: unknown; status: string };

function ProposalList({ needId, need, proposals, locked }: { needId: string; need: Need; proposals: Proposal[]; locked: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate();

  async function select(p: Proposal) {
    if (!confirm(`Select ${p.business_name}? Other proposals will be declined.`)) return;
    setBusy(true);
    const { data: project, error } = await supabase.from("projects").insert({
      assessment_id: needId, proposal_id: p.id, org_owner_id: need.owner_id, business_id: p.business_id,
      implementation_doc: DOC_TEMPLATE, knowledge_base: KB_TEMPLATE,
      checklist: defaultChecklist(need.answers as Answers) as unknown as never,
    }).select("id").single();
    if (error || !project) { setBusy(false); return void toast.error("Could not start the project."); }
    await supabase.from("proposals").update({ status: "selected" }).eq("id", p.id);
    await supabase.from("proposals").update({ status: "declined" }).eq("assessment_id", needId).neq("id", p.id);
    await supabase.from("org_assessments").update({ status: "in_progress" }).eq("id", needId);
    await qc.invalidateQueries();
    setBusy(false);
    navigate({ to: "/projects/$id", params: { id: project.id } });
  }

  if (!proposals.length) return <p className="text-muted-foreground">No proposals yet. Businesses will see this need on the board.</p>;
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Ranked automatically by fit. You make the final choice.</p>
      {proposals.map((p, i) => {
        const b = p.score_breakdown as MatchBreakdown;
        const a = p.answers as Answers;
        return (
          <div key={p.id} className="rounded-lg border bg-card p-5 shadow-card">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-display text-2xl text-muted-foreground">#{i + 1}</span>
              <div className="flex-1">
                <div className="font-semibold">{p.business_name}</div>
                <div className="text-sm text-muted-foreground">${Number(a["cost"] ?? 0).toLocaleString()} · {String(a["weeks"])} weeks</div>
              </div>
              <div className="text-right"><div className="font-display text-2xl text-primary">{p.match_score}</div><div className="text-xs text-muted-foreground">fit score</div></div>
              <StatusPill status={p.status} />
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
              {([["Coverage", b.coverage, 40], ["Budget", b.budget, 20], ["Timeline", b.timeline, 15], ["Support", b.support, 15], ["Training", b.training, 10]] as const).map(([l, v, m]) => (
                <div key={l} className="rounded-md bg-muted p-2"><div className="font-semibold">{v}/{m}</div><div className="text-muted-foreground">{l}</div></div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(open === p.id ? null : p.id)}>{open === p.id ? "Hide details" : "View full proposal"}</Button>
              {!locked && <Button size="sm" disabled={busy} onClick={() => select(p)}>Select this provider</Button>}
            </div>
            {open === p.id && <div className="mt-5"><AnswerSummary sections={BUSINESS_SECTIONS} answers={a} /></div>}
          </div>
        );
      })}
    </div>
  );
}

function ProposalForm({ needId }: { needId: string }) {
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<Answers>({});
  const [missing, setMissing] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const submit = useServerFn(submitProposal);
  const qc = useQueryClient();

  async function go() {
    const m = missingRequired(BUSINESS_SECTIONS, answers);
    setMissing(m);
    if (!name.trim() || m.length) return void toast.error("Please complete all required questions.");
    setBusy(true);
    try {
      const clean = Object.fromEntries(Object.entries(answers).filter(([, v]) => v !== undefined)) as Record<string, string | number | string[]>;
      const r = await submit({ data: { assessmentId: needId, businessName: name.trim(), answers: clean } });
      toast.success(`Proposal submitted — fit score ${r.score}/100`);
      await qc.invalidateQueries({ queryKey: ["proposals"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not submit.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div className="space-y-1.5"><Label>Business or contractor name *</Label><Input value={name} maxLength={150} onChange={(e) => setName(e.target.value)} /></div>
      {BUSINESS_SECTIONS.map((s) => (
        <div key={s.id} className="rounded-lg border bg-card p-6 shadow-card">
          <h2 className="text-2xl font-semibold">{s.title}</h2>
          <p className="mb-6 mt-1 text-muted-foreground">{s.intro}</p>
          <SectionFields section={s} answers={answers} missing={missing} onChange={(id, v) => setAnswers((a) => ({ ...a, [id]: v }))} />
        </div>
      ))}
      <Button size="lg" onClick={go} disabled={busy}>Submit proposal</Button>
    </div>
  );
}
