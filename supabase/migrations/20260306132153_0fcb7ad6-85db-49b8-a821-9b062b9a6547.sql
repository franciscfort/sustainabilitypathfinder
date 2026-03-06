-- Add explicit deny-all SELECT policies on sensitive tables.
-- With RLS enabled, no SELECT policy already blocks reads,
-- but adding explicit false policies makes the intent clear.

-- email_captures: no one can read via API (only service role / dashboard)
CREATE POLICY "No public read on email_captures"
ON public.email_captures
FOR SELECT
TO anon, authenticated
USING (false);

-- assessments: no direct table reads (use RPC functions instead)
CREATE POLICY "No direct read on assessments"
ON public.assessments
FOR SELECT
TO anon, authenticated
USING (false);