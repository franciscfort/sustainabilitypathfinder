
-- Add share_id column for unique shareable links
ALTER TABLE public.assessments ADD COLUMN share_id text UNIQUE DEFAULT gen_random_uuid()::text;

-- Allow anyone to read assessments by share_id (for shared links)
CREATE POLICY "Anyone can read shared assessments"
  ON public.assessments
  FOR SELECT
  USING (share_id IS NOT NULL);
