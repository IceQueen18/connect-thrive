import { NEED_CATEGORIES, type Answers } from "./assessment";

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

/** Starter handoff checklist tailored to the organization's assessment answers. */
export function defaultChecklist(org: Answers): ChecklistItem[] {
  const owner = String(org["owner_after"] || "the designated owner");
  const items: string[] = [
    "Implementation documentation written and reviewed with the organization",
    `All accounts, passwords and admin access transferred to ${owner}`,
    "Vendor contracts, licenses and renewal dates listed in the knowledge base",
  ];
  for (const c of (org["categories"] as string[]) ?? []) {
    const label = NEED_CATEGORIES.find((x) => x.value === c)?.label;
    if (label) items.push(`${label}: delivered, tested and demonstrated to staff`);
  }
  if (org["backups"] === "none" || org["backups"] === "manual") items.push("Automatic backups set up and a test restore completed");
  if (!((org["security"] as string[]) ?? []).includes("mfa")) items.push("Two-factor sign-in turned on for all admin accounts");
  for (const t of (org["training_needs"] as string[]) ?? []) items.push(`Training session completed: ${t.replace("_", " ")}`);
  items.push("Post-handoff support contact and terms agreed in writing");
  return items.map((text, i) => ({ id: `c${i}`, text, done: false }));
}

export const DOC_TEMPLATE = `## Overview
What was built and why.

## Systems & components
List every system, where it lives and who has access.

## Setup & configuration
Step-by-step notes on how it was set up.

## Day-to-day operation
How staff use it.

## Maintenance
Updates, backups, renewals and who does them.
`;

export const KB_TEMPLATE = `## Quick start
## Frequently asked questions
## Troubleshooting
## Contacts & support
`;
