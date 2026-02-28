
-- Drop the old SELECT policy that was too broad
DROP POLICY IF EXISTS "Users can read own assessments" ON public.assessments;

-- Create a more specific policy for owners reading their own assessments
CREATE POLICY "Users can read own assessments"
  ON public.assessments
  FOR SELECT
  USING (
    (user_id = auth.uid()) 
    OR (session_id IS NOT NULL AND session_id = session_id)
  );
