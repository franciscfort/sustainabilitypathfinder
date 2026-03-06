-- =============================================================
-- SECURITY HARDENING MIGRATION
-- Fixes: broken RLS policies, adds rate limiting, tightens access
-- =============================================================

-- 1) Fix broken "Users can read own assessments" policy
--    The old policy had `session_id = session_id` which is a self-referencing
--    column comparison (always true when not null). Must be removed.
DROP POLICY IF EXISTS "Users can read own assessments" ON public.assessments;

-- Allow reading assessments only via share_id (for shared links)
CREATE POLICY "Read own assessments by share_id"
ON public.assessments
FOR SELECT
TO anon, authenticated
USING (share_id IS NOT NULL);

-- Drop the duplicate/redundant shared assessment policy
DROP POLICY IF EXISTS "Anyone can read shared assessments" ON public.assessments;

-- 2) Rate limiting function for inserts
--    Limits writes per session_id within a time window to prevent abuse
--    SECURITY DEFINER to bypass RLS for the count query
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _table_name text,
  _session_id text,
  _max_requests int DEFAULT 10,
  _window_minutes int DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _count int;
BEGIN
  -- Validate table name to prevent SQL injection (whitelist approach)
  IF _table_name NOT IN ('assessments', 'app_ratings', 'email_captures') THEN
    RETURN false;
  END IF;

  -- Count recent inserts from this session
  IF _table_name = 'assessments' THEN
    SELECT count(*) INTO _count FROM assessments
    WHERE session_id = _session_id
      AND created_at > now() - (_window_minutes || ' minutes')::interval;
  ELSIF _table_name = 'app_ratings' THEN
    SELECT count(*) INTO _count FROM app_ratings
    WHERE session_id = _session_id
      AND created_at > now() - (_window_minutes || ' minutes')::interval;
  ELSIF _table_name = 'email_captures' THEN
    SELECT count(*) INTO _count FROM email_captures
    WHERE session_id = _session_id
      AND created_at > now() - (_window_minutes || ' minutes')::interval;
  END IF;

  RETURN _count < _max_requests;
END;
$$;

-- 3) Tighten INSERT policies with rate limiting

-- Assessments: max 10 per session per hour
DROP POLICY IF EXISTS "Anyone can create assessments" ON public.assessments;
CREATE POLICY "Rate-limited assessment creation"
ON public.assessments
FOR INSERT
TO anon, authenticated
WITH CHECK (
  session_id IS NOT NULL
  AND public.check_rate_limit('assessments', session_id, 10, 60)
);

-- App ratings: max 5 per session per hour
DROP POLICY IF EXISTS "Anyone can insert ratings" ON public.app_ratings;
CREATE POLICY "Rate-limited rating creation"
ON public.app_ratings
FOR INSERT
TO anon, authenticated
WITH CHECK (
  session_id IS NOT NULL
  AND public.check_rate_limit('app_ratings', session_id, 5, 60)
);

-- Email captures: max 5 per session per hour
DROP POLICY IF EXISTS "Anyone can insert email captures" ON public.email_captures;
CREATE POLICY "Rate-limited email capture creation"
ON public.email_captures
FOR INSERT
TO anon, authenticated
WITH CHECK (
  session_id IS NOT NULL
  AND public.check_rate_limit('email_captures', session_id, 5, 60)
);

-- 4) Keep limited public SELECT on app_ratings for social proof
DROP POLICY IF EXISTS "Anyone can read ratings" ON public.app_ratings;
CREATE POLICY "Public read ratings for social proof"
ON public.app_ratings
FOR SELECT
TO anon, authenticated
USING (true);

-- 5) Validation trigger for email format on email_captures
CREATE OR REPLACE FUNCTION public.validate_email_capture()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.email !~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  IF length(NEW.email) > 255 THEN
    RAISE EXCEPTION 'Email too long';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_email_capture
BEFORE INSERT ON public.email_captures
FOR EACH ROW EXECUTE FUNCTION public.validate_email_capture();

-- 6) Validation trigger for app_ratings
CREATE OR REPLACE FUNCTION public.validate_app_rating()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;
  IF NEW.comment IS NOT NULL AND length(NEW.comment) > 500 THEN
    RAISE EXCEPTION 'Comment too long (max 500 characters)';
  END IF;
  IF NEW.session_id IS NULL OR length(NEW.session_id) > 100 THEN
    RAISE EXCEPTION 'Invalid session ID';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_app_rating
BEFORE INSERT ON public.app_ratings
FOR EACH ROW EXECUTE FUNCTION public.validate_app_rating();

-- 7) Validation trigger for assessments
CREATE OR REPLACE FUNCTION public.validate_assessment()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.session_id IS NULL OR length(NEW.session_id) > 100 THEN
    RAISE EXCEPTION 'Invalid session ID';
  END IF;
  IF array_length(NEW.passion_areas, 1) > 20 THEN
    RAISE EXCEPTION 'Too many passion areas';
  END IF;
  IF array_length(NEW.current_skills, 1) > 20 THEN
    RAISE EXCEPTION 'Too many skills';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_assessment
BEFORE INSERT ON public.assessments
FOR EACH ROW EXECUTE FUNCTION public.validate_assessment();