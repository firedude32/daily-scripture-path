import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { useAppState, clearPendingCelebration } from "@/state/store";
import { bookById } from "@/data/books";

export const Route = createFileRoute("/celebration/book")({
  head: () => ({
    meta: [
      { title: "Book completed" },
      { name: "description", content: "A book completed. Worth noting." },
    ],
  }),
  component: BookCelebration,
});

const TIER_BG: Record<string, string> = {
  green: "linear-gradient(135deg, oklch(0.5 0.1 150), oklch(0.34 0.05 155))",
  silver: "linear-gradient(135deg, oklch(0.78 0.005 250), oklch(0.55 0.005 250))",
  gold: "linear-gradient(135deg, oklch(0.82 0.13 80), oklch(0.55 0.13 70))",
};

const ENCOURAGEMENT = {
  green: "One book closer.",
  silver: "Twice through. Quiet, real depth.",
  gold: "Three times. The book lives in you.",
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

  function done() {
    if (!cel) return;
    clearPendingCelebration();
    const justUnlocked = state.silverGoldUnlocked && cel.tier === "green";
    // Show educational modal once when crossing 33 books
    const totalCompleted = Object.values(state.bookProgress).filter((b) => b.readThroughs >= 1).length;
    if (justUnlocked && totalCompleted === 33) {
      setShowHalfBible(true);
      return;
    }
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
          transition={{ duration: 0.6 }}
          style={{ background: TIER_BG[cel.tier] }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            style={{
              background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,.15), transparent 50%)",
              backgroundSize: "200% 200%",
            }}
          />

          <div className="relative h-full flex flex-col items-center justify-center px-8 text-center text-white">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs uppercase tracking-[0.4em] opacity-80"
            >
              Completed
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="mt-4 font-serif"
              style={{ fontSize: 56, lineHeight: 1 }}
            >
              {book.name}
            </motion.h1>

            {/* Fill animation */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              transition={{ delay: 0.9, duration: 1.6, ease: "easeOut" }}
              className="mt-12 h-1.5 rounded-full bg-white/90"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
              className="mt-12 text-sm tabular opacity-90"
            >
              {book.chapters} chapters read in {cel.days} days
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.6 }}
              className="mt-6 font-serif text-lg"
            >
              {ENCOURAGEMENT[cel.tier]}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="absolute bottom-0 left-0 right-0 px-6 pb-10"
          >
            <button
              onClick={done}
              className="w-full rounded-2xl bg-white text-foreground py-5 font-semibold"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>

        {showHalfBible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-background flex flex-col px-8 pt-20 pb-10 text-center"
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground">A new chapter</p>
            <h1 className="mt-4 font-serif text-3xl text-foreground">You've completed half the Bible.</h1>
            <p className="mt-6 text-base text-muted-foreground leading-relaxed">
              We're unlocking something new. Re-reading a book turns its tile{" "}
              <span className="font-medium" style={{ color: "var(--color-tier-silver)" }}>silver</span>, then{" "}
              <span className="font-medium" style={{ color: "var(--color-tier-gold)" }}>gold</span>.
            </p>
            <p className="mt-4 text-base text-muted-foreground">A new way to keep going.</p>
            <div className="flex-1" />
            <button
              onClick={() => navigate({ to: "/" })}
              className="w-full rounded-2xl bg-primary text-primary-foreground py-5 font-semibold"
            >
              Continue
            </button>
          </motion.div>
        )}
      </Screen>
    </PhoneFrame>
  );
}
