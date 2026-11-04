CREATE OR REPLACE FUNCTION public.set_marketing_consent_at()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF NEW.marketing_consent THEN
    NEW.marketing_consent_at := now();
  ELSE
    NEW.marketing_consent_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_marketing_consent_at
BEFORE INSERT ON public.email_captures
FOR EACH ROW EXECUTE FUNCTION public.set_marketing_consent_at();