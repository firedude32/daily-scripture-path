import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
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

function FriendsPage() {
  const [tab, setTab] = useState<"friends" | "groups">("friends");
  const [openAdd, setOpenAdd] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);

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

          {/* Tab switcher */}
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
                <EditorialButton variant="gold" onClick={() => setOpenAdd(true)}>
                  Invite a Friend
                </EditorialButton>
              </div>
              <p className="mt-10 font-body italic text-[color:var(--color-ink-muted)]" style={{ fontSize: 13 }}>
                Quiz scores and reading content stay private. Always.
              </p>
            </div>
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
          <AddFriendForm onSubmit={() => setOpenAdd(false)} />
        </BottomSheet>

        <BottomSheet open={openCreate} onClose={() => setOpenCreate(false)} eyebrow="New Group" title="Name your group">
          <CreateGroupForm onSubmit={() => setOpenCreate(false)} />
        </BottomSheet>

        <BottomSheet open={openJoin} onClose={() => setOpenJoin(false)} eyebrow="Join" title="Enter a group code">
          <JoinGroupForm onSubmit={() => setOpenJoin(false)} />
        </BottomSheet>
      </Screen>
    </PhoneFrame>
  );
}

function AddFriendForm({ onSubmit }: { onSubmit: (value: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <div>
      <SmallCaps>Email or Username</SmallCaps>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="friend@example.com"
        className="mt-2 w-full bg-transparent border-b py-3 font-body text-[color:var(--color-ink)] focus:outline-none"
        style={{ fontSize: 17, borderColor: "var(--color-rule)" }}
      />
      <p className="mt-3 font-body italic text-[color:var(--color-ink-muted)]" style={{ fontSize: 13 }}>
        We'll send a quiet invitation. They have to accept.
      </p>
      <div className="mt-7">
        <EditorialButton variant="gold" disabled={value.trim().length < 3} onClick={() => onSubmit(value)}>
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
        You'll be the first member. Invite others once it's created.
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
        placeholder="ABC123"
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
