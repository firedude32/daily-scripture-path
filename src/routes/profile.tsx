import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import {
  useAppState,
  useClientReady,
  totalChaptersRead,
  booksCompleted,
  resetAll,
  setDailyGoal,
} from "@/state/store";
import { getRank, getNextRank } from "@/data/ranks";
import { NT_CHAPTERS, TOTAL_CHAPTERS } from "@/data/books";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { Rule } from "@/components/ui-lectio/Rule";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { exportAll } from "@/lib/exportCsv";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Lectio" },
      { name: "description", content: "Your account, your rank, your reading." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const ready = useClientReady();
  const state = useAppState();
  const [localGoal, setLocalGoal] = useState<number | null>(null);

  if (!ready) {
    return (
      <PhoneFrame>
        <Screen>
          <div />
        </Screen>
      </PhoneFrame>
    );
  }

  const rank = getRank(state.xp);
  const next = getNextRank(state.xp);
  const xpInLevel = state.xp - rank.xp;
  const xpNeeded = next ? next.xp - rank.xp : 1;
  const pct = next ? (xpInLevel / xpNeeded) * 100 : 100;
  const dailyGoal = localGoal ?? state.user.dailyGoal;

  return (
    <PhoneFrame>
      <Screen>
        <div className="px-7 pt-14 pb-10">
          <SmallCaps>Profile</SmallCaps>

          {/* Avatar + name */}
          <div className="mt-6 flex items-center gap-4">
            <div
              className="flex items-center justify-center font-display rounded-full shrink-0"
              style={{
                width: 64,
                height: 64,
                background: "var(--color-paper-light)",
                border: "1px solid var(--color-rule)",
                color: "var(--color-ink)",
                fontSize: 24,
                fontWeight: 400,
              }}
            >
              {state.user.name[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-[color:var(--color-ink)]" style={{ fontSize: 22, fontWeight: 400 }}>
                {state.user.name}
              </p>
              <p className="mt-1">
                <SmallCaps tone="gold">{rank.name}</SmallCaps>
              </p>
            </div>
          </div>

          {/* XP progress */}
          <div className="mt-7">
            <div style={{ height: 1.5, background: "var(--color-rule)" }}>
              <div
                style={{ height: 1.5, background: "var(--color-gold)", width: `${pct}%`, transition: "width 600ms ease-out" }}
              />
            </div>
            <p className="mt-3 font-ui uppercase tracking-[0.14em] text-[11px] text-[color:var(--color-ink-muted)]">
              {next ? (
                <>
                  Next · {next.name} at <span className="tabular text-[color:var(--color-ink)]">{next.xp.toLocaleString()}</span> XP ·{" "}
                  <span className="tabular">{(next.xp - state.xp).toLocaleString()}</span> to go
                </>
              ) : (
                "Highest rank reached"
              )}
            </p>
          </div>

          <div className="mt-8"><Rule /></div>

          {/* Quick stats */}
          <div className="mt-7 grid grid-cols-3 gap-2">
            <Stat label="Chapters" value={totalChaptersRead(state)} />
            <Stat label="Books" value={booksCompleted(state)} />
            <Stat label="Streak" value={state.currentStreak} />
          </div>

          <Section title="Reading Plan">
            <div className="space-y-5">
              <Row label="Translation" value={state.user.translation} />
              <Row label="Reminder" value={state.user.reminderTime || "Off"} />
              <div>
                <div className="flex justify-between items-baseline">
                  <SmallCaps>Daily Goal</SmallCaps>
                  <span className="font-display tabular text-[color:var(--color-ink)]" style={{ fontSize: 17 }}>
                    {dailyGoal} ch / day
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={dailyGoal}
                  onChange={(e) => setLocalGoal(Number(e.target.value))}
                  onMouseUp={() => localGoal && setDailyGoal(localGoal)}
                  onTouchEnd={() => localGoal && setDailyGoal(localGoal)}
                  className="w-full mt-3"
                  style={{ accentColor: "var(--color-gold)" }}
                />
                <div
                  className="mt-4 p-4 border space-y-1.5"
                  style={{ background: "var(--color-paper-light)", borderColor: "var(--color-rule)" }}
                >
                  <SmallCaps>At {dailyGoal} per day</SmallCaps>
                  <ProjRow label="Finish New Testament" value={`${Math.ceil(NT_CHAPTERS / dailyGoal)} days`} />
                  <ProjRow label="Finish the Bible" value={`${Math.ceil(TOTAL_CHAPTERS / dailyGoal)} days`} />
                </div>
              </div>
            </div>
          </Section>

          <Section title="More">
            <div>
              <Rule />
              <NavItem label="Achievements" />
              <Rule />
              <NavItem label="Reading History" />
              <Rule />
              <NavItem label="Export Your Data (CSV)" onClick={() => exportAll(state)} />
              <Rule />
              <Link to="/resources" className="block"><NavItem label="Other Resources" /></Link>
              <Rule />
              <NavItem label="Account Settings" />
              <Rule />
              <NavItem label="About / Credits" />
              <Rule />
            </div>
          </Section>

          <div className="mt-10">
            <EditorialButton
              variant="text"
              fullWidth={false}
              onClick={() => { if (confirm("Reset all prototype data?")) resetAll(); }}
            >
              Sign Out
            </EditorialButton>
          </div>

          <p className="mt-8 text-center font-ui uppercase tracking-[0.18em] text-[10px] text-[color:var(--color-ink-muted)]">
            Lectio · Prototype v0.2
          </p>
        </div>
      </Screen>
    </PhoneFrame>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10">
      <SmallCaps as="div" className="mb-5">{title}</SmallCaps>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-left">
      <p className="font-display text-[color:var(--color-ink)] tabular" style={{ fontSize: 28, fontWeight: 400, lineHeight: 1 }}>
        {value}
      </p>
      <p className="mt-2"><SmallCaps>{label}</SmallCaps></p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <SmallCaps>{label}</SmallCaps>
      <span className="font-display text-[color:var(--color-ink)]" style={{ fontSize: 16, fontWeight: 400 }}>
        {value}
      </span>
    </div>
  );
}

function ProjRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline font-body" style={{ fontSize: 14 }}>
      <span className="text-[color:var(--color-ink-soft)]">{label}</span>
      <span className="tabular text-[color:var(--color-ink)]">{value}</span>
    </div>
  );
}

function NavItem({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-4 font-body text-[color:var(--color-ink)] hover:text-[color:var(--color-gold)] transition-colors"
      style={{ fontSize: 15 }}
    >
      <span>{label}</span>
      <ChevronRight size={16} className="text-[color:var(--color-ink-muted)]" />
    </button>
  );
}
