# Make Friends & Groups Fully Functional

Today the page already supports: sending friend invites by email/username, accepting/declining, removing friends, creating a group, joining by code, viewing a leaderboard, leaving/deleting. What's missing for it to feel "complete" is mainly **group invitations** (you can only join by code, you can't actually *invite* someone to a group), **shareable join links** (mirroring the friend-invite walkthrough), and **owner controls**. Here's the full scope.

## 1. Invite a friend directly into a group

New flow inside the group detail sheet:
- "Invite friends" button → opens a picker of your accepted friends with checkboxes.
- Friends already in the group are shown as disabled with "In group".
- Submitting creates pending `group_invites` rows; the invitee sees them on the Friends tab.

## 2. Group invitations (accept / decline)

New `group_invites` table with RLS:
- Inviter must be a member of the group.
- Invitee can read their own invites, accept (joins the group), or decline (deletes the row).
- Owner/inviter can cancel a pending invite.

UI:
- Friends tab "Pending Invites" section gets a second group: **Group Invites**. Each row shows "{Inviter} invited you to {Group}" with Accept/Decline.
- The gold dot on the Friends tab also lights when group invites are pending.

## 3. Shareable group join link (walks non-app friends in)

- `buildGroupJoinLink(code)` → `https://lectio.live/?join=CODE&from={username|id}`.
- Group detail sheet gains a "Share invite link" row using the existing `InviteBlock` pattern (native share / SMS / mail / copy). Pre-fills a message: *"Join my Lectio reading group: {link}"*.
- Root captures `?join=CODE` on load (same place we capture `?ref=`) and stores it in localStorage as `lectio.pendingJoin`.
- After login/signup, the home page redeems it via `joinGroupByCode` and shows a toast "Joined {Group}".

## 4. Owner controls

Inside the group detail sheet, when `userId === owner_id`:
- **Rename group**: tap the title to edit inline; saves via update on `groups`.
- **Remove member**: trash icon next to each non-owner row; confirm, then delete from `group_members`.
- **Regenerate join code**: small "New code" action with confirm (invalidates the old code).

Add an RLS policy so the owner can delete `group_members` rows in their own group (currently only the member can leave themselves).

## 5. Group activity signal

The leaderboard already shows streak + XP. Add **last-read** under each member ("Read today" / "2 days ago" / "—") using `last_read_date` from `public_profiles`. Tiny, calm — no badges.

## 6. Friend list polish

- Search field at top of the AddFriendForm now also matches **name** (case-insensitive `ilike`), not just exact email/username. Existing email RPC stays as the authoritative email path.
- Sort accepted friends by current_streak desc, then name.

## 7. Empty/loading polish

- Skeleton lines instead of the centered "Loading…" text in both tabs.
- After accepting a group invite or joining via link, auto-open that group's detail sheet so the user lands somewhere meaningful.

---

## Technical notes

**Migration** (new):
- `group_invites(id, group_id, invitee_id, invited_by, status default 'pending', created_at)` with unique `(group_id, invitee_id)` where status='pending'.
- GRANTs for `authenticated` + `service_role`; RLS:
  - INSERT: `auth.uid() = invited_by AND is_group_member(group_id, auth.uid())`.
  - SELECT: invitee, inviter, or group owner.
  - UPDATE: invitee only, pending→accepted.
  - DELETE: invitee (decline) or inviter/owner (cancel).
- Trigger on accepted insert into `group_members`, then delete the invite row — or do it in the client transaction; will use a SECURITY DEFINER RPC `accept_group_invite(_invite_id)` to keep it atomic.
- New policy on `group_members` DELETE: allow `auth.uid()` to be either the member OR the group owner.
- New RPC `regenerate_group_code(_group_id)` (owner-only) returning the new code.
- Extend `public_profiles` view consumption to include `last_read_date` (already in the view).

**Files**:
- `src/lib/groups.ts` — add `inviteFriendsToGroup`, `listIncomingGroupInvites`, `acceptGroupInvite`, `declineGroupInvite`, `removeGroupMember`, `renameGroup`, `regenerateJoinCode`, `buildGroupJoinLink`.
- `src/lib/invites.ts` — add `capturePendingJoinFromUrl` + `claimPendingJoin` (mirrors ref capture).
- `src/routes/__root.tsx` — call `capturePendingJoinFromUrl` alongside `captureRefFromUrl`.
- `src/routes/_authenticated/index.tsx` — call `claimPendingJoin` after `claimRefForUser`.
- `src/routes/_authenticated/friends.tsx` — new "Group Invites" section, group invite picker sheet, owner controls in `GroupDetail`, rename/regenerate UI, share-link block in group sheet, member-removal UI, name-search in AddFriendForm.
- `src/components/InviteBlock.tsx` — accept an optional `link` + `message` prop so it can be reused for group invites.

**Out of scope** (call out so it doesn't surprise the user): group chat/messages, push notifications, email delivery of invites (we rely on in-app + share sheet), per-group reading plans.