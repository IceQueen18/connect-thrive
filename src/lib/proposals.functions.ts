import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { BUSINESS_SECTIONS, matchScore, missingRequired, type Answers } from "./assessment";

const input = z.object({
  assessmentId: z.string().uuid(),
  businessName: z.string().trim().min(1).max(150),
  answers: z.record(z.union([z.string().max(5000), z.number(), z.array(z.string().max(50)).max(20)])),
});

// Proposals are inserted server-side so the automatic match score can't be tampered with.
export const submitProposal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isBiz } = await supabase.rpc("has_role", { _user_id: userId, _role: "business" });
    if (!isBiz) throw new Error("Only business accounts can submit proposals.");

    const answers = data.answers as Answers;
    if (missingRequired(BUSINESS_SECTIONS, answers).length) throw new Error("Please answer all required questions.");

    const { data: need, error } = await supabase
      .from("org_assessments")
      .select("id, answers, readiness_score, status")
      .eq("id", data.assessmentId)
      .single();
    if (error || !need) throw new Error("Need not found.");
    if (need.status !== "published") throw new Error("This need is no longer accepting proposals.");

    const breakdown = matchScore(need.answers as Answers, answers, need.readiness_score);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: insErr } = await supabaseAdmin.from("proposals").insert({
      assessment_id: data.assessmentId,
      business_id: userId,
      business_name: data.businessName,
      answers,
      match_score: breakdown.total,
      score_breakdown: breakdown as unknown as Record<string, number>,
    });
    if (insErr) throw new Error(insErr.code === "23505" ? "You already submitted a proposal for this need." : "Could not save proposal.");
    return { score: breakdown.total };
  });
