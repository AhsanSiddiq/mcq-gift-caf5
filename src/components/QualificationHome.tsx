"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Crown, Timer } from "lucide-react";
import { EXAM_BODIES, BODY_COOKIE, getBody } from "@/data/regions";
import { allSubjects, subjectBody, subjectCode, LEVEL_LABEL, type BodyId } from "@/data/subjects";
import { applyBodyTheme } from "@/lib/bodyTheme";

/**
 * Home-page heroes for non-ICAP visitors. All variants are in the static HTML; CSS shows the
 * one matching <html data-body> (see globals.css), so there's no flash and nothing is cloaked —
 * crawlers (and ICAP visitors) see the original ICAP home.
 */

const LIVE_BODIES: BodyId[] = ["icap", "acca", "icai", "cima", "icaew", "ima"];
const heading = { color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" } as const;
const card = { background: "var(--bg-2)", border: "1px solid var(--border)" } as const;

export function pickBody(id: string) {
  document.cookie = `${BODY_COOKIE}=${encodeURIComponent(id)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  applyBodyTheme();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function Picker({ current }: { current?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {LIVE_BODIES.map((id) => {
        const b = getBody(id)!;
        const active = id === current;
        return (
          <button key={id} type="button" onClick={() => pickBody(id)}
            className="rounded-full px-4 py-2 text-sm font-bold cursor-pointer inline-flex items-center gap-1.5"
            style={{ background: active ? "var(--green)" : "var(--bg-3)", color: active ? "#fff" : "var(--text-1)", border: "1px solid var(--border)" }}>
            <span aria-hidden>{b.flag}</span> {b.short}
          </button>
        );
      })}
    </div>
  );
}

function BodyHero({ id }: { id: BodyId }) {
  const b = getBody(id)!;
  const subjects = allSubjects.filter((s) => s.isAvailable && subjectBody(s) === id);
  const levels = Array.from(new Set(subjects.map((s) => s.level)));
  return (
    <section className={`home-for-body home-for-${id} px-6 md:px-16 pt-28 md:pt-36 pb-16`}>
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ ...heading, color: "var(--green)" }}>
          {b.flag} {b.qualification}
        </p>
        <h2 className="font-bold mb-5" style={{ ...heading, fontSize: "clamp(2.2rem,6vw,4rem)", lineHeight: 1.05 }}>
          Free {b.short} MCQs.<br /><span style={{ color: "var(--green)" }}>Built to get you through exam day.</span>
        </h2>
        <p className="max-w-2xl mb-8 text-base sm:text-lg" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
          {subjects.length} papers of exam-style questions with worked explanations, timed mock exams, an AI tutor and a daily
          10-question challenge. {b.tagline}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <Link href={`/exams/${id}#practice`} className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-bold text-white"
            style={{ background: "var(--green)", textDecoration: "none" }}>
            Start practising free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href={`/daily/${id}`} className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-bold"
            style={{ ...card, color: "var(--text-1)", textDecoration: "none" }}>
            <CalendarDays className="w-4 h-4" /> Today&apos;s daily challenge
          </Link>
        </div>

        {levels.map((level) => (
          <div key={level} className="mb-8">
            <h3 className="font-bold text-lg mb-3" style={heading}>{LEVEL_LABEL[level]}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {subjects.filter((s) => s.level === level).map((s) => (
                <Link key={s.id} href={`/${s.level.toLowerCase()}/${s.id}/mcqs`}
                  className="flex items-center justify-between gap-3 rounded-2xl px-5 py-4" style={{ ...card, textDecoration: "none" }}>
                  <span>
                    <span className="block text-xs font-black uppercase tracking-widest" style={{ color: "var(--green)" }}>{subjectCode(s)}</span>
                    <span className="block font-semibold text-sm" style={{ color: "var(--text-1)" }}>{s.title} MCQs</span>
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--text-3)" }} />
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-10 mb-10">
          {[
            { icon: <Timer className="w-5 h-5" />, t: "Timed mock exams", d: "Real exam pacing with auto-submit and a full score breakdown." },
            { icon: <CalendarDays className="w-5 h-5" />, t: "Daily streaks", d: `Ten fresh ${b.short} questions every day — share your score with your study group.` },
            { icon: <Crown className="w-5 h-5" />, t: "Pro when you need it", d: "Unlimited mocks, more AI-tutor explanations, no ads — priced for your country." },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl p-5" style={card}>
              <span style={{ color: "var(--green)" }}>{f.icon}</span>
              <p className="font-bold mt-2 mb-1" style={heading}>{f.t}</p>
              <p className="text-sm" style={{ color: "var(--text-2)", lineHeight: 1.6 }}>{f.d}</p>
            </div>
          ))}
        </div>

        <p className="text-sm mb-3" style={{ color: "var(--text-3)" }}>Studying something else? Switch qualification:</p>
        <Picker current={id} />
      </div>
    </section>
  );
}

function PickerHero() {
  const live = EXAM_BODIES.filter((b) => LIVE_BODIES.includes(b.id as BodyId));
  return (
    <section className="home-for-body home-for-other px-6 md:px-16 pt-28 md:pt-36 pb-16">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ ...heading, color: "var(--green)" }}>The CA Hub</p>
        <h2 className="font-bold mb-5" style={{ ...heading, fontSize: "clamp(2.2rem,6vw,4rem)", lineHeight: 1.05 }}>
          Free MCQ practice for<br /><span style={{ color: "var(--green)" }}>every accountancy qualification.</span>
        </h2>
        <p className="max-w-2xl mb-10 text-base sm:text-lg" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
          Pick your exam body to get your papers, timed mocks and a daily challenge — the site adapts to you.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {live.map((b) => (
            <button key={b.id} type="button" onClick={() => pickBody(b.id)}
              className="text-left rounded-2xl p-5 cursor-pointer" style={card}>
              <span className="text-2xl" aria-hidden>{b.flag}</span>
              <p className="font-bold mt-2" style={heading}>{b.short}</p>
              <p className="text-sm" style={{ color: "var(--text-2)", lineHeight: 1.5 }}>{b.qualification}</p>
            </button>
          ))}
        </div>
        <p className="text-sm mt-6" style={{ color: "var(--text-3)" }}>
          Not listed? <Link href="/exams" style={{ color: "var(--green)" }}>See every exam body</Link> and join the waitlist for yours.
        </p>
      </div>
    </section>
  );
}

export default function QualificationHome() {
  return (
    <>
      {(["acca", "icai", "cima", "icaew", "ima"] as BodyId[]).map((id) => <BodyHero key={id} id={id} />)}
      <PickerHero />
    </>
  );
}

export { Picker as QualificationPicker };
