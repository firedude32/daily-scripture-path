import { supabase } from "@/integrations/supabase/client";

export type FriendProfile = {
  id: string;
  name: string;
  username: string | null;
  email: string;
  current_streak: number;
  xp: number;
};

export type Friendship = {
  user_id: string;
  friend_user_id: string;
  requested_by: string;
  status: "pending" | "accepted";
  created_at: string;
};

export type FriendRow = {
  friendship: Friendship;
  /** the OTHER person in the relationship */
  other: FriendProfile;
  /** convenience flags from current user's POV */
  isIncoming: boolean; // pending and the other side requested
  isOutgoing: boolean; // pending and current user requested
};

async function fetchProfilesByIds(ids: string[]): Promise<Record<string, FriendProfile>> {
  if (ids.length === 0) return {};
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, username, email, current_streak, xp")
    .in("id", ids);
  if (error) throw error;
  const map: Record<string, FriendProfile> = {};
  for (const p of data ?? []) map[p.id] = p as FriendProfile;
  return map;
}

export async function listFriendships(currentUserId: string): Promise<FriendRow[]> {
  const { data, error } = await supabase
    .from("friendships")
    .select("user_id, friend_user_id, requested_by, status, created_at")
    .or(`user_id.eq.${currentUserId},friend_user_id.eq.${currentUserId}`);
  if (error) throw error;

  const rows = (data ?? []) as Friendship[];
  const otherIds = Array.from(
    new Set(rows.map((r) => (r.user_id === currentUserId ? r.friend_user_id : r.user_id))),
  );
  const profiles = await fetchProfilesByIds(otherIds);

  return rows
    .map((r) => {
      const otherId = r.user_id === currentUserId ? r.friend_user_id : r.user_id;
      const other = profiles[otherId];
      if (!other) return null;
      return {
        friendship: r,
        other,
        isIncoming: r.status === "pending" && r.requested_by !== currentUserId,
        isOutgoing: r.status === "pending" && r.requested_by === currentUserId,
      } as FriendRow;
    })
    .filter((x): x is FriendRow => x !== null);
}

export async function findProfileByEmailOrUsername(
  query: string,
): Promise<FriendProfile | null> {
  const q = query.trim();
  if (!q) return null;
  const isEmail = q.includes("@");
  const column = isEmail ? "email" : "username";
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, username, email, current_streak, xp")
    .eq(column, isEmail ? q.toLowerCase() : q)
    .maybeSingle();
  if (error) throw error;
  return (data as FriendProfile) ?? null;
}

export async function sendFriendRequest(
  currentUserId: string,
  targetQuery: string,
): Promise<{ ok: true; friend: FriendProfile } | { ok: false; reason: string }> {
  if (!targetQuery.trim()) return { ok: false, reason: "Enter an email or username." };
  const target = await findProfileByEmailOrUsername(targetQuery);
  if (!target) return { ok: false, reason: "No one found with that email or username." };
  if (target.id === currentUserId) return { ok: false, reason: "That's you." };

  // Check existing
  const { data: existing } = await supabase
    .from("friendships")
    .select("status, requested_by, user_id, friend_user_id")
    .or(
      `and(user_id.eq.${currentUserId},friend_user_id.eq.${target.id}),and(user_id.eq.${target.id},friend_user_id.eq.${currentUserId})`,
    )
    .maybeSingle();

  if (existing) {
    if (existing.status === "accepted") return { ok: false, reason: "You're already friends." };
    return { ok: false, reason: "There's already a pending invite." };
  }

  const { error } = await supabase.from("friendships").insert({
    user_id: currentUserId,
    friend_user_id: target.id,
    requested_by: currentUserId,
    status: "pending",
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true, friend: target };
}

export async function acceptFriendRequest(
  currentUserId: string,
  otherUserId: string,
): Promise<void> {
  const { error } = await supabase
    .from("friendships")
    .update({ status: "accepted" })
    .or(
      `and(user_id.eq.${currentUserId},friend_user_id.eq.${otherUserId}),and(user_id.eq.${otherUserId},friend_user_id.eq.${currentUserId})`,
    );
  if (error) throw error;
}

export async function removeFriendship(
  currentUserId: string,
  otherUserId: string,
): Promise<void> {
  const { error } = await supabase
    .from("friendships")
    .delete()
    .or(
      `and(user_id.eq.${currentUserId},friend_user_id.eq.${otherUserId}),and(user_id.eq.${otherUserId},friend_user_id.eq.${currentUserId})`,
    );
  if (error) throw error;
}
