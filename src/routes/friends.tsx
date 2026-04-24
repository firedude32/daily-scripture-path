import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { FRIENDS, GROUPS } from "@/data/friends";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { Rule } from "@/components/ui-lectio/Rule";

export const Route = createFileRoute("/friends")({
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

  return (
    <PhoneFrame>
      <Screen>
        <div className="px-7 pt-14 pb-10">
          <div className="flex items-center justify-between">
            <SmallCaps>Friends</SmallCaps>
            <button
              className="p-2 -mr-2 text-[color:var(--color-ink)]"
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
                  <div className="py-5 flex items-center gap-4">
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
                  </div>
                </div>
              ))}
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
              <div className="grid grid-cols-2 gap-3">
                <EditorialButton variant="secondary" size="sm">Create Group</EditorialButton>
                <EditorialButton variant="secondary" size="sm">Join Group</EditorialButton>
              </div>
            </div>
          )}
        </div>
      </Screen>
    </PhoneFrame>
  );
}

function Avatar({ initials, small }: { initials: string; small?: boolean }) {
  const size = small ? 28 : 40;
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 font-ui"
      style={{
        width: size,
        height: size,
        background: "var(--color-paper-light)",
        border: "1px solid var(--color-rule)",
        color: "var(--color-ink)",
        fontSize: small ? 10 : 12,
        fontWeight: 500,
        letterSpacing: "0.05em",
      }}
    >
      {initials}
    </div>
  );
}
