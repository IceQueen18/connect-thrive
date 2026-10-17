import { matchScore, readinessScore, type Answers } from "./assessment";
import { defaultChecklist, type ChecklistItem } from "./handoff";

export const sampleOrganizations = [
  { id: "housing", name: "Twin Cities Housing Alliance", contact: "Elena Rostova", mission: "Emergency housing and seasonal essentials for families." },
  { id: "food", name: "Metro Food Rescue Network", contact: "Marcus Vance", mission: "Recover surplus food and coordinate safe deliveries." },
  { id: "youth", name: "Community Youth Works", contact: "Sarah Jenkins", mission: "After-school STEM programs and youth development." },
  { id: "health", name: "Hope Health Access Initiative", contact: "Dr. Aris Thorne", mission: "Mobile vaccination and community health access." },
  { id: "legal", name: "Northside Legal Aid Clinic", contact: "David K. Chen", mission: "Housing advice and eviction prevention workshops." },
  { id: "seniors", name: "Westside Senior Center", contact: "Rosa Delgado", mission: "Independent living support, meals and social programs for older adults." },
  { id: "shelter", name: "Lakeside Family Shelter", contact: "Priya Raman", mission: "Emergency shelter and stability services for families with children." },
] as const;

export interface SampleProvider {
  id: string;
  name: string;
  type: "contractor" | "volunteer";
  specialty: string;
  years: number;
  capabilities: string[];
}

export const sampleContractors: SampleProvider[] = [
  { id: "maya", name: "Maya Patel", type: "contractor", specialty: "Accessible intake systems & nonprofit CRM", years: 9, capabilities: ["data", "software", "security", "training", "website"] },
  { id: "jordan", name: "Jordan Ellis", type: "contractor", specialty: "Logistics automation & mobile tools", years: 7, capabilities: ["software", "data", "cloud", "training"] },
  { id: "sofia", name: "Sofia Nguyen", type: "contractor", specialty: "Secure cloud systems & staff training", years: 11, capabilities: ["security", "cloud", "network", "devices", "training", "data"] },
  { id: "andre", name: "Andre Brooks", type: "contractor", specialty: "Community websites & volunteer coordination", years: 6, capabilities: ["website", "software", "training", "cloud"] },
  { id: "leo", name: "Leo Martinez", type: "contractor", specialty: "Reporting, integrations & data migration", years: 8, capabilities: ["data", "software", "cloud"] },
  { id: "ruth", name: "Ruth Okafor", type: "volunteer", specialty: "Volunteer web, forms & training support for community groups", years: 14, capabilities: ["website", "data", "training", "cloud"] },
  { id: "dan", name: "Dan Whitfield", type: "volunteer", specialty: "Weekend volunteer IT setup, devices & Wi‑Fi", years: 20, capabilities: ["devices", "network", "security", "training"] },
];

export interface SampleProposal {
  id: string;
  contractorId: string;
  status: "submitted" | "selected" | "declined";
  createdAt: string;
  answers: Answers;
}
export interface SampleHandoff {
  checklist: ChecklistItem[];
  implementationDoc: string;
  knowledgeBase: string;
  organizationConfirmedAt: string | null;
  contractorConfirmedAt: string | null;
}
export interface SampleAssessment {
  id: string;
  organizationId: string;
  title: string;
  createdAt: string;
  status: "published" | "in_progress" | "completed";
  answers: Answers;
  proposals: SampleProposal[];
  handoff?: SampleHandoff;
}

function organizationAnswers(problem: string, categories: string[], success: string, people: number, extra: Answers = {}): Answers {
  return {
    problem, categories, success, people_served: people, urgency: "high", budget: "10000", timeline: "12",
    constraints: "Keep existing tools where practical; accessible interfaces and minimum collection of personal information.",
    staff: 12, current_tools: "Microsoft 365, shared spreadsheets and paper intake forms.", devices_condition: 3, internet: 4,
    data_storage: "cloud", backups: "manual", security: ["updates", "antivirus"],
    pain_points: "Duplicate entry, unclear ownership and no reliable reporting across volunteers.", comfort: 2,
    it_person: "volunteer", owner_after: "Operations coordinator", documentation: "partial", training_needs: ["admin", "security"],
    learning_format: "in_person", ...extra,
  };
}

