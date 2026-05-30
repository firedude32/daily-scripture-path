import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Check, X, Flame, Users, Copy, ChevronRight, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { BottomSheet } from "@/components/ui-lectio/BottomSheet";
import { useAppState } from "@/state/store";
import {
  acceptFriendRequest,
  listFriendships,
  removeFriendship,
  sendFriendRequest,
  type FriendRow,
} from "@/lib/friends";
import {
  acceptGroupInvite,
  createGroup,
  declineGroupInvite,
  deleteGroup,
  inviteFriendsToGroup,
  joinGroupByCode,
  leaveGroup,
  listGroupMembers,
  listIncomingGroupInvites,
  listMyGroups,
  regenerateJoinCode,
  removeGroupMember,
  renameGroup,
  type Group,
  type GroupMember,
  type IncomingGroupInvite,
} from "@/lib/groups";
import { toast } from "sonner";
import { InviteBlock } from "@/components/InviteBlock";
import { buildGroupJoinLink, groupInviteMessage } from "@/lib/invites";

export const Route = createFileRoute("/_authenticated/friends")({
  head: () => ({
    meta: [
      { title: "Friends — Lectio" },
      { name: "description", content: "Read alongside people you know." },
    ],
  }),
  component: FriendsPage,
});

// Query keys — exported shape so mutations can target them precisely.
const qk = {
  friends: (uid: string) => ["friends", uid] as const,
  groups: (uid: string) => ["groups", uid] as const,
  groupInvites: (uid: string) => ["group-invites", uid] as const,
  groupMembers: (gid: string) => ["group-members", gid] as const,
};

