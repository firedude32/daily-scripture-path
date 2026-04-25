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
  setReminder,
  setTranslation,
  setUserName,
  setUserEmail,
} from "@/state/store";
import { getRank, getNextRank, RANKS } from "@/data/ranks";
import { NT_CHAPTERS, TOTAL_CHAPTERS, bookById } from "@/data/books";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { Rule } from "@/components/ui-lectio/Rule";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { BottomSheet } from "@/components/ui-lectio/BottomSheet";
import { exportAll } from "@/lib/exportCsv";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Lectio" },
      { name: "description", content: "Your account, your rank, your reading." },
    ],
  }),
  component: ProfilePage,
});

type SheetKey =
  | null
  | "achievements"
  | "history"
  | "account"
  | "about"
  | "translation"
  | "reminder";

const TRANSLATIONS = ["ESV", "NIV", "KJV", "NKJV", "NLT", "NASB", "CSB", "NRSV", "MSG", "AMP"];

function ProfilePage() {
  const ready = useClientReady();
  const state = useAppState();
  const [localGoal, setLocalGoal] = useState<number | null>(null);
  const [sheet, setSheet] = useState<SheetKey>(null);

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
              <RowButton
                label="Translation"
                value={state.user.translation}
                onClick={() => setSheet("translation")}
              />
              <RowButton
                label="Reminder"
                value={state.user.reminderTime || "Off"}
                onClick={() => setSheet("reminder")}
              />
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
              <NavItem label="Achievements" onClick={() => setSheet("achievements")} />
              <Rule />
              <NavItem label="Reading History" onClick={() => setSheet("history")} />
              <Rule />
              <NavItem label="Export Your Data (CSV)" onClick={() => exportAll(state)} />
              <Rule />
              <Link to="/resources" className="block"><NavItem label="Other Resources" /></Link>
              <Rule />
              <NavItem label="Account Settings" onClick={() => setSheet("account")} />
              <Rule />
              <NavItem label="About / Credits" onClick={() => setSheet("about")} />
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

        {/* === Sheets === */}
        <BottomSheet
          open={sheet === "achievements"}
          onClose={() => setSheet(null)}
          eyebrow="Your Path"
          title="Ranks"
        >
          <div>
            {RANKS.map((r, i) => {
              const reached = state.xp >= r.xp;
              const current = getRank(state.xp).name === r.name;
              return (
                <div key={r.name}>
                  {i > 0 && <Rule />}
                  <div className="py-4 flex items-baseline justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p
                        className="font-display"
                        style={{
                          fontSize: 18,
                          fontWeight: 400,
                          color: current
                            ? "var(--color-gold)"
                            : reached
                              ? "var(--color-ink)"
                              : "var(--color-ink-muted)",
                        }}
                      >
                        {r.name} {current && "·"} {current && <span className="font-ui uppercase tracking-[0.14em] text-[11px]">Current</span>}
                      </p>
                      <p className="mt-1 font-body italic text-[color:var(--color-ink-soft)]" style={{ fontSize: 13 }}>
                        {r.blurb}
                      </p>
                    </div>
                    <span className="font-ui tabular text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)]">
                      {r.xp.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </BottomSheet>

        <BottomSheet
          open={sheet === "history"}
          onClose={() => setSheet(null)}
          eyebrow="Every Session"
          title="Reading History"
        >
          {state.sessions.length === 0 ? (
            <p className="font-body italic text-[color:var(--color-ink-muted)]">No sessions yet.</p>
          ) : (
            <div>
              {state.sessions.slice(0, 60).map((s, i) => {
                const book = bookById(s.bookId);
                const d = new Date(s.completedAt);
                const dateLabel = d.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: d.getFullYear() === new Date().getFullYear() ? undefined : "2-digit",
                });
                const min = Math.floor(s.durationSec / 60);
                return (
                  <div key={s.id}>
                    {i > 0 && <Rule />}
                    <div className="py-3 flex items-baseline justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-display text-[color:var(--color-ink)]" style={{ fontSize: 16 }}>
                          {book?.name ?? s.bookId} {s.chapter}
                        </p>
                        <p className="mt-0.5 font-ui text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)]">
                          {dateLabel} · {min} min · +{s.xpEarned} XP
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {state.sessions.length > 60 && (
                <p className="mt-4 font-ui text-[11px] uppercase tracking-[0.14em] text-center text-[color:var(--color-ink-muted)]">
                  Showing 60 of {state.sessions.length}
                </p>
              )}
            </div>
          )}
        </BottomSheet>

        <BottomSheet
          open={sheet === "account"}
          onClose={() => setSheet(null)}
          eyebrow="Account"
          title="Your Details"
        >
          <div className="space-y-6">
            <FieldEditor
              label="Name"
              value={state.user.name}
              onSave={setUserName}
            />
            <Rule />
            <FieldEditor
              label="Email"
              value={state.user.email}
              onSave={setUserEmail}
              type="email"
            />
          </div>
        </BottomSheet>

        <BottomSheet
          open={sheet === "about"}
          onClose={() => setSheet(null)}
          eyebrow="Lectio"
          title="About"
        >
          <p className="font-body text-[color:var(--color-ink)]" style={{ fontSize: 15, lineHeight: 1.6 }}>
            Lectio is a tool for ordinary Christians who want to read their Bibles —
            and stay reading. No streak shaming. No anxiety. Just a quiet, honest
            way to keep showing up.
          </p>
          <div className="mt-8"><Rule /></div>
          <div className="mt-6 space-y-3">
            <AboutRow label="Version" value="Prototype 0.2" />
            <AboutRow label="Build" value="Lectio · Editorial" />
            <AboutRow label="Made with" value="Care" />
          </div>
          <p className="mt-10 font-body italic text-center text-[color:var(--color-ink-muted)]" style={{ fontSize: 13 }}>
            "Your word is a lamp to my feet."
          </p>
        </BottomSheet>

        <BottomSheet
          open={sheet === "translation"}
          onClose={() => setSheet(null)}
          eyebrow="Choose"
          title="Translation"
        >
          <div className="grid grid-cols-2 gap-2">
            {TRANSLATIONS.map((t) => {
              const active = t === state.user.translation;
              return (
                <button
                  key={t}
                  onClick={() => {
                    setTranslation(t);
                    setTimeout(() => setSheet(null), 180);
                  }}
                  className="py-4 rounded-[12px] border font-display transition-colors"
                  style={{
                    borderColor: active ? "var(--color-gold)" : "var(--color-rule)",
                    background: active ? "var(--color-paper-light)" : "transparent",
                    color: active ? "var(--color-gold)" : "var(--color-ink)",
                    fontSize: 17,
                    fontWeight: 400,
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </BottomSheet>

        <BottomSheet
          open={sheet === "reminder"}
          onClose={() => setSheet(null)}
          eyebrow="Daily Reminder"
          title="When do you want to read?"
        >
          <div>
            <SmallCaps>Reminder Time</SmallCaps>
            <input
              type="time"
              value={state.user.reminderTime || "07:00"}
              onChange={(e) => setReminder(e.target.value)}
              className="mt-3 w-full bg-transparent font-display tabular text-[color:var(--color-ink)] focus:outline-none border-b py-2"
              style={{ fontSize: 36, fontWeight: 400, borderColor: "var(--color-rule)" }}
            />
          </div>
          <button
            onClick={() => setReminder(state.user.reminderTime ? "" : "07:00")}
            className="mt-7 flex items-center justify-between w-full py-4 border-b"
            style={{ borderColor: "var(--color-rule)" }}
          >
            <span className="font-body text-[color:var(--color-ink)]" style={{ fontSize: 15 }}>
              Remind me at this time
            </span>
            <span
              className="rounded-full p-0.5 transition-colors"
              style={{
                width: 44,
                height: 26,
                background: state.user.reminderTime ? "var(--color-ink)" : "var(--color-rule)",
                display: "inline-block",
              }}
            >
              <span
                className="block rounded-full transition-transform"
                style={{
                  width: 22,
                  height: 22,
                  background: "var(--color-paper)",
                  transform: state.user.reminderTime ? "translateX(18px)" : "translateX(0)",
                }}
              />
            </span>
          </button>
          <p className="mt-4 font-body italic text-[color:var(--color-ink-muted)]" style={{ fontSize: 13 }}>
            One notification. Never more.
          </p>
          <div className="mt-8">
            <EditorialButton variant="primary" onClick={() => setSheet(null)}>
              Done
            </EditorialButton>
          </div>
        </BottomSheet>
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

function RowButton({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex justify-between items-baseline py-1 group"
    >
      <SmallCaps>{label}</SmallCaps>
      <span
        className="font-display text-[color:var(--color-ink)] group-hover:text-[color:var(--color-gold)] transition-colors flex items-center gap-1"
        style={{ fontSize: 16, fontWeight: 400 }}
      >
        {value}
        <ChevronRight size={14} className="text-[color:var(--color-ink-muted)]" />
      </span>
    </button>
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

function FieldEditor({
  label,
  value,
  onSave,
  type = "text",
}: {
  label: string;
  value: string;
  onSave: (v: string) => void;
  type?: string;
}) {
  const [v, setV] = useState(value);
  return (
    <div>
      <SmallCaps>{label}</SmallCaps>
      <input
        type={type}
        value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => v.trim() && onSave(v.trim())}
        className="mt-2 w-full bg-transparent border-b py-3 font-body text-[color:var(--color-ink)] focus:outline-none"
        style={{ fontSize: 17, borderColor: "var(--color-rule)" }}
      />
    </div>
  );
}

function AboutRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <SmallCaps>{label}</SmallCaps>
      <span className="font-display text-[color:var(--color-ink)]" style={{ fontSize: 15 }}>
        {value}
      </span>
    </div>
  );
}
