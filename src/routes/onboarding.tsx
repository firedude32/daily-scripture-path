import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { completeOnboarding, useAppState, useClientReady } from "@/state/store";
import { bookById, NT_CHAPTERS } from "@/data/books";
import { Mascot } from "@/components/Mascot";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { EditorialCard } from "@/components/ui-lectio/EditorialCard";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { Rule } from "@/components/ui-lectio/Rule";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome — Lectio" },
      { name: "description", content: "Find the right starting point." },
    ],
  }),
  component: OnboardingPage,
});

const QUESTIONS = [
  {
    key: "familiarity",
    title: "How familiar are you with the Bible?",
    options: [
      { label: "I've barely opened it", desc: "Starting fresh." },
      { label: "I've read parts of it", desc: "Some books, here and there." },
      { label: "I've read most of it", desc: "Familiar with the whole." },
      { label: "Cover to cover", desc: "Already once through." },
    ],
  },
  {
    key: "goal",
    title: "What's your main goal?",
    options: [
      { label: "Build a daily habit", desc: "Consistency above all." },
      { label: "Read the whole Bible", desc: "Cover to cover." },
      { label: "Go deeper", desc: "On what you already know." },
      { label: "Prepare for ministry", desc: "Teaching or leading others." },
    ],
  },
  {
    key: "time",
    title: "How long do you want to read each day?",
    options: [
      { label: "5 minutes", desc: "One short chapter." },
      { label: "15 minutes", desc: "Two chapters, unhurried." },
      { label: "30 minutes", desc: "Four chapters, focused." },
      { label: "As long as it takes", desc: "Read until you stop." },
    ],
  },
  {
    key: "draws",
    title: "What draws you most?",
    options: [
      { label: "Stories and history", desc: "The narrative arc." },
      { label: "Wisdom for daily life", desc: "Practical guidance." },
      { label: "Teaching and doctrine", desc: "What and why." },
      { label: "Prayer and poetry", desc: "Psalms and prayer." },
    ],
  },
  {
    key: "translation",
    title: "Preferred translation?",
    options: ["ESV", "NIV", "KJV", "NKJV", "NLT", "NASB", "CSB", "NRSV", "MSG", "AMP"].map((t) => ({ label: t, desc: "" })),
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

  const dailyChapters =
    answers.time === "5 minutes" ? 1 :
    answers.time === "30 minutes" ? 4 :
    answers.time === "As long as it takes" ? 5 : 2;

  // Pick the starting book from the answers — not always Mark.
  const pathBookId = pickStartingBook(answers);
  const pathBook = bookById(pathBookId)!;
  const pathDays = Math.ceil(pathBook.chapters / dailyChapters);
  const ntDays = Math.ceil(NT_CHAPTERS / dailyChapters);

  function finish() {
    completeOnboarding({
      name: name || "Friend",
      email: email || "you@example.com",
      translation: answers.translation || "ESV",
      dailyGoal: dailyChapters,
      reminderTime: reminderOn ? reminder : "",
      pathBookId,
    });
    navigate({ to: "/read" });
  }

  const progress = ((qIdx + 1) / QUESTIONS.length) * 100;

  return (
    <PhoneFrame>
      <Screen noTabs>
        <AnimatePresence mode="wait">
          <motion.div
            key={step + (step === "q" ? qIdx : "")}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-full flex flex-col px-7 pt-14 pb-10"
          >
            {step === "welcome" && (
              <>
                <div className="flex-1 flex flex-col justify-center text-center">
                  <p
                    className="font-display uppercase mx-auto"
                    style={{ color: "var(--color-gold)", fontSize: 22, letterSpacing: "0.32em", fontWeight: 400 }}
                  >
                    Lectio
                  </p>
                  <h1
                    className="mt-16 font-display text-[color:var(--color-ink)]"
                    style={{ fontSize: 38, lineHeight: 1.1, fontWeight: 400, letterSpacing: "-0.01em" }}
                  >
                    Become the reader you've always wanted to be.
                  </h1>
                  <p className="mt-7 font-body text-[color:var(--color-ink-soft)] max-w-xs mx-auto" style={{ fontSize: 17, lineHeight: 1.5 }}>
                    An honest tool for building a daily Bible reading habit.
                  </p>
                </div>
                <EditorialButton variant="gold" onClick={() => setStep("account")}>
                  Get Started
                </EditorialButton>
                <button
                  onClick={() => setStep("account")}
                  className="mt-5 font-ui uppercase tracking-[0.14em] text-[11px] text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]"
                >
                  I already have an account
                </button>
              </>
            )}

            {step === "account" && (
              <>
                <BackBtn onClick={() => setStep("welcome")} />
                <div className="mt-8">
                  <h1 className="font-display text-[color:var(--color-ink)]" style={{ fontSize: 28, fontWeight: 400 }}>
                    Create your account.
                  </h1>
                </div>
                <div className="mt-12 space-y-8">
                  <Field label="Your Name" value={name} onChange={setName} placeholder="Sam" />
                  <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" />
                </div>
                <div className="flex-1" />
                <EditorialButton variant="primary" onClick={() => setStep("intro")}>
                  Continue
                </EditorialButton>
              </>
            )}

            {step === "intro" && (
              <>
                <div className="flex-1 flex flex-col justify-center text-center">
                  <Mascot size={104} />
                  <h1 className="mt-10 font-display text-[color:var(--color-ink)]" style={{ fontSize: 30, fontWeight: 400, lineHeight: 1.15 }}>
                    Let's find the right starting point for you.
                  </h1>
                  <p className="mt-5 font-body text-[color:var(--color-ink-soft)]" style={{ fontSize: 16 }}>
                    Five quick questions. No wrong answers.
                  </p>
                </div>
                <EditorialButton variant="primary" onClick={() => { setStep("q"); setQIdx(0); }}>
                  Begin
                </EditorialButton>
              </>
            )}

            {step === "q" && (
              <>
                <div className="flex items-center gap-4">
                  <BackBtn onClick={() => qIdx === 0 ? setStep("intro") : setQIdx((i) => i - 1)} inline />
                  <div className="flex-1">
                    <SmallCaps>
                      Question {qIdx + 1} of {QUESTIONS.length}
                    </SmallCaps>
                    <div className="mt-2 w-full" style={{ height: 1.5, background: "var(--color-rule)" }}>
                      <motion.div
                        initial={false}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4 }}
                        style={{ height: 1.5, background: "var(--color-gold)" }}
                      />
                    </div>
                  </div>
                </div>
                <h1
                  className="mt-10 font-display text-[color:var(--color-ink)]"
                  style={{ fontSize: 28, fontWeight: 400, lineHeight: 1.2 }}
                >
                  {QUESTIONS[qIdx].title}
                </h1>
                <div className="mt-8 flex flex-col gap-3 flex-1 overflow-y-auto pb-4">
                  {QUESTIONS[qIdx].options.map((opt) => {
                    const selected = answers[QUESTIONS[qIdx].key] === opt.label;
                    return (
                      <EditorialCard
                        key={opt.label}
                        interactive
                        selected={selected}
                        padding="sm"
                        onClick={() => {
                          const next = { ...answers, [QUESTIONS[qIdx].key]: opt.label };
                          setAnswers(next);
                          setTimeout(() => {
                            if (qIdx + 1 >= QUESTIONS.length) setStep("reveal");
                            else setQIdx(qIdx + 1);
                          }, 280);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <div>
                          <p className="font-display text-[color:var(--color-ink)]" style={{ fontSize: 17, fontWeight: 400 }}>
                            {opt.label}
                          </p>
                          {opt.desc && (
                            <p className="mt-1 font-ui text-[12px] text-[color:var(--color-ink-muted)]">
                              {opt.desc}
                            </p>
                          )}
                        </div>
                      </EditorialCard>
                    );
                  })}
                </div>
              </>
            )}

            {step === "reveal" && (
              <>
                <div className="flex-1 flex flex-col justify-center text-center">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                    <SmallCaps>We're starting you in</SmallCaps>
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-5 font-display uppercase"
                    style={{ fontSize: 72, color: "var(--color-gold)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1 }}
                  >
                    {pathBook.name}
                  </motion.h1>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-6 mx-auto w-24">
                    <Rule />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.85 }}
                    className="mt-6 font-body italic text-[color:var(--color-ink-soft)] max-w-xs mx-auto"
                    style={{ fontSize: 16, lineHeight: 1.55 }}
                  >
                    {bookBlurb(pathBookId)}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.05 }}
                    className="mt-10 mx-auto max-w-xs w-full text-left p-6 border"
                    style={{ background: "var(--color-paper-light)", borderColor: "var(--color-rule)" }}
                  >
                    <SmallCaps>At your pace</SmallCaps>
                    <ul className="mt-4 space-y-2.5 font-body text-[color:var(--color-ink)]" style={{ fontSize: 15 }}>
                      <li className="flex justify-between"><span>{pathBook.name} in</span><span className="tabular">{pathDays} days</span></li>
                      <li className="flex justify-between"><span>The New Testament in</span><span className="tabular">{ntDays} days</span></li>
                    </ul>
                  </motion.div>
                </div>
                <EditorialButton variant="gold" onClick={() => setStep("reminder")}>
                  Let's Go
                </EditorialButton>
              </>
            )}

            {step === "reminder" && (
              <>
                <BackBtn onClick={() => setStep("reveal")} />
                <div className="mt-8">
                  <h1 className="font-display text-[color:var(--color-ink)]" style={{ fontSize: 28, fontWeight: 400 }}>
                    When do you want to read?
                  </h1>
                </div>
                <div className="mt-12">
                  <SmallCaps>Reminder Time</SmallCaps>
                  <input
                    type="time"
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    className="mt-3 w-full bg-transparent font-display tabular text-[color:var(--color-ink)] focus:outline-none border-b py-2"
                    style={{ fontSize: 36, fontWeight: 400, borderColor: "var(--color-rule)" }}
                  />
                </div>
                <button
                  onClick={() => setReminderOn((v) => !v)}
                  className="mt-6 flex items-center justify-between w-full py-4 border-b"
                  style={{ borderColor: "var(--color-rule)" }}
                >
                  <span className="font-body text-[color:var(--color-ink)]" style={{ fontSize: 15 }}>
                    Remind me at this time
                  </span>
                  <span
                    className="rounded-full p-0.5 transition-colors"
                    style={{
                      width: 44,
                      height: 26,
                      background: reminderOn ? "var(--color-ink)" : "var(--color-rule)",
                    }}
                  >
                    <motion.span
                      animate={{ x: reminderOn ? 18 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="block rounded-full"
                      style={{ width: 22, height: 22, background: "var(--color-paper)" }}
                    />
                  </span>
                </button>
                <p className="mt-4 font-body italic text-[color:var(--color-ink-muted)]" style={{ fontSize: 13 }}>
                  One notification. Never more.
                </p>
                <div className="flex-1" />
                <EditorialButton variant="primary" onClick={() => setStep("ready")}>
                  Continue
                </EditorialButton>
              </>
            )}

            {step === "ready" && (
              <>
                <div className="flex-1 flex flex-col justify-center text-center">
                  <h1 className="font-display text-[color:var(--color-ink)]" style={{ fontSize: 36, fontWeight: 400 }}>
                    You're all set.
                  </h1>
                  <div className="mt-10 mx-auto max-w-xs w-full text-left space-y-4 p-6 border" style={{ background: "var(--color-paper-light)", borderColor: "var(--color-rule)" }}>
                    <Row label="Plan" value={planLabel(pathBookId)} />
                    <Row label="Goal" value={`${dailyChapters} chapter${dailyChapters > 1 ? "s" : ""} daily`} />
                    <Row label="Translation" value={answers.translation || "ESV"} />
                    <Row label="First Chapter" value={`${pathBook.name} 1`} />
                  </div>
                </div>
                <EditorialButton variant="gold" onClick={finish}>
                  Start My First Reading
                </EditorialButton>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </Screen>
    </PhoneFrame>
  );
}

function BackBtn({ onClick, inline }: { onClick: () => void; inline?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`${inline ? "" : "self-start"} -ml-2 p-2 text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]`}
      aria-label="Back"
    >
      <ArrowLeft size={18} />
    </button>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <SmallCaps>{label}</SmallCaps>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent border-b py-3 font-body text-[color:var(--color-ink)] focus:outline-none"
        style={{ fontSize: 17, borderColor: "var(--color-rule)" }}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <SmallCaps>{label}</SmallCaps>
      <span className="font-display text-[color:var(--color-ink)]" style={{ fontSize: 15, fontWeight: 400 }}>
        {value}
      </span>
    </div>
  );
}
