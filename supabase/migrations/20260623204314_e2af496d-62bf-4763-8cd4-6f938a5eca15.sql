-- Track country for ratings and email captures so global reach reflects all platform interactions, not just assessments.
ALTER TABLE public.app_ratings ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE public.email_captures ADD COLUMN IF NOT EXISTS country text;

-- Extend app_ratings validation to cover country format.
CREATE OR REPLACE FUNCTION public.validate_app_rating()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
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
  IF NEW.country IS NOT NULL AND (length(NEW.country) <> 2 OR NEW.country !~ '^[A-Z]{2}$') THEN
    RAISE EXCEPTION 'Invalid country code';
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS validate_app_rating_trigger ON public.app_ratings;
CREATE TRIGGER validate_app_rating_trigger
  BEFORE INSERT ON public.app_ratings
  FOR EACH ROW EXECUTE FUNCTION public.validate_app_rating();

-- Attach email capture validation, including country format.
CREATE OR REPLACE FUNCTION public.validate_email_capture()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.email !~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  IF length(NEW.email) > 255 THEN
    RAISE EXCEPTION 'Email too long';
  END IF;
  IF NEW.country IS NOT NULL AND (length(NEW.country) <> 2 OR NEW.country !~ '^[A-Z]{2}$') THEN
    RAISE EXCEPTION 'Invalid country code';
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS validate_email_capture_trigger ON public.email_captures;
CREATE TRIGGER validate_email_capture_trigger
  BEFORE INSERT ON public.email_captures
  FOR EACH ROW EXECUTE FUNCTION public.validate_email_capture();

-- Aggregate reach across assessments, ratings, and email captures.
CREATE OR REPLACE FUNCTION public.get_country_stats()
 RETURNS TABLE(country text, count bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT combined.country, sum(combined.cnt)::bigint AS count
  FROM (
    SELECT COALESCE(a.country, 'UNKNOWN') AS country, count(*) AS cnt
    FROM assessments a
    GROUP BY COALESCE(a.country, 'UNKNOWN')
    UNION ALL
    SELECT COALESCE(r.country, 'UNKNOWN') AS country, count(*) AS cnt
    FROM app_ratings r
    GROUP BY COALESCE(r.country, 'UNKNOWN')
    UNION ALL
    SELECT COALESCE(e.country, 'UNKNOWN') AS country, count(*) AS cnt
    FROM email_captures e
    GROUP BY COALESCE(e.country, 'UNKNOWN')
  ) combined
  GROUP BY combined.country
  ORDER BY count DESC;
$function$;