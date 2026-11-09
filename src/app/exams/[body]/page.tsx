import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, HandCoins } from "lucide-react";
import { EXAM_BODIES, getBody, type ExamBody } from "@/data/regions";
import WaitlistForm from "@/components/WaitlistForm";
import { allSubjects, LEVEL_LABEL, subjectBody, subjectCode, type Subject } from "@/data/subjects";
import { blogs } from "@/data/blogs";

const BASE_URL = "https://www.thecahub.com";

// Only known bodies are routable; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return EXAM_BODIES.map((b) => ({ body: b.id }));
}

/** "BT/MA/FA" when the first level's papers have short codes, else the level name. */
function launchLabel(body: ExamBody): string {
  const first = body.levels[0];
  if (!first) return body.short;
  const codes = first.papers.map((p) => p.split(" ")[0]);
  const allCodes = codes.every((c) => /^[A-Z0-9-]{2,5}$/.test(c));
  return `${body.short} ${allCodes ? codes.join("/") : first.name}`;
}

/** URL of a subject's question bank, e.g. /acca/acca-fr/mcqs. */
const bankHref = (sub: Subject) => `/${sub.level.toLowerCase()}/${sub.id}/mcqs`;

/**
 * The live bank for a paper listed in regions.ts, matched by code ("FR Financial Reporting" ↔ "ACCA FR")
 * or by exact title ("Accounting Fundamentals"). Undefined when we have no bank for that paper.
 */
function bankForPaper(paper: string, subjects: Subject[]): Subject | undefined {
  const code = paper.split(" ")[0].toUpperCase();
  return subjects.find(
    (s) => s.title.toLowerCase() === paper.toLowerCase() || subjectCode(s).split(" ").pop()?.toUpperCase() === code,
  );
}

/**
 * Live subjects grouped under the body's levels. Returns null unless every live subject maps to a level,
 * so bodies whose paper names don't match their banks fall back to a single flat grid.
 */
function subjectsByLevel(body: ExamBody, subjects: Subject[]) {
  const groups = body.levels
    .map((lvl) => ({
      name: lvl.name,
      subjects: lvl.papers.map((p) => bankForPaper(p, subjects)).filter((s): s is Subject => !!s),
    }))
    .filter((g) => g.subjects.length > 0);
  const covered = new Set(groups.flatMap((g) => g.subjects.map((s) => s.id)));
  return subjects.every((s) => covered.has(s.id)) ? groups : null;
}

