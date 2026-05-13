ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS gender text;

ALTER TABLE public.assessments
  ADD CONSTRAINT assessments_gender_check
  CHECK (gender IS NULL OR gender IN ('female','male','non-binary','prefer-not-to-say'));

CREATE OR REPLACE FUNCTION public.create_assessment(
  _personality_answers jsonb,
  _passion_areas text[],
  _current_skills text[],
  _career_matches jsonb,
  _recommended_skills jsonb,
  _session_id text,
  _gender text DEFAULT NULL
)
RETURNS TABLE(id uuid, share_id text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF _session_id IS NULL OR length(_session_id) > 100 THEN
    RAISE EXCEPTION 'Invalid session ID';
  END IF;

  IF _gender IS NOT NULL AND _gender NOT IN ('female','male','non-binary','prefer-not-to-say') THEN
    RAISE EXCEPTION 'Invalid gender value';
  END IF;

  IF NOT public.check_rate_limit('assessments', _session_id, 10, 60) THEN
    RAISE EXCEPTION 'Rate limit exceeded';
  END IF;

  RETURN QUERY
  INSERT INTO assessments (
    personality_answers, passion_areas, current_skills,
    career_matches, recommended_skills, session_id, gender
  ) VALUES (
    _personality_answers, _passion_areas, _current_skills,
    _career_matches, _recommended_skills, _session_id, _gender
  )
  RETURNING assessments.id, assessments.share_id;
END;
$function$;