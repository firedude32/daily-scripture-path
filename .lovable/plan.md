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

## Chunk 3 — Replace the store with Supabase ✅
Rewrite `src/state/store.ts` so every read/write hits Supabase via TanStack Query:
- `useProfile()`, `useBookProgress()`, `useSessions()`, `useDailyCounts()`.
- `recordSession()` becomes a server function that inserts into `reading_sessions`, recomputes streak/XP/daily_count atomically, and returns the result.
- Onboarding writes to `profiles` and flips `onboarded = true`.
- Settings writes (translation, reminder, daily goal, name, email) update `profiles`.

## Chunk 4 — Remove all filler/synthetic data ✅
- Deleted FRIENDS / GROUPS hardcoded arrays from `src/data/friends.ts`; trimmed RESOURCES to real partners only (removed fake "Daily Disciple").
- Removed "in_motion" variant from `TodaysNote` (was synthesizing from FRIENDS).
- Rewrote Friends page with empty states for both Friends and Groups tabs (real backend wiring comes in Chunks 5–6).
- Synthetic 90-day history was already removed in Chunk 3; new users now start at 0 XP, 0 streak, 0 sessions, no books, no friends.
- Fixed `PhoneFrame` rendering children twice (was producing duplicate forms / inputs visible on auth pages).
- Added `BOOKS_WITH_QUIZZES` / `hasQuiz()` helpers; books without scripted quizzes now show a "Quiz Coming Soon" banner on the Read screen and a badge in the Progress book sheet, and skip the quiz step (session still records).

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

## Chunk 8 — Wire every remaining button (audit) ✅
Audited every screen; every interactive element now performs a real action:
- **Home**: CTA → /read ✓; heatmap cells have date + chapter-count tooltips ✓; FriendActivity replaces the old synthetic "in motion" variant ✓.
- **Read**: Mark chapter complete records a session and (when a quiz exists) routes to /quiz ✓.
- **Quiz**: Submit grades, awards XP, fires book-complete celebration ✓.
- **Progress**: Book tiles open a real book-detail sheet with chapter grid + "Quiz Coming Soon" badge ✓.
- **Profile**: CSV export, all sheets, and Sign Out all real ✓; username editor live ✓.
- **Friends**: Add by email/username, Accept/Decline/Cancel, friend profile sheet, Create/Join group, group leaderboard, Leave/Delete — all backed by Supabase ✓.
- **Onboarding**: Writes profile + flips `onboarded`, then navigates home ✓.
- **Celebration**: Continue clears pending and returns home ✓.
- **Analytics**: Renders empty-state when there are no sessions ✓.
- Cleared a stale TODO in `TodaysNote` (the "in motion" variant is now handled by `FriendActivity`).

## Chunk 9 — Polish & QA pass (remaining)
- Loading skeletons for async-heavy lists (friends, groups).
- Per-route error boundaries on data routes.
- Manual RLS spot-check (one account cannot read another's sessions/progress).
- Confirm onboarding redirect on first sign-in.
- Confirm empty Home looks intentional (illustration + "Start Today's Reading" CTA already does this).

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
