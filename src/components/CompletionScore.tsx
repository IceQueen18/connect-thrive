import { completionScore, STAGES, stageIndex } from "@/lib/assessment";
import { StageBar } from "@/components/StageBar";

export function CompletionScore({ readiness, status, proposalCount }: {
  readiness: number;
  status: string;
  proposalCount: number;
}) {
  const score = completionScore(readiness, status, proposalCount);
  const index = stageIndex(status, proposalCount);
  return (
    <section aria-label="Project completion" className="my-7 border-y border-primary/20 py-6">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        <div className="font-display text-7xl font-semibold tabular-nums text-primary sm:text-8xl">
          {score}<span className="text-4xl">%</span>
        </div>
        <div>
          <h2 className="text-xl font-semibold">{status === "completed" ? "Project complete" : "Estimated project completion"}</h2>
          <p className="mt-1 font-medium">{STAGES[index]}</p>
          <p className="mt-2 text-sm text-muted-foreground">Readiness {readiness}/100 · {status === "completed" ? "Both parties confirmed" : "Readiness 20% · Project milestones 80%"}</p>
        </div>
      </div>
      <div role="progressbar" aria-label="Overall project completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-progress" style={{ width: `${score}%` }} />
      </div>
      <div className="mt-5 max-w-3xl"><StageBar index={index} /></div>
    </section>
  );
}