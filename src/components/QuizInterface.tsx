"use client";

import React, { useState, useEffect } from "react";
import { mcqs, MCQ } from "@/data/mcqs";
import MCQCard from "@/components/MCQCard";
import { RotateCcw, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";

interface QuizInterfaceProps {
  mode: "topical" | "random" | "all" | "flagged";
  chapter?: number;
}

export default function QuizInterface({ mode, chapter }: QuizInterfaceProps) {
  const { progress, isLoaded, saveChapterScore, saveRandomMockScore, updateMarathonState, clearMarathonState } = useProgress();
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [incorrectIds, setIncorrectIds] = useState<string[]>([]);
  const [isRetryMode, setIsRetryMode] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    // For "all" mode, checking if there's a saved marathon in progress
    if (mode === "all") {
      if (progress.marathon.inProgress && progress.marathon.questionIds.length > 0) {
        // Resume saved marathon state
        const savedQuestions = progress.marathon.questionIds.map(id => mcqs.find(q => q.id === id)).filter((q): q is MCQ => q !== undefined);
        setQuestions(savedQuestions);
        setCurrentIndex(progress.marathon.currentIndex);
        setScore(progress.marathon.score);
        setIsFinished(false);
      } else {
        // Start a fresh marathon with entirely shuffled MCQs
        const shuffled = [...mcqs].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        setCurrentIndex(0);
        setScore(0);
        setIsFinished(false);
        // Save initial state so it can be resumed
        updateMarathonState(shuffled.map(q => q.id), 0, 0);
      }
      return; // "all" setup finished
    }

    // Default topical/random/flagged setup
    let filtered = [...mcqs];
    if (mode === "topical" && chapter) {
      filtered = filtered.filter((q) => q.chapter === chapter);
    } else if (mode === "random") {
      filtered = filtered.sort(() => Math.random() - 0.5).slice(0, 10);
    } else if (mode === "flagged") {
      filtered = filtered.filter(q => (progress.flaggedQuestionIds || []).includes(q.id));
    }
    setQuestions(filtered);
    setCurrentIndex(0);
    setScore(0);
    setCurrentStreak(0);
    setIncorrectIds([]);
    setIsFinished(false);
  }, [mode, chapter, isLoaded, progress.marathon.inProgress]); // intentional dependency config to initialize once per load

  const handleNext = (isCorrect: boolean) => {
    if (isCorrect) {
       setScore(score + 1);
       setCurrentStreak(s => s + 1);
    } else {
       setCurrentStreak(0);
       setIncorrectIds(prev => [...prev, questions[currentIndex].id]);
    }
    
    // Save immediate state in Marathon mode so the user doesn't lose progress if they exit mid-question
    // We calculate newScore manually here to avoid race conditions with generic state
    const newScore = isCorrect ? score + 1 : score;
    if (mode === "all" && isLoaded && questions.length > 0 && !isRetryMode) {
      updateMarathonState(questions.map(q => q.id), currentIndex, newScore);
    }
  };

  const advanceQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => {
        const nextIndex = i + 1;
        if (mode === "all" && isLoaded) {
           updateMarathonState(questions.map(q => q.id), nextIndex, score);
        }
        return nextIndex;
      });
    } else {
      setIsFinished(true);
      
      // Save final achievement scores based on mode
      if (mode === "topical" && chapter) {
        saveChapterScore(chapter, score, questions.length);
      } else if (mode === "random") {
        saveRandomMockScore(score);
      } else if (mode === "all") {
        // Marathon finished! Clear the inProgress flag so a new one can be started next time
        clearMarathonState();
      }
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500 font-medium text-center">
        {mode === "flagged" ? (
          <>
            <p className="mb-4 text-lg">You haven't flagged any questions for review yet.</p>
             <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Go Home</Link>
          </>
        ) : "Loading objective data..."}
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl p-8 md:p-12 shadow-sm border border-gray-200 text-center mt-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{isRetryMode ? "Review Complete" : "Practice Complete"}</h2>
        <p className="text-gray-600 mb-8">
          You finished the {mode === "topical" ? `Chapter ${chapter}` : mode === "all" ? "Full Marathon" : mode === "flagged" ? "Flagged Review" : "Random Mock"} assessment.
        </p>
        
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 mb-8 inline-block min-w-[200px]">
          <div className="text-5xl font-black text-blue-600 mb-2">
            {percentage}%
          </div>
          <div className="text-sm font-bold text-gray-700 uppercase tracking-widest">
            {score} out of {questions.length} Correct
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
          {incorrectIds.length > 0 && (
             <button 
               onClick={() => {
                 const incorrectQs = incorrectIds.map(id => mcqs.find(q => q.id === id)).filter((q): q is MCQ => q !== undefined);
                 setQuestions(incorrectQs);
                 setCurrentIndex(0);
                 setScore(0);
                 setCurrentStreak(0);
                 setIncorrectIds([]);
                 setIsFinished(false);
                 setIsRetryMode(true);
               }}
               className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-50 border border-rose-200 text-rose-700 font-semibold rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
             >
               Retry Incorrect ({incorrectIds.length})
             </button>
          )}

          <button 
            onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setCurrentStreak(0);
              setIncorrectIds([]);
              setIsFinished(false);
              setIsRetryMode(false);
              
              if(mode === "all") {
                 // Force a complete reset and new shuffle for a new marathon
                 const shuffled = [...mcqs].sort(() => Math.random() - 0.5);
                 setQuestions(shuffled);
                 updateMarathonState(shuffled.map(q => q.id), 0, 0);
              } else if(mode === "random" || mode === "topical" || mode === "flagged") {
                 let nextQs = [...questions];
                 if (mode === "random") {
                    nextQs = [...mcqs].sort(() => Math.random() - 0.5).slice(0, 10);
                 } else if (mode === "flagged") {
                    nextQs = [...mcqs].filter(q => (progress.flaggedQuestionIds || []).includes(q.id));
                 }
                 setQuestions(nextQs);
              }
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          
          <Link 
            href={mode === "topical" ? "/topical" : "/"}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
             {mode === "topical" ? "Back to Chapters" : "Back Home"}
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4 px-2 sm:px-0">
        <Link href={mode === "topical" ? "/topical" : "/"} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium text-sm transition-colors px-3 py-1.5 rounded-md hover:bg-gray-100">
          <ChevronLeft className="w-4 h-4" /> Exit
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
           {currentStreak > 2 && (
             <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
                🔥 {currentStreak} Streak
             </span>
           )}
           <div className="text-sm font-semibold text-gray-700 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md shadow-sm border border-gray-200">
              Question {currentIndex + 1} / {questions.length} {isRetryMode && <span className="text-rose-500 ml-1">(Review)</span>}
           </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1.5 rounded-full mb-6 sm:mb-8 overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Card Container (no framer-motion logic) */}
      <div key={currentQ.id} className="w-full">
        <MCQCard 
          mcq={currentQ} 
          onAnswer={handleNext} 
          onNext={advanceQuestion}
          isLast={currentIndex === questions.length - 1}
        />
      </div>
    </div>
  );
}
