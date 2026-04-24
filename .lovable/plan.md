
# Bible Reading Habit Tracker — Prototype Plan

A mobile-first web prototype (390×844 iPhone viewport, framed on desktop) of a calm, premium habit tracker for daily Bible reading. Light mode only, warm off-white palette, deep forest green accents, no blue, no religious decoration. All data mocked via localStorage so the prototype is fully interactive without backend setup.

## Build Priorities (in order)

### 1. Foundation & Design System
- Tailwind theme tokens for the full palette (#FAF7F2 bg, #1F3D2E primary, #B8956A secondary, tier greens/silver/gold, warm neutrals)
- Inter for UI, Source Serif 4 for Scripture references and celebrations, tabular-nums for counters
- iPhone frame wrapper on desktop; full-bleed mobile viewport on phones
- Bottom tab bar (Home / Progress / Friends / Profile) with Lucide icons
- Mock data layer: 66 books with chapter counts, ~180 quiz questions (Mark, Philippians, James, 1 John, Jude, select Psalms), synthetic 90-day reading history (current streak 23, longest 47, 14 chapters into Mark)

### 2. The Core Loop (must work end-to-end first)
- **Home**: massive streak number, "Start Reading" CTA, "Up next: Mark X", 13-week heatmap with intensity by chapters
- **Active Reading**: fullscreen, serif chapter title, large tabular timer, breathing dot, "I'm Finished" button, cancel-with-confirm
- **Quiz**: 5 multiple-choice questions, tap-to-advance, no submit button, no per-question feedback. Fail any → "Not quite — give it another try" with 30s cooldown, unlimited retakes
- **Session Summary**: staggered fade-in, checkmark, warm headline ("Nicely done."), stats grid (time, chapter, streak, book progress), animated book progress bar, Done button

### 3. Onboarding Flow (first-launch only, gated by localStorage)
- Welcome → mock account → path quiz intro with placeholder mascot → 5 questions (familiarity, goal, time, draw, translation) → **Path Reveal** with dynamic projection ("finish Mark in X days, NT in Y days") → reminder time → "Start My First Reading"

### 4. Progress Screen
- Three top stats (total chapters, current streak, longest streak)
- Full-year heatmap
- **Bible Completion Map**: all 66 books as tiles colored by tier (empty / in-progress green / green / silver / gold). Tap a book → chapter-by-chapter detail
- OT vs NT progress bars, genre breakdown (Law/History/Poetry/Prophecy/Gospels/Epistles), 12-week pace line chart

### 5. Book Completion Celebration
- Full-screen takeover, tier-colored animated gradient, large serif book name, "Completed" label, 1.5–2s fill animation with tasteful shimmer, restrained stats line, single warm encouragement, Continue button
- Tier logic: 1st=green, 2nd=silver, 3rd+=gold
- **Half-Bible unlock modal** at 33 books completed: reveals silver/gold tiers exist (hidden until then to prevent farming)

### 6. Friends & Groups
- Friends tab: 4–6 mock friends with avatar/streak/weekly chapters, public profile shows only streak/rank/books — never quiz scores or content
- Groups tab: one mock youth group (8 members) with collective weekly total and member leaderboard
- Add friend / Create / Join group buttons (mocked)

### 7. Profile & Rank System
- Avatar, name, current rank with XP bar to next tier
- 10-tier ladder (Seeker → Bible Scholar) with XP thresholds as specified
- XP rules: 10/chapter, +50 first book, +25 silver, +15 gold, daily streak bonus
- Rank level-up celebration screen (full-screen, considered reveal)
- Sections: account, reading plan settings (with live daily-goal projection), achievements, reading history, Other Resources, sign out

### 8. Other Resources Page
- 4–6 curated mock partner cards (logo, name, one-line description, Visit button)

### 9. Stretch (if time permits)
- Shareable milestone card export
- Streak freeze mechanic (unlocked at 30 days)
- Hidden achievement badges
- PWA manifest for installability (manifest only, no service worker, per preview-safety rules)

## Tone & Restraint Rules (enforced in copy and motion)
- No exclamations, no emoji in UI, no cross/parchment/leather/stained-glass imagery
- Celebration only at book completion and rank level-up; everything else stays quiet
- Privacy: never expose reading content, notes, or quiz scores to other users
- All animations via Framer Motion: 200–300ms ease-out defaults, 95% tap scale, breathing dot, staggered entrances, 1.5–2s celebration fills

## Tech
- TanStack Start with separate routes per major surface (`/`, `/onboarding`, `/read`, `/quiz`, `/summary`, `/progress`, `/friends`, `/profile`, `/resources`, plus celebration overlays)
- Tailwind v4 tokens in `styles.css`, Framer Motion, lucide-react
- localStorage for all persistence (user, sessions, book progress, friends, groups, onboarding flag)
- Each route gets its own head() metadata
