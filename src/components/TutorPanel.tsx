"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Loader2 } from "lucide-react";

const AUTH_KEY = "mcq_gift_auth_v1";
let enabledPromise: Promise<boolean> | null = null;
function tutorEnabled(): Promise<boolean> {
  enabledPromise ??= fetch("/api/tutor")
    .then((r) => r.json())
    .then((d) => !!d.enabled)
    .catch(() => false);
  return enabledPromise;
}

type Mode = "why" | "simpler" | "mistake";

/** "Ask the AI tutor" under an answered MCQ. Hidden entirely until the tutor is configured. */
export default function TutorPanel({ questionId, chosenKey, isCorrect }: { questionId: string; chosenKey?: string; isCorrect: boolean }) {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode | null>(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [upgrade, setUpgrade] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    tutorEnabled().then((v) => alive && setEnabled(v));
    return () => { alive = false; };
  }, []);

  if (!enabled) return null;

  const ask = async (m: Mode) => {
    setMode(m); setLoading(true); setError(""); setAnswer(""); setUpgrade(false);
    let auth: { email?: string; token?: string } = {};
    try { auth = JSON.parse(localStorage.getItem(AUTH_KEY) || "{}"); } catch { /* ignore */ }
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, mode: m, chosen: chosenKey, ...auth }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); setUpgrade(!!data.upgrade); }
      else setAnswer(data.answer);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  const chip = (m: Mode, label: string) => (
    <button key={m} type="button" onClick={() => ask(m)} disabled={loading}
      className="text-xs font-bold px-3 py-2 rounded-full cursor-pointer disabled:opacity-60 transition-colors"
      style={{ background: mode === m ? "rgba(167,139,250,0.18)" : "var(--bg-3)", color: mode === m ? "#a78bfa" : "var(--text-2)", border: "1px solid var(--border)" }}>
      {label}
    </button>
  );

  return (
    <div className="rounded-xl p-4 mb-6" style={{ background: "rgba(167,139,250,0.06)", borderLeft: "3px solid #a78bfa" }}>
      <p className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color: "#a78bfa" }}>
        <Sparkles className="w-3.5 h-3.5" /> Ask the AI tutor
      </p>
      <div className="flex flex-wrap gap-2">
        {chip("why", "Explain step by step")}
        {chip("simpler", "Explain it simpler")}
        {!isCorrect && chosenKey && chip("mistake", "Why was my answer wrong?")}
      </div>
      {loading && (
        <p className="text-sm mt-3 flex items-center gap-2" style={{ color: "var(--text-3)" }}>
          <Loader2 className="w-4 h-4 animate-spin" /> Thinking it through…
        </p>
      )}
      {answer && (
        <p className="text-sm leading-relaxed mt-3 whitespace-pre-line" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
          {answer}
        </p>
      )}
      {error && (
        <p className="text-sm mt-3" style={{ color: "#f87171" }}>
          {error}{" "}
          {upgrade && <Link href="/pro" style={{ color: "var(--gold)", fontWeight: 700 }}>Go Pro for 40 a day →</Link>}
        </p>
      )}
    </div>
  );
}
