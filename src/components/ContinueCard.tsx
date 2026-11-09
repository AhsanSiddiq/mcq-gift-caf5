"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw, Play } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { subjectCode } from "@/data/subjects";
import { chapterLabel, findSubject } from "@/lib/progressStats";
import { subjectHomeHref } from "@/lib/navigation";

/** Reads saved progress (read-only) and offers the most recent subject/chapter back to returning visitors. */

function ago(t: number): string {
  const mins = Math.round((Date.now() - t) / 60000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

export default function ContinueCard({ className = "", outerClassName }: { className?: string; /** Wraps the card in a div with these classes (only rendered when the card is). */ outerClassName?: string }) {
  const { progress, isLoaded } = useProgress();
  if (!isLoaded) return null;

  const attempts = Object.values(progress.attempts || {});
  let last = attempts[0];
  for (const a of attempts) if (!last || (a.t || 0) > (last.t || 0)) last = a;
  const marathon = progress.marathon;
  const marathonOn = marathon.inProgress && !!marathon.subjectId && marathon.questionIds.length > 0;

  const subjectId = last?.s ?? (marathonOn ? marathon.subjectId : undefined);
  const s = subjectId ? findSubject(subjectId) : undefined;
  if (!s || !s.isAvailable) return null;

  const home = subjectHomeHref(s);
  const code = subjectCode(s);
  const inSubject = attempts.filter((a) => a.s === s.id);
  const mistakes = inSubject.filter((a) => a.l === 0).length;
  const chapter = last && last.s === s.id ? last.c : undefined;
  const chapterDone = chapter !== undefined ? inSubject.filter((a) => a.c === chapter).length : 0;
  const resumeMarathon = marathonOn && marathon.subjectId === s.id;

  const primary = resumeMarathon
    ? { href: `${home}/quiz?mode=all`, label: `Resume marathon · Q${marathon.currentIndex + 1} of ${marathon.questionIds.length}` }
    : chapter !== undefined
      ? { href: `${home}/quiz?mode=topical&chapter=${chapter}`, label: `Continue ${chapterLabel(s.id, chapter)}` }
      : { href: home, label: `Open ${code}` };

  const card = (
    <section
      aria-labelledby="continue-h"
      className={`rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4 ${className}`}
      style={{ background: "var(--bg-2)", border: "1px solid color-mix(in srgb, var(--green) 35%, var(--border))" }}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          Continue where you left off
        </p>
        <h2 id="continue-h" className="font-bold text-base sm:text-lg leading-snug" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          {code} {s.title}
        </h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-3)" }}>
          {chapter !== undefined && <>{chapterLabel(s.id, chapter)} · {chapterDone} answered · </>}
          {inSubject.length} answered in total{last?.t ? ` · ${ago(last.t)}` : ""}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        <Link
          href={primary.href}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white"
          style={{ background: "var(--green)", textDecoration: "none" }}
        >
          <Play className="w-4 h-4" aria-hidden /> {primary.label}
        </Link>
        {mistakes > 0 && (
          <Link
            href={`${home}/quiz?mode=mistakes`}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold"
            style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-1)", textDecoration: "none" }}
          >
            <RotateCcw className="w-4 h-4" aria-hidden /> Review {mistakes} {mistakes === 1 ? "mistake" : "mistakes"}
          </Link>
        )}
        <Link
          href={home}
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold"
          style={{ color: "var(--text-2)", textDecoration: "none" }}
        >
          {code} home <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
  return outerClassName ? <div className={outerClassName}><div className="max-w-7xl mx-auto">{card}</div></div> : card;
}
