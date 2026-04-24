import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { useAppState, useClientReady, nextChapterFor } from "@/state/store";
import { bookById } from "@/data/books";

export const Route = createFileRoute("/read")({
  head: () => ({
    meta: [
      { title: "Reading — Bible Reading Habit Tracker" },
      { name: "description", content: "A focused reading session." },
    ],
  }),
  component: ReadPage,
});

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

  if (!ready) return <PhoneFrame><Screen noTabs><div /></Screen></PhoneFrame>;

  const next = nextChapterFor(state);
  const book = bookById(next.bookId)!;

  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");

  function finish() {
    sessionStorage.setItem("brt:lastSession", JSON.stringify({
      bookId: next.bookId,
      chapter: next.chapter,
      durationSec: seconds,
    }));
    navigate({ to: "/quiz" });
  }

  return (
    <PhoneFrame>
      <Screen noTabs>
        <div className="h-full flex flex-col px-6 pt-10 pb-10">
          {/* Cancel */}
          <button
            onClick={() => setConfirming(true)}
            className="self-start p-2 -ml-2 text-muted-foreground"
            aria-label="Cancel session"
          >
            <X size={22} />
          </button>

          {/* Title */}
          <div className="mt-2 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Reading</p>
            <h1 className="mt-2 font-serif text-4xl text-foreground">
              {book.name} {next.chapter}
            </h1>
          </div>

          {/* Timer + breathing dot */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-full bg-primary"
              style={{ width: 12, height: 12 }}
            />
            <div className="mt-10 font-serif tabular text-foreground" style={{ fontSize: 72, fontWeight: 500 }}>
              {mm}:{ss}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Read at your own pace.</p>
          </div>

          {/* Finish */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={finish}
            className="w-full rounded-2xl bg-primary text-primary-foreground py-5 text-base font-semibold"
          >
            I'm Finished
          </motion.button>
        </div>

        {/* Cancel confirm */}
        <AnimatePresence>
          {confirming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-end bg-black/30"
              onClick={() => setConfirming(false)}
            >
              <motion.div
                initial={{ y: 60 }}
                animate={{ y: 0 }}
                exit={{ y: 60 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-surface rounded-t-3xl p-6 pb-8"
              >
                <h2 className="font-serif text-xl text-foreground">Cancel this session?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  No progress will be saved.
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setConfirming(false)}
                    className="flex-1 rounded-xl border border-border py-3 text-sm font-medium"
                  >
                    Keep reading
                  </button>
                  <button
                    onClick={() => navigate({ to: "/" })}
                    className="flex-1 rounded-xl bg-foreground text-background py-3 text-sm font-medium"
                  >
                    Cancel session
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Screen>
    </PhoneFrame>
  );
}
