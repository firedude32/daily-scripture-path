
## Invite People Who Don't Have Lectio — Guided Flow

Extend the existing "Add a friend" sheet so it serves two intents from one place, and — critically — when someone searches for a friend who isn't on Lectio, the sheet quietly walks them into inviting that person instead of dead-ending.

### Where it lives

The `+` button in the Friends tab opens the existing `AddFriendForm` bottom sheet. We restructure that sheet (no new tab, no new top-level nav) into two calm sections separated by a hairline rule:

1. **Find someone on Lectio** — current email/username search, unchanged on success.
2. **Not on Lectio yet?** — invite block beneath, always visible as a quiet secondary option.

### The guided handoff (the key change)

Today, `sendFriendRequest` returns `{ ok: false, reason: "No one found with that email or username." }` and the form just shows an error toast. We replace that dead end with a graceful handoff:

When search returns "no one found", the sheet transitions in place (no new modal, no jarring switch) to an **Invite step** that:

- Acknowledges the miss gently: *"We couldn't find anyone with that email. Want to invite them instead?"*
- Pre-fills the invite. If the query was an email, the primary action becomes **Email an invite** with a `mailto:{email}?subject=...&body=...` already populated. If it was a username, primary becomes **Share invite** (native share sheet) since we have no contact channel.
- Shows the personal invite link with a Copy button.
- Offers a quiet "Search again" link to go back to step 1.

This way the user is never stopped — the moment they learn their friend isn't on Lectio, the next tap already drafts the invite.

### How invites work

Personal invite link per user: `https://lectio.live/?ref={username}` (fallback `?ref={userId}` if no username set).

Share options inside the invite step:
- **Share** (primary on mobile) — `navigator.share()` opens iOS's native share sheet (Messages, Mail, WhatsApp). Falls back to Copy on desktop.
- **Copy link** — copies link with `toast.success("Link copied")`.
- **Text** — `sms:?&body=...` with pre-written message.
- **Email** — `mailto:?subject=...&body=...` with pre-written message (auto-addressed when handoff came from an email search).

Pre-written copy stays on-brand:
> "I've been using Lectio to read the Bible a little each day. Thought you might like it too — https://lectio.live/?ref=hannah"

### Tracking (lightweight)

A soft "3 people opened your link" line appears in the invite block once at least one click has been recorded:

- `invite_clicks` table keyed by `ref` with `clicked_at`.
- A tiny server function records a click when `?ref=` is on the landing page (once per session via localStorage flag).
- The `ref` is stashed in localStorage and, on signup, written to a new `profiles.referred_by` column.

### Auto-connect after signup

When someone signs up via `?ref=`:
- On first authenticated load, if `profiles.referred_by` is set and unclaimed, the Home page surfaces a one-tap "Add {Name}" card for a day (not auto-sent — respects both sides).
- The referrer gets a quiet toast next time they open the app: "{Name} joined Lectio."

### Landing page touch

`/` reads `?ref=` and renders one small line under the hero: "Hannah invited you." Nothing else changes on the landing page.

### Out of scope (v1)

- Contact-book access — too invasive for Lectio's tone.
- QR codes — easy to add later as a secondary action.
- Group invite links — groups already have join codes; we mention this inline so users don't conflate the two.

### Files touched

```text
src/routes/_authenticated/friends.tsx     — restructure AddFriendForm into a 2-step sheet (Search → Invite handoff on miss)
src/components/InviteBlock.tsx            — new: share/copy/sms/email actions + click counter, accepts optional prefilledEmail
src/lib/invites.ts                        — new: build link, record click, claim ref on signup
src/routes/index.tsx                      — read ?ref= on landing, show "X invited you"
src/routes/_authenticated/index.tsx       — one-tap "Add X" card when referred_by is unclaimed
supabase migration                         — invite_clicks table; profiles.referred_by column
```

### Open questions

1. Personal link slug: prefer `username`, fall back to `userId`?
2. Show the "X opened your link" counter only after the first click lands (keeps empty state quiet)?
3. Auto-friend-request on signup vs. one-tap suggestion? Recommendation: one-tap, both sides confirm.
