import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenCheck, ChevronDown } from "lucide-react";
import { allSubjects, LEVEL_LABEL, subjectCode } from "@/data/subjects";
import { getTool, TOOLS, TOOLS_BASE_URL } from "@/data/tools";
import AdSlot from "@/components/AdSlot";
import ToolIcon from "./ToolIcon";

export interface Faq {
  q: string;
  a: string;
}

const heading = { color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" } as const;
const card = { background: "var(--bg-2)", border: "1px solid var(--border)" } as const;

export function toolMetadata(slug: string): Metadata {
  const t = getTool(slug);
  const url = `${TOOLS_BASE_URL}/${slug}`;
  const ogTitle = `${t.h1} – Free | The CA Hub`;
  return {
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: "The CA Hub",
      title: ogTitle,
      description: t.description,
      url,
      images: [{ url: "/CAHub.png", width: 1200, height: 630, alt: `${t.h1} – The CA Hub` }],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description: t.description, images: ["/CAHub.png"] },
  };
}

const ld = (o: unknown) => ({ __html: JSON.stringify(o).replace(/</g, "\\u003c") });

export default function ToolShell({
  slug,
  calculator,
  faqs,
  children,
}: {
  slug: string;
  calculator: ReactNode;
  faqs: Faq[];
  /** The "How it works" article body */
  children: ReactNode;
}) {
  const t = getTool(slug);
  const url = `${TOOLS_BASE_URL}/${slug}`;
  const practise = t.practise
    .map((id) => allSubjects.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => !!s && s.isAvailable);
  const related = TOOLS.filter((x) => x.slug !== slug).slice(0, 7);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.thecahub.com" },
      { "@type": "ListItem", position: 2, name: "Tools", item: TOOLS_BASE_URL },
      { "@type": "ListItem", position: 3, name: t.h1, item: url },
    ],
  };
  const appLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t.h1,
    url,
    description: t.description,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "The CA Hub", url: "https://www.thecahub.com" },
  };

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(faqLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(breadcrumbLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(appLd)} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">
        <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-semibold mb-6" style={{ color: "var(--text-3)", textDecoration: "none" }}>
          <ArrowLeft className="w-4 h-4" /> All free tools
        </Link>

        <header className="mb-8 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            <ToolIcon name={t.icon} className="w-4 h-4" /> Free calculator
          </p>
          <h1 className="font-bold mb-4" style={{ ...heading, fontSize: "clamp(1.8rem,4.5vw,2.8rem)", lineHeight: 1.12 }}>
            {t.h1}
          </h1>
          <p className="text-base sm:text-lg" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
            {t.intro}
          </p>
        </header>

        {calculator}

        <AdSlot className="mt-10" />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          <div className="min-w-0">
            <article aria-labelledby="how-it-works">
              <h2 id="how-it-works" className="font-bold mb-4" style={{ ...heading, fontSize: "clamp(1.4rem,3vw,1.9rem)" }}>
                How it works
              </h2>
              {children}
            </article>

            <section aria-labelledby="faq" className="mt-14">
              <h2 id="faq" className="font-bold mb-5" style={{ ...heading, fontSize: "clamp(1.4rem,3vw,1.9rem)" }}>
                Frequently asked questions
              </h2>
              <div className="flex flex-col gap-3">
                {faqs.map((f) => (
                  <details key={f.q} className="group rounded-2xl" style={card}>
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-4 sm:p-5 font-bold [&::-webkit-details-marker]:hidden" style={heading}>
                      <span>{f.q}</span>
                      <ChevronDown className="w-5 h-5 shrink-0 transition-transform group-open:rotate-180" style={{ color: "var(--text-3)" }} aria-hidden />
                    </summary>
                    <p className="px-4 sm:px-5 pb-5 -mt-1 text-[15px]" style={{ color: "var(--text-2)", lineHeight: 1.75 }}>
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            {practise.length > 0 && (
              <section aria-labelledby="practise" className="rounded-2xl p-5" style={{ ...card, borderColor: "color-mix(in srgb, var(--green) 40%, transparent)" }}>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--green)" }}>
                  <BookOpenCheck className="w-4 h-4" aria-hidden /> Practise this topic
                </p>
                <h2 id="practise" className="font-bold text-lg mb-1" style={heading}>
                  Test yourself with free MCQs
                </h2>
                <p className="text-sm mb-4" style={{ color: "var(--text-2)", lineHeight: 1.6 }}>
                  Exam-style questions with worked answers, chapter by chapter.
                </p>
                <ul className="flex flex-col gap-2">
                  {practise.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/${s.level.toLowerCase()}/${s.id}/mcqs`}
                        className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 transition-colors hover:brightness-110"
                        style={{ background: "var(--bg-3)", textDecoration: "none" }}
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-bold leading-snug" style={{ color: "var(--text-1)" }}>{subjectCode(s)} {s.title}</span>
                          <span className="block text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{LEVEL_LABEL[s.level]} MCQs</span>
                        </span>
                        <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <nav aria-labelledby="more-tools" className="rounded-2xl p-5" style={card}>
              <h2 id="more-tools" className="font-bold text-base mb-3" style={heading}>
                More free tools
              </h2>
              <ul className="flex flex-col gap-1">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/tools/${r.slug}`} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-semibold hover:brightness-125" style={{ color: "var(--text-2)", textDecoration: "none" }}>
                      <ToolIcon name={r.icon} className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} />
                      {r.h1.replace(/ \(.*\)$/, "")}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
