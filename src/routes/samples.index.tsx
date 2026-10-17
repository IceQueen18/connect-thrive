import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Users, ClipboardList, CheckCircle2 } from "lucide-react";
import { sampleAssessments, sampleOrganizations, sampleContractors, sampleStageLabel } from "@/lib/samples";
import { stageIndex, readinessScore, NEED_CATEGORIES } from "@/lib/assessment";
import { SampleShell } from "@/components/SampleShell";
import { StageBar } from "@/components/StageBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/samples/")({
  head: () => ({ meta: [
    { title: "Sample community projects — TechBridge Consulting" },
    { name: "description", content: "Explore five community organizations, six technology assessments, competing independent contractors and documented handoffs." },
    { property: "og:title", content: "Sample community projects — TechBridge Consulting" },
    { property: "og:description", content: "Fictional technology projects from initial publication to confirmed handoff." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Samples,
});

function Samples() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [organization, setOrganization] = useState("all");
  const rows = sampleAssessments.filter((a) => {
    const org = sampleOrganizations.find((o) => o.id === a.organizationId);
    return (organization === "all" || a.organizationId === organization) &&
      (status === "all" || sampleStageLabel(a) === status) &&
      `${a.title} ${org?.name} ${a.answers["problem"]}`.toLowerCase().includes(search.toLowerCase());
  });
  const stats = [
    { label: "Organizations", value: sampleOrganizations.length, icon: Building2 },
    { label: "Assessments", value: sampleAssessments.length, icon: ClipboardList },
    { label: "Independent contractors", value: sampleContractors.length, icon: Users },
    { label: "Confirmed handoffs", value: sampleAssessments.filter((a) => a.status === "completed").length, icon: CheckCircle2 },
  ];
  return <SampleShell>
    <h1 className="text-3xl font-semibold">Community technology projects</h1>
    <div className="my-8 grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((s) => <div key={s.label} className="border-t-2 border-primary pt-4"><s.icon className="mb-2 h-5 w-5 text-primary" /><div className="font-display text-3xl">{s.value}</div><div className="mt-1 text-sm text-muted-foreground">{s.label}</div></div>)}
    </div>
    <Tabs defaultValue="board">
      <TabsList className="h-auto flex-wrap"><TabsTrigger value="board">Needs board</TabsTrigger><TabsTrigger value="timeline">Organization timeline</TabsTrigger><TabsTrigger value="contractors">Contractors</TabsTrigger></TabsList>
      <div className="my-6 grid gap-3 sm:grid-cols-3">
        <Input aria-label="Search sample requests" placeholder="Search requests or organizations…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={organization} onValueChange={setOrganization}><SelectTrigger aria-label="Filter by organization" className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All organizations</SelectItem>{sampleOrganizations.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent></Select>
        <Select value={status} onValueChange={setStatus}><SelectTrigger aria-label="Filter by stage" className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All stages</SelectItem>{["Published", "Proposals in", "Handoff underway", "Awaiting confirmation", "Handoff confirmed"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
      </div>
      <TabsContent value="board">
        <div className="grid gap-4 md:grid-cols-2">
          {[...rows].reverse().map((a) => {
            const org = sampleOrganizations.find((o) => o.id === a.organizationId);
            return <article key={a.id} className="flex flex-col rounded-lg border bg-card p-5 shadow-card">
              <div className="text-sm text-muted-foreground">{org?.name}</div>
              <h2 className="mt-2 text-xl font-semibold"><Link to="/samples/$id" params={{ id: a.id }} className="hover:text-primary">{a.title}</Link></h2>
              <p className="mt-3 text-sm text-muted-foreground">{String(a.answers["problem"])}</p>
              <div className="mt-4 flex flex-wrap gap-2">{(a.answers["categories"] as string[]).map((c) => <span key={c} className="rounded bg-secondary px-2 py-1 text-xs">{NEED_CATEGORIES.find((n) => n.value === c)?.label}</span>)}</div>
              <div className="mt-5 flex flex-wrap justify-between gap-2 text-sm"><span className="font-medium text-primary">{sampleStageLabel(a)}</span><span>{a.proposals.length} proposals · Readiness {readinessScore(a.answers)}/100</span></div>
              <Button asChild variant="outline" className="mt-5 self-start"><Link to="/samples/$id" params={{ id: a.id }}>View request</Link></Button>
            </article>;
          })}
        </div>
        {!rows.length && <p className="py-10 text-muted-foreground">No sample requests match these filters.</p>}
      </TabsContent>
      <TabsContent value="timeline">
        {sampleOrganizations.filter((o) => organization === "all" || organization === o.id).map((o) => <section key={o.id} className="mb-10">
          <h2 className="text-xl font-semibold">{o.name}</h2><p className="mt-1 text-sm text-muted-foreground">{o.contact} · {o.mission}</p>
          <ol className="mt-5 space-y-6 border-l-2 border-primary/30 pl-5">
            {rows.filter((a) => a.organizationId === o.id).map((a) => <li key={a.id} className="relative">
              <span className="absolute -left-[1.7rem] top-1 h-3 w-3 rounded-full bg-primary" />
              <div className="text-xs text-muted-foreground">{a.createdAt.slice(0, 10)}</div>
              <h3 className="mt-1 font-semibold"><Link to="/samples/$id" params={{ id: a.id }} className="hover:text-primary">{a.title}</Link></h3>
              <div className="mt-3 max-w-3xl"><StageBar index={stageIndex(a.status, a.proposals.length)} /></div>
              <div className="mt-3 text-sm text-primary">{sampleStageLabel(a)} · {a.proposals.length} proposals</div>
            </li>)}
          </ol>
        </section>)}
      </TabsContent>
      <TabsContent value="contractors">
        <div className="grid gap-4 md:grid-cols-2">{sampleContractors.map((c) => <article key={c.id} className="rounded-lg border bg-card p-5">
          <h2 className="text-xl font-semibold">{c.name}</h2><p className="mt-1 text-sm text-muted-foreground">Independent contractor · {c.years} years of experience</p><p className="mt-3">{c.specialty}</p>
          <ul className="mt-4 space-y-3">{sampleAssessments.flatMap((a) => a.proposals.filter((p) => p.contractorId === c.id).map((p) => <li key={p.id} className="border-t pt-3 text-sm"><Link to="/samples/$id" params={{ id: a.id }} className="text-primary hover:underline">{a.title}</Link><span className="mt-1 block capitalize text-muted-foreground">{p.status}</span></li>))}</ul>
        </article>)}</div>
      </TabsContent>
    </Tabs>
  </SampleShell>;
}