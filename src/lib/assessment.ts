// Question definitions and scoring for the organization and business assessments.
// Pure module: safe on server and client, covered by assessment.test.ts.

export type QuestionType = "text" | "textarea" | "select" | "multi" | "scale" | "number";

export interface Question {
  id: string;
  label: string;
  help?: string;
  type: QuestionType;
  options?: { value: string; label: string }[];
  required?: boolean;
  scaleLabels?: [string, string];
}

export interface Section {
  id: string;
  title: string;
  intro: string;
  questions: Question[];
}

export type Answers = Record<string, string | string[] | number | undefined>;

export const NEED_CATEGORIES = [
  { value: "website", label: "Website & online presence" },
  { value: "data", label: "Data, CRM & donor/member records" },
  { value: "network", label: "Internet, Wi‑Fi & networking" },
  { value: "security", label: "Cybersecurity & privacy" },
  { value: "devices", label: "Computers, phones & hardware" },
  { value: "cloud", label: "Email, cloud & productivity tools" },
  { value: "software", label: "Custom software or automation" },
  { value: "training", label: "Digital skills training" },
];

export const BUDGETS = [
  { value: "0", label: "No budget — seeking pro bono", max: 0 },
  { value: "2500", label: "Under $2,500", max: 2500 },
  { value: "10000", label: "$2,500 – $10,000", max: 10000 },
  { value: "50000", label: "$10,000 – $50,000", max: 50000 },
  { value: "200000", label: "Over $50,000", max: 200000 },
];

export const TIMELINES = [
  { value: "4", label: "Within a month", weeks: 4 },
  { value: "12", label: "1–3 months", weeks: 12 },
  { value: "26", label: "3–6 months", weeks: 26 },
  { value: "52", label: "6–12 months", weeks: 52 },
];

export const SUPPORT_LEVELS = [
  { value: "none", label: "Handoff only", rank: 0 },
  { value: "30", label: "30 days of support", rank: 1 },
  { value: "90", label: "90 days of support", rank: 2 },
  { value: "ongoing", label: "Ongoing support plan", rank: 3 },
];

export const ORG_SECTIONS: Section[] = [
  {
    id: "request",
    title: "The request",
    intro: "Describe what you need so solution providers understand the problem, not just the product.",
    questions: [
      { id: "problem", label: "What problem are you trying to solve?", help: "Describe the situation in plain language — who is affected and how.", type: "textarea", required: true },
      { id: "categories", label: "Which areas does this need touch?", type: "multi", options: NEED_CATEGORIES, required: true },
      { id: "success", label: "How will you know this was a success?", help: "e.g. 'Volunteers can sign up online without calling the office.'", type: "textarea", required: true },
      { id: "people_served", label: "How many people will use or benefit from the solution?", type: "number", required: true },
      { id: "urgency", label: "How urgent is this?", type: "select", required: true, options: [
        { value: "critical", label: "Critical — operations are blocked" },
        { value: "high", label: "High — causing real harm or cost" },
        { value: "medium", label: "Medium — a clear improvement" },
        { value: "low", label: "Low — nice to have" },
      ] },
      { id: "budget", label: "What budget is available?", type: "select", required: true, options: BUDGETS },
      { id: "timeline", label: "When do you need it in place?", type: "select", required: true, options: TIMELINES },
      { id: "constraints", label: "Any constraints providers must respect?", help: "Funding rules, accessibility, languages, data privacy laws, existing contracts.", type: "textarea" },
    ],
  },
  {
    id: "current",
    title: "Current technology",
    intro: "A snapshot of what you have today, so solutions build on it rather than replace it blindly.",
    questions: [
      { id: "staff", label: "How many staff and regular volunteers use technology for your work?", type: "number", required: true },
      { id: "current_tools", label: "List the main tools and systems you use today.", help: "Email provider, spreadsheets, accounting software, website platform, etc.", type: "textarea", required: true },
      { id: "devices_condition", label: "How would you rate your computers and devices?", type: "scale", scaleLabels: ["Failing / not enough", "Modern & sufficient"], required: true },
      { id: "internet", label: "How reliable is your internet connection?", type: "scale", scaleLabels: ["Unreliable", "Always works"], required: true },
      { id: "data_storage", label: "Where does your important data live?", type: "select", required: true, options: [
        { value: "paper", label: "Mostly paper" },
        { value: "personal", label: "Personal devices & USB drives" },
        { value: "shared_drive", label: "A shared office computer or server" },
        { value: "cloud", label: "A managed cloud service" },
      ] },
      { id: "backups", label: "How is your data backed up?", type: "select", required: true, options: [
        { value: "none", label: "It isn't" },
        { value: "manual", label: "Manually, now and then" },
        { value: "automatic", label: "Automatically" },
        { value: "tested", label: "Automatically, and we've tested restoring" },
      ] },
      { id: "security", label: "Which security practices are in place?", type: "multi", options: [
        { value: "mfa", label: "Two-factor sign-in" },
        { value: "password_manager", label: "Password manager" },
        { value: "updates", label: "Automatic updates" },
        { value: "antivirus", label: "Antivirus / device protection" },
        { value: "access_review", label: "Access removed when people leave" },
      ] },
      { id: "pain_points", label: "What breaks, slows you down, or worries you most?", type: "textarea", required: true },
    ],
  },
  {
    id: "knowledge",
    title: "In-house knowledge",
    intro: "This shapes how much training and support a provider must include so the solution lasts after handoff.",
    questions: [
      { id: "comfort", label: "How comfortable is your team with technology overall?", type: "scale", scaleLabels: ["Struggles with basics", "Confident power users"], required: true },
      { id: "it_person", label: "Who handles technology today?", type: "select", required: true, options: [
        { value: "none", label: "No one in particular" },
        { value: "volunteer", label: "A volunteer or staff member, informally" },
        { value: "part_time", label: "A part-time IT person or contractor" },
        { value: "full_time", label: "Dedicated IT staff" },
      ] },
      { id: "owner_after", label: "Who will own and maintain the solution after handoff?", help: "Name a role, not a person, if possible.", type: "text", required: true },
      { id: "documentation", label: "Do you have documentation of your current systems?", type: "select", required: true, options: [
        { value: "none", label: "None — it's in people's heads" },
        { value: "partial", label: "Some notes and passwords written down" },
        { value: "good", label: "Up-to-date written documentation" },
      ] },
      { id: "training_needs", label: "What training would help most?", type: "multi", options: [
        { value: "basics", label: "Everyday basics" },
        { value: "admin", label: "Administering the new system" },
        { value: "security", label: "Security awareness" },
        { value: "data", label: "Reporting & working with data" },
      ] },
      { id: "learning_format", label: "How does your team prefer to learn?", type: "select", options: [
        { value: "in_person", label: "In-person sessions" },
        { value: "video", label: "Live video calls" },
        { value: "written", label: "Written guides" },
        { value: "recorded", label: "Recorded videos" },
      ] },
    ],
  },
];

