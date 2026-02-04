import { supabase } from "@/integrations/supabase/client";
import { AssessmentAnswers, AssessmentResult, CareerMatch, SkillRecommendation } from "./careerMatcher";
import { Json } from "@/integrations/supabase/types";

// Generate a session ID for anonymous users
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
): Promise<{ id: string | null; error: Error | null }> {
  try {
    const sessionId = getSessionId();
    
    const { data, error } = await supabase
      .from("assessments")
      .insert({
        personality_answers: answers.personality as unknown as Json,
        passion_areas: answers.passions,
        current_skills: answers.skills,
        career_matches: results.topCareers as unknown as Json,
        recommended_skills: results.recommendedSkills as unknown as Json,
        session_id: sessionId,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error saving assessment:", error);
      return { id: null, error: new Error(error.message) };
    }

    return { id: data.id, error: null };
  } catch (err) {
    console.error("Error saving assessment:", err);
    return { id: null, error: err as Error };
  }
}

export async function getRecentAssessments(limit = 5): Promise<SavedAssessment[]> {
  const sessionId = getSessionId();
  
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching assessments:", error);
    return [];
  }

  // Map the database rows to our typed interface
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
