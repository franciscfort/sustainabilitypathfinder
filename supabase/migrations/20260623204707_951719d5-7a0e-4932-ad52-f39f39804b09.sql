CREATE OR REPLACE FUNCTION public.get_total_assessments()
 RETURNS bigint
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT count(*)::bigint FROM assessments;
$function$;