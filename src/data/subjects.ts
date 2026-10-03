export type Level = "PRC" | "CAF" | "ACCA" | "CA-FOUNDATION";
export type BodyId = "icap" | "acca" | "icai";

export interface Subject {
  id: string; // e.g., 'prc-1', 'caf-5', 'acca-fa'
  title: string;
  /** URL segment is level.toLowerCase(), e.g. /acca/acca-fa */
  level: Level;
  description: string;
  isAvailable: boolean;
  /** Defaults to "icap" */
  body?: BodyId;
  /** Display code; defaults to id.toUpperCase() */
  code?: string;
}

/** Human labels for a level, used in headings and metadata. */
export const LEVEL_LABEL: Record<Level, string> = {
  PRC: "ICAP PRC",
  CAF: "ICAP CAF",
  ACCA: "ACCA Applied Knowledge",
  "CA-FOUNDATION": "ICAI CA Foundation",
};

export const subjectCode = (s: Pick<Subject, "id" | "code">) => s.code ?? s.id.toUpperCase();
export const subjectBody = (s: Pick<Subject, "body">): BodyId => s.body ?? "icap";

export const prcSubjects: Subject[] = [
  {
    id: "prc-1",
    title: "Fundamentals of Accounting",
    level: "PRC",
    description: "Essential accounting principles, theory, and practice questions.",
    isAvailable: true,
  },
  {
    id: "prc-2",
    title: "Quantitative Analysis for Business",
    level: "PRC",
    description: "Key business mathematics and analytical problem-solving concepts.",
    isAvailable: true,
  },
  {
    id: "prc-3",
    title: "Business & Economic Insights",
    level: "PRC",
    description: "Combined concepts from economics and introduction to business.",
    isAvailable: true,
  },
];

export const cafSubjects: Subject[] = [
  {
    id: "caf-1",
    title: "Financial Accounting and Reporting",
    level: "CAF",
    description: "Build strong, advanced accounting fundamentals.",
    isAvailable: true,
  },
  {
    id: "caf-2",
    title: "Taxation Principles and Compliance",
    level: "CAF",
    description: "Master income tax and sales tax compliance.",
    isAvailable: true,
  },
  {
    id: "caf-3",
    title: "Data, Systems and Risks",
    level: "CAF",
    description: "Information technology, digital reporting, and risk management.",
    isAvailable: true,
  },
  {
    id: "caf-4",
    title: "Business Law Dynamics",
    level: "CAF",
    description: "Mercantile and Company Law combined.",
    isAvailable: true,
  },
  {
    id: "caf-5",
    title: "Management Accounting",
    level: "CAF",
    description: "Costing, budgeting, and actionable performance management.",
    isAvailable: true, // Currently available
  },
  {
    id: "caf-6",
    title: "Corporate Reporting",
    level: "CAF",
    description: "Advanced corporate financial reporting standards.",
    isAvailable: true,
  },
  {
    id: "caf-7",
    title: "Business Insights and Analysis",
    level: "CAF",
    description: "Financial analysis and deep decision-making.",
    isAvailable: true,
  },
  {
    id: "caf-8",
    title: "Audit and Assurance Essentials",
    level: "CAF",
    description: "Auditing standards and professional assurance engagements.",
    isAvailable: true,
  },
];

export const accaSubjects: Subject[] = [
  {
    id: "acca-bt",
    code: "ACCA BT",
    title: "Business and Technology",
    level: "ACCA",
    body: "acca",
    description: "Organisations, governance, leadership, technology and ethics — the full BT syllabus as objective questions.",
    isAvailable: true,
  },
  {
    id: "acca-ma",
    code: "ACCA MA",
    title: "Management Accounting",
    level: "ACCA",
    body: "acca",
    description: "Costing, budgeting, variances and performance measurement with fully worked answers.",
    isAvailable: false,
  },
  {
    id: "acca-fa",
    code: "ACCA FA",
    title: "Financial Accounting",
    level: "ACCA",
    body: "acca",
    description: "Double entry to consolidations and cash flows — IFRS-based practice for the FA CBE.",
    isAvailable: false,
  },
];

export const caFoundationSubjects: Subject[] = [
  {
    id: "ca-foundation-qa",
    code: "CA Foundation P3",
    title: "Quantitative Aptitude",
    level: "CA-FOUNDATION",
    body: "icai",
    description: "Business mathematics, logical reasoning and statistics — every step worked.",
    isAvailable: true,
  },
  {
    id: "ca-foundation-be",
    code: "CA Foundation P4",
    title: "Business Economics",
    level: "CA-FOUNDATION",
    body: "icai",
    description: "Demand, supply, markets, national income and the Indian economy — concept-first MCQs.",
    isAvailable: true,
  },
];

export const icapSubjects = [...prcSubjects, ...cafSubjects];
export const allSubjects = [...prcSubjects, ...cafSubjects, ...accaSubjects, ...caFoundationSubjects];
