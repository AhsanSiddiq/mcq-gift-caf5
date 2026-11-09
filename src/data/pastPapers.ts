/**
 * Past Papers hub: data model, registry and analysis helpers.
 *
 * COPYRIGHT: exam papers, suggested answers and examiners' reports belong to the
 * awarding bodies. This module stores ONLY factual metadata (sitting, question
 * number, topic, marks, official URLs, published pass rates) plus our own
 * one-line descriptions, analysis and ORIGINAL practice material. Never paste
 * question text, figures, scenarios or answers from an official paper here.
 *
 * Every body (ICAP, ICAI, ACCA, ICAEW) uses the same shape:
 *   body -> paper -> sitting -> question -> walkthrough
 * so routes /past-papers/[paper]/[sitting]/[q] work for all of them.
 */
import { icapCaf1 } from "./past-papers/icap-caf-1";
import { icapCaf5 } from "./past-papers/icap-caf-5";
import { icapCaf6 } from "./past-papers/icap-caf-6";
import { icapPrcPapers } from "./past-papers/icap-prc";
import { icaiInterCma } from "./past-papers/icai-inter-cma";

export const PAST_PAPERS_UPDATED = "2026-11-09";
export const PAST_PAPERS_BASE = "/past-papers";

export type BodyId = "icap" | "icai" | "acca" | "icaew";

export interface ExamBody {
  id: BodyId;
  name: string;
  short: string;
  country: string;
  /** Official landing page for past papers */
  officialUrl: string;
  /** Line shown on every page: "Official papers and answers © …" */
  owner: string;
  /** Qualification levels in display order, e.g. ["PRC", "CAF"] */
  levels: { id: string; label: string; blurb: string }[];
}

/** A syllabus area / topic used to build the topical index. */
export interface Area {
  id: string;
  label: string;
  /** Syllabus grid section the area sits in (e.g. "A") */
  grid?: string;
  /** Relative URL of our matching MCQ chapter, e.g. /caf/caf-1/mcqs/chapter-2-… */
  mcq?: string;
  /** Slug of our /standards page, if one exists */
  standard?: string;
}

export interface GridSection {
  id: string;
  label: string;
  /** Syllabus weighting range in % */
  min: number;
  max: number;
}

/** Marks a question (or MCQ item) gives to one area. */
export interface QPart {
  area: string;
  marks: number;
  /** e.g. "(iii)" for an MCQ item or "(a)" for a sub-requirement */
  label?: string;
}

export interface Table {
  head: string[];
  rows: string[][];
  caption?: string;
}

export interface SolutionStep {
  text?: string;
  table?: Table;
}

/** An ORIGINAL exam-style question with our own numbers and wording. */
export interface WorkedExample {
  title: string;
  scenario: string[];
  required: string;
  solution: SolutionStep[];
  answer: string;
}

export interface Walkthrough {
  /** Step-by-step approach, in our own words */
  approach: string[];
  /** Key rules / standard paragraphs to apply, paraphrased */
  rules: string[];
  /** Optional answer layout / proforma */
  layout?: Table;
  /** Common mistakes: from examiners' reports (summarised) and our own experience */
  mistakes: string[];
  example: WorkedExample;
}

export type QFormat = "MCQ" | "Numerical" | "Written" | "Mixed";

export interface Question {
  n: number;
  format: QFormat;
  /** Our own one-line factual description. Never the question text. */
  summary: string;
  /** Marks by area; sums to the question's total marks */
  parts: QPart[];
  /** Areas touched but not separately marked */
  alsoTests?: string[];
  /** PDF page where the question starts (for #page= deep links) */
  page?: number;
  /** PDF page of the examiners' report covering this question */
  commentsPage?: number;
  /** PDF page of the official answer covering this question */
  answerPage?: number;
  /** True when candidates choose between this and other questions */
  optional?: boolean;
  /** Display label override, e.g. "Part I (MCQs)". n = 0 is used for a body's MCQ part. */
  label?: string;
  /** Question pass rate published in the examiners' report (%) */
  passRate?: number;
  walkthrough?: Walkthrough;
}

export interface Sitting {
  slug: string;
  name: string;
  /** ISO date of the exam (used for ordering) */
  date: string;
  /** Shown instead of the exact date when only the month is known, e.g. "May 2026" */
  dateLabel?: string;
  /** Choice rules, e.g. "Q1 compulsory; answer any four of Q2–Q6" */
  rules?: string;
  paperUrl: string;
  /** Public URL of suggested answers, or the portal page where they sit */
  answersUrl?: string;
  /** e.g. "ICAP student login required" */
  answersNote?: string;
  commentsUrl?: string;
  /** Overall pass rate from the examiners' report (%) */
  passRate?: number;
  /** Main themes of the examiners' report, summarised in our own words */
  themes?: string[];
  questions: Question[];
}