function proposal(id: string, contractorId: string, status: SampleProposal["status"], date: string, summary: string, cost: number, weeks: number, support = "90", extra: Answers = {}): SampleProposal {
  const person = sampleContractors.find((c) => c.id === contractorId);
  if (!person) throw new Error("Unknown sample contractor");
  return {
    id, contractorId, status, createdAt: date,
    answers: {
      provider_type: "contractor", years: person.years, capabilities: person.capabilities,
      past_work: `${person.years} years delivering ${person.specialty.toLowerCase()} for community teams; prior work included volunteer onboarding, accessible forms and documented staff handoffs.`,
      summary, approach: "Map the current workflow with staff, retain existing Microsoft 365 accounts, pilot with a small team, migrate only approved records and validate before rollout.",
      cost, weeks, support,
      training_plan: "Deliver two hands-on workshops for staff and volunteers, a recorded walkthrough and an accessible quick-start guide. Train the operations coordinator on permissions, routine reporting and recovery. Verify learning with a practical task and follow up after thirty days.",
      risks: "Volunteer turnover and inconsistent source data. Validate imports, pilot before rollout and assign a named internal owner.", ...extra,
    },
  };
}

function handoff(answers: Answers, title: string, complete: boolean, orgAt: string | null, contractorAt: string | null): SampleHandoff {
  return {
    checklist: defaultChecklist(answers).map((item, index) => ({ ...item, done: complete || index < 4 })),
    implementationDoc: `## Overview\n${title} replaces duplicate manual work with a shared, role-based workflow.\n\n## Systems & configuration\nStaff sign in with organizational accounts and two-factor authentication. Coordinators manage permissions; volunteers see only assigned tasks. Approved spreadsheet records were imported after duplicate review.\n\n## Validation\nStaff tested intake, record updates, reporting and account removal with synthetic records. No real beneficiary information is included in this sample.\n\n## Maintenance\nThe operations coordinator reviews access monthly, checks backups weekly and records license renewal dates. Restore testing is documented in the handoff checklist.`,
    knowledgeBase: `## Quick start\nSign in with your organization account. Open the shared workspace and select your assigned queue. Check required fields before saving.\n\n## Frequently asked questions\nWho can add a volunteer? The operations coordinator approves access.\nHow do I correct a duplicate? Flag both records for the coordinator; do not delete source records.\n\n## Troubleshooting\nFor missing access, contact the coordinator. For a failed import, keep the error report and use the last validated file.\n\n## Support\nThe selected contractor provides the support period in the agreed proposal. Escalate through the operations coordinator; never send beneficiary data in an unprotected message.`,
    organizationConfirmedAt: orgAt, contractorConfirmedAt: contractorAt,
  };
}

const winterAnswers = organizationAnswers("Winter kit requests arrive by phone and paper. Staff need an inventory and distribution register for 85 residents without storing sensitive housing histories.", ["data", "training"], "Every kit is tracked once; coordinators can report stock and distribution totals in under five minutes.", 85);
const healthAnswers = organizationAnswers("Mobile vaccination teams lose connectivity between sites. Shared devices need reliable Wi-Fi, secure sign-in and a documented daily setup process.", ["network", "devices", "security", "training"], "All three mobile teams can connect securely; 120 patients benefit from fewer session delays.", 120, { budget: "50000", timeline: "4", comfort: 3, it_person: "part_time", backups: "automatic", security: ["mfa", "updates", "antivirus"], urgency: "critical" });
const legalAnswers = organizationAnswers("Workshop registration and confidential follow-up requests share an unsecured spreadsheet. Staff need separate public booking and private case intake.", ["website", "data", "security", "training"], "60 attendees can register accessibly, with confidential follow-up restricted to authorized clinic staff.", 60, { comfort: 3, it_person: "part_time", constraints: "No legal case details in public forms. Screen-reader access, English and Spanish registration, retention policy review required." });

