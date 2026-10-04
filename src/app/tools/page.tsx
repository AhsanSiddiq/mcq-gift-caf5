import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { TOOLS, TOOLS_BASE_URL } from "@/data/tools";
import ToolIcon from "./_components/ToolIcon";

const TITLE = "Free Accounting & Finance Calculators – NPV, IRR, Depreciation, EOQ, WACC";
const DESCRIPTION =
  "Free accounting and finance calculators for CA, ACCA, CIMA, ICAEW and CMA students: depreciation schedules, NPV & IRR, loan amortisation, break-even, EOQ, financial ratios, WACC and compound interest. Formulas and worked examples included.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "accounting calculators",
    "finance calculators",
    "free financial calculator",
    "npv calculator",
    "irr calculator",
    "depreciation calculator",
    "break even calculator",
    "eoq calculator",
    "wacc calculator",
    "ratio analysis calculator",
  ],
  alternates: { canonical: TOOLS_BASE_URL },
  openGraph: {
    type: "website",
    siteName: "The CA Hub",
    title: "Free Accounting & Finance Calculators | The CA Hub",
    description: DESCRIPTION,
    url: TOOLS_BASE_URL,
    images: [{ url: "/CAHub.png", width: 1200, height: 630, alt: "Free accounting and finance calculators – The CA Hub" }],
  },
  twitter: { card: "summary_large_image", title: "Free Accounting & Finance Calculators | The CA Hub", description: DESCRIPTION, images: ["/CAHub.png"] },
};

const heading = { color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" } as const;

export default function ToolsHub() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Free accounting and finance calculators",
    itemListElement: [
      ...TOOLS.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.h1, url: `${TOOLS_BASE_URL}/${t.slug}` })),
      { "@type": "ListItem", position: TOOLS.length + 1, name: "Smart Study Planner", url: "https://www.thecahub.com/tools/study-planner" },
      { "@type": "ListItem", position: TOOLS.length + 2, name: "CA Induction CV Maker", url: "https://www.thecahub.com/cv-maker" },
    ],
  };

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, "\\u003c") }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--gold)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          Free tools
        </p>
        <h1 className="font-bold mb-4 max-w-3xl" style={{ ...heading, fontSize: "clamp(2rem,5vw,3.25rem)", lineHeight: 1.1 }}>
          Accounting &amp; finance calculators <span style={{ color: "var(--green)" }}>that show their workings.</span>
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mb-10" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
          Instant answers with full schedules you can copy into Excel, the formula behind every number, and a worked example to check your own method. Built for
          ICAP, ACCA, ICAI, CIMA, ICAEW and US CMA students. Free, no sign-up.
        </p>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <li key={t.slug} className="flex">
              <Link
                href={`/tools/${t.slug}`}
                className="group flex-1 rounded-2xl p-5 sm:p-6 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border)", textDecoration: "none" }}
              >
                <span className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--green) 14%, transparent)" }}>
                  <ToolIcon name={t.icon} className="w-5 h-5" style={{ color: "var(--green)" }} />
                </span>
                <h2 className="font-bold text-lg" style={heading}>{t.h1.replace(/ \(.*\)$/, "")}</h2>
                <p className="text-sm flex-1" style={{ color: "var(--text-2)", lineHeight: 1.6 }}>{t.blurb}</p>
                <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--green)" }}>
                  Open calculator <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
          <li className="flex">
            <Link
              href="/tools/study-planner"
              className="group flex-1 rounded-2xl p-5 sm:p-6 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: "var(--bg-2)", border: "1px solid color-mix(in srgb, var(--green) 45%, transparent)", textDecoration: "none" }}
            >
              <span className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--green) 14%, transparent)" }}>
                <CalendarDays className="w-5 h-5" style={{ color: "var(--green)" }} aria-hidden />
              </span>
              <h2 className="font-bold text-lg" style={heading}>Smart Study Planner</h2>
              <p className="text-sm flex-1" style={{ color: "var(--text-2)", lineHeight: 1.6 }}>
                Enter your papers and exam date to get a day-by-day plan with spaced revision, a countdown and calendar export.
              </p>
              <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--green)" }}>
                Build my plan <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </li>
          <li className="flex">
            <Link
              href="/cv-maker"
              className="group flex-1 rounded-2xl p-5 sm:p-6 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: "var(--bg-2)", border: "1px solid color-mix(in srgb, var(--gold) 45%, transparent)", textDecoration: "none" }}
            >
              <span className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--gold) 16%, transparent)" }}>
                <ToolIcon name="FileUser" className="w-5 h-5" style={{ color: "var(--gold)" }} />
              </span>
              <h2 className="font-bold text-lg" style={heading}>CA Induction CV Maker</h2>
              <p className="text-sm flex-1" style={{ color: "var(--text-2)", lineHeight: 1.6 }}>
                Build a Big 4-ready articleship CV in the two-column format recruiters expect, then download it as a PDF.
              </p>
              <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--gold)" }}>
                Build your CV <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </li>
        </ul>

        <section className="mt-14 rounded-2xl p-6 sm:p-8 max-w-4xl" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
          <h2 className="font-bold text-xl mb-3" style={heading}>Use the calculators to learn, not just to get the answer</h2>
          <p className="text-[15px] mb-3" style={{ color: "var(--text-2)", lineHeight: 1.75 }}>
            Exams reward method marks. Work each question by hand first, then use the calculator to check your answer and find exactly where your workings went
            off track, whether that is a discount factor, a missed tax shield or the wrong holding cost. Each page explains the formula and walks through a worked
            example.
          </p>
          <p className="text-[15px]" style={{ color: "var(--text-2)", lineHeight: 1.75 }}>
            When you are confident, practise the topic under exam conditions with our free{" "}
            <Link href="/practice" style={{ color: "var(--green)" }}>MCQ banks</Link> for management accounting, financial management and financial reporting.
          </p>
        </section>
      </div>
    </main>
  );
}
