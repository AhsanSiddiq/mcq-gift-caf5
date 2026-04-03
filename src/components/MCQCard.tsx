import React, { useState, useEffect } from "react";
import { MCQ } from "@/data/mcqs";
import { CheckCircle2, XCircle, ArrowRight, Bookmark, BookmarkCheck } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

interface MCQCardProps {
  mcq: MCQ;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  isLast: boolean;
}

export default function MCQCard({ mcq, onAnswer, onNext, isLast }: MCQCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const { progress, toggleFlag, isLoaded } = useProgress();

  const isFlagged = isLoaded && (progress.flaggedQuestionIds || []).includes(mcq.id);

  const handleOptionClick = (option: string) => {
    if (showExplanation) return;
    
    // Haptic feedback!
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      if (option === mcq.correctAnswer) navigator.vibrate(30); // Single crisp buzz
      else navigator.vibrate([50, 40, 50]); // Double error buzz
    }

    setSelectedOption(option);
    setShowExplanation(true);
    onAnswer(option === mcq.correctAnswer);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
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
  }, [showExplanation, mcq, onNext]);

  return (
    <div className="rounded-2xl p-4 sm:p-6 md:p-7" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>

      {/* Question header */}
      <div className="mb-6 flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4"
            style={{ color: "var(--green)", background: "rgba(61,179,113,0.10)", border: "1px solid rgba(61,179,113,0.2)" }}>
            {mcq.chapterTitle}
          </span>
          <h3 className="text-base sm:text-lg font-bold leading-snug"
            style={{ color: "var(--text-1)", fontFamily: "var(--font-inter), sans-serif" }}>
            {mcq.question}
          </h3>
        </div>
        <button
          onClick={() => toggleFlag(mcq.id)}
          className="shrink-0 p-2 rounded-xl transition-colors"
          title={isFlagged ? "Remove Flag" : "Flag for Review"}
          style={{
            background: isFlagged ? "rgba(251,191,36,0.12)" : "var(--bg-3)",
            border: `1px solid ${isFlagged ? "rgba(251,191,36,0.35)" : "var(--border)"}`,
            color: isFlagged ? "#fbbf24" : "var(--text-3)",
            cursor: "pointer",
          }}
        >
          {isFlagged ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {mcq.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === mcq.correctAnswer;

          let borderColor = "var(--border)";
          let bg = "var(--bg-3)";
          let textColor = "var(--text-2)";
          let badgeBg = "var(--border)";
          let badgeColor = "var(--text-3)";

          if (showExplanation) {
            if (isCorrect) {
              borderColor = "rgba(61,179,113,0.6)";
              bg = "rgba(61,179,113,0.08)";
              textColor = "var(--text-1)";
              badgeBg = "var(--green)";
              badgeColor = "#fff";
            } else if (isSelected && !isCorrect) {
              borderColor = "rgba(248,113,113,0.6)";
              bg = "rgba(248,113,113,0.08)";
              textColor = "var(--text-2)";
              badgeBg = "#f87171";
              badgeColor = "#fff";
            } else {
              textColor = "var(--text-3)";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => { if (!showExplanation) handleOptionClick(option); }}
              aria-disabled={showExplanation}
              className="w-full text-left rounded-xl px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3 transition-all duration-150"
              style={{
                background: bg,
                border: `1.5px solid ${borderColor}`,
                color: textColor,
                cursor: showExplanation ? "default" : "pointer",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 14,
              }}
              onMouseEnter={e => { if (!showExplanation) (e.currentTarget as HTMLElement).style.borderColor = "rgba(96,165,250,0.5)"; }}
              onMouseLeave={e => { if (!showExplanation) (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
            >
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black"
                  style={{ background: badgeBg, color: badgeColor, border: `1px solid ${badgeBg}` }}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="leading-snug">{option.replace(/^[A-Z]\)\s*/, "")}</span>
              </div>
              {showExplanation && (
                <div className="shrink-0">
                  {isCorrect && <CheckCircle2 className="w-4 h-4" style={{ color: "var(--green)" }} />}
                  {isSelected && !isCorrect && <XCircle className="w-4 h-4" style={{ color: "#f87171" }} />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="mt-6 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="rounded-xl p-4 mb-6"
            style={{ background: "rgba(61,179,113,0.06)", borderLeft: "3px solid var(--green)" }}>
            <h4 className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "var(--green)" }}>
              Explanation
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
              {mcq.explanation}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 sm:mt-0 sm:sticky sm:bottom-4 z-20 
                          max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:p-4 max-sm:bg-[var(--bg-1)] max-sm:border-t max-sm:border-[var(--border)] max-sm:shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
            <button
              onClick={(e) => {
                e.currentTarget.style.transform = "scale(0.98)";
                onNext();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold rounded-xl px-8 py-4 sm:py-3 text-white transition-all active:scale-95"
              style={{ 
                background: "var(--green)", 
                cursor: "pointer", 
                fontSize: 15, 
                fontFamily: "var(--font-space-grotesk), sans-serif",
                boxShadow: "0 4px 20px rgba(61,179,113,0.3)" 
              }}
            >
              {isLast ? "Complete Quiz" : "Next Question"} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
