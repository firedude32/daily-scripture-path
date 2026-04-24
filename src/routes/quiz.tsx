import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { getQuiz, type QuizQuestion } from "@/data/quiz";
import { bookById } from "@/data/books";
import { recordSession } from "@/state/store";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz — Bible Reading Habit Tracker" },
      { name: "description", content: "Five quick questions to verify your reading." },
    ],
  }),
  component: QuizPage,
});

interface PendingSession {
  bookId: string;
  chapter: number;
  durationSec: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function QuizPage() {
  const navigate = useNavigate();
  const [pending, setPending] = useState<PendingSession | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const raw = sessionStorage.getItem("brt:lastSession");
    if (!raw) {
      navigate({ to: "/" });
      return;
    }
    const p = JSON.parse(raw) as PendingSession;
    setPending(p);
    setQuestions(getQuiz(p.bookId, p.chapter));
  }, [navigate]);

  // refresh question order on each attempt
  const shuffledOptions = useMemo(() => {
    if (!questions[idx]) return [];
    const q = questions[idx];
    return shuffle([
      { text: q.correct, correct: true },
      { text: q.wrong[0], correct: false },
      { text: q.wrong[1], correct: false },
      { text: q.wrong[2], correct: false },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, attempt, questions]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  if (!pending || questions.length === 0) {
    return <PhoneFrame><Screen noTabs><div /></Screen></PhoneFrame>;
  }

  const book = bookById(pending.bookId)!;

  function pick(i: number, correct: boolean) {
    if (picked !== null) return;
    setPicked(i);
    setTimeout(() => {
      if (!correct) {
        setWrong(true);
        setCooldown(30);
        return;
      }
      if (idx + 1 >= questions.length) {
        // pass
        const result = recordSession(pending!.bookId, pending!.chapter, pending!.durationSec);
        sessionStorage.setItem("brt:summary", JSON.stringify({
          ...pending,
          result,
        }));
        navigate({ to: "/summary" });
      } else {
        setIdx((i) => i + 1);
        setPicked(null);
      }
    }, 400);
  }

  function retake() {
    setIdx(0);
    setPicked(null);
    setWrong(false);
    setAttempt((a) => a + 1);
  }

  if (wrong) {
    return (
      <PhoneFrame>
        <Screen noTabs>
          <div className="h-full flex flex-col items-center justify-center px-8 text-center">
            <h1 className="font-serif text-3xl text-foreground">Not quite.</h1>
            <p className="mt-4 text-base text-muted-foreground max-w-xs">
              Give it another try. Take a moment with the chapter first.
            </p>
            <div className="mt-12">
              {cooldown > 0 ? (
                <p className="text-sm text-muted-foreground tabular">
                  You can retry in {cooldown}s
                </p>
              ) : (
                <button
                  onClick={retake}
                  className="rounded-2xl bg-primary text-primary-foreground px-8 py-4 text-base font-semibold"
                >
                  Retake quiz
                </button>
              )}
            </div>
          </div>
        </Screen>
      </PhoneFrame>
    );
  }

  const q = questions[idx];

  return (
    <PhoneFrame>
      <Screen noTabs>
        <div className="h-full flex flex-col px-6 pt-10 pb-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-serif">
              {book.name} {pending.chapter}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all"
                  style={{
                    width: i === idx ? 18 : 6,
                    height: 6,
                    background: i < idx ? "var(--color-primary)" : i === idx ? "var(--color-primary)" : "var(--color-border)",
                  }}
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Question {idx + 1} of {questions.length}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={idx + "-" + attempt}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-8"
            >
              <h2 className="font-serif text-xl leading-snug text-foreground">
                {q.q}
              </h2>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex flex-col gap-3 flex-1">
            {shuffledOptions.map((opt, i) => {
              const isPicked = picked === i;
              return (
                <motion.button
                  key={i + "-" + idx + "-" + attempt}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => pick(i, opt.correct)}
                  disabled={picked !== null}
                  className="w-full text-left rounded-2xl border border-border bg-surface p-4 flex items-start gap-3 transition-colors"
                  style={{
                    borderColor: isPicked ? "var(--color-primary)" : undefined,
                    background: isPicked ? "color-mix(in oklab, var(--color-primary) 6%, var(--color-surface))" : undefined,
                  }}
                >
                  <div
                    className="mt-0.5 shrink-0 rounded-full border flex items-center justify-center"
                    style={{
                      width: 22,
                      height: 22,
                      borderColor: isPicked ? "var(--color-primary)" : "var(--color-border)",
                      background: isPicked ? "var(--color-primary)" : "transparent",
                    }}
                  >
                    {isPicked && <Check size={14} className="text-primary-foreground" />}
                  </div>
                  <span className="text-sm text-foreground leading-snug">{opt.text}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </Screen>
    </PhoneFrame>
  );
}
