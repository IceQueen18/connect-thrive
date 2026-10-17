import type { Answers, Question, Section } from "@/lib/assessment";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export function SectionFields({ section, answers, onChange, missing }: {
  section: Section;
  answers: Answers;
  onChange: (id: string, v: Answers[string]) => void;
  missing: string[];
}) {
  return (
    <div className="space-y-7">
      {section.questions.map((q) => (
        <Field key={q.id} q={q} value={answers[q.id]} onChange={(v) => onChange(q.id, v)} invalid={missing.includes(q.id)} />
      ))}
    </div>
  );
}

function Field({ q, value, onChange, invalid }: { q: Question; value: Answers[string]; onChange: (v: Answers[string]) => void; invalid: boolean }) {
  return (
    <div className="space-y-2">
      <Label className="text-base font-medium">
        {q.label} {q.required && <span className="text-destructive">*</span>}
      </Label>
      {q.help && <p className="text-sm text-muted-foreground">{q.help}</p>}
      {q.type === "text" && <Input value={(value as string) ?? ""} maxLength={300} onChange={(e) => onChange(e.target.value)} />}
      {q.type === "number" && <Input type="number" min={0} value={(value as number | string) ?? ""} onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))} className="max-w-48" />}
      {q.type === "textarea" && <Textarea rows={4} maxLength={5000} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />}
      {q.type === "select" && (
        <div className="grid gap-2 sm:grid-cols-2">
          {q.options!.map((o) => (
            <button type="button" key={o.value} onClick={() => onChange(o.value)}
              className={cn("rounded-md border px-3 py-2.5 text-left text-sm transition-colors",
                value === o.value ? "border-primary bg-primary/10 text-foreground" : "bg-card hover:border-primary/50")}>
              {o.label}
            </button>
          ))}
        </div>
      )}
      {q.type === "multi" && (
        <div className="grid gap-2 sm:grid-cols-2">
          {q.options!.map((o) => {
            const arr = Array.isArray(value) ? value : [];
            const on = arr.includes(o.value);
            return (
              <label key={o.value} className={cn("flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 text-sm", on ? "border-primary bg-primary/10" : "bg-card")}>
                <Checkbox checked={on} onCheckedChange={(c) => onChange(c ? [...arr, o.value] : arr.filter((x) => x !== o.value))} />
                {o.label}
              </label>
            );
          })}
        </div>
      )}
      {q.type === "scale" && (
        <div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => onChange(n)}
                className={cn("h-11 w-11 rounded-md border text-sm font-medium transition-colors",
                  value === n ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/50")}>
                {n}
              </button>
            ))}
          </div>
          {q.scaleLabels && <div className="mt-1 flex max-w-[15rem] justify-between text-xs text-muted-foreground"><span>{q.scaleLabels[0]}</span><span>{q.scaleLabels[1]}</span></div>}
        </div>
      )}
      {invalid && <p className="text-sm text-destructive">This question is required.</p>}
    </div>
  );
}

export function AnswerSummary({ sections, answers }: { sections: Section[]; answers: Answers }) {
  return (
    <div className="space-y-6">
      {sections.map((s) => (
        <div key={s.id}>
          <h3 className="mb-3 text-lg font-semibold">{s.title}</h3>
          <dl className="grid gap-3 sm:grid-cols-2">
            {s.questions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== "").map((q) => {
              const v = answers[q.id];
              const text = q.options
                ? (Array.isArray(v) ? v : [String(v)]).map((x) => q.options!.find((o) => o.value === x)?.label ?? x).join(", ")
                : q.type === "scale" ? `${v} / 5` : String(v);
              return (
                <div key={q.id} className={cn("rounded-md border bg-card p-3", q.type === "textarea" && "sm:col-span-2")}>
                  <dt className="text-xs text-muted-foreground">{q.label}</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm">{text}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      ))}
    </div>
  );
}
