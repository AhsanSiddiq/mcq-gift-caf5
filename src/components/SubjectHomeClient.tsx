"use client";

import { ArrowRight, BookOpen, Shuffle, Target, PlayCircle, Bookmark, ArrowLeft, CloudUpload, LogOut, Timer } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { useEffect, useState } from "react";
import EmailLoginModal from "@/components/EmailLoginModal";
import AdSlot from "@/components/AdSlot";
import { subjectCode, type Subject } from "@/data/subjects";
import SponsorSlot from "@/components/SponsorSlot";
import { motion, MotionConfig } from "framer-motion";

/** Mode hues are decorative; for text/icons mix toward the theme text colour so they pass contrast in light mode too. */
const ink = (c: string) => `color-mix(in srgb, ${c} 68%, var(--text-1))`;

interface SubjectHomeClientProps {
  level: string;
  subjectId: string;
  currentSubject: Subject;
  totalQuestions: number;
}

export default function SubjectHomeClient({ level, subjectId, currentSubject, totalQuestions }: SubjectHomeClientProps) {
  const { progress, isLoaded, getTotalMasteredPoints, auth, signIn, signOut, loadFromCloud, isSyncing } = useProgress(subjectId);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Load cloud progress when auth is present
  useEffect(() => {
    if (auth && isLoaded) {
      loadFromCloud(subjectId);
    }
  }, [auth, isLoaded, subjectId]); // eslint-disable-line

  const masteredPoints = getTotalMasteredPoints();
  const masteryPct = Math.round((masteredPoints / totalQuestions) * 100) || 0;

  // only active if this subject's marathon is in progress
  const isMarathonActive = isLoaded && progress.marathon.inProgress && progress.marathon.subjectId === subjectId && progress.marathon.questionIds.length > 0;
  const flaggedCount = isLoaded ? (progress.flaggedQuestionIds || []).length : 0;

  const MODES = [
    {
      id: "topical",
      label: "Topical",
      icon: <BookOpen className="w-5 h-5" />,
      href: `/${level}/${subjectId}/topical`,
      desc: "Select a specific chapter and work through it concept by concept.",
      cta: "Select Chapter",
      color: "#60a5fa",
      bg: "rgba(96,165,250,0.10)",
    },
    {
      id: "random",
      label: "Random Mock",
      icon: <Shuffle className="w-5 h-5" />,
      href: `/${level}/${subjectId}/quiz?mode=random`,
      desc: `${level.toLowerCase() === "prc" ? "50" : "10"} random questions under exam conditions. Great for warm-ups.`,
      cta: "Start Mock",
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.10)",
    },
    {
      id: "exam",
      label: "Exam Simulator",
      icon: <Timer className="w-5 h-5" />,
      href: `/${level}/${subjectId}/quiz?mode=exam`,
      desc: `${level.toLowerCase() === "prc" ? "50" : "30"} questions against the clock, auto-submitted when time's up. One free exam a day — unlimited with Pro.`,
      cta: "Start Timed Exam",
      color: "#F5A623",
      bg: "rgba(245,166,35,0.10)",
    },
    {
      id: "marathon",
      label: isMarathonActive ? "Resume Marathon" : "Marathon",
      icon: isMarathonActive ? <PlayCircle className="w-5 h-5" /> : <Target className="w-5 h-5" />,
      href: `/${level}/${subjectId}/quiz?mode=all`,
      desc: isMarathonActive
          ? `Pick up where you left off — ${progress.marathon.currentIndex} / ${totalQuestions} done.`
          : `All ${totalQuestions} questions. Auto-saves so you can resume anytime.`,
      cta: isMarathonActive ? "Continue" : "Start Marathon",
      color: "#fbbf24",
      bg: "rgba(251,191,36,0.10)",
      highlighted: isMarathonActive,
    },
    ...(flaggedCount > 0
      ? [{
          id: "flagged",
          label: "Review Flags",
          icon: <Bookmark className="w-5 h-5" />,
          href: `/${level}/${subjectId}/quiz?mode=flagged`,
          desc: `${flaggedCount} question${flaggedCount !== 1 ? "s" : ""} flagged. Revisit what tripped you up.`,
          cta: "Review Now",
          color: "#f87171",
          bg: "rgba(248,113,113,0.10)",
        }]
      : []),
  ];

  return (
    <MotionConfig reducedMotion="user">
    <main className="min-h-screen">
      <EmailLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={(em, tok) => { signIn(em, tok); loadFromCloud(subjectId); }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <Link
            href="/practice"
            className="focus-ring inline-flex items-center gap-2 text-sm font-semibold mb-6 sm:mb-8 -ml-2 px-2 py-2 rounded-lg transition-colors hover:text-[var(--text-1)]"
            style={{ color: "var(--text-2)", textDecoration: "none" }}
          >
            <ArrowLeft className="w-4 h-4" /> All Subjects
          </Link>
        </motion.div>

        {/* Header */}
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ color: "var(--accent-ink)", background: "color-mix(in srgb, var(--green) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--green) 25%, transparent)" }}
              >
                {subjectCode(currentSubject)}
              </span>
            </div>
            <h1
              className="font-bold mb-3"
              style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif", lineHeight: 1.15 }}
            >
              {currentSubject.title}
            </h1>
            <p className="text-[15px] sm:text-base" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.6 }}>
              {totalQuestions} hand-picked MCQs with explanations. Choose your practice mode below.
            </p>
          </motion.div>

          {/* Cloud Save / Auth */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="shrink-0">
            {auth ? (
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: "color-mix(in srgb, var(--green) 10%, transparent)", color: "var(--accent-ink)", border: "1px solid color-mix(in srgb, var(--green) 20%, transparent)" }}>
                  {isSyncing ? "⏳ Syncing…" : `☁ ${auth.email}`}
                </span>
                <button
                  onClick={signOut}
                  className="focus-ring flex items-center gap-1 text-xs cursor-pointer px-2 py-1.5 rounded-md hover:text-[var(--bad)]"
                  style={{ color: "var(--text-2)", background: "none", border: "none" }}
                >
                  <LogOut className="w-3 h-3" /> Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="focus-ring inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold cursor-pointer transition-colors hover:bg-[color-mix(in_srgb,var(--green)_15%,transparent)]"
                style={{ background: "color-mix(in srgb, var(--green) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--green) 25%, transparent)", color: "var(--accent-ink)" }}
              >
                <CloudUpload className="w-4 h-4" /> Save Progress
              </button>
            )}
          </motion.div>
        </div>

        {/* Progress bar */}
        {isLoaded && masteredPoints > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-4 sm:p-5 mb-8 sm:mb-10 flex items-center gap-4 sm:gap-5"
            style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
          >
            <div
              className="shrink-0 rounded-xl flex items-center justify-center"
              style={{ width: 48, height: 48, background: "color-mix(in srgb, var(--green) 12%, transparent)", color: "var(--accent-ink)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-6 h-6">
                <path d="M12 15v-3m0-3h.01M8.562 20.438A9 9 0 1 1 20.438 8.562" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <span className="text-sm font-bold" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                  Mastery Progress
                </span>
                <span className="text-sm font-black tabular-nums" style={{ color: "var(--accent-ink)" }}>{masteryPct}%</span>
              </div>
              <div className="w-full rounded-full h-2" style={{ background: "var(--border)" }}>
                <div
                  className="h-2 rounded-full transition-all duration-700 delay-300"
                  style={{ width: `${masteryPct}%`, background: "var(--green)" }}
                />
              </div>
              <p className="text-xs mt-1.5" style={{ color: "var(--text-2)" }}>
                {masteredPoints} of {totalQuestions} marked correct
              </p>
            </div>
          </motion.div>
        )}

        {/* Mode cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {MODES.map((mode, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              key={mode.id}
            >
              <Link
                href={mode.href}
                className="focus-ring lift group rounded-2xl p-4 sm:p-6 flex flex-row sm:flex-col items-start gap-4 h-full"
                style={{
                  background: mode.highlighted ? mode.bg : "var(--bg-2)",
                  border: `1px solid ${mode.highlighted ? mode.color + "66" : "var(--border)"}`,
                  textDecoration: "none",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = mode.color; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = mode.highlighted ? mode.color + "66" : "var(--border)"; }}
              >
                <div className="flex items-start justify-between gap-3 sm:w-full">
                  <div
                    className="rounded-xl flex items-center justify-center shrink-0"
                    style={{ width: 44, height: 44, background: mode.bg, color: ink(mode.color) }}
                    aria-hidden
                  >
                    {mode.icon}
                  </div>
                  {mode.highlighted && (
                    <span className="hidden sm:inline text-xs font-black px-2 py-0.5 rounded-full" style={{ background: mode.color + "22", color: ink(mode.color) }}>
                      In Progress
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-2 sm:gap-4 self-stretch">
                <div>
                  <h2 className="font-bold text-base sm:text-lg mb-1 flex items-center gap-2" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                    {mode.label}
                    {mode.highlighted && (
                      <span className="sm:hidden text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ background: mode.color + "22", color: ink(mode.color) }}>In progress</span>
                    )}
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
                    {mode.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold mt-auto" style={{ color: ink(mode.color) }}>
                  {mode.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden />
                </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <Link href={`/${level}/${subjectId}/mcqs`}
          className="focus-ring lift mt-6 sm:mt-8 flex items-center justify-between gap-4 rounded-2xl p-4 sm:p-5"
          style={{ background: "var(--bg-2)", border: "1px solid var(--border)", textDecoration: "none" }}>
          <span>
            <span className="block font-bold" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              Browse all {subjectCode(currentSubject)} MCQs with answers
            </span>
            <span className="block text-sm" style={{ color: "var(--text-2)" }}>Chapter-wise question bank with explanations — read, revise, then test yourself.</span>
          </span>
          <ArrowRight className="w-5 h-5 shrink-0" style={{ color: "var(--accent-ink)" }} aria-hidden />
        </Link>

        <SponsorSlot level={currentSubject.level} className="mt-4" />
        <AdSlot className="mt-10" />
      </div>
    </main>
    </MotionConfig>
  );
}
