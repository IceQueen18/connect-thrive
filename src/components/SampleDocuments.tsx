import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sampleDocuments, type SampleDocumentKind } from "@/lib/sample-documents";

export function SampleDocuments({ projectId, kind }: { projectId: string; kind: SampleDocumentKind }) {
  const documents = sampleDocuments(projectId, kind);
  if (!documents.length) return null;
  return <section className="mt-6 max-w-4xl" aria-label="Sample document attachments">
    <h3 className="text-xl font-semibold">Sample attachments</h3>
    <p className="mt-2 text-sm text-muted-foreground">Fictional documents · Downloadable format examples, not live uploads.</p>
    <ul className="mt-4 divide-y border-y">
      {documents.map((document) => <li key={document.file} className="flex flex-wrap items-center gap-3 py-4">
        <FileText className="size-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1 basis-40"><p className="text-sm font-medium">{document.name}</p><p className="mt-1 text-xs text-muted-foreground">{document.format} · Fictional sample</p></div>
        <Button asChild variant="outline" size="sm"><a href={document.url} download={document.downloadName} aria-label={`Download ${document.name} (${document.format})`}><Download aria-hidden="true" />{document.format}</a></Button>
      </li>)}
    </ul>
  </section>;
}