-- Remove the public SELECT policy that exposes session_id
DROP POLICY IF EXISTS "Public read ratings for social proof" ON app_ratings;

-- Add a deny-all SELECT policy on app_ratings (permissive with false = deny all)
CREATE POLICY "No direct read on app_ratings"
  ON app_ratings FOR SELECT
  TO public
  USING (false);