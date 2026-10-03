export type Level = "PRC" | "CAF" | "ACCA" | "CA-FOUNDATION" | "CIMA" | "ICAEW";
export type BodyId = "icap" | "acca" | "icai" | "cima" | "icaew";

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
  ACCA: "ACCA",
  "CA-FOUNDATION": "ICAI CA Foundation",
  CIMA: "CIMA Certificate in Business Accounting",
  ICAEW: "ICAEW ACA Certificate Level",
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
    isAvailable: true,
  },
  {
    id: "acca-fa",
    code: "ACCA FA",
    title: "Financial Accounting",
    level: "ACCA",
    body: "acca",
    description: "Double entry to consolidations and cash flows — IFRS-based practice for the FA CBE.",
    isAvailable: true,
  },
];

export const accaSkillsSubjects: Subject[] = [
  {
    id: "acca-lw",
    code: "ACCA LW",
    title: "Corporate and Business Law",
    level: "ACCA",
    body: "acca",
    description: "Contract, tort, employment, company law and insolvency — objective questions on the English-law variant.",
    isAvailable: true,
  },
  {
    id: "acca-pm",
    code: "ACCA PM",
    title: "Performance Management",
    level: "ACCA",
    body: "acca",
    description: "Costing techniques, decision making, budgeting, advanced variances and performance measurement — Section A/B practice.",
    isAvailable: true,
  },
  {
    id: "acca-fr",
    code: "ACCA FR",
    title: "Financial Reporting",
    level: "ACCA",
    body: "acca",
    description: "IFRS in depth: revenue, leases, financial instruments, tax, EPS and group accounts — Section A/B practice.",
    isAvailable: true,
  },
  {
    id: "acca-aa",
    code: "ACCA AA",
    title: "Audit and Assurance",
    level: "ACCA",
    body: "acca",
    description: "Planning, risk, internal control, evidence, review and reporting under ISAs — Section A/B practice.",
    isAvailable: true,
  },
  {
    id: "acca-fm",
    code: "ACCA FM",
    title: "Financial Management",
    level: "ACCA",
    body: "acca",
    description: "Working capital, investment appraisal, cost of capital, valuations and risk management — Section A/B practice.",
    isAvailable: true,
  },
];

export const cimaSubjects: Subject[] = [
  {
    id: "cima-ba1",
    code: "CIMA BA1",
    title: "Fundamentals of Business Economics",
    level: "CIMA",
    body: "cima",
    description: "Macro and micro economics, the financial system and business maths — the full BA1 objective test.",
    isAvailable: true,
  },
  {
    id: "cima-ba2",
    code: "CIMA BA2",
    title: "Fundamentals of Management Accounting",
    level: "CIMA",
    body: "cima",
    description: "Costing, budgeting, standard costing, CVP and investment appraisal for the BA2 objective test.",
    isAvailable: true,
  },
  {
    id: "cima-ba3",
    code: "CIMA BA3",
    title: "Fundamentals of Financial Accounting",
    level: "CIMA",
    body: "cima",
    description: "Double entry to single-entity accounts, cash flows and ratios for the BA3 objective test.",
    isAvailable: true,
  },
  {
    id: "cima-ba4",
    code: "CIMA BA4",
    title: "Fundamentals of Ethics, Corporate Governance and Business Law",
    level: "CIMA",
    body: "cima",
    description: "Ethics, governance, contract, employment and company law for the BA4 objective test.",
    isAvailable: true,
  },
];

export const icaewSubjects: Subject[] = [
  {
    id: "icaew-acc",
    code: "ICAEW AF",
    title: "Accounting Fundamentals",
    level: "ICAEW",
    body: "icaew",
    description: "Double entry through to single-company financial statements — Next Generation ACA Certificate Level practice.",
    isAvailable: true,
  },
  {
    id: "icaew-ass",
    code: "ICAEW ARF",
    title: "Assurance and Risk Fundamentals",
    level: "ICAEW",
    body: "icaew",
    description: "Assurance, risk, internal controls, evidence and ethics — Next Generation ACA Certificate Level practice.",
    isAvailable: true,
  },
  {
    id: "icaew-law",
    code: "ICAEW BL",
    title: "Business Law",
    level: "ICAEW",
    body: "icaew",
    description: "Contract, torts, agency, companies, insolvency and employment — Next Generation ACA Certificate Level practice.",
    isAvailable: false,
  },
  {
    id: "icaew-mi",
    code: "ICAEW BIP",
    title: "Business Insight and Performance",
    level: "ICAEW",
    body: "icaew",
    description: "Costing, budgeting, performance management and decision making — Next Generation ACA Certificate Level practice.",
    isAvailable: false,
  },
  {
    id: "icaew-se",
    code: "ICAEW SE",
    title: "Sustainability and Ethics",
    level: "ICAEW",
    body: "icaew",
    description: "Sustainability frameworks, ESG reporting, governance and the ICAEW Code of Ethics — Next Generation ACA Certificate Level practice.",
    isAvailable: false,
  },
];
// Note: the legacy BTF bank (scripts/data/global/icaew-btf.json) is not published — ICAEW withdrew BTF in Sept 2025.

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
export const allSubjects = [...prcSubjects, ...cafSubjects, ...accaSubjects, ...accaSkillsSubjects, ...caFoundationSubjects, ...cimaSubjects, ...icaewSubjects];
