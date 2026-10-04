import type { Metadata } from "next";
import InterviewPrep from "./InterviewPrep";
import CareerNav from "../CareerNav";
import FaqSection, { type Faq } from "../FaqSection";
import { QUESTIONS } from "@/data/interviewQuestions";

const URL = "https://www.thecahub.com/cv-maker/interview-prep";

export const metadata: Metadata = {
  title: "Articleship & Big 4 Interview Questions (with Model Answers)",
  description: `${QUESTIONS.length} common articleship, audit trainee and Big 4 induction interview questions with approaches and model-answer outlines — competency, technical IFRS & audit, firm knowledge and situational. Free practice mode.`,
  keywords: [
    "articleship interview questions",
    "Big 4 interview questions",
    "audit trainee interview questions",
    "ICAP training interview",
    "CA articleship interview questions India",
    "ACCA trainee interview questions",
    "audit interview questions and answers",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Articleship & Big 4 Interview Prep | The CA Hub",
    description: `${QUESTIONS.length} audit trainee interview questions with model-answer outlines and a random practice mode.`,
    url: URL,
    images: [{ url: "/CAHub.png", width: 1200, height: 630, alt: "Articleship & Big 4 Interview Prep – The CA Hub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Articleship & Big 4 Interview Prep | The CA Hub",
    description: `${QUESTIONS.length} audit trainee interview questions with model-answer outlines.`,
    images: ["/CAHub.png"],
  },
};

const FAQ_IDS = ["tell-me-about-yourself", "why-this-firm", "audit-purpose", "materiality", "weakness", "asked-to-skip"];
const FAQS: Faq[] = [
  { q: "What questions are asked in an articleship or Big 4 induction interview?", a: "Expect four kinds: competency questions about you (teamwork, pressure, mistakes), basic technical questions on accounting and audit (materiality, assertions, going concern, double entry), firm knowledge (why audit, why this firm) and situational judgement questions about ethics and dealing with clients and seniors." },
  ...FAQ_IDS.map(id => {
    const item = QUESTIONS.find(q => q.id === id)!;
    return { q: `How should I answer "${item.q}"`, a: `${item.approach} ${item.outline.join(" ")}` };
  }),
  { q: "How should I prepare in the week before the interview?", a: "Research the firm (service lines, sectors, recent news), prepare three or four STAR stories you can adapt, revise core audit and IFRS basics from your current syllabus, and practise answering out loud — the practice mode on this page times you." },
];

export default function InterviewPrepPage() {
  return (
    <>
      <div className="px-4 sm:px-6 pt-24 sm:pt-[110px] pb-6" style={{ background: "var(--bg)" }}>
        <div className="max-w-4xl mx-auto">
          <CareerNav active="interview" />
          <h1 className="font-display font-bold mb-3 leading-[1.1] tracking-tight" style={{ fontSize: "clamp(1.9rem,6vw,3.2rem)", color: "var(--text-1)" }}>
            Articleship &amp; Big 4 <span style={{ color: "var(--green)" }}>interview prep</span>
          </h1>
          <p className="text-sm sm:text-base max-w-2xl" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.65 }}>
            {QUESTIONS.length} questions audit firms really ask trainees — with what the interviewer is testing and a model-answer outline for each. Use them as structures, not scripts: your own examples always win. Then switch on practice mode for one random question at a time.
          </p>
        </div>
      </div>
      <InterviewPrep />
      <FaqSection faqs={FAQS} title="Interview prep FAQs" />
    </>
  );
}
