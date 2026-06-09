import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { UserPlus, X } from "lucide-react";
import { Screen } from "@/components/Screen";
import { PhoneFrame } from "@/components/PhoneFrame";
import { CalendarHeatmap } from "@/components/CalendarHeatmap";
import { GoldMotif, dailyMotif } from "@/components/GoldMotif";

import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { TodaysNote } from "@/components/TodaysNote";
import { FriendActivity } from "@/components/FriendActivity";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { Rule } from "@/components/ui-lectio/Rule";
import { ChapterPickerSheet } from "@/components/ChapterPickerSheet";
import { setReadOverride, clearReadOverride } from "@/lib/readOverride";
import {
  useAppState,
  useClientReady,
  nextChapterFor,
  chaptersReadToday,
  acknowledgeSilverGold,
  dateKey,
} from "@/state/store";
import { bookById } from "@/data/books";
import {
  claimRefForUser,
  getUnclaimedReferrer,
  markReferrerClaimed,
  getPendingJoin,
  clearPendingJoin,
  type ReferrerInfo,
} from "@/lib/invites";
import { joinGroupByCode } from "@/lib/groups";
import { sendFriendRequest } from "@/lib/friends";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/")({
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
  const [pickerOpen, setPickerOpen] = useState(false);
  const [referrer, setReferrer] = useState<ReferrerInfo | null>(null);

  useEffect(() => {
    if (ready && !state.onboarded) navigate({ to: "/onboarding" });
  }, [ready, state.onboarded, navigate]);

  // Claim ref from localStorage (set when they arrived via ?ref=) and surface
  // a one-tap "Add X" card so invited users find their inviter instantly.
  useEffect(() => {
    if (!ready || !state.userId) return;
    let alive = true;
    (async () => {
      await claimRefForUser(state.userId!);
      const pendingCode = getPendingJoin();
      if (pendingCode) {
        const res = await joinGroupByCode(state.userId!, pendingCode);
        clearPendingJoin();
        if (res.ok) {
          toast.success(`Joined "${res.group.name}".`);
        }
      }
      const r = await getUnclaimedReferrer(state.userId!);
      if (alive) setReferrer(r);
    })();
    return () => {
      alive = false;
    };
  }, [ready, state.userId]);


  async function addReferrer() {
    if (!state.userId || !referrer) return;
    const res = await sendFriendRequest(state.userId, referrer.id);
    if (res.ok) {
      toast.success(`Invite sent to ${referrer.name}.`);
    } else {
      toast.error(res.reason);
    }
    await markReferrerClaimed(state.userId);
    setReferrer(null);
  }

  async function dismissReferrer() {
    if (!state.userId) return;
    await markReferrerClaimed(state.userId);
    setReferrer(null);
  }

  function startRecommended() {
    clearReadOverride();
    navigate({ to: "/read" });
  }

  function startChosen(bookId: string, chapter: number) {
    setReadOverride(bookId, chapter);
    setPickerOpen(false);
    navigate({ to: "/read" });
  }

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

          {/* Inviter suggestion — shown once when a user signed up via someone's ref link */}
          <AnimatePresence>
            {referrer && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 flex items-center gap-3 rounded-[12px] px-4 py-3"
                style={{
                  background: "var(--color-paper-soft)",
                  border: "1px solid var(--color-gold)",
                }}
              >
                <UserPlus size={16} strokeWidth={1.5} className="text-[color:var(--color-gold)] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-display text-[color:var(--color-ink)] truncate" style={{ fontSize: 14 }}>
                    {referrer.name} invited you
                  </div>
                  <div className="font-body italic text-[color:var(--color-ink-muted)]" style={{ fontSize: 12 }}>
                    Read alongside them?
                  </div>
                </div>
                <button
                  onClick={addReferrer}
                  className="rounded-[10px] px-3 py-1.5 font-ui uppercase tracking-[0.14em]"
                  style={{
                    background: "var(--color-gold)",
                    color: "var(--color-paper)",
                    fontSize: 10,
                  }}
                >
                  Add
                </button>
                <button
                  onClick={dismissReferrer}
                  aria-label="Dismiss"
                  className="p-1 -m-1 text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]"
                >
                  <X size={14} strokeWidth={1.5} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bread illustration */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 mb-2 flex justify-center"
          >
            <img
              src="/images/bread-illustration.png"
              alt="Bread illustration"
              style={{ width: 220, opacity: 0.9 }}
            />
          </motion.div>

          {/* Balanced stats row */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="mt-11"
          >
            <div className="grid grid-cols-3 gap-3">
              <BalancedStat value={state.currentStreak} label="Day Streak" highlight />
              <BalancedStat value={daysReadInLast(state, 7)} suffix="/7" label="Last 7 Days" />
              <BalancedStat value={daysReadInLast(state, 30)} suffix="/30" label="Last 30 Days" />
            </div>
            <p
              className="mt-5 text-center font-ui uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]"
              style={{ fontSize: 10 }}
            >
              {perfectWeeks(state)} Perfect {perfectWeeks(state) === 1 ? "Week" : "Weeks"} · Lifetime
            </p>
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
              <EditorialButton variant="secondary" onClick={startRecommended}>
                Read More
              </EditorialButton>
            ) : (
              <EditorialButton variant="gold" onClick={startRecommended}>
                Start Today's Reading
              </EditorialButton>
            )}
          </div>

          {/* Up next */}
          <div className="mt-5 text-center">
            <SmallCaps>
              Up Next · {nextBook.name} {next.chapter}
            </SmallCaps>
            <div className="mt-2">
              <button
                onClick={() => setPickerOpen(true)}
                className="font-ui uppercase tracking-[0.16em] text-[11px] text-[color:var(--color-gold)] hover:opacity-80 py-1"
              >
                Choose a Different Chapter
              </button>
            </div>
          </div>

          <ChapterPickerSheet
            open={pickerOpen}
            onClose={() => setPickerOpen(false)}
            onSelect={startChosen}
          />

          {/* Today's Note rotating slot */}
          <div className="mt-11">
            <TodaysNote />
          </div>

          {/* Friend activity (only renders when there are friends) */}
          <FriendActivity />

          {/* Divider */}
          <div className="mt-10">
            <Rule />
          </div>

          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            <div className="flex items-baseline justify-between mb-4">
              <SmallCaps>This Month</SmallCaps>
              <span className="font-ui text-[11px] tabular text-[color:var(--color-ink-muted)] tracking-wider">
                Longest · {state.longestStreak}
              </span>
            </div>
            <CalendarHeatmap months={1} cell={40} showDayNumbers />
          </motion.div>
        </div>

        {/* Half-Bible unlock modal — fires once when 33+ books complete */}
        <AnimatePresence>
          {state.silverGoldUnlocked && !state.silverGoldAcknowledged && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center px-7"
              style={{ background: "rgba(28, 25, 21, 0.55)" }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-sm p-8 text-center"
                style={{
                  background: "var(--color-paper)",
                  border: "1px solid var(--color-gold)",
                  borderRadius: 16,
                }}
              >
                <SmallCaps tone="gold">A Milestone</SmallCaps>
                <h2
                  className="mt-5 font-display text-[color:var(--color-ink)]"
                  style={{ fontSize: 30, fontWeight: 400, lineHeight: 1.15 }}
                >
                  You've completed half the Bible.
                </h2>
                <div className="mt-6 mx-auto w-16"><Rule /></div>
                <p className="mt-6 font-body text-[color:var(--color-ink-soft)]" style={{ fontSize: 15, lineHeight: 1.55 }}>
                  Books you've already finished can now be read again — earning silver
                  on the second pass, gold on the third. A new way to keep going.
                </p>
                <p className="mt-5 font-ui uppercase tracking-[0.16em] text-[11px] text-[color:var(--color-gold)]">
                  A New Way to Keep Going
                </p>
                <div className="mt-8">
                  <EditorialButton variant="gold" onClick={acknowledgeSilverGold}>
                    Continue
                  </EditorialButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Screen>
    </PhoneFrame>
  );
}

