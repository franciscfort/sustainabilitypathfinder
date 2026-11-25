DROP FUNCTION IF EXISTS public.get_recent_assessments(text, integer);
CREATE FUNCTION public.get_recent_assessments(_session_id text, _limit integer DEFAULT 5)
RETURNS TABLE(id uuid, created_at timestamptz, personality_answers jsonb, passion_areas text[], current_skills text[], career_matches jsonb, recommended_skills jsonb)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF _session_id IS NULL OR _session_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' THEN
    RETURN;
  END IF;
  IF _limit IS NULL OR _limit < 1 THEN _limit := 1; END IF;
  IF _limit > 20 THEN _limit := 20; END IF;
  RETURN QUERY
  SELECT a.id, a.created_at, a.personality_answers, a.passion_areas, a.current_skills, a.career_matches, a.recommended_skills
  FROM public.assessments a
  WHERE a.session_id = _session_id
  ORDER BY a.created_at DESC
  LIMIT _limit;
END;
$$;
REVOKE ALL ON FUNCTION public.get_recent_assessments(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_recent_assessments(text, integer) TO anon, authenticated;