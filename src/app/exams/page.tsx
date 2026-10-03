import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe2 } from "lucide-react";
import { EXAM_BODIES, type ExamBody } from "@/data/regions";
import { getVisitorRegion } from "@/lib/region";

const PAGE_URL = "https://www.thecahub.com/exams";
const TITLE = "Free Accountancy Exam MCQ Practice for Every Country | The CA Hub";
const DESCRIPTION =
  "Free MCQ and objective-test practice for CA, ACCA, CIMA, ICAEW, US CPA and more. Live ICAP (CA Pakistan) question banks today, with ICAI, ACCA, CIMA and other bodies launching next.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "accountancy exam practice",
    "CA MCQ practice",
    "ACCA MCQ",
    "CIMA OT practice",
    "CPA practice questions",
    "ICAP MCQ",
    "CA Foundation MCQ",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: "website", siteName: "The CA Hub" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

function countryName(code?: string): string | undefined {
  if (!code) return undefined;
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? undefined;
  } catch {
    return undefined;
  }
}

function BodyCard({ body }: { body: ExamBody }) {
  const live = body.status === "live";
  const paperCount = body.levels.reduce((n, l) => n + l.papers.length, 0);
  return (
    <Link
      href={`/exams/${body.id}`}
      className="group rounded-2xl p-5 sm:p-6 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "var(--bg-2)",
        border: live ? "1px solid rgba(61,179,113,0.45)" : "1px solid var(--border)",
        textDecoration: "none",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-2xl leading-none" aria-hidden>{body.flag}</span>
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={
            live
              ? { background: "var(--green)", color: "#fff" }
              : { background: "var(--bg-3)", color: "var(--text-2)", border: "1px solid var(--border)" }
          }
        >
          {live ? "Live" : "Coming soon"}
        </span>
      </div>
      <div>
        <h3 className="font-bold text-lg leading-snug" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          {body.short}
          <span className="font-medium text-sm" style={{ color: "var(--text-3)" }}> · {body.region}</span>
        </h3>
        <p className="text-xs mt-1" style={{ color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>
          {body.qualification}
        </p>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
        {body.tagline}
      </p>
      <div className="mt-auto pt-2 flex items-center justify-between text-xs font-semibold" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        <span style={{ color: "var(--text-3)" }}>
          {body.levels.length} {body.levels.length === 1 ? "level" : "levels"} · {paperCount} papers
        </span>
        <span className="inline-flex items-center gap-1 transition-transform group-hover:translate-x-0.5" style={{ color: "var(--green)" }}>
          {live ? "Practice free" : "Join waitlist"} <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

function Group({ label, note, bodies }: { label: string; note: string; bodies: ExamBody[] }) {
  if (!bodies.length) return null;
  return (
    <section className="mb-14">
      <div className="flex items-center gap-3 mb-2">
        <span
          className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ color: "var(--green)", background: "rgba(61,179,113,0.08)", border: "1px solid rgba(61,179,113,0.2)" }}
        >
          {label}
        </span>
      </div>
      <p className="text-sm mb-6" style={{ color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>{note}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bodies.map((b) => <BodyCard key={b.id} body={b} />)}
      </div>
    </section>
  );
}

export default async function ExamsPage() {
  const { country, body } = await getVisitorRegion();
  const place = countryName(country);
  const live = EXAM_BODIES.filter((b) => b.status === "live");
  const soon = EXAM_BODIES.filter((b) => b.status !== "live");
  const suggestedHref = body.status === "live" && body.practiceHref ? body.practiceHref : `/exams/${body.id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Accountancy exam MCQ practice by exam body",
    itemListElement: EXAM_BODIES.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${b.short} MCQ practice`,
      url: `${PAGE_URL}/${b.id}`,
    })),
  };

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">

        {/* Hero */}
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            Global Exam Hub
          </p>
          <h1 className="font-bold mb-4"
            style={{ fontSize: "clamp(2rem,5vw,3.25rem)", color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif", lineHeight: 1.1 }}>
            Accountancy exam practice<br />
            <span style={{ color: "var(--green)" }}>for every country.</span>
          </h1>
          <p className="text-base sm:text-lg max-w-2xl"
            style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.7 }}>
            Free MCQ and objective-test drills for chartered accountancy and professional accounting exams —
            CA Pakistan, CA India, ACCA, CIMA, ICAEW, US CPA and more. Pick your exam body to start practising
            or join the waitlist for the next question banks we launch.
          </p>
        </div>

        {/* Region suggestion */}
        <Link
          href={suggestedHref}
          className="group mb-14 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-transform hover:-translate-y-0.5"
          style={{ background: "var(--bg-2)", border: "1px solid rgba(61,179,113,0.35)", textDecoration: "none" }}
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl leading-none" aria-hidden>{body.flag}</span>
            <div>
              <p className="font-bold text-base sm:text-lg" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                {place ? `Looks like you're in ${place}` : "Not sure where to start?"} — jump to {body.short} {body.status === "live" ? "practice" : "early access"}
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
                {body.tagline} Wrong exam? Switch any time from the region menu in the header.
              </p>
            </div>
          </div>
          <span className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: "var(--green)", fontFamily: "var(--font-inter), sans-serif" }}>
            {body.status === "live" ? "Start practising" : "Get early access"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Group label="Live now" note="Full question banks with explanations, topical drills and mocks — free." bodies={live} />
        <Group label="Coming soon" note="Join a waitlist and we'll email you the moment that body's MCQ bank opens. Bodies with the most sign-ups launch first." bodies={soon} />

        {/* SEO copy */}
        <section className="mt-6 rounded-3xl p-6 sm:p-10" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Globe2 className="w-5 h-5" style={{ color: "var(--green)" }} />
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              Why MCQ practice matters in every accountancy qualification
            </h2>
          </div>
          <div className="space-y-4 text-sm sm:text-base leading-relaxed max-w-3xl" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
            <p>
              Almost every modern accountancy exam is now partly or fully objective. ICAP&apos;s PRC papers are computer-based MCQs,
              ACCA&apos;s Applied Knowledge exams and CIMA&apos;s Certificate papers are on-demand objective tests, CA India has
              case-scenario MCQ sections, and multiple-choice questions make up half of each US CPA section score.
            </p>
            <p>
              The CA Hub was built by an ICAP gold medallist to make that practice free: hand-picked questions, a clear
              explanation for every answer, topical drills and timed mocks. We&apos;re expanding body by body — tell us which
              exam you&apos;re sitting and we&apos;ll prioritise it.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