function BalancedStat({
  value,
  suffix,
  label,
  highlight = false,
}: {
  value: number;
  suffix?: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className="font-display tabular leading-none"
        style={{
          fontSize: 44,
          color: highlight ? "var(--color-gold)" : "var(--color-ink)",
          fontWeight: 300,
          letterSpacing: "-0.01em",
        }}
      >
        {value}
        {suffix && (
          <span
            className="font-display tabular"
            style={{
              fontSize: 18,
              color: "var(--color-ink-muted)",
              fontWeight: 300,
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      <div className="mt-3">
        <SmallCaps tone="ink">{label}</SmallCaps>
      </div>
    </div>
  );
}

function daysReadInLast(state: ReturnType<typeof useAppState>, days: number): number {
  const today = new Date();
  let count = 0;
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = dateKey(d);
    if ((state.dailyCounts[key] ?? 0) > 0) count++;
  }
  return count;
}

function perfectWeeks(state: ReturnType<typeof useAppState>): number {
  // Count completed ISO weeks (Mon-Sun) where every day has a read.
  const keys = Object.keys(state.dailyCounts).filter((k) => (state.dailyCounts[k] ?? 0) > 0);
  if (keys.length === 0) return 0;
  const readSet = new Set(keys);
  // Find earliest date
  const dates = keys.map((k) => new Date(k)).sort((a, b) => a.getTime() - b.getTime());
  const start = dates[0];
  // Move start back to Monday
  const startDow = (start.getDay() + 6) % 7; // 0=Mon
  start.setDate(start.getDate() - startDow);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let perfect = 0;
  const cursor = new Date(start);
  while (cursor < today) {
    let all = true;
    for (let i = 0; i < 7; i++) {
      const d = new Date(cursor);
      d.setDate(cursor.getDate() + i);
      if (d >= today) { all = false; break; }
      if (!readSet.has(todayKey(d))) { all = false; break; }
    }
    if (all) perfect++;
    cursor.setDate(cursor.getDate() + 7);
  }
  return perfect;
}