export interface Resource {
  label: string;
  url: string;
  note?: string;
}

export interface Paper {
  slug: string;
  body: BodyId;
  level: string;
  code: string;
  title: string;
  scheme?: string;
  /** Official past-papers page for this paper */
  officialUrl: string;
  syllabusUrl?: string;
  /** Exam format line, e.g. "Written, 3 hours 15 minutes, 100 marks" */
  format: string;
  overview: string[];
  /** Our MCQ bank for this paper */
  mcqHub?: string;
  grid?: GridSection[];
  areas: Area[];
  sittings: Sitting[];
  /** Facts worth flagging (syllabus changes, access limits) */
  notes?: string[];
  resources?: Resource[];
  keywords?: string[];
}

export const BODIES: Record<BodyId, ExamBody> = {
  icap: {
    id: "icap",
    name: "Institute of Chartered Accountants of Pakistan",
    short: "ICAP",
    country: "Pakistan",
    officialUrl: "https://icap.org.pk/past-papers/",
    owner: "The Institute of Chartered Accountants of Pakistan (ICAP)",
    levels: [
      { id: "CAF", label: "CAF – Certificate in Accounting and Finance", blurb: "Written papers under the 2025 Education Scheme. Each paper below has a topical index, sitting-by-sitting analysis and question walkthroughs." },
      { id: "PRC", label: "PRC – Pre-Requisite Competencies", blurb: "Computer-based MCQ papers. ICAP's model papers run inside its exam software behind the student login, so we link the official access guide and syllabus weightings." },
    ],
  },
  icai: {
    id: "icai",
    name: "Institute of Chartered Accountants of India",
    short: "ICAI",
    country: "India",
    officialUrl: "https://www.icai.org/post/question-papers-intermediate-course",
    owner: "The Institute of Chartered Accountants of India (ICAI)",
    levels: [
      { id: "CA-INTER", label: "CA Intermediate", blurb: "ICAI publishes question papers, suggested answers and (for some sittings) examiners' comments as public PDFs. RTPs and MTPs are on the BoS Knowledge Portal." },
    ],
  },
  acca: {
    id: "acca",
    name: "Association of Chartered Certified Accountants",
    short: "ACCA",
    country: "Global",
    officialUrl: "https://www.accaglobal.com/",
    owner: "The Association of Chartered Certified Accountants (ACCA)",
    levels: [],
  },
  icaew: {
    id: "icaew",
    name: "Institute of Chartered Accountants in England and Wales",
    short: "ICAEW",
    country: "UK",
    officialUrl: "https://www.icaew.com/",
    owner: "The Institute of Chartered Accountants in England and Wales (ICAEW)",
    levels: [],
  },
};

/** Display order of bodies on the hub. Only bodies with papers are shown. */
export const BODY_ORDER: BodyId[] = ["icap", "icai", "acca", "icaew"];

export const papers: Paper[] = [icapCaf1, icapCaf5, icapCaf6, ...icapPrcPapers, icaiInterCma];

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */

export const getPaper = (slug: string) => papers.find((p) => p.slug === slug);
export const getSitting = (p: Paper, slug: string) => p.sittings.find((s) => s.slug === slug);
export const qSlug = (q: Question) => (q.n === 0 ? "part-1-mcqs" : `q${q.n}`);
export const qLabel = (q: Question) => q.label ?? (q.n === 0 ? "Part I (MCQs)" : `Q${q.n}`);
export const getQuestion = (s: Sitting, slug: string) => s.questions.find((q) => qSlug(q) === slug);
export const papersForBody = (body: BodyId) => papers.filter((p) => p.body === body);
export const questionMarks = (q: Question) => q.parts.reduce((t, p) => t + p.marks, 0);
export const sittingMarks = (s: Sitting) => s.questions.reduce((t, q) => t + questionMarks(q), 0);
export const getArea = (p: Paper, id: string) => p.areas.find((a) => a.id === id);
export const areaLabel = (p: Paper, id: string) => getArea(p, id)?.label ?? id;

