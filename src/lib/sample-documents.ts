export interface SampleDocument {
  id: string;
  assessmentId: string;
  kind: "implementation" | "knowledge-base";
  title: string;
  format: string;
  fileName: string;
  url: string;
  sizeBytes: number;
  status: string;
  description: string;
}

// Static fictional attachments only; not live-account uploads.
export const sampleDocuments: SampleDocument[] = [
  {
    "id": "youth-stem-implementation-pdf",
    "assessmentId": "youth-stem",
    "kind": "implementation",
    "title": "Implementation guide",
    "format": "PDF",
    "fileName": "implementation-guide.pdf",
    "url": "/sample-documents/youth-stem/implementation-guide.pdf",
    "sizeBytes": 2981,
    "status": "Pilot draft",
    "description": "Scope, configuration, validation and handoff status."
  },
  {
    "id": "youth-stem-implementation-docx",
    "assessmentId": "youth-stem",
    "kind": "implementation",
    "title": "Configuration runbook",
    "format": "DOCX",
    "fileName": "configuration-runbook.docx",
    "url": "/sample-documents/youth-stem/configuration-runbook.docx",
    "sizeBytes": 2410,
    "status": "Pilot draft",
    "description": "Editable system setup and ownership notes."
  },
  {
    "id": "youth-stem-implementation-xlsx",
    "assessmentId": "youth-stem",
    "kind": "implementation",
    "title": "Acceptance checklist",
    "format": "XLSX",
    "fileName": "acceptance-checklist.xlsx",
    "url": "/sample-documents/youth-stem/acceptance-checklist.xlsx",
    "sizeBytes": 5704,
    "status": "Pilot draft",
    "description": "Example validation tasks, reviewers and review status."
  },
  {
    "id": "youth-stem-knowledge-base-md",
    "assessmentId": "youth-stem",
    "kind": "knowledge-base",
    "title": "Knowledge-base articles",
    "format": "MD",
    "fileName": "knowledge-base.md",
    "url": "/sample-documents/youth-stem/knowledge-base.md",
    "sizeBytes": 1681,
    "status": "Pilot draft",
    "description": "Portable Markdown quick-start, maintenance and support articles."
  },
  {
    "id": "youth-stem-knowledge-base-txt",
    "assessmentId": "youth-stem",
    "kind": "knowledge-base",
    "title": "Staff quick-start guide",
    "format": "TXT",
    "fileName": "quick-start.txt",
    "url": "/sample-documents/youth-stem/quick-start.txt",
    "sizeBytes": 1339,
    "status": "Pilot draft",
    "description": "Plain-text daily tasks and safe escalation steps."
  },
  {
    "id": "youth-stem-knowledge-base-csv",
    "assessmentId": "youth-stem",
    "kind": "knowledge-base",
    "title": "Troubleshooting index",
    "format": "CSV",
    "fileName": "troubleshooting-index.csv",
    "url": "/sample-documents/youth-stem/troubleshooting-index.csv",
    "sizeBytes": 1762,
    "status": "Pilot draft",
    "description": "Structured articles for importing into a knowledge-base tool."
  },
  {
    "id": "winter-kits-implementation-pdf",
    "assessmentId": "winter-kits",
    "kind": "implementation",
    "title": "Implementation guide",
    "format": "PDF",
    "fileName": "implementation-guide.pdf",
    "url": "/sample-documents/winter-kits/implementation-guide.pdf",
    "sizeBytes": 2900,
    "status": "Completed sample",
    "description": "Scope, configuration, validation and handoff status."
  },
  {
    "id": "winter-kits-implementation-docx",
    "assessmentId": "winter-kits",
    "kind": "implementation",
    "title": "Configuration runbook",
    "format": "DOCX",
    "fileName": "configuration-runbook.docx",
    "url": "/sample-documents/winter-kits/configuration-runbook.docx",
    "sizeBytes": 2346,
    "status": "Completed sample",
    "description": "Editable system setup and ownership notes."
  },
  {
    "id": "winter-kits-implementation-xlsx",
    "assessmentId": "winter-kits",
    "kind": "implementation",
    "title": "Acceptance checklist",
    "format": "XLSX",
    "fileName": "acceptance-checklist.xlsx",
    "url": "/sample-documents/winter-kits/acceptance-checklist.xlsx",
    "sizeBytes": 5651,
    "status": "Completed sample",
    "description": "Example validation tasks, reviewers and review status."
  },
  {
    "id": "winter-kits-knowledge-base-md",
    "assessmentId": "winter-kits",
    "kind": "knowledge-base",
    "title": "Knowledge-base articles",
    "format": "MD",
    "fileName": "knowledge-base.md",
    "url": "/sample-documents/winter-kits/knowledge-base.md",
    "sizeBytes": 1634,
    "status": "Completed sample",
    "description": "Portable Markdown quick-start, maintenance and support articles."
  },
  {
    "id": "winter-kits-knowledge-base-txt",
    "assessmentId": "winter-kits",
    "kind": "knowledge-base",
    "title": "Staff quick-start guide",
    "format": "TXT",
    "fileName": "quick-start.txt",
    "url": "/sample-documents/winter-kits/quick-start.txt",
    "sizeBytes": 1280,
    "status": "Completed sample",
    "description": "Plain-text daily tasks and safe escalation steps."
  },
  {
    "id": "winter-kits-knowledge-base-csv",
    "assessmentId": "winter-kits",
    "kind": "knowledge-base",
    "title": "Troubleshooting index",
    "format": "CSV",
    "fileName": "troubleshooting-index.csv",
    "url": "/sample-documents/winter-kits/troubleshooting-index.csv",
    "sizeBytes": 1699,
    "status": "Completed sample",
    "description": "Structured articles for importing into a knowledge-base tool."
  },
  {
    "id": "mobile-health-implementation-pdf",
    "assessmentId": "mobile-health",
    "kind": "implementation",
    "title": "Implementation guide",
    "format": "PDF",
    "fileName": "implementation-guide.pdf",
    "url": "/sample-documents/mobile-health/implementation-guide.pdf",
    "sizeBytes": 2955,
    "status": "Completed sample",
    "description": "Scope, configuration, validation and handoff status."
  },
  {
    "id": "mobile-health-implementation-docx",
    "assessmentId": "mobile-health",
    "kind": "implementation",
    "title": "Configuration runbook",
    "format": "DOCX",
    "fileName": "configuration-runbook.docx",
    "url": "/sample-documents/mobile-health/configuration-runbook.docx",
    "sizeBytes": 2382,
    "status": "Completed sample",
    "description": "Editable system setup and ownership notes."
  },
  {
    "id": "mobile-health-implementation-xlsx",
    "assessmentId": "mobile-health",
    "kind": "implementation",
    "title": "Acceptance checklist",
    "format": "XLSX",
    "fileName": "acceptance-checklist.xlsx",
    "url": "/sample-documents/mobile-health/acceptance-checklist.xlsx",
    "sizeBytes": 5697,
    "status": "Completed sample",
    "description": "Example validation tasks, reviewers and review status."
  },
  {
    "id": "mobile-health-knowledge-base-md",
    "assessmentId": "mobile-health",
    "kind": "knowledge-base",
    "title": "Knowledge-base articles",
    "format": "MD",
    "fileName": "knowledge-base.md",
    "url": "/sample-documents/mobile-health/knowledge-base.md",
    "sizeBytes": 1573,
    "status": "Completed sample",
    "description": "Portable Markdown quick-start, maintenance and support articles."
  },
  {
    "id": "mobile-health-knowledge-base-txt",
    "assessmentId": "mobile-health",
    "kind": "knowledge-base",
    "title": "Staff quick-start guide",
    "format": "TXT",
    "fileName": "quick-start.txt",
    "url": "/sample-documents/mobile-health/quick-start.txt",
    "sizeBytes": 1233,
    "status": "Completed sample",
    "description": "Plain-text daily tasks and safe escalation steps."
  },
  {
    "id": "mobile-health-knowledge-base-csv",
    "assessmentId": "mobile-health",
    "kind": "knowledge-base",
    "title": "Troubleshooting index",
    "format": "CSV",
    "fileName": "troubleshooting-index.csv",
    "url": "/sample-documents/mobile-health/troubleshooting-index.csv",
    "sizeBytes": 1661,
    "status": "Completed sample",
    "description": "Structured articles for importing into a knowledge-base tool."
  },
  {
    "id": "legal-intake-implementation-pdf",
    "assessmentId": "legal-intake",
    "kind": "implementation",
    "title": "Implementation guide",
    "format": "PDF",
    "fileName": "implementation-guide.pdf",
    "url": "/sample-documents/legal-intake/implementation-guide.pdf",
    "sizeBytes": 2941,
    "status": "Awaiting organization review",
    "description": "Scope, configuration, validation and handoff status."
  },
  {
    "id": "legal-intake-implementation-docx",
    "assessmentId": "legal-intake",
    "kind": "implementation",
    "title": "Configuration runbook",
    "format": "DOCX",
    "fileName": "configuration-runbook.docx",
    "url": "/sample-documents/legal-intake/configuration-runbook.docx",
    "sizeBytes": 2389,
    "status": "Awaiting organization review",
    "description": "Editable system setup and ownership notes."
  },
  {
    "id": "legal-intake-implementation-xlsx",
    "assessmentId": "legal-intake",
    "kind": "implementation",
    "title": "Acceptance checklist",
    "format": "XLSX",
    "fileName": "acceptance-checklist.xlsx",
    "url": "/sample-documents/legal-intake/acceptance-checklist.xlsx",
    "sizeBytes": 5693,
    "status": "Awaiting organization review",
    "description": "Example validation tasks, reviewers and review status."
  },
  {
    "id": "legal-intake-knowledge-base-md",
    "assessmentId": "legal-intake",
    "kind": "knowledge-base",
    "title": "Knowledge-base articles",
    "format": "MD",
    "fileName": "knowledge-base.md",
    "url": "/sample-documents/legal-intake/knowledge-base.md",
    "sizeBytes": 1602,
    "status": "Awaiting organization review",
    "description": "Portable Markdown quick-start, maintenance and support articles."
  },
  {
    "id": "legal-intake-knowledge-base-txt",
    "assessmentId": "legal-intake",
    "kind": "knowledge-base",
    "title": "Staff quick-start guide",
    "format": "TXT",
    "fileName": "quick-start.txt",
    "url": "/sample-documents/legal-intake/quick-start.txt",
    "sizeBytes": 1238,
    "status": "Awaiting organization review",
    "description": "Plain-text daily tasks and safe escalation steps."
  },
  {
    "id": "legal-intake-knowledge-base-csv",
    "assessmentId": "legal-intake",
    "kind": "knowledge-base",
    "title": "Troubleshooting index",
    "format": "CSV",
    "fileName": "troubleshooting-index.csv",
    "url": "/sample-documents/legal-intake/troubleshooting-index.csv",
    "sizeBytes": 1673,
    "status": "Awaiting organization review",
    "description": "Structured articles for importing into a knowledge-base tool."
  },
  {
    "id": "senior-events-implementation-pdf",
    "assessmentId": "senior-events",
    "kind": "implementation",
    "title": "Implementation guide",
    "format": "PDF",
    "fileName": "implementation-guide.pdf",
    "url": "/sample-documents/senior-events/implementation-guide.pdf",
    "sizeBytes": 2396,
    "status": "Completed sample",
    "description": "Scope, configuration, validation and handoff status."
  },
  {
    "id": "senior-events-implementation-docx",
    "assessmentId": "senior-events",
    "kind": "implementation",
    "title": "Configuration runbook",
    "format": "DOCX",
    "fileName": "configuration-runbook.docx",
    "url": "/sample-documents/senior-events/configuration-runbook.docx",
    "sizeBytes": 37236,
    "status": "Completed sample",
    "description": "Editable system setup and ownership notes."
  },
  {
    "id": "senior-events-implementation-xlsx",
    "assessmentId": "senior-events",
    "kind": "implementation",
    "title": "Acceptance checklist",
    "format": "XLSX",
    "fileName": "acceptance-checklist.xlsx",
    "url": "/sample-documents/senior-events/acceptance-checklist.xlsx",
    "sizeBytes": 5451,
    "status": "Completed sample",
    "description": "Example validation tasks, reviewers and review status."
  },
  {
    "id": "senior-events-knowledge-base-md",
    "assessmentId": "senior-events",
    "kind": "knowledge-base",
    "title": "Knowledge-base articles",
    "format": "MD",
    "fileName": "knowledge-base.md",
    "url": "/sample-documents/senior-events/knowledge-base.md",
    "sizeBytes": 1112,
    "status": "Completed sample",
    "description": "Portable Markdown quick-start, maintenance and support articles."
  },
  {
    "id": "senior-events-knowledge-base-txt",
    "assessmentId": "senior-events",
    "kind": "knowledge-base",
    "title": "Staff quick-start guide",
    "format": "TXT",
    "fileName": "quick-start.txt",
    "url": "/sample-documents/senior-events/quick-start.txt",
    "sizeBytes": 748,
    "status": "Completed sample",
    "description": "Plain-text daily tasks and safe escalation steps."
  },
  {
    "id": "senior-events-knowledge-base-csv",
    "assessmentId": "senior-events",
    "kind": "knowledge-base",
    "title": "Troubleshooting index",
    "format": "CSV",
    "fileName": "troubleshooting-index.csv",
    "url": "/sample-documents/senior-events/troubleshooting-index.csv",
    "sizeBytes": 830,
    "status": "Completed sample",
    "description": "Structured articles for importing into a knowledge-base tool."
  }
];
