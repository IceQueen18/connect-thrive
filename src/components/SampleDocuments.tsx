import { Download, FileText, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sampleDocuments, type SampleDocument } from "@/lib/sample-documents";

export function SampleDocuments({ assessmentId, kind }: { assessmentId: string; kind: SampleDocument["kind"] }) {
  const documents = sampleDocuments.filter((document) => document.assessmentId === assessmentId && document.kind === kind);
  if (!documents.length) return null;
  return <section aria-label="Sample document attachments" className="mt-6 max-w-4xl border-y py-5">
    <h3 className="text-lg font-semibold">Sample attachments</h3>
    <p className="mt-1 text-sm text-muted-foreground">Fictional files · {documents[0]?.status} · Download examples only; file uploading is not enabled.</p>
    <ul className="mt-4 divide-y">
      {documents.map((document) => {
        const Icon = document.format === "XLSX" || document.format === "CSV" ? Table2 : FileText;
        return <li key={document.id} className="flex flex-wrap items-center gap-3 py-4">
          <Icon className="size-6 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0 flex-1 basis-40">
            <p className="font-medium">{document.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{document.description}</p>
            <p className="mt-1 text-xs font-medium text-primary">{document.format} · {(document.sizeBytes / 1024).toFixed(1)} KB</p>
          </div>
          <Button asChild variant="outline" size="sm"><a href={document.url} download={document.fileName} aria-label={`Download ${document.title} (${document.format})`}><Download aria-hidden="true" />Download</a></Button>
        </li>;
      })}
    </ul>
  </section>;
}