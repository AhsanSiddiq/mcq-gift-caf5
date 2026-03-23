import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | The CA Hub – Muhammad Ahsan Siddiq",
  description: "Learn about Muhammad Ahsan Siddiq, the first student in ICAP's 64-year history to clear all 6 CFAP papers in a single attempt, and why he built The CA Hub.",
};

export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
      <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "var(--green)" }}>The Story</p>
      <h1 className="font-display font-bold text-4xl md:text-5xl mb-6" style={{ color: "var(--text-1)", lineHeight: 1.1 }}>
        Built by a CA. For CAs.
      </h1>
      <p className="text-lg leading-relaxed mb-16 max-w-2xl" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
        The CA Hub exists because Muhammad Ahsan Siddiq lived through the CA exams and decided that no student should have to figure it out alone.
      </p>

      <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start mb-20">
        <div className="w-full max-w-[280px] shrink-0">
          <div className="relative rounded-[2rem] overflow-hidden" style={{ aspectRatio: "4/5" }}>
            <Image src="/MAS.jpeg" alt="Muhammad Ahsan Siddiq" fill className="object-cover object-top" priority />
          </div>
          <div className="mt-4 p-4 rounded-xl" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
            <p className="font-bold text-sm" style={{ color: "var(--text-1)" }}>Muhammad Ahsan Siddiq</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>CA Finalist (ICAP) · ACCA Affiliate · CFA L1</p>
          </div>
        </div>

        <div className="space-y-6" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-2)" }}>
            In 2025, Muhammad Ahsan Siddiq became <strong style={{ color: "var(--text-1)" }}>the first student in ICAP's 64-year history</strong> to clear all six CFAP (final-level) papers in a single attempt. ICAP created a special Gold Medal specifically to recognise the achievement.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-2)" }}>
            He did this while simultaneously pursuing his ACCA qualification and sitting CFA Level I. Not by working harder than everyone else, but by studying smarter through a self-engineered system of pattern recognition, precision execution, and radical prioritisation.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-2)" }}>
            After clearing his finals, he looked around at the CA ecosystem and saw the same problems he had faced: expensive resources, scattered advice, outdated PDFs on WhatsApp groups, and smart students burning out on the wrong strategy.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-2)" }}>
            So he built The CA Hub. <strong style={{ color: "var(--text-1)" }}>Completely free.</strong> No courses to sell. No paywalls. Just the exact toolkit he wished existed during his own journey.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-20">
        {[
          { num: "6/6", label: "CFAP Papers", sub: "First in 64-year ICAP history", color: "#3DB371" },
          { num: "🥇", label: "Special Gold Medal", sub: "Created by ICAP for this achievement", color: "#F5A623" },
          { num: "3", label: "Qualifications", sub: "CA Finalist · ACCA · CFA Level I", color: "#60A5FA" },
        ].map(s => (
          <div key={s.label} className="p-6 rounded-2xl text-center" style={{ background: "var(--bg-2)", border: `1px solid ${s.color}22` }}>
            <div className="font-display font-bold text-3xl mb-1" style={{ color: s.color }}>{s.num}</div>
            <div className="font-bold text-sm mb-1" style={{ color: "var(--text-1)" }}>{s.label}</div>
            <div className="text-xs" style={{ color: "var(--text-3)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-2xl" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
        <h2 className="font-bold text-xl mb-4" style={{ color: "var(--text-1)" }}>What The CA Hub Offers</h2>
        <ul className="space-y-3" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
          {[
            "MCQ Engine — thousands of PRC and CAF practice questions with full explanations",
            "Topical and random practice modes for every chapter",
            "Daily Planner — coming soon, will auto-schedule your study based on exam date",
            "Strategy guides — based on real ICAP marking schemes",
            "Blog — honest, direct CA career and exam advice",
          ].map(item => (
            <li key={item} className="flex items-start gap-3 text-sm">
              <span className="mt-1 w-4 h-4 shrink-0 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "rgba(61,179,113,0.15)", color: "var(--green)" }}>✓</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Link href="/caf/caf-5" className="shimmer-btn inline-flex items-center gap-2 font-bold rounded-full px-7 py-3 text-white text-sm" style={{ fontFamily: "var(--font-space-grotesk), sans-serif", boxShadow: "0 4px 20px rgba(61,179,113,0.3)" }}>
            Start Practising Free →
          </Link>
        </div>
      </div>
    </main>
  );
}
