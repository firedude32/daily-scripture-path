import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2 } from "lucide-react";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { useAppState, clearPendingMilestone } from "@/state/store";
import { shareMilestone, shareCardUrl, type ShareKind } from "@/lib/share";

const EYEBROWS: Record<string, string> = {
  streak: "A Streak",
  gospel: "Gospel Complete",
  nt: "New Testament",
  bible: "The Whole Bible",
};

export function MilestoneShareModal() {
  const state = useAppState();
  const m = state.pendingMilestone;
  const [sharing, setSharing] = useState(false);
  console.log("[MilestoneShareModal] render, pendingMilestone =", m);

  if (!m) return null;
  const kind = m.kind as ShareKind;
  const params = {
    title: m.title,
    streak: m.streak ?? state.currentStreak,
    books: m.books,
    chapters: m.chapters,
  };
  const cardUrl = shareCardUrl(kind, params, "square");

  async function onShare() {
    setSharing(true);
    try {
      await shareMilestone(kind, params, "square");
    } finally {
      setSharing(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="milestone-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="absolute inset-0 z-50 flex flex-col px-6 pt-10 pb-8"
        style={{ background: "var(--color-paper)" }}
      >
        <div className="text-center">
          <SmallCaps tone="gold">{EYEBROWS[m.kind] ?? "Quietly"}</SmallCaps>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 flex-1 min-h-0 flex items-center justify-center"
        >
          <div
            className="w-full rounded-[14px] overflow-hidden"
            style={{
              aspectRatio: "1 / 1",
              maxHeight: "100%",
              border: "1px solid var(--color-rule)",
              boxShadow:
                "0 30px 60px -30px rgba(40, 32, 20, 0.25), 0 8px 20px -10px rgba(40, 32, 20, 0.15)",
              background: "var(--color-paper-light)",
            }}
          >
            <img
              src={cardUrl}
              alt="Milestone share card"
              className="w-full h-full block"
              style={{ objectFit: "cover" }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex flex-col gap-3"
        >
          <EditorialButton variant="primary" onClick={onShare} disabled={sharing}>
            <span className="inline-flex items-center justify-center gap-2">
              <Share2 size={15} strokeWidth={1.5} />
              {sharing ? "Preparing…" : "Share"}
            </span>
          </EditorialButton>
          <button
            onClick={clearPendingMilestone}
            className="font-ui uppercase tracking-[0.18em] text-[11px] py-2 text-[color:var(--color-ink-muted)]"
          >
            Done
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
