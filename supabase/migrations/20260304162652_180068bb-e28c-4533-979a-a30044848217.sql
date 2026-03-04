
CREATE TABLE public.app_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  session_id text
);

ALTER TABLE public.app_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert ratings"
ON public.app_ratings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can read ratings"
ON public.app_ratings
FOR SELECT
TO anon, authenticated
USING (true);
