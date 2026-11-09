/**
 * Region + exam-body registry.
 *
 * Single source of truth for:
 *  - which accountancy bodies we serve (or plan to serve),
 *  - which country maps to which default body (IP-based suggestion),
 *  - purchasing-power-parity (PPP) pricing for The CA Hub Pro.
 *
 * Adding a new body = add an entry to EXAM_BODIES, map countries to it,
 * add its subjects in src/data/subjects.ts and import questions with the
 * matching subject_id. Status "live" makes it routable; "waitlist" shows a
 * landing page that captures demand before content is produced.
 */

export type BodyStatus = "live" | "waitlist";

export interface ExamLevel {
  name: string;
  /** Short note on how MCQs/objective tests feature in this level. */
  mcqNote: string;
  papers: string[];
}

export interface ExamBody {
  id: string; // url slug, e.g. "icap", "acca"
  short: string; // "ICAP"
  name: string; // full name
  qualification: string; // "Chartered Accountancy (CA Pakistan)"
  flag: string; // emoji flag or globe
  region: string; // "Pakistan", "Global", ...
  status: BodyStatus;
  /** Where the practice hub for a live body lives. */
  practiceHref?: string;
  tagline: string;
  levels: ExamLevel[];
  seoKeywords: string[];
  /** Optional hub content for /exams/[body]: an "how the exams work" summary, checked against the body's own site. */
  howItWorks?: { title: string; text: string }[];
  /** Official pages the summary is based on; shown under it so students can check the current rules. */
  officialLinks?: { label: string; href: string }[];
  /** Blog slugs to feature on the hub. Slugs not found in src/data/blogs.ts are skipped. */
  guideSlugs?: string[];
  /** Extra body-specific FAQs, appended to the generic ones. */
  faqs?: { q: string; a: string }[];
}

