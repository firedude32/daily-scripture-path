
# Lectio — Editorial Redesign + Advanced Analytics

The existing prototype already implements the core loop, streak, tiered books, ranks, friends, and onboarding end-to-end. This pass rebrands it as **Lectio** in a Swiss editorial brutalist style, adds the spec's missing pieces (Advanced Analytics, CSV export, Simple/Detailed toggle, hand-drawn gold motifs, mascot, page-turn motion), and tightens copy/components everywhere to match. No backend changes — all data stays in localStorage.

## 1. Design system overhaul (`src/styles.css`, new primitives)

Replace the current warm-green palette with the Lectio paper-and-ink system.

- Tokens: `--paper #F5F0E6`, `--paper-light #FAF7F2`, `--ink #1C1915`, `--ink-soft #4A453E`, `--ink-muted #8A847A`, `--rule #D4CEC2`, `--gold #B8860B`, tier colors `--tier-green #4A6B4E`, `--tier-silver #9A9389`, `--tier-gold #B8860B`. Heatmap uses Gold at 25/45/70/100% opacity over Rule.
- Map shadcn aliases (`background`, `foreground`, `primary`, `border`, etc.) to the new tokens so existing components inherit the palette without rewrites.
- Fonts: load Playfair Display (display serif), Source Serif 4 (body serif), Inter (UI sans) from Google Fonts. Add `.font-display`, `.font-body`, `.font-ui`, and `.smallcaps` utilities (uppercase, 0.14em tracking, 11–12px).
- New shared primitives in `src/components/ui-lectio/`:
  - `<SmallCaps>` label
  - `<Rule>` (1px hairline; gold variant)
  - `<EditorialButton variant="primary|gold|secondary|text">` — solid Ink, Gold, hairline border, or letter-spaced text. 12px radius, no shadow, 95% press scale.
  - `<EditorialCard>` — Paper bg, hairline Rule border, 24px padding, optional Gold selected border.
  - `<HairlineProgress>` — 2px Gold line on Rule track with end-cap numerals.
  - `<GoldMotif name="olive|wheat|loaf|bookmark|fish|dove|gate|laurel|sheaf|lamb">` — small inline SVG line drawings, flat Gold stroke, no fill. ~6 motifs, picked by date hash for the Home rotation, plus dedicated ones for book celebration and the mascot.
- `PhoneFrame`: keep frame; swap dark surround background to a soft warm gray; Paper interior unchanged.
- `TabBar`: relabel small-caps `HOME / PROGRESS / FRIENDS / PROFILE`, lucide line icons, active = Ink, inactive = Ink Muted, no fill pills.

## 2. Motion utilities (`src/lib/motion.ts`)

Centralize the spec's motion vocabulary so every screen reuses it.

- `pageTurn` variants — horizontal slide + slight skew/opacity for onboarding transitions and entering Active Reading / celebrations.
- `staggerUp` — fade + 8px up, 80ms stagger for summary/analytics rows.
- `breath` — opacity 0.4↔1 over 2s for the Gold dot.
- `letterReveal` — 60ms-per-letter cascade for rank name on level-up.
- Default 250–350ms ease-out everywhere else; reserve springs for celebrations only.

## 3. Screen rewrites

Rewrite the visible composition of each route to the spec. Logic and store APIs are unchanged.

