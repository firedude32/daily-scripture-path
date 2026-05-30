# Polish pass: skeletons, caching, optimistic UI

I went through each route and asked "does this idea actually make Lectio feel better, given the design philosophy of calm and patience?" — not everything below should ship. Here's what I'd do and what I'd skip.

## Guiding rule

The store already hydrates once at `_authenticated` mount and keeps everything in memory via `useSyncExternalStore`. So 90% of screens (home, progress, profile, analytics, read, quiz) are **already instant** after first load. Skeletons and caching only matter on the few screens that hit Supabase per-mount: **friends/groups**, and **invites/leaderboards**. That's where the work goes.

Optimistic UI matters for tap-driven actions that currently feel laggy: marking a chapter, friend/group mutations, settings toggles.

---

## 1. Skeletons — selective, not blanket

**Add skeletons on:**
- `_authenticated.tsx` hydration gate — replace the "Loading…" text with a low-key skeleton of the home screen layout (header strip, chapter card, streak row). This is the only full-screen wait a user sees.
- `friends.tsx` — list of friend rows + group cards while `loadAll()` runs. Currently shows nothing/blank.
- Group detail sheet — member list skeleton while `listGroupMembers` runs.
- Friend profile sheet — stat blocks skeleton while friend data loads.

**Skip skeletons on:**
- Home, progress, analytics, profile, read, quiz — store is already hydrated, no async wait.
- Celebration / share modals — they open from in-memory state.
- Admin — internal tool.

Skeleton style: warm parchment surface, hairline borders, no shimmer (shimmer breaks the calm tone). A single subtle opacity pulse at ~2s cadence at most.

## 2. Caching — TanStack Query for the Supabase-backed lists only

Right now `friends.tsx`, group sheets, and invites re-fetch on every mount via `useState` + `useEffect`. Navigating away and back triggers a network round-trip and a blank state.

**Introduce TanStack Query** (already in the stack) for:
- `listFriendships(userId)` → `['friends', userId]`, staleTime 60s
- `listGroups(userId)` → `['groups', userId]`, staleTime 60s
- `listGroupMembers(groupId)` → `['group-members', groupId]`, staleTime 30s
- `listIncomingGroupInvites(userId)` → `['group-invites', userId]`, staleTime 30s
- `getFriendProfile(friendId)` / friend stats → `['friend-profile', id]`, staleTime 60s
- Leaderboard query on home/friends → `['leaderboard', scope]`, staleTime 60s

Result: tabbing between Friends and Home and back returns instantly with last data, refetches in background. Matches the "quiet companion" feel — never a blank flash.

**Do NOT cache via Query:**
- The main app store (profile/sessions/book_progress) — already in-memory, would duplicate state.
- One-shot mutations (signOut, quiz submit).

**Persist Query cache to sessionStorage** so cold reloads in the same session stay instant. Not localStorage — we don't want stale friend stats across days.

## 3. Optimistic UI — only where the user clearly drives the change

**Add optimistic updates for:**
- **Chapter completion** (`recordSession` in `store.ts`) — already partially optimistic (local state updates immediately, Supabase writes in background). Audit and confirm: streak bump, XP, daily count all paint before the network completes. If the insert fails, surface a quiet toast and roll back the session row only (not XP/streak — too jarring).
- **Settings toggles** (daily goal, reminder time, translation, progress view, avatar) — already optimistic in `setState` calls, persist runs after. Just add a quiet failure toast.
- **Username set** — currently awaits round-trip. Keep awaited (uniqueness check needs server response), but show inline spinner instead of blocking the whole sheet.
- **Friend remove / group leave / group rename** — remove the row from the cached list immediately, rollback on error.
- **Group invite accept/decline** — remove from invite list immediately, refetch groups in background.
- **Acknowledge silver/gold** — already local-first.

**Do NOT add optimistic UI for:**
- **Friend add by email** — needs server confirmation (does the user exist?). Show pending state instead.
- **Group create / join by code** — same reason; needs the returned group object.
- **Quiz submission** — correctness comes from the quiz data, not the server, but the resulting session record needs to land before navigating to the summary screen with real XP numbers. Keep the small await; it's <100ms with the in-memory model.

## Technical details

- Wire `QueryClientProvider` in `__root.tsx` if not already there; put `queryClient` in router context per the `tanstack-query-integration` pattern. Use `defaultPreloadStaleTime: 0`.
- Skeletons: one new `<Skeleton>` primitive in `src/components/ui-lectio/Skeleton.tsx` (parchment bg, hairline border, optional pulse). Reuse across all skeleton states.
- Convert `friends.tsx` data calls from `useState`+`useEffect` to `useQuery` (not `useSuspenseQuery` — we want the skeleton, not suspense fallback). Mutations use `useMutation` with `onMutate`/`onError` for optimistic rollback and `onSettled` for invalidation.
- Invalidation map: friend mutations invalidate `['friends']`; group mutations invalidate `['groups']` and `['group-members', id]`.
- Persistence: add `@tanstack/query-sync-storage-persister` + `persistQueryClient` against `sessionStorage`, key prefix `lectio-cache-v1`.
- No changes to the app store's shape or to any other route file.

## What I'm intentionally NOT doing

- No skeletons on already-hydrated screens — adds visual noise for zero gain.
- No optimistic UI for server-validated actions — silently rolling back a "friend added" feels worse than a 400ms wait.
- No shimmer animation — clashes with the calm aesthetic.
- No localStorage persistence of friend/group data — stale social data is worse than a 1s refetch.
- No prefetching on hover — mobile app, no hover, and route data is mostly already in memory.
