import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/hooks/use-me";
import { stageIndex } from "@/lib/assessment";
import { StageBar } from "@/components/StageBar";
import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — TechBridge Consulting" }, { name: "description", content: "Your assessments, proposals and projects." }] }),
  component: Dashboard,
});

function Dashboard() {
  const { role, user } = useMe();
  if (!role || !user) return null;
  if (role === "business") return <BusinessDash userId={user.id} />;
  return <OrgDash userId={user.id} admin={role === "admin"} />;
}

function OrgDash({ userId, admin }: { userId: string; admin: boolean }) {
  const { data = [], isLoading } = useQuery({
    queryKey: ["assessments", "mine", userId, admin],
    queryFn: async () => {
      let q = supabase.from("org_assessments").select("id, title, org_name, status, readiness_score, created_at, proposals(count), projects(id)").order("created_at", { ascending: true });
      if (!admin) q = q.eq("owner_id", userId);
      const { data } = await q;
      return data ?? [];
    },
  });

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{admin ? "All assessments" : "Your assessment timeline"}</h1>
          <p className="mt-1 text-muted-foreground">Every assessment you submit is added here, oldest to newest.</p>
        </div>
        {!admin && <Button asChild><Link to="/assess/new"><Plus className="h-4 w-4" /> New assessment</Link></Button>}
      </div>

      {isLoading ? <p className="mt-10 text-muted-foreground">Loading…</p> : data.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed p-10 text-center">
          <p className="text-muted-foreground">No assessments yet.</p>
          {!admin && <Button asChild className="mt-4"><Link to="/assess/new">Start your first assessment</Link></Button>}
        </div>
      ) : (
        <ol className="relative mt-10 space-y-8 border-l-2 border-primary/30 pl-8">
          {data.map((a) => {
            const count = (a.proposals as unknown as { count: number }[])[0]?.count ?? 0;
            const project = (a.projects as unknown as { id: string } | { id: string }[] | null);
            const projectId = Array.isArray(project) ? project[0]?.id : project?.id;
            return (
              <li key={a.id} className="relative">
                <span className="absolute -left-[2.6rem] top-5 h-4 w-4 rounded-full border-4 border-background bg-primary" />
                <div className="rounded-lg border bg-card p-5 shadow-card">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })} · {a.org_name}</div>
                      <Link to="/needs/$id" params={{ id: a.id }} className="font-display text-xl font-semibold hover:text-primary">{a.title}</Link>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl text-primary">{a.readiness_score}</div>
                      <div className="text-xs text-muted-foreground">readiness</div>
                    </div>
                  </div>
                  <div className="mt-5"><StageBar index={stageIndex(a.status, count)} /></div>
                  <div className="mt-4 flex gap-4 text-sm">
                    <span className="text-muted-foreground">{count} proposal{count === 1 ? "" : "s"}</span>
                    {projectId && <Link to="/projects/$id" params={{ id: projectId }} className="text-primary hover:underline">Open handoff workspace →</Link>}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function BusinessDash({ userId }: { userId: string }) {
  const { data = [] } = useQuery({
    queryKey: ["proposals", "mine", userId],
    queryFn: async () => {
      const { data } = await supabase.from("proposals").select("id, status, match_score, created_at, assessment_id, org_assessments(title, org_name, projects(id))").eq("business_id", userId).order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Your proposals</h1>
          <p className="mt-1 text-muted-foreground">Track the needs you've competed for.</p>
        </div>
        <Button asChild><Link to="/needs">Browse needs</Link></Button>
      </div>
      <div className="mt-8 space-y-3">
        {data.length === 0 && <p className="text-muted-foreground">No proposals yet — find a need on the board.</p>}
        {data.map((p) => {
          const a = p.org_assessments as unknown as { title: string; org_name: string; projects: { id: string } | { id: string }[] | null };
          const proj = Array.isArray(a?.projects) ? a.projects[0] : a?.projects;
          return (
            <div key={p.id} className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-card">
              <div>
                <Link to="/needs/$id" params={{ id: p.assessment_id }} className="font-semibold hover:text-primary">{a?.title}</Link>
                <div className="text-sm text-muted-foreground">{a?.org_name}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">Fit <b className="text-primary">{p.match_score}</b>/100</span>
                <StatusPill status={p.status} />
                {p.status === "selected" && proj && <Link to="/projects/$id" params={{ id: proj.id }} className="text-sm text-primary hover:underline">Workspace →</Link>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
