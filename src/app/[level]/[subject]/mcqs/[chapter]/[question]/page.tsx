import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Timer } from "lucide-react";
import { LEVEL_LABEL, subjectBody } from "@/data/subjects";
import AdSlot from "@/components/AdSlot";
import SponsorSlot from "@/components/SponsorSlot";
import TestYourself from "./TestYourself";
import { BASE_URL, clip, questionPath, resolveQuestion, type QuestionParams } from "./resolve";

// ISR: ~8,000 question pages are rendered on first request, then cached and refreshed daily.
export const revalidate = 86400;
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

type Props = { params: QuestionParams };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await resolveQuestion(params);
  // Metadata is blocking for crawlers, so 404/redirect here gives bots a real status code
  if (!r) notFound();
  if (!r.isCanonical) permanentRedirect(r.path);

  const correct = r.q.options.find((o) => o.correct);
  const title = `${clip(r.q.question, 60)} – ${r.code} MCQ with Answer`;
  const end = (t: string) => (/[.?!…]$/.test(t) ? t : `${t}.`);
  const answer = correct ? ` Answer: ${end(clip(correct.text, 45))}` : "";
  const tail = ` Free ${r.code} MCQ with explanation.`;
  const description = `${end(clip(r.q.question, Math.max(60, 158 - answer.length - tail.length)))}${answer}${tail}`;
  const url = `${BASE_URL}${r.path}`;
  return {
    title,
    description,
    keywords: [`${r.code} MCQs`, `${r.meta.topic} MCQs`, `${r.code} ${r.meta.topic} MCQ with answer`],
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function QuestionPage({ params }: Props) {
  const r = await resolveQuestion(params);
  if (!r) notFound();
  if (!r.isCanonical) permanentRedirect(r.path);

  const { s, code, meta, questions, idx, q, base } = r;
  const correct = q.options.find((o) => o.correct);
  const chapterHref = `${base}/mcqs/${meta.slug}`;
  const prev = questions[idx - 1];
  const next = questions[idx + 1];
  const body = subjectBody(s);
  const dailyHref = body === "icap" ? "/daily" : `/daily/${body}`;

  // 5 related questions from the same chapter: the ones after next, wrapping round
  const related = [];
  for (let k = 2; related.length < 5 && k < questions.length; k++) {
    const j = (idx + k) % questions.length;
    if (j !== idx && j !== idx - 1) related.push({ n: j + 1, q: questions[j] });
  }

  const quizLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: clip(q.question, 110),
    url: `${BASE_URL}${r.path}`,
    about: { "@type": "Thing", name: `${s.title} — ${meta.topic}` },
    educationalLevel: LEVEL_LABEL[s.level],
    isPartOf: { "@type": "Quiz", name: `${code} Chapter ${meta.chapter}: ${meta.topic} MCQs`, url: `${BASE_URL}${chapterHref}` },
    hasPart: [
      {
        "@type": "Question",
        eduQuestionType: "Multiple choice",
        learningResourceType: "Practice problem",
        text: q.question,
        suggestedAnswer: q.options.filter((o) => !o.correct).map((o) => ({ "@type": "Answer", text: o.text })),
        acceptedAnswer: correct
          ? {
              "@type": "Answer",
              text: correct.text,
              ...(q.explanation ? { answerExplanation: { "@type": "Comment", text: q.explanation } } : {}),
            }
          : undefined,
      },
    ],
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: `${code} ${s.title}`, item: `${BASE_URL}${base}` },
      { "@type": "ListItem", position: 2, name: "MCQs with answers", item: `${BASE_URL}${base}/mcqs` },
      { "@type": "ListItem", position: 3, name: `Chapter ${meta.chapter}: ${meta.topic}`, item: `${BASE_URL}${chapterHref}` },
      { "@type": "ListItem", position: 4, name: `Question ${idx + 1}`, item: `${BASE_URL}${r.path}` },
    ],
  };
  const card = { background: "var(--bg-2)", border: "1px solid var(--border)", textDecoration: "none" } as const;

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(quizLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm" style={{ color: "var(--text-3)" }}>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li><Link href={base} style={{ color: "var(--text-3)", textDecoration: "none" }}>{code}</Link></li>
            <li aria-hidden>/</li>
            <li><Link href={`${base}/mcqs`} style={{ color: "var(--text-3)", textDecoration: "none" }}>MCQs</Link></li>
            <li aria-hidden>/</li>
            <li><Link href={chapterHref} style={{ color: "var(--text-3)", textDecoration: "none" }}>Chapter {meta.chapter}: {meta.topic}</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" style={{ color: "var(--text-2)" }}>Question {idx + 1}</li>
          </ol>
        </nav>

        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          {code} · Chapter {meta.chapter} · Question {idx + 1} of {questions.length}
        </p>
        <h1 className="font-bold mb-6 whitespace-pre-line" style={{ fontSize: "clamp(1.15rem,2.6vw,1.5rem)", color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif", lineHeight: 1.45 }}>
          {q.question}
        </h1>

        <section className="rounded-2xl p-5 sm:p-6 mb-8" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
          <TestYourself options={q.options}>
            {correct && (
              <p className="mb-2">
                <strong style={{ color: "var(--text-1)" }}>Correct answer: {correct.key}) {correct.text}</strong>
              </p>
            )}
            {q.explanation ? (
              <>
                <h2 className="text-xs font-bold uppercase tracking-wider mt-4 mb-1" style={{ color: "var(--text-3)" }}>Explanation</h2>
                <p className="whitespace-pre-line">{q.explanation}</p>
              </>
            ) : null}
          </TestYourself>
        </section>

        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          <Link href={`${base}/quiz?mode=topical&chapter=${meta.chapter}`} className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold text-white" style={{ background: "var(--green)", textDecoration: "none" }}>
            <Timer className="w-4 h-4" /> Practise Chapter {meta.chapter} in quiz mode
          </Link>
          <Link href={dailyHref} className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold" style={{ ...card, color: "var(--text-1)" }}>
            <CalendarDays className="w-4 h-4" /> Take today&apos;s daily challenge
          </Link>
        </div>

        <AdSlot />

        <nav aria-label="Question navigation" className="mt-8 grid sm:grid-cols-2 gap-3">
          {prev ? (
            <Link href={questionPath(base, meta.slug, prev)} rel="prev" className="rounded-2xl p-4" style={card}>
              <span className="block text-xs mb-1" style={{ color: "var(--text-3)" }}>
                <ArrowLeft className="w-3 h-3 inline" /> Previous · Question {idx}
              </span>
              <span className="block font-semibold text-sm" style={{ color: "var(--text-1)" }}>{clip(prev.question, 90)}</span>
            </Link>
          ) : <span />}
          {next && (
            <Link href={questionPath(base, meta.slug, next)} rel="next" className="rounded-2xl p-4 sm:text-right" style={card}>
              <span className="block text-xs mb-1" style={{ color: "var(--text-3)" }}>
                Next · Question {idx + 2} <ArrowRight className="w-3 h-3 inline" />
              </span>
              <span className="block font-semibold text-sm" style={{ color: "var(--text-1)" }}>{clip(next.question, 90)}</span>
            </Link>
          )}
        </nav>

        <Link href={chapterHref} className="mt-3 flex items-center justify-between gap-3 rounded-2xl p-4" style={card}>
          <span>
            <span className="block text-xs" style={{ color: "var(--text-3)" }}>All {questions.length} questions in Chapter {meta.chapter}</span>
            <span className="block font-bold text-sm" style={{ color: "var(--text-1)" }}>{meta.topic} MCQs with answers</span>
          </span>
          <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} />
        </Link>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="font-bold text-lg mb-4" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              More {meta.topic} MCQs
            </h2>
            <ul className="flex flex-col gap-2">
              {related.map(({ n, q: rq }) => (
                <li key={rq.id}>
                  <Link href={questionPath(base, meta.slug, rq)} className="flex items-start gap-3 rounded-xl p-4 text-sm" style={card}>
                    <span className="shrink-0 font-bold" style={{ color: "var(--green)" }}>Q{n}</span>
                    <span style={{ color: "var(--text-2)" }}>{clip(rq.question, 140)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <SponsorSlot level={s.level} className="mt-10" />
      </div>
    </main>
  );
}
