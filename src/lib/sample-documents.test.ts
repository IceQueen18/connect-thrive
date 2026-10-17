import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { sampleDocuments } from "./sample-documents";

describe("sample handoff attachments", () => {
  it("provides actual PDF, Word, spreadsheet, Markdown, and text files for each sample handoff", () => {
    for (const id of ["youth-stem", "winter-kits", "mobile-health", "legal-intake"]) {
      const docs = [...sampleDocuments(id, "implementation"), ...sampleDocuments(id, "knowledge-base")];
      expect(docs.map((d) => d.format)).toEqual(["PDF", "DOCX", "XLSX", "MD", "TXT"]);
      for (const doc of docs) {
        const contents = readFileSync(`public${doc.url}`);
        expect(contents.length).toBeGreaterThan(100);
        if (doc.format === "PDF") expect(contents.subarray(0, 4).toString()).toBe("%PDF");
        if (doc.format === "DOCX" || doc.format === "XLSX") expect(contents.subarray(0, 2).toString()).toBe("PK");
        if (doc.format === "MD" || doc.format === "TXT") expect(contents.toString()).toContain("FICTIONAL SAMPLE");
      }
    }
  });
  it("does not create handoff attachments for requests awaiting providers", () => {
    expect(sampleDocuments("food-rescue", "implementation")).toEqual([]);
    expect(sampleDocuments("housing-placement", "knowledge-base")).toEqual([]);
  });
});