function faq(body: ExamBody) {
  const live = body.status === "live";
  const objective = body.levels.map((l) => `${l.name}: ${l.mcqNote}`).join(" ");
  return [
    {
      q: `Is ${body.short} MCQ practice on The CA Hub free?`,
      a: live
        ? `Yes. Every ${body.short} question bank, topical drill and mock on The CA Hub is free to practise, with an explanation for each answer.`
        : `Yes. ${body.short} practice will be free when it launches. Join the waitlist and we'll email you the moment the first question banks go live.`,
    },
    {
      q: `Which ${body.short} papers have MCQs or objective tests?`,
      a: objective,
    },
    {
      q: `When will ${body.short} practice questions be available?`,
      a: live
        ? `${body.short} practice is live now — start from the ${body.short} practice hub.`
        : `We launch exam bodies in order of demand. The more students who join the ${body.short} waitlist, the sooner ${launchLabel(body)} question banks open.`,
    },
    ...(body.faqs ?? []),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ body: string }> }): Promise<Metadata> {
  const { body: id } = await params;
  const body = getBody(id);
  if (!body) return {};
  const url = `${BASE_URL}/exams/${body.id}`;
  // How students search for each body (e.g. Indians search "CA Foundation/Inter MCQ test", not "ICAI").
  const SEARCH_TITLES: Record<string, string> = {
    icai: "Free CA Foundation & CA Inter MCQ Tests with Answers (ICAI)",
    icap: "Free ICAP PRC & CAF MCQs with Answers – Mock Tests",
    ima: "Free US CMA Part 1 & Part 2 MCQ Practice with Answers",
    icaew: "Free ICAEW ACA Certificate MCQ Practice with Answers",
  };
  const title = SEARCH_TITLES[body.id] ?? `Free ${body.short} MCQ Practice & Mock Tests with Answers`;
  const description =
    body.status === "live"
      ? `Free ${body.short} MCQ practice for ${body.qualification}: ${body.tagline}`
      : `Free ${body.short} MCQ practice is coming to The CA Hub. ${body.tagline} Join the waitlist to get early access.`;
  return {
    title,
    description,
    keywords: body.seoKeywords,
    // Waitlist bodies have no question banks yet: keep the thin landing page out of the index.
    ...(body.status === "live" ? {} : { robots: { index: false, follow: true } }),
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", siteName: "The CA Hub" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ExamBodyPage({ params }: { params: Promise<{ body: string }> }) {
  const { body: id } = await params;
  const body = getBody(id);
  if (!body) notFound();

  const live = body.status === "live" && !!body.practiceHref;
  const liveSubjects = allSubjects.filter((sub) => subjectBody(sub) === body.id && sub.isAvailable);
  const faqs = faq(body);
  const url = `${BASE_URL}/exams/${body.id}`;
  const grouped = subjectsByLevel(body, liveSubjects);
  const practiceGroups = grouped ?? [{ name: "", subjects: liveSubjects }];
  const guides = (body.guideSlugs ?? [])
    .map((slug) => blogs.find((b) => b.slug === slug))
    .filter((b): b is (typeof blogs)[number] => !!b);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: `${body.short} MCQ Practice`,
      description: body.tagline,
      url,
      isAccessibleForFree: true,
      educationalLevel: body.qualification,
      provider: { "@type": "Organization", name: "The CA Hub", sameAs: BASE_URL },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT1H",
      },
      offers: { "@type": "Offer", price: 0, priceCurrency: "USD", category: "Free" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">

        <Link href="/exams" className="inline-flex items-center gap-1.5 text-sm mb-8 hover:underline"
          style={{ color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>
          <ArrowLeft className="w-3.5 h-3.5" /> All exams
        </Link>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-3xl leading-none" aria-hidden>{body.flag}</span>
            <span className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--accent-ink)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              {body.qualification}
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={live
                ? { background: "var(--green)", color: "#fff" }
                : { background: "var(--bg-3)", color: "var(--text-2)", border: "1px solid var(--border)" }}
            >
              {live ? "Live" : "Coming soon"}
            </span>
          </div>
          <h1 className="font-bold mb-4"
            style={{ fontSize: "clamp(2rem,5vw,3.25rem)", color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif", lineHeight: 1.1 }}>
            Free {body.short} <span style={{ color: "var(--accent-ink)" }}>MCQ Practice</span>
          </h1>
          <p className="text-base sm:text-lg max-w-2xl"
            style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.7 }}>
            {body.tagline} Built for {body.name} students — every question explained, no paywall on practice.
          </p>
        </div>

        {/* Live practice subjects for bodies hosted on the shared /[level]/[subject] routes */}
        {body.id !== "icap" && liveSubjects.length > 0 && (
          <section id="practice" className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              Practise {body.short} now — free
            </h2>
            {practiceGroups.map((group) => (
              <div key={group.name || "all"} className="mb-4">
                {group.name && (
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                    {group.name}
                  </h3>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.subjects.map((sub) => (
                    <div key={sub.id} className="rounded-2xl p-5 flex flex-col gap-2"
                      style={{ background: "var(--bg-2)", border: "1px solid color-mix(in srgb, var(--green) 35%, transparent)" }}>
                      <span className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--accent-ink)" }}>{subjectCode(sub)}</span>
                      <Link href={bankHref(sub)} className="font-bold hover:underline" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif", textDecoration: "none" }}>
                        {sub.title}
                      </Link>
                      <span className="text-xs" style={{ color: "var(--text-3)" }}>{LEVEL_LABEL[sub.level]}</span>
                      <span className="text-sm" style={{ color: "var(--text-2)" }}>{sub.description}</span>
                      <span className="mt-auto pt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold">
                        <Link href={bankHref(sub)} className="inline-flex items-center gap-1" style={{ color: "var(--accent-ink)", textDecoration: "none" }}>
                          Question bank <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href={`/${sub.level.toLowerCase()}/${sub.id}`} className="inline-flex items-center gap-1" style={{ color: "var(--text-2)", textDecoration: "none" }}>
                          Quizzes and mocks
                        </Link>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Link href={`/daily/${body.id}`} className="mt-4 flex items-center justify-between gap-4 rounded-2xl p-5"
              style={{ background: "rgba(245,166,35,0.07)", border: "1px solid rgba(245,166,35,0.3)", textDecoration: "none" }}>
              <span>
                <span className="block font-bold" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>🔥 Daily {body.short} Challenge</span>
                <span className="block text-sm" style={{ color: "var(--text-2)" }}>10 questions a day, same for everyone. Build a streak and share your score.</span>
              </span>
              <span className="shrink-0 font-bold text-sm" style={{ color: "var(--gold)" }}>Play →</span>
            </Link>
          </section>
        )}

        {/* CTA */}
        <div className="mb-14 rounded-3xl p-6 sm:p-8" style={{ background: "var(--bg-2)", border: "1px solid color-mix(in srgb, var(--green) 35%, transparent)" }}>
          {live ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-1" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                  {body.short} question banks are live
                </h2>
                <p className="text-sm" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
                  Topical drills, full-random mocks and the all-question marathon.
                </p>
              </div>
              <Link
                href={body.practiceHref!}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-base transition-transform hover:scale-[1.03] active:scale-[0.98]"
                style={{ background: "var(--green)", fontFamily: "var(--font-inter), sans-serif", boxShadow: "0 4px 20px color-mix(in srgb, var(--green) 35%, transparent)" }}
              >
                <BookOpen className="w-5 h-5" /> Start practising free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl sm:text-2xl font-bold mb-1" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                Get early access to {body.short} practice
              </h2>
              <p className="text-sm mb-5" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
                We launch exam bodies in order of demand. Join the waitlist and we&apos;ll email you once — the day {launchLabel(body)} banks open.
              </p>
              <WaitlistForm
                bodyId={body.id}
                bodyShort={body.short}
                levels={body.levels.map((l) => l.name)}
                launchLabel={launchLabel(body)}
              />
            </>
          )}
        </div>

        {/* How the exams work (bodies that define it in regions.ts) */}
        {body.howItWorks && body.howItWorks.length > 0 && (
          <section id="how-the-exams-work" className="mb-14">
            <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              How the {body.short} exams work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {body.howItWorks.map((item) => (
                <div key={item.title} className="rounded-2xl p-5 sm:p-6" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                  <h3 className="font-bold text-base mb-2" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>{item.text}</p>
                </div>
              ))}
            </div>
            {body.officialLinks && body.officialLinks.length > 0 && (
              <p className="text-sm mt-4" style={{ color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>
                Rules and fees change, so check the official pages before you book:{" "}
                {body.officialLinks.map((l, i) => (
                  <span key={l.href}>
                    {i > 0 && " · "}
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--accent-ink)" }}>{l.label}</a>
                  </span>
                ))}
              </p>
            )}
          </section>
        )}

        {/* Study guides from the blog */}
        {guides.length > 0 && (
          <section id="guides" className="mb-14">
            <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              {body.short} study guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {guides.map((g) => (
                <Link key={g.slug} href={`/blog/${g.slug}`} className="rounded-2xl p-5 flex flex-col gap-1"
                  style={{ background: "var(--bg-2)", border: "1px solid var(--border)", textDecoration: "none" }}>
                  <span className="font-bold" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>{g.title}</span>
                  <span className="text-sm" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>{g.excerpt}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Levels & papers */}
        <section className="mb-14">
          <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            {body.short} levels and papers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {body.levels.map((lvl) => (
              <div key={lvl.name} className="rounded-2xl p-5 sm:p-6" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                <h3 className="font-bold text-base sm:text-lg mb-1" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                  {lvl.name}
                </h3>
                <p className="text-sm mb-4" style={{ color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>{lvl.mcqNote}</p>
                <ul className="flex flex-wrap gap-2">
                  {lvl.papers.map((p) => {
                    const bank = bankForPaper(p, liveSubjects);
                    const chip = { background: "var(--bg-3)", color: "var(--text-2)", border: "1px solid var(--border)", fontFamily: "var(--font-inter), sans-serif" };
                    return (
                      <li key={p} className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={bank ? { ...chip, color: "var(--accent-ink)", border: "1px solid color-mix(in srgb, var(--green) 35%, transparent)" } : chip}>
                        {bank ? <Link href={bankHref(bank)} style={{ color: "inherit", textDecoration: "none" }}>{p} →</Link> : p}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Contributors */}
        {!live && (
          <Link
            href="/contact"
            className="group mb-14 rounded-2xl p-5 sm:p-6 flex items-center justify-between gap-4 transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--bg-2)", border: "1px solid var(--border)", textDecoration: "none" }}
          >
            <div className="flex items-start gap-3">
              <HandCoins className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--gold)" }} />
              <div>
                <p className="font-bold" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                  Know the {body.short} syllabus? Contribute MCQs and get credited / paid
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
                  Teachers, tutors and recent passers — help us build the {body.short} bank faster.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: "var(--accent-ink)" }} />
          </Link>
        )}

        {/* FAQ */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            {body.short} practice FAQ
          </h2>
          <div className="flex flex-col gap-3">
            {faqs.map((f) => (
              <details key={f.q} className="rounded-2xl p-5" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                <summary className="font-bold cursor-pointer" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                  {f.q}
                </summary>
                <p className="text-sm mt-3 leading-relaxed" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
