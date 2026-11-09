import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react";
import {
  BODIES,
  PAST_PAPERS_BASE,
  areaLabel,
  fmtMarks,
  getArea,
  getPaper,
  getQuestion,
  getSitting,
  paperUrl,
  papers,
  primaryArea,
  qSlug,
  questionMarks,
  questionUrl,
  sittingUrl,
  withPage,
  type Paper,
  type Question,
  type Sitting,
} from "@/data/pastPapers";
import {
  Attribution,
  BASE_URL,
  Bullets,
  Crumbs,
  DataTable,
  Example,
  ExtLink,
  Eyebrow,
  H1,
  JsonLd,
  Pill,
  Section,
  articleLd,
  breadcrumbLd,
  card,
  heading,
  link,
  muted,
} from "../../../ui";

type Props = { params: Promise<{ paper: string; sitting: string; q: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return papers.flatMap((p) => p.sittings.flatMap((s) => s.questions.filter((q) => q.walkthrough).map((q) => ({ paper: p.slug, sitting: s.slug, q: qSlug(q) }))));
}

const topic = (p: Paper, q: Question) => (q.format === "MCQ" ? "Multiple-choice questions" : areaLabel(p, primaryArea(q)));
const title = (p: Paper, s: Sitting, q: Question) => `${p.code} ${s.name} Q${q.n} – ${topic(p, q)} (${fmtMarks(questionMarks(q))} marks): Walkthrough`;
const description = (p: Paper, s: Sitting, q: Question) =>
  `${BODIES[p.body].short} ${p.code} ${s.name} Question ${q.n}: ${q.summary} How to approach it, key rules, common mistakes and an original practice question with a worked solution.`.slice(0, 300);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paper, sitting, q: qs } = await params;
  const p = getPaper(paper);
  const s = p && getSitting(p, sitting);
  const q = s && getQuestion(s, qs);
  if (!p || !s || !q) return {};
  const url = `${BASE_URL}${questionUrl(p, s, q)}`;
  return {
    title: { absolute: title(p, s, q) },
    description: description(p, s, q),
    keywords: [`${p.code} ${s.name} Q${q.n}`, `${p.code} ${s.name} question ${q.n} solution`, `${p.code} ${topic(p, q)} past paper`, `${BODIES[p.body].short} ${p.code} ${s.name}`],
    alternates: { canonical: url },
    openGraph: { title: title(p, s, q), description: description(p, s, q), url, type: "article" },
  };
}

