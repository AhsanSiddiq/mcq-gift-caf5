import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { standards, AREA_LABEL, AREA_ORDER } from "@/data/standards";
import StandardsExplorer, { type StandardCard } from "./StandardsExplorer";
import StandardsDisclaimer from "./Disclaimer";

const BASE_URL = "https://www.thecahub.com";
const URL = `${BASE_URL}/standards`;
const TITLE = "IFRS & IAS Standards Hub – Free Summaries, Key Points & MCQs";
const DESCRIPTION = `Exam-focused summaries of ${standards.length} IFRS Accounting Standards (IAS 1 to IFRS 18): scope, definitions, recognition and measurement, exam traps and worked examples for ICAP, ACCA, ICAI, CIMA and ICAEW students.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["IFRS summary", "IAS summary", "IFRS standards list", "IAS 16 summary", "IFRS 15 five step model", "IFRS 16 leases summary", "ACCA FR standards", "ICAP CAF standards"],
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: "website" },
};

export default function StandardsIndex() {
  const items: StandardCard[] = standards.map((s) => ({
    code: s.code,
    title: s.title,
    slug: s.slug,
    area: s.area,
    areaLabel: AREA_LABEL[s.area],
    objective: s.objective,
  }));
  const areas = AREA_ORDER.map((id) => ({ id, label: AREA_LABEL[id] }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "IFRS & IAS Standards Hub",
      description: DESCRIPTION,
      url: URL,
      isAccessibleForFree: true,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: standards.length,
        itemListElement: standards.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${s.code} ${s.title}`,
          url: `${URL}/${s.slug}`,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "IFRS & IAS Standards", item: URL },
      ],
    },
  ];

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold mb-8" style={{ color: "var(--text-3)", textDecoration: "none" }}>
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          Free study notes · {standards.length} standards
        </p>
        <h1 className="font-bold mb-4" style={{ fontSize: "clamp(1.8rem,4.5vw,3rem)", color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif", lineHeight: 1.12 }}>
          IFRS &amp; IAS Standards Hub
        </h1>
        <p className="text-base sm:text-lg mb-4 max-w-3xl" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
          Plain-English summaries of the IFRS Accounting Standards examined in ICAP CAF, ACCA FA/FR, ICAI CA Inter, CIMA
          BA3 and ICAEW Accounting. Each page covers scope, key definitions, recognition and measurement, disclosures,
          common exam traps and a short worked example, with links to practise MCQs.
        </p>
        <p className="text-sm mb-10 max-w-3xl rounded-xl px-4 py-3" style={{ color: "var(--text-2)", background: "var(--bg-2)", border: "1px solid var(--border)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--text-1)" }}>Heads-up:</strong> IFRS 18 (issued April 2024) replaces IAS 1 for
          annual periods beginning on or after 1 January 2027. Both are covered below.
        </p>

        <StandardsExplorer items={items} areas={areas} />

        <StandardsDisclaimer />
      </div>
    </main>
  );
}
