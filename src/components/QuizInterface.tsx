"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { MCQ } from "@/data/mcqs";
import MCQCard from "@/components/MCQCard";
import { RotateCcw, ChevronLeft, CloudUpload, Timer, Crown } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { useParams } from "next/navigation";
import EmailLoginModal from "@/components/EmailLoginModal";
import AdSlot from "@/components/AdSlot";
import { usePro } from "@/hooks/usePro";

/* ── Exam Simulator: timed mock. Free users get one per day, Pro is unlimited. ── */
const EXAM_FREE_KEY = "cah_exam_free_v1";
const SECONDS_PER_QUESTION = 90;
const todayKey = () => new Date().toISOString().slice(0, 10);
function freeExamUsedToday(): boolean {
  try { return localStorage.getItem(EXAM_FREE_KEY) === todayKey(); } catch { return false; }
}
function markFreeExamUsed() {
  try { localStorage.setItem(EXAM_FREE_KEY, todayKey()); } catch { /* private mode */ }
}
const fmtClock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

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
  mode: "topical" | "random" | "all" | "flagged" | "exam";
  chapter?: number;
  initialQuestions?: MCQ[];
}

// Simple session-level cache to avoid redundant fetches
const QUESTION_CACHE: Record<string, MCQ[]> = {};

const MODE_LABELS: Record<string, string> = {
  topical: "Chapter",
  random: "Random Mock",
  all: "Full Marathon",
  flagged: "Flagged Review",
  exam: "Exam Simulator",
};

