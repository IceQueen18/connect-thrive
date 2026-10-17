import { describe, expect, it } from "vitest";
import { sampleOrganizations, sampleAssessments, sampleContractors, rankedSampleProposals } from "./samples";
import { BUSINESS_SECTIONS, ORG_SECTIONS, missingRequired } from "./assessment";

const SCREENSHOT_ORGS = ["Twin Cities Housing Alliance", "Metro Food Rescue Network", "Community Youth Works", "Hope Health Access Initiative", "Northside Legal Aid Clinic"];

describe("fictional showcase data", () => {
  it("represents all five organizations from the screenshot", () => {
    expect(sampleOrganizations.map((o) => o.name)).toEqual(expect.arrayContaining(SCREENSHOT_ORGS));
    for (const org of sampleOrganizations) expect(sampleAssessments.some((a) => a.organizationId === org.id)).toBe(true);
  });
  it("includes repeat assessments and every requested project stage", () => {
    expect(sampleAssessments.filter((a) => a.organizationId === "housing")).toHaveLength(2);
    expect(sampleAssessments.filter((a) => a.status === "published" && a.proposals.length === 0)).toHaveLength(1);
    expect(sampleAssessments.filter((a) => a.status === "published" && a.proposals.length > 0)).toHaveLength(2);
    expect(sampleAssessments.filter((a) => a.status === "in_progress")).toHaveLength(2);
    expect(sampleAssessments.filter((a) => a.status === "completed")).toHaveLength(3);
  });
  it("supplies complete assessments and valid provider responses", () => {
    for (const a of sampleAssessments) {
      expect(missingRequired(ORG_SECTIONS, a.answers)).toEqual([]);
      for (const p of a.proposals) {
        expect(missingRequired(BUSINESS_SECTIONS, p.answers)).toEqual([]);
        expect(["contractor", "volunteer"]).toContain(p.answers["provider_type"]);
      }
    }
  });
  it("includes zero-budget organizations served by volunteers", () => {
    const proBono = sampleAssessments.filter((a) => a.answers["budget"] === "0");
    expect(proBono).toHaveLength(2);
    expect(proBono.some((a) => a.status === "completed")).toBe(true);
    for (const a of proBono) {
      expect(a.proposals.length).toBeGreaterThan(0);
      for (const p of a.proposals) {
        expect(p.answers["provider_type"]).toBe("volunteer");
        expect(Number(p.answers["cost"])).toBe(0);
      }
    }
    for (const paid of sampleAssessments.filter((a) => a.answers["budget"] !== "0"))
      for (const p of paid.proposals) expect(p.answers["provider_type"]).toBe("contractor");
  });
  it("shows only mutually confirmed handoffs as completed", () => {
    for (const a of sampleAssessments.filter((a) => a.status === "completed")) {
      expect(Boolean(a.handoff?.organizationConfirmedAt)).toBe(true);
      expect(Boolean(a.handoff?.contractorConfirmedAt)).toBe(true);
      expect(a.handoff?.checklist.every((c) => c.done)).toBe(true);
    }
    const legal = sampleAssessments.find((a) => a.id === "legal-intake");
    expect(legal?.status).toBe("in_progress");
    expect(legal?.handoff?.organizationConfirmedAt).toBeNull();
    expect(Boolean(legal?.handoff?.contractorConfirmedAt)).toBe(true);
  });
  it("lists every provider with a type and capabilities", () => {
    expect(sampleContractors.filter((c) => c.type === "volunteer").length).toBe(2);
    for (const c of sampleContractors) expect(c.capabilities.length).toBeGreaterThan(0);
  });
  it("uses the real scoring rules to rank competing proposals", () => {
    const food = sampleAssessments.find((a) => a.id === "food-rescue");
    if (!food) throw new Error("Missing food sample");
    const proposals = rankedSampleProposals(food);
    expect(proposals.map((p) => p.contractorId)).toEqual(["jordan", "maya", "leo"]);
    expect(proposals.map((p) => p.score.total)).toEqual([100, 96, 80]);
  });
});
