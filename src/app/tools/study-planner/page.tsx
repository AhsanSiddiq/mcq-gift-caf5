import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, Sparkles } from "lucide-react";
import { allSubjects, LEVEL_LABEL, subjectBody, subjectCode } from "@/data/subjects";
import { getChaptersCached } from "@/lib/questionBank";
import PlannerLoader from "./PlannerLoader";
import { PLANNER_URL, type CatalogSubject } from "./catalog";

export const revalidate = 86400;

const TITLE = "Free Smart Study Planner for ICAP, ACCA, CA, CIMA, ICAEW & CMA Exams";
const DESCRIPTION =
  "Build a day-by-day study plan to your exam in 30 seconds: chapters weighted by the syllabus, spaced revision, mock days and a live countdown. Free for ICAP, ACCA, ICAI, CIMA, ICAEW and US CMA.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "study planner",
    "exam study plan",
    "ACCA study plan",
    "ICAP CAF study plan",
    "CA Foundation study plan",
    "CA Inter study timetable",
    "CIMA study plan",
    "ICAEW study plan",
    "US CMA study plan",
    "revision timetable generator",
    "exam countdown",
  ],
  alternates: { canonical: PLANNER_URL },
  openGraph: {
    title: "Smart Study Planner: your exam, planned day by day",
    description: DESCRIPTION,
    url: PLANNER_URL,
    type: "website",
    images: [{ url: "/CAHub.png", width: 1200, height: 630, alt: "Smart Study Planner by The CA Hub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Study Planner: your exam, planned day by day",
    description: DESCRIPTION,
    images: ["/CAHub.png"],
  },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is the study planner really free?",
    a: "Yes. The planner, the calendar export and every linked MCQ practice set are free. There is no sign-up: your plan is saved in your own browser, so it is there when you come back on the same device.",
  },
  {
    q: "How does the planner decide how long to spend on each chapter?",
    a: "Each chapter's share of your study time follows its share of the question bank, which tracks how heavily the syllabus tests it. Chapters you rate as weak get up to 60% more time and chapters you rate as strong get less, so your hours go where the marks are.",
  },
  {
    q: "What is spaced revision and why is it built in?",
    a: "Spaced revision means revisiting a topic a day, four days and eleven days after you first study it. Each short review interrupts forgetting, so far more survives to exam day than if you studied the chapter once. The planner schedules these reviews ahead of new material on the day they fall due.",
  },
  {
    q: "Why are the last days only mocks and revision?",
    a: "Roughly the final 15% of your study days is kept free of new content. Timed mocks build exam stamina and time management, and the revision blocks target your heaviest and weakest chapters. The day before the exam is deliberately light.",
  },
  {
    q: "Can I plan more than one paper at once?",
    a: "Yes. Pick several papers and the planner interleaves them so each one moves forward at the same pace, then rotates the mock exams between them in the final stretch.",
  },
  {
    q: "Can I put the plan in Google Calendar or print it?",
    a: "Yes. 'Add to calendar' downloads an .ics file that Google Calendar, Apple Calendar and Outlook can import, with one entry per study day and practice links inside. 'Print / PDF' gives a clean printable timetable you can save as a PDF.",
  },
  {
    q: "What if I fall behind?",
    a: "Unticked tasks from the past week appear under 'Catch up' in the Today view. If you have fallen far behind, edit your inputs (for example, add an hour a day) and rebuild: your plan is regenerated from today.",
  },
];

async function loadCatalog(): Promise<CatalogSubject[]> {
  const live = allSubjects.filter((s) => s.isAvailable);
  const lists = await Promise.all(live.map((s) => getChaptersCached(s.id).catch(() => [])));
  return live.map((s, i) => ({
    id: s.id,
    code: subjectCode(s),
    title: s.title,
    level: s.level,
    levelLabel: LEVEL_LABEL[s.level],
    body: subjectBody(s),
    chapters: lists[i].map((c) => ({ chapter: c.chapter, topic: c.topic, count: c.count, slug: c.slug })),
  }));
}

