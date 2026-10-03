"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Flame, Share2, Copy, Check, CalendarDays, ArrowRight } from "lucide-react";
import MCQCard from "@/components/MCQCard";
import AdSlot from "@/components/AdSlot";
import type { MCQ } from "@/data/mcqs";

const STORE_KEY = "cah_daily_v1";

interface DailyStore {
  streak: number;
  best: number;
  last?: string; // last completed date
  history: Record<string, { score: number; grid: string }>;
}

const STORE_EVENT = "cah:daily-changed";

function readRaw(): string | null {
  try { return localStorage.getItem(STORE_KEY); } catch { return null; }
}

function parseStore(raw: string | null): DailyStore {
  try {
    if (raw) return { history: {}, streak: 0, best: 0, ...JSON.parse(raw) };
  } catch { /* corrupted */ }
  return { streak: 0, best: 0, history: {} };
}

function writeStore(s: DailyStore) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
  window.dispatchEvent(new Event(STORE_EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(STORE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => { window.removeEventListener(STORE_EVENT, cb); window.removeEventListener("storage", cb); };
}

function prevDate(date: string): string {
  return new Date(Date.parse(date + "T00:00:00Z") - 86_400_000).toISOString().slice(0, 10);
}

function useCountdownToNextDay() {
  const [left, setLeft] = useState("");
  useEffect(() => {
    const tick = () => {
      const nowPkt = Date.now() + 5 * 3600_000;
      const nextMidnight = Math.ceil(nowPkt / 86_400_000) * 86_400_000;
      const s = Math.max(0, Math.floor((nextMidnight - nowPkt) / 1000));
      setLeft(`${Math.floor(s / 3600)}h ${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}m`);
    };
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);
  return left;
}

export default function DailyChallenge({ date, number, subject, questions }: {
  date: string;
  number: number;
  subject: { id: string; title: string; level: string };
  questions: MCQ[];
}) {
  const raw = useSyncExternalStore(subscribe, readRaw, () => undefined);
  const store = useMemo(() => (raw === undefined ? null : parseStore(raw)), [raw]);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [copied, setCopied] = useState(false);
  const countdown = useCountdownToNextDay();
  const code = subject.id.toUpperCase();

  const today = store?.history[date];
  const phase: "intro" | "playing" | "done" = today ? "done" : playing ? "playing" : "intro";
  const score = today?.score ?? results.filter(Boolean).length;
  const grid = today?.grid ?? results.map((r) => (r ? "🟩" : "🟥")).join("");

  const shareText = useMemo(
    () =>
      `The CA Hub Daily #${number} · ${code}\n${grid} ${score}/${questions.length}\n` +
      (store && store.streak > 1 ? `🔥 ${store.streak}-day streak\n` : "") +
      `Can you beat me? https://thecahub.com/daily`,
    [number, code, grid, score, questions.length, store]
  );

  const finish = (final: boolean[]) => {
    const s = parseStore(readRaw());
    const streak = s.last === date ? s.streak : s.last === prevDate(date) ? s.streak + 1 : 1;
    const next: DailyStore = {
      streak,
      best: Math.max(s.best, streak),
      last: date,
      history: { ...s.history, [date]: { score: final.filter(Boolean).length, grid: final.map((r) => (r ? "🟩" : "🟥")).join("") } },
    };
    writeStore(next);
    setPlaying(false);
  };

  const card = { background: "var(--bg-2)", border: "1px solid var(--border)" };
  const heading = { color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" };

  if (questions.length === 0) {
    return <p className="text-center pt-32" style={{ color: "var(--text-2)" }}>Today&apos;s challenge is loading — please refresh in a minute.</p>;
  }

  if (phase === "playing") {
    const q = questions[index];
    return (
      <div className="max-w-3xl mx-auto w-full pt-20 sm:pt-24 pb-20 px-3 sm:px-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold" style={{ color: "var(--text-3)" }}>Daily #{number} · {code}</span>
          <span className="text-sm font-bold px-4 py-2 rounded-xl" style={{ ...card, color: "var(--text-1)" }}>
            {index + 1} <span style={{ color: "var(--text-3)" }}>/ {questions.length}</span>
          </span>
        </div>
        <div className="flex gap-1 mb-5">
          {questions.map((_, i) => (
            <span key={i} className="h-2 flex-1 rounded-full"
              style={{ background: i < results.length ? (results[i] ? "var(--green)" : "#f87171") : "var(--border)" }} />
          ))}
        </div>
        <div key={q.id}>
          <MCQCard
            mcq={q}
            isLast={index === questions.length - 1}
            onAnswer={(ok) => setResults((r) => (r.length > index ? r : [...r, ok]))}
            onNext={() => {
              if (index < questions.length - 1) setIndex((i) => i + 1);
              else finish(results);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 pt-24 sm:pt-28 pb-20">
      <p className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: "var(--gold)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
        <CalendarDays className="w-4 h-4" /> Daily Challenge #{number}
      </p>

      {phase === "intro" ? (
        <>
          <h1 className="font-bold mb-3" style={{ ...heading, fontSize: "clamp(1.9rem,5vw,2.8rem)", lineHeight: 1.1 }}>
            10 questions. <span style={{ color: "var(--green)" }}>Once a day.</span>
          </h1>
          <p className="mb-8" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
            Today&apos;s topic is <strong style={{ color: "var(--text-1)" }}>{code} {subject.title}</strong>. Everyone gets the same questions,
            so share your score with your study group. A new challenge unlocks every midnight (Pakistan time).
          </p>
          <div className="rounded-2xl p-5 mb-6 flex items-center justify-between" style={card}>
            <span className="flex items-center gap-2 font-bold" style={{ color: "var(--text-1)" }}>
              <Flame className="w-5 h-5" style={{ color: "var(--gold)" }} /> Streak: {store?.streak ?? 0}
            </span>
            <span className="text-sm" style={{ color: "var(--text-3)" }}>Best: {store?.best ?? 0}</span>
          </div>
          <button onClick={() => setPlaying(true)}
            className="w-full rounded-xl px-6 py-4 font-bold text-white cursor-pointer transition-transform hover:scale-[1.01]"
            style={{ background: "var(--green)" }}>
            Start today&apos;s challenge
          </button>
        </>
      ) : (
        <>
          <h1 className="font-bold mb-2" style={{ ...heading, fontSize: "clamp(1.8rem,5vw,2.6rem)" }}>
            {score}/{questions.length} today {score === questions.length ? "🏆" : score >= 7 ? "🎉" : "💪"}
          </h1>
          <p className="text-3xl tracking-widest mb-4" aria-label={`${score} of ${questions.length} correct`}>{grid}</p>
          <p className="mb-6 flex items-center gap-2" style={{ color: "var(--text-2)" }}>
            <Flame className="w-5 h-5" style={{ color: "var(--gold)" }} />
            {store?.streak ?? 1}-day streak · best {store?.best ?? 1} · next challenge in {countdown}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-bold text-white"
              style={{ background: "#25D366", textDecoration: "none" }}>
              <Share2 className="w-4 h-4" /> Share on WhatsApp
            </a>
            <button
              onClick={async () => {
                if (navigator.share) { try { await navigator.share({ text: shareText }); return; } catch { /* cancelled */ } }
                await navigator.clipboard?.writeText(shareText);
                setCopied(true); setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-bold cursor-pointer"
              style={{ ...card, color: "var(--text-1)" }}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? "Copied!" : "Share / copy result"}
            </button>
          </div>

          <div className="rounded-2xl p-5 mb-4" style={card}>
            <p className="font-bold mb-1" style={heading}>Keep going while it&apos;s fresh</p>
            <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>
              Revise today&apos;s topic properly — read the full {code} question bank or take a timed mock.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link href={`/${subject.level}/${subject.id}/mcqs`} className="flex-1 text-center rounded-xl px-4 py-2.5 text-sm font-bold"
                style={{ background: "var(--bg-3)", color: "var(--text-1)", textDecoration: "none" }}>
                {code} question bank
              </Link>
              <Link href={`/${subject.level}/${subject.id}/quiz?mode=exam`} className="flex-1 text-center rounded-xl px-4 py-2.5 text-sm font-bold text-white inline-flex items-center justify-center gap-1"
                style={{ background: "var(--green)", textDecoration: "none" }}>
                Timed exam <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <AdSlot />
        </>
      )}
    </div>
  );
}
