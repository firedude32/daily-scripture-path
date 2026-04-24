import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { getQuiz, type QuizQuestion } from "@/data/quiz";
import { bookById } from "@/data/books";
import { recordSession } from "@/state/store";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { EditorialCard } from "@/components/ui-lectio/EditorialCard";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz — Lectio" },
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

const NUMBER_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
  "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty", "Twenty-One",
  "Twenty-Two", "Twenty-Three", "Twenty-Four", "Twenty-Five", "Twenty-Six",
  "Twenty-Seven", "Twenty-Eight", "Twenty-Nine", "Thirty",
];

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
  const [pickedCorrect, setPickedCorrect] = useState(false);
  const [hasWrong, setHasWrong] = useState(false);
  const [wrongScreen, setWrongScreen] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [passing, setPassing] = useState(false);

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
    return (
      <PhoneFrame>
        <Screen noTabs>
          <div />
        </Screen>
      </PhoneFrame>
    );
  }

  const book = bookById(pending.bookId)!;

  function pick(i: number, correct: boolean) {
    if (picked !== null) return;
    setPicked(i);
    setPickedCorrect(correct);
    if (!correct) setHasWrong(true);
    setTimeout(() => {
      // Quiz advances regardless of correctness — failure only revealed at end.
      // (Spec: don't tell users which questions were wrong.)
      if (idx + 1 >= questions.length) {
        if (hasWrong || !correct) {
          setWrongScreen(true);
          setCooldown(30);
          return;
        }
        // pass
        setPassing(true);
        setTimeout(() => {
          const result = recordSession(pending!.bookId, pending!.chapter, pending!.durationSec);
          sessionStorage.setItem(
            "brt:summary",
            JSON.stringify({ ...pending, result }),
          );
          navigate({ to: "/summary" });
        }, 700);
      } else {
        setIdx((n) => n + 1);
        setPicked(null);
        setPickedCorrect(false);
      }
    }, 400);
  }

  function retake() {
    setIdx(0);
    setPicked(null);
    setPickedCorrect(false);
    setHasWrong(false);
    setWrongScreen(false);
    setAttempt((a) => a + 1);
  }

  if (passing) {
    return (
      <PhoneFrame>
        <Screen noTabs>
          <div className="h-full flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 96,
                height: 96,
                borderRadius: "9999px",
                background: "var(--color-gold)",
              }}
              className="flex items-center justify-center"
            >
              <Check size={48} strokeWidth={2} color="var(--color-ink)" />
            </motion.div>
          </div>
        </Screen>
      </PhoneFrame>
    );
  }

  if (wrongScreen) {
    const cdPct = ((30 - cooldown) / 30) * 100;
    return (
      <PhoneFrame>
        <Screen noTabs>
          <div className="h-full flex flex-col items-center justify-center px-8 text-center">
            <h1
              className="font-display text-[color:var(--color-ink)]"
              style={{ fontSize: 36, fontWeight: 400, lineHeight: 1.15 }}
            >
              Not quite — give it another try.
            </h1>
            <p className="mt-6 font-body text-[color:var(--color-ink-soft)]" style={{ fontSize: 17 }}>
              Take a moment with the chapter first.
            </p>
            <div className="mt-12 w-full max-w-xs">
              <SmallCaps>
                {cooldown > 0 ? `You can retry in ${cooldown} seconds` : "Ready when you are"}
              </SmallCaps>
              <div
                className="mt-3 w-full"
                style={{ height: 2, background: "var(--color-rule)" }}
              >
                <motion.div
                  initial={false}
                  animate={{ width: `${cdPct}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                  style={{ height: 2, background: "var(--color-gold)" }}
                />
              </div>
            </div>
            <div className="mt-12 w-full max-w-xs">
              <EditorialButton variant="primary" disabled={cooldown > 0} onClick={retake}>
                Retake Quiz
              </EditorialButton>
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
        <div className="h-full flex flex-col px-7 pt-12 pb-10">
          <div>
            <SmallCaps>
              Question {NUMBER_WORDS[idx + 1]} of {NUMBER_WORDS[questions.length]}
            </SmallCaps>
            {/* Five-dot progress */}
            <div className="mt-3 flex items-center gap-2">
              {questions.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "9999px",
                    background:
                      i <= idx ? "var(--color-gold)" : "var(--color-rule)",
                  }}
                />
              ))}
            </div>
            <div className="mt-5">
              <SmallCaps tone="ink">
                {book.name} · Chapter {NUMBER_WORDS[pending.chapter]}
              </SmallCaps>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.h2
              key={idx + "-" + attempt}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 font-display"
              style={{
                fontSize: 26,
                fontWeight: 400,
                lineHeight: 1.2,
                color: "var(--color-ink)",
              }}
            >
              {q.q}
            </motion.h2>
          </AnimatePresence>

          <div className="mt-7 flex flex-col gap-3 flex-1">
            {shuffledOptions.map((opt, i) => {
              const isPicked = picked === i;
              return (
                <EditorialCard
                  key={i + "-" + idx + "-" + attempt}
                  interactive
                  selected={isPicked}
                  padding="md"
                  onClick={() => pick(i, opt.correct)}
                  style={{ cursor: picked === null ? "pointer" : "default" }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="font-body text-[color:var(--color-ink)] flex-1"
                      style={{ fontSize: 16, lineHeight: 1.45 }}
                    >
                      {opt.text}
                    </span>
                    <AnimatePresence>
                      {isPicked && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check
                            size={18}
                            strokeWidth={2.25}
                            color={pickedCorrect ? "var(--color-gold)" : "var(--color-gold)"}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </EditorialCard>
              );
            })}
          </div>
        </div>
      </Screen>
    </PhoneFrame>
  );
}
