import { describe, expect, it } from "vitest";
import { sampleOrganizations, sampleAssessments, rankedSampleProposals } from "./samples";
import { BUSINESS_SECTIONS, ORG_SECTIONS, missingRequired } from "./assessment";

describe("fictional showcase data", () => {
  it("represents all five organizations from the screenshot", () => {
    expect(sampleOrganizations.map((o) => o.name)).toEqual(["Twin Cities Housing Alliance", "Metro Food Rescue Network", "Community Youth Works", "Hope Health Access Initiative", "Northside Legal Aid Clinic"]);
    for (const org of sampleOrganizations) expect(sampleAssessments.some((a) => a.organizationId === org.id)).toBe(true);
  });
  it("includes repeat assessments and every requested project stage", () => {
    expect(sampleAssessments.filter((a) => a.organizationId === "housing")).toHaveLength(2);
    expect(sampleAssessments.filter((a) => a.status === "published" && a.proposals.length === 0)).toHaveLength(1);
    expect(sampleAssessments.filter((a) => a.status === "published" && a.proposals.length > 0)).toHaveLength(1);
    expect(sampleAssessments.filter((a) => a.status === "in_progress")).toHaveLength(2);
    expect(sampleAssessments.filter((a) => a.status === "completed")).toHaveLength(2);
  });
  it("supplies complete assessments and valid independent contractor responses", () => {
    for (const a of sampleAssessments) {
      expect(missingRequired(ORG_SECTIONS, a.answers)).toEqual([]);
      for (const p of a.proposals) {
        expect(missingRequired(BUSINESS_SECTIONS, p.answers)).toEqual([]);
        expect(p.answers["provider_type"]).toBe("contractor");
      }
    }
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
  it("uses the real scoring rules to rank competing proposals", () => {
    const food = sampleAssessments.find((a) => a.id === "food-rescue");
    if (!food) throw new Error("Missing food sample");
    const proposals = rankedSampleProposals(food);
    expect(proposals.map((p) => p.contractorId)).toEqual(["jordan", "maya", "leo"]);
    expect(proposals.map((p) => p.score.total)).toEqual([100, 96, 87]);
  });
});