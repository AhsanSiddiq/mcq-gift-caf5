import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  BODIES,
  PAST_PAPERS_BASE,
  areaMarks,
  chronological,
  fmtDate,
  fmtMarks,
  getPaper,
  gridMarks,
  newestFirst,
  paperUrl,
  papers,
  practicePicks,
  primaryArea,
  questionMarks,
  questionUrl,
  sittingUrl,
  topicMatrix,
  trends,
  type Paper,
} from "@/data/pastPapers";
import {
  Attribution,
  BASE_URL,
  Bar,
  Bullets,
  Crumbs,
  Example,
  ExtLink,
  Eyebrow,
  H1,
  JsonLd,
  ScrollTable,
  Section,
  articleLd,
  breadcrumbLd,
  card,
  heading,
  link,
  muted,
  td,
  th,
} from "../ui";

type Props = { params: Promise<{ paper: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return papers.map((p) => ({ paper: p.slug }));
}

const name = (p: Paper) => `${BODIES[p.body].short} ${p.code}`;

function title(p: Paper) {
  return p.sittings.length
    ? `${name(p)} Past Papers – ${p.title} Topical Index & Walkthroughs`
    : `${name(p)} Past Papers & Model Papers – ${p.title}`;
}

function description(p: Paper) {
  if (!p.sittings.length) {
    return `${name(p)} ${p.title}: how to access ICAP's official computer-based model papers, syllabus weightings by area, and free chapter-wise MCQs for practice.`;
  }
  const sittings = newestFirst(p).map((s) => s.name).join(", ");
  const top = topicMatrix(p).slice(0, 3).map((r) => r.area.label.replace(/ \(.*\)$/, "")).join(", ");
  return `${name(p)} ${p.title} past papers (${sittings}) with official links, a topic-by-sitting index, trends, pass rates and question walkthroughs. Most examined: ${top}.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paper } = await params;
  const p = getPaper(paper);
  if (!p) return {};
  const url = `${BASE_URL}${paperUrl(p)}`;
  return {
    title: { absolute: title(p) },
    description: description(p),
    keywords: p.keywords,
    alternates: { canonical: url },
    openGraph: { title: title(p), description: description(p), url, type: "article" },
  };
}

export default async function PaperPage({ params }: Props) {
  const { paper } = await params;
  const p = getPaper(paper);
  if (!p) notFound();

  const url = `${BASE_URL}${paperUrl(p)}`;
  const body = BODIES[p.body];
  const sittings = chronological(p);
  const latestFirst = newestFirst(p);
  const matrix = topicMatrix(p);
  const t = trends(p);
  const picks = practicePicks(p, 3);
  const hasSittings = sittings.length > 0;
  const maxAvg = Math.max(1, ...matrix.map((r) => r.average));

  // Prioritise: top areas by average marks, plus areas behind the weakest questions.
  const weakest = sittings
    .flatMap((s) => s.questions.filter((q) => q.passRate !== undefined && q.format !== "MCQ").map((q) => ({ s, q })))
    .sort((a, b) => (a.q.passRate ?? 100) - (b.q.passRate ?? 100))
    .slice(0, 4);

  const toc = [
    { id: "overview", label: "Overview" },
    hasSittings ? { id: "sittings", label: "Sittings & official links" } : null,
    hasSittings ? { id: "topical", label: "Yearly topical index" } : null,
    hasSittings ? { id: "trends", label: "Trends across sittings" } : null,
    hasSittings ? { id: "averages", label: "Average marks by area" } : null,
    hasSittings ? { id: "prioritise", label: "What to prioritise" } : null,
    p.grid ? { id: "syllabus", label: "Syllabus weightings" } : null,
    picks.length ? { id: "practice", label: "Practice questions" } : null,
    { id: "mcqs", label: "Chapter MCQs" },
    p.resources?.length ? { id: "resources", label: "Official resources" } : null,
  ].filter((x): x is { id: string; label: string } => Boolean(x));

  const jsonLd = [
    articleLd({ headline: title(p), description: description(p), url, about: `${name(p)} ${p.title}` }),
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Past Papers", path: PAST_PAPERS_BASE },
      { name: `${name(p)} ${p.title}`, path: paperUrl(p) },
    ]),
  ];

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <JsonLd data={jsonLd} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">
        <Crumbs items={[{ name: "Home", path: "/" }, { name: "Past Papers", path: PAST_PAPERS_BASE }, { name: name(p) }]} />

        <header className="mb-8 max-w-3xl">
          <Eyebrow>{body.short} · {p.level}{p.scheme ? ` · ${p.scheme}` : ""}</Eyebrow>
          <H1>{name(p)} {p.title} Past Papers</H1>
          <p className="text-base sm:text-lg" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
            {hasSittings
              ? `${sittings.length} sittings indexed (${latestFirst.map((s) => s.name).join(", ")}), with links to the official paper and examiners' comments, a topical index and a walkthrough for every question.`
              : "Official model-paper access, syllabus weightings and free chapter MCQs."}
          </p>
        </header>

        <details className="lg:hidden rounded-2xl mb-10" style={card}>
          <summary className="cursor-pointer px-5 py-4 font-bold" style={heading}>On this page</summary>
          <ol className="px-5 pb-4 space-y-2 text-sm">
            {toc.map((x) => <li key={x.id}><a href={`#${x.id}`} style={{ color: "var(--text-2)", textDecoration: "none" }}>{x.label}</a></li>)}
          </ol>
        </details>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12">
          <article className="min-w-0 text-[1.02rem]" style={{ color: "var(--text-2)", lineHeight: 1.75 }}>
            <Section id="overview" title="Overview">
              {p.overview.map((para, i) => <p key={i} className="mb-4">{para}</p>)}
              <p className="text-sm mb-4" style={muted}>{p.format}</p>
              {p.notes?.length ? (
                <div className="rounded-2xl p-5" style={{ ...card, borderLeft: "3px solid var(--gold)" }}>
                  <p className="font-bold mb-2" style={heading}>Worth knowing</p>
                  <Bullets items={p.notes} />
                </div>
              ) : null}
            </Section>

            {hasSittings && (
              <Section id="sittings" title="Sittings and official links" intro={<p>Each paper link opens the official PDF on {body.short}&apos;s website. Our analysis page for each sitting lists every question with its topic, marks and pass rate.</p>}>
                <ScrollTable label="Sittings">
                  <thead>
                    <tr>
                      <th style={th}>Sitting</th>
                      <th style={th}>Exam date</th>
                      <th style={th}>Question paper</th>
                      <th style={th}>Examiners&apos; comments</th>
                      <th style={th}>Suggested answers</th>
                      <th style={th}>Pass rate</th>
                      <th style={th}>Our analysis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestFirst.map((s) => (
                      <tr key={s.slug}>
                        <td style={{ ...td, whiteSpace: "nowrap", color: "var(--text-1)", fontWeight: 600 }}>{s.name}</td>
                        <td style={{ ...td, whiteSpace: "nowrap" }}>{fmtDate(s.date)}</td>
                        <td style={td}><ExtLink href={s.paperUrl}>PDF</ExtLink></td>
                        <td style={td}>{s.commentsUrl ? <ExtLink href={s.commentsUrl}>PDF</ExtLink> : <span style={muted}>Not published</span>}</td>
                        <td style={td}>{s.answersUrl ? <><ExtLink href={s.answersUrl}>Portal</ExtLink><span className="block text-xs" style={muted}>login required</span></> : <span style={muted}>Not public</span>}</td>
                        <td style={{ ...td, whiteSpace: "nowrap" }}>{s.passRate !== undefined ? `${s.passRate}%` : "–"}</td>
                        <td style={{ ...td, whiteSpace: "nowrap" }}><Link href={sittingUrl(p, s)} style={link}>{s.name} analysis</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </ScrollTable>
                <p className="text-sm mt-3" style={muted}>{latestFirst[0]?.answersNote}</p>
              </Section>
            )}

            {hasSittings && (
              <Section id="topical" title="Yearly topical index" intro={<p>Marks per area in each sitting, from our reading of the official papers. Most-examined areas first. MCQ items are counted under their own area. Tap an area to practise its chapter MCQs.</p>}>
                <ScrollTable label="Topic by sitting matrix">
                  <thead>
                    <tr>
                      <th style={th}>Area</th>
                      {sittings.map((s) => <th key={s.slug} style={{ ...th, textAlign: "right" }}><Link href={sittingUrl(p, s)} style={{ color: "var(--text-1)", textDecoration: "none" }}>{s.name}</Link></th>)}
                      <th style={{ ...th, textAlign: "right" }}>Total</th>
                      <th style={{ ...th, textAlign: "right" }}>Sittings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.map((r) => (
                      <tr key={r.area.id}>
                        <td style={{ ...td, minWidth: 200 }}>
                          {r.area.mcq ? <Link href={r.area.mcq} style={{ color: "var(--text-1)", textDecoration: "none" }}>{r.area.label}</Link> : <span style={{ color: "var(--text-1)" }}>{r.area.label}</span>}
                        </td>
                        {r.marks.map((m, i) => (
                          <td key={i} style={{ ...td, textAlign: "right", fontVariantNumeric: "tabular-nums", color: m ? "var(--text-1)" : "var(--text-3)", background: m ? `color-mix(in srgb, var(--green) ${Math.min(40, 6 + m * 1.6)}%, transparent)` : undefined }}>
                            {m ? fmtMarks(m) : "–"}
                          </td>
                        ))}
                        <td style={{ ...td, textAlign: "right", fontWeight: 700, color: "var(--text-1)" }}>{fmtMarks(r.total)}</td>
                        <td style={{ ...td, textAlign: "right" }}>{r.appearances}/{sittings.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </ScrollTable>

                <h3 className="font-bold text-lg mt-8 mb-3" style={heading}>Question-by-question index</h3>
                <ScrollTable label="Questions by sitting">
                  <thead>
                    <tr>
                      <th style={th}>Sitting</th>
                      <th style={th}>Q</th>
                      <th style={th}>Main area</th>
                      <th style={{ ...th, textAlign: "right" }}>Marks</th>
                      <th style={{ ...th, textAlign: "right" }}>Pass rate</th>
                      <th style={th}>Walkthrough</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestFirst.flatMap((s) =>
                      s.questions.map((q) => {
                        const area = p.areas.find((a) => a.id === primaryArea(q));
                        return (
                          <tr key={`${s.slug}-${q.n}`}>
                            <td style={{ ...td, whiteSpace: "nowrap" }}>{s.name}</td>
                            <td style={{ ...td, whiteSpace: "nowrap", color: "var(--text-1)", fontWeight: 600 }}>Q{q.n}</td>
                            <td style={{ ...td, minWidth: 220 }}>{q.format === "MCQ" ? "MCQs (mixed areas)" : area?.label}</td>
                            <td style={{ ...td, textAlign: "right" }}>{fmtMarks(questionMarks(q))}</td>
                            <td style={{ ...td, textAlign: "right" }}>{q.passRate !== undefined ? `${q.passRate}%` : "–"}</td>
                            <td style={{ ...td, whiteSpace: "nowrap" }}><Link href={questionUrl(p, s, q)} style={link}>Open</Link></td>
                          </tr>
                        );
                      }),
                    )}
                  </tbody>
                </ScrollTable>
              </Section>
            )}

            {hasSittings && (
              <Section id="trends" title="Trends across sittings" intro={<p>Patterns in the {sittings.length} indexed sittings. With so few papers under the current scheme, treat these as patterns to inform revision, not predictions of what will be set.</p>}>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl p-5" style={card}>
                    <p className="font-bold mb-2" style={heading}>In every sitting ({t.every.length})</p>
                    {t.every.length ? <Bullets items={t.every.map((r) => `${r.area.label} – ${fmtMarks(r.average)} marks on average`)} /> : <p>None yet.</p>}
                  </div>
                  <div className="rounded-2xl p-5" style={card}>
                    <p className="font-bold mb-2" style={heading}>Rotating ({t.rotating.length})</p>
                    {t.rotating.length ? (
                      <Bullets items={t.rotating.map((r) => `${r.area.label} – ${sittings.filter((_, i) => r.marks[i] > 0).map((s) => s.name).join(", ")}`)} />
                    ) : <p>None.</p>}
                  </div>
                  <div className="rounded-2xl p-5" style={card}>
                    <p className="font-bold mb-2" style={heading}>Not yet examined ({t.absent.length})</p>
                    {t.absent.length ? <Bullets items={t.absent.map((r) => r.area.label)} /> : <p>Every area we track has appeared at least once.</p>}
                  </div>
                </div>
                {t.notLatest.length > 0 && (
                  <p className="mt-4">
                    Examined before but absent from {latestFirst[0].name}: {t.notLatest.map((r) => r.area.label).join(", ")}. A skipped area is a
                    reasonable candidate to revise early, but a gap in a handful of papers predicts nothing, so don&apos;t drop any syllabus area.
                  </p>
                )}
              </Section>
            )}

            {hasSittings && (
              <Section id="averages" title="Average marks by area" intro={<p>Average marks per sitting across the indexed papers.</p>}>
                <div className="rounded-2xl p-5" style={card}>
                  {matrix.filter((r) => r.total > 0).map((r) => (
                    <Bar key={r.area.id} label={r.area.label} value={r.average} max={maxAvg} suffix=" marks" href={r.area.mcq} />
                  ))}
                </div>
              </Section>
            )}

            {hasSittings && (
              <Section id="prioritise" title="What to prioritise">
                <ol className="list-decimal pl-5 space-y-3">
                  <li>
                    <strong style={{ color: "var(--text-1)" }}>Heaviest areas.</strong>{" "}
                    {matrix.slice(0, 4).map((r) => `${r.area.label} (${fmtMarks(r.average)} marks a sitting)`).join("; ")}. Between them these carry about{" "}
                    {Math.round(matrix.slice(0, 4).reduce((a, r) => a + r.average, 0))} of every 100 marks.
                  </li>
                  {weakest.length > 0 && (
                    <li>
                      <strong style={{ color: "var(--text-1)" }}>Where candidates lose the most.</strong> The lowest published pass rates were{" "}
                      {weakest.map(({ s, q }, i) => (
                        <span key={`${s.slug}${q.n}`}>
                          {i > 0 && "; "}
                          <Link href={questionUrl(p, s, q)} style={link}>{s.name} Q{q.n}</Link> ({p.areas.find((a) => a.id === primaryArea(q))?.label}, {q.passRate}%)
                        </span>
                      ))}
                      . Work through those walkthroughs first.
                    </li>
                  )}
                  <li>
                    <strong style={{ color: "var(--text-1)" }}>Don&apos;t skip the short areas.</strong> The MCQ block and Section A questions regularly test smaller areas
                    {t.rotating.length ? ` such as ${t.rotating.slice(-3).map((r) => r.area.label).join(", ")}` : ""}. Chapter MCQs are the fastest way to cover them.
                  </li>
                  {p.notes?.length ? <li><strong style={{ color: "var(--text-1)" }}>Check the syllabus.</strong> {p.notes[0]}</li> : null}
                </ol>
              </Section>
            )}

            {p.grid && (
              <Section id="syllabus" title="Syllabus weightings" intro={<p>Weightings from {body.short}&apos;s published syllabus{hasSittings ? ", against the marks actually set in each sitting (our classification of each question into a syllabus section)" : ""}.</p>}>
                <ScrollTable label="Syllabus weighting">
                  <thead>
                    <tr>
                      <th style={th}>Section</th>
                      <th style={{ ...th, textAlign: "right" }}>Syllabus weight</th>
                      {sittings.map((s) => <th key={s.slug} style={{ ...th, textAlign: "right" }}>{s.name}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {p.grid.map((g) => (
                      <tr key={g.id}>
                        <td style={{ ...td, minWidth: 220 }}><span style={{ color: "var(--text-1)", fontWeight: 600 }}>{g.id}.</span> {g.label}</td>
                        <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>{g.min}–{g.max}%</td>
                        {sittings.map((s) => <td key={s.slug} style={{ ...td, textAlign: "right" }}>{fmtMarks(gridMarks(p, s).get(g.id) ?? 0)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </ScrollTable>
                {p.syllabusUrl && <p className="text-sm mt-3"><ExtLink href={p.syllabusUrl}>Official syllabus (PDF)</ExtLink></p>}
              </Section>
            )}

            {picks.length > 0 && (
              <Section id="practice" title="Practice questions on the most-examined areas" intro={<p>Original exam-style questions written by us, with our own numbers. Try each before opening the solution.</p>}>
                <div className="space-y-6">
                  {picks.map(({ sitting, question }) => (
                    <div key={`${sitting.slug}-${question.n}`}>
                      <Example ex={question.walkthrough!.example} collapsible />
                      <p className="text-sm mt-2">
                        Topic seen in <Link href={questionUrl(p, sitting, question)} style={link}>{p.code} {sitting.name} Q{question.n}</Link> – full walkthrough there.
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <Section id="mcqs" title={`${p.code} chapter MCQs`} intro={<p>Free MCQs with explanations for every area in the index.</p>}>
              <div className="grid gap-3 sm:grid-cols-2">
                {p.areas.filter((a) => a.mcq).map((a) => {
                  const total = sittings.reduce((sum, s) => sum + (areaMarks(s).get(a.id) ?? 0), 0);
                  return (
                    <Link key={a.id} href={a.mcq!} className="flex items-center justify-between gap-3 rounded-xl px-4 py-3" style={{ ...card, textDecoration: "none" }}>
                      <span className="min-w-0">
                        <span className="block font-semibold" style={{ color: "var(--text-1)" }}>{a.label}</span>
                        {hasSittings && <span className="block text-xs" style={muted}>{total ? `${fmtMarks(total)} marks across indexed sittings` : "Not yet examined in indexed sittings"}</span>}
                      </span>
                      <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} aria-hidden />
                    </Link>
                  );
                })}
              </div>
              {p.mcqHub && <p className="mt-4 text-sm"><Link href={p.mcqHub} style={link}>All {p.code} MCQs →</Link></p>}
            </Section>

            {p.resources?.length ? (
              <Section id="resources" title="Official resources">
                <ul className="space-y-2">
                  {p.resources.map((r) => (
                    <li key={r.url}><ExtLink href={r.url}>{r.label}</ExtLink>{r.note && <span className="text-sm" style={muted}> – {r.note}</span>}</li>
                  ))}
                  <li><ExtLink href={p.officialUrl}>{body.short} {p.code} official page</ExtLink></li>
                </ul>
              </Section>
            ) : null}

            <Attribution body={p.body} sourceUrl={p.officialUrl} />
          </article>

          <aside className="hidden lg:block">
            <nav aria-label="Table of contents" className="sticky top-28 rounded-2xl p-5" style={card}>
              <p className="font-bold mb-3" style={heading}>On this page</p>
              <ol className="space-y-2 text-sm">
                {toc.map((x) => <li key={x.id}><a href={`#${x.id}`} style={{ color: "var(--text-2)", textDecoration: "none" }}>{x.label}</a></li>)}
              </ol>
              {latestFirst.length > 0 && (
                <>
                  <p className="font-bold mt-5 mb-2" style={heading}>Sittings</p>
                  <ul className="space-y-1.5 text-sm">
                    {latestFirst.map((s) => <li key={s.slug}><Link href={sittingUrl(p, s)} style={link}>{s.name}</Link></li>)}
                  </ul>
                </>
              )}
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
