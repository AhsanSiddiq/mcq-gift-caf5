import React, { useState, useEffect, useRef } from "react";
import { MCQ } from "@/data/mcqs";
import { CheckCircle2, XCircle, ArrowRight, Bookmark, BookmarkCheck } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import TutorPanel from "@/components/TutorPanel";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";

interface MCQCardProps {
  mcq: MCQ;
  /** `chosen` is the full option string the student picked (e.g. "B) Purchase Order"). */
  onAnswer: (isCorrect: boolean, chosen: string) => void;
  onNext: () => void;
  isLast: boolean;
  /** Subject the question belongs to — recorded with flags so the dashboard can group them. */
  subjectId?: string;
}

const stripKey = (option: string) => option.replace(/^[A-Z]\)\s*/, "");

export default function MCQCard({ mcq, onAnswer, onNext, isLast, subjectId }: MCQCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const { progress, toggleFlag, isLoaded } = useProgress();
  const feedbackRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const isFlagged = isLoaded && (progress.flaggedQuestionIds || []).includes(mcq.id);
  const answeredCorrectly = selectedOption === mcq.correctAnswer;
  const correctIdx = mcq.options.indexOf(mcq.correctAnswer);
  const correctLetter = correctIdx >= 0 ? String.fromCharCode(65 + correctIdx) : "";

  const handleOptionClick = (option: string) => {
    if (showExplanation) return;

    // Haptic feedback
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      if (option === mcq.correctAnswer) navigator.vibrate(30);
      else navigator.vibrate([50, 40, 50]);
    }

    setSelectedOption(option);
    setShowExplanation(true);
    onAnswer(option === mcq.correctAnswer, option);
  };

  // After answering, bring the verdict into view (it sits below the fold on phones)
  // and move focus to "Next" so keyboard / screen-reader users can continue.
  useEffect(() => {
    if (!showExplanation) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => {
      const el = feedbackRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        if (r.bottom > window.innerHeight - 96) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      }
      nextRef.current?.focus({ preventScroll: true });
    }, 120);
    return () => clearTimeout(t);
  }, [showExplanation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!showExplanation) {
        const key = e.key.toUpperCase();
        const optionIndex = ["A", "B", "C", "D", "1", "2", "3", "4"].indexOf(key);
        const mappedIndex = optionIndex >= 4 ? optionIndex - 4 : optionIndex;
        if (mappedIndex >= 0 && mappedIndex < mcq.options.length) handleOptionClick(mcq.options[mappedIndex]);
      } else {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNext(); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showExplanation, mcq, onNext]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MotionConfig reducedMotion="user">
      <div className="quiz-in rounded-2xl p-4 sm:p-6 md:p-7" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>

        {/* Question header */}
        <div className="mb-5 sm:mb-6 flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <span className="inline-block max-w-full text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 sm:mb-4 leading-snug"
              style={{ color: "var(--accent-ink)", background: "color-mix(in srgb, var(--green) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--green) 22%, transparent)" }}>
              {mcq.chapterTitle}
            </span>
            <h2 id={`q-${mcq.id}`} className="text-[17px] sm:text-lg font-bold leading-snug"
              style={{ color: "var(--text-1)", fontFamily: "var(--font-inter), sans-serif" }}>
              {mcq.question}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => toggleFlag(mcq.id, subjectId)}
            className="focus-ring shrink-0 w-11 h-11 -mt-1 -mr-1 rounded-xl flex items-center justify-center transition-colors"
            aria-pressed={isFlagged}
            aria-label={isFlagged ? "Remove flag from this question" : "Flag this question for review"}
            title={isFlagged ? "Remove flag" : "Flag for review"}
            style={{
              background: isFlagged ? "color-mix(in srgb, var(--warn) 14%, transparent)" : "var(--bg-3)",
              border: `1px solid ${isFlagged ? "color-mix(in srgb, var(--warn) 45%, transparent)" : "var(--border)"}`,
              color: isFlagged ? "var(--warn)" : "var(--text-2)",
            }}
          >
            {isFlagged ? <BookmarkCheck className="w-[18px] h-[18px]" /> : <Bookmark className="w-[18px] h-[18px]" />}
          </button>
        </div>

        {/* Options */}
        <motion.div
          role="group"
          aria-labelledby={`q-${mcq.id}`}
          className="flex flex-col gap-2.5"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
        >
          {mcq.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === mcq.correctAnswer;
            const letter = String.fromCharCode(65 + idx);

            let state: "idle" | "correct" | "wrong" | "muted" = "idle";
            if (showExplanation) state = isCorrect ? "correct" : isSelected ? "wrong" : "muted";

            const tone = state === "correct" ? "var(--ok)" : state === "wrong" ? "var(--bad)" : null;
            const borderColor = tone ? `color-mix(in srgb, ${tone} 65%, transparent)` : "var(--border)";
            const bg = tone ? `color-mix(in srgb, ${tone} 10%, var(--bg-2))` : "var(--bg-3)";
            const textColor = state === "muted" ? "var(--text-3)" : state === "idle" ? "var(--text-1)" : "var(--text-1)";

            const srState = state === "correct" ? (isSelected ? ", your answer, correct" : ", correct answer") : state === "wrong" ? ", your answer, incorrect" : "";

            return (
              <motion.button
                key={idx}
                type="button"
                data-state={state}
                variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2 } } }}
                whileTap={!showExplanation ? { scale: 0.985 } : undefined}
                onClick={() => { if (!showExplanation) handleOptionClick(option); }}
                aria-disabled={showExplanation}
                aria-label={`${letter}. ${stripKey(option)}${srState}`}
                className={`mcq-option w-full text-left rounded-xl px-3.5 sm:px-4 py-3 min-h-[52px] flex items-center justify-between gap-3 transition-colors duration-150 ${state === "correct" && isSelected ? "answer-pop" : ""} ${state === "wrong" ? "answer-shake" : ""}`}
                style={{
                  background: bg,
                  border: `1.5px solid ${borderColor}`,
                  color: textColor,
                  cursor: showExplanation ? "default" : "pointer",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 15,
                }}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span aria-hidden className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                    style={{
                      background: tone ?? "var(--bg-2)",
                      color: tone ? "#fff" : "var(--text-2)",
                      border: `1px solid ${tone ?? "var(--border)"}`,
                    }}>
                    {letter}
                  </span>
                  <span className="leading-snug">{stripKey(option)}</span>
                </span>
                {showExplanation && (state === "correct" || state === "wrong") && (
                  <span className="shrink-0" aria-hidden>
                    {state === "correct"
                      ? <CheckCircle2 className="w-5 h-5" style={{ color: "var(--ok)" }} />
                      : <XCircle className="w-5 h-5" style={{ color: "var(--bad)" }} />}
                  </span>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {!showExplanation && (
          <p className="hidden sm:block text-xs mt-4" style={{ color: "var(--text-3)" }}>
            Tip: press <kbd className="font-semibold">A</kbd>–<kbd className="font-semibold">D</kbd> to answer, <kbd className="font-semibold">Enter</kbd> for the next question.
          </p>
        )}

        {/* Verdict + explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-5">
                <div
                  ref={feedbackRef}
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 mb-4 font-bold text-sm"
                  style={{
                    background: `color-mix(in srgb, ${answeredCorrectly ? "var(--ok)" : "var(--bad)"} 12%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${answeredCorrectly ? "var(--ok)" : "var(--bad)"} 35%, transparent)`,
                    color: answeredCorrectly ? "var(--ok)" : "var(--bad)",
                  }}
                >
                  {answeredCorrectly ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
                  <span>{answeredCorrectly ? "Correct — nice work." : `Not quite. The answer is ${correctLetter}.`}</span>
                </div>

                <div className="rounded-xl p-4 mb-4"
                  style={{ background: "var(--bg-3)", borderLeft: "3px solid var(--green)" }}>
                  <h3 className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "var(--accent-ink)" }}>
                    Explanation
                  </h3>
                  <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
                    {mcq.explanation}
                  </p>
                </div>
                <TutorPanel questionId={mcq.id} chosenKey={selectedOption?.charAt(0)} isCorrect={answeredCorrectly} />
                {/* Reserve room for the fixed mobile action bar so it never covers the explanation. */}
                <div aria-hidden className="h-24 sm:hidden" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next — sticky inside the card on desktop, a solid fixed bar on phones.
            Kept outside the animated (overflow-hidden) block so `fixed` is never clipped. */}
        {showExplanation && (
          <div className="sm:sticky sm:bottom-4 z-30 sm:flex sm:justify-end sm:mt-2
                          max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:px-4 max-sm:pt-3 max-sm:pb-[max(12px,env(safe-area-inset-bottom))]"
            style={{ background: "transparent" }}>
            <div aria-hidden className="sm:hidden absolute inset-0 -z-10"
              style={{ background: "color-mix(in srgb, var(--bg) 92%, transparent)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderTop: "1px solid var(--border)" }} />
            <button
              ref={nextRef}
              type="button"
              onClick={onNext}
              className="focus-ring w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold rounded-xl px-8 py-3.5 sm:py-3 text-white transition-transform active:scale-[0.98]"
              style={{
                background: "var(--green)",
                fontSize: 15,
                fontFamily: "var(--font-space-grotesk), sans-serif",
                boxShadow: "0 4px 20px color-mix(in srgb, var(--green) 30%, transparent)",
              }}
            >
              {isLast ? "See results" : "Next question"} <ArrowRight className="w-5 h-5" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
