import { supabase } from "@/integrations/supabase/client";

const REF_KEY = "lectio.ref";
const REF_CLICKED_KEY = "lectio.ref.clicked";

export function getStoredRef(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(REF_KEY);
  } catch {
    return null;
  }
}

export function clearStoredRef(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(REF_KEY);
    localStorage.removeItem(REF_CLICKED_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Read `?ref=` from the current URL, stash it in localStorage, and (once per
 * session per ref) log a click row. Safe to call on every public page load.
 */
export async function captureRefFromUrl(): Promise<void> {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (!ref) return;

  try {
    localStorage.setItem(REF_KEY, ref);
  } catch {
    /* ignore */
  }

  const clickKey = `${REF_CLICKED_KEY}:${ref}`;
  let alreadyClicked = false;
  try {
    alreadyClicked = !!localStorage.getItem(clickKey);
  } catch {
    /* ignore */
  }
  if (alreadyClicked) return;

  try {
    const { data: refUserId } = await supabase.rpc("resolve_ref_to_user_id", {
      _ref: ref,
    });
    if (refUserId) {
      await supabase.from("invite_clicks").insert({
        ref_user_id: refUserId as string,
        user_agent: navigator.userAgent.slice(0, 200),
      });
      try {
        localStorage.setItem(clickKey, "1");
      } catch {
        /* ignore */
      }
    }
  } catch (err) {
    console.warn("captureRefFromUrl failed", err);
  }
}

/**
 * After authentication, if we have a stored ref, write it to the new user's
 * `profiles.referred_by`. Only sets it if currently null (first-time claim).
 */
export async function claimRefForUser(userId: string): Promise<void> {
  const ref = getStoredRef();
  if (!ref) return;
  try {
    const { data: refUserId } = await supabase.rpc("resolve_ref_to_user_id", {
      _ref: ref,
    });
    if (!refUserId || refUserId === userId) {
      clearStoredRef();
      return;
    }
    // Only set if not already set
    const { data: profile } = await supabase
      .from("profiles")
      .select("referred_by")
      .eq("id", userId)
      .maybeSingle();
    if (profile && profile.referred_by == null) {
      await supabase
        .from("profiles")
        .update({ referred_by: refUserId as string })
        .eq("id", userId);
    }
    clearStoredRef();
  } catch (err) {
    console.warn("claimRefForUser failed", err);
  }
}

export interface InviteLinkInfo {
  url: string;
  slug: string;
}

/**
 * Build a personal invite link. Prefers username, falls back to user id.
 */
export function buildInviteLink(opts: {
  username: string | null;
  userId: string;
}): InviteLinkInfo {
  const slug = (opts.username && opts.username.trim()) || opts.userId;
  const base =
    typeof window !== "undefined"
      ? `${window.location.origin}`
      : "https://lectio.live";
  return { url: `${base}/?ref=${encodeURIComponent(slug)}`, slug };
}

export function inviteMessage(name: string, url: string): string {
  return `Hi! I've been using Lectio to read a little Scripture each day — calm, no pressure. Thought you might like it: ${url}\n— ${name}`;
}

export async function countInviteClicks(userId: string): Promise<number> {
  const { count } = await supabase
    .from("invite_clicks")
    .select("*", { count: "exact", head: true })
    .eq("ref_user_id", userId);
  return count ?? 0;
}

export interface ReferrerInfo {
  id: string;
  name: string;
}

/**
 * Look up the user who referred the current user, if any and not yet claimed.
 */
export async function getUnclaimedReferrer(
  userId: string,
): Promise<ReferrerInfo | null> {
  const { data: me } = await supabase
    .from("profiles")
    .select("referred_by, referred_by_claimed")
    .eq("id", userId)
    .maybeSingle();
  if (!me || !me.referred_by || me.referred_by_claimed) return null;
  const { data: ref } = await supabase
    .from("public_profiles")
    .select("id, name")
    .eq("id", me.referred_by)
    .maybeSingle();
  if (!ref || !ref.id) return null;
  return { id: ref.id, name: ref.name ?? "Friend" };
}

export async function markReferrerClaimed(userId: string): Promise<void> {
  await supabase
    .from("profiles")
    .update({ referred_by_claimed: true })
    .eq("id", userId);
}
