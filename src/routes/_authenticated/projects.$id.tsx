import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/hooks/use-me";
import type { ChecklistItem } from "@/lib/handoff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/projects/$id")({
  head: () => ({ meta: [{ title: "Handoff workspace — TechBridge Consulting" }, { name: "description", content: "Implementation documentation, handoff checklist and knowledge base." }] }),
  component: ProjectPage,
});

function ProjectPage() {
  const { id } = Route.useParams();
  const { user } = useMe();
  const qc = useQueryClient();
  const { data: p, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*, org_assessments(title, org_name), proposals(business_name)").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });
  const [doc, setDoc] = useState("");
  const [kb, setKb] = useState("");
  const [list, setList] = useState<ChecklistItem[]>([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    if (!p) return;
    setDoc(p.implementation_doc);
    setKb(p.knowledge_base);
    setList(p.checklist as unknown as ChecklistItem[]);
  }, [p]);

  if (isLoading || !p) return <p className="text-muted-foreground">Loading…</p>;
  const isOrg = user?.id === p.org_owner_id;
  const isBiz = user?.id === p.business_id;
  const canEdit = isOrg || isBiz;
  const need = p.org_assessments as unknown as { title: string; org_name: string };
  const biz = p.proposals as unknown as { business_name: string };
  const done = list.filter((c) => c.done).length;
  const complete = !!(p.org_confirmed_at && p.business_confirmed_at);
  const allChecked = list.length > 0 && done === list.length;

  async function save(patch: Record<string, unknown>, msg?: string) {
    const { error } = await supabase.from("projects").update(patch as never).eq("id", id);
    if (error) return void toast.error("Could not save.");
    if (msg) toast.success(msg);
    await qc.invalidateQueries({ queryKey: ["project", id] });
    await qc.invalidateQueries({ queryKey: ["assessments"] });
  }

  const setChecklist = (next: ChecklistItem[]) => { setList(next); save({ checklist: next }); };

  async function confirm() {
    if (!allChecked) return void toast.error("Every checklist item must be complete before confirming.");
    await save(isOrg ? { org_confirmed_at: new Date().toISOString() } : { business_confirmed_at: new Date().toISOString() }, "Your confirmation is recorded.");
  }

  return (
    <div>
      <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">← Dashboard</Link>
      <h1 className="mt-2 text-3xl font-semibold">{need.title}</h1>
      <p className="text-muted-foreground">{need.org_name} × {biz.business_name}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Checklist" value={`${done}/${list.length}`} />
        <Confirm label={`${need.org_name} confirmed`} at={p.org_confirmed_at} />
        <Confirm label={`${biz.business_name} confirmed`} at={p.business_confirmed_at} />
      </div>
      {complete && (
        <div className="mt-4 rounded-lg border border-success bg-success/10 p-4 text-sm">
          <b>Handoff complete.</b> Both parties confirmed their obligations are met. The knowledge base below is the final record.
        </div>
      )}
      <p className="mt-3 text-xs text-muted-foreground">Editing any document or checklist item clears both confirmations so the final version is always what was agreed.</p>

      <Tabs defaultValue="checklist" className="mt-8">
        <TabsList>
          <TabsTrigger value="checklist">Handoff checklist</TabsTrigger>
          <TabsTrigger value="doc">Implementation docs</TabsTrigger>
          <TabsTrigger value="kb">Knowledge base</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="mt-6 max-w-3xl">
          <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-progress" style={{ width: `${list.length ? (done / list.length) * 100 : 0}%` }} /></div>
          <ul className="mt-5 space-y-2">
            {list.map((c) => (
              <li key={c.id} className="flex items-center gap-3 rounded-md border bg-card p-3">
                <Checkbox checked={c.done} disabled={!canEdit} onCheckedChange={(v) => setChecklist(list.map((x) => (x.id === c.id ? { ...x, done: !!v } : x)))} />
                <span className={c.done ? "flex-1 text-muted-foreground line-through" : "flex-1"}>{c.text}</span>
                {canEdit && <button aria-label="Remove item" onClick={() => setChecklist(list.filter((x) => x.id !== c.id))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>}
              </li>
            ))}
          </ul>
          {canEdit && (
            <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!newItem.trim()) return; setChecklist([...list, { id: crypto.randomUUID(), text: newItem.trim().slice(0, 300), done: false }]); setNewItem(""); }}>
              <Input placeholder="Add a checklist item" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
              <Button type="submit" variant="outline"><Plus className="h-4 w-4" /> Add</Button>
            </form>
          )}
        </TabsContent>

        <TabsContent value="doc" className="mt-6 max-w-3xl">
          <p className="mb-3 text-sm text-muted-foreground">Written by the provider: how the solution was built and configured.</p>
          <Textarea rows={18} value={doc} disabled={!canEdit} onChange={(e) => setDoc(e.target.value)} className="font-mono text-sm" />
          {canEdit && <Button className="mt-3" onClick={() => save({ implementation_doc: doc.slice(0, 50000) }, "Documentation saved.")}>Save documentation</Button>}
        </TabsContent>

        <TabsContent value="kb" className="mt-6 max-w-3xl">
          <p className="mb-3 text-sm text-muted-foreground">The organization's long-term reference: FAQs, troubleshooting and contacts.</p>
          <Textarea rows={18} value={kb} disabled={!canEdit} onChange={(e) => setKb(e.target.value)} className="font-mono text-sm" />
          {canEdit && <Button className="mt-3" onClick={() => save({ knowledge_base: kb.slice(0, 50000) }, "Knowledge base saved.")}>Save knowledge base</Button>}
        </TabsContent>
      </Tabs>

      {canEdit && !(isOrg ? p.org_confirmed_at : p.business_confirmed_at) && (
        <div className="mt-10 rounded-lg border bg-card p-5 shadow-card">
          <h2 className="text-lg font-semibold">Confirm obligations met</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isOrg ? "Confirm you've received everything on the checklist and the documentation is accurate." : "Confirm you've delivered everything on the checklist and documented the solution."}
          </p>
          <Button className="mt-4" onClick={confirm} disabled={!allChecked}>I confirm</Button>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border bg-card p-4"><div className="font-display text-2xl">{value}</div><div className="text-xs text-muted-foreground">{label}</div></div>;
}
function Confirm({ label, at }: { label: string; at: string | null }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
      {at ? <CheckCircle2 className="h-6 w-6 text-success" /> : <Circle className="h-6 w-6 text-muted-foreground" />}
      <div><div className="text-sm font-medium">{label}</div><div className="text-xs text-muted-foreground">{at ? new Date(at).toLocaleString() : "Pending"}</div></div>
    </div>
  );
}