function FriendsPage() {
  const { userId } = useAppState();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"friends" | "groups">("friends");
  const [openAdd, setOpenAdd] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);
  const [openGroup, setOpenGroup] = useState<Group | null>(null);
  const [openFriend, setOpenFriend] = useState<FriendRow | null>(null);

  const friendsQ = useQuery({
    queryKey: userId ? qk.friends(userId) : ["friends", "anon"],
    queryFn: () => listFriendships(userId!),
    enabled: !!userId,
    staleTime: 60_000,
  });
  const groupsQ = useQuery({
    queryKey: userId ? qk.groups(userId) : ["groups", "anon"],
    queryFn: () => listMyGroups(userId!),
    enabled: !!userId,
    staleTime: 60_000,
  });
  const invitesQ = useQuery({
    queryKey: userId ? qk.groupInvites(userId) : ["group-invites", "anon"],
    queryFn: () => listIncomingGroupInvites(userId!),
    enabled: !!userId,
    staleTime: 30_000,
  });

  const rows = friendsQ.data ?? [];
  const groups = groupsQ.data ?? [];
  const groupInvites = invitesQ.data ?? [];
  // Only show skeleton when we have no cached data yet. Background refetches
  // never blank the screen.
  const loading =
    (friendsQ.isLoading && !friendsQ.data) ||
    (groupsQ.isLoading && !groupsQ.data) ||
    (invitesQ.isLoading && !invitesQ.data);

  const invalidateAll = () => {
    if (!userId) return;
    qc.invalidateQueries({ queryKey: qk.friends(userId) });
    qc.invalidateQueries({ queryKey: qk.groups(userId) });
    qc.invalidateQueries({ queryKey: qk.groupInvites(userId) });
  };

  // Keep the currently-open group in sync with refreshed list (e.g. after rename)
  useEffect(() => {
    if (!openGroup) return;
    const fresh = groups.find((g) => g.id === openGroup.id);
    if (fresh && (fresh.name !== openGroup.name || fresh.join_code !== openGroup.join_code)) {
      setOpenGroup(fresh);
    }
  }, [groups, openGroup]);

  // --- Optimistic mutations ---
  const acceptFriend = useMutation({
    mutationFn: (otherId: string) => acceptFriendRequest(userId!, otherId),
    onMutate: async (otherId) => {
      if (!userId) return;
      await qc.cancelQueries({ queryKey: qk.friends(userId) });
      const prev = qc.getQueryData<FriendRow[]>(qk.friends(userId));
      qc.setQueryData<FriendRow[]>(qk.friends(userId), (old) =>
        (old ?? []).map((r) =>
          r.other.id === otherId
            ? { ...r, friendship: { ...r.friendship, status: "accepted" }, isIncoming: false }
            : r,
        ),
      );
      return { prev };
    },
    onError: (e, _v, ctx) => {
      if (userId && ctx?.prev) qc.setQueryData(qk.friends(userId), ctx.prev);
      toast.error((e as Error).message);
    },
    onSettled: () => userId && qc.invalidateQueries({ queryKey: qk.friends(userId) }),
  });

  const removeFriend = useMutation({
    mutationFn: (otherId: string) => removeFriendship(userId!, otherId),
    onMutate: async (otherId) => {
      if (!userId) return;
      await qc.cancelQueries({ queryKey: qk.friends(userId) });
      const prev = qc.getQueryData<FriendRow[]>(qk.friends(userId));
      qc.setQueryData<FriendRow[]>(qk.friends(userId), (old) =>
        (old ?? []).filter((r) => r.other.id !== otherId),
      );
      return { prev };
    },
    onError: (e, _v, ctx) => {
      if (userId && ctx?.prev) qc.setQueryData(qk.friends(userId), ctx.prev);
      toast.error((e as Error).message);
    },
    onSettled: () => userId && qc.invalidateQueries({ queryKey: qk.friends(userId) }),
  });

  const acceptInvite = useMutation({
    mutationFn: (inviteId: string) => acceptGroupInvite(inviteId),
    onMutate: async (inviteId) => {
      if (!userId) return;
      await qc.cancelQueries({ queryKey: qk.groupInvites(userId) });
      const prev = qc.getQueryData<IncomingGroupInvite[]>(qk.groupInvites(userId));
      qc.setQueryData<IncomingGroupInvite[]>(qk.groupInvites(userId), (old) =>
        (old ?? []).filter((i) => i.id !== inviteId),
      );
      return { prev };
    },
    onError: (e, _v, ctx) => {
      if (userId && ctx?.prev) qc.setQueryData(qk.groupInvites(userId), ctx.prev);
      toast.error((e as Error).message);
    },
    onSettled: () => {
      if (!userId) return;
      qc.invalidateQueries({ queryKey: qk.groupInvites(userId) });
      qc.invalidateQueries({ queryKey: qk.groups(userId) });
    },
  });

  const declineInvite = useMutation({
    mutationFn: (inviteId: string) => declineGroupInvite(inviteId),
    onMutate: async (inviteId) => {
      if (!userId) return;
      await qc.cancelQueries({ queryKey: qk.groupInvites(userId) });
      const prev = qc.getQueryData<IncomingGroupInvite[]>(qk.groupInvites(userId));
      qc.setQueryData<IncomingGroupInvite[]>(qk.groupInvites(userId), (old) =>
        (old ?? []).filter((i) => i.id !== inviteId),
      );
      return { prev };
    },
    onError: (e, _v, ctx) => {
      if (userId && ctx?.prev) qc.setQueryData(qk.groupInvites(userId), ctx.prev);
      toast.error((e as Error).message);
    },
    onSettled: () => userId && qc.invalidateQueries({ queryKey: qk.groupInvites(userId) }),
  });

  const accepted = useMemo(
    () =>
      rows
        .filter((r) => r.friendship.status === "accepted")
        .sort((a, b) => b.other.current_streak - a.other.current_streak || a.other.name.localeCompare(b.other.name)),
    [rows],
  );
  const incoming = rows.filter((r) => r.isIncoming);
  const outgoing = rows.filter((r) => r.isOutgoing);

  const friendsTabBadge = incoming.length > 0 || groupInvites.length > 0;

  return (
    <PhoneFrame>
      <Screen>
        <div className="px-7 pt-14 pb-10">
          <div className="flex items-center justify-between">
            <SmallCaps>Friends</SmallCaps>
            <button
              onClick={() => setOpenAdd(true)}
              className="p-2 -mr-2 text-[color:var(--color-ink)] hover:text-[color:var(--color-gold)] transition-colors"
              aria-label="Add friend"
            >
              <Plus size={18} strokeWidth={1.5} />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-7 border-b" style={{ borderColor: "var(--color-rule)" }}>
            {(["friends", "groups"] as const).map((t) => {
              const showDot = t === "friends" && friendsTabBadge;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="pb-3 font-ui uppercase tracking-[0.16em] transition-colors relative"
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: tab === t ? "var(--color-ink)" : "var(--color-ink-muted)",
                    borderBottom: tab === t ? "1.5px solid var(--color-gold)" : "1.5px solid transparent",
                    marginBottom: -1,
                  }}
                >
                  {t}
                  {showDot && (
                    <span
                      aria-hidden
                      className="absolute -top-1 -right-2 rounded-full"
                      style={{ width: 6, height: 6, background: "var(--color-gold)" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {tab === "friends" && (
            <>
              {loading ? (
                <SkeletonList />
              ) : accepted.length === 0 && incoming.length === 0 && outgoing.length === 0 && groupInvites.length === 0 ? (
                <EmptyFriends onInvite={() => setOpenAdd(true)} />
              ) : (
                <div className="mt-8 space-y-8">
                  {incoming.length > 0 && (
                    <Section title={`Friend Invites · ${incoming.length}`}>
                      {incoming.map((r) => (
                        <PendingRow
                          key={r.other.id}
                          row={r}
                          onAccept={() => {
                            acceptFriend.mutate(r.other.id, {
                              onSuccess: () =>
                                toast.success(`You and ${r.other.name} are now friends.`),
                            });
                          }}
                          onDecline={() => removeFriend.mutate(r.other.id)}
                        />
                      ))}
                    </Section>
                  )}

                  {groupInvites.length > 0 && (
                    <Section title={`Group Invites · ${groupInvites.length}`}>
                      {groupInvites.map((inv) => (
                        <GroupInviteRow
                          key={inv.id}
                          invite={inv}
                          onAccept={() => {
                            acceptInvite.mutate(inv.id, {
                              onSuccess: async (gid) => {
                                toast.success(`Joined "${inv.group_name}".`);
                                // Refetch groups and open the new one.
                                if (!userId) return;
                                const fresh = await qc.fetchQuery({
                                  queryKey: qk.groups(userId),
                                  queryFn: () => listMyGroups(userId),
                                });
                                const g = fresh.find((x) => x.id === gid);
                                if (g) setOpenGroup(g);
                              },
                            });
                          }}
                          onDecline={() => declineInvite.mutate(inv.id)}
                        />
                      ))}
                    </Section>
                  )}

                  {accepted.length > 0 && (
                    <Section title="Friends">
                      {accepted.map((r) => (
                        <FriendRowItem
                          key={r.other.id}
                          row={r}
                          onOpen={() => setOpenFriend(r)}
                          onRemove={() => removeFriend.mutate(r.other.id)}
                        />
                      ))}
                    </Section>
                  )}

                  {outgoing.length > 0 && (
                    <Section title="Sent">
                      {outgoing.map((r) => (
                        <SentRow
                          key={r.other.id}
                          row={r}
                          onCancel={() => removeFriend.mutate(r.other.id)}
                        />
                      ))}
                    </Section>
                  )}
                </div>
              )}
            </>
          )}

          {tab === "groups" && (
            <>
              {loading ? (
                <SkeletonList />
              ) : groups.length === 0 ? (
                <div className="mt-16 text-center">
                  <SmallCaps tone="gold">No Groups Yet</SmallCaps>
                  <p
                    className="mt-5 font-display text-[color:var(--color-ink)]"
                    style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.3 }}
                  >
                    Start something small.
                  </p>
                  <p
                    className="mt-3 mx-auto font-body italic text-[color:var(--color-ink-soft)]"
                    style={{ fontSize: 14, maxWidth: 280, lineHeight: 1.5 }}
                  >
                    A group can be a small Bible study, a youth crew, or a few friends keeping each other going.
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <EditorialButton variant="secondary" size="sm" onClick={() => setOpenCreate(true)}>
                      Create Group
                    </EditorialButton>
                    <EditorialButton variant="secondary" size="sm" onClick={() => setOpenJoin(true)}>
                      Join Group
                    </EditorialButton>
                  </div>
                </div>
              ) : (
                <div className="mt-8">
                  <Section title="Your Groups">
                    {groups.map((g) => (
                      <GroupListRow key={g.id} group={g} onOpen={() => setOpenGroup(g)} />
                    ))}
                  </Section>
                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <EditorialButton variant="secondary" size="sm" onClick={() => setOpenCreate(true)}>
                      Create Group
                    </EditorialButton>
                    <EditorialButton variant="secondary" size="sm" onClick={() => setOpenJoin(true)}>
                      Join Group
                    </EditorialButton>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <BottomSheet open={openAdd} onClose={() => setOpenAdd(false)} eyebrow="Invite" title="Add a friend">
          <AddFriendForm
            onSent={() => {
              setOpenAdd(false);
              invalidateAll();
            }}
          />
        </BottomSheet>

        <BottomSheet open={openCreate} onClose={() => setOpenCreate(false)} eyebrow="New Group" title="Name your group">
          <CreateGroupForm
            onCreated={(g) => {
              setOpenCreate(false);
              invalidateAll();
              setOpenGroup(g);
            }}
          />
        </BottomSheet>

        <BottomSheet open={openJoin} onClose={() => setOpenJoin(false)} eyebrow="Join" title="Enter a group code">
          <JoinGroupForm
            onJoined={(g) => {
              setOpenJoin(false);
              invalidateAll();
              setOpenGroup(g);
            }}
          />
        </BottomSheet>

        <BottomSheet
          open={!!openGroup}
          onClose={() => setOpenGroup(null)}
          eyebrow="Group"
          title={openGroup?.name ?? ""}
        >
          {openGroup && (
            <GroupDetail
              group={openGroup}
              friends={accepted}
              onChanged={invalidateAll}
              onLeft={() => {
                setOpenGroup(null);
                invalidateAll();
              }}
            />
          )}
        </BottomSheet>


        <BottomSheet
          open={!!openFriend}
          onClose={() => setOpenFriend(null)}
          eyebrow="Friend"
          title={openFriend?.other.name ?? ""}
        >
          {openFriend && <FriendProfileSheet row={openFriend} />}
        </BottomSheet>
      </Screen>
    </PhoneFrame>
  );
}

function SkeletonList() {
  return (
    <div className="mt-8 space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-14 rounded-[12px]"
          style={{ background: "var(--color-paper-soft)", border: "1px solid var(--color-rule)", opacity: 0.6 }}
        />
      ))}
    </div>
  );
}

function EmptyFriends({ onInvite }: { onInvite: () => void }) {
  return (
    <div className="mt-16 text-center">
      <SmallCaps tone="gold">No Friends Yet</SmallCaps>
      <p
        className="mt-5 font-display text-[color:var(--color-ink)]"
        style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.3 }}
      >
        Read alongside someone.
      </p>
      <p
        className="mt-3 mx-auto font-body italic text-[color:var(--color-ink-soft)]"
        style={{ fontSize: 14, maxWidth: 280, lineHeight: 1.5 }}
      >
        Invite a friend by email or username. They have to accept before either of you sees the other.
      </p>
      <div className="mt-8">
        <EditorialButton variant="gold" onClick={onInvite}>
          Invite a Friend
        </EditorialButton>
      </div>
      <p className="mt-10 font-body italic text-[color:var(--color-ink-muted)]" style={{ fontSize: 13 }}>
        Quiz scores and reading content stay private. Always.
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <SmallCaps>{title}</SmallCaps>
      <div className="mt-3 divide-y" style={{ borderColor: "var(--color-rule)" }}>
        {children}
      </div>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initial = (name?.[0] || "?").toUpperCase();
  return (
    <div
      className="flex items-center justify-center rounded-full font-display"
      style={{
        width: 40,
        height: 40,
        background: "var(--color-paper-soft)",
        color: "var(--color-ink)",
        fontSize: 16,
        border: "1px solid var(--color-rule)",
      }}
    >
      {initial}
    </div>
  );
}

function FriendRowItem({
  row,
  onOpen,
  onRemove,
}: {
  row: FriendRow;
  onOpen: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderTop: "1px solid var(--color-rule)" }}>
      <button onClick={onOpen} className="flex items-center gap-3 flex-1 min-w-0 text-left">
        <Avatar name={row.other.name} />
        <div className="flex-1 min-w-0">
          <div className="font-display text-[color:var(--color-ink)] truncate" style={{ fontSize: 16 }}>
            {row.other.name}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[color:var(--color-ink-muted)]" style={{ fontSize: 12 }}>
            <Flame size={12} strokeWidth={1.5} />
            <span className="tabular">{row.other.current_streak} day streak</span>
          </div>
        </div>
      </button>
      <button
        onClick={onRemove}
        className="text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)] font-ui uppercase tracking-[0.14em]"
        style={{ fontSize: 11 }}
      >
        Remove
      </button>
    </div>
  );
}

