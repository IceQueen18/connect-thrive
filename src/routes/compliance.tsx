import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/compliance")({
  head: () => ({
    meta: [
      { title: "AI & Data Compliance Policy — TechBridge Consulting" },
      { name: "description", content: "Data-sharing rules, automated proposal scoring, and safeguards for sensitive information at TechBridge Consulting." },
      { property: "og:title", content: "AI & Data Compliance Policy — TechBridge Consulting" },
      { property: "og:description", content: "Understand assessment visibility, responsible AI use, and data-protection requirements." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompliancePage,
});

function CompliancePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5">
          <Link to="/" className="font-display text-xl font-semibold text-primary">TechBridge Consulting</Link>
          <Button asChild variant="outline" size="sm"><Link to="/"><ArrowLeft aria-hidden="true" />Home</Link></Button>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div className="flex items-center gap-2 text-sm font-medium text-primary"><ShieldCheck className="size-5" aria-hidden="true" />Responsible data use</div>
        <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">AI &amp; Data Compliance Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">Draft for review · Updated October 17, 2026</p>
        <p className="mt-6 text-lg leading-relaxed">Protecting the people behind each technology request is more important than sharing every detail of that request.</p>
        <div className="mt-8 border-l-4 border-accent bg-muted px-5 py-4">
          <p className="font-semibold">Important: published assessments are not confidential.</p>
          <p className="mt-2 text-sm leading-relaxed">The current app makes all answers in a published assessment available to signed-in accounts, not only the selected provider. Do not include sensitive information. This policy does not add technical restrictions or certify legal compliance.</p>
        </div>

        <div className="mt-10 space-y-8 leading-relaxed">
          <section aria-labelledby="scope">
            <h2 id="scope" className="text-2xl font-semibold">1. Purpose and scope</h2>
            <p className="mt-3 text-muted-foreground">This draft sets expectations for organizations, businesses, independent contractors, and administrators using TechBridge Consulting. It covers assessments, proposals, implementation documentation, checklists, and knowledge bases. It is not a complete privacy notice or a substitute for legal advice.</p>
          </section>
          <section aria-labelledby="minimum-data">
            <h2 id="minimum-data" className="text-2xl font-semibold">2. Share only what is necessary</h2>
            <p className="mt-3 text-muted-foreground">Describe technology needs with aggregate counts, role names, and anonymous examples. Only submit information you are authorized to share.</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
              <li>Do not enter client or patient names, medical records, confidential legal case details, identifying information about minors, or other sensitive personal data.</li>
              <li>Do not include passwords, access tokens, private keys, financial account details, or identification documents.</li>
              <li>Use sanitized examples rather than real client records in proposals, documentation, and knowledge bases.</li>
            </ul>
          </section>
          <section aria-labelledby="visibility">
            <h2 id="visibility" className="text-2xl font-semibold">3. Visibility and confidentiality</h2>
            <p className="mt-3 text-muted-foreground">Published assessments, including their current technology and security answers, are readable by any signed-in account. Proposal answers are available to the submitting provider and the assessment owner. Project handoff materials are intended for the participating organization and selected provider, with administrative access where authorized.</p>
            <p className="mt-3 text-muted-foreground">Signing in does not make a published assessment private. Before publishing, organizations should review every answer for personal information, confidential material, and security details that should not be shared broadly. Providers must not reuse information received through the app for unrelated purposes.</p>
          </section>
          <section aria-labelledby="ai">
            <h2 id="ai" className="text-2xl font-semibold">4. Automated scoring and responsible AI</h2>
            <p className="mt-3 text-muted-foreground">The current readiness and proposal-fit scores use a fixed formula, not generative AI. Fit considers capability coverage, budget, timeline, support, and training-plan length. Scores are advisory: they do not verify credentials, assess legal compliance, or guarantee quality. The organization makes the final provider selection.</p>
            <p className="mt-3 text-muted-foreground">A longer training plan can receive more points without necessarily being better. Organizations should review actual deliverables, references, feasibility, and training quality rather than rely on rank alone.</p>
            <p className="mt-3 text-muted-foreground">If participants use AI to draft responses, they remain responsible for accuracy and must not submit confidential or personal information to external AI tools without appropriate authorization and safeguards. Before any future in-app AI processing, provider data retention, model-training use, processing locations, and contractual protections must be reviewed.</p>
          </section>
          <section aria-labelledby="legal">
            <h2 id="legal" className="text-2xl font-semibold">5. Applicable laws and agreements</h2>
            <p className="mt-3 text-muted-foreground">Requirements depend on the information, jurisdiction, and each party’s role. GDPR may apply where its territorial requirements are met. HIPAA may apply to certain covered-entity or business-associate arrangements involving protected health information. Neither applies automatically because an organization works in health or community services.</p>
            <p className="mt-3 text-muted-foreground">Do not use this app for regulated or sensitive records until the necessary legal review, agreements, and technical safeguards are in place. Both parties confirming a handoff confirms project obligations; it is not a compliance certification.</p>
          </section>
          <section aria-labelledby="retention">
            <h2 id="retention" className="text-2xl font-semibold">6. Retention, requests, and incidents</h2>
            <p className="mt-3 text-muted-foreground">A verified retention schedule, backup-deletion process, and formal privacy-request procedure have not yet been established for this policy. No automatic deletion period or response deadline is promised here.</p>
            <p className="mt-3 text-muted-foreground">If sensitive information is entered or unauthorized access is suspected, stop sharing it and notify your organization’s designated contact and the project administrator through an existing trusted channel. Do not copy the sensitive content into another assessment or proposal. A dedicated privacy contact and incident-response process must be designated before sensitive-data use.</p>
          </section>
          <section aria-labelledby="next-safeguards">
            <h2 id="next-safeguards" className="text-2xl font-semibold">7. Safeguards required before sensitive-data use</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
              <li>Separate a sanitized published request from restricted assessment details.</li>
              <li>Add publication review and clear warnings against entering sensitive information.</li>
              <li>Review access controls and establish retention, deletion, and incident-response procedures.</li>
              <li>Complete applicable data-processing agreements and a full privacy notice with a verified contact.</li>
              <li>Review fairness and quality of automatic scoring, keeping meaningful human selection.</li>
            </ul>
            <p className="mt-3 text-muted-foreground">These are required follow-up safeguards, not claims that they are already implemented. This draft requires approval by the project owner and appropriate legal review before being treated as an operational compliance policy.</p>
          </section>
        </div>
        <div className="mt-12 border-t pt-6"><Button asChild variant="outline"><Link to="/"><ArrowLeft aria-hidden="true" />Back to home</Link></Button></div>
      </main>
    </div>
  );
}