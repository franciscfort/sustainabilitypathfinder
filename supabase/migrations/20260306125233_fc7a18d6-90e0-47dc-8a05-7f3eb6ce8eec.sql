CREATE TABLE public.email_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  assessment_id uuid REFERENCES public.assessments(id) ON DELETE SET NULL,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert email captures"
ON public.email_captures
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
