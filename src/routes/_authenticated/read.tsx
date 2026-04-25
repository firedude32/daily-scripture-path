import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { useAppState, useClientReady, nextChapterFor } from "@/state/store";
import { bookById } from "@/data/books";
import { breath } from "@/lib/motion";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";

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

  if (!ready) {
    return (
      <PhoneFrame>
        <Screen noTabs>
          <div />
        </Screen>
      </PhoneFrame>
    );
  }

  const next = nextChapterFor(state);
  const book = bookById(next.bookId)!;
  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");

  function finish() {
    sessionStorage.setItem(
      "brt:lastSession",
      JSON.stringify({
        bookId: next.bookId,
        chapter: next.chapter,
        durationSec: seconds,
      }),
    );
    navigate({ to: "/quiz" });
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
            I'm Finished
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
                  <EditorialButton variant="primary" onClick={() => navigate({ to: "/" })}>
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
