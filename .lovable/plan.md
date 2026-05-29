## Scope

Features 1–4 already exist. This plan covers (a) adding share to the existing book + rank celebrations, (b) adding a lightweight share-only modal for streak / Gospel / NT / Bible milestones, (c) removing the daily summary share sheet, and (d) a new Admin "Celebrations" tab so every state is testable.

## 1. Server-rendered share cards

New server route `src/routes/api/public/share-card.$kind.ts` using `@vercel/og` (Satori) to render PNGs.

- Kinds: `book`, `rank`, `streak`, `gospel`, `nt`, `bible`.
- Query params include `title`, `subtitle`, `tier`, `streak`, `books`, `size` (`story` = 1080×1920, `square` = 1080×1080).
- Layout: centered focal element (book/rank/milestone name in display serif + a single Lucide-style SVG glyph), small Lectio wordmark + supporting stats (streak days, books read) along sides/bottom. Lectio parchment palette, hairline gold rule, generous whitespace.
- Fonts: load Cormorant Garamond + Inter via Satori `fetch` from Google Fonts at request time (cached by Worker).
- Endpoint is public (no PII), returns `image/png` with long cache headers.

Install: `bun add @vercel/og` (Worker-compatible per Vercel docs; uses WASM Satori + Resvg). Verify build; if Resvg-WASM is blocked on Workers, fall back to `satori` + `@resvg/resvg-wasm` directly with the WASM imported as URL asset.

## 2. Share helper

`src/lib/share.ts` — `shareMilestone({ kind, params })`:
- Builds two URLs (story + square).
- Fetches the story PNG as a `File`.
- Calls `navigator.share({ files, title, text })` if `canShare({ files })`; otherwise opens the PNG in a new tab and copies a fallback caption.

## 3. Celebration screen share buttons

- `celebration.book.tsx`: add a "Share" `EditorialButton variant="secondary"` below Done. Wires to `shareMilestone({ kind: 'book', params: { bookId, tier, streak, booksCompleted } })`.
- `celebration.rank.tsx`: same, kind `rank`, params `{ rankName, blurb }`.

## 4. Streak / Gospel / NT / Bible share modal

New `src/components/MilestoneShareModal.tsx` — a `BottomSheet` with: eyebrow ("Quietly"), milestone title, a small preview thumbnail (the square card via `<img src=...>`), one Share button, one Dismiss.

Triggered from a new helper `src/lib/milestones.ts` that, after each reading session, inspects the new state vs prior:
- Day 7 streak crossed → kind `streak`, days=7.
- Day 30 streak crossed → kind `streak`, days=30.
- Final chapter of Matthew/Mark/Luke/John just completed → kind `gospel`, name.
- Last NT book completed → kind `nt`.
- All 66 books completed ≥1 → kind `bible`.

Triggers run after the existing book celebration / rank-up navigation, surfacing the modal on the next Home render via a `pendingMilestone` field on the store. Only one fires per session; rank/book celebrations take precedence and the milestone surfaces after they're dismissed.

## 5. Remove daily summary share sheet

`src/routes/_authenticated/summary.tsx`: delete the `Share2` icon, `shareOpen` state, the `BottomSheet`, the `ShareBtn` component, and related imports. Keep the rest of the summary intact.

## 6. Admin "Celebrations" tab

New tab in `src/routes/_authenticated/admin.tsx` (added to the tab list and rendered via a `CelebrationsTab` component). Buttons:

- **Book completion** — book picker (default Mark) + tier toggle Green / Silver / Gold → sets `pendingCelebration` and navigates `/celebration/book`.
- **Rank-up** — rank index picker (0–9) → sets `pendingRankUp` and navigates `/celebration/rank`.
- **Silver/Gold unlock** — sets `silverGoldUnlocked = true`, `silverGoldAcknowledged = false`, `pendingCelebration` (Mark/gold) → navigates `/celebration/book` (modal fires after Done).
- **Today's Note variants** — 6 buttons (`left_off`, `another_look`, `on_chapter`, `record`, `book_note`, `favorite`). Each writes a tiny `forceTodaysNoteVariant` field on the store; `TodaysNote.tsx` honors it if set (dev/admin only) and navigates to `/`.
- **Milestone share modals** — 5 buttons: Day 7, Day 30, Gospel (Mark), NT, Bible. Each sets `pendingMilestone` and navigates `/`.
- **Share card preview** — for each kind, two anchor links open the story/square PNG endpoints directly so the designed card itself is reviewable.

All admin actions are local store mutations + navigation, no DB writes.

## 7. Store additions (`src/state/store.ts`)

- `pendingMilestone: { kind, params } | null` + `setPendingMilestone` / `clearPendingMilestone`.
- `forceTodaysNoteVariant: VariantKey | null` + setter (admin-only override; cleared after one read).

## Technical notes

```text
src/routes/api/public/share-card.$kind.ts     server route, returns PNG
src/lib/share.ts                              navigator.share wrapper
src/lib/milestones.ts                         detects + queues milestones
src/components/MilestoneShareModal.tsx        bottom sheet UI
src/state/store.ts                            pendingMilestone + force variant
src/routes/_authenticated/admin.tsx           + Celebrations tab
src/routes/_authenticated/celebration.book.tsx + Share button
src/routes/_authenticated/celebration.rank.tsx + Share button
src/routes/_authenticated/summary.tsx         remove share sheet
src/routes/_authenticated/index.tsx           render MilestoneShareModal when pending
src/components/TodaysNote.tsx                 honor forceTodaysNoteVariant
```

Risk: if `@vercel/og` fails on Cloudflare Workers in this template, fall back to a client-rendered `html2canvas` approach in `src/lib/share.ts` without changing the call sites. Decided after first build attempt.
