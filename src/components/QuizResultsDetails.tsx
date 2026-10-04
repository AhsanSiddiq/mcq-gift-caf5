"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2, XCircle, ListChecks, BarChart3 } from "lucide-react";
import type { MCQ } from "@/data/mcqs";

const stripKey = (option: string) => option.replace(/^[A-Z]\)\s*/, "");
const heading = { color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" } as const;

/** Circular score gauge. Colour is semantic (ok / warn / bad), never the qualification accent. */
export function ScoreRing({ pct, score, total }: { pct: number; score: number; total: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const tone = pct >= 80 ? "var(--ok)" : pct >= 50 ? "var(--warn)" : "var(--bad)";
  return (
    <div className="relative mx-auto" style={{ width: 148, height: 148 }} role="img" aria-label={`Score ${pct} percent, ${score} of ${total} correct`}>
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={tone} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.2,0.7,0.2,1)" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden>
        <span className="font-black tabular-nums" style={{ fontSize: "2.4rem", lineHeight: 1, color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          {pct}%
        </span>
        <span className="text-xs font-semibold mt-1" style={{ color: "var(--text-2)" }}>{score} / {total} correct</span>
      </div>
    </div>
  );
}

/** Per-chapter accuracy for the questions in this run. Hidden when the run covered one chapter. */
export function ChapterBreakdown({ questions, incorrectIds }: { questions: MCQ[]; incorrectIds: string[] }) {
  const wrong = new Set(incorrectIds);
  const rows = new Map<number, { title: string; total: number; correct: number }>();
  for (const q of questions) {
    const row = rows.get(q.chapter) ?? { title: q.chapterTitle, total: 0, correct: 0 };
    row.total += 1;
    if (!wrong.has(q.id)) row.correct += 1;
    rows.set(q.chapter, row);
  }
  if (rows.size < 2) return null;
  // Weakest chapters first — that's where revision pays off.
  const sorted = [...rows.entries()].sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total || a[0] - b[0]);

  return (
    <section className="rounded-2xl p-5 sm:p-6" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }} aria-labelledby="breakdown-h">
      <h3 id="breakdown-h" className="font-bold text-base mb-1 flex items-center gap-2" style={heading}>
        <BarChart3 className="w-4 h-4" style={{ color: "var(--accent-ink)" }} aria-hidden /> By chapter
      </h3>
      <p className="text-xs mb-4" style={{ color: "var(--text-3)" }}>Weakest first — start your revision at the top.</p>
      <ul className="flex flex-col gap-3.5">
        {sorted.map(([ch, row]) => {
          const pct = Math.round((row.correct / row.total) * 100);
          const tone = pct >= 80 ? "var(--ok)" : pct >= 50 ? "var(--warn)" : "var(--bad)";
          return (
            <li key={ch}>
              <div className="flex items-baseline justify-between gap-3 mb-1.5">
                <span className="text-sm font-semibold leading-snug min-w-0" style={{ color: "var(--text-1)" }}>
                  <span style={{ color: "var(--text-3)" }}>Ch {ch} · </span>{row.title}
                </span>
                <span className="text-xs font-bold tabular-nums shrink-0" style={{ color: tone }}>{row.correct}/{row.total}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 3)}%`, background: tone, transition: "width 0.6s ease" }} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export interface ReviewItem { mcq: MCQ; chosen?: string }

/** Expandable list of missed questions: what you picked, the right answer, and the explanation. */
export function ReviewList({ items, title = "Review your wrong answers" }: { items: ReviewItem[]; title?: string }) {
  const [open, setOpen] = useState<string | null>(items[0]?.mcq.id ?? null);
  if (items.length === 0) return null;
  return (
    <section className="rounded-2xl p-5 sm:p-6" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }} aria-labelledby="review-h">
      <h3 id="review-h" className="font-bold text-base mb-1 flex items-center gap-2" style={heading}>
        <ListChecks className="w-4 h-4" style={{ color: "var(--bad)" }} aria-hidden /> {title}
      </h3>
      <p className="text-xs mb-4" style={{ color: "var(--text-3)" }}>{items.length} question{items.length === 1 ? "" : "s"} to learn from. Tap one to see why.</p>
      <ol className="flex flex-col gap-2">
        {items.map(({ mcq, chosen }, i) => {
          const isOpen = open === mcq.id;
          const panelId = `review-${mcq.id}`;
          return (
            <li key={mcq.id} className="rounded-xl overflow-hidden" style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
              <button type="button" onClick={() => setOpen(isOpen ? null : mcq.id)} aria-expanded={isOpen} aria-controls={panelId}
                className="focus-ring w-full text-left flex items-start gap-3 px-4 py-3 min-h-[48px]">
                <span className="shrink-0 text-xs font-black tabular-nums mt-0.5 w-5" style={{ color: "var(--text-3)" }}>{i + 1}.</span>
                <span className="flex-1 text-sm font-semibold leading-snug" style={{ color: "var(--text-1)" }}>{mcq.question}</span>
                <ChevronDown className="w-4 h-4 shrink-0 mt-0.5 transition-transform" style={{ color: "var(--text-3)", transform: isOpen ? "rotate(180deg)" : "none" }} aria-hidden />
              </button>
              {isOpen && (
                <div id={panelId} className="px-4 pb-4 pl-12 flex flex-col gap-2 text-sm quiz-in">
                  {chosen && chosen !== mcq.correctAnswer && (
                    <p className="flex items-start gap-2" style={{ color: "var(--text-2)" }}>
                      <XCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--bad)" }} aria-hidden />
                      <span><span className="sr-only">Your answer: </span><span style={{ color: "var(--bad)", fontWeight: 600 }}>{chosen.charAt(0)}.</span> {stripKey(chosen)}</span>
                    </p>
                  )}
                  <p className="flex items-start gap-2" style={{ color: "var(--text-1)" }}>
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--ok)" }} aria-hidden />
                    <span><span className="sr-only">Correct answer: </span><span style={{ color: "var(--ok)", fontWeight: 600 }}>{mcq.correctAnswer.charAt(0)}.</span> {stripKey(mcq.correctAnswer)}</span>
                  </p>
                  <p className="leading-relaxed mt-1 pt-2" style={{ color: "var(--text-2)", borderTop: "1px solid var(--border)" }}>{mcq.explanation}</p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
