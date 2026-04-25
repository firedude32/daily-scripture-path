import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Plus, Check, X, Flame, Users, Copy, ChevronRight } from "lucide-react";
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
  createGroup,
  deleteGroup,
  joinGroupByCode,
  leaveGroup,
  listGroupMembers,
  listMyGroups,
  type Group,
  type GroupMember,
} from "@/lib/groups";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/friends")({
  head: () => ({
    meta: [
      { title: "Friends — Lectio" },
      { name: "description", content: "Read alongside people you know." },
    ],
  }),
  component: FriendsPage,
});

function FriendsPage() {
  const { userId } = useAppState();
  const [tab, setTab] = useState<"friends" | "groups">("friends");
  const [openAdd, setOpenAdd] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);
  const [rows, setRows] = useState<FriendRow[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [openGroup, setOpenGroup] = useState<Group | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [r, g] = await Promise.all([listFriendships(userId), listMyGroups(userId)]);
      setRows(r);
      setGroups(g);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const accepted = rows.filter((r) => r.friendship.status === "accepted");
  const incoming = rows.filter((r) => r.isIncoming);
  const outgoing = rows.filter((r) => r.isOutgoing);

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
            {(["friends", "groups"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="pb-3 font-ui uppercase tracking-[0.16em] transition-colors"
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: tab === t ? "var(--color-ink)" : "var(--color-ink-muted)",
                  borderBottom: tab === t ? "1.5px solid var(--color-gold)" : "1.5px solid transparent",
                  marginBottom: -1,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "friends" && (
            <>
              {loading ? (
                <p className="mt-16 text-center font-body italic text-[color:var(--color-ink-muted)]" style={{ fontSize: 14 }}>
                  Loading…
                </p>
              ) : accepted.length === 0 && incoming.length === 0 && outgoing.length === 0 ? (
                <EmptyFriends onInvite={() => setOpenAdd(true)} />
              ) : (
                <div className="mt-8 space-y-8">
                  {incoming.length > 0 && (
                    <Section title="Pending Invites">
                      {incoming.map((r) => (
                        <PendingRow
                          key={r.other.id}
                          row={r}
                          onAccept={async () => {
                            await acceptFriendRequest(userId!, r.other.id);
                            toast.success(`You and ${r.other.name} are now friends.`);
                            void refresh();
                          }}
                          onDecline={async () => {
                            await removeFriendship(userId!, r.other.id);
                            void refresh();
                          }}
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
                          onRemove={async () => {
                            await removeFriendship(userId!, r.other.id);
                            void refresh();
                          }}
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
                          onCancel={async () => {
                            await removeFriendship(userId!, r.other.id);
                            void refresh();
                          }}
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
                <p className="mt-16 text-center font-body italic text-[color:var(--color-ink-muted)]" style={{ fontSize: 14 }}>
                  Loading…
                </p>
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
              void refresh();
            }}
          />
        </BottomSheet>

        <BottomSheet open={openCreate} onClose={() => setOpenCreate(false)} eyebrow="New Group" title="Name your group">
          <CreateGroupForm
            onCreated={(g) => {
              setOpenCreate(false);
              void refresh();
              setOpenGroup(g);
            }}
          />
        </BottomSheet>

        <BottomSheet open={openJoin} onClose={() => setOpenJoin(false)} eyebrow="Join" title="Enter a group code">
          <JoinGroupForm
            onJoined={(g) => {
              setOpenJoin(false);
              void refresh();
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
              onLeft={() => {
                setOpenGroup(null);
                void refresh();
              }}
            />
          )}
        </BottomSheet>
      </Screen>
    </PhoneFrame>
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

  const submit = async () => {
    if (!userId) return;
    setBusy(true);
    try {
      const result = await sendFriendRequest(userId, value);
      if (result.ok) {
        toast.success(`Invite sent to ${result.friend.name}.`);
        onSent();
      } else {
        toast.error(result.reason);
      }
    } finally {
      setBusy(false);
    }
  };

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
          {busy ? "Sending…" : "Send Invite"}
        </EditorialButton>
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

function GroupDetail({ group, onLeft }: { group: Group; onLeft: () => void }) {
  const { userId } = useAppState();
  const [members, setMembers] = useState<GroupMember[] | null>(null);
  const isOwner = userId === group.owner_id;

  useEffect(() => {
    let alive = true;
    void listGroupMembers(group.id).then((m) => {
      if (alive) setMembers(m);
    });
    return () => {
      alive = false;
    };
  }, [group.id]);

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
      await deleteGroup(group.id);
    } else {
      if (!confirm("Leave this group?")) return;
      await leaveGroup(userId, group.id);
    }
    onLeft();
  };

  return (
    <div>
      <div
        className="flex items-center justify-between rounded-[12px] px-4 py-3"
        style={{ background: "var(--color-paper-soft)", border: "1px solid var(--color-rule)" }}
      >
        <div>
          <div className="font-ui uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)]" style={{ fontSize: 10 }}>
            Join Code
          </div>
          <div className="font-display tabular text-[color:var(--color-ink)] mt-1" style={{ fontSize: 22, letterSpacing: "0.1em" }}>
            {group.join_code}
          </div>
        </div>
        <button
          onClick={copyCode}
          className="flex items-center gap-2 font-ui uppercase tracking-[0.14em] text-[color:var(--color-ink)]"
          style={{ fontSize: 11 }}
        >
          <Copy size={14} strokeWidth={1.5} />
          Copy
        </button>
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
                    {m.name} {m.id === group.owner_id && (
                      <span className="font-ui uppercase tracking-[0.14em] text-[color:var(--color-gold)] ml-1" style={{ fontSize: 10 }}>
                        Owner
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[color:var(--color-ink-muted)]" style={{ fontSize: 12 }}>
                    <Flame size={12} strokeWidth={1.5} />
                    <span className="tabular">{m.current_streak}d</span>
                  </div>
                </div>
                <div
                  className="font-display tabular text-[color:var(--color-ink)]"
                  style={{ fontSize: 14 }}
                >
                  {m.xp.toLocaleString()} XP
                </div>
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
    </div>
  );
}
