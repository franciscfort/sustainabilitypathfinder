import { supabase } from "@/integrations/supabase/client";
import { AssessmentAnswers, AssessmentResult, CareerMatch, SkillRecommendation } from "./careerMatcher";
import { Json } from "@/integrations/supabase/types";
import { assessmentAnswersSchema, checkClientRateLimit } from "./validation";

/**
 * Generate or retrieve a stable anonymous session ID.
 * Used for rate limiting and associating assessments with sessions.
 */
function getSessionId(): string {
  const key = "sustainability-pathfinder-session";
  let sessionId = localStorage.getItem(key);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(key, sessionId);
  }
  return sessionId;
}

export { getSessionId };

export interface SavedAssessment {
  id: string;
  created_at: string;
  personality_answers: Record<string, number>;
  passion_areas: string[];
  current_skills: string[];
  career_matches: CareerMatch[];
  recommended_skills: SkillRecommendation[];
}

export async function saveAssessment(
  answers: AssessmentAnswers,
  results: AssessmentResult
): Promise<{ id: string | null; shareId: string | null; error: Error | null }> {
  try {
    // Client-side rate limiting (defense-in-depth; DB RLS enforces server-side)
    if (!checkClientRateLimit("assessment", 10, 60_000)) {
      return { id: null, shareId: null, error: new Error("Too many requests. Please wait.") };
    }

    // Validate inputs against schema before sending to DB
    const validation = assessmentAnswersSchema.safeParse(answers);
    if (!validation.success) {
      console.error("Assessment validation failed:", validation.error.errors);
      return { id: null, shareId: null, error: new Error(validation.error.errors[0].message) };
    }

    const sessionId = getSessionId();
    const validAnswers = validation.data;

    const { data, error } = await supabase
      .from("assessments")
      .insert({
        personality_answers: validAnswers.personality as unknown as Json,
        passion_areas: validAnswers.passions,
        current_skills: validAnswers.skills,
        career_matches: results.topCareers as unknown as Json,
        recommended_skills: results.recommendedSkills as unknown as Json,
        session_id: sessionId,
      })
      .select("id, share_id")
      .single();

    if (error) {
      // Handle rate limit from RLS gracefully
      if (error.message?.includes("row-level security")) {
        return { id: null, shareId: null, error: new Error("Too many requests. Please wait.") };
      }
      console.error("Error saving assessment:", error);
      return { id: null, shareId: null, error: new Error(error.message) };
    }

    return { id: data.id, shareId: data.share_id, error: null };
  } catch (err) {
    console.error("Error saving assessment:", err);
    return { id: null, shareId: null, error: err as Error };
  }
}

/**
 * Fetch a shared assessment via secure RPC function (not direct table access).
 * The RPC function validates share_id format and uses SECURITY DEFINER.
 */
export async function getAssessmentByShareId(shareId: string): Promise<SavedAssessment | null> {
  // Client-side UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(shareId)) {
    console.error("Invalid share ID format");
    return null;
  }

  const { data, error } = await supabase.rpc("get_assessment_by_share_id", {
    _share_id: shareId,
  });

  if (error || !data || data.length === 0) {
    console.error("Error fetching shared assessment:", error);
    return null;
  }

  const row = data[0];
  return {
    id: row.id,
    created_at: row.created_at,
    personality_answers: row.personality_answers as unknown as Record<string, number>,
    passion_areas: row.passion_areas,
    current_skills: row.current_skills,
    career_matches: row.career_matches as unknown as CareerMatch[],
    recommended_skills: row.recommended_skills as unknown as SkillRecommendation[],
  };
}

/**
 * Fetch recent assessments for the current session via secure RPC function.
 */
export async function getRecentAssessments(limit = 5): Promise<SavedAssessment[]> {
  const safeLimit = Math.min(Math.max(1, limit), 20);
  const sessionId = getSessionId();

  const { data, error } = await supabase.rpc("get_recent_assessments", {
    _session_id: sessionId,
    _limit: safeLimit,
  });

  if (error) {
    console.error("Error fetching assessments:", error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    created_at: row.created_at,
    personality_answers: row.personality_answers as unknown as Record<string, number>,
    passion_areas: row.passion_areas,
    current_skills: row.current_skills,
    career_matches: row.career_matches as unknown as CareerMatch[],
    recommended_skills: row.recommended_skills as unknown as SkillRecommendation[],
  }));
}
