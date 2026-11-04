ALTER TABLE public.email_captures
  ADD COLUMN IF NOT EXISTS marketing_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS marketing_consent_at timestamptz NULL;

DROP FUNCTION IF EXISTS public.create_assessment(jsonb, text[], text[], jsonb, jsonb, text);
DROP FUNCTION IF EXISTS public.create_assessment(jsonb, text[], text[], jsonb, jsonb, text, text);
DROP FUNCTION IF EXISTS public.create_assessment(jsonb, text[], text[], jsonb, jsonb, text, text, text);

CREATE EXTENSION IF NOT EXISTS pg_cron;