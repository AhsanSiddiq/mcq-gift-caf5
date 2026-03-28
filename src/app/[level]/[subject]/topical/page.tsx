"use client";

import { BookOpen, ChevronRight, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function TopicalPage() {
  const params = useParams();
  const level = (params?.level as string) || "caf";
  const subjectId = (params?.subject as string) || "caf-5";
  const { progress, isLoaded } = useProgress();
  const [mounted, setMounted] = useState(false);
  const [chapters, setChapters] = useState<[number, string, number][]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => { 
    setMounted(true);
    setIsFetching(true);
    fetch(`/api/questions?subject=${subjectId}`)
      .then((r) => r.json())
      .then((data) => {
        const questions = data.questions || [];
        const map = new Map<number, { title: string; count: number }>();
        questions.forEach((q: any) => {
          if (!map.has(q.chapter)) {
            map.set(q.chapter, { title: q.topic || `Chapter ${q.chapter}`, count: 1 });
          } else {
            map.get(q.chapter)!.count++;
          }
        });
        const arr = Array.from(map.entries())
          .sort((a, b) => a[0] - b[0])
          .map(([ch, info]) => [ch, info.title, info.count] as [number, string, number]);
        setChapters(arr);
      })
      .catch(console.error)
      .finally(() => setIsFetching(false));
  }, [subjectId]);

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-28 pb-20">

        {/* Back */}
        <Link href={`/${level}/${subjectId}`}
          className="inline-flex items-center gap-2 text-sm font-semibold mb-10 transition-colors"
          style={{ color: "var(--text-3)", textDecoration: "none" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-1)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-3)")}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Subject
        </Link>

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            Topical Practice
          </p>
          <h1 className="font-bold mb-2"
            style={{ fontSize: "clamp(1.6rem,4vw,2.5rem)", color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif", lineHeight: 1.15 }}>
            Select a Chapter
          </h1>
          <p style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif", fontSize: 15 }}>
            Work through each syllabus area one chapter at a time.
          </p>
        </div>

        {/* Chapter grid */}
        <div className="flex flex-col gap-3">
          {isFetching ? (
            /* Skeleton loaders */
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 flex items-center justify-between gap-4 animate-pulse"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
              >
                <div className="flex-1 min-w-0 flex flex-col gap-2.5">
                  <span className="rounded" style={{ display: "block", height: 11, width: 80, background: "var(--border)" }} />
                  <span className="rounded" style={{ display: "block", height: 16, width: `${55 + i * 8}%`, background: "var(--border)" }} />
                  <span className="rounded" style={{ display: "block", height: 11, width: 70, background: "var(--border)" }} />
                </div>
                <span className="rounded shrink-0" style={{ width: 20, height: 20, background: "var(--border)", display: "block" }} />
              </div>
            ))
          ) : chapters.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">📭</p>
              <p className="font-bold text-lg mb-1" style={{ color: "var(--text-1)" }}>No chapters found</p>
              <p className="text-sm" style={{ color: "var(--text-2)" }}>This subject has no questions available yet.</p>
            </div>
          ) : (
            chapters.map(([chapterNum, title, numQuestions], index) => {
              const chapterProgress = progress.chapters[chapterNum];
              const hasScore = mounted && isLoaded && chapterProgress !== undefined;
              const score = hasScore ? chapterProgress.highestScore : 0;
              const isMastered = hasScore && chapterProgress.isCompleted;

              const isCaf4 = subjectId === "caf-4";
              const prevChapterNum = index > 0 ? chapters[index - 1][0] : 0;
              
              const showBusinessLawHeader = isCaf4 && index === 0 && chapterNum <= 15;
              const showCompanyLawHeader = isCaf4 && prevChapterNum <= 15 && chapterNum > 15;
              const displayChapterNum = isCaf4 && chapterNum > 15 ? chapterNum - 15 : chapterNum;

              return (
                <React.Fragment key={chapterNum}>
                  {showBusinessLawHeader && (
                    <div className="flex flex-col gap-1 mt-2 mb-1 px-2">
                       <h2 className="font-bold text-xl" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>Part I: Business Law</h2>
                       <p className="text-sm" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>Chapters 1 to 15 covering the legal system and contract laws.</p>
                    </div>
                  )}
                  {showCompanyLawHeader && (
                    <div className="flex flex-col gap-1 mt-6 mb-1 px-2">
                       <h2 className="font-bold text-xl" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>Part II: Company Law</h2>
                       <p className="text-sm" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>Chapters 1 to 10 covering the Companies Act, 2017.</p>
                    </div>
                  )}
                  <Link
                    href={`/${level}/${subjectId}/quiz?mode=topical&chapter=${chapterNum}`}
                    className="group rounded-2xl p-5 flex items-center justify-between gap-4 transition-all duration-200"
                    style={{
                      background: isMastered ? "rgba(61,179,113,0.06)" : "var(--bg-2)",
                      border: `1px solid ${isMastered ? "rgba(61,179,113,0.35)" : "var(--border)"}`,
                      textDecoration: "none",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = isMastered ? "var(--green)" : "#60a5fa";
                      (e.currentTarget as HTMLElement).style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = isMastered ? "rgba(61,179,113,0.35)" : "var(--border)";
                      (e.currentTarget as HTMLElement).style.transform = "none";
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-widest"
                          style={{ color: isMastered ? "var(--green)" : "#60a5fa", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                          Chapter {displayChapterNum}
                        </span>
                        {isMastered && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--green)" }} />}
                      </div>
                      <h3 className="font-bold text-base leading-snug mb-2"
                        style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                        {title}
                      </h3>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-3)" }}>
                          <BookOpen className="w-3.5 h-3.5" /> {numQuestions} questions
                        </span>
                        {hasScore && score > 0 && (
                          <span className="text-xs font-semibold" style={{ color: isMastered ? "var(--green)" : "#60a5fa" }}>
                            Best: {score}/{numQuestions}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1"
                      style={{ color: isMastered ? "var(--green)" : "var(--text-3)" }} />
                  </Link>
                </React.Fragment>
              );
            })
          )}
        </div>

      </div>
    </main>
  );
}
