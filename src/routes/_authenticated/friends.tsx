import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Plus, Check, X, Flame } from "lucide-react";
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
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const r = await listFriendships(userId);
      setRows(r);
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
          <ComingSoon kind="create" onClose={() => setOpenCreate(false)} />
        </BottomSheet>

        <BottomSheet open={openJoin} onClose={() => setOpenJoin(false)} eyebrow="Join" title="Enter a group code">
          <ComingSoon kind="join" onClose={() => setOpenJoin(false)} />
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

function FriendRowItem({ row, onRemove }: { row: FriendRow; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderTop: "1px solid var(--color-rule)" }}>
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

function ComingSoon({ kind, onClose }: { kind: "create" | "join"; onClose: () => void }) {
  return (
    <div>
      <p className="font-body text-[color:var(--color-ink-soft)]" style={{ fontSize: 15, lineHeight: 1.55 }}>
        {kind === "create"
          ? "Groups are coming next. You'll be able to start one and invite friends with a code."
          : "Joining groups is coming next. Ask whoever's setting things up to wait for the next update."}
      </p>
      <div className="mt-7">
        <EditorialButton variant="secondary" onClick={onClose}>
          Got it
        </EditorialButton>
      </div>
    </div>
  );
}
