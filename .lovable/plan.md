## Goal

The first few times a signed-in user opens Lectio in a mobile browser (and isn't already running it as an installed PWA), show a calm, dismissible prompt that explains — in device-appropriate language — how to add Lectio to their home screen. It should feel like the rest of the app: parchment surface, hairline border, serif headline, no urgency.

## When it shows

Show only when ALL are true:
- On a phone-sized viewport (mobile UA or width < 768).
- Not already launched as an installed app (`display-mode: standalone` is false and `navigator.standalone` is not true).
- The user has been shown it fewer than 3 times.
- They haven't tapped "Don't show again."
- Not on the auth/onboarding routes — only after they reach `/_authenticated/` (home).
- At least ~6 seconds after the home screen mounts on that visit (so it never competes with the daily CTA), and never on the same calendar day twice.

Counter and "dismissed forever" flag live in `localStorage` (`lectio.a2hs.v1`: `{ shownCount, lastShownDate, dismissed, installedDetected }`). If we detect the app is now running standalone, set `installedDetected: true` and never prompt again.

We also listen for the Chrome/Android `beforeinstallprompt` event. When that fires we stash it and the prompt uses a real "Install" button instead of instructions. On `appinstalled`, set `installedDetected: true`.

## Device detection

A small helper `src/lib/platform.ts` returns one of: `ios-safari`, `ios-other` (Chrome/Firefox/Edge on iOS — all WebKit, all use the same Share → Add to Home Screen flow), `ipados` (treated like iOS Safari; detected via `navigator.maxTouchPoints > 1` on Mac UA), `android-chrome` (covers Chrome, Edge, Brave, Samsung Internet — all support `beforeinstallprompt`), `android-firefox` (manual menu instructions), `desktop` (skip the prompt), `unknown` (skip).

Detection uses `navigator.userAgent` + `navigator.userAgentData` when available, plus the standalone checks above. No external library.

## Instruction copy per device

Tone: quiet, instructional, no exclamation marks. Headline is always "Keep Lectio close." Sub: "Add it to your home screen so it's one tap away."

- **iOS Safari / iPadOS / iOS Chrome-Firefox-Edge** (all WebKit, identical flow):
  Step 1 — Tap the Share icon `⎙` at the bottom of Safari.
  Step 2 — Scroll and tap "Add to Home Screen."
  Step 3 — Tap "Add."
  Note for non-Safari iOS browsers: "On iPhone, this only works in Safari. Open lectio.live in Safari to add it." with a "Copy link" button.
- **Android Chrome / Edge / Brave / Samsung Internet** (when `beforeinstallprompt` fired):
  Single primary button: "Install Lectio." Tapping calls `prompt()` on the saved event.
- **Android Chrome / Edge** (event didn't fire — e.g. already dismissed natively, or unsupported build):
  Step 1 — Tap the ⋮ menu (top right).
  Step 2 — Tap "Add to Home screen" (or "Install app").
  Step 3 — Tap "Add."
- **Android Firefox**:
  Step 1 — Tap the ⋮ menu.
  Step 2 — Tap "Install."
- **Desktop / unknown**: don't show the prompt.

Each variant ends with two actions: "Maybe later" (closes; counts toward the 3-shown limit) and "Don't show again" (sets `dismissed: true`).

## UI

New component `src/components/AddToHomeScreenSheet.tsx` — a bottom sheet using the existing `BottomSheet` primitive in `src/components/ui-lectio/BottomSheet.tsx`. Layout:
- `SmallCaps` eyebrow: "A small ritual"
- Serif headline: "Keep Lectio close."
- Body: instruction list (numbered, generous spacing, serif numerals)
- For iOS, render a small inline SVG of the iOS Share glyph beside step 1; for Android, the ⋮ glyph
- Footer: two `EditorialButton`s — `secondary` "Maybe later", `link`-style "Don't show again"

Mount it once in `src/routes/_authenticated.tsx` alongside `MilestoneShareModal` so it can appear over any authenticated screen but never on auth/onboarding/celebration-only flows. Internally it self-gates on route (`useRouterState`) and only opens on `/`.

## Manifest

`public/manifest.webmanifest` already has `display: standalone`, name, theme color, and a 512×512 icon. We'll add a 192×192 icon entry (Android prefers it) — confirm `public/images/lectio-icon.png` is large enough to also be referenced at 192, or fall back to a single `purpose: "any maskable"` entry. No `start_url`/`scope` changes (those are sticky after install per the PWA guidance). No service worker — manifest-only, per the PWA skill's home-screen path.

## Files

- New: `src/lib/platform.ts` — device + standalone detection.
- New: `src/lib/a2hs.ts` — localStorage gating, `beforeinstallprompt` capture, `appinstalled` listener (module-level singleton initialized once).
- New: `src/components/AddToHomeScreenSheet.tsx` — the sheet UI.
- Edit: `src/routes/_authenticated.tsx` — mount the sheet.
- Edit: `public/manifest.webmanifest` — add 192px icon if needed.

No store changes, no Supabase changes, no service worker.

## Open question

The "first few times" limit — is **3 separate visits** the right number, or do you want fewer/more (e.g. just once, or up to 5)? I'll default to 3 unless you say otherwise.
