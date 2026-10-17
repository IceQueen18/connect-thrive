import { describe, expect, it } from "vitest";
import { completionScore, matchScore, readinessScore, stageIndex } from "./assessment";

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

describe("completionScore", () => {
  it("uses readiness for 20% of the estimate", () => {
    expect(completionScore(0, "published", 0)).toBe(20);
    expect(completionScore(50, "published", 0)).toBe(30);
    expect(completionScore(100, "published", 0)).toBe(40);
  });
  it("advances the milestone contribution as the project progresses", () => {
    expect(completionScore(50, "draft", 0)).toBe(10);
    expect(completionScore(50, "published", 2)).toBe(50);
    expect(completionScore(50, "in_progress", 2)).toBe(70);
  });
  it("reserves 100% for a mutually confirmed completed project regardless of starting readiness", () => {
    expect(completionScore(100, "in_progress", 2)).toBe(80);
    expect(completionScore(0, "completed", 2)).toBe(100);
  });
  it("clamps invalid readiness values", () => {
    expect(completionScore(-50, "published", 0)).toBe(20);
    expect(completionScore(200, "published", 0)).toBe(40);
    expect(completionScore(NaN, "published", 0)).toBe(20);
  });
});
