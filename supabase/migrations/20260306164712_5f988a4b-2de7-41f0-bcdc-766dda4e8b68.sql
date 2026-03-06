CREATE OR REPLACE FUNCTION public.get_public_ratings(_limit integer DEFAULT 50)
RETURNS TABLE(rating integer, comment text, created_at timestamptz)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _limit < 1 THEN _limit := 1; END IF;
  IF _limit > 100 THEN _limit := 100; END IF;

  RETURN QUERY
  SELECT r.rating, r.comment, r.created_at
  FROM app_ratings r
  ORDER BY r.created_at DESC
  LIMIT _limit;
END;
$$;