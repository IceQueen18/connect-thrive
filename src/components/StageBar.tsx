import { STAGES } from "@/lib/assessment";
import { cn } from "@/lib/utils";

export function StageBar({ index }: { index: number }) {
  const pct = (index / (STAGES.length - 1)) * 100;
  return (
    <div>
      <div className="relative h-2 rounded-full bg-muted">
        <div className="absolute inset-y-0 left-0 rounded-full bg-progress transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
        {STAGES.map((s, i) => (
          <span key={s} className={cn(i <= index && "font-medium text-foreground")}>{s}</span>
        ))}
      </div>
    </div>
  );
}
