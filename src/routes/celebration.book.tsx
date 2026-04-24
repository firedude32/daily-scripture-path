import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { useAppState, clearPendingCelebration, acknowledgeSilverGold } from "@/state/store";
import { bookById } from "@/data/books";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { GoldMotif, bookMotif } from "@/components/GoldMotif";

export const Route = createFileRoute("/celebration/book")({
  head: () => ({
    meta: [
      { title: "Book completed — Lectio" },
      { name: "description", content: "A book completed. Worth noting." },
    ],
  }),
  component: BookCelebration,
});

const TIER_COLOR: Record<string, string> = {
  green: "#4A6B4E",
  silver: "#9A9389",
  gold: "#B8860B",
};

const ENCOURAGEMENT = {
  green: "One book closer.",
  silver: "Twice through. Quiet, real depth.",
  gold: "Three times. The book lives in you.",
};

const TIER_LABEL = {
  green: "First Completion",
  silver: "Second Completion",
  gold: "Third Completion",
};

function BookCelebration() {
  const navigate = useNavigate();
  const state = useAppState();
  const [showHalfBible, setShowHalfBible] = useState(false);
  const cel = state.pendingCelebration;

  useEffect(() => {
    if (!cel) navigate({ to: "/" });
  }, [cel, navigate]);

  if (!cel) return null;
  const book = bookById(cel.bookId)!;
  const tierColor = TIER_COLOR[cel.tier];

  function done() {
    if (!cel) return;
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

  return (
    <PhoneFrame>
      <Screen noTabs>
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: "var(--color-paper)" }}
        >
          {/* Soft tier-colored gradient wash */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            transition={{ duration: 1.2 }}
            style={{
              background: `radial-gradient(ellipse at 50% 35%, ${tierColor}, transparent 65%)`,
            }}
          />

          <div className="relative h-full flex flex-col items-center justify-center px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <GoldMotif name={bookMotif(cel.bookId)} size={88} strokeWidth={1} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="mt-8 font-display"
              style={{ fontSize: 64, lineHeight: 1, color: "var(--color-ink)", fontWeight: 300, letterSpacing: "-0.02em" }}
            >
              {book.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="mt-5"
            >
              <SmallCaps tone="gold">Complete</SmallCaps>
            </motion.div>

            {/* Tier fill from center outward */}
            <div className="mt-12 w-48 relative" style={{ height: 2, background: "var(--color-rule)" }}>
              <motion.div
                initial={{ width: 0, left: "50%" }}
                animate={{ width: "100%", left: "0%" }}
                transition={{ delay: 1.2, duration: 1.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-y-0"
                style={{ background: tierColor }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4 }}
              className="mt-12"
            >
              <p className="font-ui uppercase text-[11px] tracking-[0.18em] tabular text-[color:var(--color-ink-muted)]">
                {book.chapters} Chapters · {cel.days} Days
              </p>
              <p className="mt-2">
                <SmallCaps tone="ink">{TIER_LABEL[cel.tier]}</SmallCaps>
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.7 }}
              className="mt-8 font-body italic text-[color:var(--color-ink-soft)]"
              style={{ fontSize: 17 }}
            >
              {ENCOURAGEMENT[cel.tier]}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.0 }}
            className="absolute bottom-0 left-0 right-0 px-7 pb-10"
          >
            <EditorialButton variant="primary" onClick={done}>
              Continue
            </EditorialButton>
          </motion.div>
        </motion.div>

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