export const EXAM_BODIES: ExamBody[] = [
  {
    id: "icap",
    short: "ICAP",
    name: "Institute of Chartered Accountants of Pakistan",
    qualification: "Chartered Accountancy (CA Pakistan)",
    flag: "🇵🇰",
    region: "Pakistan",
    status: "live",
    practiceHref: "/practice",
    tagline: "PRC & CAF MCQ banks, topical drills, mocks and a Big 4 induction CV maker.",
    levels: [
      {
        name: "PRC (Pre-Requisite Competency)",
        mcqNote: "Fully objective, computer-based papers.",
        papers: ["PRC-1 Fundamentals of Accounting", "PRC-2 Quantitative Analysis for Business", "PRC-3 Business & Economic Insights"],
      },
      {
        name: "CAF (Certificate in Accounting & Finance)",
        mcqNote: "Objective sections plus long-form questions.",
        papers: ["CAF-1 FAR", "CAF-2 Tax", "CAF-3 DSR", "CAF-4 Law", "CAF-5 MA", "CAF-6 CR", "CAF-7 BIA", "CAF-8 Audit"],
      },
    ],
    seoKeywords: ["ICAP MCQ", "PRC MCQs", "CAF MCQs", "CA Pakistan MCQ practice"],
  },
  {
    id: "icai",
    short: "ICAI",
    name: "Institute of Chartered Accountants of India",
    qualification: "Chartered Accountancy (CA India)",
    flag: "🇮🇳",
    region: "India",
    status: "live",
    practiceHref: "/exams/icai#practice",
    tagline: "CA Foundation Maths and Economics MCQs, plus the MCQ sections of five CA Inter papers.",
    levels: [
      {
        name: "CA Foundation",
        mcqNote: "Quantitative Aptitude and Business Economics are fully objective papers.",
        papers: ["Accounting", "Business Laws", "Quantitative Aptitude", "Business Economics"],
      },
      {
        name: "CA Intermediate",
        mcqNote: "Most papers carry a case-scenario MCQ section.",
        papers: ["Advanced Accounting", "Corporate Laws", "Taxation", "Cost & Management Accounting", "Auditing & Ethics", "FM & SM"],
      },
      {
        name: "CA Final",
        mcqNote: "Case-scenario MCQ sections in core papers.",
        papers: ["Financial Reporting", "AFM", "Advanced Auditing", "Direct Tax", "Indirect Tax", "IBS"],
      },
    ],
    seoKeywords: ["CA Foundation MCQ", "CA Inter MCQ", "ICAI MCQ practice", "CA Foundation mock test free"],
  },
  {
    id: "acca",
    short: "ACCA",
    name: "Association of Chartered Certified Accountants",
    qualification: "ACCA Qualification (global)",
    flag: "🌍",
    region: "Global",
    status: "live",
    practiceHref: "/exams/acca#practice",
    tagline: "BT, MA and FA on-demand CBE practice, plus the objective-test sections of LW, PM, FR, AA and FM.",
    levels: [
      {
        name: "Applied Knowledge",
        mcqNote: "On-demand, fully objective computer-based exams: 2 hours, 50% pass mark.",
        papers: ["BT Business and Technology", "MA Management Accounting", "FA Financial Accounting"],
      },
      {
        name: "Applied Skills",
        mcqNote: "Every paper has objective questions. LW is fully objective; they are 60 of 100 marks in PM, FR and FM, and 30 in AA.",
        papers: ["LW Corporate and Business Law", "PM Performance Management", "TX Taxation", "FR Financial Reporting", "AA Audit and Assurance", "FM Financial Management"],
      },
      {
        name: "Strategic Professional",
        mcqNote: "Written, scenario-based exams: two Essentials and two of the four Options.",
        papers: ["SBL Strategic Business Leader", "SBR Strategic Business Reporting", "AFM", "APM", "ATX", "AAA"],
      },
    ],
    seoKeywords: ["ACCA MCQ", "ACCA FA MCQ", "ACCA MA MCQ", "ACCA BT practice questions", "ACCA FR MCQ", "ACCA mock exam free"],
    howItWorks: [
      {
        title: "Applied Knowledge: on demand",
        text: "BT, MA and FA are 2-hour, fully objective computer-based exams with a 50% pass mark. You book them on demand: find a centre on ACCA's on-demand centre list, contact the centre and pay it directly (centres set their own fee). A provisional result appears on screen at the end; ACCA confirms it on myACCA, normally within 72 hours. Remote on-demand exams are only allowed in countries with no exam centre provision.",
      },
      {
        title: "Applied Skills: sessions",
        text: "LW is fully objective, and some LW variants can be sat on demand. PM, TX, FR, AA and FM are sat in the March, June, September and December sessions. PM, FR and FM are 3 hours: 30 marks of single objective questions, 30 marks of objective case questions and two 20-mark constructed response questions. AA is 3 hours with 30 marks of objective case questions and 70 marks of constructed response. The pass mark is 50% throughout.",
      },
      {
        title: "Strategic Professional",
        text: "Two Essentials (SBL and SBR) and two Options. Once you pass your first Strategic Professional exam, you have seven years to complete the rest; Applied Knowledge and Applied Skills passes do not expire.",
      },
      {
        title: "Order and limits",
        text: "Modules must be taken in order (Applied Knowledge, Applied Skills, Strategic Professional), but papers within a module can be taken in any order. You can sit up to four exams per session. Membership also needs the Ethics and Professional Skills module and 36 months of practical experience with nine performance objectives.",
      },
      {
        title: "Changes from 2027",
        text: "ACCA has announced a redesigned qualification with Foundations, Knowledge, Expertise and Strategic Professional levels. Knowledge exams start in July 2027 and Expertise and Strategic Professional exams in September 2027. Students part-way through receive credit for what they have passed; ACCA's Transition Tool shows how.",
      },
    ],
    officialLinks: [
      { label: "ACCA Qualification structure", href: "https://www.accaglobal.com/gb/en/student/getting-started/acca-qualification-structure.html" },
      { label: "Exam progression rules", href: "https://www.accaglobal.com/uk/en/student/exam-entry-and-administration/enter-an-exam/exam-progression-rules.html" },
      { label: "Find an on-demand exam centre", href: "https://www.accaglobal.com/uk/en/student/exam-entry-and-administration/about-our-exams/centre-exams/on-demand-centre-exams/cbe-centre-list.html" },
      { label: "Fees and charges (UK)", href: "https://www.accaglobal.com/gb/en/qualifications/accountancy-career/fees/fees-charges-uk.html" },
      { label: "The future ACCA Qualification", href: "https://www.accaglobal.com/gb/en/campaigns/accountancy-redefined/future-acca-qualification.html" },
    ],
    guideSlugs: [
      "acca-applied-knowledge-on-demand-cbe-guide",
      "acca-fr-consolidated-statement-of-financial-position",
      "acca-vs-aca-uk",
      "acca-bt-exam-format",
      "how-to-pass-acca-ma",
      "acca-ma-formulas-cheat-sheet",
      "acca-fa-exam-tips",
      "acca-lw-exam-tips",
      "how-to-pass-acca-pm",
      "acca-fr-exam-tips",
      "acca-fr-common-ot-question-traps",
      "acca-aa-objective-test-questions",
      "acca-applied-knowledge-pass-rates",
    ],
    faqs: [
      {
        q: "What is the ACCA pass mark?",
        a: "50% for every ACCA exam, including the on-demand Applied Knowledge exams BT, MA and FA.",
      },
      {
        q: "How do I book an ACCA on-demand exam in the UK?",
        a: "Find a centre on ACCA's on-demand centre list, contact the centre directly to arrange a date, and pay the centre. Centres set their own fees for these exams.",
      },
    ],
  },
  {
    id: "cima",
    short: "CIMA",
    name: "Chartered Institute of Management Accountants",
    qualification: "CIMA / CGMA",
    flag: "🌍",
    region: "Global",
    status: "live",
    practiceHref: "/exams/cima#practice",
    tagline: "Certificate in Business Accounting and objective-test (OT) exams at every level.",
    levels: [
      {
        name: "Certificate in Business Accounting",
        mcqNote: "BA1–BA4 are fully objective computer-based tests.",
        papers: ["BA1", "BA2", "BA3", "BA4"],
      },
      {
        name: "Operational / Management / Strategic OTs",
        mcqNote: "Objective tests at every level.",
        papers: ["E1", "P1", "F1", "E2", "P2", "F2", "E3", "P3", "F3"],
      },
    ],
    seoKeywords: ["CIMA OT practice", "CIMA BA1 MCQ", "CIMA objective test questions"],
  },
  {
    id: "icaew",
    short: "ICAEW",
    name: "Institute of Chartered Accountants in England and Wales",
    qualification: "ACA (UK)",
    flag: "🇬🇧",
    region: "United Kingdom",
    status: "live",
    practiceHref: "/exams/icaew#practice",
    tagline: "ACA Certificate Level practice for Accounting Fundamentals, Assurance and Risk Fundamentals, Business Insight and Performance, Business Law, and Sustainability and Ethics.",
    levels: [
      {
        name: "Certificate Level (Next Generation ACA)",
        mcqNote: "On-demand computer-based exams, 1.5 or 2 hours, 55% pass mark. Accounting Fundamentals, Business Insight and Performance and Tax Fundamentals also include longer or scenario questions.",
        papers: ["Accounting Fundamentals", "Assurance and Risk Fundamentals", "Business Law", "Business Insight and Performance", "Sustainability and Ethics", "Tax Fundamentals"],
      },
      {
        name: "Professional Level",
        mcqNote: "Scenario-based exams in March, June, September and December: 2.5 or 3 hours, 55% pass mark.",
        papers: ["Assurance, Risk and Reporting", "Corporate Reporting, Data and Assurance", "Business and Digital Strategy", "Tax Compliance and Planning", "Corporate Financial Strategy", "Fundamental Case Study"],
      },
      {
        name: "Advanced Level",
        mcqNote: "Two open-book case studies in July and November: 4 hours each, 50% pass mark.",
        papers: ["Technical Case Study", "Strategic Case Study"],
      },
    ],
    seoKeywords: ["ICAEW certificate level questions", "ACA MCQ practice", "ICAEW accounting fundamentals question bank", "ACA accounting fundamentals mock exam", "ICAEW business insight and performance"],
    howItWorks: [
      {
        title: "14 exams over three levels",
        text: "The Next Generation ACA, launched in September 2025, has six Certificate Level exams, six Professional Level exams and two Advanced Level case studies. You can take them in any order, except that the Advanced Level case studies come after everything else.",
      },
      {
        title: "Certificate Level: on demand",
        text: "Sit any time of year. Accounting Fundamentals, Business Insight and Performance and Tax Fundamentals are 2 hours; Assurance and Risk Fundamentals, Business Law and Sustainability and Ethics are 1.5 hours. The pass mark is 55%. ICAEW allows four attempts at each Certificate Level exam, and results are published online.",
      },
      {
        title: "Professional and Advanced Level",
        text: "Professional Level exams run in March, June, September and December, are 2.5 hours (3 hours for Assurance, Risk and Reporting and for Tax Compliance and Planning) and have a 55% pass mark. The Technical and Strategic Case Studies are 4-hour open-book exams in July and November with a 50% pass mark.",
      },
      {
        title: "Credit for prior learning",
        text: "A relevant degree or qualification can give credit for up to 12 exams at Certificate and Professional Level, never the Advanced Level. Check ICAEW's CPL directory before you book; you cannot claim credit for an exam you have already sat.",
      },
      {
        title: "Training",
        text: "To qualify you need a training agreement with an ICAEW Authorised Training Employer and at least 450 days of professional work experience, which ICAEW says normally takes three to five years. ICAEW CFAB is a standalone qualification made up of the six Certificate Level exams.",
      },
    ],
    officialLinks: [
      { label: "Next Generation ACA syllabus handbook", href: "https://www.icaew.com/-/media/corporate/files/learning-and-development/next-generation-aca/aca-syllabus-handbook.ashx" },
      { label: "ACA exam FAQs", href: "https://www.icaew.com/students/training/aca-training-faqs/exams-faqs" },
      { label: "Book an exam", href: "https://www.icaew.com/students/exams/book-an-exam" },
      { label: "Credit for prior learning directory", href: "https://apps.icaew.com/cpldirectory/" },
      { label: "ACA fees", href: "https://www.icaew.com/learning-and-development/aca/employers/train-the-aca/fees" },
    ],
    guideSlugs: [
      "icaew-certificate-level-exams-guide",
      "icaew-accounting-fundamentals-exam-guide",
      "icaew-business-insight-and-performance-guide",
      "icaew-aca-certificate-level-2025-changes",
      "acca-vs-aca-uk",
    ],
    faqs: [
      {
        q: "What is the ICAEW Certificate Level pass mark?",
        a: "55% for all six Certificate Level exams. Professional Level is also 55%; the two Advanced Level case studies are 50%.",
      },
      {
        q: "Is there an ICAEW Accounting Fundamentals question bank?",
        a: "Yes. Our free Accounting Fundamentals bank is organised by chapter, with an explanation for every answer. Use it alongside ICAEW's own exam resources for the module.",
      },
      {
        q: "Which module replaced Management Information?",
        a: "Business Insight and Performance, from September 2025. It keeps costing, budgeting, variances and decision making, and adds more on data, technology and the external environment.",
      },
    ],
  },
  {
    id: "cpa",
    short: "CPA",
    name: "Uniform CPA Examination (AICPA / NASBA)",
    qualification: "US CPA",
    flag: "🇺🇸",
    region: "United States",
    status: "waitlist",
    tagline: "MCQ drills for the core sections and the discipline sections.",
    levels: [
      {
        name: "Core",
        mcqNote: "Multiple-choice questions are half of each section's score.",
        papers: ["FAR", "AUD", "REG"],
      },
      {
        name: "Discipline",
        mcqNote: "Choose one: BAR, ISC or TCP.",
        papers: ["BAR", "ISC", "TCP"],
      },
    ],
    seoKeywords: ["CPA MCQ practice free", "FAR practice questions", "AUD MCQ", "REG practice questions"],
  },
  {
    id: "ima",
    short: "US CMA",
    name: "Institute of Management Accountants (IMA)",
    qualification: "Certified Management Accountant (US CMA)",
    flag: "🌍",
    region: "Global",
    status: "live",
    practiceHref: "/exams/ima#practice",
    tagline: "MCQ practice for both parts of the US CMA exam — popular across India, the Gulf and Pakistan.",
    levels: [
      {
        name: "Part 1 – Financial Planning, Performance and Analytics",
        mcqNote: "Multiple-choice questions make up 75% of the exam.",
        papers: ["External Financial Reporting", "Planning, Budgeting and Forecasting", "Performance Management", "Cost Management", "Internal Controls", "Technology and Analytics"],
      },
      {
        name: "Part 2 – Strategic Financial Management",
        mcqNote: "Multiple-choice questions make up 75% of the exam.",
        papers: ["Financial Statement Analysis", "Corporate Finance", "Decision Analysis", "Risk Management", "Investment Decisions", "Professional Ethics"],
      },
    ],
    seoKeywords: ["US CMA MCQ", "CMA Part 1 practice questions", "CMA Part 2 MCQ free", "US CMA mock test"],
  },
  {
    id: "icab",
    short: "ICAB",
    name: "Institute of Chartered Accountants of Bangladesh",
    qualification: "Chartered Accountancy (CA Bangladesh)",
    flag: "🇧🇩",
    region: "Bangladesh",
    status: "waitlist",
    tagline: "Certificate and Professional level practice.",
    levels: [
      {
        name: "Certificate Level",
        mcqNote: "Objective-style practice for knowledge papers.",
        papers: ["Accounting", "Assurance", "Business & Finance", "Law", "Management Information", "Principles of Taxation"],
      },
    ],
    seoKeywords: ["ICAB MCQ", "CA Bangladesh certificate level questions"],
  },
  {
    id: "casl",
    short: "CA Sri Lanka",
    name: "Institute of Chartered Accountants of Sri Lanka",
    qualification: "Chartered Accountancy (CA Sri Lanka)",
    flag: "🇱🇰",
    region: "Sri Lanka",
    status: "waitlist",
    tagline: "Business level objective-paper practice.",
    levels: [
      {
        name: "Business Level",
        mcqNote: "Computer-based objective papers.",
        papers: ["Business Economics", "Business Mathematics & Statistics", "Fundamentals of Financial Accounting", "Business Law"],
      },
    ],
    seoKeywords: ["CA Sri Lanka business level MCQ", "CASL MCQ practice"],
  },
  {
    id: "ican",
    short: "ICAN",
    name: "Institute of Chartered Accountants of Nigeria",
    qualification: "Chartered Accountancy (ICAN)",
    flag: "🇳🇬",
    region: "Nigeria",
    status: "waitlist",
    tagline: "Foundation level objective-question practice.",
    levels: [
      {
        name: "Foundation Level",
        mcqNote: "Papers include objective-question sections.",
        papers: ["Business, Management & Finance", "Financial Accounting", "Management Information", "Business Law"],
      },
    ],
    seoKeywords: ["ICAN foundation MCQ", "ICAN past questions practice"],
  },
];

