import { supabase } from "@/integrations/supabase/client";

export type Group = {
  id: string;
  name: string;
  owner_id: string;
  join_code: string;
  created_at: string;
};

export type GroupMember = {
  id: string;
  name: string;
  username: string | null;
  current_streak: number;
  xp: number;
  joined_at: string;
};

function generateJoinCode(): string {
  // 6 chars, no confusing 0/O/1/I
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export async function listMyGroups(currentUserId: string): Promise<Group[]> {
  // Owned
  const { data: owned, error: e1 } = await supabase
    .from("groups")
    .select("*")
    .eq("owner_id", currentUserId);
  if (e1) throw e1;

  // Member-of (via group_members RLS)
  const { data: memberships, error: e2 } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", currentUserId);
  if (e2) throw e2;

  const memberGroupIds = (memberships ?? []).map((m) => m.group_id);
  let memberGroups: Group[] = [];
  if (memberGroupIds.length > 0) {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .in("id", memberGroupIds);
    if (error) throw error;
    memberGroups = (data ?? []) as Group[];
  }

  const seen = new Set<string>();
  const all: Group[] = [];
  for (const g of [...(owned ?? []), ...memberGroups] as Group[]) {
    if (!seen.has(g.id)) {
      seen.add(g.id);
      all.push(g);
    }
  }
  return all.sort((a, b) => a.name.localeCompare(b.name));
}

export async function createGroup(
  currentUserId: string,
  name: string,
): Promise<{ ok: true; group: Group } | { ok: false; reason: string }> {
  const trimmed = name.trim();
  if (trimmed.length < 2) return { ok: false, reason: "Pick a longer name." };

  // Try a few times in case of join_code collision
  for (let i = 0; i < 5; i++) {
    const join_code = generateJoinCode();
    const { data, error } = await supabase
      .from("groups")
      .insert({ name: trimmed, owner_id: currentUserId, join_code })
      .select()
      .single();
    if (!error && data) {
      // Owner joins as member too
      await supabase.from("group_members").insert({
        group_id: data.id,
        user_id: currentUserId,
      });
      return { ok: true, group: data as Group };
    }
    if (error && error.code !== "23505") {
      return { ok: false, reason: error.message };
    }
  }
  return { ok: false, reason: "Couldn't generate a unique code. Try again." };
}

export async function joinGroupByCode(
  currentUserId: string,
  rawCode: string,
): Promise<{ ok: true; group: Group } | { ok: false; reason: string }> {
  const code = rawCode.trim().toUpperCase();
  if (code.length < 4) return { ok: false, reason: "Enter a valid code." };

  const { data: group, error } = await supabase
    .from("groups")
    .select("*")
    .eq("join_code", code)
    .maybeSingle();
  if (error) return { ok: false, reason: error.message };
  if (!group) return { ok: false, reason: "No group with that code." };

  const { error: insErr } = await supabase
    .from("group_members")
    .insert({ group_id: group.id, user_id: currentUserId });
  if (insErr) {
    if (insErr.code === "23505") return { ok: false, reason: "You're already in this group." };
    return { ok: false, reason: insErr.message };
  }
  return { ok: true, group: group as Group };
}

export async function leaveGroup(currentUserId: string, groupId: string): Promise<void> {
  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", currentUserId);
  if (error) throw error;
}

export async function deleteGroup(groupId: string): Promise<void> {
  const { error } = await supabase.from("groups").delete().eq("id", groupId);
  if (error) throw error;
}

export async function listGroupMembers(groupId: string): Promise<GroupMember[]> {
  const { data: rows, error } = await supabase
    .from("group_members")
    .select("user_id, joined_at")
    .eq("group_id", groupId);
  if (error) throw error;

  const ids = (rows ?? []).map((r) => r.user_id);
  if (ids.length === 0) return [];

  const { data: profiles, error: e2 } = await supabase
    .from("profiles")
    .select("id, name, username, current_streak, xp")
    .in("id", ids);
  if (e2) throw e2;

  const joinedMap: Record<string, string> = {};
  for (const r of rows ?? []) joinedMap[r.user_id] = r.joined_at;

  return (profiles ?? [])
    .map((p) => ({
      id: p.id,
      name: p.name,
      username: p.username,
      current_streak: p.current_streak ?? 0,
      xp: p.xp ?? 0,
      joined_at: joinedMap[p.id] ?? "",
    }))
    .sort((a, b) => b.xp - a.xp);
}
