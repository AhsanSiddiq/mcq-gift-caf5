import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, AlertTriangle, ExternalLink } from "lucide-react";
import {
  standards,
  getStandard,
  getStandardByCode,
  getAdjacentStandards,
  AREA_LABEL,
  STANDARDS_REVIEWED,
  type Standard,
} from "@/data/standards";
import { allSubjects, subjectCode, LEVEL_LABEL } from "@/data/subjects";
import StandardsDisclaimer from "../Disclaimer";

const BASE_URL = "https://www.thecahub.com";
type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return standards.map((s) => ({ slug: s.slug }));
}

const pageTitle = (s: Standard) => `${s.code} ${s.title} – Summary, Key Points & MCQs`;
const pageDescription = (s: Standard) => {
  const d = `${s.code} ${s.title} summary: ${s.objective} Scope, definitions, recognition and measurement, exam traps${s.example ? ", a worked example" : ""} and MCQs.`;
  return d.length > 300 ? `${d.slice(0, 297)}…` : d;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getStandard(slug);
  if (!s) return {};
  const title = pageTitle(s);
  const description = pageDescription(s);
  const url = `${BASE_URL}/standards/${s.slug}`;
  return {
    title: { absolute: title },
    description,
    keywords: [`${s.code} summary`, `${s.code} ${s.title}`, `${s.code} notes`, `${s.code} MCQs`, `${s.title} IFRS`, `${s.code} exam questions`],
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", modifiedTime: STANDARDS_REVIEWED },
  };
}

const heading = { color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" } as const;
const card = { background: "var(--bg-2)", border: "1px solid var(--border)" } as const;

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 mb-12" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="font-bold text-xl sm:text-2xl mb-4" style={heading}>{title}</h2>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-2.5 marker:text-[var(--green)]">
      {items.map((t) => <li key={t}>{t}</li>)}
    </ul>
  );
}