export const LIVE_BODIES = EXAM_BODIES.filter((b) => b.status === "live");

export function getBody(id: string | undefined | null): ExamBody | undefined {
  if (!id) return undefined;
  return EXAM_BODIES.find((b) => b.id === id.toLowerCase());
}

/* ─────────────────────────── Country → body ─────────────────────────── */

const GULF = ["AE", "SA", "QA", "KW", "OM", "BH"];

/** ISO-3166 alpha-2 → default exam body id. Anything not listed → ACCA (global). */
export const COUNTRY_DEFAULT_BODY: Record<string, string> = {
  PK: "icap",
  IN: "icai",
  BD: "icab",
  LK: "casl",
  NG: "ican",
  GB: "icaew",
  IE: "acca",
  US: "cpa",
  ...Object.fromEntries(GULF.map((c) => [c, "acca"])),
};

export const DEFAULT_BODY_ID = "acca";

export function defaultBodyForCountry(country: string | undefined | null): string {
  if (!country) return DEFAULT_BODY_ID;
  return COUNTRY_DEFAULT_BODY[country.toUpperCase()] ?? DEFAULT_BODY_ID;
}

/* ─────────────────────────── PPP pricing ─────────────────────────── */

export type PlanId = "monthly" | "sitting";

export interface PriceBook {
  currency: string; // ISO 4217
  symbol: string;
  monthly: number;
  /**
 * One exam sitting: 4 months of Pro.
 * Card prices are charged by Paddle — mirror these numbers as country price
 * overrides on the two Paddle prices so checkout matches what we display.
 */
  sitting: number;
  /** Local rails (bank transfer / mobile wallets) available for manual activation. */
  localRails?: string[];
}

