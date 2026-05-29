-- Group invites table
CREATE TABLE public.group_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  invitee_id uuid NOT NULL,
  invited_by uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX group_invites_pending_unique
  ON public.group_invites (group_id, invitee_id)
  WHERE status = 'pending';

GRANT SELECT, INSERT, UPDATE, DELETE ON public.group_invites TO authenticated;
GRANT ALL ON public.group_invites TO service_role;

ALTER TABLE public.group_invites ENABLE ROW LEVEL SECURITY;

-- Inviter must be a member of the group and the row's invited_by
CREATE POLICY "Members can create group invites"
  ON public.group_invites FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = invited_by
    AND public.is_group_member(group_id, auth.uid())
    AND invitee_id <> auth.uid()
  );

-- Invitee, inviter, or group owner can read
CREATE POLICY "Invitee inviter or owner can read invites"
  ON public.group_invites FOR SELECT
  TO authenticated
  USING (
    auth.uid() = invitee_id
    OR auth.uid() = invited_by
    OR EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND g.owner_id = auth.uid())
  );

-- Invitee can accept (pending -> accepted)
CREATE POLICY "Invitee can accept own invite"
  ON public.group_invites FOR UPDATE
  TO authenticated
  USING (auth.uid() = invitee_id AND status = 'pending')
  WITH CHECK (auth.uid() = invitee_id AND status = 'accepted');

-- Invitee can decline (delete), inviter or owner can cancel
CREATE POLICY "Invitee inviter or owner can delete invite"
  ON public.group_invites FOR DELETE
  TO authenticated
  USING (
    auth.uid() = invitee_id
    OR auth.uid() = invited_by
    OR EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND g.owner_id = auth.uid())
  );

-- Atomic accept: insert into group_members, delete the invite
CREATE OR REPLACE FUNCTION public.accept_group_invite(_invite_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _gid uuid;
  _uid uuid := auth.uid();
BEGIN
  SELECT group_id INTO _gid
  FROM public.group_invites
  WHERE id = _invite_id AND invitee_id = _uid AND status = 'pending';

  IF _gid IS NULL THEN
    RAISE EXCEPTION 'Invite not found';
  END IF;

  INSERT INTO public.group_members (group_id, user_id)
  VALUES (_gid, _uid)
  ON CONFLICT DO NOTHING;

  DELETE FROM public.group_invites WHERE id = _invite_id;

  RETURN _gid;
END;
$$;

-- Allow owner to remove members
CREATE POLICY "Owner can remove members"
  ON public.group_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND g.owner_id = auth.uid())
  );

-- Owner regenerates code
CREATE OR REPLACE FUNCTION public.regenerate_group_code(_group_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _new_code text;
  _alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  _i int;
  _attempt int := 0;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.groups WHERE id = _group_id AND owner_id = _uid) THEN
    RAISE EXCEPTION 'Not the owner';
  END IF;

  LOOP
    _attempt := _attempt + 1;
    _new_code := '';
    FOR _i IN 1..6 LOOP
      _new_code := _new_code || substr(_alphabet, 1 + floor(random() * length(_alphabet))::int, 1);
    END LOOP;

    BEGIN
      UPDATE public.groups SET join_code = _new_code WHERE id = _group_id;
      RETURN _new_code;
    EXCEPTION WHEN unique_violation THEN
      IF _attempt > 8 THEN RAISE; END IF;
    END;
  END LOOP;
END;
$$;