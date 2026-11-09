import type { Metadata } from "next";
import { LEVEL_LABEL, subjectCode, searchName, shortSearchName } from "@/data/subjects";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, ArrowRight, LayoutList, Timer } from "lucide-react";
import { getChapterQuestions, getChapters, questionSlug, resolveSubject, type ChapterMeta } from "@/lib/questionBank";
import AdSlot from "@/components/AdSlot";
import SponsorSlot from "@/components/SponsorSlot";
import Breadcrumbs from "@/components/Breadcrumbs";
import { subjectCrumbs } from "@/lib/navigation";

export const revalidate = 604800;

const BASE_URL = "https://www.thecahub.com";
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
  const code = subjectCode(r.s);
  // Lead with the topic (what people search); keep it short enough that Google doesn't truncate it.
  const title =
    r.meta.topic.length > 38
      ? `${r.meta.topic} MCQs – ${shortSearchName(r.s)}`
      : `${r.meta.topic} MCQs with Answers – ${shortSearchName(r.s)} Ch ${r.meta.chapter}`;
  const description = `${r.meta.count} ${r.meta.topic} MCQs from ${searchName(r.s)}, Chapter ${r.meta.chapter}. Each has the correct answer and a step-by-step explanation. Free, no sign-up.`;
  const url = `${BASE_URL}/${r.level}/${r.s.id}/mcqs/${r.meta.slug}`;
  return {
    title,
    description,
    keywords: [`${r.meta.topic} MCQs`, `${code} chapter ${r.meta.chapter} MCQs`, `${code} ${r.meta.topic}`, `${r.meta.topic} MCQs with answers`],
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function ChapterQuestionBank({ params }: Props) {
  const r = await resolve(params);
  if (!r) notFound();
  const { level, s, chapters, idx, meta } = r;
  const base = `/${level}/${s.id}`;
  if (r.requested !== meta.slug) permanentRedirect(`${base}/mcqs/${meta.slug}`);

  const questions = await getChapterQuestions(s.id, meta.chapter);
  const code = subjectCode(s);
  const prev = chapters[idx - 1];
  const next = chapters[idx + 1];

  const quizLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: `${code} Chapter ${meta.chapter}: ${meta.topic} MCQs`,
    about: { "@type": "Thing", name: `${s.title} — ${meta.topic}` },
    educationalLevel: LEVEL_LABEL[s.level],
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
  const crumbs = [
    ...subjectCrumbs(s),
    { name: "MCQs with answers", short: "MCQs", href: `${base}/mcqs` },
    { name: `Chapter ${meta.chapter}: ${meta.topic}`, short: `Chapter ${meta.chapter}`, href: `${base}/mcqs/${meta.slug}` },
  ];
  const quizHref = `${base}/quiz?mode=topical&chapter=${meta.chapter}`;
  const card = { background: "var(--bg-2)", border: "1px solid var(--border)", textDecoration: "none" } as const;

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(quizLd) }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">
        <Breadcrumbs items={crumbs} className="mb-8" />
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          {code} · Chapter {meta.chapter}
        </p>
        <h1 className="font-bold mb-4" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif", lineHeight: 1.15 }}>
          {meta.topic} MCQs with Answers
        </h1>
        <p className="text-base mb-6" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
          {questions.length} multiple-choice questions on {meta.topic} for {code} {s.title}. Try each one before revealing the answer and explanation.
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mb-10">
          <Link prefetch={false} href={quizHref}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-white" style={{ background: "var(--green)", textDecoration: "none" }}>
            <Timer className="w-4 h-4" /> Start a quiz on this chapter
          </Link>
          {next && (
            <Link prefetch={false} href={`${base}/mcqs/${next.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--text-2)", textDecoration: "none" }}>
              Next: Chapter {next.chapter} <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <ol className="flex flex-col gap-5">
          {questions.map((q, i) => {
            const correct = q.options.find((o) => o.correct);
            return (
              <li key={q.id} className="rounded-2xl p-5 sm:p-6" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-2">
                  <Link prefetch={false} href={`${base}/mcqs/${meta.slug}/${questionSlug(q.id, q.question)}`} style={{ color: "var(--text-3)", textDecoration: "none" }}>
                    Question {i + 1} <ArrowRight className="w-3 h-3 inline" />
                  </Link>
                </h2>
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

        <SponsorSlot level={s.level} className="mt-10" />

        <section aria-labelledby="next-h" className="mt-10 rounded-2xl p-5 sm:p-6" style={{ ...card, borderColor: "color-mix(in srgb, var(--green) 35%, var(--border))" }}>
          <h2 id="next-h" className="font-bold text-lg mb-1" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            Finished reading? Test yourself.
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>
            The quiz shuffles these {questions.length} questions, scores you and saves your mistakes for review.
          </p>
          <Link prefetch={false} href={quizHref} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-white" style={{ background: "var(--green)", textDecoration: "none" }}>
            <Timer className="w-4 h-4" /> Start Chapter {meta.chapter} quiz
          </Link>
        </section>

        <nav aria-label="Chapter navigation" className="mt-3 grid sm:grid-cols-2 gap-3">
          {prev ? (
            <Link prefetch={false} href={`${base}/mcqs/${prev.slug}`} rel="prev" className="rounded-2xl p-4" style={card}>
              <span className="block text-xs mb-0.5" style={{ color: "var(--text-3)" }}><ArrowLeft className="w-3 h-3 inline" /> Chapter {prev.chapter}</span>
              <span className="block font-bold text-sm" style={{ color: "var(--text-1)" }}>{prev.topic}</span>
            </Link>
          ) : <span className="hidden sm:block" />}
          {next ? (
            <Link prefetch={false} href={`${base}/mcqs/${next.slug}`} rel="next" className="rounded-2xl p-4 sm:text-right" style={card}>
              <span className="block text-xs mb-0.5" style={{ color: "var(--text-3)" }}>Next · Chapter {next.chapter} <ArrowRight className="w-3 h-3 inline" /></span>
              <span className="block font-bold text-sm" style={{ color: "var(--text-1)" }}>{next.topic}</span>
            </Link>
          ) : (
            <Link prefetch={false} href={`${base}/quiz?mode=random`} className="rounded-2xl p-4 sm:text-right" style={card}>
              <span className="block text-xs mb-0.5" style={{ color: "var(--text-3)" }}>Last chapter <ArrowRight className="w-3 h-3 inline" /></span>
              <span className="block font-bold text-sm" style={{ color: "var(--text-1)" }}>Take a random {code} mock</span>
            </Link>
          )}
        </nav>

        <Link prefetch={false} href={`${base}/mcqs`} className="mt-3 flex items-center justify-between gap-3 rounded-2xl p-4" style={card}>
          <span className="flex items-center gap-3 min-w-0">
            <LayoutList className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} />
            <span className="font-bold text-sm" style={{ color: "var(--text-1)" }}>All {chapters.length} {code} chapters</span>
          </span>
          <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} />
        </Link>
      </div>
    </main>
  );
}
