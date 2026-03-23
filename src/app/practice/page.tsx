"use client";

import Link from "next/link";
import { prcSubjects, cafSubjects } from "@/data/subjects";
import { BookOpen, Lock } from "lucide-react";

const LEVEL_META: Record<string, { label: string; tag: string; color: string; bg: string; desc: string }> = {
  PRC: {
    label: "PRC",
    tag: "Foundation Stage",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.08)",
    desc: "Pre-Requisite Competency — the entry stage for every CA student.",
  },
  CAF: {
    label: "CAF",
    tag: "Certificate in Accounting & Finance",
    color: "var(--green)",
    bg: "rgba(61,179,113,0.08)",
    desc: "Eight papers covering accounting, tax, audit, law, and management.",
  },
};

function SubjectCard({ subject }: { subject: { id: string; title: string; level: string; isAvailable: boolean } }) {
  const meta = LEVEL_META[subject.level] ?? LEVEL_META.CAF;
  const num = subject.id.split("-")[1];

  if (!subject.isAvailable) {
    return (
      <div
        className="rounded-2xl p-3.5 sm:p-5 flex flex-col gap-2.5 relative overflow-hidden"
        style={{
          background: "var(--bg-2)",
          border: "1px solid var(--border)",
          opacity: 0.55,
          cursor: "not-allowed",
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <span
            className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ color: meta.color, background: meta.bg }}
          >
            {subject.level}-{num}
          </span>
          <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--text-3)" }} />
        </div>
        <p className="font-bold text-xs sm:text-sm leading-snug" style={{ color: "var(--text-2)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          {subject.title}
        </p>
        <p className="text-xs" style={{ color: "var(--text-3)" }}>Coming soon</p>
      </div>
    );
  }

  return (
    <Link
      href={`/${subject.level.toLowerCase()}/${subject.id}`}
      className="rounded-2xl p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-3 group transition-all duration-200"
      style={{
        background: "var(--bg-2)",
        border: `1px solid ${meta.color}55`,
        textDecoration: "none",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px ${meta.color}22`;
        (e.currentTarget as HTMLElement).style.borderColor = meta.color;
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        (e.currentTarget as HTMLElement).style.borderColor = `${meta.color}55`;
        (e.currentTarget as HTMLElement).style.transform = "none";
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ color: meta.color, background: meta.bg }}
        >
          {subject.level}-{num}
        </span>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: "#fff", background: meta.color }}>
          Live
        </span>
      </div>
      <p className="font-bold text-xs sm:text-sm leading-snug" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
        {subject.title}
      </p>
      <div className="flex items-center gap-1 text-xs font-semibold mt-auto" style={{ color: meta.color }}>
        <BookOpen className="w-3.5 h-3.5" /> Practice
      </div>
    </Link>
  );
}

function Section({
  level,
  subjects,
}: {
  level: "PRC" | "CAF";
  subjects: typeof prcSubjects;
}) {
  const meta = LEVEL_META[level];
  return (
    <section className="mb-14">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-2">
        <span
          className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.color}33` }}
        >
          {meta.label}
        </span>
        <span className="text-xs" style={{ color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>
          {meta.tag}
        </span>
      </div>
      <p className="text-sm mb-6" style={{ color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>
        {meta.desc}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {subjects.map(s => (
          <SubjectCard key={s.id} subject={s} />
        ))}
      </div>
    </section>
  );
}

export default function PracticePage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">

        {/* Hero */}
        <div className="mb-14">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}
          >
            Free MCQ Practice
          </p>
          <h1
            className="font-bold mb-4"
            style={{
              fontSize: "clamp(2rem,5vw,3.25rem)",
              color: "var(--text-1)",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              lineHeight: 1.1,
            }}
          >
            Pick a Subject.<br />
            <span style={{ color: "var(--green)" }}>Start Practicing.</span>
          </h1>
          <p
            className="text-base sm:text-lg max-w-xl"
            style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.7 }}
          >
            Topical drills, full-random mocks, and the all-question marathon. Every MCQ is hand-picked and explained.
          </p>
        </div>

        {/* Divider */}
        <div className="mb-14" style={{ borderTop: "1px solid var(--border)" }} />

        {/* Sections */}
        <Section level="PRC" subjects={prcSubjects} />
        <Section level="CAF" subjects={cafSubjects} />

      </div>
    </main>
  );
}
