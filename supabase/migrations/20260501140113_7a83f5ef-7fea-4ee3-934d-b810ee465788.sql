REVOKE EXECUTE ON FUNCTION public.weekly_chapters_for(uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.books_completed_for(uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_group_member(uuid, uuid) FROM anon, authenticated;