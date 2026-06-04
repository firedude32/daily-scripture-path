import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, X, Users, ChevronLeft } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { useAppState } from "@/state/store";
import {
  acceptFriendRequest,
  listFriendships,
  removeFriendship,
  type FriendRow,
} from "@/lib/friends";
import {
  acceptGroupInvite,
  declineGroupInvite,
  listIncomingGroupInvites,
  listMyGroups,
  type IncomingGroupInvite,
} from "@/lib/groups";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/friends/requests")({
  head: () => ({
    meta: [
      { title: "Friend Requests — Lectio" },
      { name: "description", content: "Pending friend and group invitations." },
    ],
  }),
  component: FriendRequestsPage,
});

const qk = {
  friends: (uid: string) => ["friends", uid] as const,
  groups: (uid: string) => ["groups", uid] as const,
  groupInvites: (uid: string) => ["group-invites", uid] as const,
};

function FriendRequestsPage() {
  const { userId } = useAppState();
  const qc = useQueryClient();

  const friendsQ = useQuery({
    queryKey: userId ? qk.friends(userId) : ["friends", "anon"],
    queryFn: () => listFriendships(userId!),
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
  const incoming = rows.filter((r) => r.isIncoming);
  const outgoing = rows.filter((r) => r.isOutgoing);
  const groupInvites = invitesQ.data ?? [];
  const loading =
    (friendsQ.isLoading && !friendsQ.data) ||
    (invitesQ.isLoading && !invitesQ.data);

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
    onSuccess: async () => {
      if (!userId) return;
      await qc.invalidateQueries({ queryKey: qk.groups(userId) });
      qc.prefetchQuery({ queryKey: qk.groups(userId), queryFn: () => listMyGroups(userId) });
    },
    onSettled: () => userId && qc.invalidateQueries({ queryKey: qk.groupInvites(userId) }),
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

  const isEmpty =
    !loading && incoming.length === 0 && outgoing.length === 0 && groupInvites.length === 0;

  return (
    <PhoneFrame>
      <Screen>
        <div className="px-7 pt-14 pb-10">
          <Link
            to="/friends"
            className="inline-flex items-center gap-1.5 -ml-1 text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)] font-ui uppercase tracking-[0.16em]"
            style={{ fontSize: 11 }}
          >
            <ChevronLeft size={14} strokeWidth={1.5} />
            Friends
          </Link>

          <h1
            className="mt-4 font-display text-[color:var(--color-ink)]"
            style={{ fontSize: 28, fontWeight: 400, lineHeight: 1.2 }}
          >
            Friend Requests
          </h1>
          <p
            className="mt-2 font-body italic text-[color:var(--color-ink-soft)]"
            style={{ fontSize: 13 }}
          >
            Pending invitations from friends and groups.
          </p>

          {loading ? (
            <Skel />
          ) : isEmpty ? (
            <Empty />
          ) : (
            <div className="mt-8 space-y-8">
              {incoming.length > 0 && (
                <Section title={`Incoming · ${incoming.length}`}>
                  {incoming.map((r) => (
                    <PendingRow
                      key={r.other.id}
                      name={r.other.name}
                      subtitle="wants to read alongside you"
                      onAccept={() =>
                        acceptFriend.mutate(r.other.id, {
                          onSuccess: () =>
                            toast.success(`You and ${r.other.name} are now friends.`),
                        })
                      }
                      onDecline={() => removeFriend.mutate(r.other.id)}
                    />
                  ))}
                </Section>
              )}

              {groupInvites.length > 0 && (
                <Section title={`Group Invites · ${groupInvites.length}`}>
                  {groupInvites.map((inv) => (
                    <PendingRow
                      key={inv.id}
                      icon={<Users size={16} strokeWidth={1.5} />}
                      name={inv.group_name}
                      subtitle={`${inv.invited_by_name} invited you`}
                      onAccept={() =>
                        acceptInvite.mutate(inv.id, {
                          onSuccess: () => toast.success(`Joined "${inv.group_name}".`),
                        })
                      }
                      onDecline={() => declineInvite.mutate(inv.id)}
                    />
                  ))}
                </Section>
              )}

              {outgoing.length > 0 && (
                <Section title={`Sent · ${outgoing.length}`}>
                  {outgoing.map((r) => (
                    <SentRow
                      key={r.other.id}
                      name={r.other.name}
                      onCancel={() => removeFriend.mutate(r.other.id)}
                    />
                  ))}
                </Section>
              )}
            </div>
          )}
        </div>
      </Screen>
    </PhoneFrame>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <SmallCaps>{title}</SmallCaps>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Avatar({ name, icon }: { name?: string; icon?: React.ReactNode }) {
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
      {icon ?? initial}
    </div>
  );
}

function PendingRow({
  name,
  subtitle,
  icon,
  onAccept,
  onDecline,
}: {
  name: string;
  subtitle: string;
  icon?: React.ReactNode;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={{ borderTop: "1px solid var(--color-rule)" }}
    >
      <Avatar name={name} icon={icon} />
      <div className="flex-1 min-w-0">
        <div
          className="font-display text-[color:var(--color-ink)] truncate"
          style={{ fontSize: 16 }}
        >
          {name}
        </div>
        <div
          className="text-[color:var(--color-ink-muted)] mt-0.5 truncate"
          style={{ fontSize: 12 }}
        >
          {subtitle}
        </div>
      </div>
      <button
        onClick={onDecline}
        aria-label="Decline"
        className="p-2 text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]"
      >
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

function SentRow({ name, onCancel }: { name: string; onCancel: () => void }) {
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={{ borderTop: "1px solid var(--color-rule)" }}
    >
      <Avatar name={name} />
      <div className="flex-1 min-w-0">
        <div
          className="font-display text-[color:var(--color-ink)] truncate"
          style={{ fontSize: 16 }}
        >
          {name}
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

function Skel() {
  return (
    <div className="mt-8 space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-14 rounded-[12px]"
          style={{
            background: "var(--color-paper-soft)",
            border: "1px solid var(--color-rule)",
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}

function Empty() {
  const navigate = useNavigate();
  return (
    <div className="mt-16 text-center">
      <SmallCaps tone="gold">All Clear</SmallCaps>
      <p
        className="mt-5 font-display text-[color:var(--color-ink)]"
        style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.3 }}
      >
        No pending requests.
      </p>
      <p
        className="mt-3 mx-auto font-body italic text-[color:var(--color-ink-soft)]"
        style={{ fontSize: 14, maxWidth: 280, lineHeight: 1.5 }}
      >
        When someone invites you to be a friend or join a group, it'll show up here.
      </p>
      <div className="mt-8">
        <EditorialButton
          variant="secondary"
          size="sm"
          fullWidth={false}
          onClick={() => navigate({ to: "/friends" })}
        >
          Back to Friends
        </EditorialButton>
      </div>
    </div>
  );
}
