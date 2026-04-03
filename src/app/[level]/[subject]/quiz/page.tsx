import React from "react";
import QuizInterface from "@/components/QuizInterface";
import { supabase } from "@/lib/supabase";
import { MCQ } from "@/data/mcqs";

function dbToMCQ(row: any): MCQ {
  const opts = (row.options ?? []).sort((a: any, b: any) => a.option_key.localeCompare(b.option_key));
  const correct = opts.find((o: any) => o.is_correct);
  return {
    id: row.id,
    chapter: row.chapter,
    chapterTitle: row.topic,
    question: row.question_text,
    options: opts.map((o: any) => `${o.option_key}) ${o.option_text}`),
    correctAnswer: correct ? `${correct.option_key}) ${correct.option_text}` : "",
    explanation: row.explanation,
  };
}

export const revalidate = 0; // Ensure fresh questions

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
    : "random";
  const chapter = chapterParam ? parseInt(chapterParam, 10) : undefined;

  const { data } = await supabase
    .from("questions")
    .select(`id, chapter, topic, question_text, explanation, options(option_key, option_text, is_correct)`)
    .eq("subject_id", subjectId)
    .eq("is_active", true)
    .order("chapter")
    .order("created_at");

  const mcqs = (data || []).map(dbToMCQ);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <QuizInterface mode={mode} chapter={chapter} initialQuestions={mcqs} />
    </div>
  );
}
