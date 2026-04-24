import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Screen } from "@/components/Screen";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Heatmap } from "@/components/Heatmap";
import { GoldMotif, dailyMotif } from "@/components/GoldMotif";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { Rule } from "@/components/ui-lectio/Rule";
import {
  useAppState,
  useClientReady,
  nextChapterFor,
  chaptersReadToday,
} from "@/state/store";
import { bookById } from "@/data/books";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today — Lectio" },
      { name: "description", content: "Your streak, your next chapter, today's reading." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const ready = useClientReady();
  const state = useAppState();

  useEffect(() => {
    if (ready && !state.onboarded) navigate({ to: "/onboarding" });
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
  const today = new Date();
  const dateLabel = today
    .toLocaleDateString("en-US", { month: "long", day: "numeric" })
    .toUpperCase();

  return (
    <PhoneFrame>
      <Screen>
        <div className="px-7 pt-14 pb-10">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <SmallCaps>Today · {dateLabel}</SmallCaps>
            <GoldMotif name={dailyMotif(today)} size={44} />
          </div>

          {/* Hero streak */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 text-center"
          >
            {state.currentStreak > 0 ? (
              <>
                <div
                  className="font-display tabular leading-none"
                  style={{
                    fontSize: 96,
                    color: "var(--color-gold)",
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {state.currentStreak}
                </div>
                <div className="mt-3">
                  <SmallCaps tone="ink">Day Streak</SmallCaps>
                </div>
              </>
            ) : (
              <>
                <div
                  className="font-display tabular leading-none"
                  style={{ fontSize: 96, color: "var(--color-ink)", fontWeight: 300 }}
                >
                  0
                </div>
                <div className="mt-3">
                  <SmallCaps tone="ink">Start your streak today</SmallCaps>
                </div>
              </>
            )}
          </motion.div>

          {/* Status */}
          <p
            className="mt-10 text-center font-body text-[color:var(--color-ink-soft)]"
            style={{ fontSize: 17, lineHeight: 1.5 }}
          >
            {goalHit
              ? `${readToday} chapters read today.`
              : readToday > 0
                ? `${readToday} of ${state.user.dailyGoal} chapters today.`
                : "Pick up where you left off."}
          </p>

          {/* CTA */}
          <div className="mt-7">
            {goalHit ? (
              <EditorialButton
                variant="secondary"
                onClick={() => navigate({ to: "/read" })}
              >
                Read More
              </EditorialButton>
            ) : (
              <EditorialButton
                variant="gold"
                onClick={() => navigate({ to: "/read" })}
              >
                Start Today's Reading
              </EditorialButton>
            )}
          </div>

          {/* Up next */}
          <div className="mt-5 text-center">
            <SmallCaps>
              Up Next · {nextBook.name} {next.chapter}
            </SmallCaps>
          </div>

          {/* Divider */}
          <div className="mt-10">
            <Rule />
          </div>

          {/* Heatmap */}
          <div className="mt-7">
            <div className="flex items-baseline justify-between mb-4">
              <SmallCaps>The Last Thirteen Weeks</SmallCaps>
              <span className="font-ui text-[11px] tabular text-[color:var(--color-ink-muted)] tracking-wider">
                Longest · {state.longestStreak}
              </span>
            </div>
            <div className="overflow-x-auto -mx-1 px-1">
              <Heatmap weeks={13} cell={14} gap={2} />
            </div>
          </div>
        </div>
      </Screen>
    </PhoneFrame>
  );
}
