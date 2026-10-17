import { describe, expect, it } from "vitest";
import { matchScore, readinessScore, stageIndex } from "./assessment";

describe("readinessScore", () => {
  it("is 0 for an org with nothing in place", () => {
    expect(
      readinessScore({ devices_condition: 1, internet: 1, data_storage: "paper", backups: "none", security: [], comfort: 1, it_person: "none", documentation: "none" }),
    ).toBe(0);
  });
  it("is 100 for a fully equipped org", () => {
    expect(
      readinessScore({ devices_condition: 5, internet: 5, data_storage: "cloud", backups: "tested", security: ["mfa", "password_manager", "updates", "antivirus", "access_review"], comfort: 5, it_person: "full_time", documentation: "good" }),
    ).toBe(100);
  });
});

describe("matchScore", () => {
  const org = { categories: ["website", "security"], budget: "10000", timeline: "12" };

  it("gives full marks when a proposal fully fits", () => {
    const r = matchScore(org, { capabilities: ["website", "security"], cost: 8000, weeks: 10, support: "ongoing", training_plan: "x".repeat(200) }, 20);
    expect(r.total).toBe(100);
  });
  it("gives half coverage when only one of two areas is offered", () => {
    expect(matchScore(org, { capabilities: ["website"] }, 50).coverage).toBe(20);
  });
  it("gives zero budget points for a paid bid on a pro bono request", () => {
    expect(matchScore({ ...org, budget: "0" }, { cost: 500 }, 50).budget).toBe(0);
  });
  it("requires ongoing support for full support points when readiness is low", () => {
    expect(matchScore(org, { support: "90" }, 30).support).toBe(10);
    expect(matchScore(org, { support: "90" }, 80).support).toBe(15);
  });
});

describe("stageIndex", () => {
  it("moves to 'Proposals in' once a proposal exists", () => {
    expect(stageIndex("published", 0)).toBe(1);
    expect(stageIndex("published", 2)).toBe(2);
    expect(stageIndex("completed", 2)).toBe(4);
  });
});