function FriendProfileSheet({ row }: { row: FriendRow }) {
  const f = row.other;
  return (
    <div>
      <div className="flex items-center gap-4">
        <div
          className="flex items-center justify-center rounded-full font-display"
          style={{
            width: 56,
            height: 56,
            background: "var(--color-paper-soft)",
            color: "var(--color-ink)",
            fontSize: 22,
            border: "1px solid var(--color-rule)",
          }}
        >
          {(f.name?.[0] || "?").toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="font-display text-[color:var(--color-ink)] truncate" style={{ fontSize: 22 }}>
            {f.name}
          </div>
          {f.username && (
            <div className="font-ui text-[color:var(--color-ink-muted)] mt-0.5" style={{ fontSize: 12 }}>
              @{f.username}
            </div>
          )}
        </div>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3">
        <Stat label="Streak" value={`${f.current_streak}d`} />
        <Stat label="XP" value={f.xp.toLocaleString()} />
      </div>

      <p className="mt-7 font-body italic text-[color:var(--color-ink-muted)]" style={{ fontSize: 13, lineHeight: 1.5 }}>
        Reading content and quiz scores stay private. You only see streak and XP.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-[12px] px-4 py-4"
      style={{ background: "var(--color-paper-soft)", border: "1px solid var(--color-rule)" }}
    >
      <div className="font-ui uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)]" style={{ fontSize: 10 }}>
        {label}
      </div>
      <div className="font-display tabular text-[color:var(--color-ink)] mt-1" style={{ fontSize: 22 }}>
        {value}
      </div>
    </div>
  );
}

function PendingRow({
  row,
  onAccept,
  onDecline,
}: {
  row: FriendRow;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderTop: "1px solid var(--color-rule)" }}>
      <Avatar name={row.other.name} />
      <div className="flex-1 min-w-0">
        <div className="font-display text-[color:var(--color-ink)] truncate" style={{ fontSize: 16 }}>
          {row.other.name}
        </div>
        <div className="text-[color:var(--color-ink-muted)] mt-0.5 truncate" style={{ fontSize: 12 }}>
          wants to read alongside you
        </div>
      </div>
      <button onClick={onDecline} aria-label="Decline" className="p-2 text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]">
        <X size={16} strokeWidth={1.5} />
      </button>
      <button
        onClick={onAccept}
        aria-label="Accept"
        className="p-2 rounded-full"
        style={{ background: "var(--color-gold)", color: "var(--color-paper)" }}
      >
        <Check size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

function GroupInviteRow({
  invite,
  onAccept,
  onDecline,
}: {
  invite: IncomingGroupInvite;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderTop: "1px solid var(--color-rule)" }}>
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 40,
          height: 40,
          background: "var(--color-paper-soft)",
          color: "var(--color-ink)",
          border: "1px solid var(--color-rule)",
        }}
      >
        <Users size={16} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display text-[color:var(--color-ink)] truncate" style={{ fontSize: 16 }}>
          {invite.group_name}
        </div>
        <div className="text-[color:var(--color-ink-muted)] mt-0.5 truncate" style={{ fontSize: 12 }}>
          {invite.invited_by_name} invited you
        </div>
      </div>
      <button onClick={onDecline} aria-label="Decline" className="p-2 text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]">
        <X size={16} strokeWidth={1.5} />
      </button>
      <button
        onClick={onAccept}
        aria-label="Accept"
        className="p-2 rounded-full"
        style={{ background: "var(--color-gold)", color: "var(--color-paper)" }}
      >
        <Check size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

