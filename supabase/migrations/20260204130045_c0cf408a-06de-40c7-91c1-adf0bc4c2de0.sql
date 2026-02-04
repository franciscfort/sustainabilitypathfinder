-- Create table to store assessment results
CREATE TABLE public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Personality ratings (stored as JSONB for flexibility)
  personality_answers JSONB NOT NULL,
  
  -- Selected passion areas (array of strings)
  passion_areas TEXT[] NOT NULL,
  
  -- Selected skills (array of strings)
  current_skills TEXT[] NOT NULL,
  
  -- Results (stored as JSONB)
  career_matches JSONB NOT NULL,
  recommended_skills JSONB NOT NULL,
  
  -- Optional: session identifier for anonymous tracking
  session_id TEXT,
  
  -- Optional: user_id for future authenticated users
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create index for faster queries
CREATE INDEX idx_assessments_created_at ON public.assessments(created_at DESC);
CREATE INDEX idx_assessments_user_id ON public.assessments(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_assessments_session_id ON public.assessments(session_id) WHERE session_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert assessments (for anonymous users)
CREATE POLICY "Anyone can create assessments"
ON public.assessments
FOR INSERT
WITH CHECK (true);

-- Policy: Users can read their own assessments (by user_id or session_id)
CREATE POLICY "Users can read own assessments"
ON public.assessments
FOR SELECT
USING (
  user_id = auth.uid() 
  OR session_id IS NOT NULL
);

-- Add comment for documentation
COMMENT ON TABLE public.assessments IS 'Stores sustainability career assessment results';