import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BUDGETS, NEED_CATEGORIES, TIMELINES, type Answers } from "@/lib/assessment";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/needs/")({
  head: () => ({ meta: [{ title: "Needs board — TechBridge Consulting" }, { name: "description", content: "Published technology needs open for proposals." }, { property: "og:title", content: "Needs board — TechBridge Consulting" }, { property: "og:description", content: "Published technology needs open for proposals." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: NeedsBoard,
});

function NeedsBoard() {
  const [cat, setCat] = useState<string | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: ["assessments", "board"],
    queryFn: async () => {
      const { data } = await supabase.from("org_assessments").select("id, title, org_name, answers, readiness_score, status, created_at, proposals(count)").eq("status", "published").order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  const rows = cat ? data.filter((d) => ((d.answers as Answers)["categories"] as string[] | undefined)?.includes(cat)) : data;

  return (
    <div>
      <h1 className="text-3xl font-semibold">Needs board</h1>
      <p className="mt-1 text-muted-foreground">Open requests from organizations and communities. Submit a business assessment to compete.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Chip on={!cat} onClick={() => setCat(null)}>All</Chip>
        {NEED_CATEGORIES.map((c) => <Chip key={c.value} on={cat === c.value} onClick={() => setCat(c.value)}>{c.label}</Chip>)}
      </div>
      {isLoading ? <p className="mt-8 text-muted-foreground">Loading…</p> : rows.length === 0 ? <p className="mt-8 text-muted-foreground">No open needs right now.</p> : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {rows.map((n) => {
            const a = n.answers as Answers;
            const count = (n.proposals as unknown as { count: number }[])[0]?.count ?? 0;
            return (
              <Link key={n.id} to="/needs/$id" params={{ id: n.id }} className="group rounded-lg border bg-card p-5 shadow-card transition-colors hover:border-primary/50">
                <div className="text-xs text-muted-foreground">{n.org_name} · {new Date(n.created_at).toLocaleDateString()}</div>
                <h2 className="mt-1 text-xl font-semibold group-hover:text-primary">{n.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{String(a["problem"] ?? "")}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {((a["categories"] as string[]) ?? []).map((c) => (
                    <span key={c} className="rounded-full bg-secondary px-2 py-0.5 text-xs">{NEED_CATEGORIES.find((x) => x.value === c)?.label}</span>
                  ))}
                </div>
                <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                  <span>Budget: {BUDGETS.find((b) => b.value === a["budget"])?.label}</span>
                  <span>Timeline: {TIMELINES.find((t) => t.value === a["timeline"])?.label}</span>
                  <span className="ml-auto">{count} proposal{count === 1 ? "" : "s"}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={cn("rounded-full border px-3 py-1 text-sm", on ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/50")}>{children}</button>;
}
