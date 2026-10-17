export type SampleDocumentKind = "implementation" | "knowledge-base";

const handoffProjects = new Set(["youth-stem", "winter-kits", "mobile-health", "legal-intake"]);
const formats = [
  { kind: "implementation", name: "Implementation plan", file: "implementation-plan.pdf", format: "PDF" },
  { kind: "implementation", name: "Editable implementation plan", file: "implementation-plan.docx", format: "DOCX" },
  { kind: "implementation", name: "Validation checklist", file: "validation-checklist.xlsx", format: "XLSX" },
  { kind: "knowledge-base", name: "Staff knowledge base", file: "knowledge-base.md", format: "MD" },
  { kind: "knowledge-base", name: "Quick-start and troubleshooting guide", file: "quick-start.txt", format: "TXT" },
] as const;

export function sampleDocuments(projectId: string, kind: SampleDocumentKind) {
  if (!handoffProjects.has(projectId)) return [];
  return formats.filter((document) => document.kind === kind).map((document) => ({
    ...document,
    url: `/sample-documents/${projectId}/${document.file}`,
    downloadName: `${projectId}-${document.file}`,
  }));
}