function SentRow({ row, onCancel }: { row: FriendRow; onCancel: () => void }) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderTop: "1px solid var(--color-rule)" }}>
      <Avatar name={row.other.name} />
      <div className="flex-1 min-w-0">
        <div className="font-display text-[color:var(--color-ink)] truncate" style={{ fontSize: 16 }}>
          {row.other.name}
        </div>
        <div className="text-[color:var(--color-ink-muted)] mt-0.5" style={{ fontSize: 12 }}>
          waiting for them to accept
        </div>
      </div>
      <button
        onClick={onCancel}
        className="text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)] font-ui uppercase tracking-[0.14em]"
        style={{ fontSize: 11 }}
      >
        Cancel
      </button>
    </div>
  );
}

function AddFriendForm({ onSent }: { onSent: () => void }) {
  const { userId } = useAppState();
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [handoff, setHandoff] = useState<{ query: string; isEmail: boolean } | null>(null);

  const submit = async () => {
    if (!userId) return;
    setBusy(true);
    try {
      const result = await sendFriendRequest(userId, value);
      if (result.ok) {
        toast.success(`Invite sent to ${result.friend.name}.`);
        onSent();
      } else if (result.reason.toLowerCase().includes("no one")) {
        setHandoff({ query: value.trim(), isEmail: value.includes("@") });
      } else {
        toast.error(result.reason);
      }
    } finally {
      setBusy(false);
    }
  };

  if (handoff) {
    return (
      <div>
        <p
          className="font-body text-[color:var(--color-ink)]"
          style={{ fontSize: 15, lineHeight: 1.55 }}
        >
          We couldn't find anyone with that {handoff.isEmail ? "email" : "username"}.
        </p>
        <p
          className="mt-2 font-body italic text-[color:var(--color-ink-muted)]"
          style={{ fontSize: 14, lineHeight: 1.55 }}
        >
          Want to invite {handoff.isEmail ? "them" : `@${handoff.query}`} to Lectio instead?
        </p>

        <div className="mt-7">
          <InviteBlock
            prefilledEmail={handoff.isEmail ? handoff.query : undefined}
            eyebrow={`Invite ${handoff.isEmail ? handoff.query : "Them"}`}
          />
        </div>

        <button
          onClick={() => {
            setHandoff(null);
            setValue("");
          }}
          className="mt-6 font-ui uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]"
          style={{ fontSize: 11 }}
        >
          ← Search again
        </button>
      </div>
    );
  }

  return (
    <div>
      <SmallCaps>Email or Username</SmallCaps>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="friend@example.com"
        autoComplete="off"
        className="mt-2 w-full bg-transparent border-b py-3 font-body text-[color:var(--color-ink)] focus:outline-none"
        style={{ fontSize: 17, borderColor: "var(--color-rule)" }}
      />
      <p className="mt-3 font-body italic text-[color:var(--color-ink-muted)]" style={{ fontSize: 13 }}>
        We'll send a quiet invitation. They have to accept.
      </p>
      <div className="mt-7">
        <EditorialButton variant="gold" disabled={value.trim().length < 3 || busy} onClick={submit}>
          {busy ? "Searching…" : "Send Invite"}
        </EditorialButton>
      </div>

      <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--color-rule)" }}>
        <InviteBlock eyebrow="Not on Lectio yet?" />
      </div>
    </div>
  );
}