/** Main area of a question = the area carrying most of its marks. */
export function primaryArea(q: Question): string {
  const m = new Map<string, number>();
  for (const part of q.parts) m.set(part.area, (m.get(part.area) ?? 0) + part.marks);
  return [...m.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

/** Sittings oldest → newest (for matrices and trends). */
export const chronological = (p: Paper) => [...p.sittings].sort((a, b) => a.date.localeCompare(b.date));
/** Sittings newest → oldest (for lists). */
export const newestFirst = (p: Paper) => [...p.sittings].sort((a, b) => b.date.localeCompare(a.date));

export const paperUrl = (p: Paper) => `${PAST_PAPERS_BASE}/${p.slug}`;
export const sittingUrl = (p: Paper, s: Sitting) => `${paperUrl(p)}/${s.slug}`;
export const questionUrl = (p: Paper, s: Sitting, q: Question) => `${sittingUrl(p, s)}/${qSlug(q)}`;
export const withPage = (url: string, page?: number) => (page ? `${url}#page=${page}` : url);

/* ------------------------------------------------------------------ */
/* Analysis                                                            */
/* ------------------------------------------------------------------ */

/** Marks per area in one sitting. */
export function areaMarks(s: Sitting): Map<string, number> {
  const m = new Map<string, number>();
  for (const q of s.questions) for (const part of q.parts) m.set(part.area, (m.get(part.area) ?? 0) + part.marks);
  return m;
}

export interface MatrixRow {
  area: Area;
  /** marks per sitting, chronological order */
  marks: number[];
  total: number;
  appearances: number;
  average: number;
}

/** Topic × sitting matrix, most-examined first (total marks, then appearances). */
export function topicMatrix(p: Paper): MatrixRow[] {
  const sittings = chronological(p);
  const maps = sittings.map(areaMarks);
  return p.areas
    .map((area) => {
      const marks = maps.map((m) => m.get(area.id) ?? 0);
      const total = marks.reduce((a, b) => a + b, 0);
      const appearances = marks.filter((x) => x > 0).length;
      return { area, marks, total, appearances, average: sittings.length ? total / sittings.length : 0 };
    })
    .sort((a, b) => b.total - a.total || b.appearances - a.appearances || a.area.label.localeCompare(b.area.label));
}

export interface Trend {
  every: MatrixRow[];
  rotating: MatrixRow[];
  absent: MatrixRow[];
  /** areas that appeared before but not in the latest sitting */
  notLatest: MatrixRow[];
}

export function trends(p: Paper): Trend {
  const rows = topicMatrix(p);
  const n = p.sittings.length;
  const latestIdx = n - 1;
  return {
    every: rows.filter((r) => n > 0 && r.appearances === n),
    rotating: rows.filter((r) => r.appearances > 0 && r.appearances < n),
    absent: rows.filter((r) => r.appearances === 0),
    notLatest: rows.filter((r) => r.appearances > 0 && r.marks[latestIdx] === 0),
  };
}

/** Marks per syllabus grid section for one sitting. */
export function gridMarks(p: Paper, s: Sitting): Map<string, number> {
  const m = new Map<string, number>();
  for (const [areaId, marks] of areaMarks(s)) {
    const g = getArea(p, areaId)?.grid;
    if (g) m.set(g, (m.get(g) ?? 0) + marks);
  }
  return m;
}

export interface Shift {
  area: Area;
  marks: number;
  average: number;
  diff: number;
}

/** Areas heavier / lighter in a sitting than the paper's average across indexed sittings. */
export function sittingShifts(p: Paper, s: Sitting, threshold = 5): { heavier: Shift[]; lighter: Shift[] } {
  if (p.sittings.length < 2) return { heavier: [], lighter: [] };
  const rows = topicMatrix(p);
  const idx = chronological(p).findIndex((x) => x.slug === s.slug);
  const shifts = rows.map((r) => ({ area: r.area, marks: r.marks[idx], average: r.average, diff: r.marks[idx] - r.average }));
  return {
    heavier: shifts.filter((x) => x.diff >= threshold).sort((a, b) => b.diff - a.diff),
    lighter: shifts.filter((x) => x.diff <= -threshold).sort((a, b) => a.diff - b.diff),
  };
}

/** Up to n questions with walkthroughs on the most-examined areas (one per area). */
export function practicePicks(p: Paper, n = 3): { sitting: Sitting; question: Question }[] {
  const picks: { sitting: Sitting; question: Question }[] = [];
  const sittings = newestFirst(p);
  for (const row of topicMatrix(p)) {
    if (picks.length >= n) break;
    for (const s of sittings) {
      const q = s.questions.find((x) => x.walkthrough && x.format !== "MCQ" && primaryArea(x) === row.area.id);
      if (q) {
        picks.push({ sitting: s, question: q });
        break;
      }
    }
  }
  return picks;
}

export const sittingDate = (s: Sitting) => s.dateLabel ?? fmtDate(s.date);

export const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export const fmtMarks = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
