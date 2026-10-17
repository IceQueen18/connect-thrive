import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Trophy, BookOpenCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TechBridge Consulting — Match community tech needs with the right providers" },
      { name: "description", content: "Organizations assess their technology needs; businesses and contractors compete with solutions; both sides sign off on a documented handoff." },
      { property: "og:title", content: "TechBridge Consulting — Community tech needs, matched" },
      { property: "og:description", content: "Assess needs, compare scored proposals, and close with a confirmed handoff and knowledge base." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const steps = [
  { icon: ClipboardList, t: "Assess", d: "Organizations describe the request, current technology and in-house know-how. Each assessment joins a timeline so progress is visible over time." },
  { icon: Trophy, t: "Compete", d: "Published needs appear on a board. Businesses and contractors answer a matching assessment and get an automatic fit score." },
  { icon: BookOpenCheck, t: "Hand off", d: "The chosen provider delivers implementation docs, a handoff checklist and a knowledge base. Both parties confirm to close." },
];

function Index() {
  return (
    <div className="min-h-screen">
      <section className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
          <span className="font-display text-xl font-semibold">TechBridge Consulting</span>
          <Button asChild variant="secondary" size="sm"><Link to="/auth">Sign in</Link></Button>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-16">
          <h1 className="max-w-3xl text-5xl font-semibold leading-tight md:text-6xl">Technology help that's scoped right and stays working.</h1>
          <p className="mt-6 max-w-xl text-lg opacity-90">Communities and organizations define what they need. Providers compete to solve it. Everyone signs off on the handoff.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary"><Link to="/auth">Get started</Link></Button>
            <Button asChild size="lg" variant="secondary"><Link to="/samples">Explore sample projects</Link></Button>
            <Button asChild size="lg" variant="secondary"><Link to="/compliance"><ShieldCheck aria-hidden="true" />AI &amp; Data Compliance</Link></Button>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-20 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.t} className="rounded-lg border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3">
              <span className="font-display text-3xl text-accent">{i + 1}</span>
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">{s.t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
