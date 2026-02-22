"use client";

import { ArrowRight, BookOpen, Shuffle, Target, PlayCircle, Trophy, Bookmark } from "lucide-react";
import Link from "next/link";
import { mcqs } from "@/data/mcqs";
import { useProgress } from "@/hooks/useProgress";
import { useEffect, useState } from "react";

export default function Home() {
  const totalQuestions = mcqs.length;
  const { progress, isLoaded, getTotalMasteredPoints } = useProgress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const masteredPoints = getTotalMasteredPoints();
  const masteryPercentage = Math.round((masteredPoints / totalQuestions) * 100) || 0;
  const isMarathonActive = isLoaded && progress.marathon.inProgress && progress.marathon.questionIds.length > 0;
  const flaggedCount = isLoaded ? (progress.flaggedQuestionIds || []).length : 0;
  
  return (
    <div className="py-12 md:py-20 flex flex-col items-center">
      
      <div className="text-center max-w-3xl mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Management Accounting MCQs
        </h1>
        <p className="text-xl text-gray-600 bg-gray-50 inline-block px-4 py-1 rounded-md mb-6 border border-gray-200">
          CAF-5 Practice Portal
        </p>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Access a curated bank of {totalQuestions} highly relevant multiple-choice questions designed to test your core concepts and exam readiness.
        </p>

        {/* Progress Dashboard */}
        {mounted && isLoaded && (
          <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between text-left gap-6 max-w-md mx-auto">
             <div className="flex items-center gap-4">
               <div className="p-4 bg-teal-50 text-teal-600 rounded-full">
                 <Trophy className="w-8 h-8" />
               </div>
               <div>
                 <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total Mastery</p>
                 <p className="text-2xl font-black text-gray-900">{masteredPoints} <span className="text-lg font-medium text-gray-500">/ {totalQuestions}</span></p>
               </div>
             </div>
             
             <div className="w-full sm:w-1/3 flex flex-col items-center sm:items-end">
                <div className="text-3xl font-black text-teal-600 mb-1">{masteryPercentage}%</div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full transition-all duration-1000 ease-out" style={{ width: `${masteryPercentage}%` }} />
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        
        {/* Topical Practice */}
        <Link 
          href="/topical" 
          className="group block bg-white p-5 lg:p-6 rounded-xl border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex flex-col h-full"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Topical</h2>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed text-sm break-words flex-1">
            Select a specific chapter to master individual concepts sequentially.
          </p>
          <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors text-sm mt-auto">
            Select Chapter <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Random Mock */}
        <Link 
          href="/quiz?mode=random" 
          className="group block bg-white p-5 lg:p-6 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all flex flex-col h-full"
        >
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
              <Shuffle className="w-6 h-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Random Mock</h2>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed text-sm break-words flex-1">
            Test yourself under exam conditions with 10 questions drawn randomly.
          </p>
          <div className="flex items-center text-indigo-600 font-semibold group-hover:text-indigo-700 transition-colors text-sm mt-auto">
            Start Mock <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
        
        {/* Marathon Mode */}
        <Link 
          href="/quiz?mode=all" 
          className={`group block bg-white p-5 lg:p-6 rounded-xl border-2 shadow-sm transition-all flex flex-col h-full ${isMarathonActive ? 'border-amber-400 hover:shadow-md hover:bg-amber-50' : 'border-gray-200 hover:border-amber-500 hover:shadow-md'}`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-lg transition-colors shrink-0 ${isMarathonActive ? 'bg-amber-100 text-amber-600' : 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white'}`}>
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Marathon</h2>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed text-sm break-words flex-1">
            Challenge yourself with all {totalQuestions} questions. {isMarathonActive ? <span className="font-bold text-amber-600 block mt-1">Saved ({progress.marathon.currentIndex} / {totalQuestions}).</span> : "Auto-saves to resume."}
          </p>
          <div className={`flex items-center font-semibold transition-colors text-sm mt-auto ${isMarathonActive ? 'text-amber-700' : 'text-amber-600 group-hover:text-amber-700'}`}>
            {isMarathonActive ? (
              <><PlayCircle className="w-4 h-4 mr-2" /> Resume Marathon</>
            ) : (
              <>Start Marathon <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
            )}
          </div>
        </Link>

        {/* Flagged Review Card */}
        {flaggedCount > 0 ? (
          <Link 
            href="/quiz?mode=flagged" 
            className="group block bg-white p-5 lg:p-6 rounded-xl border border-gray-200 shadow-sm hover:border-rose-500 hover:shadow-md transition-all flex flex-col h-full"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-rose-50 rounded-lg text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors shrink-0">
                <Bookmark className="w-6 h-6" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Review Flags</h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed text-sm break-words flex-1">
              You have {flaggedCount} question{flaggedCount !== 1 && 's'} flagged. Revisit concepts you found difficult.
            </p>
            <div className="flex items-center text-rose-600 font-semibold group-hover:text-rose-700 transition-colors text-sm mt-auto">
              Review Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ) : (
          <div className="flex flex-col h-full bg-gray-50 bg-opacity-50 p-5 lg:p-6 rounded-xl border border-dashed border-gray-300 shadow-sm opacity-60">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gray-100 rounded-lg text-gray-400 shrink-0">
                <Bookmark className="w-6 h-6" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-500">Review Flags</h2>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm break-words flex-1">
              You haven't flagged any questions yet. Use the bookmark icon during a quiz to save questions here.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
