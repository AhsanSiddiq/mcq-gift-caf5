import type { Metadata } from "next";
import { LEVEL_LABEL, searchName, subjectBody, subjectCode } from "@/data/subjects";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Layers, Shuffle } from "lucide-react";
import { getChapters, resolveSubject } from "@/lib/questionBank";
import AdSlot from "@/components/AdSlot";
import SponsorSlot from "@/components/SponsorSlot";
import Breadcrumbs from "@/components/Breadcrumbs";
import { dailyHrefFor, subjectCrumbs } from "@/lib/navigation";

export const revalidate = 604800;

const BASE_URL = "https://www.thecahub.com";
type Props = { params: Promise<{ level: string; subject: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level, subject } = await params;
  const s = resolveSubject(level, subject);
  if (!s) return {};
  const code = subjectCode(s);
  const name = searchName(s);
  const title = `${name} MCQs with Answers – Free Mock Test`;
  const description = `Free ${name} MCQs sorted chapter by chapter, each with the correct answer and a worked explanation. Read online or take a timed mock test – no sign-up needed.`;
  const url = `${BASE_URL}/${level}/${s.id}/mcqs`;
  return {
    title,
    description,
    keywords: [`${code} MCQs`, `${code} MCQs with answers`, `${s.title} MCQs`, `${LEVEL_LABEL[s.level]} MCQs`, `${code} past paper MCQs`],
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function QuestionBankIndex({ params }: Props) {
  const { level, subject } = await params;
  const s = resolveSubject(level, subject);
  if (!s) notFound();
  const chapters = await getChapters(s.id);
  const total = chapters.reduce((n, c) => n + c.count, 0);
  const code = subjectCode(s);
  const base = `/${level}/${s.id}`;

  const crumbs = [...subjectCrumbs(s), { name: "MCQs with answers", short: "MCQs", href: `${base}/mcqs` }];
  const action = { background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-1)", textDecoration: "none" } as const;

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">
        <Breadcrumbs items={crumbs} className="mb-8" />
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          Question bank · {LEVEL_LABEL[s.level]}
        </p>
        <h1 className="font-bold mb-4" style={{ fontSize: "clamp(1.7rem,4vw,2.6rem)", color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif", lineHeight: 1.15 }}>
          {code} {s.title} MCQs with Answers
        </h1>
        <p className="text-base mb-6 max-w-2xl" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
          {total > 0 ? `${total} ` : ""}multiple-choice questions for {s.title}, organised chapter by chapter, each with the correct answer and a worked explanation.
          {" "}{s.description} Read them here, then switch to a timed mock to test yourself under exam pressure.
        </p>

        {chapters.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-10">
            <Link href={`${base}/quiz?mode=random`} className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white" style={{ background: "var(--green)", textDecoration: "none" }}>
              <Shuffle className="w-4 h-4 shrink-0" /> Random mock
            </Link>
            <Link href={`${base}/topical`} className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold" style={action}>
              <Layers className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} /> Quiz by chapter
            </Link>
            <Link href={dailyHrefFor(subjectBody(s))} className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold" style={action}>
              <CalendarDays className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} /> Daily challenge
            </Link>
          </div>
        )}

        <SponsorSlot level={s.level} className="mb-8" />

        {chapters.length === 0 ? (
          <p style={{ color: "var(--text-3)" }}>Questions for this subject are being added.</p>
        ) : (
          <ol className="flex flex-col gap-3">
            {chapters.map((c) => (
              <li key={c.chapter}>
                <Link href={`${base}/mcqs/${c.slug}`} className="flex items-center justify-between gap-4 rounded-2xl p-4 sm:p-5"
                  style={{ background: "var(--bg-2)", border: "1px solid var(--border)", textDecoration: "none" }}>
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-3)" }}>Chapter {c.chapter}</span>
                    <span className="block font-bold" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>{c.topic}</span>
                  </span>
                  <span className="shrink-0 flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--green)" }}>
                    {c.count} MCQs <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}

        <AdSlot className="mt-10" />

        <div className="mt-10 rounded-2xl p-6" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
          <h2 className="font-bold text-lg mb-2" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            How to use this {code} question bank
          </h2>
          <p className="text-sm" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
            Read a chapter end-to-end once, covering the answer before you reveal it. Then drill the same chapter in{" "}
            <Link href={`${base}/topical`} style={{ color: "var(--green)" }}>topical mode</Link>, and finish with a{" "}
            <Link href={`${base}/quiz?mode=exam`} style={{ color: "var(--green)" }}>timed exam simulation</Link> to build speed.
            Wrong answers can be flagged and revisited from your subject dashboard.
          </p>
        </div>
      </div>
    </main>
  );
}
