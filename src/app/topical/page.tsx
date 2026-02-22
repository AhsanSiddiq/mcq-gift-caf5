"use client";

import { BookOpen, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { mcqs } from "@/data/mcqs";
import { useProgress } from "@/hooks/useProgress";
import { useState, useEffect } from "react";

export default function TopicalPage() {
  const { progress, isLoaded } = useProgress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chaptersMap = new Map<number, string>();
  mcqs.forEach((mcq) => {
    if (!chaptersMap.has(mcq.chapter)) {
      chaptersMap.set(mcq.chapter, mcq.chapterTitle);
    }
  });

  const chapters = Array.from(chaptersMap.entries()).sort((a, b) => a[0] - b[0]);

  return (
    <div className="py-10 max-w-4xl mx-auto">
      
      <div className="mb-10 flex flex-col items-center text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Select a Chapter
        </h1>
        <p className="text-gray-600 max-w-xl">
          Choose a syllabus area to begin testing your knowledge on that specific topic.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {chapters.map(([chapterNum, title]) => {
          const numQuestions = mcqs.filter(q => q.chapter === chapterNum).length;
          const chapterProgress = progress.chapters[chapterNum];
          const hasScore = isLoaded && chapterProgress !== undefined;
          const score = hasScore ? chapterProgress.highestScore : 0;
          const isMastered = hasScore && chapterProgress.isCompleted;
          
          return (
            <Link 
              key={chapterNum}
              href={`/quiz?mode=topical&chapter=${chapterNum}`}
              className={`group p-6 rounded-lg border shadow-sm transition-all flex items-center justify-between cursor-pointer ${isMastered ? 'bg-green-50/30 border-green-200 hover:border-green-400 hover:shadow-md' : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md'}`}
            >
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`text-xs font-bold uppercase tracking-widest ${isMastered ? 'text-green-600' : 'text-blue-600'}`}>
                    Chapter {chapterNum}
                  </div>
                  {isMastered && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">
                  {title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                  <div className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" /> {numQuestions} Questions
                  </div>
                  {hasScore && score > 0 && (
                     <div className={`text-sm font-semibold flex items-center gap-1 transition-colors ${isMastered ? 'text-green-600' : 'text-blue-600'}`}>
                        Best: {score}/{numQuestions}
                     </div>
                  )}
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 transition-colors ${isMastered ? 'text-green-400 group-hover:text-green-600' : 'text-gray-400 group-hover:text-blue-600'}`} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
