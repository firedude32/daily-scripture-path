import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { Heatmap } from "@/components/Heatmap";
import { useAppState, useClientReady, totalChaptersRead, bookTier } from "@/state/store";
import { BOOKS, NT_CHAPTERS, OT_CHAPTERS, type Book, bookById } from "@/data/books";
import type { Genre } from "@/data/books";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — Bible Reading Habit Tracker" },
      { name: "description", content: "Your reading data, honestly told." },
    ],
  }),
  component: ProgressPage,
});

const TIER_COLOR: Record<string, string> = {
  none: "var(--color-heat-0)",
  in_progress: "color-mix(in oklab, var(--color-tier-green) 35%, var(--color-heat-0))",
  green: "var(--color-tier-green)",
  silver: "var(--color-tier-silver)",
  gold: "var(--color-tier-gold)",
};

function ProgressPage() {
  const ready = useClientReady();
  const state = useAppState();
  const [openBook, setOpenBook] = useState<Book | null>(null);

  if (!ready) return <PhoneFrame><Screen><div /></Screen></PhoneFrame>;

  const total = totalChaptersRead(state);
  const otRead = sumChaptersByTestament(state, "OT");
  const ntRead = sumChaptersByTestament(state, "NT");

  const genreData = computeGenre(state);

  return (
    <PhoneFrame>
      <Screen>
        <div className="px-6 pt-12 pb-8">
          <h1 className="font-serif text-3xl text-foreground">Progress</h1>

          {/* Top stats */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <BigStat label="Chapters" value={total} />
            <BigStat label="Streak" value={state.currentStreak} />
            <BigStat label="Longest" value={state.longestStreak} />
          </div>

          {/* Heatmap */}
          <Section title="Last year">
            <div className="rounded-xl bg-surface border border-border p-4 overflow-x-auto">
              <Heatmap weeks={52} cell={9} gap={2} />
            </div>
          </Section>

          {/* Bible map */}
          <Section title="The Bible">
            <div className="grid grid-cols-6 gap-1.5">
              {BOOKS.map((b) => {
                const tier = bookTier(state, b.id);
                const bp = state.bookProgress[b.id];
                const partial = bp && bp.readThroughs === 0 ? bp.inProgressChapters.length / b.chapters : 1;
                return (
                  <button
                    key={b.id}
                    onClick={() => setOpenBook(b)}
                    className="aspect-square rounded-md relative overflow-hidden border border-border"
                    style={{ background: tier === "in_progress" ? "var(--color-heat-0)" : TIER_COLOR[tier] }}
                    title={b.name}
                  >
                    {tier === "in_progress" && (
                      <div
                        className="absolute bottom-0 left-0 right-0"
                        style={{ height: `${partial * 100}%`, background: "var(--color-tier-green)", opacity: 0.85 }}
                      />
                    )}
                    <span
                      className="absolute inset-0 flex items-center justify-center text-[9px] font-medium"
                      style={{ color: tier === "none" || tier === "in_progress" ? "var(--color-muted-foreground)" : "white" }}
                    >
                      {b.name.slice(0, 3)}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground">
              <Legend color="var(--color-heat-0)" label="None" />
              <Legend color="var(--color-tier-green)" label="Green" />
              {state.silverGoldUnlocked && <Legend color="var(--color-tier-silver)" label="Silver" />}
              {state.silverGoldUnlocked && <Legend color="var(--color-tier-gold)" label="Gold" />}
            </div>
          </Section>

          {/* Testaments */}
          <Section title="Testaments">
            <div className="space-y-4">
              <Bar label="Old Testament" value={otRead} max={OT_CHAPTERS} />
              <Bar label="New Testament" value={ntRead} max={NT_CHAPTERS} />
            </div>
          </Section>

          {/* Genre */}
          <Section title="By genre">
            <div className="rounded-xl bg-surface border border-border p-4 space-y-2">
              {genreData.map(({ genre, count }) => (
                <div key={genre} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20">{genre}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${Math.min(100, (count / Math.max(1, Math.max(...genreData.map((g) => g.count)))) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs tabular text-muted-foreground w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Pace */}
          <Section title="Pace, last 12 weeks">
            <PaceChart state={state} />
          </Section>
        </div>

        <AnimatePresence>
          {openBook && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenBook(null)}
              className="absolute inset-0 z-50 bg-black/40 flex items-end"
            >
              <motion.div
                initial={{ y: 40 }}
                animate={{ y: 0 }}
                exit={{ y: 40 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-surface rounded-t-3xl p-6 pb-8 max-h-[70%] overflow-y-auto"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{openBook.testament === "OT" ? "Old Testament" : "New Testament"} · {openBook.genre}</p>
                    <h2 className="mt-1 font-serif text-2xl text-foreground">{openBook.name}</h2>
                  </div>
                  <button onClick={() => setOpenBook(null)} className="p-2 -m-2 text-muted-foreground"><X size={20} /></button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {(state.bookProgress[openBook.id]?.inProgressChapters.length ?? 0)} of {openBook.chapters} chapters
                  {state.bookProgress[openBook.id]?.readThroughs ? ` · ${state.bookProgress[openBook.id].readThroughs} read-through${state.bookProgress[openBook.id].readThroughs > 1 ? "s" : ""}` : ""}
                </p>
                <div className="mt-5 grid grid-cols-8 gap-1.5">
                  {Array.from({ length: openBook.chapters }, (_, i) => {
                    const ch = i + 1;
                    const done = (state.bookProgress[openBook.id]?.inProgressChapters ?? []).includes(ch) || (state.bookProgress[openBook.id]?.readThroughs ?? 0) > 0;
                    return (
                      <div
                        key={ch}
                        className="aspect-square rounded-sm flex items-center justify-center text-[10px] tabular"
                        style={{
                          background: done ? "var(--color-tier-green)" : "var(--color-heat-0)",
                          color: done ? "white" : "var(--color-muted-foreground)",
                        }}
                      >
                        {ch}
                      </div>
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

function computeGenre(state: ReturnType<typeof useAppState>) {
  const map: Record<Genre, number> = { Law: 0, History: 0, Poetry: 0, Prophecy: 0, Gospels: 0, Epistles: 0 };
  for (const [bid, bp] of Object.entries(state.bookProgress)) {
    const book = bookById(bid);
    if (!book) continue;
    map[book.genre] += bp.readThroughs * book.chapters + bp.inProgressChapters.length;
  }
  return (Object.entries(map) as [Genre, number][]).map(([genre, count]) => ({ genre, count }));
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">{title}</p>
      {children}
    </div>
  );
}

function BigStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-surface border border-border p-3 text-center">
      <p className="font-serif text-2xl text-foreground tabular">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground tabular">{value} / {max}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-primary"
        />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="rounded-sm" style={{ width: 10, height: 10, background: color }} />
      {label}
    </span>
  );
}

function PaceChart({ state }: { state: ReturnType<typeof useAppState> }) {
  // 12 weekly buckets ending today
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
  const w = 280, h = 100, pad = 8;
  const points = buckets.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / (buckets.length - 1);
    const y = h - pad - (v / max) * (h - pad * 2);
    return [x, y] as const;
  });
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <div className="rounded-xl bg-surface border border-border p-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24">
        <path d={`${path} L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`} fill="var(--color-primary)" opacity="0.08" />
        <path d={path} stroke="var(--color-primary)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill="var(--color-primary)" />
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-2 tabular">
        <span>12w ago</span>
        <span>This week: {buckets[buckets.length - 1]}</span>
      </div>
    </div>
  );
}
