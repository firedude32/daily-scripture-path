
-- Fix Security Definer View: recreate public_profiles with security_invoker
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles
WITH (security_invoker = true) AS
SELECT id, name, username, current_streak, xp, last_read_date
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO authenticated;

-- Revoke EXECUTE from anon/public on SECURITY DEFINER functions
-- so they cannot be invoked by unauthenticated users via the API.
-- Keep authenticated grants where the app needs them.

REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.weekly_chapters_for(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.weekly_chapters_for(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.books_completed_for(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.books_completed_for(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.is_group_member(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_group_member(uuid, uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

REVOKE ALL ON FUNCTION public.resolve_ref_to_user_id(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.resolve_ref_to_user_id(text) TO authenticated;

REVOKE ALL ON FUNCTION public.find_profile_by_email(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.find_profile_by_email(text) TO authenticated;

REVOKE ALL ON FUNCTION public.find_group_by_code(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.find_group_by_code(text) TO authenticated;

REVOKE ALL ON FUNCTION public.accept_group_invite(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.accept_group_invite(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.regenerate_group_code(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.regenerate_group_code(uuid) TO authenticated;
