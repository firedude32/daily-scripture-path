REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.weekly_chapters_for(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.books_completed_for(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_group_member(uuid, uuid) FROM PUBLIC, anon;