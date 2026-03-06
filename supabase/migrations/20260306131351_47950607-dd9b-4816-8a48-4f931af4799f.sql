-- Fix search_path on validation functions to resolve security linter warnings
ALTER FUNCTION public.validate_email_capture() SET search_path = public;
ALTER FUNCTION public.validate_app_rating() SET search_path = public;
ALTER FUNCTION public.validate_assessment() SET search_path = public;