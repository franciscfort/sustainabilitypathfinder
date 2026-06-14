
ALTER TABLE public.assessments
  ADD COLUMN IF NOT EXISTS career_stage text,
  ADD COLUMN IF NOT EXISTS experience_level text,
  ADD COLUMN IF NOT EXISTS current_goal text;

CREATE OR REPLACE FUNCTION public.create_assessment(
  _personality_answers jsonb,
  _passion_areas text[],
  _current_skills text[],
  _career_matches jsonb,
  _recommended_skills jsonb,
  _session_id text,
  _gender text DEFAULT NULL,
  _country text DEFAULT NULL,
  _career_stage text DEFAULT NULL,
  _experience_level text DEFAULT NULL,
  _current_goal text DEFAULT NULL
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

  IF _country IS NOT NULL AND _country !~ '^[A-Z]{2}$' THEN
    RAISE EXCEPTION 'Invalid country code';
  END IF;

  IF _career_stage IS NOT NULL AND _career_stage NOT IN (
    'student','recent-graduate','early-career','mid-career','senior','career-switcher','entrepreneur','ngo-development'
  ) THEN
    RAISE EXCEPTION 'Invalid career stage';
  END IF;

  IF _experience_level IS NOT NULL AND _experience_level NOT IN (
    'beginner','basic-awareness','intermediate','advanced','expert'
  ) THEN
    RAISE EXCEPTION 'Invalid experience level';
  END IF;

  IF _current_goal IS NOT NULL AND _current_goal NOT IN (
    'break-in','identify-path','develop-skills','transition','advance','consultant','build-business','find-jobs','strengthen-esg','carbon-climate-finance'
  ) THEN
    RAISE EXCEPTION 'Invalid current goal';
  END IF;

  IF NOT public.check_rate_limit('assessments', _session_id, 10, 60) THEN
    RAISE EXCEPTION 'Rate limit exceeded';
  END IF;

  RETURN QUERY
  INSERT INTO assessments (
    personality_answers, passion_areas, current_skills,
    career_matches, recommended_skills, session_id,
    gender, country, career_stage, experience_level, current_goal
  ) VALUES (
    _personality_answers, _passion_areas, _current_skills,
    _career_matches, _recommended_skills, _session_id,
    _gender, _country, _career_stage, _experience_level, _current_goal
  )
  RETURNING assessments.id, assessments.share_id;
END;
$function$;