function GroupListRow({ group, onOpen }: { group: Group; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="w-full flex items-center gap-3 py-3 text-left"
      style={{ borderTop: "1px solid var(--color-rule)" }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 40,
          height: 40,
          background: "var(--color-paper-soft)",
          color: "var(--color-ink)",
          border: "1px solid var(--color-rule)",
        }}
      >
        <Users size={16} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display text-[color:var(--color-ink)] truncate" style={{ fontSize: 16 }}>
          {group.name}
        </div>
        <div className="text-[color:var(--color-ink-muted)] mt-0.5 font-ui uppercase tracking-[0.14em] tabular" style={{ fontSize: 11 }}>
          Code · {group.join_code}
        </div>
      </div>
      <ChevronRight size={16} strokeWidth={1.5} className="text-[color:var(--color-ink-muted)]" />
    </button>
  );
}

function CreateGroupForm({ onCreated }: { onCreated: (g: Group) => void }) {
  const { userId } = useAppState();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (!userId) return;
    setBusy(true);
    const r = await createGroup(userId, name);
    setBusy(false);
    if (r.ok) {
      toast.success(`"${r.group.name}" created. Share code ${r.group.join_code}.`);
      onCreated(r.group);
    } else {
      toast.error(r.reason);
    }
  };
  return (
    <div>
      <SmallCaps>Group Name</SmallCaps>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Sunday Morning Crew"
        className="mt-2 w-full bg-transparent border-b py-3 font-body text-[color:var(--color-ink)] focus:outline-none"
        style={{ fontSize: 17, borderColor: "var(--color-rule)" }}
      />
      <p className="mt-3 font-body italic text-[color:var(--color-ink-muted)]" style={{ fontSize: 13 }}>
        You'll get a six-character code to share with members.
      </p>
      <div className="mt-7">
        <EditorialButton variant="gold" disabled={name.trim().length < 2 || busy} onClick={submit}>
          {busy ? "Creating…" : "Create"}
        </EditorialButton>
      </div>
    </div>
  );
}