- **Welcome / Onboarding (`onboarding.tsx`)** — split into the 11 stages from §8.1: LECTIO wordmark splash, account stub, quiz intro with mascot motif, 5 questions with hairline Gold progress + selectable Editorial cards, **Path Reveal** screen with huge Gold "MARK" headline and dynamic projection box, reminder picker, "Ready to start" summary. Use `pageTurn` between questions.
- **Home (`index.tsx`)** — top row: small-caps `TODAY · APRIL 24` left, daily-rotated `<GoldMotif>` right. Hero: 88px Gold display numeral streak (Ink when streak = 0), small-caps `DAY STREAK` below. Body-serif status line. Single Primary Gold CTA `START TODAY'S READING` (switches to Secondary `READ MORE` when goal hit). Small-caps `UP NEXT · MARK 4`. 13-week heatmap with Gold-opacity intensity and small-caps `THE LAST THIRTEEN WEEKS` label.
- **Active Reading (`read.tsx`)** — strip chrome: small-caps `CHAPTER FOUR`, Gold display chapter title, large Ink tabular timer, breathing Gold dot, Primary Gold `I'M FINISHED`, small text-button `CANCEL` upper-left with confirmation modal.
- **Quiz (`quiz.tsx`)** — small-caps `QUESTION 3 OF 5` + 5 dots (Gold/Rule), small-caps chapter context, display-serif question, four Editorial answer cards. Tap → border animates to Gold, check fades in, 400ms auto-advance. Failure screen: display-serif "Not quite — give it another try.", 30s Gold hairline cooldown, then `RETAKE QUIZ`. Pass: large Gold check scale-in → Summary.
- **Session Summary (`summary.tsx`)** — staggered entrance. Small-caps `CHAPTER FOUR · COMPLETE` in Gold, large Gold check, display-serif headline (rotate "Nicely done." / "One chapter closer." / "Tomorrow, chapter five."), hairline Ink rule, vertical stats list (small-caps label left, display-serif value right) for time, chapter, streak, book progress. Animated hairline Gold book-progress line. Primary `DONE`, share icon corner.
- **Book Completion Celebration (`celebration.book.tsx`)** — page-turn entrance, soft tier-color gradient wash, large central `<GoldMotif>` (gate/laurel/sheaf chosen by book), massive display-serif book name, small-caps `COMPLETE`, tier hairline progress fill from center over 1.5–2s with subtle particle shimmer, stats line `16 CHAPTERS · 12 DAYS` + tier label, body-serif warm subline, Primary `CONTINUE`.
- **Rank Level-Up (`celebration.rank.tsx`)** — page-turn entrance, small-caps `NEW RANK`, rank name in massive Gold display serif with `letterReveal` cascade, hairline Gold rule, body-serif blurb, Primary `CONTINUE`.
- **Progress (`progress.tsx`)** — add Simple/Detailed small-caps toggle top right (active in Gold, persisted in store). **Simple**: 3 hero stats with small-caps labels, full-year heatmap, 66-book Bible map with tile colors per §8.7 (not started = hairline Rule + Ink-Muted small caps; in-progress = hairline Ink + partial Gold fill; 1× = Forest Green solid + Paper text; 2× = Warm Graphite + Paper; 3×+ = Gold + Ink), tap → chapter-by-chapter detail sheet, hairline Gold testament progress lines with end numerals, **`SEE ADVANCED ANALYTICS` text link** at bottom routing to new page. **Detailed**: append genre stacked bar, 12-week Gold pace line, pace projections block.
- **Friends (`friends.tsx`)** — top FRIENDS / GROUPS small-caps switcher. Friend rows: avatar, body-serif name, display-serif streak with small-caps `DAY STREAK`, weekly chapters in UI sans. Public profile sheet shows streak/rank/books only (no quiz scores, no content). Groups tab: group name display-serif, member count small-caps, weekly collective chapters, leaderboard sheet.
- **Profile (`profile.tsx`)** — avatar, name display-serif, current rank Gold small-caps, hairline Gold XP line with `NEXT · SCRIBE AT 20,000 XP · 4,231 TO GO` small caps. Hairline-divided rows: Account, Reading plan (with live daily-goal projection block), Achievements, Reading history (chronological session list), **Export your data (CSV)**, Other Resources, About / Credits, Sign out.
- **Other Resources (`resources.tsx`)** — keep as a curated list; restyle rows to small-caps `VISIT` text buttons.

## 4. NEW: Advanced Analytics page (`src/routes/analytics.tsx`)

The new feature called out in the spec. Pushed from Progress's `SEE ADVANCED ANALYTICS` link. Densely typographic, all hairline rules and small-caps.

Bands, top to bottom:

1. Back arrow + small-caps `ADVANCED ANALYTICS · ALL TIME`.
2. **Hero band** — huge Gold display numeral (total chapters) with body-serif italic "chapters" on the same baseline, small-caps `SINCE {first session date}`.
3. **30-day activity** — small-caps `THE LAST THIRTY DAYS` left, `+12 VS PREV` Gold small-caps right; tiny inline Gold line+bar SVG chart from `dailyCounts`; below it three stat cells separated by hairline verticals (`12 READING DAYS / 18 CHAPTERS / 1.5 PER DAY AVG`).
4. **Your books** — small-caps header; two-column list of every started book: name display-serif left, `read / total` UI sans right, Gold dot for completed and small Gold arc for in-progress; summary row `3 COMPLETE · 2 IN PROGRESS · 61 UNREAD`.
5. **Pace & projections** — small-caps `AT YOUR CURRENT PACE`, body-serif rows with Gold dots ("Mark in 8 days" / "The Gospels in 41 days" / "The New Testament in 260 days") computed from `dailyGoal`, plus a small Gold ring on the right showing NT % with the percent in its center.
6. **Details grid (3×2)** — `HRS READ / VERSES / AVG START / AVG SESSION / LONGEST SESSION / FIRST CHAPTER`, large display-serif figures, small-caps labels, hairline Gold dividers between cells. Verses derived from a static chapter→verse-count table (approximate values are fine for the prototype).
7. **Streak history** — `CURRENT / LONGEST / TOTAL READING DAYS`.
8. **Favorites** — horizontal small-caps list of mock favorite verse references.
9. Bottom Primary `EXPORT YOUR READING` → triggers CSV download (see §5).

