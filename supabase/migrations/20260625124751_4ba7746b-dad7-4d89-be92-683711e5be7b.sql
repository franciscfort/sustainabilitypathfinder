DROP FUNCTION IF EXISTS public.get_assessment_by_share_id(text);

CREATE FUNCTION public.get_assessment_by_share_id(_share_id text)
RETURNS TABLE(
  id uuid,
  created_at timestamptz,
  personality_answers jsonb,
  passion_areas text[],
  current_skills text[],
  career_matches jsonb,
  recommended_skills jsonb,
  share_id text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _share_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT a.id, a.created_at, a.personality_answers,
         a.passion_areas, a.current_skills, a.career_matches,
         a.recommended_skills, a.share_id
  FROM assessments a
  WHERE a.share_id = _share_id
  LIMIT 1;
END;
$$;