function JoinGroupForm({ onJoined }: { onJoined: (g: Group) => void }) {
  const { userId } = useAppState();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (!userId) return;
    setBusy(true);
    const r = await joinGroupByCode(userId, code);
    setBusy(false);
    if (r.ok) {
      toast.success(`Joined "${r.group.name}".`);
      onJoined(r.group);
    } else {
      toast.error(r.reason);
    }
  };
  return (
    <div>
      <SmallCaps>Group Code</SmallCaps>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="ABC123"
        autoCapitalize="characters"
        autoCorrect="off"
        className="mt-2 w-full bg-transparent border-b py-3 font-display tabular text-[color:var(--color-ink)] focus:outline-none"
        style={{ fontSize: 24, borderColor: "var(--color-rule)", letterSpacing: "0.1em" }}
      />
      <p className="mt-3 font-body italic text-[color:var(--color-ink-muted)]" style={{ fontSize: 13 }}>
        Ask the group's owner for the six-character code.
      </p>
      <div className="mt-7">
        <EditorialButton variant="gold" disabled={code.trim().length < 4 || busy} onClick={submit}>
          {busy ? "Joining…" : "Join"}
        </EditorialButton>
      </div>
    </div>
  );
}

function relativeDay(iso: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.round((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return "Read today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
    return `${Math.floor(diff / 30)}mo ago`;
  } catch {
    return "—";
  }
}

function GroupDetail({
  group,
  friends,
  onLeft,
  onChanged,
}: {
  group: Group;
  friends: FriendRow[];
  onLeft: () => void;
  onChanged: () => void;
}) {
  const { userId, user } = useAppState();
  const qc = useQueryClient();
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(group.name);
  const [openInvite, setOpenInvite] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const isOwner = userId === group.owner_id;

  const membersQ = useQuery({
    queryKey: qk.groupMembers(group.id),
    queryFn: () => listGroupMembers(group.id),
    staleTime: 30_000,
  });
  const members = membersQ.data ?? null;

  useEffect(() => {
    setDraftName(group.name);
  }, [group.name]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(group.join_code);
      toast.success("Code copied.");
    } catch {
      toast.error("Couldn't copy.");
    }
  };

  const handleLeave = async () => {
    if (!userId) return;
    if (isOwner) {
      if (!confirm("Delete this group for everyone?")) return;
      try {
        await deleteGroup(group.id);
      } catch (e) {
        toast.error((e as Error).message);
        return;
      }
    } else {
      if (!confirm("Leave this group?")) return;
      try {
        await leaveGroup(userId, group.id);
      } catch (e) {
        toast.error((e as Error).message);
        return;
      }
    }
    onLeft();
  };

  const handleRename = async () => {
    if (draftName.trim() === group.name) {
      setEditingName(false);
      return;
    }
    try {
      await renameGroup(group.id, draftName);
      toast.success("Group renamed.");
      setEditingName(false);
      onChanged();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const handleRegenerate = async () => {
    if (!confirm("Generate a new join code? The old code will stop working.")) return;
    try {
      await regenerateJoinCode(group.id);
      toast.success("New code generated.");
      onChanged();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const removeMember = useMutation({
    mutationFn: (memberId: string) => removeGroupMember(group.id, memberId),
    onMutate: async (memberId) => {
      await qc.cancelQueries({ queryKey: qk.groupMembers(group.id) });
      const prev = qc.getQueryData<GroupMember[]>(qk.groupMembers(group.id));
      qc.setQueryData<GroupMember[]>(qk.groupMembers(group.id), (old) =>
        (old ?? []).filter((m) => m.id !== memberId),
      );
      return { prev };
    },
    onError: (e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.groupMembers(group.id), ctx.prev);
      toast.error((e as Error).message);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: qk.groupMembers(group.id) }),
  });

  const handleRemoveMember = (m: GroupMember) => {
    if (!confirm(`Remove ${m.name} from this group?`)) return;
    removeMember.mutate(m.id, {
      onSuccess: () => toast.success(`${m.name} removed.`),
    });
  };


  const shareLink = userId
    ? buildGroupJoinLink({ joinCode: group.join_code, username: user.username, userId })
    : "";

  return (
    <div>
      {isOwner && editingName ? (
        <div className="flex items-center gap-2 mb-4">
          <input
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-b py-2 font-display text-[color:var(--color-ink)] focus:outline-none"
            style={{ fontSize: 20, borderColor: "var(--color-rule)" }}
          />
          <button
            onClick={handleRename}
            className="font-ui uppercase tracking-[0.14em] text-[color:var(--color-gold)]"
            style={{ fontSize: 11 }}
          >
            Save
          </button>
          <button
            onClick={() => {
              setDraftName(group.name);
              setEditingName(false);
            }}
            className="font-ui uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)]"
            style={{ fontSize: 11 }}
          >
            Cancel
          </button>
        </div>
      ) : (
        isOwner && (
          <button
            onClick={() => setEditingName(true)}
            className="flex items-center gap-2 mb-4 text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)] font-ui uppercase tracking-[0.14em]"
            style={{ fontSize: 11 }}
          >
            <Pencil size={12} strokeWidth={1.5} />
            Rename
          </button>
        )
      )}

      <div
        className="flex items-center justify-between rounded-[12px] px-4 py-3"
        style={{ background: "var(--color-paper-soft)", border: "1px solid var(--color-rule)" }}
      >
        <div className="min-w-0">
          <div className="font-ui uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)]" style={{ fontSize: 10 }}>
            Join Code
          </div>
          <div className="font-display tabular text-[color:var(--color-ink)] mt-1" style={{ fontSize: 22, letterSpacing: "0.1em" }}>
            {group.join_code}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isOwner && (
            <button
              onClick={handleRegenerate}
              aria-label="Regenerate code"
              className="flex items-center gap-1.5 font-ui uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]"
              style={{ fontSize: 11 }}
            >
              <RefreshCw size={13} strokeWidth={1.5} />
              New
            </button>
          )}
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 font-ui uppercase tracking-[0.14em] text-[color:var(--color-ink)]"
            style={{ fontSize: 11 }}
          >
            <Copy size={14} strokeWidth={1.5} />
            Copy
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <EditorialButton variant="secondary" size="sm" onClick={() => setOpenInvite(true)}>
          Invite Friends
        </EditorialButton>
        <EditorialButton variant="secondary" size="sm" onClick={() => setOpenShare(true)}>
          Share Link
        </EditorialButton>
      </div>

      <div className="mt-6">
        <SmallCaps>Leaderboard</SmallCaps>
        {members === null ? (
          <p className="mt-3 font-body italic text-[color:var(--color-ink-muted)]" style={{ fontSize: 13 }}>
            Loading members…
          </p>
        ) : members.length === 0 ? (
          <p className="mt-3 font-body italic text-[color:var(--color-ink-muted)]" style={{ fontSize: 13 }}>
            No members yet.
          </p>
        ) : (
          <div className="mt-3">
            {members.map((m, i) => (
              <div
                key={m.id}
                className="flex items-center gap-3 py-3"
                style={{ borderTop: "1px solid var(--color-rule)" }}
              >
                <div
                  className="font-display tabular text-[color:var(--color-ink-muted)] w-5 text-right"
                  style={{ fontSize: 14 }}
                >
                  {i + 1}
                </div>
                <Avatar name={m.name} />
                <div className="flex-1 min-w-0">
                  <div className="font-display text-[color:var(--color-ink)] truncate" style={{ fontSize: 15 }}>
                    {m.name}{" "}
                    {m.id === group.owner_id && (
                      <span className="font-ui uppercase tracking-[0.14em] text-[color:var(--color-gold)] ml-1" style={{ fontSize: 10 }}>
                        Owner
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[color:var(--color-ink-muted)]" style={{ fontSize: 12 }}>
                    <Flame size={12} strokeWidth={1.5} />
                    <span className="tabular">{m.current_streak}d</span>
                    <span>·</span>
                    <span>{relativeDay(m.last_read_date)}</span>
                  </div>
                </div>
                <div
                  className="font-display tabular text-[color:var(--color-ink)]"
                  style={{ fontSize: 14 }}
                >
                  {m.xp.toLocaleString()} XP
                </div>
                {isOwner && m.id !== group.owner_id && (
                  <button
                    onClick={() => handleRemoveMember(m)}
                    aria-label={`Remove ${m.name}`}
                    className="ml-1 p-1.5 text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-7">
        <EditorialButton variant="secondary" onClick={handleLeave}>
          {isOwner ? "Delete Group" : "Leave Group"}
        </EditorialButton>
      </div>

      <BottomSheet
        open={openInvite}
        onClose={() => setOpenInvite(false)}
        eyebrow="Invite"
        title={`Add to ${group.name}`}
      >
        <InviteFriendsPicker
          group={group}
          friends={friends}
          members={members ?? []}
          onDone={() => {
            setOpenInvite(false);
            onChanged();
          }}
        />
      </BottomSheet>

      <BottomSheet
        open={openShare}
        onClose={() => setOpenShare(false)}
        eyebrow="Share"
        title="Invite by link"
      >
        <p className="font-body text-[color:var(--color-ink)]" style={{ fontSize: 14, lineHeight: 1.55 }}>
          Anyone with this link can join {group.name}. They'll be guided through signup if they're new.
        </p>
        <div className="mt-6">
          <InviteBlock
            eyebrow={`Share "${group.name}"`}
            customUrl={shareLink}
            customMessage={groupInviteMessage(user.name, group.name, shareLink)}
            customSubject={`Join my Lectio group: ${group.name}`}
            hideClicks
          />
        </div>
      </BottomSheet>
    </div>
  );
}

function InviteFriendsPicker({
  group,
  friends,
  members,
  onDone,
}: {
  group: Group;
  friends: FriendRow[];
  members: GroupMember[];
  onDone: () => void;
}) {
  const { userId } = useAppState();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const memberIds = useMemo(() => new Set(members.map((m) => m.id)), [members]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const submit = async () => {
    if (!userId || selected.size === 0) return;
    setBusy(true);
    try {
      const res = await inviteFriendsToGroup(group.id, userId, Array.from(selected));
      if (res.invited > 0) {
        toast.success(
          `Invited ${res.invited} ${res.invited === 1 ? "friend" : "friends"}.${res.skipped ? ` ${res.skipped} skipped.` : ""}`,
        );
      } else {
        toast.message("Already invited or already in the group.");
      }
      onDone();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (friends.length === 0) {
    return (
      <div>
        <p className="font-body italic text-[color:var(--color-ink-muted)]" style={{ fontSize: 14, lineHeight: 1.55 }}>
          You don't have any friends on Lectio yet. Use the share link to invite people directly.
        </p>
      </div>
    );
  }

  return (
    <div>
      <SmallCaps>Your Friends</SmallCaps>
      <div className="mt-3 max-h-80 overflow-y-auto">
        {friends.map((r) => {
          const inGroup = memberIds.has(r.other.id);
          const isSelected = selected.has(r.other.id);
          return (
            <button
              key={r.other.id}
              onClick={() => !inGroup && toggle(r.other.id)}
              disabled={inGroup}
              className="w-full flex items-center gap-3 py-3 text-left"
              style={{ borderTop: "1px solid var(--color-rule)", opacity: inGroup ? 0.5 : 1 }}
            >
              <Avatar name={r.other.name} />
              <div className="flex-1 min-w-0">
                <div className="font-display text-[color:var(--color-ink)] truncate" style={{ fontSize: 15 }}>
                  {r.other.name}
                </div>
                {r.other.username && (
                  <div className="text-[color:var(--color-ink-muted)] mt-0.5 truncate" style={{ fontSize: 12 }}>
                    @{r.other.username}
                  </div>
                )}
              </div>
              {inGroup ? (
                <span className="font-ui uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)]" style={{ fontSize: 10 }}>
                  In group
                </span>
              ) : (
                <div
                  className="flex items-center justify-center rounded"
                  style={{
                    width: 22,
                    height: 22,
                    background: isSelected ? "var(--color-gold)" : "transparent",
                    border: `1px solid ${isSelected ? "var(--color-gold)" : "var(--color-rule)"}`,
                    color: "var(--color-paper)",
                  }}
                >
                  {isSelected && <Check size={14} strokeWidth={2.5} />}
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-6">
        <EditorialButton variant="gold" disabled={selected.size === 0 || busy} onClick={submit}>
          {busy ? "Sending…" : `Invite ${selected.size || ""}`.trim()}
        </EditorialButton>
      </div>
    </div>
  );
}
