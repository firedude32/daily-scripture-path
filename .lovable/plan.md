## Lectio — Publish-Readiness Plan

A focused pass to fix what's broken, remove placeholder content, ship a real responsive layout, and tighten copy + security before going live at lectio.live.

---

### 1. Responsive shell (no more iPhone bezel)

- `src/components/PhoneFrame.tsx`: remove the desktop bezel/notch. Render a centered column, max-width ~440px, full-height paper background. On mobile it's already full-bleed — preserve that. The `absolute inset-0` pattern in `Screen` keeps working because the column is `relative` + `min-h-screen`.
- Audit any `md:` styles that assumed the framed layout (mostly none — most components are mobile-locked).
- Set a sensible body bg color so the paper column reads as a sheet on desktop, not a phone.

### 2. Replace small SVG motifs with Lucide (keep the bread loaf)

Keep `BreadIllustration` (the hero loaf on Home — it's the brand signature).

Replace these with Lucide icons:
- **`GoldMotif`** rotation on Home top-right and book-completion screen → map each motif name to a Lucide equivalent and render with gold stroke:
  - `olive` → `Leaf`, `wheat`/`sheaf` → `Wheat`, `loaf` → `Cookie` (closest), `bookmark` → `Bookmark`, `fish` → `Fish`, `dove` → `Bird`, `gate` → `DoorOpen`, `laurel` → `Award`, `lamp` → `Lamp`.
  - Replace the `GoldMotif` component with a thin wrapper that picks a Lucide icon by name (same `dailyMotif` / `bookMotif` selectors keep working).
- **`Mascot`** (onboarding intro screen) → replace with a single calm Lucide icon (`Sprout` or `Feather`) at the same size, keep the gentle bob animation.
- Delete `src/components/Mascot.tsx` and the body of `src/components/GoldMotif.tsx` (keep the named exports / helpers so callers don't break).

### 3. Fix non-functional / placeholder UI

- **Quiz picker flow**: in `src/routes/_authenticated/read.tsx`, when the user picks a chapter that has no scripted quiz, skip the quiz entirely and just record the session (already partially wired — verify and keep `clearReadOverride` after `recordSession`). Remove the generic fallback path so unscripted chapters never show fake questions.
  - In `src/data/quiz.ts`: change `getQuiz()` to return `[]` (or throw) for unscripted chapters, and update `nextChapterFor` callsites to rely on `hasQuiz` (already done). The `generic()` helper can stay for now but is unused; mark or remove.
- **Analytics "At Your Current Pace"** (`src/routes/_authenticated/analytics.tsx`, lines ~165–183): currently hardcoded to `Math.ceil(2 / goal)` for Mark and `89 / goal` for Gospels — wire it to the real `chaptersRemainingIn` + `recentChaptersPerDay` helpers already used on the Progress page (lift them into `state/store.ts` or a shared `lib/pace.ts`).
- **TodaysNote "From Your Favorites"** fallback hardcodes `PSALM 46 · 10 · FAVORITED MARCH 12`. Replace with a real most-read chapter pulled from session counts (same logic as `MostReadChapters`), or hide the variant when there's no real favorite.
- **Progress page**: when a chapter button in the book sheet is tapped on a chapter that's already complete, currently it still routes to `/read` and re-reads it — confirm that's intended; if not, gate the click.
- **Summary share buttons**: "Message" and "Post" currently just close the sheet. Either wire them to `navigator.share()` (with the same prefab text) and a Twitter intent URL, or remove them and keep just "Copy".
- **Profile `Sign Out`** uses `confirm()` — replace with the existing `BottomSheet` confirm pattern for consistency.
- **Friends search/add** (`AddFriendForm`): verify the empty-state and error toasts are firing.

### 4. Copy & metadata polish

- `src/routes/_authenticated/profile.tsx`: change `Lectio · Prototype v0.2` and `Prototype 0.2` to `Lectio · v1.0` (or whatever the publish version is).
- `src/routes/__root.tsx`: add `og:title`, `og:description`, `og:image` (use a snapshot of the bread loaf), `twitter:card`, and a `theme-color` that matches paper. Add a real favicon (small Lucide `BookOpen` or the bread mark exported as PNG).
- Add a `manifest.webmanifest` and apple-touch-icon so installs / shares look right at lectio.live.
- Confirm `<title>` per route (already set on each route — good).

### 5. Auth flow review

- `src/routes/login.tsx`, `signup.tsx`, `reset-password.tsx`: verify Google sign-in is enabled (per house rules); add a Google button if missing. Confirm `emailRedirectTo` is set on signup.
- After signup, route to `/onboarding`; after login, to `/`. Verify both.
- `src/routes/_authenticated/onboarding.tsx`: the `account` step collects name/email but the actual auth happens on `/signup`. Either remove that step or have it just edit the `name` field on the existing profile (currently it does write `name` via `completeOnboarding`, but `email` overwrites the real auth email — bug). Drop the email field from onboarding.

### 6. Database / security

The Supabase linter reports 8 WARN-level findings: public + signed-in users can `EXECUTE` certain `SECURITY DEFINER` functions. Action: identify which functions (likely `has_role`, friend/group helpers), then either (a) `REVOKE EXECUTE … FROM anon, authenticated` and grant only to `service_role` for ones that should be internal, or (b) confirm each is intentionally callable and document it.

### 7. Final QA pass

- Run through every route on desktop + mobile width. No frame, no overflow, no broken images.
- Read a chapter from the picker for a book with no scripted quiz → confirm it skips the quiz and records the session.
- Read Mark 1 → verify quiz, summary, streak increment, XP, book progress all update.
- Sign out / sign in → state hydrates correctly.
- Heatmap, progress map, analytics page all render with realistic empty states for a brand-new account.

---

### Out of scope (intentional)

- Real Bible text rendering inside the Read screen (still the focused timer view by design).
- Push notifications for the daily reminder (UI only, no native push).
- More quiz content beyond Gospels/Acts/Jude/Psalms (you'll add the rest as you write them).

### Files touched (rough)

```text
src/components/PhoneFrame.tsx        — remove bezel
src/components/GoldMotif.tsx         — rewrite as Lucide wrapper
src/components/Mascot.tsx            — delete (or replace with Lucide)
src/data/quiz.ts                     — remove generic fallback in getQuiz
src/routes/__root.tsx                — favicon, og tags, manifest
src/routes/_authenticated/read.tsx   — confirm skip-quiz path
src/routes/_authenticated/analytics.tsx — real pace ETAs
src/routes/_authenticated/onboarding.tsx — drop email field, swap Mascot
src/routes/_authenticated/profile.tsx — version string, sign-out sheet
src/routes/_authenticated/summary.tsx — wire/remove share buttons
src/components/TodaysNote.tsx         — real favorite or hide variant
public/                               — favicon, apple-touch-icon, manifest
supabase/migrations/                  — REVOKE EXECUTE on internal SECURITY DEFINER fns
```

Approve and I'll execute top-to-bottom.