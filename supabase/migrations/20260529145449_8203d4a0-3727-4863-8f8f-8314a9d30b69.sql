
-- 1. Roles infrastructure (separate table, security-definer checker)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;
CREATE POLICY "Users can read their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 2. Revoke anon access to SECURITY DEFINER functions that require a signed-in caller
REVOKE EXECUTE ON FUNCTION public.accept_group_invite(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.regenerate_group_code(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.resolve_ref_to_user_id(text) FROM anon;

-- 3. Tighten invite_clicks: only allow recording clicks for a real existing profile
DROP POLICY IF EXISTS "Anyone can insert invite clicks" ON public.invite_clicks;
CREATE POLICY "Anyone can insert invite clicks for real users"
  ON public.invite_clicks
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = ref_user_id));
