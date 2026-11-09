import type { Paper } from "../pastPapers";

/*
 * ICAP PRC papers are computer-based. ICAP publishes its PRC model papers only
 * inside the exam software in the student secured area, so there are no public
 * question papers to index. These pages carry the official access route and the
 * syllabus weightings from ICAP's published PRC syllabus (read in full).
 */

const SYLLABUS = "https://student.icap.org.pk/viewfile/?add=students/scheme2025/prc/&file=PRC-Syllabus.pdf";
const HOWTO = "https://icap.org.pk/files/per/students/exam/prc/Howtorunmodelpaper.pdf";
const SOFTWARE = "https://icap.org.pk/files/per/students/exam/prc/GuidanceonNewExaminationSoftware.pdf";
const RESOURCES = "https://icap.org.pk/students/study-resources/education-scheme-2025/study-resources/";

const common = {
  body: "icap" as const,
  level: "PRC",
  scheme: "Education Scheme 2025",
  officialUrl: RESOURCES,
  syllabusUrl: SYLLABUS,
  format: "Computer-based exam in ICAP's examination software",
  sittings: [],
  notes: [
    "ICAP's PRC model papers run inside its examination software, reached from the student secured area (CRN login). There are no public PDF papers to index, so this page lists the official access route and the syllabus weightings instead of a topical index.",
  ],
};

const resources = (code: string) => [
  { label: "PRC syllabus with weightings", url: SYLLABUS },
  { label: "How to run the PRC model papers (ICAP guide)", url: HOWTO, note: "Model papers need an ICAP student login" },
  { label: "Guidance on the new examination software", url: SOFTWARE },
  { label: `${code} study text and question bank (ICAP study resources)`, url: RESOURCES },
];

