"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, Shuffle, Eye, ArrowRight, Search, ListChecks, Timer, X } from "lucide-react";
import { CATEGORIES, QUESTIONS, type InterviewCategory, type InterviewQuestion } from "@/data/interviewQuestions";

type Filter = InterviewCategory | "all";

function Answer({ item }: { item: InterviewQuestion }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--green)" }}>Approach</p>
        <p>{item.approach}</p>
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--green)" }}>Model answer outline</p>
        <ul className="space-y-1.5">
          {item.outline.map((o, i) => (
            <li key={i} className="flex gap-2"><span aria-hidden="true" style={{ color: "var(--green)" }}>▸</span><span>{o}</span></li>
          ))}
        </ul>
      </div>
      {item.avoid && (
        <p className="rounded-lg px-3 py-2 text-xs" style={{ background: "rgba(245,158,11,0.08)", color: "#d97706", border: "1px solid rgba(245,158,11,0.25)" }}>
          <b>Avoid:</b> {item.avoid}
        </p>
      )}
    </div>
  );
}

const catLabel = (c: InterviewCategory) => CATEGORIES.find(x => x.id === c)!.label;

export default function InterviewPrep() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [practice, setPractice] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return QUESTIONS.filter(x => (filter === "all" || x.category === filter) && (!q || (x.q + " " + x.approach + " " + x.outline.join(" ")).toLowerCase().includes(q)));
  }, [filter, query]);

  const counts = useMemo(() => Object.fromEntries(CATEGORIES.map(c => [c.id, QUESTIONS.filter(q => q.category === c.id).length])) as Record<InterviewCategory, number>, []);

  return (
    <div style={{ background: "var(--bg)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-3)" }} aria-hidden="true" />
            <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search questions (e.g. materiality, mistake)" aria-label="Search questions"
              className="w-full rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none" style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-1)" }} />
          </div>
          <button type="button" onClick={() => setPractice(true)} className="flex items-center justify-center gap-2 text-sm font-bold px-5 py-3 rounded-xl text-white"
            style={{ background: "var(--green)", cursor: "pointer", minHeight: 48 }}>
            <Shuffle className="w-4 h-4" /> Practice mode
          </button>
        </div>

        <div role="tablist" aria-label="Question categories" className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 mb-2 -mx-1 px-1">
          {([{ id: "all", label: "All" }, ...CATEGORIES] as { id: Filter; label: string }[]).map(c => {
            const on = filter === c.id;
            const n = c.id === "all" ? QUESTIONS.length : counts[c.id as InterviewCategory];
            return (
              <button key={c.id} role="tab" aria-selected={on} type="button" onClick={() => setFilter(c.id)}
                className="shrink-0 text-xs font-bold px-3.5 py-2 rounded-full whitespace-nowrap"
                style={{ background: on ? "var(--green)" : "var(--bg-2)", color: on ? "#fff" : "var(--text-2)", border: "1px solid var(--border)", cursor: "pointer", minHeight: 36 }}>
                {c.label} <span style={{ opacity: 0.7 }}>{n}</span>
              </button>
            );
          })}
        </div>
        {filter !== "all" && <p className="text-xs mb-4" style={{ color: "var(--text-3)" }}>{CATEGORIES.find(c => c.id === filter)!.blurb}</p>}

        <ol className="space-y-2 mt-3">
          {list.map((item, i) => {
            const isOpen = open === item.id;
            return (
              <li key={item.id} className="rounded-xl overflow-hidden" style={{ background: "var(--bg-2)", border: `1px solid ${isOpen ? "var(--green)" : "var(--border)"}` }}>
                <h3>
                  <button type="button" aria-expanded={isOpen} aria-controls={`a-${item.id}`} id={`q-${item.id}`} onClick={() => setOpen(isOpen ? null : item.id)}
                    className="w-full flex items-start gap-3 text-left px-4 py-3.5" style={{ cursor: "pointer", minHeight: 48 }}>
                    <span className="text-xs font-bold mt-0.5 w-6 shrink-0" style={{ color: "var(--text-3)" }}>{i + 1}.</span>
                    <span className="flex-1">
                      <span className="block text-sm sm:text-[15px] font-semibold" style={{ color: "var(--text-1)" }}>{item.q}</span>
                      {filter === "all" && <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>{catLabel(item.category)}</span>}
                    </span>
                    <ChevronDown className="w-4 h-4 mt-1 shrink-0 transition-transform" style={{ color: "var(--text-3)", transform: isOpen ? "rotate(180deg)" : "none" }} />
                  </button>
                </h3>
                {isOpen && (
                  <div id={`a-${item.id}`} role="region" aria-labelledby={`q-${item.id}`} className="px-4 pb-4 sm:pl-[52px]">
                    <Answer item={item} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        {list.length === 0 && <p className="text-sm py-8 text-center" style={{ color: "var(--text-3)" }}>No questions match “{query}”.</p>}

        <div className="mt-8 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-3" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
          <ListChecks className="w-6 h-6 shrink-0" style={{ color: "var(--green)" }} />
          <p className="text-sm flex-1" style={{ color: "var(--text-2)" }}>Interview booked? Make sure your <Link href="/cv-maker" className="underline font-semibold" style={{ color: "var(--green)" }}>CV</Link> and <Link href="/cv-maker/cover-letter" className="underline font-semibold" style={{ color: "var(--green)" }}>cover letter</Link> tell the same story you&apos;ll tell in the room.</p>
        </div>
      </div>

      {practice && <PracticeMode onClose={() => setPractice(false)} />}
    </div>
  );
}

/* ── Practice mode: one random question at a time, no repeats until the deck is done ── */

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function PracticeMode({ onClose }: { onClose: () => void }) {
  const [cats, setCats] = useState<InterviewCategory[]>(CATEGORIES.map(c => c.id));
  const [deck, setDeck] = useState<InterviewQuestion[]>(() => shuffle(QUESTIONS));
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const toggleCat = (c: InterviewCategory) => {
    const next = cats.includes(c) ? cats.filter(x => x !== c) : [...cats, c];
    if (!next.length) return;
    setCats(next);
    setDeck(shuffle(QUESTIONS.filter(q => next.includes(q.category))));
    setIdx(0); setRevealed(false); setElapsed(0);
  };
  const next = () => {
    if (idx + 1 >= deck.length) { setDeck(shuffle(deck)); setIdx(0); } else setIdx(idx + 1);
    setRevealed(false); setElapsed(0);
  };
  const item = deck[idx];
  const mm = String(Math.floor(elapsed / 60)).padStart(1, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="practice-q" className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6" style={{ background: "rgba(0,0,0,0.7)" }} onClick={onClose}>
      <div className="w-full sm:max-w-2xl max-h-[92svh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-5 sm:p-7" style={{ background: "var(--bg)", border: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            Practice · {idx + 1} / {deck.length}
          </p>
          <button type="button" onClick={onClose} aria-label="Close practice mode" className="p-2 rounded-lg" style={{ background: "var(--bg-3)", color: "var(--text-2)", cursor: "pointer" }}><X className="w-4 h-4" /></button>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {CATEGORIES.map(c => {
            const on = cats.includes(c.id);
            return (
              <button key={c.id} type="button" aria-pressed={on} onClick={() => toggleCat(c.id)} className="text-[11px] font-bold px-3 py-1.5 rounded-full"
                style={{ background: on ? "color-mix(in srgb, var(--green) 14%, transparent)" : "var(--bg-3)", color: on ? "var(--green)" : "var(--text-3)", border: `1px solid ${on ? "var(--green)" : "var(--border)"}`, cursor: "pointer" }}>
                {c.label}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-3)" }}>{catLabel(item.category)}</p>
        <h2 id="practice-q" className="font-display font-bold text-xl sm:text-2xl mb-3 leading-snug" style={{ color: "var(--text-1)" }}>{item.q}</h2>
        <p className="flex items-center gap-1.5 text-xs mb-5" style={{ color: elapsed > 120 ? "#d97706" : "var(--text-3)" }} aria-live="off">
          <Timer className="w-3.5 h-3.5" /> {mm}:{ss} — answer out loud; aim for 1–2 minutes.
        </p>
        {revealed ? (
          <div className="rounded-xl p-4 mb-5" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}><Answer item={item} /></div>
        ) : (
          <button type="button" onClick={() => setRevealed(true)} className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl mb-5"
            style={{ background: "var(--bg-2)", color: "var(--text-1)", border: "1px solid var(--border)", cursor: "pointer", minHeight: 48 }}>
            <Eye className="w-4 h-4" /> Show approach &amp; model answer
          </button>
        )}
        <button type="button" onClick={next} className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl text-white"
          style={{ background: "var(--green)", cursor: "pointer", minHeight: 48 }}>
          Next question <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
