import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getChapters, resolveSubject } from "@/lib/questionBank";
import AdSlot from "@/components/AdSlot";
import SponsorSlot from "@/components/SponsorSlot";

export const revalidate = 86400;

const BASE_URL = "https://thecahub.com";
type Props = { params: Promise<{ level: string; subject: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level, subject } = await params;
  const s = resolveSubject(level, subject);
  if (!s) return {};
  const code = s.id.toUpperCase();
  const title = `${code} ${s.title} MCQs with Answers – Chapter-wise Question Bank`;
  const description = `Chapter-wise ${code} ${s.title} MCQs with answers and explanations for ICAP ${s.level}. Read every question online free, then test yourself in timed mocks.`;
  const url = `${BASE_URL}/${level}/${s.id}/mcqs`;
  return {
    title,
    description,
    keywords: [`${code} MCQs`, `${code} MCQs with answers`, `${s.title} MCQs`, `ICAP ${s.level} MCQs pdf`, `${code} past paper MCQs`],
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
  const code = s.id.toUpperCase();
  const base = `/${level}/${s.id}`;

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Practice", item: `${BASE_URL}/practice` },
      { "@type": "ListItem", position: 2, name: `${code} ${s.title}`, item: `${BASE_URL}${base}` },
      { "@type": "ListItem", position: 3, name: "MCQs with answers", item: `${BASE_URL}${base}/mcqs` },
    ],
  };

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">
        <Link href={base} className="inline-flex items-center gap-2 text-sm font-semibold mb-8" style={{ color: "var(--text-3)", textDecoration: "none" }}>
          <ArrowLeft className="w-4 h-4" /> {code} practice modes
        </Link>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          Question bank · ICAP {s.level}
        </p>
        <h1 className="font-bold mb-4" style={{ fontSize: "clamp(1.7rem,4vw,2.6rem)", color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif", lineHeight: 1.15 }}>
          {code} {s.title} MCQs with Answers
        </h1>
        <p className="text-base mb-10 max-w-2xl" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
          {total > 0 ? `${total} ` : ""}multiple-choice questions for {s.title}, organised chapter by chapter, each with the correct answer and a worked explanation.
          {" "}{s.description} Read them here, then switch to a timed mock to test yourself under exam pressure.
        </p>

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