const h2Style = { color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" } as const;

export default async function StudyPlannerPage() {
  const catalog = await loadCatalog();

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const appLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Smart Study Planner",
    url: PLANNER_URL,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: DESCRIPTION,
    publisher: { "@type": "Organization", name: "The CA Hub", url: "https://www.thecahub.com" },
  };

  return (
    <div className="sp-page min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-16">
        <div className="sp-noprint mb-6 sm:mb-8">
          <p
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}
          >
            <Sparkles className="w-3.5 h-3.5" /> Free tool
          </p>
          <h1
            className="font-bold mb-3"
            style={{ fontSize: "clamp(1.9rem,5vw,3rem)", color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif", lineHeight: 1.08, letterSpacing: "-0.02em" }}
          >
            Smart Study Planner
          </h1>
          <p className="max-w-2xl" style={{ color: "var(--text-2)", fontSize: 16, lineHeight: 1.6 }}>
            Your exam, planned day by day. Pick your papers and exam date and get a plan that weights every chapter, schedules
            spaced revision and saves the last stretch for mocks.
          </p>
        </div>

        <PlannerLoader catalog={catalog} />

        {/* SEO explainer */}
        <article className="sp-noprint mt-20 max-w-3xl" style={{ color: "var(--text-2)", lineHeight: 1.75, fontSize: 16 }}>
          <h2 className="font-bold mb-4" style={{ ...h2Style, fontSize: "clamp(1.4rem,3.4vw,1.9rem)", lineHeight: 1.2 }}>
            How to build a study plan for ICAP, ACCA, ICAI, CIMA, ICAEW and US CMA exams
          </h2>
          <p className="mb-4">
            Professional accountancy exams reward coverage and recall under time pressure. Whether you are sitting ICAP PRC or CAF, an
            ACCA Applied Knowledge or Applied Skills paper, ICAI CA Foundation or Intermediate, the CIMA Certificate, the ICAEW ACA
            Certificate Level or US CMA Part 1 or 2, the students who pass are rarely the ones who studied the longest. They are the
            ones who planned their hours around the syllabus and left time to practise. A good study plan answers three questions: how
            much time you really have, where the marks are, and when you will revise.
          </p>
          <h3 className="font-bold mt-8 mb-2" style={{ ...h2Style, fontSize: 19 }}>1. Count your real study hours</h3>
          <p className="mb-4">
            Start from the exam date and work backwards. Be honest about weekdays: after work, university or articleship, two focused
            hours beats an imagined five. Weekends can usually carry more. Mark the days you know you will not study (family events,
            a weekly day off) so that the plan does not quietly assume them. The planner above multiplies these numbers out for you, so
            you can see the total hours available before you commit to a date.
          </p>
          <h3 className="font-bold mt-8 mb-2" style={{ ...h2Style, fontSize: 19 }}>2. Weight chapters by the marks, not the page count</h3>
          <p className="mb-4">
            Not every chapter is equal. In ACCA Financial Reporting, consolidations and IFRS standards carry far more marks than the
            conceptual framework; in CAF and CA Inter costing papers, a handful of techniques appear in almost every sitting. We use the
            number of questions in our bank for each chapter as a proxy for how heavily it is examined, then adjust for your confidence:
            weak chapters earn extra time and strong ones less. That is the single biggest change most students can make to a plan.
          </p>
          <h3 className="font-bold mt-8 mb-2" style={{ ...h2Style, fontSize: 19 }}>3. Schedule revision before you need it</h3>
          <p className="mb-4">
            Memory fades fast. Revisiting a topic one day, four days and about eleven days after you first learn it (spaced repetition)
            keeps it alive with very little extra time. Book those short reviews into the plan from the start, ahead of new material,
            rather than hoping to &quot;go back over everything&quot; at the end. If you are studying two papers together, interleave
            them so both move forward each week instead of finishing one and forgetting it while you start the next.
          </p>
          <h3 className="font-bold mt-8 mb-2" style={{ ...h2Style, fontSize: 19 }}>4. Protect the final 15% for mocks</h3>
          <p className="mb-4">
            The last two weeks of a ten-week plan should contain no new content. Use them for full timed mocks (in exam conditions,
            ideally the same CBE format as the real exam) and targeted revision of the chapters that cost you marks. Keep the day before
            the exam light: a short review, an early night and no new topics.
          </p>
          <h3 className="font-bold mt-8 mb-2" style={{ ...h2Style, fontSize: 19 }}>5. Practise questions every single day</h3>
          <p className="mb-4">
            Reading is not studying. Every block in your plan links to free chapter-wise MCQs on The CA Hub, so you finish each session
            by testing yourself. Tick the task off, watch your progress bar move, and if you miss a day, clear the catch-up list before
            you start anything new. Then share the planner with your study group on WhatsApp: plans are easier to keep when your
            friends are following one too.
          </p>
          <p>
            Looking for questions to go with your plan? Browse the{" "}
            <Link href="/practice" style={{ color: "var(--green)" }}>
              free MCQ practice library
            </Link>{" "}
            or try today&apos;s{" "}
            <Link href="/daily" style={{ color: "var(--green)" }}>
              daily challenge
            </Link>
            .
          </p>
        </article>

        {/* FAQ */}
        <section className="sp-noprint mt-16 max-w-3xl">
          <h2 className="font-bold mb-5 inline-flex items-center gap-2" style={{ ...h2Style, fontSize: "clamp(1.3rem,3vw,1.7rem)" }}>
            <CalendarCheck className="w-6 h-6" style={{ color: "var(--green)" }} /> Study planner FAQ
          </h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((f) => (
              <details key={f.q} className="sp-faq rounded-2xl px-5 py-4" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                <summary className="cursor-pointer font-semibold" style={{ color: "var(--text-1)", listStyle: "none" }}>
                  {f.q}
                </summary>
                <p className="mt-3 text-[15px]" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