export const PRICE_BOOKS: Record<string, PriceBook> = {
  PKR: { currency: "PKR", symbol: "Rs ", monthly: 499, sitting: 1999, localRails: ["JazzCash", "Easypaisa", "Bank transfer"] },
  INR: { currency: "INR", symbol: "₹", monthly: 249, sitting: 999 },
  BDT: { currency: "BDT", symbol: "৳", monthly: 349, sitting: 1299, localRails: ["bKash"] },
  LKR: { currency: "LKR", symbol: "Rs ", monthly: 990, sitting: 3490 },
  NGN: { currency: "NGN", symbol: "₦", monthly: 3500, sitting: 12000 },
  AED: { currency: "AED", symbol: "AED ", monthly: 29, sitting: 99 },
  SAR: { currency: "SAR", symbol: "SAR ", monthly: 29, sitting: 99 },
  GBP: { currency: "GBP", symbol: "£", monthly: 7.99, sitting: 24 },
  USD: { currency: "USD", symbol: "$", monthly: 8.99, sitting: 29 },
};

const COUNTRY_CURRENCY: Record<string, string> = {
  PK: "PKR",
  IN: "INR",
  BD: "BDT",
  LK: "LKR",
  NG: "NGN",
  GB: "GBP",
  SA: "SAR",
  ...Object.fromEntries(GULF.filter((c) => c !== "SA").map((c) => [c, "AED"])),
};

export function priceBookForCountry(country: string | undefined | null): PriceBook {
  const cur = country ? COUNTRY_CURRENCY[country.toUpperCase()] : undefined;
  return PRICE_BOOKS[cur ?? "USD"];
}

export function formatPrice(book: PriceBook, amount: number): string {
  const n = Number.isInteger(amount) ? amount.toLocaleString("en-US") : amount.toFixed(2);
  return `${book.symbol}${n}`;
}

/* ─────────────────────────── Cookies ─────────────────────────── */

/** Set by src/proxy.ts from the edge geo header. */
export const COUNTRY_COOKIE = "cah_country";
/** Set when the visitor explicitly picks a body in the region switcher. */
export const BODY_COOKIE = "cah_body";
