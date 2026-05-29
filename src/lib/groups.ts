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
  last_read_date: string | null;
  joined_at: string;
};

export type IncomingGroupInvite = {
  id: string;
  group_id: string;
  group_name: string;
  invited_by_name: string;
  created_at: string;
};

function generateJoinCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export async function listMyGroups(currentUserId: string): Promise<Group[]> {
  const { data: owned, error: e1 } = await supabase
    .from("groups")
    .select("*")
    .eq("owner_id", currentUserId);
  if (e1) throw e1;

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

  for (let i = 0; i < 5; i++) {
    const join_code = generateJoinCode();
    const { data, error } = await supabase
      .from("groups")
      .insert({ name: trimmed, owner_id: currentUserId, join_code })
      .select()
      .single();
    if (!error && data) {
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

  const { data, error } = await supabase.rpc("find_group_by_code", { _code: code });
  if (error) return { ok: false, reason: error.message };
  const group = (Array.isArray(data) ? data[0] : data) as Group | undefined;
  if (!group) return { ok: false, reason: "No group with that code." };

  const { error: insErr } = await supabase
    .from("group_members")
    .insert({ group_id: group.id, user_id: currentUserId });
  if (insErr) {
    if (insErr.code === "23505") return { ok: true, group };
    return { ok: false, reason: insErr.message };
  }
  return { ok: true, group };
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
    .from("public_profiles")
    .select("id, name, username, current_streak, xp, last_read_date")
    .in("id", ids);
  if (e2) throw e2;

  const joinedMap: Record<string, string> = {};
  for (const r of rows ?? []) joinedMap[r.user_id] = r.joined_at;

  return (profiles ?? [])
    .filter((p) => !!p.id)
    .map((p) => ({
      id: p.id as string,
      name: p.name ?? "Friend",
      username: p.username,
      current_streak: p.current_streak ?? 0,
      xp: p.xp ?? 0,
      last_read_date: p.last_read_date ?? null,
      joined_at: joinedMap[p.id as string] ?? "",
    }))
    .sort((a, b) => b.xp - a.xp);
}

export async function removeGroupMember(groupId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function renameGroup(groupId: string, name: string): Promise<void> {
  const trimmed = name.trim();
  if (trimmed.length < 2) throw new Error("Name too short");
  const { error } = await supabase.from("groups").update({ name: trimmed }).eq("id", groupId);
  if (error) throw error;
}

export async function regenerateJoinCode(groupId: string): Promise<string> {
  const { data, error } = await supabase.rpc("regenerate_group_code", { _group_id: groupId });
  if (error) throw error;
  return data as string;
}

// ---------- Group invites ----------

export async function inviteFriendsToGroup(
  groupId: string,
  currentUserId: string,
  inviteeIds: string[],
): Promise<{ invited: number; skipped: number }> {
  if (inviteeIds.length === 0) return { invited: 0, skipped: 0 };

  // Skip people already in the group
  const { data: existingMembers } = await supabase
    .from("group_members")
    .select("user_id")
    .eq("group_id", groupId)
    .in("user_id", inviteeIds);
  const memberSet = new Set((existingMembers ?? []).map((m) => m.user_id));

  // Skip people who already have a pending invite
  const { data: existingInvites } = await supabase
    .from("group_invites")
    .select("invitee_id")
    .eq("group_id", groupId)
    .eq("status", "pending")
    .in("invitee_id", inviteeIds);
  const pendingSet = new Set((existingInvites ?? []).map((m) => m.invitee_id));

  const toInvite = inviteeIds.filter((id) => !memberSet.has(id) && !pendingSet.has(id));
  if (toInvite.length === 0) {
    return { invited: 0, skipped: inviteeIds.length };
  }

  const { error } = await supabase.from("group_invites").insert(
    toInvite.map((id) => ({
      group_id: groupId,
      invitee_id: id,
      invited_by: currentUserId,
    })),
  );
  if (error) throw error;
  return { invited: toInvite.length, skipped: inviteeIds.length - toInvite.length };
}

export async function listIncomingGroupInvites(
  currentUserId: string,
): Promise<IncomingGroupInvite[]> {
  const { data, error } = await supabase
    .from("group_invites")
    .select("id, group_id, invited_by, created_at")
    .eq("invitee_id", currentUserId)
    .eq("status", "pending");
  if (error) throw error;

  const rows = data ?? [];
  if (rows.length === 0) return [];

  const groupIds = Array.from(new Set(rows.map((r) => r.group_id)));
  const inviterIds = Array.from(new Set(rows.map((r) => r.invited_by)));

  const [groupsRes, profRes] = await Promise.all([
    supabase.from("groups").select("id, name").in("id", groupIds),
    supabase.from("public_profiles").select("id, name").in("id", inviterIds),
  ]);

  const groupMap: Record<string, string> = {};
  for (const g of groupsRes.data ?? []) groupMap[g.id] = g.name;
  const profMap: Record<string, string> = {};
  for (const p of profRes.data ?? []) {
    if (p.id) profMap[p.id] = p.name ?? "Someone";
  }

  return rows
    .filter((r) => groupMap[r.group_id])
    .map((r) => ({
      id: r.id,
      group_id: r.group_id,
      group_name: groupMap[r.group_id],
      invited_by_name: profMap[r.invited_by] ?? "Someone",
      created_at: r.created_at,
    }));
}

export async function acceptGroupInvite(inviteId: string): Promise<string> {
  const { data, error } = await supabase.rpc("accept_group_invite", { _invite_id: inviteId });
  if (error) throw error;
  return data as string;
}

export async function declineGroupInvite(inviteId: string): Promise<void> {
  const { error } = await supabase.from("group_invites").delete().eq("id", inviteId);
  if (error) throw error;
}
