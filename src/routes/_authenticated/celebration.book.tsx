import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Share2, Download } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { useAppState, clearPendingCelebration, acknowledgeSilverGold, booksCompleted } from "@/state/store";
import { bookById } from "@/data/books";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { shareMilestone, shareCardUrl } from "@/lib/share";

export const Route = createFileRoute("/_authenticated/celebration/book")({
  head: () => ({
    meta: [
      { title: "Book completed — Lectio" },
      { name: "description", content: "A book completed. Worth noting." },
    ],
  }),
  component: BookCelebration,
});

function BookCelebration() {
  const navigate = useNavigate();
  const state = useAppState();
  const [showHalfBible, setShowHalfBible] = useState(false);
  const [sharing, setSharing] = useState(false);
  const cel = state.pendingCelebration;

  useEffect(() => {
    if (!cel) navigate({ to: "/" });
  }, [cel, navigate]);

  if (!cel) return null;
  const book = bookById(cel.bookId)!;

  const params = {
    title: book.name,
    tier: cel.tier,
    chapters: book.chapters,
    streak: state.currentStreak,
    books: booksCompleted(state),
  };
  const cardUrl = shareCardUrl("book", params, "square");

  function done() {
    clearPendingCelebration();
    if (state.silverGoldUnlocked && !state.silverGoldAcknowledged) {
      setShowHalfBible(true);
      return;
    }
    if (state.pendingRankUp) navigate({ to: "/celebration/rank" });
    else navigate({ to: "/" });
  }

  function dismissHalfBible() {
    acknowledgeSilverGold();
    if (state.pendingRankUp) navigate({ to: "/celebration/rank" });
    else navigate({ to: "/" });
  }

  async function onShare() {
    setSharing(true);
    try {
      await shareMilestone("book", params, "square");
    } finally {
      setSharing(false);
    }
  }

  return (
    <PhoneFrame>
      <Screen noTabs>
        <div
          className="absolute inset-0 flex flex-col px-6 pt-10 pb-8"
          style={{ background: "var(--color-paper)" }}
        >
          <div className="text-center">
            <SmallCaps tone="gold">A Book, Complete</SmallCaps>
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
                aspectRatio: "9 / 16",
                maxHeight: "100%",
                border: "1px solid var(--color-rule)",
                boxShadow: "0 30px 60px -30px rgba(40, 32, 20, 0.25), 0 8px 20px -10px rgba(40, 32, 20, 0.15)",
                background: "var(--color-paper-light)",
              }}
            >
              <img
                src={cardUrl}
                alt={`${book.name} complete`}
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
              onClick={done}
              className="font-ui uppercase tracking-[0.18em] text-[11px] py-2 text-[color:var(--color-ink-muted)]"
            >
              Done
            </button>
          </motion.div>
        </div>

        {showHalfBible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col px-8 pt-20 pb-10 text-center"
            style={{ background: "var(--color-paper)" }}
          >
            <SmallCaps>A New Way to Keep Going</SmallCaps>
            <h1 className="mt-5 font-display text-[color:var(--color-ink)]" style={{ fontSize: 36, fontWeight: 400, lineHeight: 1.15 }}>
              You've completed half the Bible.
            </h1>
            <p className="mt-7 font-body text-[color:var(--color-ink-soft)] leading-relaxed" style={{ fontSize: 16 }}>
              We're unlocking something new. Re-reading a book turns its tile{" "}
              <span style={{ color: "var(--color-tier-silver)", fontWeight: 500 }}>silver</span>, then{" "}
              <span style={{ color: "var(--color-tier-gold)", fontWeight: 500 }}>gold</span>.
            </p>
            <div className="flex-1" />
            <EditorialButton variant="primary" onClick={dismissHalfBible}>
              Continue
            </EditorialButton>
          </motion.div>
        )}
      </Screen>
    </PhoneFrame>
  );
}

// Suppress unused-import warning for Download in case we add it later.
void Download;
