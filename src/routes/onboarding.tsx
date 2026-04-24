import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { completeOnboarding, useAppState, useClientReady } from "@/state/store";
import { bookById, NT_CHAPTERS } from "@/data/books";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome — Bible Reading Habit Tracker" },
      { name: "description", content: "Find the right starting point." },
    ],
  }),
  component: OnboardingPage,
});

const QUESTIONS = [
  {
    key: "familiarity",
    title: "How familiar are you with the Bible?",
    options: ["I've barely opened it", "I've read parts of it", "I've read most of it", "I've read it cover to cover"],
  },
  {
    key: "goal",
    title: "What's your main goal?",
    options: ["Build a daily habit", "Read the whole Bible", "Go deeper on what I know", "Prepare for ministry"],
  },
  {
    key: "time",
    title: "How long do you want to read each day?",
    options: ["5 minutes", "15 minutes", "30 minutes", "As long as it takes"],
  },
  {
    key: "draws",
    title: "What draws you most?",
    options: ["Stories and history", "Wisdom for daily life", "Teaching and doctrine", "Prayer and poetry"],
  },
  {
    key: "translation",
    title: "Preferred translation?",
    options: ["ESV", "NIV", "KJV", "NKJV", "NLT", "NASB", "CSB", "NRSV", "MSG", "AMP"],
  },
];

type Step = "welcome" | "account" | "intro" | "q" | "reveal" | "reminder" | "ready";

