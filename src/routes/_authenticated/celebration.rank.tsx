import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { useAppState, clearPendingRankUp, booksCompleted } from "@/state/store";
import { RANKS } from "@/data/ranks";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { shareMilestone, shareCardUrl } from "@/lib/share";

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
  const [sharing, setSharing] = useState(false);
  const up = state.pendingRankUp;

  useEffect(() => {
    if (!up) navigate({ to: "/" });
  }, [up, navigate]);

  if (!up) return null;
  const rank = RANKS[up.rankIndex];

  const params = {
    title: rank.name,
    subtitle: rank.blurb,
    encouragement: rank.blurb,
    streak: state.currentStreak,
    books: booksCompleted(state),
  };
  const cardUrl = shareCardUrl("rank", params, "square");

  function done() {
    clearPendingRankUp();
    navigate({ to: "/" });
  }

  async function onShare() {
    setSharing(true);
    try {
      await shareMilestone("rank", params, "story");
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
            <SmallCaps tone="gold">A New Rank</SmallCaps>
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
                alt={`${rank.name} rank`}
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
      </Screen>
    </PhoneFrame>
  );
}
