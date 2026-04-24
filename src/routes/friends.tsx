import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { FRIENDS, GROUPS } from "@/data/friends";

export const Route = createFileRoute("/friends")({
  head: () => ({
    meta: [
      { title: "Friends — Bible Reading Habit Tracker" },
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
        <div className="px-6 pt-12 pb-8">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-3xl text-foreground">Friends</h1>
            <button className="rounded-full bg-primary text-primary-foreground p-2.5" aria-label="Add">
              <Plus size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-6 grid grid-cols-2 rounded-full bg-muted p-1">
            <button
              onClick={() => setTab("friends")}
              className="py-2 rounded-full text-sm font-medium transition-colors"
              style={{
                background: tab === "friends" ? "var(--color-surface)" : "transparent",
                color: tab === "friends" ? "var(--color-foreground)" : "var(--color-muted-foreground)",
              }}
            >
              Friends
            </button>
            <button
              onClick={() => setTab("groups")}
              className="py-2 rounded-full text-sm font-medium transition-colors"
              style={{
                background: tab === "groups" ? "var(--color-surface)" : "transparent",
                color: tab === "groups" ? "var(--color-foreground)" : "var(--color-muted-foreground)",
              }}
            >
              Groups
            </button>
          </div>

          {tab === "friends" && (
            <div className="mt-6 space-y-2">
              {FRIENDS.map((f) => (
                <div key={f.id} className="rounded-xl bg-surface border border-border p-4 flex items-center gap-3">
                  <Avatar initials={f.initials} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.rank} · {f.booksCompleted} books</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-serif text-primary tabular">{f.streak}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">streak</p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-sm tabular text-foreground">{f.weeklyChapters}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">this wk</p>
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-muted-foreground text-center mt-4">
                Quiz scores and reading content are private. Always.
              </p>
            </div>
          )}

          {tab === "groups" && (
            <div className="mt-6 space-y-4">
              {GROUPS.map((g) => {
                const total = g.members.reduce((s, m) => s + m.weeklyChapters, 0);
                const sorted = [...g.members].sort((a, b) => b.weeklyChapters - a.weeklyChapters);
                return (
                  <div key={g.id} className="rounded-xl bg-surface border border-border p-5">
                    <div className="flex items-baseline justify-between">
                      <h2 className="font-serif text-xl text-foreground">{g.name}</h2>
                      <span className="text-xs text-muted-foreground">{g.members.length} members</span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-serif text-3xl text-primary tabular">{total}</span>
                      <span className="text-xs text-muted-foreground">chapters this week, together</span>
                    </div>
                    <div className="mt-5 space-y-2">
                      {sorted.map((m, i) => (
                        <div key={m.name} className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-5 tabular text-right">{i + 1}</span>
                          <Avatar initials={m.initials} small />
                          <span className="flex-1 text-sm text-foreground">{m.name}</span>
                          <span className="text-sm tabular text-foreground">{m.weeklyChapters}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="rounded-xl border border-border bg-surface py-3 text-sm font-medium text-foreground">Create group</button>
                <button className="rounded-xl border border-border bg-surface py-3 text-sm font-medium text-foreground">Join group</button>
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
      className="rounded-full flex items-center justify-center shrink-0 text-primary-foreground font-medium"
      style={{ width: size, height: size, background: "var(--color-primary)", fontSize: small ? 11 : 13 }}
    >
      {initials}
    </div>
  );
}
