# Make Lectio Real — Implementation Plan

Right now Lectio is a styled prototype: state lives in `localStorage`, the home screen seeds 90 days of fake reading history, friends/groups/resources are hardcoded arrays, and tapping the "Today's Note" opens the reader. To make it real we need a backend, real accounts, empty starting state, and every interactive element wired to actual behavior.

The work below is broken into bite-sized chunks. Each chunk is independently shippable. After your approval I'll execute them in order.

---

## Chunk 0 — Quick fix (1 min)
Make the **Today's Note** display-only.
- Change the `<motion.button>` in `src/components/TodaysNote.tsx` to a `<motion.div>`, remove the `onClick={navigate(...)}` and the `to` field.

## Chunk 1 — Backend foundation
Enable **Lovable Cloud** (Supabase). Create the schema:
- `profiles` (id → auth.users, name, email, translation, daily_goal, reminder_time, path_book_id, progress_view, xp, current_streak, longest_streak, last_read_date, silver_gold_unlocked, silver_gold_acknowledged, onboarded)
- `book_progress` (user_id, book_id, in_progress_chapters int[], read_throughs)
- `reading_sessions` (id, user_id, book_id, chapter, duration_sec, completed_at, xp_earned)
- `daily_counts` (user_id, date, count) — or derive from sessions
- `friendships` (user_id, friend_user_id, status: pending/accepted)
- `groups` (id, name, owner_id, join_code) + `group_members` (group_id, user_id)
- `favorites` (user_id, book_id, chapter, verse, note, created_at)
- RLS on every table; `handle_new_user()` trigger to auto-create profile.

## Chunk 2 — Real auth
- Add `/login` and `/signup` routes (email + password, plus Google).
- Add `/reset-password` page.
- Add `_authenticated` layout route that redirects unauthenticated users to `/login`.
- Move `/`, `/read`, `/quiz`, `/progress`, `/friends`, `/profile`, `/analytics`, `/onboarding`, `/resources`, `/summary`, `/celebration/*` under `_authenticated`.
- Sign Out in Profile → real `supabase.auth.signOut()` (currently it calls `resetAll()` and pretends).

## Chunk 3 — Replace the store with Supabase
Rewrite `src/state/store.ts` so every read/write hits Supabase via TanStack Query:
- `useProfile()`, `useBookProgress()`, `useSessions()`, `useDailyCounts()`.
- `recordSession()` becomes a server function that inserts into `reading_sessions`, recomputes streak/XP/daily_count atomically, and returns the result.
- Onboarding writes to `profiles` and flips `onboarded = true`.
- Settings writes (translation, reminder, daily goal, name, email) update `profiles`.

## Chunk 4 — Remove all filler/synthetic data
- Delete `buildSyntheticHistory()` and the seeded 23-day streak / 14 chapters of Mark / Philippians-James-Jude completions.
- Delete `src/data/friends.ts` (FRIENDS, GROUPS, RESOURCES hardcoded arrays).
- New users start at: 0 XP, 0 streak, 0 sessions, no books in progress, no friends, no groups.
- Update `TodaysNote` variants that referenced `FRIENDS` ("In Motion") to query real friends or hide when none.
- Empty states everywhere: Home ("Start your first reading"), Friends ("Invite someone to read alongside you"), Progress ("No books started yet"), Analytics ("Read your first chapter to see stats"), Profile history ("No sessions yet").

## Chunk 5 — Real friends system
- `Add Friend` form → looks up by email, creates row in `friendships` with status=pending; shows in their inbox.
- Friend profile sheet → real data (their streak, books completed, weekly chapters from `reading_sessions`).
- Accept/decline pending invites (new section on Friends page).
- Remove friend.
- Privacy preserved: only aggregate stats are visible, never session content.

## Chunk 6 — Real groups system
- Create Group → inserts into `groups`, generates 6-char `join_code`, adds creator as member.
- Join Group → looks up by code, inserts into `group_members`.
- Group leaderboard → real weekly chapter counts from members' sessions.
- Leave group / delete group (owner only).

## Chunk 7 — Resources page
Decision: keep a small **curated** list (9Marks, BibleProject, Ligonier, Crossway, Desiring God) hardcoded as static editorial content — these are real organizations, not filler. Remove the fake "Daily Disciple" entry. This chunk is just trimming the array; no backend.

## Chunk 8 — Wire every remaining button (audit)
Walk through each screen and confirm every button does what it claims:
- **Home**: CTA → /read ✓, heatmap cells → tooltip with date+count
- **Read**: Mark chapter complete → records session, navigates to /quiz
- **Quiz**: Submit → grades, awards XP, fires celebration if book complete
- **Progress**: Book tiles → open book detail sheet (currently no-op?)
- **Profile**: Export CSV → real export of user's own data; Achievements/History/Account/About sheets all functional ✓; Sign Out → real signOut
- **Friends**: Add/Create/Join → real backend calls (Chunks 5–6)
- **Onboarding**: Final step → writes profile, navigates home
- **Celebration**: Continue → clears pending, returns home
- **Analytics**: confirm all charts render with empty state when no sessions

## Chunk 9 — Polish & QA pass
- Loading skeletons for async data
- Error boundaries on all routes with loaders
- Confirm RLS works (a user cannot see another user's sessions/progress)
- Confirm onboarding redirect works on first sign-in
- Confirm empty Home screen looks intentional (illustration + "Start your first reading" CTA)

---

## Notes on scope

- **Auth providers**: defaulting to email/password + Google (Lovable Cloud's standard combo). Tell me if you want Apple or phone too.
- **TodaysNote "In Motion" variant** depends on having friends — when a user has zero friends it'll fall through to the next eligible variant (book note or favorite verse).
- **Synthetic streak (23 days)** disappears for everyone, including you. If you want to keep a "demo" toggle for screenshots, let me know.
- **CSV export** will export only the signed-in user's own data.
- This is a substantial rebuild (≈9 chunks, several hundred lines changed/added across ~15 files plus new schema). I'll execute chunks in order and stop after each major one if you want to review.

## Technical details

- Stack: TanStack Start + Lovable Cloud (Supabase). Server functions for streak/XP recompute (atomic, server-authoritative). TanStack Query for client cache.
- File additions: `src/integrations/supabase/{client,client.server,auth-middleware}.ts`, `src/routes/{login,signup,reset-password,_authenticated}.tsx`, route files moved under `_authenticated/`.
- File rewrites: `src/state/store.ts` (becomes hooks + server fns), `src/components/TodaysNote.tsx` (div not button), `src/routes/{friends,profile,index,onboarding}.tsx`.
- File deletions: `src/data/friends.ts` (or trimmed to RESOURCES only).
- Migrations: one schema migration creating all tables + RLS + trigger.

Approve and I'll start with Chunk 0 (the note fix) and Chunk 1 (enable Cloud + schema), then proceed.
