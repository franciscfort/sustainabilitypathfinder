-- RPC function to insert an assessment and return id + share_id.
-- This bypasses the restrictive SELECT policy via SECURITY DEFINER.
CREATE OR REPLACE FUNCTION public.create_assessment(
  _personality_answers jsonb,
  _passion_areas text[],
  _current_skills text[],
  _career_matches jsonb,
  _recommended_skills jsonb,
  _session_id text
)
RETURNS TABLE(id uuid, share_id text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate session_id
  IF _session_id IS NULL OR length(_session_id) > 100 THEN
    RAISE EXCEPTION 'Invalid session ID';
  END IF;

  -- Check rate limit
  IF NOT public.check_rate_limit('assessments', _session_id, 10, 60) THEN
    RAISE EXCEPTION 'Rate limit exceeded';
  END IF;

  RETURN QUERY
  INSERT INTO assessments (
    personality_answers, passion_areas, current_skills,
    career_matches, recommended_skills, session_id
  ) VALUES (
    _personality_answers, _passion_areas, _current_skills,
    _career_matches, _recommended_skills, _session_id
  )
  RETURNING assessments.id, assessments.share_id;
END;
$$;