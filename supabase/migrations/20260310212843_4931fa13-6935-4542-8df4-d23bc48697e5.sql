
-- Fix: The INSERT policies are RESTRICTIVE but there are no PERMISSIVE policies,
-- so all inserts are blocked. Convert them to PERMISSIVE.

-- app_ratings
DROP POLICY IF EXISTS "Rate-limited rating creation" ON public.app_ratings;
CREATE POLICY "Rate-limited rating creation"
ON public.app_ratings FOR INSERT TO anon, authenticated
WITH CHECK (
  session_id IS NOT NULL
  AND check_rate_limit('app_ratings'::text, session_id, 5, 60)
);

-- assessments (same issue)
DROP POLICY IF EXISTS "Rate-limited assessment creation" ON public.assessments;
CREATE POLICY "Rate-limited assessment creation"
ON public.assessments FOR INSERT TO anon, authenticated
WITH CHECK (
  session_id IS NOT NULL
  AND check_rate_limit('assessments'::text, session_id, 10, 60)
);

-- email_captures (same issue)
DROP POLICY IF EXISTS "Rate-limited email capture creation" ON public.email_captures;
CREATE POLICY "Rate-limited email capture creation"
ON public.email_captures FOR INSERT TO anon, authenticated
WITH CHECK (
  session_id IS NOT NULL
  AND check_rate_limit('email_captures'::text, session_id, 5, 60)
);
