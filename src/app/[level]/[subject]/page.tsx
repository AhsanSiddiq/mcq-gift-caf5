"use client";

import { ArrowRight, BookOpen, Shuffle, Target, PlayCircle, Bookmark, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useProgress } from "@/hooks/useProgress";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { allSubjects } from "@/data/subjects";

export default function SubjectHome() {
  const params = useParams();
  const level = (params?.level as string) || "caf";
  const subjectId = (params?.subject as string) || "caf-5";

  const currentSubject = allSubjects.find(s => s.id === subjectId) || {
    id: subjectId,
    title: "Subject",
    level: level.toUpperCase(),
    description: "",
    isAvailable: true,
  };

  const { progress, isLoaded, getTotalMasteredPoints } = useProgress();
  const [mounted, setMounted] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => { 
    setMounted(true); 
    fetch(`/api/questions?subject=${subjectId}`)
      .then((r) => r.json())
      .then((data) => setTotalQuestions(data.questions?.length || 0))
      .catch(console.error);
  }, [subjectId]);

  const masteredPoints = getTotalMasteredPoints();
  const masteryPct = Math.round((masteredPoints / totalQuestions) * 100) || 0;
  const isMarathonActive = isLoaded && progress.marathon.inProgress && progress.marathon.questionIds.length > 0;
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
      desc: "10 random questions under exam conditions. Great for warm-ups.",
      cta: "Start Mock",
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.10)",
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
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-28 pb-20">

        {/* Back */}
        <Link
          href="/practice"
          className="inline-flex items-center gap-2 text-sm font-semibold mb-10 transition-colors"
          style={{ color: "var(--text-3)", textDecoration: "none" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-1)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-3)")}
        >
          <ArrowLeft className="w-4 h-4" /> All Subjects
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ color: "var(--green)", background: "rgba(61,179,113,0.10)", border: "1px solid rgba(61,179,113,0.25)" }}
            >
              {currentSubject.id.toUpperCase()}
            </span>
          </div>
          <h1
            className="font-bold mb-3"
            style={{
              fontSize: "clamp(1.75rem,4vw,2.75rem)",
              color: "var(--text-1)",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              lineHeight: 1.15,
            }}
          >
            {currentSubject.title}
          </h1>
          <p style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif", fontSize: 16, lineHeight: 1.6 }}>
            {totalQuestions} hand-picked MCQs with explanations. Choose your practice mode below.
          </p>
        </div>

        {/* Progress bar */}
        {mounted && isLoaded && masteredPoints > 0 && (
          <div
            className="rounded-2xl p-5 mb-10 flex items-center gap-5"
            style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
          >
            <div
              className="shrink-0 rounded-xl flex items-center justify-center"
              style={{ width: 48, height: 48, background: "rgba(61,179,113,0.12)", color: "var(--green)" }}
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
                <span className="text-sm font-black" style={{ color: "var(--green)" }}>{masteryPct}%</span>
              </div>
              <div className="w-full rounded-full h-2" style={{ background: "var(--border)" }}>
                <div
                  className="h-2 rounded-full transition-all duration-700"
                  style={{ width: `${masteryPct}%`, background: "var(--green)" }}
                />
              </div>
              <p className="text-xs mt-1.5" style={{ color: "var(--text-3)" }}>
                {masteredPoints} of {totalQuestions} marked correct
              </p>
            </div>
          </div>
        )}

        {/* Mode cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MODES.map(mode => (
            <Link
              key={mode.id}
              href={mode.href}
              className="group rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200"
              style={{
                background: mode.highlighted ? mode.bg : "var(--bg-2)",
                border: `1px solid ${mode.highlighted ? mode.color + "66" : "var(--border)"}`,
                textDecoration: "none",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = mode.color;
                (e.currentTarget as HTMLElement).style.background = mode.bg;
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = mode.highlighted ? mode.color + "66" : "var(--border)";
                (e.currentTarget as HTMLElement).style.background = mode.highlighted ? mode.bg : "var(--bg-2)";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className="rounded-xl flex items-center justify-center shrink-0"
                  style={{ width: 44, height: 44, background: mode.bg, color: mode.color }}
                >
                  {mode.icon}
                </div>
                {mode.highlighted && (
                  <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: mode.color + "22", color: mode.color }}>
                    In Progress
                  </span>
                )}
              </div>
              <div>
                <h2 className="font-bold text-lg mb-1" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                  {mode.label}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
                  {mode.desc}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold mt-auto" style={{ color: mode.color }}>
                {mode.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