export default function QuizInterface({ mode, chapter, initialQuestions = [] }: QuizInterfaceProps) {
  const params = useParams();
  const level = (params?.level as string) || "caf";
  const subjectId = (params?.subject as string) || "caf-5";

  const { progress, isLoaded, saveChapterScore, saveRandomMockScore, updateMarathonState, clearMarathonState, auth, signIn, syncToCloud, isSyncing } = useProgress(subjectId);

  const [allQuestions, setAllQuestions] = useState<MCQ[]>(initialQuestions);
  const [isFetching, setIsFetching] = useState(initialQuestions.length === 0);
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [incorrectIds, setIncorrectIds] = useState<string[]>([]);
  const [isRetryMode, setIsRetryMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const confettiRef = useRef(false);
  const { pro, loading: proLoading } = usePro();
  const [examLocked, setExamLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timeUsed, setTimeUsed] = useState<number | null>(null);
  const examStartedRef = useRef(false);
  // Only exam mode depends on Pro status; other modes must not reshuffle when it resolves.
  const examGate = mode === "exam" ? (proLoading ? "loading" : pro ? "pro" : "free") : "n/a";

  useEffect(() => {
    // Determine the cache key and fetch URL
    // For topical mode, we can fetch and cache by chapter
    // For other modes, we fetch the whole subject (but cache it)
    const isTopical = mode === "topical" && chapter;
    const cacheKey = isTopical ? `${subjectId}_ch${chapter}` : subjectId;
    
    if (initialQuestions && initialQuestions.length > 0) {
      QUESTION_CACHE[cacheKey] = initialQuestions;
      setAllQuestions(initialQuestions);
      setIsFetching(false);
      return;
    }

    if (QUESTION_CACHE[cacheKey]) {
      setAllQuestions(QUESTION_CACHE[cacheKey]);
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    const url = isTopical 
      ? `/api/questions?subject=${subjectId}&chapter=${chapter}`
      : `/api/questions?subject=${subjectId}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const mapped = (data.questions ?? []).map(dbToMCQ);
        QUESTION_CACHE[cacheKey] = mapped;
        setAllQuestions(mapped);
      })
      .catch(console.error)
      .finally(() => setIsFetching(false));
  }, [subjectId, mode, chapter]);

  const setup = useCallback(() => {
    if (isFetching || !isLoaded || allQuestions.length === 0) return;
    if (mode === "all") {
      // ← FIX: only resume if the saved marathon belongs to this subject
      if (progress.marathon.inProgress && progress.marathon.subjectId === subjectId && progress.marathon.questionIds.length > 0) {
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
        updateMarathonState(shuffled.map((q) => q.id), 0, 0, subjectId);
      }
      return;
    }
    if (mode === "exam") {
      if (examGate === "loading" || examStartedRef.current) return;
      const isPro = examGate === "pro";
      if (!isPro && freeExamUsedToday()) { setExamLocked(true); return; }
      examStartedRef.current = true;
      const size = Math.min(level.toLowerCase() === "prc" ? 50 : 30, allQuestions.length);
      const picked = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, size);
      if (!isPro) markFreeExamUsed();
      setExamLocked(false);
      setQuestions(picked);
      setCurrentIndex(0); setScore(0); setCurrentStreak(0); setIncorrectIds([]); setIsFinished(false);
      setTimeLeft(size * SECONDS_PER_QUESTION); setTimeUsed(null);
      return;
    }
    let filtered = [...allQuestions];
    const mockSize = level.toLowerCase() === "prc" ? 50 : 10;
    if (mode === "topical" && chapter) filtered = filtered.filter((q) => q.chapter === chapter);
    else if (mode === "random") filtered = filtered.sort(() => Math.random() - 0.5).slice(0, mockSize);
    else if (mode === "flagged") filtered = filtered.filter((q) => (progress.flaggedQuestionIds || []).includes(q.id));
    setQuestions(filtered);
    setCurrentIndex(0); setScore(0); setCurrentStreak(0); setIncorrectIds([]); setIsFinished(false);
  }, [isFetching, isLoaded, allQuestions, mode, chapter, progress.marathon.inProgress, progress.marathon.subjectId, subjectId, examGate]);

  useEffect(() => { setup(); }, [setup]);

  // Exam countdown — submits automatically when time runs out
  useEffect(() => {
    if (mode !== "exam" || isFinished || timeLeft === null) return;
    if (timeLeft <= 0) {
      setTimeUsed(questions.length * SECONDS_PER_QUESTION);
      setIsFinished(true);
      saveRandomMockScore(score);
      if (auth) syncToCloud(subjectId);
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => (v === null ? v : v - 1)), 1000);
    return () => clearTimeout(t);
  }, [mode, isFinished, timeLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  // Trigger confetti on perfect score
  useEffect(() => {
    if (isFinished && !confettiRef.current) {
      const pct = Math.round((score / questions.length) * 100);
      if (pct === 100 && typeof window !== "undefined") {
        confettiRef.current = true;
        import("canvas-confetti").then((mod) => {
          const confetti = mod.default;
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.65 }, colors: ["#3db371", "#60a5fa", "#fbbf24", "#f87171", "#a78bfa"] });
        });
      }
    }
    if (!isFinished) confettiRef.current = false;
  }, [isFinished, score, questions.length]);

  const handleNext = (isCorrect: boolean) => {
    if (isCorrect) { setScore((s) => s + 1); setCurrentStreak((s) => s + 1); }
    else { setCurrentStreak(0); setIncorrectIds((prev) => [...prev, questions[currentIndex].id]); }
    const newScore = isCorrect ? score + 1 : score;
    if (mode === "all" && isLoaded && questions.length > 0 && !isRetryMode)
      updateMarathonState(questions.map((q) => q.id), currentIndex, newScore, subjectId);
  };

  const advanceQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => {
        const next = i + 1;
        if (mode === "all" && isLoaded) updateMarathonState(questions.map((q) => q.id), next, score, subjectId);
        return next;
      });
    } else {
      setIsFinished(true);
      if (mode === "topical" && chapter) saveChapterScore(chapter, score, questions.length);
      else if (mode === "random" || mode === "exam") saveRandomMockScore(score);
      if (mode === "exam" && timeLeft !== null) setTimeUsed(questions.length * SECONDS_PER_QUESTION - timeLeft);
      else if (mode === "all") clearMarathonState();
      // Auto-sync to cloud on completion if signed in
      if (auth) syncToCloud(subjectId);
    }
  };

  /* ── Loading ── */
  if (isFetching || !isLoaded) {
    return (
      <div className="max-w-3xl mx-auto w-full pt-20 sm:pt-24 pb-20 px-3 sm:px-4 animate-pulse">
        <div className="flex items-center justify-between mb-4 gap-2">
          <span className="rounded-xl" style={{ height: 40, width: 72, background: "var(--bg-2)", border: "1px solid var(--border)", display: "block" }} />
          <span className="rounded-xl" style={{ height: 40, width: 80, background: "var(--bg-2)", border: "1px solid var(--border)", display: "block" }} />
        </div>
        <div className="w-full h-2 rounded-full mb-5" style={{ background: "var(--border)" }}>
          <div className="h-2 rounded-full" style={{ width: "30%", background: "var(--green)", opacity: 0.35 }} />
        </div>
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

  /* ── Exam Simulator daily limit reached ── */
  if (mode === "exam" && examLocked) {
    return (
      <div className="max-w-md mx-auto text-center pt-28 pb-20 px-4">
        <div className="rounded-2xl p-8" style={{ background: "var(--bg-2)", border: "1px solid rgba(245,166,35,0.35)" }}>
          <Crown className="w-10 h-10 mx-auto mb-4" style={{ color: "var(--gold)" }} />
          <h2 className="font-bold text-xl mb-2" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            You&apos;ve used today&apos;s free exam
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
            Free accounts get one timed Exam Simulator a day. Go Pro for unlimited timed exams and a completely ad-free site — or come back tomorrow.
            Topical drills and random mocks stay free, always.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/pro" className="font-bold rounded-xl px-6 py-3 text-white" style={{ background: "var(--green)", textDecoration: "none" }}>
              See Pro plans
            </Link>
            <Link href={`/${level}/${subjectId}/quiz?mode=random`} className="font-semibold rounded-xl px-6 py-3"
              style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-2)", textDecoration: "none" }}>
              Take a free random mock instead
            </Link>
          </div>
        </div>
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
    const perfect = pct === 100;
    return (
      <div className="max-w-lg mx-auto pt-28 pb-20 px-4">
        <EmailLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onSuccess={(em, tok) => { signIn(em, tok); syncToCloud(subjectId); }} />
        <div className="rounded-2xl p-8 text-center" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
          <div className="text-4xl mb-4">{perfect ? "🏆" : excellent ? "🎉" : "💪"}</div>
          <h2 className="font-bold text-2xl mb-1" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            {isRetryMode ? "Review Complete" : "Practice Complete"}
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--text-2)" }}>
            {MODE_LABELS[mode]} {mode === "topical" ? `— Chapter ${chapter}` : ""} finished.
          </p>

          {/* Score ring */}
          <div className="inline-flex flex-col items-center justify-center rounded-2xl px-10 py-6 mb-6"
            style={{
              background: perfect ? "color-mix(in srgb, var(--green) 12%, transparent)" : excellent ? "color-mix(in srgb, var(--green) 8%, transparent)" : "rgba(251,191,36,0.08)",
              border: `1px solid ${perfect ? "color-mix(in srgb, var(--green) 50%, transparent)" : excellent ? "color-mix(in srgb, var(--green) 30%, transparent)" : "rgba(251,191,36,0.3)"}`,
            }}>
            <div className="font-black" style={{ fontSize: "3.5rem", color: perfect ? "var(--green)" : excellent ? "var(--green)" : "#fbbf24", lineHeight: 1 }}>
              {pct}%
            </div>
            <div className="text-sm font-bold mt-1" style={{ color: "var(--text-3)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              {score} / {questions.length} correct
            </div>
            {perfect && <p className="text-xs mt-2 font-bold" style={{ color: "var(--green)" }}>Perfect Score! 🌟</p>}
            {mode === "exam" && timeUsed !== null && (
              <p className="text-xs mt-2 font-semibold" style={{ color: "var(--text-3)" }}>
                <Timer className="w-3 h-3 inline -mt-0.5" /> {fmtClock(timeUsed)} of {fmtClock(questions.length * SECONDS_PER_QUESTION)} used
              </p>
            )}
          </div>

          {/* Cloud sync prompt for non-logged-in users */}
          {!auth && (
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold mb-5 cursor-pointer transition-colors"
              style={{ background: "color-mix(in srgb, var(--green) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--green) 25%, transparent)", color: "var(--green)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "color-mix(in srgb, var(--green) 15%, transparent)")}
              onMouseLeave={e => (e.currentTarget.style.background = "color-mix(in srgb, var(--green) 8%, transparent)")}
            >
              <CloudUpload className="w-4 h-4" /> Save progress to email
            </button>
          )}
          {auth && (
            <p className="text-xs mb-5 font-medium" style={{ color: isSyncing ? "#fbbf24" : "var(--green)" }}>
              {isSyncing ? "⏳ Syncing…" : `☁ Synced to ${auth.email}`}
            </p>
          )}

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
                if (mode === "all") { const s = [...allQuestions].sort(() => Math.random() - 0.5); setQuestions(s); updateMarathonState(s.map(q => q.id), 0, 0, subjectId); }
                else if (mode === "random") setQuestions([...allQuestions].sort(() => Math.random() - 0.5).slice(0, level.toLowerCase() === "prc" ? 50 : 10));
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

        <a
          href={`https://wa.me/?text=${encodeURIComponent(`I scored ${pct}% on a ${subjectId.toUpperCase()} ${MODE_LABELS[mode]} at The CA Hub 📚 Free ICAP MCQs: https://www.thecahub.com/${level}/${subjectId}`)}`}
          target="_blank" rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold text-white text-sm"
          style={{ background: "#25D366", textDecoration: "none" }}>
          Share score on WhatsApp
        </a>

        {!pro && !proLoading && (
          <Link href="/pro" className="mt-5 flex items-center gap-3 rounded-2xl p-4 text-left"
            style={{ background: "rgba(245,166,35,0.07)", border: "1px solid rgba(245,166,35,0.3)", textDecoration: "none" }}>
            <Crown className="w-6 h-6 shrink-0" style={{ color: "var(--gold)" }} />
            <span className="text-sm" style={{ color: "var(--text-2)" }}>
              <strong style={{ color: "var(--text-1)" }}>Sit unlimited timed exams, ad-free.</strong> Go Pro for less than the cost of one past-paper book.
            </span>
          </Link>
        )}
        <AdSlot />
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
          {mode === "exam" && timeLeft !== null && (
            <span className="inline-flex items-center gap-1 text-sm font-black px-3 py-2 rounded-xl tabular-nums"
              style={{
                background: timeLeft < 60 ? "rgba(248,113,113,0.12)" : "var(--bg-2)",
                color: timeLeft < 60 ? "#f87171" : "var(--text-1)",
                border: `1px solid ${timeLeft < 60 ? "rgba(248,113,113,0.4)" : "var(--border)"}`,
              }}>
              <Timer className="w-4 h-4" /> {fmtClock(Math.max(timeLeft, 0))}
            </span>
          )}
          {currentStreak > 2 && (
            <span className="text-xs font-black px-3 py-1.5 rounded-full animate-pulse"
              style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }}>
              🔥 {currentStreak} streak
            </span>
          )}
          <div className="text-sm font-bold px-4 py-2 rounded-xl"
            style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
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
