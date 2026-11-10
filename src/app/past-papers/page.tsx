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
  type Paper,
} from "@/data/pastPapers";
import { Attribution, BASE_URL, Crumbs, H1, JsonLd, articleLd, breadcrumbLd, card, heading, muted } from "./ui";

const URL = `${BASE_URL}${PAST_PAPERS_BASE}`;
const TITLE = "Past Papers with Topical Analysis – ICAP CAF, PRC & ICAI CA Inter";
const DESCRIPTION =
  "Free ICAP CAF past papers hub: official paper and examiners' comments links for every sitting, a topic-by-sitting index, trends, question walkthroughs and original practice questions with worked solutions. ICAP CAF-1, CAF-5, CAF-6, PRC and ICAI CA Inter Costing.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["ICAP CAF past papers", "CAF past papers with solutions", "CAF-1 past papers", "CAF-5 past papers", "CAF-6 past papers", "PRC past papers", "ICAP topical past papers", "ICAP examiners comments", "CA Inter costing past papers", "CA Inter suggested answers"],
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: "article" },
};

function PaperCard({ p }: { p: Paper }) {
  const latest = newestFirst(p)[0];
  const qCount = p.sittings.reduce((t, s) => t + s.questions.filter((q) => q.walkthrough).length, 0);
  return (
    <Link href={paperUrl(p)} className="rounded-2xl p-5 flex flex-col gap-2" style={{ ...card, textDecoration: "none" }}>
      <span className="flex items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="block text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--green)" }}>{p.code}</span>
          <span className="block font-bold text-lg" style={heading}>{p.title}</span>
        </span>
        <ArrowRight className="w-5 h-5 shrink-0 mt-1" style={{ color: "var(--green)" }} aria-hidden />
      </span>
      <span className="text-sm" style={muted}>
        {p.sittings.length > 0
          ? `${p.sittings.length} sittings${qCount ? ` · ${qCount} walkthroughs` : ""}${latest ? ` · latest ${latest.name}` : ""}`
          : "Computer-based · model-paper access and syllabus weightings"}
      </span>
    </Link>
  );
}

export default function PastPapersHub() {
  const bodies = BODY_ORDER.filter((b) => papersForBody(b).length > 0);
  const all = bodies.flatMap(papersForBody);

  const jsonLd = [
    articleLd({ headline: "Past Papers Hub – ICAP CAF, PRC and ICAI CA Inter", description: DESCRIPTION, url: URL, about: "Accountancy exam past papers" }),
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
        <header className="mb-10 max-w-2xl">
          <H1>Past Papers</H1>
          <p className="text-base" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
            Official papers and examiners&apos; comments for every sitting, with a topic index and question walkthroughs.
          </p>
        </header>

        {bodies.map((b) => {
          const body = BODIES[b];
          const list = papersForBody(b);
          return (
            <section key={b} className="mb-14" aria-labelledby={`${b}-h`}>
              <h2 id={`${b}-h`} className="font-bold text-2xl sm:text-3xl mb-2" style={heading}>
                {body.short} <span className="text-base font-normal" style={muted}>{body.country}</span>
              </h2>
              {body.levels.map((lvl) => {
                const ps = list.filter((p) => p.level === lvl.id);
                if (!ps.length) return null;
                return (
                  <div key={lvl.id} className="mt-6">
                    <h3 className="font-bold text-lg mb-4" style={heading}>{lvl.label}</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {ps.map((p) => <PaperCard key={p.slug} p={p} />)}
                    </div>
                  </div>
                );
              })}
            </section>
          );
        })}

        {bodies.map((b) => <Attribution key={b} body={b} />)}
      </div>
    </main>
  );
}
