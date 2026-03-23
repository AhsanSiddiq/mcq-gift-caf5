"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QuizInterface from "@/components/QuizInterface";

function QuizContent() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const chapterParam = searchParams.get("chapter");

  const mode =
    modeParam === "topical" ? "topical"
    : modeParam === "all" ? "all"
    : modeParam === "flagged" ? "flagged"
    : "random";
  const chapter = chapterParam ? parseInt(chapterParam, 10) : undefined;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <QuizInterface mode={mode} chapter={chapter} />
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center gap-4 py-40">
          <div className="w-10 h-10 rounded-full border-2 animate-spin"
            style={{ borderColor: "var(--border)", borderTopColor: "var(--green)" }} />
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
