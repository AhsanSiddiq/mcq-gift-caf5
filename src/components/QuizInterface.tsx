"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MCQ } from "@/data/mcqs";
import MCQCard from "@/components/MCQCard";
import { RotateCcw, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { useParams } from "next/navigation";

function dbToMCQ(row: {
  id: string;
  chapter: number;
  topic: string;
  question_text: string;
  explanation: string;
  options: { option_key: string; option_text: string; is_correct: boolean }[];
}): MCQ {
  const opts = (row.options ?? []).sort((a, b) => a.option_key.localeCompare(b.option_key));
  const correct = opts.find((o) => o.is_correct);
  return {
    id: row.id,
    chapter: row.chapter,
    chapterTitle: row.topic,
    question: row.question_text,
    options: opts.map((o) => `${o.option_key}) ${o.option_text}`),
    correctAnswer: correct ? `${correct.option_key}) ${correct.option_text}` : "",
    explanation: row.explanation,
  };
}

interface QuizInterfaceProps {
  mode: "topical" | "random" | "all" | "flagged";
  chapter?: number;
}

const MODE_LABELS: Record<string, string> = {
  topical: "Chapter",
  random: "Random Mock",
  all: "Full Marathon",
  flagged: "Flagged Review",
};

export default function QuizInterface({ mode, chapter }: QuizInterfaceProps) {
  const params = useParams();
  const level = (params?.level as string) || "caf";
  const subjectId = (params?.subject as string) || "caf-5";

  const { progress, isLoaded, saveChapterScore, saveRandomMockScore, updateMarathonState, clearMarathonState } = useProgress();

  const [allQuestions, setAllQuestions] = useState<MCQ[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [incorrectIds, setIncorrectIds] = useState<string[]>([]);
  const [isRetryMode, setIsRetryMode] = useState(false);

  useEffect(() => {
    setIsFetching(true);
    fetch(`/api/questions?subject=${subjectId}`)
      .then((r) => r.json())
      .then((data) => setAllQuestions((data.questions ?? []).map(dbToMCQ)))
      .catch(console.error)
      .finally(() => setIsFetching(false));
  }, [subjectId]);

  const setup = useCallback(() => {
    if (isFetching || !isLoaded || allQuestions.length === 0) return;
    if (mode === "all") {
      if (progress.marathon.inProgress && progress.marathon.questionIds.length > 0) {
        const saved = progress.marathon.questionIds
          .map((id) => allQuestions.find((q) => q.id === id))
          .filter((q): q is MCQ => q !== undefined);
        setQuestions(saved);
        setCurrentIndex(progress.marathon.currentIndex);
        setScore(progress.marathon.score);
        setIsFinished(false);
      } else {
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        setCurrentIndex(0); setScore(0); setIsFinished(false);
        updateMarathonState(shuffled.map((q) => q.id), 0, 0);
      }
      return;
    }
    let filtered = [...allQuestions];
    if (mode === "topical" && chapter) filtered = filtered.filter((q) => q.chapter === chapter);
    else if (mode === "random") filtered = filtered.sort(() => Math.random() - 0.5).slice(0, 10);
    else if (mode === "flagged") filtered = filtered.filter((q) => (progress.flaggedQuestionIds || []).includes(q.id));
    setQuestions(filtered);
    setCurrentIndex(0); setScore(0); setCurrentStreak(0); setIncorrectIds([]); setIsFinished(false);
  }, [isFetching, isLoaded, allQuestions, mode, chapter, progress.marathon.inProgress]);

  useEffect(() => { setup(); }, [setup]);

  const handleNext = (isCorrect: boolean) => {
    if (isCorrect) { setScore((s) => s + 1); setCurrentStreak((s) => s + 1); }
    else { setCurrentStreak(0); setIncorrectIds((prev) => [...prev, questions[currentIndex].id]); }
    const newScore = isCorrect ? score + 1 : score;
    if (mode === "all" && isLoaded && questions.length > 0 && !isRetryMode)
      updateMarathonState(questions.map((q) => q.id), currentIndex, newScore);
  };

  const advanceQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => {
        const next = i + 1;
        if (mode === "all" && isLoaded) updateMarathonState(questions.map((q) => q.id), next, score);
        return next;
      });
    } else {
      setIsFinished(true);
      if (mode === "topical" && chapter) saveChapterScore(chapter, score, questions.length);
      else if (mode === "random") saveRandomMockScore(score);
      else if (mode === "all") clearMarathonState();
    }
  };

  /* ── Loading ── */
  if (isFetching || !isLoaded) {
    return (
      <div className="max-w-3xl mx-auto w-full pt-20 sm:pt-24 pb-20 px-3 sm:px-4 animate-pulse">
        {/* Top bar skeleton */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <span className="rounded-xl" style={{ height: 40, width: 72, background: "var(--bg-2)", border: "1px solid var(--border)", display: "block" }} />
          <span className="rounded-xl" style={{ height: 40, width: 80, background: "var(--bg-2)", border: "1px solid var(--border)", display: "block" }} />
        </div>
        {/* Progress bar skeleton */}
        <div className="w-full h-2 rounded-full mb-5" style={{ background: "var(--border)" }}>
          <div className="h-2 rounded-full" style={{ width: "30%", background: "var(--green)", opacity: 0.35 }} />
        </div>
        {/* Card skeleton */}
        <div className="rounded-2xl p-6 sm:p-8 flex flex-col gap-5" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
          <span className="rounded" style={{ display: "block", height: 13, width: 90, background: "var(--border)" }} />
          <span className="rounded" style={{ display: "block", height: 22, width: "80%", background: "var(--border)" }} />
          <span className="rounded" style={{ display: "block", height: 22, width: "55%", background: "var(--border)" }} />
          <div className="flex flex-col gap-3 mt-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="rounded-xl p-4 flex items-center gap-3" style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
                <span className="rounded-full shrink-0" style={{ width: 20, height: 20, background: "var(--border)", display: "block" }} />
                <span className="rounded flex-1" style={{ height: 14, width: `${40 + n * 12}%`, background: "var(--border)", display: "block" }} />
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-sm font-medium mt-6" style={{ color: "var(--text-3)" }}>Loading questions…</p>
      </div>
    );
  }

  /* ── Empty ── */
  if (questions.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-24">
        <p className="text-4xl mb-4">🔖</p>
        <p className="font-bold text-lg mb-2" style={{ color: "var(--text-1)" }}>
          {mode === "flagged" ? "No flagged questions" : "No questions found"}
        </p>
        <p className="text-sm mb-8" style={{ color: "var(--text-2)" }}>
          {mode === "flagged" ? "Flag questions during practice — they appear here for review." : "Nothing available for this selection."}
        </p>
        <Link href={`/${level}/${subjectId}`}
          className="inline-flex items-center gap-2 font-bold rounded-xl px-6 py-3 text-white"
          style={{ background: "var(--green)", textDecoration: "none" }}>
          Back to Subject
        </Link>
      </div>
    );
  }

  /* ── Results screen ── */
  if (isFinished) {
    const pct = Math.round((score / questions.length) * 100);
    const excellent = pct >= 80;
    return (
      <div className="max-w-lg mx-auto pt-28 pb-20 px-4">
        <div className="rounded-2xl p-8 text-center" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
          <div className="text-4xl mb-4">{excellent ? "🎉" : "💪"}</div>
          <h2 className="font-bold text-2xl mb-1" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            {isRetryMode ? "Review Complete" : "Practice Complete"}
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--text-2)" }}>
            {MODE_LABELS[mode]} {mode === "topical" ? `— Chapter ${chapter}` : ""} finished.
          </p>

          {/* Score ring */}
          <div className="inline-flex flex-col items-center justify-center rounded-2xl px-10 py-6 mb-8"
            style={{ background: excellent ? "rgba(61,179,113,0.08)" : "rgba(251,191,36,0.08)",
              border: `1px solid ${excellent ? "rgba(61,179,113,0.3)" : "rgba(251,191,36,0.3)"}` }}>
            <div className="font-black" style={{ fontSize: "3.5rem", color: excellent ? "var(--green)" : "#fbbf24", lineHeight: 1 }}>
              {pct}%
            </div>
            <div className="text-sm font-bold mt-1" style={{ color: "var(--text-3)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              {score} / {questions.length} correct
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {incorrectIds.length > 0 && (
              <button
                onClick={() => {
                  const qs = incorrectIds.map((id) => allQuestions.find((q) => q.id === id)).filter((q): q is MCQ => q !== undefined);
                  setQuestions(qs); setCurrentIndex(0); setScore(0); setCurrentStreak(0);
                  setIncorrectIds([]); setIsFinished(false); setIsRetryMode(true);
                }}
                className="inline-flex items-center justify-center gap-2 font-bold rounded-xl px-5 py-3 text-sm cursor-pointer"
                style={{ background: "rgba(248,113,113,0.10)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}
              >
                <RotateCcw className="w-4 h-4" /> Retry Wrong ({incorrectIds.length})
              </button>
            )}
            <button
              onClick={() => {
                setCurrentIndex(0); setScore(0); setCurrentStreak(0);
                setIncorrectIds([]); setIsFinished(false); setIsRetryMode(false);
                if (mode === "all") { const s = [...allQuestions].sort(() => Math.random() - 0.5); setQuestions(s); updateMarathonState(s.map(q => q.id), 0, 0); }
                else if (mode === "random") setQuestions([...allQuestions].sort(() => Math.random() - 0.5).slice(0, 10));
                else if (mode === "flagged") setQuestions(allQuestions.filter(q => (progress.flaggedQuestionIds || []).includes(q.id)));
              }}
              className="inline-flex items-center justify-center gap-2 font-bold rounded-xl px-5 py-3 text-sm cursor-pointer"
              style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-2)" }}
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <Link
              href={mode === "topical" ? `/${level}/${subjectId}/topical` : `/${level}/${subjectId}`}
              className="inline-flex items-center justify-center gap-2 font-bold rounded-xl px-5 py-3 text-sm text-white"
              style={{ background: "var(--green)", textDecoration: "none" }}
            >
              {mode === "topical" ? "More Chapters" : "Back to Subject"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Active Quiz ── */
  const currentQ = questions[currentIndex];
  const progressPercent = (currentIndex / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto w-full pt-20 sm:pt-24 pb-20 px-3 sm:px-4">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <Link
          href={mode === "topical" ? `/${level}/${subjectId}/topical` : `/${level}/${subjectId}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition-colors"
          style={{ color: "var(--text-3)", background: "var(--bg-2)", border: "1px solid var(--border)", textDecoration: "none" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-1)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-3)")}
        >
          <ChevronLeft className="w-4 h-4" /> Exit
        </Link>

        <div className="flex items-center gap-2">
          {currentStreak > 2 && (
            <span className="text-xs font-black px-3 py-1.5 rounded-full animate-pulse"
              style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }}>
              🔥 {currentStreak} streak
            </span>
          )}
          <div className="text-sm font-bold px-4 py-2 rounded-xl"
            style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-1)",
              fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            {currentIndex + 1} <span style={{ color: "var(--text-3)" }}>/ {questions.length}</span>
            {isRetryMode && <span className="ml-2 text-xs" style={{ color: "#f87171" }}>Review</span>}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full mb-5 overflow-hidden" style={{ background: "var(--border)" }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%`, background: "var(--green)" }} />
      </div>

      {/* Card */}
      <div key={currentQ.id}>
        <MCQCard mcq={currentQ} onAnswer={handleNext} onNext={advanceQuestion} isLast={currentIndex === questions.length - 1} />
      </div>
    </div>
  );
}
