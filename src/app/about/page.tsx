import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.thecahub.com/about" },
  title: { absolute: "About The CA Hub – Who Runs It and What It Offers" },
  description:
    "The CA Hub is run by Muhammad Ahsan Siddiq, a qualified Chartered Accountant (ICAP) and ACCA member, and the first student in ICAP's 64-year history to clear all six CFAP papers in a single attempt. Free MCQ practice for ICAP, ACCA, ICAI, CIMA, ICAEW and US CMA.",
};

const OFFERS: { title: string; body: string; href: string }[] = [
  {
    title: "Question banks",
    body: "Chapter-wise MCQ banks with an explanation for every answer, covering ICAP PRC and CAF, ACCA Applied Knowledge and Applied Skills, ICAI CA Foundation and Intermediate, the CIMA Certificate, the ICAEW Certificate Level and both parts of the US CMA.",
    href: "/practice",
  },
  {
    title: "Daily challenge",
    body: "Ten questions a day, the same for everyone, with a separate challenge for each exam body.",
    href: "/daily",
  },
  {
    title: "Study guides",
    body: "Articles on exam formats, pass marks, fees and study plans, written from each body's published rules and dated so you know when they were checked.",
    href: "/blog",
  },
  {
    title: "IFRS and IAS summaries",
    body: "Plain-English summaries of the standards students meet in financial reporting papers.",
    href: "/standards",
  },
  {
    title: "Tools",
    body: "A study planner, finance calculators, and a CV maker built for CA induction applications in Pakistan.",
    href: "/tools",
  },
];

export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
      <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "var(--green)" }}>About</p>
      <h1 className="font-display font-bold text-4xl md:text-5xl mb-6" style={{ color: "var(--text-1)", lineHeight: 1.1 }}>
        Who runs The CA Hub
      </h1>
      <p className="text-lg leading-relaxed mb-16 max-w-2xl" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
        The CA Hub (thecahub.com) is an independent exam-practice site for accountancy students. It is built and run by
        Muhammad Ahsan Siddiq, a qualified Chartered Accountant (member of the Institute of Chartered Accountants of Pakistan, ICAP) and a member of ACCA.
      </p>

      <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start mb-20">
        <div className="w-full max-w-[280px] shrink-0">
          <div className="relative rounded-[2rem] overflow-hidden" style={{ aspectRatio: "4/5" }}>
            <Image src="/MAS.jpeg" alt="Muhammad Ahsan Siddiq" fill className="object-cover object-top" priority />
          </div>
          <div className="mt-4 p-4 rounded-xl" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
            <p className="font-bold text-sm" style={{ color: "var(--text-1)" }}>Muhammad Ahsan Siddiq</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>
              Founder · Chartered Accountant (ICAP) · ACCA Member · CFA Level I
            </p>
          </div>
        </div>

        <div className="space-y-6" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          <h2 className="font-bold text-xl" style={{ color: "var(--text-1)" }}>The founder</h2>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-2)" }}>
            In 2025, Muhammad Ahsan Siddiq became <strong style={{ color: "var(--text-1)" }}>the first student in ICAP&apos;s 64-year history</strong> to
            clear all six CFAP (final-level) papers in a single attempt. ICAP created a special Gold Medal to recognise the result.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-2)" }}>
            He sat those papers while also pursuing ACCA and CFA Level I. He is now a qualified Chartered Accountant (ICAP) and a member of ACCA.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-2)" }}>
            He started The CA Hub after finals because the resources he had relied on were expensive, scattered across
            WhatsApp groups and old PDFs, or out of date after syllabus changes. The site is his attempt to put good practice
            material and accurate exam information in one free place.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-2)" }}>
            Muhammad Ahsan Siddiq oversees the question banks and study articles. How content is
            written, checked and corrected is set out in our <Link href="/editorial-policy" className="underline" style={{ color: "var(--green)" }}>editorial policy</Link>.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-20">
        {[
          { num: "6/6", label: "CFAP papers in one attempt", sub: "First in ICAP's 64-year history", color: "#3DB371" },
          { num: "Gold", label: "Special Gold Medal", sub: "Created by ICAP for this result", color: "#F5A623" },
          { num: "3", label: "Qualifications", sub: "Chartered Accountant (ICAP) · ACCA Member · CFA Level I", color: "#60A5FA" },
        ].map(s => (
          <div key={s.label} className="p-6 rounded-2xl text-center" style={{ background: "var(--bg-2)", border: `1px solid ${s.color}22` }}>
            <div className="font-display font-bold text-3xl mb-1" style={{ color: s.color }}>{s.num}</div>
            <div className="font-bold text-sm mb-1" style={{ color: "var(--text-1)" }}>{s.label}</div>
            <div className="text-xs" style={{ color: "var(--text-3)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-2xl mb-12" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
        <h2 className="font-bold text-xl mb-4" style={{ color: "var(--text-1)" }}>What the site offers</h2>
        <ul className="space-y-4" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
          {OFFERS.map(item => (
            <li key={item.title} className="flex items-start gap-3 text-sm leading-relaxed">
              <span className="mt-1 w-4 h-4 shrink-0 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "color-mix(in srgb, var(--green) 15%, transparent)", color: "var(--green)" }}>✓</span>
              <span>
                <Link href={item.href} className="font-semibold hover:underline" style={{ color: "var(--text-1)" }}>{item.title}</Link>
                {" "}— {item.body}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-sm leading-relaxed mt-6" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
          All question banks, topical drills and the daily challenge are free. <Link href="/pro" className="underline" style={{ color: "var(--green)" }}>Pro</Link> is
          an optional paid plan that adds unlimited timed exam simulators, removes ads and raises the daily limit on AI tutor
          explanations. The free site is supported by advertising.
        </p>
      </div>

      <div className="p-8 rounded-2xl mb-12" style={{ background: "var(--bg-2)", border: "1px solid var(--border)", fontFamily: "var(--font-inter), sans-serif" }}>
        <h2 className="font-bold text-xl mb-4" style={{ color: "var(--text-1)" }}>Independence</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
          The CA Hub is not affiliated with, endorsed by or connected to ICAP, ACCA, ICAI, CIMA, ICAEW, IMA or any other
          professional body. Their names are used only to describe the exams our material helps you prepare for. Always confirm
          exam rules, fees and dates on the relevant body&apos;s own website.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link href="/practice" className="shimmer-btn inline-flex items-center gap-2 font-bold rounded-full px-7 py-3 text-white text-sm" style={{ fontFamily: "var(--font-space-grotesk), sans-serif", boxShadow: "0 4px 20px color-mix(in srgb, var(--green) 30%, transparent)" }}>
          Start practising →
        </Link>
        <Link href="/contact" className="inline-flex items-center gap-2 font-bold rounded-full px-7 py-3 text-sm" style={{ fontFamily: "var(--font-space-grotesk), sans-serif", border: "1px solid var(--border)", color: "var(--text-1)" }}>
          Contact us
        </Link>
      </div>
    </main>
  );
}
