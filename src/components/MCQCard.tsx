import React, { useState, useEffect } from "react";
import { MCQ } from "@/data/mcqs";
import { CheckCircle2, XCircle, ArrowRight, Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";
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
    
    setSelectedOption(option);
    const isCorrect = option === mcq.correctAnswer;
    setShowExplanation(true);
    onAnswer(isCorrect);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input (though there aren't any here, it's good practice)
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;

      if (!showExplanation) {
        // Handle Option Selection
        const key = e.key.toUpperCase();
        const optionIndex = ["A", "B", "C", "D", "1", "2", "3", "4"].indexOf(key);
        // Map 1-4 to 0-3, and A-D to 0-3
        const mappedIndex = optionIndex >= 4 ? optionIndex - 4 : optionIndex;
        
        if (mappedIndex >= 0 && mappedIndex < mcq.options.length) {
          handleOptionClick(mcq.options[mappedIndex]);
        }
      } else {
        // Handle Next Progression
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault(); // Prevent scrolling on space
          onNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showExplanation, mcq, onNext]);

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-200">
      
      <div className="mb-5 sm:mb-6 flex justify-between items-start gap-3 sm:gap-4">
        <div>
          <span className="inline-block px-2 py-1 sm:px-3 sm:py-1 bg-gray-100 text-gray-700 text-[10px] sm:text-xs font-bold rounded mb-3 sm:mb-4 uppercase tracking-wider leading-tight">
            {mcq.chapterTitle}
          </span>
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
            {mcq.question}
          </h3>
        </div>
        <button 
          onClick={() => toggleFlag(mcq.id)}
          className={`flex-shrink-0 p-2 border rounded-md transition-colors ${isFlagged ? 'bg-amber-50 border-amber-200 text-amber-500' : 'bg-white border-gray-200 text-gray-400 hover:text-amber-500 hover:bg-amber-50'}`}
          title={isFlagged ? "Remove Flag" : "Flag for Review"}
        >
          {isFlagged ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {mcq.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === mcq.correctAnswer;
          
          let stateStyles = "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-400";
          if (showExplanation) {
            if (isCorrect) {
              stateStyles = "bg-green-50 border-green-500 text-green-900";
            } else if (isSelected && !isCorrect) {
              stateStyles = "bg-red-50 border-red-500 text-red-900";
            } else {
              stateStyles = "bg-gray-50 border-gray-200 text-gray-400 opacity-70";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => { if (!showExplanation) handleOptionClick(option); }}
              aria-disabled={showExplanation}
              className={cn(
                "w-full text-left px-4 py-3 sm:px-5 sm:py-4 rounded-lg border sm:border-2 transition-colors font-medium flex items-center justify-between text-sm sm:text-base",
                stateStyles,
                !showExplanation ? "cursor-pointer" : "cursor-default opacity-100"
              )}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={cn(
                  "flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center text-xs font-bold",
                  showExplanation 
                    ? (isCorrect ? "bg-green-500 border-green-500 text-white" : (isSelected && !isCorrect ? "bg-red-500 border-red-500 text-white" : "bg-gray-200 border-gray-300 text-gray-500"))
                    : "bg-white border-gray-300 text-gray-500"
                )}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="leading-snug sm:leading-relaxed">{option.replace(/^[A-Z]\)\s*/, '')}</span>
              </div>

              {showExplanation && (
                <div className="flex-shrink-0 ml-4">
                  {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
            <h4 className="font-bold text-sm text-blue-900 uppercase tracking-widest mb-1">
              Explanation
            </h4>
            <p className="text-blue-900 text-sm leading-relaxed">
              {mcq.explanation}
            </p>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              {isLast ? "Finish Assessment" : "Next Question"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
