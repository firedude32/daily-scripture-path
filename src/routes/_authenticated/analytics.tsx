import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import {
  useAppState,
  useClientReady,
  totalChaptersRead,
  firstSessionDate,
  lastNDayCounts,
  avgStartTimeLabel,
  avgSessionMinutes,
  longestSessionMinutes,
  totalHoursRead,
  versesRead,
  totalReadingDays,
} from "@/state/store";
import { BOOKS, bookById, NT_CHAPTERS } from "@/data/books";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { Rule } from "@/components/ui-lectio/Rule";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { exportAll } from "@/lib/exportCsv";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [
      { title: "Advanced Analytics — Lectio" },
      { name: "description", content: "Every number you've earned, all in one place." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const ready = useClientReady();
  const state = useAppState();

  if (!ready) {
    return <PhoneFrame><Screen noTabs><div /></Screen></PhoneFrame>;
  }

  const total = totalChaptersRead(state);
  const firstMs = firstSessionDate(state);
  const sinceLabel = firstMs
    ? new Date(firstMs).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "—";

  // 30-day band
  const last30 = lastNDayCounts(state, 30);
  const prev30 = lastNDayCounts(state, 60).slice(0, 30);
  const last30Total = last30.reduce((a, b) => a + b.count, 0);
  const prev30Total = prev30.reduce((a, b) => a + b.count, 0);
  const delta = last30Total - prev30Total;
  const readingDays30 = last30.filter((d) => d.count > 0).length;
  const avgPerDay30 = (last30Total / 30).toFixed(1);

  // Books band
  const startedBooks = BOOKS.filter((b) => {
    const bp = state.bookProgress[b.id];
    return bp && (bp.readThroughs > 0 || bp.inProgressChapters.length > 0);
  });
  const completedCount = startedBooks.filter((b) => state.bookProgress[b.id].readThroughs >= 1).length;
  const inProgCount = startedBooks.filter((b) => state.bookProgress[b.id].readThroughs === 0).length;
  const unreadCount = 66 - startedBooks.length;

  // Pace
  const goal = Math.max(1, state.user.dailyGoal);
  const ntChaptersDone = BOOKS.filter((b) => b.testament === "NT").reduce((s, b) => {
    const bp = state.bookProgress[b.id];
    if (!bp) return s;
    return s + bp.readThroughs * b.chapters + bp.inProgressChapters.length;
  }, 0);
  const ntPct = Math.round((ntChaptersDone / NT_CHAPTERS) * 100);

  return (
    <PhoneFrame>
      <Screen noTabs>
        <div className="px-7 pt-12 pb-12 overflow-y-auto h-full">
          {/* Top */}
          <div className="flex items-center gap-3">
            <Link
              to="/progress"
              className="-ml-2 p-2 text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </Link>
            <SmallCaps>Advanced Analytics · All Time</SmallCaps>
          </div>

          {/* Hero band */}
          <div className="mt-8 flex items-baseline gap-3">
            <span
              className="font-display tabular"
              style={{ fontSize: 84, color: "var(--color-gold)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.03em" }}
            >
              {total}
            </span>
            <span className="font-body italic text-[color:var(--color-ink-soft)]" style={{ fontSize: 18 }}>
              chapters
            </span>
          </div>
          <p className="mt-3"><SmallCaps>Since {sinceLabel}</SmallCaps></p>

          <div className="mt-8"><Rule /></div>

          {/* 30-day band */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <SmallCaps>The Last Thirty Days</SmallCaps>
              <SmallCaps tone="gold">
                {delta >= 0 ? `+${delta}` : delta} vs Prev
              </SmallCaps>
            </div>
            <div className="mt-4">
              <ThirtyChart counts={last30.map((d) => d.count)} />
            </div>
            <div className="mt-5 grid grid-cols-3" style={{ borderTop: "1px solid var(--color-rule)" }}>
              <Cell label="Reading Days" value={readingDays30} />
              <Cell label="Chapters" value={last30Total} divider />
              <Cell label="Per Day Avg" value={avgPerDay30} divider />
            </div>
          </div>

          <div className="mt-8"><Rule /></div>

          {/* Your books */}
          <div className="mt-7">
            <SmallCaps>Your Books</SmallCaps>
            <div className="mt-4 space-y-3">
              {startedBooks.map((b) => {
                const bp = state.bookProgress[b.id];
                const completed = bp.readThroughs >= 1;
                const chapters = completed ? b.chapters : bp.inProgressChapters.length;
                return (
                  <div key={b.id} className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-[color:var(--color-ink)] truncate" style={{ fontSize: 17, fontWeight: 400 }}>
                      {b.name}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-ui tabular text-[12px] text-[color:var(--color-ink-muted)] tracking-wider">
                        {chapters} / {b.chapters}
                      </span>
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "9999px",
                          background: completed ? "var(--color-gold)" : "transparent",
                          border: completed ? "none" : "1px solid var(--color-gold)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-5"><SmallCaps>{completedCount} Complete · {inProgCount} In Progress · {unreadCount} Unread</SmallCaps></p>
          </div>

          <div className="mt-8"><Rule /></div>

          {/* Pace & projections */}
          <div className="mt-7">
            <SmallCaps>At Your Current Pace</SmallCaps>
            <div className="mt-5 flex items-start gap-6">
              <ul className="flex-1 space-y-3 font-body text-[color:var(--color-ink)]" style={{ fontSize: 15 }}>
                {[
                  ["Mark", Math.ceil(2 / goal)],
                  ["The Gospels", Math.ceil(89 / goal)],
                  ["The New Testament", Math.ceil(NT_CHAPTERS / goal)],
                ].map(([label, days]) => (
                  <li key={String(label)} className="flex items-center gap-3">
                    <span style={{ width: 5, height: 5, borderRadius: "9999px", background: "var(--color-gold)" }} />
                    <span className="flex-1">{label}</span>
                    <span className="tabular text-[color:var(--color-ink-muted)]">in {days} days</span>
                  </li>
                ))}
              </ul>
              <PercentRing pct={ntPct} label="NT" />
            </div>
          </div>

          <div className="mt-8"><Rule /></div>

          {/* Details grid 3×2 */}
          <div className="mt-7">
            <SmallCaps>The Details</SmallCaps>
            <div className="mt-5 grid grid-cols-3 gap-y-7" style={{ borderTop: "1px solid var(--color-rule)", paddingTop: 24 }}>
              <Detail label="Hrs Read" value={totalHoursRead(state).toFixed(0)} />
              <Detail label="Verses" value={versesRead(state).toLocaleString()} divider />
              <Detail label="Avg Start" value={avgStartTimeLabel(state)} divider />
              <Detail label="Avg Session" value={`${avgSessionMinutes(state)} min`} />
              <Detail label="Longest" value={`${longestSessionMinutes(state)} min`} divider />
              <Detail label="First Read" value={firstMs ? new Date(firstMs).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"} divider />
            </div>
          </div>

          <div className="mt-8"><Rule /></div>

          {/* Streak insights */}
          <div className="mt-7">
            <SmallCaps>Streak History</SmallCaps>
            <div className="mt-5 grid grid-cols-3" style={{ borderTop: "1px solid var(--color-rule)" }}>
              <Cell label="Current" value={`${state.currentStreak}d`} />
              <Cell label="Longest" value={`${state.longestStreak}d`} divider />
              <Cell label="Reading Days" value={totalReadingDays(state)} divider />
            </div>
          </div>

          <div className="mt-8"><Rule /></div>

          {/* Favorites */}
          <div className="mt-7">
            <SmallCaps>Favorites</SmallCaps>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {["Mark 4:9", "Psalms 23:1", "John 1:14", "Philippians 4:13"].map((ref) => (
                <span key={ref} className="font-ui uppercase tracking-[0.14em] text-[12px] text-[color:var(--color-ink)]">
                  {ref}
                </span>
              ))}
            </div>
          </div>

          {/* Export */}
          <div className="mt-12">
            <EditorialButton variant="primary" onClick={() => exportAll(state)}>
              Export Your Reading
            </EditorialButton>
            <p className="mt-3 text-center font-body italic text-[color:var(--color-ink-muted)]" style={{ fontSize: 12 }}>
              Two CSV files. Yours to keep.
            </p>
          </div>
        </div>
      </Screen>
    </PhoneFrame>
  );
}

function Cell({ label, value, divider }: { label: string; value: string | number; divider?: boolean }) {
  return (
    <div
      className="py-4 px-2"
      style={divider ? { borderLeft: "1px solid var(--color-rule)" } : undefined}
    >
      <p className="font-display tabular text-[color:var(--color-ink)]" style={{ fontSize: 24, fontWeight: 400, lineHeight: 1 }}>
        {value}
      </p>
      <p className="mt-2"><SmallCaps>{label}</SmallCaps></p>
    </div>
  );
}

function Detail({ label, value, divider }: { label: string; value: string | number; divider?: boolean }) {
  return (
    <div
      className="px-2"
      style={divider ? { borderLeft: "1px solid var(--color-rule)" } : undefined}
    >
      <p className="font-display tabular text-[color:var(--color-ink)]" style={{ fontSize: 22, fontWeight: 400, lineHeight: 1 }}>
        {value}
      </p>
      <p className="mt-2"><SmallCaps>{label}</SmallCaps></p>
    </div>
  );
}

function ThirtyChart({ counts }: { counts: number[] }) {
  const w = 320, h = 70, pad = 4;
  const max = Math.max(...counts, 1);
  const barW = (w - pad * 2) / counts.length - 1;
  const points = counts.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / (counts.length - 1);
    const y = h - pad - (v / max) * (h - pad * 2);
    return [x, y] as const;
  });
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 70 }}>
      {counts.map((v, i) => {
        const x = pad + (i * (w - pad * 2)) / counts.length;
        const barH = (v / max) * (h - pad * 2);
        return (
          <rect
            key={i}
            x={x}
            y={h - pad - barH}
            width={Math.max(1, barW)}
            height={barH}
            fill="var(--color-gold)"
            opacity={0.25}
          />
        );
      })}
      <path d={path} stroke="var(--color-gold)" strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PercentRing({ pct, label }: { pct: number; label: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative shrink-0" style={{ width: 64, height: 64 }}>
      <svg width={64} height={64} viewBox="0 0 64 64">
        <circle cx={32} cy={32} r={r} stroke="var(--color-rule)" strokeWidth="2" fill="none" />
        <circle
          cx={32}
          cy={32}
          r={r}
          stroke="var(--color-gold)"
          strokeWidth="2"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform="rotate(-90 32 32)"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display tabular text-[color:var(--color-ink)]" style={{ fontSize: 14, fontWeight: 400, lineHeight: 1 }}>
          {pct}%
        </span>
        <span className="font-ui uppercase tracking-[0.14em] text-[8px] text-[color:var(--color-ink-muted)] mt-0.5">{label}</span>
      </div>
    </div>
  );
}
