-- Track who referred a new user
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by uuid;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by_claimed boolean NOT NULL DEFAULT false;

-- Track invite link clicks
CREATE TABLE IF NOT EXISTS public.invite_clicks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ref_user_id uuid NOT NULL,
  clicked_at timestamp with time zone NOT NULL DEFAULT now(),
  user_agent text
);

CREATE INDEX IF NOT EXISTS idx_invite_clicks_ref_user_id ON public.invite_clicks(ref_user_id);

GRANT SELECT, INSERT ON public.invite_clicks TO anon;
GRANT SELECT, INSERT ON public.invite_clicks TO authenticated;
GRANT ALL ON public.invite_clicks TO service_role;

ALTER TABLE public.invite_clicks ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon, since the landing page is public) can log a click
CREATE POLICY "Anyone can insert invite clicks"
ON public.invite_clicks
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Authenticated users can read clicks where they are the referrer
CREATE POLICY "Users can read their own invite clicks"
ON public.invite_clicks
FOR SELECT
TO authenticated
USING (auth.uid() = ref_user_id);

-- Helper: look up a user id by username for landing-page ref resolution
CREATE OR REPLACE FUNCTION public.resolve_ref_to_user_id(_ref text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles
  WHERE username = _ref OR id::text = _ref
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.resolve_ref_to_user_id(text) TO anon, authenticated;