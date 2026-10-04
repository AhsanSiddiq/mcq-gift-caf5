"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { MCQ } from "@/data/mcqs";
import MCQCard from "@/components/MCQCard";
import { RotateCcw, ChevronLeft, CloudUpload, Timer, Crown, Flame, Bookmark, SearchX, Share2, ArrowRight, Trophy } from "lucide-react";
import { ScoreRing, ChapterBreakdown, ReviewList } from "@/components/QuizResultsDetails";
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
  // Option the student picked per question id (for the results review list).
  const [answers, setAnswers] = useState<Record<string, string>>({});
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

  const handleNext = (isCorrect: boolean, chosen?: string) => {
    if (chosen) { const id = questions[currentIndex].id; setAnswers((a) => ({ ...a, [id]: chosen })); }
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
      <div className="max-w-3xl mx-auto w-full pt-20 sm:pt-24 pb-20 px-3 sm:px-4 animate-pulse" role="status" aria-busy="true" aria-label="Loading questions">
        <div className="flex items-center justify-between mb-4 gap-2">
          <span className="rounded-xl" style={{ height: 44, width: 76, background: "var(--bg-2)", border: "1px solid var(--border)", display: "block" }} />
          <span className="rounded-xl" style={{ height: 44, width: 84, background: "var(--bg-2)", border: "1px solid var(--border)", display: "block" }} />
        </div>
        <div className="w-full h-1.5 rounded-full mb-5" style={{ background: "var(--border)" }}>
          <div className="h-1.5 rounded-full" style={{ width: "30%", background: "var(--green)", opacity: 0.35 }} />
        </div>
        <div className="rounded-2xl p-6 sm:p-8 flex flex-col gap-5" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
          <span className="rounded" style={{ display: "block", height: 13, width: 90, background: "var(--border)" }} />
          <span className="rounded" style={{ display: "block", height: 22, width: "80%", background: "var(--border)" }} />
          <span className="rounded" style={{ display: "block", height: 22, width: "55%", background: "var(--border)" }} />
          <div className="flex flex-col gap-3 mt-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="rounded-xl p-4 min-h-[52px] flex items-center gap-3" style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
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
    const Icon = mode === "flagged" ? Bookmark : SearchX;
    return (
      <div className="max-w-md mx-auto text-center pt-28 sm:pt-32 pb-24 px-5 quiz-in">
        <div className="mx-auto mb-5 w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "color-mix(in srgb, var(--green) 12%, transparent)", color: "var(--accent-ink)" }}>
          <Icon className="w-7 h-7" aria-hidden />
        </div>
        <h1 className="font-bold text-xl mb-2" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          {mode === "flagged" ? "No flagged questions yet" : "No questions found"}
        </h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: "var(--text-2)" }}>
          {mode === "flagged"
            ? "Tap the bookmark on any question while you practise and it will be saved here for a focused review."
            : "Nothing is available for this selection yet. Try another chapter or a random mock."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/${level}/${subjectId}/quiz?mode=random`}
            className="focus-ring inline-flex items-center justify-center gap-2 font-bold rounded-xl px-6 py-3 text-white"
            style={{ background: "var(--green)", textDecoration: "none" }}>
            Start a random mock <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
          <Link href={`/${level}/${subjectId}`}
            className="focus-ring inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-6 py-3"
            style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-1)", textDecoration: "none" }}>
            Back to subject
          </Link>
        </div>
      </div>
    );
  }

  /* ── Results screen ── */
  if (isFinished) {
    const pct = Math.round((score / questions.length) * 100);
    const perfect = pct === 100;
    const headline = perfect ? "Flawless." : pct >= 80 ? "Excellent work." : pct >= 50 ? "Solid effort — keep going." : "Good start. Let's close the gaps.";
    const reviewItems = incorrectIds
      .map((id) => questions.find((q) => q.id === id) ?? allQuestions.find((q) => q.id === id))
      .filter((q): q is MCQ => q !== undefined)
      .map((mcq) => ({ mcq, chosen: answers[mcq.id] }));
    const backHref = mode === "topical" ? `/${level}/${subjectId}/topical` : `/${level}/${subjectId}`;
    const btn = "focus-ring inline-flex items-center justify-center gap-2 font-bold rounded-xl px-5 py-3 text-sm min-h-[46px]";
    const primary = { background: "var(--green)", color: "#fff", textDecoration: "none", boxShadow: "0 4px 18px color-mix(in srgb, var(--green) 28%, transparent)" };
    const secondary = { background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-1)", textDecoration: "none" };
    return (
      <div className="max-w-2xl mx-auto pt-24 sm:pt-28 pb-20 px-4 flex flex-col gap-4 quiz-in">
        <EmailLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onSuccess={(em, tok) => { signIn(em, tok); syncToCloud(subjectId); }} />
        <section className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2 inline-flex items-center gap-1.5" style={{ color: "var(--accent-ink)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            {perfect && <Trophy className="w-3.5 h-3.5" aria-hidden />}
            {isRetryMode ? "Review complete" : `${MODE_LABELS[mode]}${mode === "topical" ? ` · Chapter ${chapter}` : ""} complete`}
          </p>
          <h1 className="font-bold text-2xl sm:text-[1.75rem] mb-6" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif", lineHeight: 1.2 }}>
            {headline}
          </h1>

          <ScoreRing pct={pct} score={score} total={questions.length} />

          {mode === "exam" && timeUsed !== null && (
            <p className="text-xs mt-3 font-semibold inline-flex items-center gap-1" style={{ color: "var(--text-2)" }}>
              <Timer className="w-3.5 h-3.5" aria-hidden /> {fmtClock(timeUsed)} of {fmtClock(questions.length * SECONDS_PER_QUESTION)} used
            </p>
          )}

          <div className={`mt-7 grid gap-2.5 ${incorrectIds.length > 0 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {incorrectIds.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const qs = incorrectIds.map((id) => allQuestions.find((q) => q.id === id)).filter((q): q is MCQ => q !== undefined);
                  setQuestions(qs); setCurrentIndex(0); setScore(0); setCurrentStreak(0);
                  setIncorrectIds([]); setIsFinished(false); setIsRetryMode(true);
                }}
                className={btn}
                style={primary}
              >
                <RotateCcw className="w-4 h-4" aria-hidden /> Retry {incorrectIds.length} wrong
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setCurrentIndex(0); setScore(0); setCurrentStreak(0);
                setIncorrectIds([]); setIsFinished(false); setIsRetryMode(false);
                if (mode === "all") { const s = [...allQuestions].sort(() => Math.random() - 0.5); setQuestions(s); updateMarathonState(s.map(q => q.id), 0, 0, subjectId); }
                else if (mode === "random") setQuestions([...allQuestions].sort(() => Math.random() - 0.5).slice(0, level.toLowerCase() === "prc" ? 50 : 10));
                else if (mode === "flagged") setQuestions(allQuestions.filter(q => (progress.flaggedQuestionIds || []).includes(q.id)));
              }}
              className={btn}
              style={secondary}
            >
              <RotateCcw className="w-4 h-4" aria-hidden /> Try again
            </button>
            <Link href={backHref} className={btn} style={incorrectIds.length > 0 ? secondary : primary}>
              {mode === "topical" ? "More chapters" : "Back to subject"}
            </Link>
          </div>

          {/* Cloud sync */}
          {!auth && (
            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="focus-ring mt-4 w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
              style={{ background: "transparent", border: "1px dashed color-mix(in srgb, var(--green) 40%, transparent)", color: "var(--accent-ink)" }}
            >
              <CloudUpload className="w-4 h-4" aria-hidden /> Save your progress to email
            </button>
          )}
          {auth && (
            <p className="text-xs mt-4 font-medium" role="status" style={{ color: isSyncing ? "var(--warn)" : "var(--accent-ink)" }}>
              {isSyncing ? "Syncing…" : `Synced to ${auth.email}`}
            </p>
          )}
        </section>

        <ChapterBreakdown questions={questions} incorrectIds={incorrectIds} />
        <ReviewList items={reviewItems} />

        <a
          href={`https://wa.me/?text=${encodeURIComponent(`I scored ${pct}% on a ${subjectId.toUpperCase()} ${MODE_LABELS[mode]} at The CA Hub 📚 Free MCQs with explanations: https://www.thecahub.com/${level}/${subjectId}`)}`}
          target="_blank" rel="noopener noreferrer"
          className="focus-ring flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold text-white text-sm min-h-[46px]"
          style={{ background: "#1FAF55", textDecoration: "none" }}>
          <Share2 className="w-4 h-4" aria-hidden /> Share score on WhatsApp
        </a>

        {!pro && !proLoading && (
          <Link href="/pro" className="focus-ring flex items-center gap-3 rounded-2xl p-4 text-left"
            style={{ background: "color-mix(in srgb, var(--gold) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--gold) 35%, transparent)", textDecoration: "none" }}>
            <Crown className="w-6 h-6 shrink-0" style={{ color: "var(--gold)" }} aria-hidden />
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
  const answeredCount = Math.min(questions.length, Math.max(currentIndex, score + incorrectIds.length));
  const progressPercent = (answeredCount / questions.length) * 100;
  const wrongSet = new Set(incorrectIds);
  const segmented = questions.length <= 30;
  const lowTime = timeLeft !== null && timeLeft < 60;

  return (
    <div className="max-w-3xl mx-auto w-full pt-20 sm:pt-24 pb-10 sm:pb-20 px-3 sm:px-4">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <Link
          href={mode === "topical" ? `/${level}/${subjectId}/topical` : `/${level}/${subjectId}`}
          aria-label="Exit quiz"
          className="focus-ring inline-flex items-center gap-1 text-sm font-semibold pl-2 pr-3 h-11 rounded-xl transition-colors"
          style={{ color: "var(--text-2)", background: "var(--bg-2)", border: "1px solid var(--border)", textDecoration: "none" }}
        >
          <ChevronLeft className="w-4 h-4" aria-hidden /> Exit
        </Link>

        <div className="min-w-0 flex-1 text-center hidden sm:block">
          <span className="text-xs font-bold uppercase tracking-widest truncate" style={{ color: "var(--text-3)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            {isRetryMode ? "Reviewing mistakes" : `${MODE_LABELS[mode]}${mode === "topical" && chapter ? ` · Ch ${chapter}` : ""}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {mode === "exam" && timeLeft !== null && (
            <span className="inline-flex items-center gap-1 text-sm font-black px-3 h-11 rounded-xl tabular-nums"
              aria-label={`Time left ${fmtClock(Math.max(timeLeft, 0))}`}
              style={{
                background: lowTime ? "color-mix(in srgb, var(--bad) 12%, transparent)" : "var(--bg-2)",
                color: lowTime ? "var(--bad)" : "var(--text-1)",
                border: `1px solid ${lowTime ? "color-mix(in srgb, var(--bad) 45%, transparent)" : "var(--border)"}`,
              }}>
              <Timer className="w-4 h-4" aria-hidden /> {fmtClock(Math.max(timeLeft, 0))}
            </span>
          )}
          {currentStreak > 2 && (
            <span className="quiz-in inline-flex items-center gap-1 text-xs font-black px-2.5 h-8 rounded-full"
              aria-label={`${currentStreak} correct in a row`}
              style={{ background: "color-mix(in srgb, var(--gold) 14%, transparent)", color: "var(--warn)", border: "1px solid color-mix(in srgb, var(--gold) 35%, transparent)" }}>
              <Flame className="w-3.5 h-3.5" aria-hidden /> {currentStreak}
            </span>
          )}
          <div className="inline-flex items-center text-sm font-bold px-3.5 h-11 rounded-xl tabular-nums"
            style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            {isRetryMode && <span className="mr-2 text-xs sm:hidden" style={{ color: "var(--bad)" }}>Review</span>}
            {currentIndex + 1}<span className="ml-1" style={{ color: "var(--text-3)" }}>/ {questions.length}</span>
          </div>
        </div>
      </div>

      {/* Progress — one segment per question for short sets (shows right/wrong at a glance), a bar for long ones */}
      <div role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answeredCount}
        className="mb-4 sm:mb-5">
        {segmented ? (
          <div className="flex gap-1">
            {questions.map((q, i) => {
              const done = i < answeredCount;
              const bg = done ? (wrongSet.has(q.id) ? "var(--bad)" : "var(--ok)") : i === currentIndex ? "color-mix(in srgb, var(--green) 45%, var(--border))" : "var(--border)";
              return <span key={q.id} className="h-1.5 flex-1 rounded-full transition-colors duration-300" style={{ background: bg }} />;
            })}
          </div>
        ) : (
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%`, background: "var(--green)" }} />
          </div>
        )}
      </div>

      {/* Card */}
      <div key={currentQ.id}>
        <MCQCard mcq={currentQ} onAnswer={handleNext} onNext={advanceQuestion} isLast={currentIndex === questions.length - 1} />
      </div>
    </div>
  );
}
