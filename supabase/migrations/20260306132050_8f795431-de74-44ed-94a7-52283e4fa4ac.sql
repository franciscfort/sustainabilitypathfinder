-- 1) Fix assessments: remove broad SELECT policy, add RPC for share_id lookup
--    The old policy `share_id IS NOT NULL` returned ALL assessments.
--    Instead, use an RPC function that takes a specific share_id parameter.
DROP POLICY IF EXISTS "Read own assessments by share_id" ON public.assessments;

-- No SELECT policy on assessments via direct table access.
-- Shared results are fetched via the secure RPC function below.

-- RPC function to fetch a single assessment by its share_id (UUID).
-- SECURITY DEFINER bypasses RLS so no SELECT policy is needed.
CREATE OR REPLACE FUNCTION public.get_assessment_by_share_id(_share_id text)
RETURNS SETOF public.assessments
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate share_id is a UUID format to prevent abuse
  IF _share_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT * FROM assessments WHERE share_id = _share_id LIMIT 1;
END;
$$;

-- RPC function to fetch recent assessments by session_id.
-- SECURITY DEFINER bypasses RLS; validates session_id format.
CREATE OR REPLACE FUNCTION public.get_recent_assessments(_session_id text, _limit int DEFAULT 5)
RETURNS SETOF public.assessments
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate session_id is a UUID format
  IF _session_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    RETURN;
  END IF;

  -- Clamp limit
  IF _limit < 1 THEN _limit := 1; END IF;
  IF _limit > 20 THEN _limit := 20; END IF;

  RETURN QUERY
  SELECT * FROM assessments
  WHERE session_id = _session_id
  ORDER BY created_at DESC
  LIMIT _limit;
END;
$$;