export const icapPrcPapers: Paper[] = [
  {
    ...common,
    slug: "icap-prc-1",
    code: "PRC-1",
    title: "Fundamentals of Accounting",
    mcqHub: "/prc/prc-1/mcqs",
    keywords: ["ICAP PRC-1 past papers", "PRC 1 model paper", "PRC fundamentals of accounting past papers", "ICAP PRC sample paper"],
    overview: [
      "PRC-1 tests the double-entry foundations that CAF-1 builds on: recording transactions, period-end adjustments, preparing basic financial statements, and depreciation and inventories.",
      "Because the exam is computer-based, the best preparation is timed MCQ practice plus one run-through of ICAP's model paper in the official software so the interface is familiar on the day.",
    ],
    grid: [
      { id: "A", label: "Recording financial information", min: 20, max: 30 },
      { id: "B", label: "Adjustments in the recorded information", min: 25, max: 35 },
      { id: "C", label: "Preparing financial statements", min: 20, max: 30 },
      { id: "D", label: "Accounting for depreciation and inventories", min: 15, max: 25 },
    ],
    areas: [
      { id: "basics", label: "Accounting basics", mcq: "/prc/prc-1/mcqs/chapter-1-accounting-basics" },
      { id: "prime", label: "Books of prime entry", mcq: "/prc/prc-1/mcqs/chapter-2-books-of-prime-entry" },
      { id: "ledgers", label: "Ledgers and trial balance", mcq: "/prc/prc-1/mcqs/chapter-3-ledgers-and-trial-balance" },
      { id: "accruals", label: "Accruals and prepayments", mcq: "/prc/prc-1/mcqs/chapter-4-accruals-and-prepayments" },
      { id: "debts", label: "Bad and doubtful debts", mcq: "/prc/prc-1/mcqs/chapter-5-bad-and-doubtful-debts" },
      { id: "errors", label: "Correction of errors", mcq: "/prc/prc-1/mcqs/chapter-8-correction-of-errors" },
      { id: "bank", label: "Bank reconciliations", mcq: "/prc/prc-1/mcqs/chapter-9-bank-reconciliations" },
      { id: "fs", label: "Preparation of financial statements", mcq: "/prc/prc-1/mcqs/chapter-10-preparation-of-financial-statements" },
      { id: "ppe", label: "Property, plant and equipment", mcq: "/prc/prc-1/mcqs/chapter-6-property-plant-and-equipment" },
      { id: "inventory", label: "Inventories (IAS 2)", mcq: "/prc/prc-1/mcqs/chapter-7-ias-2-inventories" },
    ],
    resources: resources("PRC-1"),
  },
  {
    ...common,
    slug: "icap-prc-2",
    code: "PRC-2",
    title: "Quantitative Analysis for Business",
    mcqHub: "/prc/prc-2/mcqs",
    keywords: ["ICAP PRC-2 past papers", "PRC 2 model paper", "PRC quantitative analysis past papers", "QAB ICAP sample paper"],
    overview: [
      "PRC-2 covers business mathematics, financial mathematics, statistics and probability. Statistics carries the largest weighting (30–40%).",
      "Most marks come from short calculations, so speed with a calculator and a clear method for each formula matter more than memorising theory.",
    ],
    grid: [
      { id: "A", label: "Basic mathematics", min: 20, max: 30 },
      { id: "B", label: "Financial mathematics", min: 20, max: 30 },
      { id: "C", label: "Application of statistics in business", min: 30, max: 40 },
      { id: "D", label: "Probability and expected values", min: 10, max: 20 },
    ],
    areas: [
      { id: "equations", label: "Linear and quadratic equations", mcq: "/prc/prc-2/mcqs/chapter-1-linear-and-quadratic-equations" },
      { id: "coordinates", label: "Coordinate system and its application", mcq: "/prc/prc-2/mcqs/chapter-2-coordinate-system-and-its-application" },
      { id: "progression", label: "Mathematical progression", mcq: "/prc/prc-2/mcqs/chapter-3-mathematical-progression" },
      { id: "lp", label: "Linear programming", mcq: "/prc/prc-2/mcqs/chapter-4-linear-programming" },
      { id: "finmaths", label: "Financial mathematics", mcq: "/prc/prc-2/mcqs/chapter-5-financial-mathematics" },
      { id: "dcf", label: "Discounted cash flows", mcq: "/prc/prc-2/mcqs/chapter-6-discounted-cash-flows" },
      { id: "data", label: "Data collection and representation", mcq: "/prc/prc-2/mcqs/chapter-7-data-collection-and-representation" },
      { id: "measures", label: "Statistical measures of data", mcq: "/prc/prc-2/mcqs/chapter-8-statistical-measures-of-data" },
      { id: "indices", label: "Index numbers", mcq: "/prc/prc-2/mcqs/chapter-9-indices" },
      { id: "regression", label: "Correlation and regression", mcq: "/prc/prc-2/mcqs/chapter-10-correlation-and-regression" },
      { id: "probability", label: "Probability concepts", mcq: "/prc/prc-2/mcqs/chapter-11-probability-concepts" },
      { id: "distributions", label: "Probability distributions", mcq: "/prc/prc-2/mcqs/chapter-12-probability-distributions" },
    ],
    resources: resources("PRC-2"),
  },
  {
    ...common,
    slug: "icap-prc-3",
    code: "PRC-3",
    title: "Business and Economic Insights",
    mcqHub: "/prc/prc-3/mcqs",
    keywords: ["ICAP PRC-3 past papers", "PRC 3 model paper", "PRC business and economic insights past papers", "BEI ICAP sample paper"],
    overview: [
      "PRC-3 combines business organisation and operations with micro- and macroeconomics. Business operations and microeconomic principles are the two heaviest blocks (20–30% each).",
      "The questions are largely conceptual, so revise definitions and cause-and-effect chains (for example how a policy rate change feeds through to inflation and demand).",
    ],
    grid: [
      { id: "A", label: "Business organizations", min: 10, max: 15 },
      { id: "B", label: "Business operations", min: 20, max: 30 },
      { id: "C", label: "Business finance and ethics", min: 10, max: 15 },
      { id: "D", label: "Economic principles and microeconomics", min: 20, max: 30 },
      { id: "E", label: "Macroeconomics – basic concepts", min: 5, max: 10 },
      { id: "F", label: "Economic policies and trends", min: 15, max: 20 },
    ],
    areas: [
      { id: "nature", label: "Nature of business", mcq: "/prc/prc-3/mcqs/chapter-1-nature-of-business" },
      { id: "ownership", label: "Ownership of business", mcq: "/prc/prc-3/mcqs/chapter-2-ownership-of-business" },
      { id: "organisation", label: "Organization of business", mcq: "/prc/prc-3/mcqs/chapter-3-organization-of-business" },
      { id: "is", label: "Information systems", mcq: "/prc/prc-3/mcqs/chapter-5-information-systems" },
      { id: "marketing", label: "Branding and marketing", mcq: "/prc/prc-3/mcqs/chapter-7-concepts-of-branding-and-marketing" },
      { id: "hr", label: "Human resource strategies", mcq: "/prc/prc-3/mcqs/chapter-8-human-resource-strategies" },
      { id: "finance", label: "Sources of business finance", mcq: "/prc/prc-3/mcqs/chapter-4-sources-of-business-finance" },
      { id: "ethics", label: "Business ethics", mcq: "/prc/prc-3/mcqs/chapter-6-business-ethics" },
      { id: "econ-scope", label: "Nature and scope of economics", mcq: "/prc/prc-3/mcqs/chapter-9-nature-and-scope-of-economics" },
      { id: "demand", label: "Demand, supply and equilibrium", mcq: "/prc/prc-3/mcqs/chapter-10-demand-supply-and-market-equilibrium" },
      { id: "elasticity", label: "Elasticity", mcq: "/prc/prc-3/mcqs/chapter-11-elasticity-of-demand-and-supply" },
      { id: "firm", label: "Theory of the firm", mcq: "/prc/prc-3/mcqs/chapter-12-firm-theory" },
      { id: "national-income", label: "National income", mcq: "/prc/prc-3/mcqs/chapter-13-national-income-and-its-determination" },
      { id: "multiplier", label: "Multiplier and accelerator", mcq: "/prc/prc-3/mcqs/chapter-15-multiplier-and-accelerator" },
      { id: "public-finance", label: "Public finance", mcq: "/prc/prc-3/mcqs/chapter-16-public-finance" },
      { id: "money", label: "Money", mcq: "/prc/prc-3/mcqs/chapter-17-money" },
      { id: "inflation", label: "Inflation and unemployment", mcq: "/prc/prc-3/mcqs/chapter-18-inflation-and-unemployment" },
      { id: "monetary", label: "Monetary policy", mcq: "/prc/prc-3/mcqs/chapter-19-monetary-policy" },
      { id: "trade", label: "Balance of trade and payments", mcq: "/prc/prc-3/mcqs/chapter-20-balance-of-trade-and-payments" },
    ],
    resources: resources("PRC-3"),
  },
];