function OnboardingPage() {
  const navigate = useNavigate();
  const ready = useClientReady();
  const state = useAppState();
  const [step, setStep] = useState<Step>("welcome");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reminder, setReminder] = useState("07:00");
  const [reminderOn, setReminderOn] = useState(true);

  useEffect(() => {
    if (ready && state.onboarded) navigate({ to: "/" });
  }, [ready, state.onboarded, navigate]);

  const dailyChapters = answers.time === "5 minutes" ? 1 : answers.time === "30 minutes" ? 4 : answers.time === "As long as it takes" ? 5 : 2;
  const markDays = Math.ceil(16 / dailyChapters);
  const ntDays = Math.ceil(NT_CHAPTERS / dailyChapters);

  function finish() {
    completeOnboarding({
      name: name || "Friend",
      email: email || "you@example.com",
      translation: answers.translation || "ESV",
      dailyGoal: dailyChapters,
      reminderTime: reminderOn ? reminder : "",
      pathBookId: "mrk",
    });
    navigate({ to: "/read" });
  }

  return (
    <PhoneFrame>
      <Screen noTabs>
        <AnimatePresence mode="wait">
          <motion.div
            key={step + (step === "q" ? qIdx : "")}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="h-full flex flex-col px-6 pt-14 pb-10"
          >
            {step === "welcome" && (
              <>
                <div className="flex-1 flex flex-col justify-center text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Daily Reader</p>
                  <h1 className="mt-12 font-serif text-3xl leading-tight text-foreground">
                    Become the reader you've always wanted to be.
                  </h1>
                  <p className="mt-6 text-base text-muted-foreground max-w-xs mx-auto">
                    An honest tool for building a daily Bible reading habit.
                  </p>
                </div>
                <button
                  onClick={() => setStep("account")}
                  className="w-full rounded-2xl bg-primary text-primary-foreground py-5 font-semibold"
                >
                  Get Started
                </button>
                <button
                  onClick={() => setStep("account")}
                  className="mt-4 text-sm text-muted-foreground"
                >
                  I already have an account
                </button>
              </>
            )}

            {step === "account" && (
              <>
                <BackBtn onClick={() => setStep("welcome")} />
                <div className="mt-8">
                  <h1 className="font-serif text-2xl text-foreground">Create your account</h1>
                  <p className="mt-2 text-sm text-muted-foreground">It takes a moment.</p>
                </div>
                <div className="mt-10 space-y-5">
                  <Field label="Your name" value={name} onChange={setName} placeholder="Sam" />
                  <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" />
                </div>
                <div className="flex-1" />
                <button
                  onClick={() => setStep("intro")}
                  className="w-full rounded-2xl bg-primary text-primary-foreground py-5 font-semibold"
                >
                  Continue
                </button>
              </>
            )}

            {step === "intro" && (
              <>
                <div className="flex-1 flex flex-col justify-center text-center">
                  <Mascot />
                  <h1 className="mt-8 font-serif text-2xl text-foreground">
                    Let's find the right starting point for you.
                  </h1>
                  <p className="mt-3 text-sm text-muted-foreground">Five quick questions. No wrong answers.</p>
                </div>
                <button
                  onClick={() => { setStep("q"); setQIdx(0); }}
                  className="w-full rounded-2xl bg-primary text-primary-foreground py-5 font-semibold"
                >
                  Begin
                </button>
              </>
            )}

            {step === "q" && (
              <>
                <BackBtn onClick={() => qIdx === 0 ? setStep("intro") : setQIdx((i) => i - 1)} />
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {qIdx + 1} of {QUESTIONS.length}
                  </p>
                  <h1 className="mt-3 font-serif text-2xl text-foreground leading-snug">
                    {QUESTIONS[qIdx].title}
                  </h1>
                </div>
                <div className="mt-8 flex flex-col gap-3 flex-1 overflow-y-auto">
                  {QUESTIONS[qIdx].options.map((opt) => {
                    const selected = answers[QUESTIONS[qIdx].key] === opt;
                    return (
                      <motion.button
                        key={opt}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          const next = { ...answers, [QUESTIONS[qIdx].key]: opt };
                          setAnswers(next);
                          setTimeout(() => {
                            if (qIdx + 1 >= QUESTIONS.length) setStep("reveal");
                            else setQIdx(qIdx + 1);
                          }, 250);
                        }}
                        className="rounded-2xl border bg-surface p-4 text-left text-sm text-foreground"
                        style={{
                          borderColor: selected ? "var(--color-primary)" : "var(--color-border)",
                          background: selected ? "color-mix(in oklab, var(--color-primary) 6%, var(--color-surface))" : undefined,
                        }}
                      >
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>
              </>
            )}

            {step === "reveal" && (
              <>
                <div className="flex-1 flex flex-col justify-center text-center">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Your starting point
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="mt-4 font-serif text-4xl text-foreground"
                  >
                    {bookById("mrk")!.name}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed"
                  >
                    Short, fast-paced, and the clearest look at the life of Jesus — a great place to begin.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 }}
                    className="mt-10 mx-auto rounded-2xl bg-surface border border-border p-5 text-left max-w-xs w-full"
                  >
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      At {dailyChapters} chapter{dailyChapters > 1 ? "s" : ""} per day
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-foreground">
                      <li className="flex justify-between"><span>Finish Mark</span><span className="tabular text-muted-foreground">{markDays} days</span></li>
                      <li className="flex justify-between"><span>Finish New Testament</span><span className="tabular text-muted-foreground">{ntDays} days</span></li>
                    </ul>
                  </motion.div>
                </div>
                <button
                  onClick={() => setStep("reminder")}
                  className="w-full rounded-2xl bg-primary text-primary-foreground py-5 font-semibold flex items-center justify-center gap-2"
                >
                  Let's go <ArrowRight size={18} />
                </button>
              </>
            )}

            {step === "reminder" && (
              <>
                <BackBtn onClick={() => setStep("reveal")} />
                <div className="mt-8">
                  <h1 className="font-serif text-2xl text-foreground">When do you want to read?</h1>
                  <p className="mt-2 text-sm text-muted-foreground">A small nudge at the right time.</p>
                </div>

                <div className="mt-10 rounded-2xl bg-surface border border-border p-5">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Reminder time</label>
                  <input
                    type="time"
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    className="mt-2 w-full bg-transparent text-2xl font-serif text-foreground tabular focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => setReminderOn((v) => !v)}
                  className="mt-4 flex items-center justify-between w-full p-4 rounded-2xl border border-border"
                >
                  <span className="text-sm text-foreground">Remind me</span>
                  <span
                    className="rounded-full p-0.5 transition-colors"
                    style={{ width: 44, height: 26, background: reminderOn ? "var(--color-primary)" : "var(--color-border)" }}
                  >
                    <motion.span
                      animate={{ x: reminderOn ? 18 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="block bg-white rounded-full"
                      style={{ width: 22, height: 22 }}
                    />
                  </span>
                </button>

                <div className="flex-1" />
                <button
                  onClick={() => setStep("ready")}
                  className="w-full rounded-2xl bg-primary text-primary-foreground py-5 font-semibold"
                >
                  Continue
                </button>
              </>
            )}

            {step === "ready" && (
              <>
                <div className="flex-1 flex flex-col justify-center text-center">
                  <h1 className="font-serif text-3xl text-foreground">You're all set.</h1>
                  <div className="mt-8 mx-auto rounded-2xl bg-surface border border-border p-5 text-left max-w-xs w-full space-y-3">
                    <Row label="Reading plan" value="New Testament first" />
                    <Row label="Daily goal" value={`${dailyChapters} chapter${dailyChapters > 1 ? "s" : ""}`} />
                    <Row label="Translation" value={answers.translation || "ESV"} />
                    <Row label="First chapter" value="Mark 1" serif />
                  </div>
                </div>
                <button
                  onClick={finish}
                  className="w-full rounded-2xl bg-primary text-primary-foreground py-5 font-semibold"
                >
                  Start My First Reading
                </button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </Screen>
    </PhoneFrame>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="self-start -ml-2 p-2 text-muted-foreground" aria-label="Back">
      <ArrowLeft size={20} />
    </button>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent border-b border-border py-3 text-base text-foreground focus:outline-none focus:border-primary"
      />
    </div>
  );
}

function Row({ label, value, serif }: { label: string; value: string; serif?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className={`text-sm text-foreground ${serif ? "font-serif" : ""}`}>{value}</span>
    </div>
  );
}

function Mascot() {
  // Placeholder geometric mascot — no religious decoration.
  return (
    <div className="mx-auto" style={{ width: 96, height: 96 }}>
      <motion.svg
        viewBox="0 0 96 96"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="48" cy="52" r="36" fill="var(--color-primary)" />
        <circle cx="38" cy="48" r="4" fill="var(--color-background)" />
        <circle cx="58" cy="48" r="4" fill="var(--color-background)" />
        <path d="M 38 64 Q 48 70 58 64" stroke="var(--color-background)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="48" cy="20" r="6" fill="var(--color-secondary)" />
      </motion.svg>
    </div>
  );
}
