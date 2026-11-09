import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  BODIES,
  BODY_ORDER,
  PAST_PAPERS_BASE,
  newestFirst,
  papersForBody,
  paperUrl,
  topicMatrix,
  type Paper,
} from "@/data/pastPapers";
import { Attribution, BASE_URL, Crumbs, Eyebrow, H1, JsonLd, Pill, articleLd, breadcrumbLd, card, heading, muted } from "./ui";

const URL = `${BASE_URL}${PAST_PAPERS_BASE}`;
const TITLE = "ICAP CAF & PRC Past Papers – Topical Index, Analysis & Walkthroughs";
const DESCRIPTION =
  "Free ICAP CAF past papers hub: official paper and examiners' comments links for every sitting, a topic-by-sitting index, trends, question walkthroughs and original practice questions with worked solutions. CAF-1, CAF-5, CAF-6 and PRC.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["ICAP CAF past papers", "CAF past papers with solutions", "CAF-1 past papers", "CAF-5 past papers", "CAF-6 past papers", "PRC past papers", "ICAP topical past papers", "ICAP examiners comments"],
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: "article" },
};

function PaperCard({ p }: { p: Paper }) {
  const latest = newestFirst(p)[0];
  const top = topicMatrix(p).filter((r) => r.total > 0).slice(0, 3);
  const qCount = p.sittings.reduce((t, s) => t + s.questions.length, 0);
  return (
    <Link href={paperUrl(p)} className="rounded-2xl p-5 flex flex-col gap-3" style={{ ...card, textDecoration: "none" }}>
      <span className="flex items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="block text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--green)" }}>{p.code}</span>
          <span className="block font-bold text-lg" style={heading}>{p.title}</span>
        </span>
        <ArrowRight className="w-5 h-5 shrink-0 mt-1" style={{ color: "var(--green)" }} aria-hidden />
      </span>
      {p.sittings.length > 0 ? (
        <>
          <span className="flex flex-wrap gap-2">
            <Pill>{p.sittings.length} sittings indexed</Pill>
            <Pill>{qCount} question walkthroughs</Pill>
            {latest && <Pill>Latest: {latest.name}</Pill>}
          </span>
          {top.length > 0 && (
            <span className="text-sm" style={{ color: "var(--text-2)" }}>
              Most examined: {top.map((r) => r.area.label).join(" · ")}
            </span>
          )}
        </>
      ) : (
        <span className="text-sm" style={{ color: "var(--text-2)" }}>
          Computer-based. Official model-paper access, syllabus weightings and chapter MCQs.
        </span>
      )}
    </Link>
  );
}

export default function PastPapersHub() {
  const bodies = BODY_ORDER.filter((b) => papersForBody(b).length > 0);
  const all = bodies.flatMap(papersForBody);

  const jsonLd = [
    articleLd({ headline: "Past Papers Hub – ICAP CAF & PRC", description: DESCRIPTION, url: URL, about: "ICAP past papers" }),
    breadcrumbLd([{ name: "Home", path: "/" }, { name: "Past Papers", path: PAST_PAPERS_BASE }]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Past papers by paper",
      itemListElement: all.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: `${BODIES[p.body].short} ${p.code} ${p.title}`, url: `${BASE_URL}${paperUrl(p)}` })),
    },
  ];

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <JsonLd data={jsonLd} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">
        <Crumbs items={[{ name: "Home", path: "/" }, { name: "Past Papers" }]} />
        <header className="mb-10 max-w-3xl">
          <Eyebrow>Free · official sources · original practice</Eyebrow>
          <H1>Past Papers Hub</H1>
          <p className="text-base sm:text-lg mb-4" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
            Every sitting we index links straight to the official question paper and examiners&apos; comments, then adds what the PDFs
            don&apos;t: a topic-by-sitting matrix, marks by area, published pass rates per question, trends across sittings, and a
            walkthrough for each question with an original practice question and full worked solution.
          </p>
          <p className="text-sm" style={muted}>
            We only index papers we have read in full. Where a paper or answer is not publicly available, we say so instead of guessing.
          </p>
        </header>

        {bodies.map((b) => {
          const body = BODIES[b];
          const list = papersForBody(b);
          return (
            <section key={b} className="mb-14" aria-labelledby={`${b}-h`}>
              <h2 id={`${b}-h`} className="font-bold text-2xl sm:text-3xl mb-2" style={heading}>
                {body.short} <span className="text-base sm:text-lg font-semibold" style={muted}>· {body.name}</span>
              </h2>
              {body.levels.map((lvl) => {
                const ps = list.filter((p) => p.level === lvl.id);
                if (!ps.length) return null;
                return (
                  <div key={lvl.id} className="mt-6">
                    <h3 className="font-bold text-lg mb-1" style={heading}>{lvl.label}</h3>
                    <p className="text-sm mb-4 max-w-3xl" style={{ color: "var(--text-2)" }}>{lvl.blurb}</p>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {ps.map((p) => <PaperCard key={p.slug} p={p} />)}
                    </div>
                  </div>
                );
              })}
            </section>
          );
        })}

        <section className="mb-12 rounded-2xl p-5 sm:p-6 max-w-3xl" style={card} aria-labelledby="how-h">
          <h2 id="how-h" className="font-bold text-xl mb-3" style={heading}>How to use past papers well</h2>
          <ol className="list-decimal pl-5 space-y-2.5" style={{ color: "var(--text-2)" }}>
            <li>Start with the topical matrix on each paper page to see which areas carry the most marks across sittings.</li>
            <li>Sit one full paper under timed conditions using the official PDF, then mark it against the official suggested answer.</li>
            <li>Read the examiners&apos; comments for that sitting. The common mistakes are the cheapest marks to win back.</li>
            <li>For each weak question, open our walkthrough and attempt the original practice question before reading its solution.</li>
            <li>Close gaps with the chapter MCQs linked from every topic.</li>
          </ol>
        </section>

        <Attribution body="icap" />
      </div>
    </main>
  );
}