export const sampleAssessments: SampleAssessment[] = [
  {
    id: "winter-kits", organizationId: "housing", title: "Winter kit inventory and distribution tracker", createdAt: "2026-09-04T15:10:00Z", status: "completed", answers: winterAnswers,
    proposals: [proposal("winter-maya", "maya", "selected", "2026-09-06T10:00:00Z", "Build a simple inventory register with QR-assisted distribution and coordinator reports in the existing cloud workspace.", 4200, 4, "ongoing"), proposal("winter-leo", "leo", "declined", "2026-09-07T11:00:00Z", "Create a spreadsheet reporting pipeline and inventory dashboard with a documented monthly refresh.", 3000, 3, "30")],
    handoff: handoff(winterAnswers, "Winter kit inventory tracker", true, "2026-10-05T15:10:00Z", "2026-10-04T16:00:00Z"),
  },
  {
    id: "mobile-health", organizationId: "health", title: "Secure connectivity for mobile vaccination teams", createdAt: "2026-09-10T11:20:00Z", status: "completed", answers: healthAnswers,
    proposals: [proposal("health-sofia", "sofia", "selected", "2026-09-11T09:00:00Z", "Configure managed mobile routers, encrypted staff tablets and secure account access; rehearse the daily setup and recovery workflow.", 18500, 4), proposal("health-jordan", "jordan", "declined", "2026-09-12T09:00:00Z", "Automate scheduling and site reporting in a mobile-friendly cloud workspace, using the existing connectivity setup.", 12000, 6, "30")],
    handoff: handoff(healthAnswers, "Mobile clinic connectivity", true, "2026-10-10T11:20:00Z", "2026-10-09T14:00:00Z"),
  },
  {
    id: "legal-intake", organizationId: "legal", title: "Accessible workshop booking and private legal intake", createdAt: "2026-09-18T10:05:00Z", status: "in_progress", answers: legalAnswers,
    proposals: [proposal("legal-maya", "maya", "selected", "2026-09-20T10:00:00Z", "Separate bilingual public workshop registration from restricted case intake, add retention controls and train the clinic coordinator.", 8900, 6), proposal("legal-andre", "andre", "declined", "2026-09-21T10:00:00Z", "Deliver a bilingual accessible registration website and reminder emails. Clinic staff continue managing follow-up records separately.", 5600, 5, "30")],
    handoff: handoff(legalAnswers, "Legal workshop booking and intake", true, null, "2026-10-16T14:30:00Z"),
  },
  {
    id: "senior-events", organizationId: "seniors", title: "Senior center attendance and ride scheduling records", createdAt: "2026-08-20T09:30:00Z", status: "completed",
    answers: organizationAnswers("Sign-up sheets, ride schedules and meal counts live on paper at the front desk. Volunteers spend the first hour of every program copying information by hand, and nothing is kept from month to month.", ["data", "training"], "Staff and volunteers record attendance, meals and ride requests once on a shared tablet, and the coordinator can see last month's totals without paper.", 45, { budget: "0", staff: 4, current_tools: "Paper sign-in sheets, a personal Gmail account and printed schedules.", devices_condition: 2, internet: 3, data_storage: "paper", backups: "none", security: ["antivirus"], pain_points: "No shared record of who attended and no way to plan rides ahead. The center has no technology budget, so help must be volunteered.", comfort: 1, it_person: "none", owner_after: "Program coordinator", documentation: "none", training_needs: ["basics", "security"], learning_format: "in_person", constraints: "No budget — this must be volunteered. Many participants are older adults with low vision, so screens need large text." }),
    proposals: [proposal("senior-ruth", "ruth", "selected", "2026-08-22T10:00:00Z", "Replace the paper sheets with a large-text shared attendance and ride log on one donated tablet, plus patient in-person training for every volunteer shift.", 0, 10, "ongoing", { provider_type: "volunteer", past_work: "Fourteen years volunteering with community centers, senior programs and food shelves; set up simple attendance and scheduling records for three Minneapolis nonprofits at no cost." }), proposal("senior-dan", "dan", "declined", "2026-08-23T09:00:00Z", "Set up a donated computer, secure the guest Wi‑Fi and write a one-page guide volunteers can follow when the desk is unstaffed.", 0, 6, "30", { provider_type: "volunteer", past_work: "Twenty years in desktop support, now volunteering weekends to set up computers and Wi‑Fi for shelters, food shelves and senior centers." })],
    handoff: handoff(seniorAnswers, "Senior center attendance and rides", true, "2026-09-14T15:10:00Z", "2026-09-13T16:00:00Z"),
  },
  {
    id: "shelter-intake", organizationId: "shelter", title: "Night-shift family intake record for the shelter", createdAt: "2026-10-16T17:40:00Z", status: "published",
    answers: organizationAnswers("Intake for families arriving at night is done on paper and a volunteer's personal laptop. Records are not shared between shifts, so a family can be asked the same questions twice and no one can see yesterday's notes.", ["data", "cloud", "training"], "Every intake is recorded once in a private shared system that night volunteers can open from the shelter's own computers, with yesterday's notes available at every shift.", 30, { budget: "0", urgency: "critical", staff: 3, current_tools: "Paper intake forms, a volunteer's personal laptop and group texts.", devices_condition: 2, internet: 3, data_storage: "personal", backups: "none", security: [], pain_points: "Shifts lose information between volunteers, and family details sit on a personal laptop with no backup and no budget to fix it.", comfort: 1, it_person: "none", owner_after: "Shelter director", documentation: "none", training_needs: ["basics", "security"], learning_format: "in_person", constraints: "No budget — this must be volunteered. Family information is sensitive and must stay off personal devices." }),
    proposals: [proposal("shelter-ruth", "ruth", "submitted", "2026-10-17T08:30:00Z", "Build a private shared intake log on free cloud tools the shelter already qualifies for, with a large-text night-shift form and hands-on training each week.", 0, 8, "ongoing", { provider_type: "volunteer", past_work: "Fourteen years volunteering with community centers, senior programs and food shelves; set up simple attendance and scheduling records for three Minneapolis nonprofits at no cost." }), proposal("shelter-dan", "dan", "submitted", "2026-10-17T10:15:00Z", "Secure and reorganize the shelter's existing computers, move records off the personal laptop and train the night volunteers on the new setup.", 0, 12, "30", { provider_type: "volunteer", past_work: "Twenty years in desktop support, now volunteering weekends to set up computers and Wi‑Fi for shelters, food shelves and senior centers." })],
  },
  {
    id: "youth-stem", organizationId: "youth", title: "STEM program attendance and transport coordination", createdAt: "2026-10-01T16:45:00Z", status: "in_progress",
    answers: organizationAnswers("35 young people attend after-school STEM sessions. Attendance, guardian consent and van pickup lists are kept in separate spreadsheets.", ["software", "cloud", "training"], "Staff produce a verified pickup roster in two minutes, with consent checked before every trip.", 35, { constraints: "Protect minors' data; authorized staff only. Guardian consent must be checked before transport." }),
    proposals: [proposal("youth-jordan", "jordan", "selected", "2026-10-03T10:00:00Z", "Connect attendance, consent status and pickup rosters in a staff-only mobile workflow, with scheduled roster exports.", 7800, 8), proposal("youth-andre", "andre", "declined", "2026-10-04T10:00:00Z", "Build staff scheduling forms and automated pickup lists on existing cloud tools, plus volunteer onboarding.", 6200, 14, "30")],
  },
  {
    id: "food-rescue", organizationId: "food", title: "Food rescue dispatch and cold-chain logging", createdAt: "2026-10-14T09:15:00Z", status: "published",
    answers: organizationAnswers("Drivers coordinate refrigerated donations by group text. Missed pickups and incomplete temperature records affect food deliveries for 250 residents.", ["software", "data", "training"], "Dispatchers see pickup status live and every refrigerated delivery has a temperature log.", 250, { budget: "50000", timeline: "4", staff: 18, urgency: "critical", current_tools: "Google Workspace, driver group texts and paper temperature sheets.", comfort: 2, data_storage: "shared_drive", backups: "none" }),
    proposals: [proposal("food-jordan", "jordan", "submitted", "2026-10-15T08:00:00Z", "Pilot a mobile dispatch queue with offline temperature entry, exception alerts and coordinator reports.", 14000, 4, "ongoing"), proposal("food-leo", "leo", "submitted", "2026-10-15T13:00:00Z", "Integrate donation forms and temperature logs into a shared reporting system with daily dispatch exports.", 11000, 6, "90"), proposal("food-maya", "maya", "submitted", "2026-10-16T09:00:00Z", "Create donor intake, driver assignments and cold-chain records in a secure accessible workspace with hands-on training.", 17500, 5, "ongoing")],
  },
  {
    id: "housing-placement", organizationId: "housing", title: "Emergency family housing referral and availability portal", createdAt: "2026-10-15T14:30:00Z", status: "published",
    answers: organizationAnswers("An urgent placement for a four-person household exposed delays in checking partner bed availability. Coordinators need a private referral and availability portal.", ["data", "software", "security", "training"], "Coordinators can find current availability and securely refer a household without repeated phone calls.", 4, { urgency: "critical", timeline: "4", budget: "50000", constraints: "Keep household identities private; role-based partner access. No public addresses for protected housing." }),
    proposals: [],
  },
];

// Early implementation: partial checklist, neither party has confirmed.
const youthSample = sampleAssessments.find((a) => a.id === "youth-stem");
if (youthSample) youthSample.handoff = handoff(youthSample.answers, youthSample.title, false, null, null);

export function rankedSampleProposals(assessment: SampleAssessment) {
  return assessment.proposals.map((p) => ({ ...p, score: matchScore(assessment.answers, p.answers, readinessScore(assessment.answers)) })).sort((a, b) => b.score.total - a.score.total);
}

export function sampleStageLabel(a: SampleAssessment): string {
  if (a.status === "completed") return "Handoff confirmed";
  if (a.handoff?.contractorConfirmedAt || a.handoff?.organizationConfirmedAt) return "Awaiting confirmation";
  if (a.status === "in_progress") return "Handoff underway";
  return a.proposals.length ? "Proposals in" : "Published";
}