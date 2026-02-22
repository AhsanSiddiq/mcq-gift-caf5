"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QuizInterface from "@/components/QuizInterface";

function QuizContent() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const chapterParam = searchParams.get("chapter");

  const mode = modeParam === "topical" ? "topical" : modeParam === "all" ? "all" : modeParam === "flagged" ? "flagged" : "random";
  const chapter = chapterParam ? parseInt(chapterParam, 10) : undefined;

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 md:py-16">
      <QuizInterface mode={mode} chapter={chapter} />
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
