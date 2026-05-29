-- 1) profiles: restrict direct table SELECT to own row; expose safe fields via view
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.profiles;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Safe, limited public projection. Intentionally bypasses RLS to expose only
-- non-sensitive columns (no email, no reminder_time, no referral data).
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT id, name, username, current_streak, xp, last_read_date
FROM public.profiles;

ALTER VIEW public.public_profiles SET (security_invoker = false);
REVOKE ALL ON public.public_profiles FROM PUBLIC, anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- Friend search by email — limited projection, never returns email
CREATE OR REPLACE FUNCTION public.find_profile_by_email(_email text)
RETURNS TABLE(id uuid, name text, username text, current_streak integer, xp integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id, name, username, current_streak, xp
  FROM public.profiles
  WHERE lower(email) = lower(_email)
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.find_profile_by_email(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.find_profile_by_email(text) TO authenticated;

-- 2) groups: remove open SELECT policy, expose join-code lookup via SECURITY DEFINER RPC
DROP POLICY IF EXISTS "Authenticated users can look up groups by code" ON public.groups;

CREATE OR REPLACE FUNCTION public.find_group_by_code(_code text)
RETURNS TABLE(id uuid, name text, owner_id uuid, join_code text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id, name, owner_id, join_code, created_at
  FROM public.groups
  WHERE join_code = upper(_code)
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.find_group_by_code(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.find_group_by_code(text) TO authenticated;

-- 3) friendships: restrict UPDATE to the recipient accepting a pending request,
-- and limit which columns can be updated to `status` only (no requested_by tampering)
DROP POLICY IF EXISTS "Users can update friendships they are part of" ON public.friendships;

CREATE POLICY "Recipient can accept pending friendship"
  ON public.friendships FOR UPDATE TO authenticated
  USING (
    (auth.uid() = user_id OR auth.uid() = friend_user_id)
    AND auth.uid() <> requested_by
    AND status = 'pending'
  )
  WITH CHECK (
    (auth.uid() = user_id OR auth.uid() = friend_user_id)
    AND auth.uid() <> requested_by
    AND status = 'accepted'
  );

REVOKE UPDATE ON public.friendships FROM authenticated;
GRANT UPDATE (status) ON public.friendships TO authenticated;