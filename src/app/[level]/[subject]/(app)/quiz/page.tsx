import React from "react";
import QuizInterface from "@/components/QuizInterface";
import { getSubjectMCQs } from "@/lib/questionBank";

export default async function QuizPage({ params, searchParams }: { params: Promise<{ level: string; subject: string }>; searchParams: Promise<{ mode?: string; chapter?: string }> }) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const subjectId = resolvedParams.subject;
  const modeParam = resolvedSearch.mode;
  const chapterParam = resolvedSearch.chapter;

  const mode =
    modeParam === "topical" ? "topical"
    : modeParam === "all" ? "all"
    : modeParam === "flagged" ? "flagged"
    : modeParam === "exam" ? "exam"
    : "random";
  const chapter = chapterParam ? parseInt(chapterParam, 10) : undefined;

  // Cached for an hour (see getSubjectMCQs) — previously every quiz load re-fetched the whole bank.
  const mcqs = await getSubjectMCQs(subjectId);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <QuizInterface mode={mode} chapter={chapter} initialQuestions={mcqs} />
    </div>
  );
}
