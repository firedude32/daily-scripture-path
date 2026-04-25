
-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT UNIQUE,
  name TEXT NOT NULL DEFAULT 'Friend',
  translation TEXT NOT NULL DEFAULT 'ESV',
  daily_goal INT NOT NULL DEFAULT 2,
  reminder_time TEXT NOT NULL DEFAULT '07:00',
  path_book_id TEXT NOT NULL DEFAULT 'mrk',
  progress_view TEXT NOT NULL DEFAULT 'simple',
  xp INT NOT NULL DEFAULT 0,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  last_read_date DATE,
  silver_gold_unlocked BOOLEAN NOT NULL DEFAULT false,
  silver_gold_acknowledged BOOLEAN NOT NULL DEFAULT false,
  onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_email ON public.profiles(lower(email));
CREATE INDEX idx_profiles_username ON public.profiles(lower(username));

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone signed in can SELECT minimal profile info (needed for friend lookup, group leaderboards).
-- Sensitive fields are still gated by app code; the columns themselves are not secret.
CREATE POLICY "Authenticated users can read profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============ BOOK PROGRESS ============
CREATE TABLE public.book_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  in_progress_chapters INT[] NOT NULL DEFAULT '{}',
  read_throughs INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, book_id)
);

ALTER TABLE public.book_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own book progress"
  ON public.book_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own book progress"
  ON public.book_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own book progress"
  ON public.book_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own book progress"
  ON public.book_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============ READING SESSIONS ============
CREATE TABLE public.reading_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  chapter INT NOT NULL,
  duration_sec INT NOT NULL DEFAULT 0,
  xp_earned INT NOT NULL DEFAULT 10,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessions_user_completed ON public.reading_sessions(user_id, completed_at DESC);

ALTER TABLE public.reading_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sessions"
  ON public.reading_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON public.reading_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON public.reading_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Aggregate weekly chapter counts: visible to authenticated users so friend
-- leaderboards work without exposing per-session content. We expose this via
-- a security-definer function rather than direct table access.
CREATE OR REPLACE FUNCTION public.weekly_chapters_for(_user_id UUID)
RETURNS INT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(COUNT(*)::int, 0)
  FROM public.reading_sessions
  WHERE user_id = _user_id
    AND completed_at >= (now() - interval '7 days');
$$;

CREATE OR REPLACE FUNCTION public.books_completed_for(_user_id UUID)
RETURNS INT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(COUNT(*)::int, 0)
  FROM public.book_progress
  WHERE user_id = _user_id AND read_throughs >= 1;
$$;

-- ============ FRIENDSHIPS ============
-- Symmetric model: one row per (user_id, friend_user_id) where user_id < friend_user_id.
-- status: 'pending' | 'accepted'. requested_by stores who initiated.
CREATE TABLE public.friendships (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  requested_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, friend_user_id),
  CHECK (user_id <> friend_user_id),
  CHECK (status IN ('pending', 'accepted'))
);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their friendships"
  ON public.friendships FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_user_id);

CREATE POLICY "Users can create friendships they participate in"
  ON public.friendships FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.uid() = user_id OR auth.uid() = friend_user_id)
    AND auth.uid() = requested_by
  );

CREATE POLICY "Users can update friendships they are part of"
  ON public.friendships FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_user_id);

CREATE POLICY "Users can delete friendships they are part of"
  ON public.friendships FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_user_id);

-- ============ GROUPS ============
CREATE TABLE public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  join_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.group_members (
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

CREATE INDEX idx_group_members_user ON public.group_members(user_id);

-- Security-definer membership check (avoid RLS recursion between groups<->group_members).
CREATE OR REPLACE FUNCTION public.is_group_member(_group_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = _group_id AND user_id = _user_id
  );
$$;

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members and owner can view group"
  ON public.groups FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id OR public.is_group_member(id, auth.uid()));

CREATE POLICY "Authenticated users can look up groups by code"
  ON public.groups FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create groups"
  ON public.groups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owner can update group"
  ON public.groups FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owner can delete group"
  ON public.groups FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Members can view membership rows"
  ON public.group_members FOR SELECT
  TO authenticated
  USING (public.is_group_member(group_id, auth.uid()));

CREATE POLICY "Users can join groups themselves"
  ON public.group_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups themselves"
  ON public.group_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============ FAVORITES ============
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  chapter INT NOT NULL,
  verse INT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_favorites_user ON public.favorites(user_id, created_at DESC);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own favorites"
  ON public.favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON public.favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============ TRIGGERS ============

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_book_progress_updated_at
  BEFORE UPDATE ON public.book_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