Add small derived helpers in `src/state/store.ts`: `firstSessionDate`, `last30DaysCounts`, `avgStartTime`, `avgSessionMinutes`, `longestSessionMinutes`, `versesRead` (from a small `src/data/verses.ts` map of approximate per-chapter verse counts).

## 5. NEW: CSV export (`src/lib/exportCsv.ts`)

A single utility called from both the Profile row and the Analytics page bottom button.

- File 1 — `lectio-sessions.csv`: one row per `ReadingSession` with columns `date, started_at, completed_at, duration_minutes, book, chapter, translation, quiz_passed, quiz_attempts, xp_earned, streak_at_time, rank_at_time`. We don't currently track `started_at` / `quiz_attempts` / `streak_at_time` per session — we'll backfill: `started_at = completedAt - durationSec`, `quiz_passed = true`, `quiz_attempts = 1`, `streak_at_time` reconstructed by walking sessions in date order.
- File 2 — `lectio-summary.csv`: aggregate totals (chapters, hours, books completed by tier, current streak, longest streak, current rank, total XP).
- Trigger as two sequential downloads via Blob + `URL.createObjectURL` + temporary `<a download>` (client-only, gated on `useClientReady`).

## 6. Half-Bible unlock modal

Wire the existing `silverGoldUnlocked` flag to a full-screen modal that fires the first render after it flips to true (track `silverGoldAcknowledged` in store). Display-serif "You've completed half the Bible.", body-serif explainer, small-caps `A NEW WAY TO KEEP GOING`, Primary `CONTINUE`.

## 7. Mascot

Add `src/components/Mascot.tsx` — a small flat-Gold line-art lamb/geometric creature SVG with optional waving variant. Used only on the onboarding quiz intro and as the icon for the (mocked) reminder card on the Reminder onboarding step. Leaves room to swap in a real mascot later.

## 8. Copy pass

Rewrite headlines and button labels across every screen to match §13: warm, confident, no exclamations, no emoji, no performative framing. Standardize button labels to letter-spaced uppercase UI sans (`START TODAY'S READING`, `I'M FINISHED`, `RETAKE QUIZ`, `CONTINUE`, `DONE`, `EXPORT YOUR READING`, `VISIT`, `ADD FRIEND`, etc.).

## 9. Store additions

Small additions to `src/state/store.ts`:

- `user.progressView: "simple" | "detailed"` (persisted; toggled from Progress).
- `silverGoldAcknowledged: boolean` (for the unlock modal one-shot).
- Domain helpers listed in §4 for analytics.
- A migration shim in `load()`: if a stored state is missing the new fields, merge them from `defaultState()` so existing localStorage from prior builds keeps working.

## 10. Out of scope this pass

Stretch features from §15 (shareable milestone PNGs, annual recap, streak freeze, reading-age comparison, hidden achievements, chapter context cards) and Supabase backing. Sound effects for celebrations are also deferred — visuals only.

---

### Files touched

**Created**: `src/routes/analytics.tsx`, `src/components/Mascot.tsx`, `src/components/GoldMotif.tsx`, `src/components/ui-lectio/{SmallCaps,Rule,EditorialButton,EditorialCard,HairlineProgress}.tsx`, `src/lib/motion.ts`, `src/lib/exportCsv.ts`, `src/data/verses.ts`.

**Rewritten** (visual + copy, logic mostly intact): `src/styles.css`, `src/components/PhoneFrame.tsx`, `src/components/TabBar.tsx`, `src/components/Heatmap.tsx`, `src/routes/__root.tsx` (fonts + meta `Lectio`), `src/routes/index.tsx`, `src/routes/onboarding.tsx`, `src/routes/read.tsx`, `src/routes/quiz.tsx`, `src/routes/summary.tsx`, `src/routes/celebration.book.tsx`, `src/routes/celebration.rank.tsx`, `src/routes/progress.tsx`, `src/routes/friends.tsx`, `src/routes/profile.tsx`, `src/routes/resources.tsx`.

**Extended**: `src/state/store.ts` (progressView, silverGoldAcknowledged, analytics helpers, load() migration).
