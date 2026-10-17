import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { sampleDocuments } from "./sample-documents";
import { sampleAssessments } from "./samples";

describe("fictional handoff attachments", () => {
  it("provides six formats for every sample with a handoff", () => {
    for (const assessment of sampleAssessments.filter((a) => a.handoff)) {
      const documents = sampleDocuments.filter((d) => d.assessmentId === assessment.id);
      expect(documents.map((d) => d.format).sort()).toEqual(["CSV", "DOCX", "MD", "PDF", "TXT", "XLSX"]);
      expect(documents.filter((d) => d.kind === "implementation")).toHaveLength(3);
      expect(documents.filter((d) => d.kind === "knowledge-base")).toHaveLength(3);
    }
  });
  it("references real downloadable files with accurate sizes and format signatures", () => {
    for (const document of sampleDocuments) {
      const path = resolve("public", document.url.slice(1));
      expect(existsSync(path)).toBe(true);
      const bytes = readFileSync(path);
      expect(bytes.length).toBe(document.sizeBytes);
      if (document.format === "PDF") expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
      else if (["DOCX", "XLSX"].includes(document.format)) expect(bytes.subarray(0, 2).toString()).toBe("PK");
      else expect(bytes.toString()).toContain("FICTIONAL SAMPLE ONLY");
    }
  });
});