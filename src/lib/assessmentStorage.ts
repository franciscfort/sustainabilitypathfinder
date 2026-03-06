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

export async function getAssessmentByShareId(shareId: string): Promise<SavedAssessment | null> {
  // Validate shareId format (must be UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(shareId)) {
    console.error("Invalid share ID format");
    return null;
  }

  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("share_id", shareId)
    .single();

  if (error || !data) {
    console.error("Error fetching shared assessment:", error);
    return null;
  }

  return {
    id: data.id,
    created_at: data.created_at,
    personality_answers: data.personality_answers as unknown as Record<string, number>,
    passion_areas: data.passion_areas,
    current_skills: data.current_skills,
    career_matches: data.career_matches as unknown as CareerMatch[],
    recommended_skills: data.recommended_skills as unknown as SkillRecommendation[],
  };
}

export async function getRecentAssessments(limit = 5): Promise<SavedAssessment[]> {
  // Clamp limit to prevent abuse
  const safeLimit = Math.min(Math.max(1, limit), 20);
  const sessionId = getSessionId();

  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(safeLimit);

  if (error) {
    console.error("Error fetching assessments:", error);
    return [];
  }

  return (data || []).map(row => ({
    id: row.id,
    created_at: row.created_at,
    personality_answers: row.personality_answers as unknown as Record<string, number>,
    passion_areas: row.passion_areas,
    current_skills: row.current_skills,
    career_matches: row.career_matches as unknown as CareerMatch[],
    recommended_skills: row.recommended_skills as unknown as SkillRecommendation[],
  }));
}
