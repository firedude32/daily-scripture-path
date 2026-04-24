import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, Share2 } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { bookById } from "@/data/books";
import { useAppState, clearPendingCelebration, clearPendingRankUp } from "@/state/store";

export const Route = createFileRoute("/summary")({
  head: () => ({
    meta: [
      { title: "Session complete — Bible Reading Habit Tracker" },
      { name: "description", content: "A summary of your reading session." },
    ],
  }),
  component: SummaryPage,
});

interface SummaryData {
  bookId: string;
  chapter: number;
  durationSec: number;
  result: {
    streak: number;
    xpEarned: number;
    bookCompleted: null | { bookId: string; tier: "green" | "silver" | "gold" };
    rankUp: null | { rankIndex: number };
  };
}

const HEADLINES = ["Nicely done.", "One chapter closer.", "That counts.", "Steady work."];

function SummaryPage() {
  const navigate = useNavigate();
  const state = useAppState();
  const [data, setData] = useState<SummaryData | null>(null);
  const [headline] = useState(() => HEADLINES[Math.floor(Math.random() * HEADLINES.length)]);

  useEffect(() => {
    const raw = sessionStorage.getItem("brt:summary");
    if (!raw) {
      navigate({ to: "/" });
      return;
    }
    setData(JSON.parse(raw) as SummaryData);
  }, [navigate]);

  if (!data) return <PhoneFrame><Screen noTabs><div /></Screen></PhoneFrame>;

  const book = bookById(data.bookId)!;
  const bp = state.bookProgress[data.bookId];
  const chaptersIn = bp ? (bp.readThroughs > 0 ? book.chapters : bp.inProgressChapters.length) : 0;
  const progressPct = Math.min(100, (chaptersIn / book.chapters) * 100);

  const min = Math.floor(data.durationSec / 60);
  const sec = data.durationSec % 60;

  function done() {
    sessionStorage.removeItem("brt:summary");
    sessionStorage.removeItem("brt:lastSession");
    if (state.pendingCelebration) {
      navigate({ to: "/celebration/book" });
    } else if (state.pendingRankUp) {
      navigate({ to: "/celebration/rank" });
    } else {
      navigate({ to: "/" });
    }
    // clear any stale flags if neither matched
    if (!state.pendingCelebration) clearPendingCelebration();
    if (!state.pendingRankUp) clearPendingRankUp();
  }

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay: i * 0.08, ease: "easeOut" as const },
  });

  return (
    <PhoneFrame>
      <Screen noTabs>
        <div className="h-full flex flex-col px-6 pt-12 pb-10">
          <div className="flex justify-end">
            <button className="p-2 -mr-2 text-muted-foreground" aria-label="Share">
              <Share2 size={20} />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="rounded-full flex items-center justify-center"
              style={{ width: 72, height: 72, background: "var(--color-primary)" }}
            >
              <Check size={36} className="text-primary-foreground" strokeWidth={3} />
            </motion.div>

            <motion.h1 {...stagger(2)} className="mt-6 font-serif text-3xl text-foreground">
              {headline}
            </motion.h1>
            <motion.p {...stagger(3)} className="mt-2 text-sm text-muted-foreground">
              You logged a chapter from <span className="font-serif text-foreground">{book.name}</span>.
            </motion.p>

            <motion.div {...stagger(4)} className="mt-10 grid grid-cols-2 gap-4 w-full max-w-xs">
              <Stat label="Time" value={`${min}m ${sec}s`} />
              <Stat label="Chapter" value={`${book.name} ${data.chapter}`} serif />
              <Stat label="Streak" value={`${data.result.streak} days`} />
              <Stat label="XP earned" value={`+${data.result.xpEarned}`} />
            </motion.div>

            <motion.div {...stagger(6)} className="mt-10 w-full max-w-xs">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span className="font-serif text-foreground">{book.name}</span>
                <span className="tabular">{chaptersIn} of {book.chapters}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                  className="h-full bg-primary"
                />
              </div>
            </motion.div>
          </div>

          <motion.button
            {...stagger(8)}
            whileTap={{ scale: 0.97 }}
            onClick={done}
            className="w-full rounded-2xl bg-primary text-primary-foreground py-5 text-base font-semibold"
          >
            Done
          </motion.button>
        </div>
      </Screen>
    </PhoneFrame>
  );
}

function Stat({ label, value, serif }: { label: string; value: string; serif?: boolean }) {
  return (
    <div className="rounded-xl bg-surface border border-border p-4 text-left">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">{label}</p>
      <p className={`mt-1 text-base text-foreground tabular ${serif ? "font-serif" : ""}`}>{value}</p>
    </div>
  );
}
