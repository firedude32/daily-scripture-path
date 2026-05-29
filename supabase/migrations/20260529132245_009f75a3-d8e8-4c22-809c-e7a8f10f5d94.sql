
-- 1) Lowercase all existing usernames; if collisions arise, append short suffix
DO $$
DECLARE
  r RECORD;
  candidate TEXT;
  i INT;
BEGIN
  FOR r IN
    SELECT id, username
    FROM public.profiles
    WHERE username IS NOT NULL AND username <> lower(username)
    ORDER BY created_at ASC
  LOOP
    candidate := lower(r.username);
    i := 0;
    WHILE EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id <> r.id AND lower(username) = candidate
    ) LOOP
      i := i + 1;
      candidate := lower(r.username) || i::text;
    END LOOP;
    UPDATE public.profiles SET username = candidate WHERE id = r.id;
  END LOOP;
END $$;

-- 2) Case-insensitive uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_unique
  ON public.profiles (lower(username))
  WHERE username IS NOT NULL;

-- 3) Update ref resolver to be case-insensitive on username
CREATE OR REPLACE FUNCTION public.resolve_ref_to_user_id(_ref text)
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT id FROM public.profiles
  WHERE lower(username) = lower(_ref) OR id::text = _ref
  LIMIT 1;
$function$;
