import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BODIES,
  PAST_PAPERS_BASE,
  areaLabel,
  areaMarks,
  fmtDate,
  fmtMarks,
  getPaper,
  getSitting,
  gridMarks,
  newestFirst,
  paperUrl,
  papers,
  questionMarks,
  questionUrl,
  sittingMarks,
  sittingShifts,
  sittingUrl,
  withPage,
  type Paper,
  type Sitting,
} from "@/data/pastPapers";
import {
  Attribution,
  BASE_URL,
  Bar,
  Bullets,
  Crumbs,
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
} from "../../ui";

type Props = { params: Promise<{ paper: string; sitting: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return papers.flatMap((p) => p.sittings.map((s) => ({ paper: p.slug, sitting: s.slug })));
}

const label = (p: Paper, s: Sitting) => `${BODIES[p.body].short} ${p.code} ${s.name}`;
const title = (p: Paper, s: Sitting) => `${label(p, s)} Past Paper – ${p.title}: Topics, Marks & Analysis`;
function description(p: Paper, s: Sitting) {
  const top = [...areaMarks(s).entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id]) => areaLabel(p, id).replace(/ \(.*\)$/, ""));
  return `${label(p, s)} ${p.title}: official paper and examiners' comments links, every question's topic and marks, pass rates${s.passRate !== undefined ? ` (overall ${s.passRate}%)` : ""} and walkthroughs. Heaviest areas: ${top.join(", ")}.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paper, sitting } = await params;
  const p = getPaper(paper);
  const s = p && getSitting(p, sitting);
  if (!p || !s) return {};
  const url = `${BASE_URL}${sittingUrl(p, s)}`;
  return {
    title: { absolute: title(p, s) },
    description: description(p, s),
    keywords: [`${p.code} ${s.name}`, `${p.code} ${s.name} past paper`, `${p.code} ${s.name} solution`, `${p.code} ${s.name} examiners comments`, `${BODIES[p.body].short} ${p.code} ${s.name}`],
    alternates: { canonical: url },
    openGraph: { title: title(p, s), description: description(p, s), url, type: "article" },
  };
}

export default async function SittingPage({ params }: Props) {
  const { paper, sitting } = await params;
  const p = getPaper(paper);
  const s = p && getSitting(p, sitting);
  if (!p || !s) notFound();

  const url = `${BASE_URL}${sittingUrl(p, s)}`;
  const body = BODIES[p.body];
  const marks = [...areaMarks(s).entries()].sort((a, b) => b[1] - a[1]);
  const maxMarks = Math.max(1, ...marks.map(([, m]) => m));
  const total = sittingMarks(s);
  const { heavier, lighter } = sittingShifts(p, s);
  const grid = gridMarks(p, s);
  const others = newestFirst(p).filter((x) => x.slug !== s.slug);
  const withRates = s.questions.filter((q) => q.passRate !== undefined);

  const jsonLd = [
    articleLd({ headline: title(p, s), description: description(p, s), url, about: `${p.code} ${p.title} ${s.name}` }),
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Past Papers", path: PAST_PAPERS_BASE },
      { name: `${body.short} ${p.code}`, path: paperUrl(p) },
      { name: s.name, path: sittingUrl(p, s) },
    ]),
  ];

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <JsonLd data={jsonLd} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">
        <Crumbs items={[{ name: "Home", path: "/" }, { name: "Past Papers", path: PAST_PAPERS_BASE }, { name: `${body.short} ${p.code}`, path: paperUrl(p) }, { name: s.name }]} />

        <header className="mb-8 max-w-3xl">
          <Eyebrow>{body.short} {p.code} · {p.title}</Eyebrow>
          <H1>{p.code} {s.name} Past Paper: Topics, Marks and Analysis</H1>
          <p className="text-base sm:text-lg" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
            Sat on {fmtDate(s.date)}. {s.questions.length} questions, {fmtMarks(total)} marks
            {s.passRate !== undefined ? `, overall pass rate ${s.passRate}%` : ""}. Use this page alongside the official paper.
          </p>
        </header>

        <div className="rounded-2xl p-5 mb-12 grid gap-3 sm:grid-cols-3" style={{ ...card, borderColor: "color-mix(in srgb, var(--green) 35%, transparent)" }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={muted}>Question paper</p>
            <ExtLink href={s.paperUrl} strong>Open official PDF</ExtLink>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={muted}>Examiners&apos; comments</p>
            {s.commentsUrl ? <ExtLink href={s.commentsUrl} strong>Open official PDF</ExtLink> : <span>Not published</span>}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={muted}>Suggested answers</p>
            {s.answersUrl ? <ExtLink href={s.answersUrl} strong>{s.answersNote ? `${body.short} student portal` : "Open official PDF"}</ExtLink> : <span>Not public</span>}
            {s.answersNote && <p className="text-xs mt-1" style={muted}>{s.answersNote}</p>}
          </div>
        </div>

        <article className="min-w-0 text-[1.02rem]" style={{ color: "var(--text-2)", lineHeight: 1.75 }}>
          <Section id="questions" title="Questions in this paper" intro={<p>Our own one-line description of what each question tests. &quot;Paper&quot; jumps to the question&apos;s page in the official PDF; &quot;Comments&quot; to the examiners&apos; notes on it.</p>}>
            <ScrollTable label="Questions">
              <thead>
                <tr>
                  <th style={th}>Q</th>
                  <th style={th}>Area</th>
                  <th style={th}>What it tests</th>
                  <th style={{ ...th, textAlign: "right" }}>Marks</th>
                  <th style={{ ...th, textAlign: "right" }}>Pass rate</th>
                  <th style={th}>Official</th>
                  <th style={th}>Walkthrough</th>
                </tr>
              </thead>
              <tbody>
                {s.questions.map((q) => {
                  const areas = [...new Set(q.parts.map((x) => x.area))];
                  return (
                    <tr key={q.n}>
                      <td style={{ ...td, color: "var(--text-1)", fontWeight: 700, whiteSpace: "nowrap" }}>Q{q.n}</td>
                      <td style={{ ...td, minWidth: 180 }}>{q.format === "MCQ" ? "MCQs" : areas.map((a) => areaLabel(p, a)).join(", ")}</td>
                      <td style={{ ...td, minWidth: 280 }}>{q.summary}</td>
                      <td style={{ ...td, textAlign: "right" }}>{fmtMarks(questionMarks(q))}</td>
                      <td style={{ ...td, textAlign: "right" }}>{q.passRate !== undefined ? `${q.passRate}%` : "–"}</td>
                      <td style={{ ...td, whiteSpace: "nowrap" }}>
                        <ExtLink href={withPage(s.paperUrl, q.page)}>Paper</ExtLink>
                        {s.commentsUrl && <span className="block"><ExtLink href={withPage(s.commentsUrl, q.commentsPage)}>Comments</ExtLink></span>}
                      </td>
                      <td style={{ ...td, whiteSpace: "nowrap" }}><Link href={questionUrl(p, s, q)} style={link}>Q{q.n} walkthrough</Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </ScrollTable>
          </Section>

          <Section id="marks" title="Marks by area" intro={<p>All {fmtMarks(total)} marks, by area. MCQ items count towards their own area.</p>}>
            <div className="rounded-2xl p-5" style={card}>
              {marks.map(([id, m]) => {
                const area = p.areas.find((a) => a.id === id);
                return <Bar key={id} label={areaLabel(p, id)} value={m} max={maxMarks} suffix=" marks" href={area?.mcq} />;
              })}
            </div>
          </Section>

          {(heavier.length > 0 || lighter.length > 0) && (
            <Section id="shifts" title="Heavier and lighter than usual" intro={<p>Compared with the average across all {p.sittings.length} indexed sittings of {p.code} (differences of 5 marks or more).</p>}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl p-5" style={card}>
                  <p className="font-bold mb-2" style={heading}>Heavier</p>
                  {heavier.length ? <Bullets items={heavier.map((x) => `${x.area.label}: ${fmtMarks(x.marks)} marks vs ${fmtMarks(x.average)} average`)} /> : <p>No area was notably heavier.</p>}
                </div>
                <div className="rounded-2xl p-5" style={card}>
                  <p className="font-bold mb-2" style={heading}>Lighter</p>
                  {lighter.length ? <Bullets items={lighter.map((x) => `${x.area.label}: ${fmtMarks(x.marks)} marks vs ${fmtMarks(x.average)} average`)} /> : <p>No area was notably lighter.</p>}
                </div>
              </div>
            </Section>
          )}

          {p.grid && (
            <Section id="syllabus" title="Against the syllabus weightings">
              <ScrollTable label="Syllabus sections">
                <thead>
                  <tr>
                    <th style={th}>Section</th>
                    <th style={{ ...th, textAlign: "right" }}>Syllabus weight</th>
                    <th style={{ ...th, textAlign: "right" }}>{s.name} marks</th>
                  </tr>
                </thead>
                <tbody>
                  {p.grid.map((g) => (
                    <tr key={g.id}>
                      <td style={{ ...td, minWidth: 220 }}><span style={{ color: "var(--text-1)", fontWeight: 600 }}>{g.id}.</span> {g.label}</td>
                      <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>{g.min}–{g.max}%</td>
                      <td style={{ ...td, textAlign: "right" }}>{fmtMarks(grid.get(g.id) ?? 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </ScrollTable>
              <p className="text-sm mt-3" style={muted}>Section totals use our classification of each question&apos;s area into the syllabus grid.</p>
            </Section>
          )}

          {withRates.length > 0 && (
            <Section id="pass-rates" title="Pass rate by question" intro={<p>Published in the examiners&apos; comments for this sitting.</p>}>
              <div className="rounded-2xl p-5" style={card}>
                {withRates.map((q) => (
                  <Bar key={q.n} label={`Q${q.n} · ${q.format === "MCQ" ? "MCQs" : areaLabel(p, q.parts[0].area)}`} value={q.passRate!} max={100} suffix="%" href={questionUrl(p, s, q)} tone={q.passRate! < 30 ? "bad" : q.passRate! < 50 ? "gold" : "green"} />
                ))}
              </div>
            </Section>
          )}

          {s.themes?.length ? (
            <Section id="examiners" title="What the examiners said" intro={<p>The main themes of the official examiners&apos; comments, summarised in our own words. Read the full report for question-by-question detail.</p>}>
              <Bullets items={s.themes} />
              {s.commentsUrl && <p className="mt-4"><ExtLink href={s.commentsUrl} strong>Read the official examiners&apos; comments</ExtLink></p>}
            </Section>
          ) : (
            <Section id="examiners" title="What the examiners said">
              <p>Examiners&apos; comments for this sitting were not available to us, so this analysis is unavailable.</p>
            </Section>
          )}

          {others.length > 0 && (
            <Section id="other" title={`Other ${p.code} sittings`}>
              <div className="flex flex-wrap gap-3">
                {others.map((o) => <Link key={o.slug} href={sittingUrl(p, o)} className="rounded-xl px-4 py-2" style={{ ...card, ...link }}>{o.name}</Link>)}
                <Link href={`${paperUrl(p)}#topical`} className="rounded-xl px-4 py-2" style={{ ...card, ...link }}>{p.code} topical index</Link>
              </div>
            </Section>
          )}

          <Attribution body={p.body} sourceUrl={p.officialUrl} />
        </article>
      </div>
    </main>
  );
}
