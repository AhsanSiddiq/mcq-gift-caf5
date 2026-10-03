import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Timer } from "lucide-react";
import { getChapterQuestions, getChapters, resolveSubject, type ChapterMeta } from "@/lib/questionBank";
import AdSlot from "@/components/AdSlot";

export const revalidate = 86400;

const BASE_URL = "https://thecahub.com";
type Props = { params: Promise<{ level: string; subject: string; chapter: string }> };

async function resolve(params: Props["params"]) {
  const { level, subject, chapter } = await params;
  const s = resolveSubject(level, subject);
  const num = Number(/^chapter-(\d+)/.exec(chapter)?.[1]);
  if (!s || !Number.isFinite(num)) return null;
  const chapters = await getChapters(s.id);
  const idx = chapters.findIndex((c) => c.chapter === num);
  if (idx === -1) return null;
  return { level, s, chapters, idx, meta: chapters[idx] as ChapterMeta, requested: chapter };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await resolve(params);
  // Metadata is blocking for crawlers, so 404/redirect here gives bots a real status code
  if (!r) notFound();
  if (r.requested !== r.meta.slug) permanentRedirect(`/${r.level}/${r.s.id}/mcqs/${r.meta.slug}`);
  const code = r.s.id.toUpperCase();
  const title = `${code} Chapter ${r.meta.chapter}: ${r.meta.topic} MCQs with Answers`;
  const description = `${r.meta.count} ${r.meta.topic} MCQs for ICAP ${code} ${r.s.title}, with correct answers and explanations. Free chapter-wise practice.`;
  const url = `${BASE_URL}/${r.level}/${r.s.id}/mcqs/${r.meta.slug}`;
  return {
    title,
    description,
    keywords: [`${r.meta.topic} MCQs`, `${code} chapter ${r.meta.chapter} MCQs`, `${code} ${r.meta.topic}`, `${r.meta.topic} MCQs with answers`],
    alternates: { canonical: url },
    openGraph: { title, description, url, images: [{ url: "/CAHub.png", width: 1200, height: 630, alt: title }] },
  };
}

export default async function ChapterQuestionBank({ params }: Props) {
  const r = await resolve(params);
  if (!r) notFound();
  const { level, s, chapters, idx, meta } = r;
  const base = `/${level}/${s.id}`;
  if (r.requested !== meta.slug) permanentRedirect(`${base}/mcqs/${meta.slug}`);

  const questions = await getChapterQuestions(s.id, meta.chapter);
  const code = s.id.toUpperCase();
  const prev = chapters[idx - 1];
  const next = chapters[idx + 1];

  const quizLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: `${code} Chapter ${meta.chapter}: ${meta.topic} MCQs`,
    about: { "@type": "Thing", name: `${s.title} — ${meta.topic}` },
    educationalLevel: `ICAP ${s.level}`,
    hasPart: questions.slice(0, 50).map((q) => {
      const correct = q.options.find((o) => o.correct);
      return {
        "@type": "Question",
        eduQuestionType: "Multiple choice",
        learningResourceType: "Practice problem",
        text: q.question,
        suggestedAnswer: q.options.filter((o) => !o.correct).map((o) => ({ "@type": "Answer", text: o.text })),
        acceptedAnswer: correct ? { "@type": "Answer", text: correct.text, ...(q.explanation ? { answerExplanation: { "@type": "Comment", text: q.explanation } } : {}) } : undefined,
      };
    }),
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: `${code} ${s.title}`, item: `${BASE_URL}${base}` },
      { "@type": "ListItem", position: 2, name: "MCQs with answers", item: `${BASE_URL}${base}/mcqs` },
      { "@type": "ListItem", position: 3, name: `Chapter ${meta.chapter}: ${meta.topic}`, item: `${BASE_URL}${base}/mcqs/${meta.slug}` },
    ],
  };

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(quizLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">
        <Link href={`${base}/mcqs`} className="inline-flex items-center gap-2 text-sm font-semibold mb-8" style={{ color: "var(--text-3)", textDecoration: "none" }}>
          <ArrowLeft className="w-4 h-4" /> All {code} chapters
        </Link>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          {code} · Chapter {meta.chapter}
        </p>
        <h1 className="font-bold mb-4" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif", lineHeight: 1.15 }}>
          {meta.topic} MCQs with Answers
        </h1>
        <p className="text-base mb-6" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
          {questions.length} multiple-choice questions on {meta.topic} from ICAP {code} {s.title}. Try each one before revealing the answer and explanation.
        </p>
        <Link href={`${base}/quiz?mode=topical&chapter=${meta.chapter}`}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-white mb-10" style={{ background: "var(--green)", textDecoration: "none" }}>
          <Timer className="w-4 h-4" /> Practise this chapter interactively
        </Link>

        <ol className="flex flex-col gap-5">
          {questions.map((q, i) => {
            const correct = q.options.find((o) => o.correct);
            return (
              <li key={q.id} className="rounded-2xl p-5 sm:p-6" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-3)" }}>Question {i + 1}</h2>
                <p className="font-semibold mb-4 whitespace-pre-line" style={{ color: "var(--text-1)", lineHeight: 1.6 }}>{q.question}</p>
                <ul className="flex flex-col gap-2 mb-4">
                  {q.options.map((o) => (
                    <li key={o.key} className="rounded-xl px-4 py-2.5 text-sm" style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
                      <strong style={{ color: "var(--text-1)" }}>{o.key})</strong> {o.text}
                    </li>
                  ))}
                </ul>
                <details className="text-sm">
                  <summary className="cursor-pointer font-bold" style={{ color: "var(--green)" }}>Show answer &amp; explanation</summary>
                  <div className="mt-3" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
                    {correct && <p className="mb-2"><strong style={{ color: "var(--text-1)" }}>Answer: {correct.key}) {correct.text}</strong></p>}
                    {q.explanation && <p className="whitespace-pre-line">{q.explanation}</p>}
                  </div>
                </details>
                {(i + 1) % 10 === 0 && i + 1 < questions.length && <AdSlot />}
              </li>
            );
          })}
        </ol>

        <nav className="mt-10 grid sm:grid-cols-2 gap-3">
          {prev ? (
            <Link href={`${base}/mcqs/${prev.slug}`} className="rounded-2xl p-4" style={{ background: "var(--bg-2)", border: "1px solid var(--border)", textDecoration: "none" }}>
              <span className="block text-xs" style={{ color: "var(--text-3)" }}>← Chapter {prev.chapter}</span>
              <span className="block font-bold text-sm" style={{ color: "var(--text-1)" }}>{prev.topic}</span>
            </Link>
          ) : <span />}
          {next && (
            <Link href={`${base}/mcqs/${next.slug}`} className="rounded-2xl p-4 text-right" style={{ background: "var(--bg-2)", border: "1px solid var(--border)", textDecoration: "none" }}>
              <span className="block text-xs" style={{ color: "var(--text-3)" }}>Chapter {next.chapter} <ArrowRight className="w-3 h-3 inline" /></span>
              <span className="block font-bold text-sm" style={{ color: "var(--text-1)" }}>{next.topic}</span>
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
