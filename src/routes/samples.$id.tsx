import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, Circle } from "lucide-react";
import { sampleAssessments, sampleOrganizations, sampleContractors, rankedSampleProposals, sampleStageLabel } from "@/lib/samples";
import { readinessScore, ORG_SECTIONS, BUSINESS_SECTIONS } from "@/lib/assessment";
import { SampleShell } from "@/components/SampleShell";
import { SampleDocuments } from "@/components/SampleDocuments";
import { CompletionScore } from "@/components/CompletionScore";
import { StatusPill } from "@/components/StatusPill";
import { AnswerSummary } from "@/components/QuestionForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/samples/$id")({
  loader: ({ params }) => {
    const assessment = sampleAssessments.find((a) => a.id === params.id);
    if (!assessment) throw notFound();
    return assessment;
  },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.title ?? "Sample request"} — TechBridge Consulting` },
    { name: "description", content: `Fictional assessment, scored proposals and handoff for ${loaderData?.title ?? "a community technology project"}.` },
    { property: "og:title", content: `${loaderData?.title ?? "Sample request"} — TechBridge Consulting` },
    { property: "og:description", content: "Explore the assessment, independent contractor proposals and sample handoff record." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SampleRequest,
});

function SampleRequest() {
  const a = Route.useLoaderData();
  const org = sampleOrganizations.find((o) => o.id === a.organizationId);
  const proposals = rankedSampleProposals(a);
  const h = a.handoff;
  return <SampleShell>
    <Link to="/samples" className="text-sm text-primary hover:underline">← Sample projects</Link>
    <p className="mt-5 text-sm text-muted-foreground">{org?.name} · {org?.contact} · {a.createdAt.slice(0, 10)}</p>
    <h1 className="mt-2 text-3xl font-semibold">{a.title}</h1>
    <div className="mt-4 flex flex-wrap gap-5 text-sm"><span className="font-medium text-primary">{sampleStageLabel(a)}</span><span>{a.proposals.length} proposals</span></div>
    <CompletionScore readiness={readinessScore(a.answers)} status={a.status} proposalCount={a.proposals.length} />
    <Tabs defaultValue="assessment">
      <TabsList className="h-auto flex-wrap"><TabsTrigger value="assessment">Assessment</TabsTrigger><TabsTrigger value="proposals">Proposals ({proposals.length})</TabsTrigger>{h && <TabsTrigger value="handoff">Handoff</TabsTrigger>}</TabsList>
      <TabsContent value="assessment" className="mt-6 max-w-4xl"><AnswerSummary sections={ORG_SECTIONS} answers={a.answers} /></TabsContent>
      <TabsContent value="proposals" className="mt-6 space-y-4">
        {!proposals.length && <p className="text-muted-foreground">Published October 15; awaiting the first contractor response.</p>}
        {proposals.map((p, i) => <article key={p.id} className="rounded-lg border bg-card p-5 shadow-card">
          <div className="flex flex-wrap items-center gap-4"><span className="font-display text-2xl text-muted-foreground">#{i + 1}</span><div className="min-w-0 flex-1"><h2 className="text-xl font-semibold">{sampleContractors.find((c) => c.id === p.contractorId)?.name}</h2><p className="text-sm text-muted-foreground">Independent contractor · ${Number(p.answers["cost"]).toLocaleString("en-US")} USD · {String(p.answers["weeks"])} weeks</p></div><div className="font-display text-2xl text-primary">{p.score.total}<span className="font-sans text-xs">/100 fit</span></div><StatusPill status={p.status} /></div>
          <p className="mt-4 text-sm">{String(p.answers["summary"])}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-5">{([ ["Coverage", p.score.coverage, 40], ["Budget", p.score.budget, 20], ["Timeline", p.score.timeline, 15], ["Support", p.score.support, 15], ["Training", p.score.training, 10] ] as const).map(([label, value, max]) => <div key={label} className="border-t pt-2"><dt className="text-muted-foreground">{label}</dt><dd className="font-semibold">{value}/{max}</dd></div>)}</dl>
          <details className="mt-5"><summary className="cursor-pointer text-sm font-medium text-primary">Full proposal</summary><div className="mt-4"><AnswerSummary sections={BUSINESS_SECTIONS} answers={p.answers} /></div></details>
        </article>)}
      </TabsContent>
      {h && <TabsContent value="handoff" className="mt-6">
        <div className="grid gap-4 border-y py-5 sm:grid-cols-3"><div><div className="text-sm text-muted-foreground">Checklist complete</div><div className="mt-1 text-xl font-semibold">{h.checklist.filter((c) => c.done).length}/{h.checklist.length}</div></div><div><div className="text-sm text-muted-foreground">Organization confirmation</div><div className="mt-1 font-medium">{h.organizationConfirmedAt ? h.organizationConfirmedAt.slice(0, 10) : "Pending"}</div></div><div><div className="text-sm text-muted-foreground">Contractor confirmation</div><div className="mt-1 font-medium">{h.contractorConfirmedAt ? h.contractorConfirmedAt.slice(0, 10) : "Pending"}</div></div></div>
        {a.status === "completed" && <p className="my-5 flex items-center gap-2 text-success"><CheckCircle2 className="h-5 w-5 shrink-0" />Both parties confirmed their obligations are met.</p>}
        <Tabs defaultValue="checklist" className="mt-6"><TabsList className="h-auto flex-wrap"><TabsTrigger value="checklist">Checklist</TabsTrigger><TabsTrigger value="docs">Implementation docs</TabsTrigger><TabsTrigger value="kb">Knowledge base</TabsTrigger></TabsList>
          <TabsContent value="checklist"><ul className="mt-5 max-w-4xl divide-y">{h.checklist.map((c) => <li key={c.id} className="flex items-start gap-3 py-3 text-sm">{c.done ? <CheckCircle2 aria-label="Complete" className="h-5 w-5 shrink-0 text-success" /> : <Circle aria-label="Pending" className="h-5 w-5 shrink-0 text-muted-foreground" />}<span>{c.text}</span></li>)}</ul></TabsContent>
          <TabsContent value="docs"><SampleDocuments assessmentId={a.id} kind="implementation" /><pre className="mt-5 max-w-4xl whitespace-pre-wrap break-words font-sans text-sm leading-7">{h.implementationDoc}</pre></TabsContent>
          <TabsContent value="kb"><SampleDocuments assessmentId={a.id} kind="knowledge-base" /><pre className="mt-5 max-w-4xl whitespace-pre-wrap break-words font-sans text-sm leading-7">{h.knowledgeBase}</pre></TabsContent>
        </Tabs>
      </TabsContent>}
    </Tabs>
  </SampleShell>;
}