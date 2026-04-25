import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { BottomSheet } from "@/components/ui-lectio/BottomSheet";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { BOOKS, type Book } from "@/data/books";
import { hasQuiz } from "@/data/quiz";
import { useAppState } from "@/state/store";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (bookId: string, chapter: number) => void;
}

/**
 * Two-step picker: book -> chapter. Shows read-through tier dot per book and
 * marks chapters already read in the current pass. Tapping a chapter calls
 * onSelect — caller decides what to do (e.g., set override + navigate).
 */
export function ChapterPickerSheet({ open, onClose, onSelect }: Props) {
  const state = useAppState();
  const [step, setStep] = useState<"book" | "chapter">("book");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  function reset() {
    setStep("book");
    setSelectedBook(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  // Group books by testament for nicer browsing.
  const grouped = useMemo(() => {
    return {
      OT: BOOKS.filter((b) => b.testament === "OT"),
      NT: BOOKS.filter((b) => b.testament === "NT"),
    };
  }, []);

  return (
    <BottomSheet
      open={open}
      onClose={handleClose}
      eyebrow={step === "book" ? "Choose Reading" : selectedBook?.name}
      title={step === "book" ? "Pick a Book" : `${selectedBook?.name} · Chapter`}
      maxHeight="85%"
    >
      {step === "chapter" && selectedBook && (
        <button
          onClick={() => {
            setStep("book");
            setSelectedBook(null);
          }}
          className="-mt-2 mb-4 flex items-center gap-1 font-ui uppercase tracking-[0.14em] text-[11px] text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]"
        >
          <ChevronLeft size={14} /> All Books
        </button>
      )}

      {step === "book" && (
        <div className="space-y-7">
          {(["OT", "NT"] as const).map((t) => (
            <div key={t}>
              <SmallCaps>{t === "OT" ? "Old Testament" : "New Testament"}</SmallCaps>
              <ul className="mt-3 -mx-2">
                {grouped[t].map((b) => {
                  const bp = state.bookProgress[b.id];
                  const inProg = bp?.inProgressChapters.length ?? 0;
                  const tier = bp?.readThroughs ?? 0;
                  const dot =
                    tier >= 3
                      ? "var(--color-gold)"
                      : tier === 2
                        ? "#9CA3AF"
                        : tier === 1
                          ? "#7C9A6E"
                          : inProg > 0
                            ? "var(--color-ink-muted)"
                            : "transparent";
                  return (
                    <li key={b.id}>
                      <button
                        onClick={() => {
                          setSelectedBook(b);
                          setStep("chapter");
                        }}
                        className="w-full flex items-center justify-between px-2 py-3 text-left hover:bg-[color:var(--color-paper-light)] rounded-md transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          <span
                            aria-hidden
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: 9999,
                              background: dot,
                              border:
                                dot === "transparent"
                                  ? "1px solid var(--color-rule)"
                                  : "none",
                            }}
                          />
                          <span
                            className="font-display text-[color:var(--color-ink)]"
                            style={{ fontSize: 18, fontWeight: 400 }}
                          >
                            {b.name}
                          </span>
                        </span>
                        <span className="font-ui text-[11px] tabular tracking-wider text-[color:var(--color-ink-muted)]">
                          {inProg > 0 ? `${inProg}/${b.chapters}` : `${b.chapters} ch`}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {step === "chapter" && selectedBook && (
        <div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(
              (ch) => {
                const bp = state.bookProgress[selectedBook.id];
                const isRead = bp?.inProgressChapters.includes(ch) ?? false;
                const quiz = hasQuiz(selectedBook.id, ch);
                return (
                  <button
                    key={ch}
                    onClick={() => {
                      onSelect(selectedBook.id, ch);
                      reset();
                    }}
                    className="aspect-square flex flex-col items-center justify-center rounded-md font-display tabular transition-colors"
                    style={{
                      background: isRead
                        ? "var(--color-paper-light)"
                        : "transparent",
                      border: `1px solid ${
                        isRead ? "var(--color-gold)" : "var(--color-rule)"
                      }`,
                      color: "var(--color-ink)",
                      fontSize: 17,
                      fontWeight: 400,
                    }}
                  >
                    <span>{ch}</span>
                    {quiz && (
                      <span
                        aria-hidden
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: 9999,
                          background: "var(--color-gold)",
                          marginTop: 3,
                        }}
                      />
                    )}
                  </button>
                );
              },
            )}
          </div>
          <p
            className="mt-5 font-body italic text-[color:var(--color-ink-muted)]"
            style={{ fontSize: 12, lineHeight: 1.5 }}
          >
            Gold dot · quiz available. Highlighted · already read this pass.
          </p>
        </div>
      )}
    </BottomSheet>
  );
}
