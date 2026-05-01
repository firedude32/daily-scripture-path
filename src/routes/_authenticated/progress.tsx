import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { Heatmap } from "@/components/Heatmap";
import {
  useAppState,
  useClientReady,
  totalChaptersRead,
  bookTier,
  setProgressView,
} from "@/state/store";
import { BOOKS, NT_CHAPTERS, OT_CHAPTERS, type Book, bookById } from "@/data/books";
import { setReadOverride } from "@/lib/readOverride";
import { hasQuiz } from "@/data/quiz";
import type { Genre } from "@/data/books";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { Rule } from "@/components/ui-lectio/Rule";
import { HairlineProgress } from "@/components/ui-lectio/HairlineProgress";

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({
    meta: [
      { title: "Progress — Lectio" },
      { name: "description", content: "Your reading data, honestly told." },
    ],
  }),
  component: ProgressPage,
});

const TIER_FILL: Record<string, string> = {
  none: "transparent",
  in_progress: "transparent",
  green: "var(--color-tier-green)",
  silver: "var(--color-tier-silver)",
  gold: "var(--color-tier-gold)",
};

function ProgressPage() {
  const ready = useClientReady();
  const state = useAppState();
  const navigate = useNavigate();
  const [openBook, setOpenBook] = useState<Book | null>(null);

  if (!ready) {
    return <PhoneFrame><Screen><div /></Screen></PhoneFrame>;
  }

  const view = state.user.progressView;
  const total = totalChaptersRead(state);
  const otRead = sumChaptersByTestament(state, "OT");
  const ntRead = sumChaptersByTestament(state, "NT");

  return (
    <PhoneFrame>
      <Screen>
        <div className="px-7 pt-14 pb-10">
          {/* Header + view toggle */}
          <div className="flex items-center justify-between">
            <SmallCaps>Your Progress</SmallCaps>
            <div className="flex items-center gap-4">
              {(["simple", "detailed"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setProgressView(v)}
                  className="font-ui uppercase tracking-[0.16em]"
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: view === v ? "var(--color-gold)" : "var(--color-ink-muted)",
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Three hero stats */}
          <div className="mt-7 grid grid-cols-3 gap-3">
            <BigStat label="Chapters" value={total} />
            <BigStat label="Current Streak" value={state.currentStreak} />
            <BigStat label="Longest Streak" value={state.longestStreak} />
          </div>

          <div className="mt-9"><Rule /></div>

          {/* Year heatmap */}
          <Section title="The Last Year">
            <div className="overflow-x-auto -mx-1 px-1">
              <Heatmap weeks={52} cell={9} gap={2} />
            </div>
          </Section>

          <Rule />

          {/* Bible map */}
          <Section title="The Bible">
            <div className="grid grid-cols-6 gap-1.5">
              {BOOKS.map((b) => {
                const tier = bookTier(state, b.id);
                const bp = state.bookProgress[b.id];
                const partial = bp && bp.readThroughs === 0
                  ? bp.inProgressChapters.length / b.chapters
                  : 0;
                const showSilverGold = state.silverGoldUnlocked || tier === "green" || tier === "in_progress" || tier === "none";
                const effectiveTier = showSilverGold
                  ? tier
                  : tier === "silver" || tier === "gold"
                    ? "green"
                    : tier;
                const fill = TIER_FILL[effectiveTier];
                const showLabelLight = effectiveTier === "green" || effectiveTier === "silver";
                return (
                  <button
                    key={b.id}
                    onClick={() => setOpenBook(b)}
                    className="aspect-square relative overflow-hidden"
                    style={{
                      background: fill,
                      border:
                        effectiveTier === "in_progress"
                          ? "1px solid var(--color-ink)"
                          : effectiveTier === "none"
                            ? "1px solid var(--color-rule)"
                            : "none",
                    }}
                    title={b.name}
                  >
                    {effectiveTier === "in_progress" && (
                      <div
                        className="absolute bottom-0 left-0 right-0"
                        style={{ height: `${partial * 100}%`, background: "var(--color-gold)", opacity: 0.6 }}
                      />
                    )}
                    <span
                      className="absolute inset-0 flex items-center justify-center font-ui uppercase tracking-wider"
                      style={{
                        fontSize: 9,
                        fontWeight: 500,
                        color: showLabelLight
                          ? "var(--color-paper)"
                          : effectiveTier === "gold"
                            ? "var(--color-ink)"
                            : "var(--color-ink-muted)",
                      }}
                    >
                      {b.name.slice(0, 3)}
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Rule />

          {/* Testaments */}
          <Section title="Testaments">
            <div className="space-y-6">
              <div>
                <SmallCaps>Old Testament</SmallCaps>
                <div className="mt-3"><HairlineProgress value={otRead} max={OT_CHAPTERS} /></div>
              </div>
              <div>
                <SmallCaps>New Testament</SmallCaps>
                <div className="mt-3"><HairlineProgress value={ntRead} max={NT_CHAPTERS} /></div>
              </div>
            </div>
          </Section>

          {view === "detailed" && (
            <>
              <Rule />
              <Section title="By Genre">
                <GenreBars state={state} />
              </Section>
              <Rule />
              <Section title="Chapters Per Week · Last 12 Weeks">
                <PaceChart state={state} />
              </Section>
              <Rule />
              <Section title="At Your Current Pace">
                <PaceETA state={state} />
              </Section>
            </>
          )}

          {/* Advanced analytics link */}
          <div className="mt-12 text-center">
            <Link
              to="/analytics"
              className="font-ui uppercase tracking-[0.18em] text-[12px] text-[color:var(--color-ink)] hover:text-[color:var(--color-gold)]"
              style={{ fontWeight: 500 }}
            >
              See Advanced Analytics →
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {openBook && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenBook(null)}
              className="absolute inset-0 z-50 flex items-end"
              style={{ background: "rgba(28, 25, 21, 0.4)" }}
            >
              <motion.div
                initial={{ y: 60 }}
                animate={{ y: 0 }}
                exit={{ y: 60 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-7 pt-7 pb-10 max-h-[75%] overflow-y-auto"
                style={{
                  background: "var(--color-paper)",
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  borderTop: "1px solid var(--color-rule)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <SmallCaps>
                      {openBook.testament === "OT" ? "Old Testament" : "New Testament"} · {openBook.genre}
                    </SmallCaps>
                    <h2
                      className="mt-2 font-display text-[color:var(--color-ink)]"
                      style={{ fontSize: 32, fontWeight: 400 }}
                    >
                      {openBook.name}
                    </h2>
                  </div>
                  <button onClick={() => setOpenBook(null)} className="p-2 -m-2 text-[color:var(--color-ink-muted)]">
                    <X size={20} />
                  </button>
                </div>
                <p className="mt-2 font-ui text-[12px] uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)]">
                  {(state.bookProgress[openBook.id]?.inProgressChapters.length ?? 0)} of {openBook.chapters} chapters
                  {state.bookProgress[openBook.id]?.readThroughs
                    ? ` · ${state.bookProgress[openBook.id].readThroughs}× through`
                    : ""}
                </p>
                {!hasQuiz(openBook.id) && (
                  <div
                    className="mt-4 inline-flex items-center gap-2 px-3 py-1.5"
                    style={{
                      background: "var(--color-paper-light)",
                      border: "1px solid var(--color-gold)",
                      borderRadius: 999,
                    }}
                  >
                    <span
                      style={{
                        width: 6, height: 6, borderRadius: 999,
                        background: "var(--color-gold)",
                      }}
                    />
                    <SmallCaps tone="gold">Quiz Coming Soon</SmallCaps>
                  </div>
                )}
                <div className="mt-6 grid grid-cols-8 gap-1.5">
                  {Array.from({ length: openBook.chapters }, (_, i) => {
                    const ch = i + 1;
                    const done =
                      (state.bookProgress[openBook.id]?.inProgressChapters ?? []).includes(ch) ||
                      (state.bookProgress[openBook.id]?.readThroughs ?? 0) > 0;
                    return (
                      <button
                        key={ch}
                        onClick={() => {
                          setReadOverride(openBook.id, ch);
                          navigate({ to: "/read" });
                        }}
                        className="aspect-square flex items-center justify-center font-ui tabular transition-opacity hover:opacity-70"
                        style={{
                          fontSize: 10,
                          background: done ? "var(--color-gold)" : "transparent",
                          border: done ? "none" : "1px solid var(--color-rule)",
                          color: done ? "var(--color-ink)" : "var(--color-ink-muted)",
                        }}
                        title={`Read ${openBook.name} ${ch}`}
                      >
                        {ch}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Screen>
    </PhoneFrame>
  );
}

function sumChaptersByTestament(state: ReturnType<typeof useAppState>, t: "OT" | "NT"): number {
  let s = 0;
  for (const [bid, bp] of Object.entries(state.bookProgress)) {
    const book = bookById(bid);
    if (!book || book.testament !== t) continue;
    s += bp.readThroughs * book.chapters + bp.inProgressChapters.length;
  }
  return s;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-9 mb-9">
      <SmallCaps as="div" className="mb-5">{title}</SmallCaps>
      {children}
    </div>
  );
}

function BigStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-left">
      <p
        className="font-display tabular"
        style={{ fontSize: 36, color: "var(--color-ink)", fontWeight: 400, lineHeight: 1 }}
      >
        {value}
      </p>
      <p className="mt-3"><SmallCaps>{label}</SmallCaps></p>
    </div>
  );
}

function GenreBars({ state }: { state: ReturnType<typeof useAppState> }) {
  const map: Record<Genre, number> = { Law: 0, History: 0, Poetry: 0, Prophecy: 0, Gospels: 0, Epistles: 0 };
  for (const [bid, bp] of Object.entries(state.bookProgress)) {
    const book = bookById(bid);
    if (!book) continue;
    map[book.genre] += bp.readThroughs * book.chapters + bp.inProgressChapters.length;
  }
  const max = Math.max(...Object.values(map), 1);
  return (
    <div className="space-y-3">
      {(Object.entries(map) as [Genre, number][]).map(([genre, count]) => (
        <div key={genre} className="flex items-center gap-3">
          <span className="font-ui uppercase tracking-[0.14em] text-[11px] text-[color:var(--color-ink-muted)] w-20">
            {genre}
          </span>
          <div className="flex-1" style={{ height: 2, background: "var(--color-rule)" }}>
            <div
              style={{
                height: 2,
                background: "var(--color-gold)",
                width: `${(count / max) * 100}%`,
              }}
            />
          </div>
          <span className="font-ui tabular text-[11px] text-[color:var(--color-ink)] w-8 text-right">{count}</span>
        </div>
      ))}
    </div>
  );
}

function PaceChart({ state }: { state: ReturnType<typeof useAppState> }) {
  const buckets: number[] = [];
  const today = new Date();
  for (let w = 11; w >= 0; w--) {
    let total = 0;
    for (let d = 0; d < 7; d++) {
      const day = new Date(today);
      day.setDate(today.getDate() - (w * 7 + d));
      const key = day.toISOString().slice(0, 10);
      total += state.dailyCounts[key] ?? 0;
    }
    buckets.push(total);
  }
  const max = Math.max(...buckets, 1);
  const w = 320, h = 90, pad = 6;
  const points = buckets.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / (buckets.length - 1);
    const y = h - pad - (v / max) * (h - pad * 2);
    return [x, y] as const;
  });
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 90 }}>
        <path d={path} stroke="var(--color-gold)" strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.5" fill="var(--color-gold)" />
        ))}
      </svg>
      <div className="flex justify-between mt-2 font-ui text-[10px] uppercase tracking-[0.14em] tabular text-[color:var(--color-ink-muted)]">
        <span>12 wks ago</span>
        <span>This week · {buckets[buckets.length - 1]}</span>
      </div>
    </div>
  );
}

import { GOSPEL_IDS, NT_IDS, chaptersRemainingIn, effectivePace } from "@/lib/pace";

function PaceETA({ state }: { state: ReturnType<typeof useAppState> }) {
  const pathBook = bookById(state.user.pathBookId);
  const effective = effectivePace(state);

  const rows: { label: string; remaining: number }[] = [];
  if (pathBook) {
    rows.push({
      label: pathBook.name,
      remaining: chaptersRemainingIn(state, [pathBook.id]),
    });
  }
  rows.push({ label: "The Gospels", remaining: chaptersRemainingIn(state, GOSPEL_IDS) });
  rows.push({ label: "The New Testament", remaining: chaptersRemainingIn(state, NT_IDS) });

  return (
    <>
      <ul className="space-y-3 font-body text-[color:var(--color-ink)]" style={{ fontSize: 15 }}>
        {rows.map((r) => {
          const days = r.remaining === 0 ? 0 : Math.ceil(r.remaining / effective);
          return (
            <li key={r.label} className="flex justify-between">
              <span>{r.label}</span>
              <span className="tabular text-[color:var(--color-ink-muted)]">
                {r.remaining === 0 ? "Complete" : `${days} ${days === 1 ? "day" : "days"}`}
              </span>
            </li>
          );
        })}
      </ul>
      <p
        className="mt-4 font-body italic text-[color:var(--color-ink-muted)]"
        style={{ fontSize: 12 }}
      >
        Based on {effective.toFixed(1)} chapters/day.
      </p>
    </>
  );
}
