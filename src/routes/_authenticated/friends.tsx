import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { FRIENDS, GROUPS, type Friend } from "@/data/friends";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { Rule } from "@/components/ui-lectio/Rule";
import { BottomSheet } from "@/components/ui-lectio/BottomSheet";

export const Route = createFileRoute("/_authenticated/friends")({
  head: () => ({
    meta: [
      { title: "Friends — Lectio" },
      { name: "description", content: "Read alongside people you know." },
    ],
  }),
  component: FriendsPage,
});

interface InvitedFriend {
  id: string;
  name: string;
  initials: string;
  status: "pending";
}

function FriendsPage() {
  const [tab, setTab] = useState<"friends" | "groups">("friends");
  const [openProfile, setOpenProfile] = useState<Friend | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);

  // Locally tracked invites/groups for the prototype (not persisted).
  const [invited, setInvited] = useState<InvitedFriend[]>([]);
  const [extraGroups, setExtraGroups] = useState<string[]>([]);

  function inviteByEmail(email: string) {
    const e = email.trim();
    if (!e) return;
    const name = e.split("@")[0].replace(/\./g, " ");
    const initials = name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");
    setInvited((prev) => [...prev, { id: `inv-${Date.now()}`, name, initials: initials || "?", status: "pending" }]);
    setOpenAdd(false);
  }

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

          {/* Tab switcher — small caps */}
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
            <div className="mt-2">
              {FRIENDS.map((f, i) => (
                <div key={f.id}>
                  {i > 0 && <Rule />}
                  <button
                    onClick={() => setOpenProfile(f)}
                    className="w-full text-left py-5 flex items-center gap-4 hover:bg-[color:var(--color-paper-light)] transition-colors -mx-2 px-2 rounded"
                  >
                    <Avatar initials={f.initials} />
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-[color:var(--color-ink)]" style={{ fontSize: 17, fontWeight: 400 }}>
                        {f.name}
                      </p>
                      <p className="font-ui text-[12px] text-[color:var(--color-ink-muted)] mt-0.5 tabular">
                        {f.weeklyChapters} chapters this week
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="font-display tabular"
                        style={{ fontSize: 26, color: "var(--color-gold)", fontWeight: 300, lineHeight: 1 }}
                      >
                        {f.streak}
                      </p>
                      <p className="mt-1">
                        <SmallCaps>Day Streak</SmallCaps>
                      </p>
                    </div>
                  </button>
                </div>
              ))}

              {invited.length > 0 && (
                <div className="mt-8">
                  <SmallCaps>Pending Invites</SmallCaps>
                  <div className="mt-3">
                    {invited.map((inv, i) => (
                      <div key={inv.id}>
                        {i > 0 && <Rule />}
                        <div className="py-4 flex items-center gap-4">
                          <Avatar initials={inv.initials} />
                          <div className="flex-1 min-w-0">
                            <p className="font-display text-[color:var(--color-ink)]" style={{ fontSize: 16 }}>
                              {inv.name}
                            </p>
                            <p className="mt-0.5 font-ui text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)]">
                              Invitation Sent
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-6 font-body italic text-center text-[color:var(--color-ink-muted)]" style={{ fontSize: 13 }}>
                Quiz scores and reading content are private. Always.
              </p>
            </div>
          )}

          {tab === "groups" && (
            <div className="mt-7 space-y-8">
              {GROUPS.map((g) => {
                const total = g.members.reduce((s, m) => s + m.weeklyChapters, 0);
                const sorted = [...g.members].sort((a, b) => b.weeklyChapters - a.weeklyChapters);
                return (
                  <div key={g.id}>
                    <div className="flex items-baseline justify-between">
                      <h2 className="font-display text-[color:var(--color-ink)]" style={{ fontSize: 24, fontWeight: 400 }}>
                        {g.name}
                      </h2>
                      <SmallCaps>{g.members.length} Members</SmallCaps>
                    </div>
                    <div className="mt-4 flex items-baseline gap-3">
                      <span
                        className="font-display tabular"
                        style={{ fontSize: 56, color: "var(--color-gold)", fontWeight: 300, lineHeight: 1 }}
                      >
                        {total}
                      </span>
                      <span className="font-body italic text-[color:var(--color-ink-soft)]" style={{ fontSize: 14 }}>
                        chapters this week
                      </span>
                    </div>
                    <div className="mt-6">
                      <Rule />
                      {sorted.map((m, i) => (
                        <div key={m.name}>
                          <div className="py-3 flex items-center gap-3">
                            <span className="font-ui tabular text-[color:var(--color-ink-muted)] text-right" style={{ fontSize: 12, width: 22 }}>
                              {i + 1}
                            </span>
                            <Avatar initials={m.initials} small />
                            <span className="flex-1 font-body text-[color:var(--color-ink)]" style={{ fontSize: 15 }}>
                              {m.name}
                            </span>
                            <span className="font-display tabular text-[color:var(--color-ink)]" style={{ fontSize: 17, fontWeight: 400 }}>
                              {m.weeklyChapters}
                            </span>
                          </div>
                          <Rule />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {extraGroups.map((name) => (
                <div key={name}>
                  <div className="flex items-baseline justify-between">
                    <h2 className="font-display text-[color:var(--color-ink)]" style={{ fontSize: 24, fontWeight: 400 }}>
                      {name}
                    </h2>
                    <SmallCaps>1 Member</SmallCaps>
                  </div>
                  <p className="mt-4 font-body italic text-[color:var(--color-ink-soft)]" style={{ fontSize: 14 }}>
                    Just you so far. Invite friends to start reading together.
                  </p>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
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

        {/* === Public profile sheet === */}
        <BottomSheet
          open={!!openProfile}
          onClose={() => setOpenProfile(null)}
          eyebrow="Friend"
          title={openProfile?.name}
        >
          {openProfile && (
            <div>
              <div className="flex items-center gap-4">
                <Avatar initials={openProfile.initials} large />
                <div className="flex-1">
                  <p className="font-display tabular" style={{ fontSize: 40, color: "var(--color-gold)", fontWeight: 300, lineHeight: 1 }}>
                    {openProfile.streak}
                  </p>
                  <p className="mt-1"><SmallCaps>Day Streak</SmallCaps></p>
                </div>
              </div>
              <div className="mt-7"><Rule /></div>
              <div className="mt-6 space-y-5">
                <ProfileStat label="Rank" value={openProfile.rank} />
                <ProfileStat label="Books Completed" value={String(openProfile.booksCompleted)} />
                <ProfileStat label="This Week" value={`${openProfile.weeklyChapters} chapters`} />
              </div>
              <p className="mt-8 font-body italic text-[color:var(--color-ink-muted)] text-center" style={{ fontSize: 13 }}>
                What they read, and how they did on quizzes, stays private.
              </p>
              <div className="mt-6">
                <EditorialButton variant="secondary" onClick={() => setOpenProfile(null)}>
                  Close
                </EditorialButton>
              </div>
            </div>
          )}
        </BottomSheet>

        {/* === Add friend sheet === */}
        <BottomSheet
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          eyebrow="Invite"
          title="Add a friend"
        >
          <AddFriendForm onSubmit={inviteByEmail} />
        </BottomSheet>

        {/* === Create group sheet === */}
        <BottomSheet
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          eyebrow="New Group"
          title="Name your group"
        >
          <CreateGroupForm
            onSubmit={(name) => {
              setExtraGroups((g) => [...g, name]);
              setOpenCreate(false);
            }}
          />
        </BottomSheet>

        {/* === Join group sheet === */}
        <BottomSheet
          open={openJoin}
          onClose={() => setOpenJoin(false)}
          eyebrow="Join"
          title="Enter a group code"
        >
          <JoinGroupForm
            onSubmit={(code) => {
              setExtraGroups((g) => [...g, `Group · ${code.toUpperCase()}`]);
              setOpenJoin(false);
            }}
          />
        </BottomSheet>
      </Screen>
    </PhoneFrame>
  );
}

function Avatar({ initials, small, large }: { initials: string; small?: boolean; large?: boolean }) {
  const size = large ? 64 : small ? 28 : 40;
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 font-ui"
      style={{
        width: size,
        height: size,
        background: "var(--color-paper-light)",
        border: "1px solid var(--color-rule)",
        color: "var(--color-ink)",
        fontSize: large ? 18 : small ? 10 : 12,
        fontWeight: 500,
        letterSpacing: "0.05em",
      }}
    >
      {initials}
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <SmallCaps>{label}</SmallCaps>
      <span className="font-display text-[color:var(--color-ink)]" style={{ fontSize: 17 }}>
        {value}
      </span>
    </div>
  );
}

function AddFriendForm({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState("");
  return (
    <div>
      <SmallCaps>Their Email</SmallCaps>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="friend@example.com"
        className="mt-2 w-full bg-transparent border-b py-3 font-body text-[color:var(--color-ink)] focus:outline-none"
        style={{ fontSize: 17, borderColor: "var(--color-rule)" }}
      />
      <p className="mt-3 font-body italic text-[color:var(--color-ink-muted)]" style={{ fontSize: 13 }}>
        We'll send them a quiet invitation. They have to accept.
      </p>
      <div className="mt-7">
        <EditorialButton variant="gold" disabled={!email.includes("@")} onClick={() => onSubmit(email)}>
          Send Invite
        </EditorialButton>
      </div>
    </div>
  );
}

function CreateGroupForm({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState("");
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
        You'll be the first member. Invite people once it's created.
      </p>
      <div className="mt-7">
        <EditorialButton variant="gold" disabled={!name.trim()} onClick={() => onSubmit(name.trim())}>
          Create
        </EditorialButton>
      </div>
    </div>
  );
}

function JoinGroupForm({ onSubmit }: { onSubmit: (code: string) => void }) {
  const [code, setCode] = useState("");
  return (
    <div>
      <SmallCaps>Group Code</SmallCaps>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="ABC-123"
        className="mt-2 w-full bg-transparent border-b py-3 font-display tabular text-[color:var(--color-ink)] focus:outline-none"
        style={{ fontSize: 24, borderColor: "var(--color-rule)", letterSpacing: "0.1em" }}
      />
      <p className="mt-3 font-body italic text-[color:var(--color-ink-muted)]" style={{ fontSize: 13 }}>
        Ask the group's owner for the six-character code.
      </p>
      <div className="mt-7">
        <EditorialButton variant="gold" disabled={code.trim().length < 3} onClick={() => onSubmit(code.trim())}>
          Join
        </EditorialButton>
      </div>
    </div>
  );
}
