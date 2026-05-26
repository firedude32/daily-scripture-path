
CREATE TABLE public.quiz_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  question TEXT NOT NULL,
  reason TEXT NOT NULL,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_reports TO authenticated;
GRANT ALL ON public.quiz_reports TO service_role;

ALTER TABLE public.quiz_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own quiz reports"
ON public.quiz_reports FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own quiz reports"
ON public.quiz_reports FOR SELECT TO authenticated
USING (auth.uid() = user_id);