export default async function QuestionPage({ params }: Props) {
  const { paper, sitting, q: qs } = await params;
  const p = getPaper(paper);
  const s = p && getSitting(p, sitting);
  const q = s && getQuestion(s, qs);
  if (!p || !s || !q || !q.walkthrough) notFound();

  const w = q.walkthrough;
  const body = BODIES[p.body];
  const url = `${BASE_URL}${questionUrl(p, s, q)}`;
  const areaIds = [...new Set([...q.parts.map((x) => x.area), ...(q.alsoTests ?? [])])];
  const areas = areaIds.map((id) => getArea(p, id)).filter((a): a is NonNullable<typeof a> => Boolean(a));
  const idx = s.questions.findIndex((x) => x.n === q.n);
  const prev = s.questions[idx - 1];
  const next = s.questions[idx + 1];
  const subParts = q.parts.length > 1 && q.format !== "MCQ" ? q.parts : null;

  const jsonLd = [
    articleLd({ headline: title(p, s, q), description: description(p, s, q), url, about: topic(p, q) }),
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Past Papers", path: PAST_PAPERS_BASE },
      { name: `${body.short} ${p.code}`, path: paperUrl(p) },
      { name: s.name, path: sittingUrl(p, s) },
      { name: `Q${q.n}`, path: questionUrl(p, s, q) },
    ]),
  ];

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <JsonLd data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">
        <Crumbs items={[{ name: "Home", path: "/" }, { name: "Past Papers", path: PAST_PAPERS_BASE }, { name: `${body.short} ${p.code}`, path: paperUrl(p) }, { name: s.name, path: sittingUrl(p, s) }, { name: `Q${q.n}` }]} />

        <header className="mb-8">
          <Eyebrow>{p.code} {p.title} · {s.name}</Eyebrow>
          <H1>Q{q.n}: {topic(p, q)}</H1>
          <div className="flex flex-wrap gap-2 mb-4">
            <Pill>{fmtMarks(questionMarks(q))} marks</Pill>
            <Pill>{q.format}</Pill>
            {q.passRate !== undefined && <Pill>Pass rate {q.passRate}%</Pill>}
            {subParts?.map((x) => <Pill key={x.label}>{x.label} {fmtMarks(x.marks)} marks</Pill>)}
          </div>
          <p className="text-base sm:text-lg" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>{q.summary}</p>
          {q.format === "MCQ" && (
            <p className="text-sm mt-3" style={muted}>
              Areas: {q.parts.map((x) => `${x.label} ${areaLabel(p, x.area)} (${fmtMarks(x.marks)})`).join(" · ")}
            </p>
          )}
        </header>

        <div className="rounded-2xl p-5 mb-12" style={{ ...card, borderColor: "color-mix(in srgb, var(--green) 40%, transparent)" }}>
          <p className="font-bold mb-3" style={heading}>Read the question first</p>
          <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>
            We don&apos;t reproduce {body.short}&apos;s question. Open it in the official PDF, attempt it, then use this walkthrough.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <ExtLink href={withPage(s.paperUrl, q.page)} strong>Q{q.n} in the official paper{q.page ? ` (p. ${q.page})` : ""}</ExtLink>
            {s.answersUrl && (
              <span>
                <ExtLink href={s.answersUrl} strong>Official suggested answer</ExtLink>
                {s.answersNote && <span className="block text-xs" style={muted}>{s.answersNote}</span>}
              </span>
            )}
            {s.commentsUrl && <ExtLink href={withPage(s.commentsUrl, q.commentsPage)} strong>Examiners&apos; comments on Q{q.n}</ExtLink>}
          </div>
        </div>

        <article className="min-w-0 text-[1.02rem]" style={{ color: "var(--text-2)", lineHeight: 1.75 }}>
          <Section id="approach" title="How to approach it">
            <ol className="list-decimal pl-5 space-y-2.5 marker:text-[var(--green)] marker:font-bold">
              {w.approach.map((a, i) => <li key={i}>{a}</li>)}
            </ol>
          </Section>

          <Section id="rules" title="Key rules to apply">
            <Bullets items={w.rules} />
          </Section>

          {w.layout && (
            <Section id="layout" title="Answer layout">
              <DataTable table={w.layout} />
            </Section>
          )}

          <Section id="mistakes" title="Common mistakes" intro={<p>Drawn from the examiners&apos; comments for this sitting (summarised in our words) and from typical errors on this topic.</p>}>
            <ul className="space-y-3">
              {w.mistakes.map((m, i) => (
                <li key={i} className="flex gap-3 rounded-xl p-4" style={card}>
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--gold)" }} aria-hidden />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="practice" title="Similar question with worked solution" intro={<p>Written by us with our own numbers; it tests the same skills as Q{q.n} without copying it.</p>}>
            <Example ex={w.example} />
          </Section>

          <Section id="next-steps" title="Keep practising">
            <div className="grid gap-3 sm:grid-cols-2">
              {areas.filter((a) => a.mcq).map((a) => (
                <Link key={a.id} href={a.mcq!} className="flex items-center justify-between gap-3 rounded-xl px-4 py-3" style={{ ...card, textDecoration: "none" }}>
                  <span><span className="block text-xs" style={muted}>Chapter MCQs</span><span className="font-semibold" style={{ color: "var(--text-1)" }}>{a.label}</span></span>
                  <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} aria-hidden />
                </Link>
              ))}
              {areas.filter((a) => a.standard).map((a) => (
                <Link key={`${a.id}-std`} href={`/standards/${a.standard}`} className="flex items-center justify-between gap-3 rounded-xl px-4 py-3" style={{ ...card, textDecoration: "none" }}>
                  <span><span className="block text-xs" style={muted}>Standard summary</span><span className="font-semibold" style={{ color: "var(--text-1)" }}>{a.label}</span></span>
                  <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} aria-hidden />
                </Link>
              ))}
              <Link href={`${paperUrl(p)}#topical`} className="flex items-center justify-between gap-3 rounded-xl px-4 py-3" style={{ ...card, textDecoration: "none" }}>
                <span><span className="block text-xs" style={muted}>Topical index</span><span className="font-semibold" style={{ color: "var(--text-1)" }}>{p.code} topic × sitting matrix</span></span>
                <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} aria-hidden />
              </Link>
              <Link href={sittingUrl(p, s)} className="flex items-center justify-between gap-3 rounded-xl px-4 py-3" style={{ ...card, textDecoration: "none" }}>
                <span><span className="block text-xs" style={muted}>Sitting analysis</span><span className="font-semibold" style={{ color: "var(--text-1)" }}>{p.code} {s.name}</span></span>
                <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} aria-hidden />
              </Link>
            </div>
          </Section>

          <nav aria-label="Previous and next question" className="grid gap-3 sm:grid-cols-2 mb-10">
            {prev ? (
              <Link href={questionUrl(p, s, prev)} className="rounded-xl p-4 block" style={{ ...card, textDecoration: "none" }}>
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-1" style={muted}><ArrowLeft className="w-3.5 h-3.5" aria-hidden /> Q{prev.n}</span>
                <span className="block font-semibold" style={{ color: "var(--text-1)" }}>{topic(p, prev)}</span>
              </Link>
            ) : <span className="hidden sm:block" />}
            {next && (
              <Link href={questionUrl(p, s, next)} className="rounded-xl p-4 block sm:text-right" style={{ ...card, textDecoration: "none" }}>
                <span className="flex items-center sm:justify-end gap-1.5 text-xs font-bold uppercase tracking-widest mb-1" style={muted}>Q{next.n} <ArrowRight className="w-3.5 h-3.5" aria-hidden /></span>
                <span className="block font-semibold" style={{ color: "var(--text-1)" }}>{topic(p, next)}</span>
              </Link>
            )}
          </nav>

          <p className="text-sm mb-2"><Link href={sittingUrl(p, s)} style={link}>← All questions in {p.code} {s.name}</Link></p>
          <Attribution body={p.body} sourceUrl={p.officialUrl} />
        </article>
      </div>
    </main>
  );
}
