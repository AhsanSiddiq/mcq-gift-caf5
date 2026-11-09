import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, LayoutList, Timer } from "lucide-react";
import { LEVEL_LABEL, subjectBody } from "@/data/subjects";
import AdSlot from "@/components/AdSlot";
import SponsorSlot from "@/components/SponsorSlot";
import TestYourself from "./TestYourself";
import Breadcrumbs from "@/components/Breadcrumbs";
import { bodyShort, dailyHrefFor, subjectCrumbs } from "@/lib/navigation";
import { BASE_URL, clip, questionPath, resolveQuestion, type QuestionParams } from "./resolve";

// ISR: ~8,000 question pages are rendered on first request, then cached and refreshed daily.
// Question content rarely changes; a long window keeps ISR re-renders (and hosting cost) low.
export const revalidate = 2592000;
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

  // Don't put the answer in the snippet: searchers would have no reason to click through.
  const title = `${clip(r.q.question, 62)} – ${r.code} MCQ`;
  const end = (t: string) => (/[.?!…]$/.test(t) ? t : `${t}.`);
  const tail = ` See the correct answer with a step-by-step explanation – free ${r.code} practice.`;
  const description = `${end(clip(r.q.question, Math.max(60, 158 - tail.length)))}${tail}`;
  const url = `${BASE_URL}${r.path}`;
  return {
    title,
    description,
    keywords: [`${r.code} MCQs`, `${r.meta.topic} MCQs`, `${r.code} ${r.meta.topic} MCQ with answer`],
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", images: [`${url.slice(0, url.lastIndexOf("/"))}/opengraph-image`] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function QuestionPage({ params }: Props) {
  const r = await resolveQuestion(params);
  if (!r) notFound();
  if (!r.isCanonical) permanentRedirect(r.path);

  const { s, code, meta, questions, idx, q, base, chapters, chapterIdx } = r;
  const correct = q.options.find((o) => o.correct);
  const chapterHref = `${base}/mcqs/${meta.slug}`;
  const prev = questions[idx - 1];
  const next = questions[idx + 1];
  const body = subjectBody(s);
  const dailyHref = dailyHrefFor(body);
  const nextChapter = chapters[chapterIdx + 1];

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
  const crumbs = [
    ...subjectCrumbs(s),
    { name: "MCQs with answers", short: "MCQs", href: `${base}/mcqs` },
    { name: `Chapter ${meta.chapter}: ${meta.topic}`, short: `Chapter ${meta.chapter}`, href: chapterHref },
    { name: `Question ${idx + 1}`, href: r.path },
  ];
  const card = { background: "var(--bg-2)", border: "1px solid var(--border)", textDecoration: "none" } as const;

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(quizLd).replace(/</g, "\\u003c") }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">
        <Breadcrumbs items={crumbs} className="mb-8" />

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

        <nav aria-label="Question navigation" className="grid sm:grid-cols-2 gap-3 mb-8">
          {prev ? (
            <Link prefetch={false} href={questionPath(base, meta.slug, prev)} rel="prev" className="rounded-2xl p-4" style={card}>
              <span className="block text-xs mb-1" style={{ color: "var(--text-3)" }}>
                <ArrowLeft className="w-3 h-3 inline" /> Previous · Question {idx}
              </span>
              <span className="block font-semibold text-sm" style={{ color: "var(--text-1)" }}>{clip(prev.question, 90)}</span>
            </Link>
          ) : <span className="hidden sm:block" />}
          {next ? (
            <Link prefetch={false} href={questionPath(base, meta.slug, next)} rel="next" className="rounded-2xl p-4 sm:text-right" style={card}>
              <span className="block text-xs mb-1" style={{ color: "var(--text-3)" }}>
                Next · Question {idx + 2} <ArrowRight className="w-3 h-3 inline" />
              </span>
              <span className="block font-semibold text-sm" style={{ color: "var(--text-1)" }}>{clip(next.question, 90)}</span>
            </Link>
          ) : nextChapter ? (
            <Link prefetch={false} href={`${base}/mcqs/${nextChapter.slug}`} className="rounded-2xl p-4 sm:text-right" style={card}>
              <span className="block text-xs mb-1" style={{ color: "var(--text-3)" }}>
                End of chapter · Next: Chapter {nextChapter.chapter} <ArrowRight className="w-3 h-3 inline" />
              </span>
              <span className="block font-semibold text-sm" style={{ color: "var(--text-1)" }}>{nextChapter.topic}</span>
            </Link>
          ) : (
            <Link prefetch={false} href={`${base}/mcqs`} className="rounded-2xl p-4 sm:text-right" style={card}>
              <span className="block text-xs mb-1" style={{ color: "var(--text-3)" }}>
                End of the last chapter <ArrowRight className="w-3 h-3 inline" />
              </span>
              <span className="block font-semibold text-sm" style={{ color: "var(--text-1)" }}>All {code} chapters</span>
            </Link>
          )}
        </nav>

        <section aria-labelledby="next-step-h" className="rounded-2xl p-5 mb-8" style={{ ...card, borderColor: "color-mix(in srgb, var(--green) 35%, var(--border))" }}>
          <h2 id="next-step-h" className="font-bold mb-1" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            Practise all {questions.length} Chapter {meta.chapter} questions
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>
            Answer them one by one with instant feedback. Your score and mistakes are saved.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link prefetch={false} href={`${base}/quiz?mode=topical&chapter=${meta.chapter}`} className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold text-white" style={{ background: "var(--green)", textDecoration: "none" }}>
              <Timer className="w-4 h-4" /> Start Chapter {meta.chapter} quiz
            </Link>
            <Link prefetch={false} href={dailyHref} className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold" style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-1)", textDecoration: "none" }}>
              <CalendarDays className="w-4 h-4" /> Today&apos;s {bodyShort(body)} daily challenge
            </Link>
          </div>
        </section>

        <AdSlot />

        <div className="mt-8 grid gap-3">
          <Link prefetch={false} href={chapterHref} className="flex items-center justify-between gap-3 rounded-2xl p-4" style={card}>
            <span className="min-w-0">
              <span className="block text-xs" style={{ color: "var(--text-3)" }}>All {questions.length} questions in Chapter {meta.chapter}</span>
              <span className="block font-bold text-sm" style={{ color: "var(--text-1)" }}>{meta.topic} MCQs with answers</span>
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} />
          </Link>
          {nextChapter && next && (
            <Link prefetch={false} href={`${base}/mcqs/${nextChapter.slug}`} className="flex items-center justify-between gap-3 rounded-2xl p-4" style={card}>
              <span className="min-w-0">
                <span className="block text-xs" style={{ color: "var(--text-3)" }}>Next chapter · Chapter {nextChapter.chapter}</span>
                <span className="block font-bold text-sm" style={{ color: "var(--text-1)" }}>{nextChapter.topic}</span>
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} />
            </Link>
          )}
          <Link prefetch={false} href={`${base}/mcqs`} className="flex items-center justify-between gap-3 rounded-2xl p-4" style={card}>
            <span className="flex items-center gap-3 min-w-0">
              <LayoutList className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} />
              <span className="font-bold text-sm" style={{ color: "var(--text-1)" }}>{code} question bank · {chapters.length} chapters</span>
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} />
          </Link>
        </div>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="font-bold text-lg mb-4" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              More {meta.topic} MCQs
            </h2>
            <ul className="flex flex-col gap-2">
              {related.map(({ n, q: rq }) => (
                <li key={rq.id}>
                  <Link prefetch={false} href={questionPath(base, meta.slug, rq)} className="flex items-start gap-3 rounded-xl p-4 text-sm" style={card}>
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