export const BUSINESS_SECTIONS: Section[] = [
  {
    id: "provider",
    title: "About you",
    intro: "Tell the organization who they'd be working with.",
    questions: [
      { id: "provider_type", label: "What kind of provider are you?", type: "select", required: true, options: [
        { value: "business", label: "Established business" },
        { value: "small_business", label: "Small business" },
        { value: "contractor", label: "Independent contractor" },
      ] },
      { id: "years", label: "Years of relevant experience", type: "number", required: true },
      { id: "capabilities", label: "Which areas can you deliver?", type: "multi", options: NEED_CATEGORIES, required: true },
      { id: "past_work", label: "Describe similar work you've done, ideally with mission-driven groups.", type: "textarea", required: true },
      { id: "portfolio", label: "Portfolio or references link", type: "text" },
    ],
  },
  {
    id: "solution",
    title: "Your solution",
    intro: "Respond to this organization's specific request, current setup and in-house knowledge.",
    questions: [
      { id: "summary", label: "Summarize your proposed solution.", type: "textarea", required: true },
      { id: "approach", label: "How will you build on what they already have?", type: "textarea", required: true },
      { id: "cost", label: "Total estimated cost (USD)", help: "Enter 0 for pro bono.", type: "number", required: true },
      { id: "weeks", label: "Estimated time to complete (weeks)", type: "number", required: true },
      { id: "support", label: "What support do you include after handoff?", type: "select", required: true, options: SUPPORT_LEVELS },
      { id: "training_plan", label: "How will you train the team to own this?", type: "textarea", required: true },
      { id: "risks", label: "What risks do you see, and how will you manage them?", type: "textarea" },
    ],
  },
];

// ---------- helpers ----------
const asArray = (v: Answers[string]): string[] => (Array.isArray(v) ? v : v ? [String(v)] : []);
const asNum = (v: Answers[string]): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export function missingRequired(sections: Section[], answers: Answers): string[] {
  const missing: string[] = [];
  for (const s of sections)
    for (const q of s.questions) {
      if (!q.required) continue;
      const v = answers[q.id];
      if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) missing.push(q.id);
    }
  return missing;
}

/**
 * Readiness score 0–100: how well-equipped the organization is to adopt and keep
 * a new solution. Half current technology, half in-house knowledge.
 */
