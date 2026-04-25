import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { useAppState, useClientReady, nextChapterFor, recordSession } from "@/state/store";
import { bookById } from "@/data/books";
import { hasQuiz } from "@/data/quiz";
import { breath } from "@/lib/motion";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { getReadOverride, clearReadOverride } from "@/lib/readOverride";

export const Route = createFileRoute("/_authenticated/read")({
  head: () => ({
    meta: [
      { title: "Reading — Lectio" },
      { name: "description", content: "A focused reading session." },
    ],
  }),
  component: ReadPage,
});

const NUMBER_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
  "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty", "Twenty-One",
  "Twenty-Two", "Twenty-Three", "Twenty-Four", "Twenty-Five", "Twenty-Six",
  "Twenty-Seven", "Twenty-Eight", "Twenty-Nine", "Thirty",
];

function chapterWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

function ReadPage() {
  const navigate = useNavigate();
  const ready = useClientReady();
  const state = useAppState();
  const [seconds, setSeconds] = useState(0);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Resolve target chapter once on mount: explicit override (from picker) wins,
  // otherwise fall back to the path's recommended next chapter.
  // NOTE: This must run unconditionally before any early return so the hook
  // order stays stable across renders.
  const next = useMemo(() => {
    const override = getReadOverride();
    if (override) return { bookId: override.bookId, chapter: override.chapter };
    return nextChapterFor(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) {
    return (
      <PhoneFrame>
        <Screen noTabs>
          <div />
        </Screen>
      </PhoneFrame>
    );
  }

  const book = bookById(next.bookId)!;
  const quizAvailable = hasQuiz(next.bookId, next.chapter);
  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");

  function finish() {
    if (quizAvailable) {
      sessionStorage.setItem(
        "brt:lastSession",
        JSON.stringify({
          bookId: next.bookId,
          chapter: next.chapter,
          durationSec: seconds,
        }),
      );
      clearReadOverride();
      navigate({ to: "/quiz" });
      return;
    }
    // No quiz yet for this book — record the session and head home.
    recordSession(next.bookId, next.chapter, seconds);
    clearReadOverride();
    navigate({ to: "/" });
  }

  return (
    <PhoneFrame>
      <Screen noTabs>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="h-full flex flex-col px-7 pt-12 pb-10"
        >
          {/* Cancel */}
          <button
            onClick={() => setConfirming(true)}
            className="self-start font-ui uppercase tracking-[0.14em] text-[11px] text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)] py-1"
          >
            Cancel
          </button>

          {/* Title */}
          <div className="mt-8 text-center">
            <SmallCaps>Chapter {chapterWord(next.chapter)}</SmallCaps>
            <h1
              className="mt-3 font-display"
              style={{
                fontSize: 56,
                color: "var(--color-gold)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {book.name} {next.chapter}
            </h1>
          </div>

          {!quizAvailable && (
            <div
              className="mt-6 mx-auto text-center px-4 py-3"
              style={{
                maxWidth: 320,
                background: "var(--color-paper-light)",
                border: "1px solid var(--color-rule)",
                borderRadius: 10,
              }}
            >
              <SmallCaps tone="gold">Quiz Coming Soon</SmallCaps>
              <p
                className="mt-2 font-body italic text-[color:var(--color-ink-soft)]"
                style={{ fontSize: 13, lineHeight: 1.45 }}
              >
                Hand-crafted questions for {book.name} are on the way. Your reading still counts.
              </p>
            </div>
          )}

          {/* Timer + breathing dot */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div
              className="font-display tabular text-[color:var(--color-ink)]"
              style={{ fontSize: 88, fontWeight: 300, letterSpacing: "-0.01em" }}
            >
              {mm}:{ss}
            </div>
            <motion.div
              {...breath}
              className="mt-10"
              style={{
                width: 10,
                height: 10,
                borderRadius: "9999px",
                background: "var(--color-gold)",
              }}
            />
          </div>

          {/* Finish */}
          <EditorialButton variant="gold" onClick={finish}>
            {quizAvailable ? "I'm Finished" : "Mark Chapter Complete"}
          </EditorialButton>
        </motion.div>

        {/* Cancel confirm */}
        <AnimatePresence>
          {confirming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-end"
              style={{ background: "rgba(28, 25, 21, 0.4)" }}
              onClick={() => setConfirming(false)}
            >
              <motion.div
                initial={{ y: 60 }}
                animate={{ y: 0 }}
                exit={{ y: 60 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-7 pt-7 pb-10"
                style={{
                  background: "var(--color-paper)",
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  borderTop: "1px solid var(--color-rule)",
                }}
              >
                <h2 className="font-display text-2xl text-[color:var(--color-ink)]">
                  Cancel this session?
                </h2>
                <p className="mt-3 font-body text-[color:var(--color-ink-soft)]">
                  No progress will be saved.
                </p>
                <div className="mt-7 flex gap-3">
                  <EditorialButton variant="secondary" onClick={() => setConfirming(false)}>
                    Keep Reading
                  </EditorialButton>
                  <EditorialButton
                    variant="primary"
                    onClick={() => {
                      clearReadOverride();
                      navigate({ to: "/" });
                    }}
                  >
                    Cancel Session
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
