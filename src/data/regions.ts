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
    status: "waitlist",
    tagline: "CA Foundation objective papers and Intermediate/Final MCQ sections.",
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
    tagline: "Applied Knowledge on-demand CBEs and Section A objective tests for Applied Skills.",
    levels: [
      {
        name: "Applied Knowledge",
        mcqNote: "On-demand, fully objective computer-based exams.",
        papers: ["BT Business & Technology", "MA Management Accounting", "FA Financial Accounting"],
      },
      {
        name: "Applied Skills",
        mcqNote: "Section A objective test questions in every paper.",
        papers: ["LW Corporate & Business Law", "PM", "TX", "FR", "AA", "FM"],
      },
    ],
    seoKeywords: ["ACCA MCQ", "ACCA FA MCQ", "ACCA MA MCQ", "ACCA BT practice questions", "ACCA mock exam free"],
  },
  {
    id: "cima",
    short: "CIMA",
    name: "Chartered Institute of Management Accountants",
    qualification: "CIMA / CGMA",
    flag: "🌍",
    region: "Global",
    status: "waitlist",
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
    status: "waitlist",
    tagline: "ACA Certificate Level objective-test modules.",
    levels: [
      {
        name: "Certificate Level",
        mcqNote: "Computer-based objective-test modules.",
        papers: ["Accounting", "Assurance", "Business, Technology & Finance", "Law", "Management Information", "Principles of Taxation"],
      },
    ],
    seoKeywords: ["ICAEW certificate level questions", "ACA MCQ practice", "ICAEW accounting practice questions"],
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