export function readinessScore(a: Answers): number {
  const scale = (v: Answers[string]) => Math.min(5, Math.max(1, asNum(v) || 1)); // 1..5
  const storage = { paper: 0, personal: 1, shared_drive: 2, cloud: 3 }[String(a["data_storage"])] ?? 0;
  const backups = { none: 0, manual: 1, automatic: 2, tested: 3 }[String(a["backups"])] ?? 0;
  const security = Math.min(5, asArray(a["security"]).length);
  const tech =
    ((scale(a["devices_condition"]) - 1) / 4) * 10 +
    ((scale(a["internet"]) - 1) / 4) * 10 +
    (storage / 3) * 10 +
    (backups / 3) * 10 +
    (security / 5) * 10; // max 50

  const itPerson = { none: 0, volunteer: 1, part_time: 2, full_time: 3 }[String(a["it_person"])] ?? 0;
  const docs = { none: 0, partial: 1, good: 2 }[String(a["documentation"])] ?? 0;
  const knowledge =
    ((scale(a["comfort"]) - 1) / 4) * 20 + (itPerson / 3) * 20 + (docs / 2) * 10; // max 50

  return Math.round(tech + knowledge);
}

export interface MatchBreakdown {
  coverage: number; // /40
  budget: number; // /20
  timeline: number; // /15
  support: number; // /15
  training: number; // /10
  total: number; // /100
}

/**
 * Automatic match score for a business proposal against an organization's need.
 * Organizations with low readiness weight post-handoff support more heavily.
 */
export function matchScore(org: Answers, biz: Answers, readiness = readinessScore(org)): MatchBreakdown {
  const needed = asArray(org["categories"]);
  const offered = new Set(asArray(biz["capabilities"]));
  const covered = needed.filter((c) => offered.has(c)).length;
  const coverage = needed.length ? Math.round((covered / needed.length) * 40) : 40;

  const max = BUDGETS.find((b) => b.value === String(org["budget"]))?.max ?? 0;
  const cost = asNum(biz["cost"]);
  let budget: number;
  if (cost <= max) budget = 20;
  else if (max === 0) budget = 0;
  else budget = Math.max(0, Math.round(20 * (1 - (cost - max) / max)));

  const wantWeeks = TIMELINES.find((t) => t.value === String(org["timeline"]))?.weeks ?? 12;
  const weeks = asNum(biz["weeks"]) || wantWeeks;
  const timeline = weeks <= wantWeeks ? 15 : Math.max(0, Math.round(15 * (1 - (weeks - wantWeeks) / wantWeeks)));

  const rank = SUPPORT_LEVELS.find((s) => s.value === String(biz["support"]))?.rank ?? 0;
  // Low-readiness orgs need ongoing support (rank 3); high-readiness orgs are fine with 30 days (rank 1).
  const neededRank = readiness < 40 ? 3 : readiness < 70 ? 2 : 1;
  const support = Math.round(15 * Math.min(1, rank / neededRank));

  const plan = String(biz["training_plan"] ?? "").trim().length;
  const training = plan >= 200 ? 10 : plan >= 80 ? 7 : plan > 0 ? 4 : 0;

  return { coverage, budget, timeline, support, training, total: coverage + budget + timeline + support + training };
}

export function labelFor(sections: Section[], qid: string, value: Answers[string]): string {
  const q = sections.flatMap((s) => s.questions).find((x) => x.id === qid);
  if (!q) return String(value ?? "");
  if (q.options) {
    const vals = asArray(value);
    return vals.map((v) => q.options!.find((o) => o.value === v)?.label ?? v).join(", ");
  }
  if (q.type === "scale") return `${value ?? "–"} / 5`;
  return String(value ?? "");
}

// ---------- lifecycle stages shown on the timeline progress bar ----------
export const STAGES = ["Assessed", "Published", "Proposals in", "Provider selected", "Handoff confirmed"] as const;

export function stageIndex(status: string, proposalCount: number): number {
  if (status === "completed") return 4;
  if (status === "in_progress") return 3;
  if (status === "draft") return 0;
  return proposalCount > 0 ? 2 : 1;
}

/** Advisory completion estimate: readiness contributes 20%, lifecycle milestones
 * contribute 80%. Only the mutually confirmed completed status reaches 100%. */
export function completionScore(readiness: number, status: string, proposalCount: number): number {
  if (status === "completed") return 100;
  const safeReadiness = Number.isFinite(readiness) ? Math.min(100, Math.max(0, readiness)) : 0;
  return Math.round(safeReadiness * 0.2 + stageIndex(status, proposalCount) * 20);
}
