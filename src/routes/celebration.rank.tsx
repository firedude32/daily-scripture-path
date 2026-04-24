import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { useAppState, clearPendingRankUp } from "@/state/store";
import { RANKS } from "@/data/ranks";

export const Route = createFileRoute("/celebration/rank")({
  head: () => ({
    meta: [
      { title: "New rank" },
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

  function done() {
    clearPendingRankUp();
    navigate({ to: "/" });
  }

  return (
    <PhoneFrame>
      <Screen noTabs>
        <div className="h-full flex flex-col items-center justify-center px-8 text-center bg-background">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs uppercase tracking-[0.4em] text-muted-foreground"
          >
            New rank
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7, ease: "backOut" }}
            className="mt-6 rounded-full flex items-center justify-center"
            style={{ width: 100, height: 100, background: "var(--color-secondary)" }}
          >
            <span className="font-serif text-4xl text-primary">{rank.name[0]}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="mt-8 font-serif text-4xl text-foreground"
          >
            {rank.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-4 text-base text-muted-foreground max-w-xs"
          >
            {rank.blurb}
          </motion.p>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            onClick={done}
            className="mt-16 w-full max-w-xs rounded-2xl bg-primary text-primary-foreground py-5 font-semibold"
          >
            Continue
          </motion.button>
        </div>
      </Screen>
    </PhoneFrame>
  );
}
