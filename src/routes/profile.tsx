import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, LogOut } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { useAppState, useClientReady, totalChaptersRead, booksCompleted, resetAll } from "@/state/store";
import { getRank, getNextRank, getRankIndex, RANKS } from "@/data/ranks";
import { NT_CHAPTERS, TOTAL_CHAPTERS } from "@/data/books";
import { useState } from "react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Bible Reading Habit Tracker" },
      { name: "description", content: "Your account, your rank, your reading." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const ready = useClientReady();
  const state = useAppState();
  const [goal, setGoal] = useState(0);

  if (!ready) return <PhoneFrame><Screen><div /></Screen></PhoneFrame>;

  const rank = getRank(state.xp);
  const next = getNextRank(state.xp);
  const idx = getRankIndex(state.xp);
  const xpInLevel = state.xp - rank.xp;
  const xpNeeded = next ? next.xp - rank.xp : 1;
  const pct = next ? (xpInLevel / xpNeeded) * 100 : 100;
  const dailyGoal = goal || state.user.dailyGoal;

  return (
    <PhoneFrame>
      <Screen>
        <div className="px-6 pt-12 pb-8">
          <h1 className="font-serif text-3xl text-foreground">Profile</h1>

          {/* User card */}
          <div className="mt-6 rounded-2xl bg-surface border border-border p-5 flex items-center gap-4">
            <div className="rounded-full flex items-center justify-center font-serif text-xl text-primary-foreground" style={{ width: 56, height: 56, background: "var(--color-primary)" }}>
              {state.user.name[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{state.user.name}</p>
              <p className="text-xs text-muted-foreground">{state.user.email}</p>
            </div>
          </div>

          {/* Rank */}
          <div className="mt-4 rounded-2xl bg-surface border border-border p-5">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Current rank</p>
                <p className="font-serif text-2xl text-foreground mt-1">{rank.name}</p>
              </div>
              <p className="text-xs tabular text-muted-foreground">{state.xp.toLocaleString()} XP</p>
            </div>
            <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {next ? <>Next: <span className="text-foreground">{next.name}</span> in <span className="tabular">{(next.xp - state.xp).toLocaleString()}</span> XP</> : "Highest rank reached."}
            </p>
            {/* Ladder mini */}
            <div className="mt-4 flex gap-1">
              {RANKS.map((_, i) => (
                <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i <= idx ? "var(--color-primary)" : "var(--color-border)" }} />
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Mini label="Chapters" value={totalChaptersRead(state)} />
            <Mini label="Books" value={booksCompleted(state)} />
            <Mini label="Streak" value={state.currentStreak} />
          </div>

          {/* Reading plan */}
          <Section title="Reading plan">
            <div className="rounded-2xl bg-surface border border-border p-5">
              <Row label="Translation" value={state.user.translation} />
              <Row label="Reminder" value={state.user.reminderTime || "Off"} />
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Daily goal</span>
                  <span className="tabular text-foreground">{dailyGoal} ch/day</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={dailyGoal}
                  onChange={(e) => setGoal(Number(e.target.value))}
                  className="w-full mt-2 accent-[color:var(--color-primary)]"
                />
                <div className="mt-3 rounded-xl bg-muted p-3 text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between"><span>Finish New Testament</span><span className="tabular text-foreground">{Math.ceil(NT_CHAPTERS / dailyGoal)} days</span></div>
                  <div className="flex justify-between"><span>Finish the Bible</span><span className="tabular text-foreground">{Math.ceil(TOTAL_CHAPTERS / dailyGoal)} days</span></div>
                </div>
              </div>
            </div>
          </Section>

          {/* Sections */}
          <Section title="More">
            <div className="rounded-2xl bg-surface border border-border divide-y divide-border overflow-hidden">
              <NavItem label="Achievements" />
              <NavItem label="Reading history" />
              <Link to="/resources" className="block">
                <NavItem label="Other Resources" />
              </Link>
              <NavItem label="Account settings" />
            </div>
          </Section>

          <button
            onClick={() => { if (confirm("Reset all prototype data?")) resetAll(); }}
            className="mt-6 w-full rounded-2xl border border-border bg-surface py-4 text-sm text-muted-foreground flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Sign out
          </button>

          <p className="mt-6 text-center text-[10px] text-muted-foreground">
            Prototype build · v0.1
          </p>
        </div>
      </Screen>
    </PhoneFrame>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">{title}</p>
      {children}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-surface border border-border p-3 text-center">
      <p className="font-serif text-xl text-foreground tabular">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function NavItem({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between p-4 text-sm text-foreground">
      <span>{label}</span>
      <ChevronRight size={16} className="text-muted-foreground" />
    </div>
  );
}
