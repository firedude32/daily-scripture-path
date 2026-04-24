import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { Screen } from "@/components/Screen";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Heatmap } from "@/components/Heatmap";
import { useAppState, useClientReady, nextChapterFor, chaptersReadToday } from "@/state/store";
import { bookById } from "@/data/books";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today — Bible Reading Habit Tracker" },
      { name: "description", content: "Your streak, your next chapter, and today's reading." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const ready = useClientReady();
  const state = useAppState();

  // Redirect to onboarding if first launch
  useEffect(() => {
    if (ready && !state.onboarded) {
      navigate({ to: "/onboarding" });
    }
  }, [ready, state.onboarded, navigate]);

  if (!ready) {
    return (
      <PhoneFrame>
        <Screen>
          <div className="h-full" />
        </Screen>
      </PhoneFrame>
    );
  }

  const next = nextChapterFor(state);
  const nextBook = bookById(next.bookId)!;
  const readToday = chaptersReadToday(state);
  const goalHit = readToday >= state.user.dailyGoal;

  return (
    <PhoneFrame>
      <Screen>
        <div className="px-6 pt-12 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                {new Date().toLocaleDateString(undefined, { weekday: "long" })}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {new Date().toLocaleDateString(undefined, { month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          {/* Hero streak */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-10 text-center"
          >
            {state.currentStreak > 0 ? (
              <>
                <div className="font-serif font-bold text-primary tabular leading-none" style={{ fontSize: 88 }}>
                  {state.currentStreak}
                </div>
                <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
                  day streak
                </p>
              </>
            ) : (
              <p className="text-2xl font-serif text-foreground">Start your streak today.</p>
            )}
          </motion.div>

          {/* Status */}
          <p className="mt-8 text-center text-base text-muted-foreground">
            {goalHit
              ? `${readToday} chapters read today`
              : readToday > 0
                ? `${readToday} of ${state.user.dailyGoal} chapters today`
                : "Pick up where you left off."}
          </p>

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate({ to: "/read" })}
            className="mt-6 w-full rounded-2xl bg-primary text-primary-foreground py-5 text-base font-semibold flex items-center justify-center gap-2 shadow-sm"
          >
            {goalHit ? "Read more" : "Start Reading"}
            <ArrowRight size={18} />
          </motion.button>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Up next: <span className="font-serif text-foreground">{nextBook.name} {next.chapter}</span>
          </p>

          {/* Heatmap */}
          <div className="mt-10">
            <div className="flex items-baseline justify-between mb-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Last 13 weeks
              </p>
              <p className="text-xs text-muted-foreground">
                Longest: <span className="tabular text-foreground">{state.longestStreak}</span>
              </p>
            </div>
            <div className="rounded-xl bg-surface border border-border p-4 overflow-x-auto">
              <Heatmap weeks={13} />
            </div>
          </div>
        </div>
      </Screen>
    </PhoneFrame>
  );
}