export default async function StandardPage({ params }: Props) {
  const { slug } = await params;
  const s = getStandard(slug);
  if (!s) notFound();

  const url = `${BASE_URL}/standards/${s.slug}`;
  const { prev, next } = getAdjacentStandards(s.slug);
  const related = s.related.map(getStandardByCode).filter((r): r is Standard => Boolean(r));
  const banks = s.banks
    .map((id) => allSubjects.find((sub) => sub.id === id && sub.isAvailable))
    .filter((sub): sub is (typeof allSubjects)[number] => Boolean(sub));

  const toc = [
    s.status?.length ? { id: "status", label: "Status & recent changes" } : null,
    { id: "objective", label: "Objective" },
    { id: "scope", label: "Scope" },
    { id: "definitions", label: "Key definitions" },
    { id: "rules", label: "Recognition & measurement" },
    { id: "disclosures", label: "Key disclosures" },
    { id: "exam-traps", label: "Common exam traps" },
    s.example ? { id: "worked-example", label: "Worked example" } : null,
    related.length ? { id: "related", label: "Related standards" } : null,
    { id: "practise", label: "Practise MCQs" },
  ].filter((x): x is { id: string; label: string } => Boolean(x));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${s.code} ${s.title} – Summary & Key Points`.slice(0, 110),
      description: pageDescription(s),
      url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      datePublished: STANDARDS_REVIEWED,
      dateModified: STANDARDS_REVIEWED,
      inLanguage: "en",
      isAccessibleForFree: true,
      articleSection: AREA_LABEL[s.area],
      about: { "@type": "Thing", name: `${s.code} ${s.title}` },
      author: { "@type": "Organization", name: "The CA Hub Editorial", url: BASE_URL },
      publisher: { "@type": "Organization", name: "The CA Hub", url: BASE_URL, logo: { "@type": "ImageObject", url: `${BASE_URL}/CAHub.png` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "IFRS & IAS Standards", item: `${BASE_URL}/standards` },
        { "@type": "ListItem", position: 3, name: `${s.code} ${s.title}`, item: url },
      ],
    },
  ];

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">
        <nav aria-label="Breadcrumb" className="text-sm mb-6 flex flex-wrap items-center gap-x-2 gap-y-1" style={{ color: "var(--text-3)" }}>
          <Link href="/" style={{ color: "var(--text-3)", textDecoration: "none" }}>Home</Link>
          <span aria-hidden>/</span>
          <Link href="/standards" style={{ color: "var(--text-3)", textDecoration: "none" }}>Standards</Link>
          <span aria-hidden>/</span>
          <span style={{ color: "var(--text-2)" }}>{s.code}</span>
        </nav>

        <header className="mb-8 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            {AREA_LABEL[s.area]} · {s.code}
          </p>
          <h1 className="font-bold mb-4" style={{ ...heading, fontSize: "clamp(1.7rem,4.5vw,2.75rem)", lineHeight: 1.12 }}>
            {s.code} {s.title}
          </h1>
          <p className="text-base sm:text-lg" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
            Summary, key points, exam traps{s.example ? " and a worked example" : ""} — written for ICAP, ACCA, ICAI, CIMA
            and ICAEW students.
          </p>
        </header>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
          {/* Mobile table of contents */}
          <details className="lg:hidden rounded-2xl mb-10" style={card}>
            <summary className="cursor-pointer px-5 py-4 font-bold" style={heading}>On this page</summary>
            <ol className="px-5 pb-4 space-y-2 text-sm">
              {toc.map((t) => (
                <li key={t.id}><a href={`#${t.id}`} style={{ color: "var(--text-2)", textDecoration: "none" }}>{t.label}</a></li>
              ))}
            </ol>
          </details>

          <article className="min-w-0 text-[1.02rem]" style={{ color: "var(--text-2)", lineHeight: 1.75 }}>
            {s.status?.length ? (
              <section id="status" className="scroll-mt-28 mb-12 rounded-2xl p-5" style={{ ...card, borderLeft: "3px solid var(--green)" }} aria-labelledby="status-h">
                <h2 id="status-h" className="font-bold text-lg mb-3 flex items-center gap-2" style={heading}>
                  <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: "var(--green)" }} aria-hidden /> Status &amp; recent changes
                </h2>
                <Bullets items={s.status} />
              </section>
            ) : null}

            <Section id="objective" title="Objective">
              <p>{s.objective}</p>
            </Section>

            <Section id="scope" title="Scope">
              <Bullets items={s.scope} />
            </Section>

            <Section id="definitions" title="Key definitions">
              <dl className="space-y-3">
                {s.definitions.map((d) => (
                  <div key={d.term} className="rounded-xl p-4" style={card}>
                    <dt className="font-bold mb-1" style={heading}>{d.term}</dt>
                    <dd>{d.meaning}</dd>
                  </div>
                ))}
              </dl>
            </Section>

            <Section id="rules" title="Recognition & measurement">
              {s.rules.map((g) => (
                <div key={g.heading} className="mb-6">
                  <h3 className="font-bold text-lg mb-3" style={heading}>{g.heading}</h3>
                  <Bullets items={g.points} />
                </div>
              ))}
            </Section>

            <Section id="disclosures" title="Key disclosures">
              <Bullets items={s.disclosures} />
            </Section>

            <Section id="exam-traps" title="Common exam traps">
              <ul className="space-y-3">
                {s.traps.map((t) => (
                  <li key={t} className="flex gap-3 rounded-xl p-4" style={card}>
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--gold)" }} aria-hidden />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {s.example && (
              <Section id="worked-example" title={`Worked example: ${s.example.title}`}>
                <div className="rounded-2xl p-5" style={card}>
                  <p className="mb-4"><strong style={{ color: "var(--text-1)" }}>Scenario.</strong> {s.example.scenario}</p>
                  <ol className="list-decimal pl-5 space-y-2 mb-4">
                    {s.example.steps.map((st) => <li key={st}>{st}</li>)}
                  </ol>
                  <p className="rounded-xl px-4 py-3 font-semibold" style={{ color: "var(--text-1)", background: "color-mix(in srgb, var(--green) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--green) 30%, transparent)" }}>
                    Answer: {s.example.answer}
                  </p>
                </div>
              </Section>
            )}

            {related.length > 0 && (
              <Section id="related" title="Related standards">
                <div className="grid gap-3 sm:grid-cols-2">
                  {related.map((r) => (
                    <Link key={r.slug} href={`/standards/${r.slug}`} className="rounded-xl p-4 block" style={{ ...card, textDecoration: "none" }}>
                      <span className="block text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--green)" }}>{r.code}</span>
                      <span className="block font-semibold" style={{ color: "var(--text-1)" }}>{r.title}</span>
                    </Link>
                  ))}
                </div>
              </Section>
            )}

            <section id="practise" className="scroll-mt-28 mb-12 rounded-2xl p-5 sm:p-6" style={{ ...card, borderColor: "color-mix(in srgb, var(--green) 35%, transparent)" }} aria-labelledby="practise-h">
              <h2 id="practise-h" className="font-bold text-xl sm:text-2xl mb-2" style={heading}>Practise MCQs on this standard</h2>
              <p className="mb-5 text-sm sm:text-base">
                Test your understanding of {s.code} with free chapter-wise MCQs and explanations in these question banks.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {banks.map((b) => (
                  <Link
                    key={b.id}
                    href={`/${b.level.toLowerCase()}/${b.id}/mcqs`}
                    className="flex items-center justify-between gap-3 rounded-xl px-4 py-3"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)", textDecoration: "none" }}
                  >
                    <span className="min-w-0">
                      <span className="block font-bold" style={{ color: "var(--text-1)" }}>{subjectCode(b)} {b.title}</span>
                      <span className="block text-xs" style={{ color: "var(--text-3)" }}>{LEVEL_LABEL[b.level]}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} aria-hidden />
                  </Link>
                ))}
              </div>
              {banks.some((b) => b.body === "icai") && (
                <p className="mt-4 text-xs" style={{ color: "var(--text-3)" }}>
                  ICAI CA Intermediate examines Indian Accounting Standards, which are based on but can differ from IFRS. Check your syllabus.
                </p>
              )}
            </section>

            <nav aria-label="Previous and next standard" className="grid gap-3 sm:grid-cols-2 mb-12">
              {prev ? (
                <Link href={`/standards/${prev.slug}`} className="rounded-xl p-4 block" style={{ ...card, textDecoration: "none" }}>
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-3)" }}>
                    <ArrowLeft className="w-3.5 h-3.5" aria-hidden /> Previous
                  </span>
                  <span className="block font-semibold" style={{ color: "var(--text-1)" }}>{prev.code} {prev.title}</span>
                </Link>
              ) : <span className="hidden sm:block" />}
              {next && (
                <Link href={`/standards/${next.slug}`} className="rounded-xl p-4 block sm:text-right" style={{ ...card, textDecoration: "none" }}>
                  <span className="flex items-center sm:justify-end gap-1.5 text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-3)" }}>
                    Next <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                  </span>
                  <span className="block font-semibold" style={{ color: "var(--text-1)" }}>{next.code} {next.title}</span>
                </Link>
              )}
            </nav>

            <p className="mb-6 text-sm">
              <a href="https://www.ifrs.org/issued-standards/list-of-standards/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold" style={{ color: "var(--green)" }}>
                Read the official {s.code} text on ifrs.org <ExternalLink className="w-3.5 h-3.5" aria-hidden />
              </a>
            </p>
            <StandardsDisclaimer />
          </article>

          {/* Desktop table of contents */}
          <aside className="hidden lg:block">
            <nav aria-label="Table of contents" className="sticky top-28 rounded-2xl p-5" style={card}>
              <p className="font-bold mb-3" style={heading}>On this page</p>
              <ol className="space-y-2 text-sm">
                {toc.map((t) => (
                  <li key={t.id}><a href={`#${t.id}`} style={{ color: "var(--text-2)", textDecoration: "none" }}>{t.label}</a></li>
                ))}
              </ol>
              <Link href="/standards" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--green)", textDecoration: "none" }}>
                <ArrowLeft className="w-4 h-4" aria-hidden /> All standards
              </Link>
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
