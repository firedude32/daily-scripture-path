import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { useAppState, clearPendingRankUp } from "@/state/store";
import { RANKS } from "@/data/ranks";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { letterReveal } from "@/lib/motion";

export const Route = createFileRoute("/_authenticated/celebration/rank")({
  head: () => ({
    meta: [
      { title: "New rank — Lectio" },
      { name: "description", content: "Earned with time." },
    ],
  }),
  component: RankCelebration,
});

function RankCelebration() {
  const navigate = useNavigate();
  const state = useAppState();
  const up = state.pendingRankUp;

  useEffect(() => {
    if (!up) navigate({ to: "/" });
  }, [up, navigate]);

  if (!up) return null;
  const rank = RANKS[up.rankIndex];
  const letters = letterReveal(rank.name.toUpperCase());
  const totalDelay = 0.4 + letters.length * 0.06;

  function done() {
    clearPendingRankUp();
    navigate({ to: "/" });
  }

  return (
    <PhoneFrame>
      <Screen noTabs>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="h-full flex flex-col items-center justify-center px-8 text-center"
          style={{ background: "var(--color-paper)" }}
        >
          <SmallCaps>New Rank</SmallCaps>

          <h1
            className="mt-10 font-display"
            style={{
              fontSize: 56,
              color: "var(--color-gold)",
              fontWeight: 300,
              letterSpacing: "0.02em",
              lineHeight: 1,
            }}
          >
            {letters.map((l, i) => (
              <motion.span
                key={i}
                initial={l.initial}
                animate={l.animate}
                transition={l.transition}
                style={{ display: "inline-block" }}
              >
                {l.char}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: totalDelay + 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 w-32"
            style={{ height: 1, background: "var(--color-gold)", transformOrigin: "center" }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: totalDelay + 0.4 }}
            className="mt-7 font-body italic text-[color:var(--color-ink-soft)] max-w-xs"
            style={{ fontSize: 17, lineHeight: 1.5 }}
          >
            {rank.blurb}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: totalDelay + 0.8 }}
            className="mt-16 w-full max-w-xs"
          >
            <EditorialButton variant="primary" onClick={done}>
              Continue
            </EditorialButton>
          </motion.div>
        </motion.div>
      </Screen>
    </PhoneFrame>
  );
}
