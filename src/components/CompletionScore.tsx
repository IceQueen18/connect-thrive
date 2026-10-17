import { useId } from "react";
import { completionScore, STAGES, stageIndex } from "@/lib/assessment";
import { StageBar } from "@/components/StageBar";

const SIZE = 120;
const STROKE = 11;

export function CompletionRing({ readiness, status, proposalCount }: {
  readiness: number;
  status: string;
  proposalCount: number;
}) {
  const score = completionScore(readiness, status, proposalCount);
  const index = stageIndex(status, proposalCount);
  const gradientId = `completion-ring-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const radius = (SIZE - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <div className="relative h-24 w-24 sm:h-32 sm:w-32">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full -rotate-90" role="progressbar"
          aria-label="Overall project completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--success)" />
            </linearGradient>
          </defs>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={radius} fill="none" stroke="var(--muted)" strokeWidth={STROKE} />
          <circle cx={SIZE / 2} cy={SIZE / 2} r={radius} fill="none" stroke={`url(#${gradientId})`}
            strokeWidth={STROKE} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center leading-none">
          <span className="font-display text-3xl font-semibold tabular-nums text-primary sm:text-4xl">
            {score}<span className="text-lg sm:text-xl">%</span>
          </span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">complete</span>
        </div>
      </div>
      <p className="max-w-[10rem] text-center text-sm font-medium">{STAGES[index]}</p>
    </div>
  );
}

export function CompletionScore({ readiness, status, proposalCount }: {
  readiness: number;
  status: string;
  proposalCount: number;
}) {
  const index = stageIndex(status, proposalCount);
  return (
    <section aria-label="Project completion" className="my-7 border-y border-primary/20 py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="text-lg font-semibold">{status === "completed" ? "Project complete" : "Estimated project completion"}</h2>
        <p className="text-sm text-muted-foreground">Readiness {readiness}/100 · {status === "completed" ? "Both parties confirmed" : "Readiness 20% · Project milestones 80%"}</p>
      </div>
      <div className="mt-4 max-w-3xl"><StageBar index={index} /></div>
    </section>
  );
}
