import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, Share2, Copy, Twitter, MessageCircle } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { bookById } from "@/data/books";
import { useAppState, clearPendingCelebration, clearPendingRankUp } from "@/state/store";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { Rule } from "@/components/ui-lectio/Rule";
import { BottomSheet } from "@/components/ui-lectio/BottomSheet";
import { staggerUp } from "@/lib/motion";

export const Route = createFileRoute("/_authenticated/summary")({
  head: () => ({
    meta: [
      { title: "Session complete — Lectio" },
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

const HEADLINES = [
  "Nicely done.",
  "One chapter closer.",
  "Steady work.",
  "That counts.",
];

const NUMBER_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
  "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty", "Twenty-One",
  "Twenty-Two", "Twenty-Three", "Twenty-Four", "Twenty-Five", "Twenty-Six",
  "Twenty-Seven", "Twenty-Eight", "Twenty-Nine", "Thirty",
];

function SummaryPage() {
  const navigate = useNavigate();
  const state = useAppState();
  const [data, setData] = useState<SummaryData | null>(null);
  const [headline] = useState(() => HEADLINES[Math.floor(Math.random() * HEADLINES.length)]);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("brt:summary");
    if (!raw) {
      navigate({ to: "/" });
      return;
    }
    setData(JSON.parse(raw) as SummaryData);
  }, [navigate]);

  if (!data) {
    return (
      <PhoneFrame>
        <Screen noTabs>
          <div />
        </Screen>
      </PhoneFrame>
    );
  }

  const book = bookById(data.bookId)!;
  const bp = state.bookProgress[data.bookId];
  const chaptersIn = bp
    ? bp.readThroughs > 0
      ? book.chapters
      : bp.inProgressChapters.length
    : 0;
  const progressPct = Math.min(100, (chaptersIn / book.chapters) * 100);

  const min = Math.floor(data.durationSec / 60);
  const sec = data.durationSec % 60;
  const nextChapter = data.chapter + 1 <= book.chapters ? data.chapter + 1 : 1;

  function done() {
    sessionStorage.removeItem("brt:summary");
    sessionStorage.removeItem("brt:lastSession");
    if (state.pendingCelebration) navigate({ to: "/celebration/book" });
    else if (state.pendingRankUp) navigate({ to: "/celebration/rank" });
    else navigate({ to: "/" });
    if (!state.pendingCelebration) clearPendingCelebration();
    if (!state.pendingRankUp) clearPendingRankUp();
  }

  return (
    <PhoneFrame>
      <Screen noTabs>
        <div className="h-full flex flex-col px-7 pt-12 pb-10">
          <div className="flex justify-between items-center">
            <SmallCaps tone="gold">
              Chapter {NUMBER_WORDS[data.chapter] ?? data.chapter} · Complete
            </SmallCaps>
            <button
              onClick={() => setShareOpen(true)}
              className="p-2 -mr-2 text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)] transition-colors"
              aria-label="Share"
            >
              <Share2 size={18} />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6"
            >
              <Check size={56} strokeWidth={1.5} color="var(--color-gold)" />
            </motion.div>

            <motion.h1
              {...staggerUp(2)}
              className="mt-6 font-display"
              style={{ fontSize: 40, fontWeight: 400, color: "var(--color-ink)", lineHeight: 1.1 }}
            >
              {headline}
            </motion.h1>
            <motion.p
              {...staggerUp(3)}
              className="mt-3 font-body italic text-[color:var(--color-ink-soft)]"
              style={{ fontSize: 16 }}
            >
              Tomorrow, chapter {NUMBER_WORDS[nextChapter]?.toLowerCase() ?? nextChapter}.
            </motion.p>

            <motion.div {...staggerUp(4)} className="mt-9 w-full">
              <Rule />
            </motion.div>

            <motion.div {...staggerUp(5)} className="mt-6 w-full max-w-xs space-y-4">
              <StatRow label="Time Read" value={`${min} min ${sec.toString().padStart(2, "0")} sec`} />
              <StatRow label="Chapter" value={`${book.name} ${data.chapter}`} />
              <StatRow
                label="Streak"
                value={`${data.result.streak} ${data.result.streak === 1 ? "day" : "days"} — extended`}
              />
              <StatRow
                label="Book Progress"
                value={`${chaptersIn} of ${book.chapters} chapters`}
              />
            </motion.div>

            {/* Hairline gold progress fill */}
            <motion.div {...staggerUp(7)} className="mt-9 w-full max-w-xs">
              <div className="flex items-baseline justify-between mb-3">
                <span
                  className="font-display text-[color:var(--color-ink)]"
                  style={{ fontSize: 18, fontWeight: 400 }}
                >
                  {book.name}
                </span>
                <span className="font-ui text-[11px] tabular text-[color:var(--color-ink-muted)] tracking-wider">
                  {chaptersIn} / {book.chapters}
                </span>
              </div>
              <div style={{ height: 2, background: "var(--color-rule)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: 2, background: "var(--color-gold)" }}
                />
              </div>
            </motion.div>
          </div>

          <motion.div {...staggerUp(9)}>
            <EditorialButton variant="primary" onClick={done}>
              Done
            </EditorialButton>
          </motion.div>
        </div>

        <BottomSheet
          open={shareOpen}
          onClose={() => { setShareOpen(false); setCopied(false); }}
          eyebrow="Quietly"
          title="Share this milestone"
        >
          <p className="font-body text-[color:var(--color-ink-soft)]" style={{ fontSize: 15, lineHeight: 1.55 }}>
            A short note about today's reading — no scores, no quiz answers.
          </p>
          <div
            className="mt-5 p-5 border font-body text-[color:var(--color-ink)]"
            style={{ background: "var(--color-paper-light)", borderColor: "var(--color-rule)", fontSize: 14, lineHeight: 1.55 }}
          >
            {`Read ${book.name} ${data.chapter} today. Day ${data.result.streak} of the streak. — Lectio`}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <ShareBtn
              icon={<Copy size={16} />}
              label={copied ? "Copied" : "Copy"}
              onClick={async () => {
                const text = `Read ${book.name} ${data.chapter} today. Day ${data.result.streak} of the streak. — Lectio`;
                try {
                  await navigator.clipboard?.writeText(text);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                } catch {
                  setCopied(false);
                }
              }}
            />
            <ShareBtn
              icon={<MessageCircle size={16} />}
              label="Message"
              onClick={() => setShareOpen(false)}
            />
            <ShareBtn
              icon={<Twitter size={16} />}
              label="Post"
              onClick={() => setShareOpen(false)}
            />
          </div>
          <div className="mt-7">
            <EditorialButton variant="secondary" onClick={() => setShareOpen(false)}>
              Close
            </EditorialButton>
          </div>
        </BottomSheet>
      </Screen>
    </PhoneFrame>
  );
}

function ShareBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 py-4 rounded-[12px] border hover:bg-[color:var(--color-paper-light)] transition-colors"
      style={{ borderColor: "var(--color-rule)", color: "var(--color-ink)" }}
    >
      {icon}
      <span className="font-ui uppercase tracking-[0.14em] text-[10px] font-medium">{label}</span>
    </button>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-left">
      <SmallCaps>{label}</SmallCaps>
      <span
        className="font-display text-[color:var(--color-ink)] tabular text-right"
        style={{ fontSize: 17, fontWeight: 400 }}
      >
        {value}
      </span>
    </div>
  );
}
