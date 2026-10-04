/* ── CV data model, defaults and qualification catalogue (shared by CV maker + cover letter) ── */

export const LS_KEY = "cahub_cv_v1";

export interface WorkExp { company: string; role: string; period: string; bullets: string[]; }
export interface Education { level: string; institution: string; grade: string; years: string; }
export interface Course { name: string; provider: string; year: string; }

export type TemplateId = "classic" | "executive" | "modern" | "compact" | "elegant";
export type QualBodyId = "icap" | "acca" | "icai" | "cima" | "icaew" | "cma";
export type SectionId =
  | "profile" | "qualification" | "education" | "experience" | "courses"
  | "skills" | "certifications" | "languages" | "achievements" | "references";

export interface CVData {
  themeColor: string;
  fontFamily: string;
  layout: TemplateId;
  spacing?: "compact" | "normal" | "relaxed";
  /** Plain single-column, text-only rendering + text PDF for applicant tracking systems. */
  atsMode?: boolean;
  /** Custom section order. Undefined = the template's own default order. */
  sectionOrder?: SectionId[];
  hiddenSections?: SectionId[];
  name: string; phone: string; email: string; linkedin: string; photo: string;
  /** Professional body. Undefined = ICAP (kept for CVs saved before multi-body support). */
  qualBody?: QualBodyId;
  /** Stage / level for the chosen body. Field name kept from the ICAP-only version for saved CVs. */
  icapStage: string;
  /** Registration / student number (ICAP CRN, ACCA reg. no., ICAI SRO no., ...). */
  crn: string;
  /** ICAP Firm Training Scheme number (ICAP only). */
  fts: string;
  /** Free-text highlight, e.g. "All 8 CAF Papers | First Attempt". */
  papersCleared: string;
  /** Paper codes ticked as passed, e.g. ["CAF 1", "CAF 2"]. */
  papersPassed?: string[];
  profile: string;
  education: Education[];
  workExp: WorkExp[];
  courses: Course[];
  expertise: string[]; certifications: string[]; skills: string[]; languages: string[];
  accomplishments: string[];
  references: string;
}

/* ── Professional bodies ── */

export interface Paper { code: string; name: string; }
export interface QualBody {
  id: QualBodyId;
  label: string;
  full: string;
  stages: string[];
  idLabel: string;
  idPlaceholder: string;
  idHint: string;
  /** ICAP only: Firm Training Scheme number. */
  hasFts?: boolean;
  papers: { group: string; items: Paper[] }[];
  eduPresets: string[];
  papersPlaceholder: string;
  courseTip: { title: string; lines: string[] };
}

const p = (code: string, name: string): Paper => ({ code, name });

export const QUAL_BODIES: Record<QualBodyId, QualBody> = {
  icap: {
    id: "icap",
    label: "ICAP",
    full: "Institute of Chartered Accountants of Pakistan",
    stages: [
      "PRC Student", "PRC Qualified",
      "AFC Student (Old Scheme)", "AFC Qualified (Old Scheme)",
      "CAF Student", "CAF Student (Result Awaited)", "CAF Qualified",
      "CFAP Student", "CFAP Student (Result Awaited)", "CFAP Qualified",
      "ACA – Qualified Chartered Accountant",
    ],
    idLabel: "CRN",
    idPlaceholder: "e.g. 182743",
    idHint: "Your ICAP student registration number. On your exam admit card or student portal.",
    hasFts: true,
    papers: [
      { group: "PRC", items: [p("PRC 1", "Fundamentals of Accounting"), p("PRC 2", "Quantitative Analysis for Business"), p("PRC 3", "Business & Economic Insights")] },
      { group: "CAF", items: [
        p("CAF 1", "Financial Accounting and Reporting"), p("CAF 2", "Taxation Principles and Compliance"),
        p("CAF 3", "Data, Systems and Risks"), p("CAF 4", "Business Law Dynamics"),
        p("CAF 5", "Management Accounting"), p("CAF 6", "Corporate Reporting"),
        p("CAF 7", "Business Insights and Analysis"), p("CAF 8", "Audit and Assurance Essentials"),
      ] },
      { group: "CFAP", items: [p("CFAP 1", "CFAP 1"), p("CFAP 2", "CFAP 2"), p("CFAP 3", "CFAP 3"), p("CFAP 4", "CFAP 4"), p("CFAP 5", "CFAP 5"), p("CFAP 6", "CFAP 6")] },
    ],
    eduPresets: ["CAF | ICAP", "CFAP | ICAP", "AFC | ICAP (Old Scheme)", "PRC | ICAP"],
    papersPlaceholder: "All 8 CAF Papers | First Attempt",
    courseTip: {
      title: "ICAP Mandatory Hands-On Courses (HOCs):",
      lines: [
        "These are required by ICAP — list them if you've completed them:",
        "• Presentation & Personal Effectiveness (PPE) – mandatory before CFAP",
        "• MS Office for Business – mandatory before CFAP",
        "ES 2021 students also need: Data Analytics & FinTech",
        "ES 2025 students also need: AI & Data Analytics + Governance & Ethics (at CFAP stage)",
      ],
    },
  },
  acca: {
    id: "acca",
    label: "ACCA",
    full: "Association of Chartered Certified Accountants",
    stages: [
      "ACCA Student – Applied Knowledge", "ACCA Student – Applied Skills", "ACCA Student – Strategic Professional",
      "ACCA Affiliate (All Exams Passed)", "ACCA Member",
    ],
    idLabel: "ACCA Reg. No.",
    idPlaceholder: "e.g. 3456789",
    idHint: "Your ACCA registration number from myACCA. Optional — many students leave it off.",
    papers: [
      { group: "Applied Knowledge", items: [p("BT", "Business and Technology"), p("MA", "Management Accounting"), p("FA", "Financial Accounting")] },
      { group: "Applied Skills", items: [p("LW", "Corporate and Business Law"), p("PM", "Performance Management"), p("TX", "Taxation"), p("FR", "Financial Reporting"), p("AA", "Audit and Assurance"), p("FM", "Financial Management")] },
      { group: "Strategic Professional", items: [p("SBL", "Strategic Business Leader"), p("SBR", "Strategic Business Reporting"), p("AFM", "Advanced Financial Management"), p("APM", "Advanced Performance Management"), p("ATX", "Advanced Taxation"), p("AAA", "Advanced Audit and Assurance")] },
    ],
    eduPresets: ["ACCA | Applied Knowledge", "ACCA | Applied Skills", "ACCA | Strategic Professional"],
    papersPlaceholder: "9 of 13 exams passed | FR & AA first attempt",
    courseTip: {
      title: "ACCA requirements worth listing:",
      lines: [
        "• Ethics and Professional Skills Module (EPSM) — required for membership",
        "• Any ACCA-approved employer or practical experience (PER) progress",
        "• Prizes or high scores in individual papers",
      ],
    },
  },
  icai: {
    id: "icai",
    label: "ICAI",
    full: "Institute of Chartered Accountants of India",
    stages: [
      "CA Foundation Student", "CA Foundation Cleared",
      "CA Intermediate Student", "CA Intermediate – Group I Cleared", "CA Intermediate – Group II Cleared", "CA Intermediate Cleared (Both Groups)",
      "Articled Assistant", "CA Final Student", "CA Final Cleared", "Chartered Accountant (ACA)",
    ],
    idLabel: "ICAI SRO No.",
    idPlaceholder: "e.g. SRO0123456",
    idHint: "Your ICAI student registration (SRO) number from the SSP portal.",
    papers: [
      { group: "Foundation", items: [p("F1", "Accounting"), p("F2", "Business Laws"), p("F3", "Quantitative Aptitude"), p("F4", "Business Economics")] },
      { group: "Intermediate", items: [
        p("Inter 1", "Advanced Accounting"), p("Inter 2", "Corporate and Other Laws"), p("Inter 3", "Taxation"),
        p("Inter 4", "Cost and Management Accounting"), p("Inter 5", "Auditing and Ethics"), p("Inter 6", "Financial Management and Strategic Management"),
      ] },
      { group: "Final", items: [p("Final 1", "Financial Reporting"), p("Final 2", "Advanced Financial Management"), p("Final 3", "Advanced Auditing, Assurance and Professional Ethics"), p("Final 4", "Direct Tax Laws and International Taxation"), p("Final 5", "Indirect Tax Laws"), p("Final 6", "Integrated Business Solutions")] },
    ],
    eduPresets: ["CA Foundation | ICAI", "CA Intermediate | ICAI", "CA Final | ICAI", "Class XII (HSC)", "Class X (SSC)", "B.Com"],
    papersPlaceholder: "CA Inter Both Groups | First Attempt | Exemption in Audit",
    courseTip: {
      title: "ICAI courses worth listing:",
      lines: [
        "• ICITSS — Information Technology & Orientation Course (required before articleship)",
        "• AICITSS — Advanced IT & Management and Communication Skills (before CA Final)",
        "• Self-paced online modules you have completed",
      ],
    },
  },
  cima: {
    id: "cima",
    label: "CIMA",
    full: "Chartered Institute of Management Accountants",
    stages: [
      "CIMA Certificate Level Student", "CIMA Certificate in Business Accounting (Cert BA)",
      "CIMA Operational Level", "CIMA Diploma in Management Accounting",
      "CIMA Management Level", "CIMA Advanced Diploma in Management Accounting",
      "CIMA Strategic Level", "CGMA Finalist", "ACMA, CGMA",
    ],
    idLabel: "CIMA Contact ID",
    idPlaceholder: "e.g. 1-ABC123",
    idHint: "Your CIMA contact ID. Optional on a CV.",
    papers: [
      { group: "Certificate", items: [p("BA1", "Fundamentals of Business Economics"), p("BA2", "Fundamentals of Management Accounting"), p("BA3", "Fundamentals of Financial Accounting"), p("BA4", "Fundamentals of Ethics, Corporate Governance and Business Law")] },
      { group: "Operational", items: [p("E1", "Managing Finance in a Digital World"), p("P1", "Management Accounting"), p("F1", "Financial Reporting"), p("OCS", "Operational Case Study")] },
      { group: "Management", items: [p("E2", "Managing Performance"), p("P2", "Advanced Management Accounting"), p("F2", "Advanced Financial Reporting"), p("MCS", "Management Case Study")] },
      { group: "Strategic", items: [p("E3", "Strategic Management"), p("P3", "Risk Management"), p("F3", "Financial Strategy"), p("SCS", "Strategic Case Study")] },
    ],
    eduPresets: ["CIMA | Certificate Level", "CIMA | Operational Level", "CIMA | Management Level", "CIMA | Strategic Level"],
    papersPlaceholder: "Operational Level complete | OCS passed",
    courseTip: { title: "Courses worth listing:", lines: ["• Excel, Power BI or data-analytics courses", "• ERP or accounting software training (SAP, Oracle, Xero)"] },
  },
  icaew: {
    id: "icaew",
    label: "ICAEW",
    full: "Institute of Chartered Accountants in England and Wales",
    stages: [
      "ICAEW ACA Student – Certificate Level", "ICAEW CFAB",
      "ICAEW ACA Student – Professional Level", "ICAEW ACA Student – Advanced Level", "ACA Chartered Accountant",
    ],
    idLabel: "ICAEW Student No.",
    idPlaceholder: "e.g. 1234567",
    idHint: "Your ICAEW student number. Optional on a CV.",
    papers: [
      { group: "Certificate", items: [p("ACC", "Accounting"), p("AA", "Assurance"), p("LAW", "Law"), p("MI", "Management Information"), p("BTF", "Business, Technology and Finance"), p("PoT", "Principles of Taxation")] },
      { group: "Professional", items: [p("AUD", "Audit and Assurance"), p("FAR", "Financial Accounting and Reporting"), p("TC", "Tax Compliance"), p("BST", "Business Strategy and Technology"), p("FM", "Financial Management"), p("BP", "Business Planning")] },
      { group: "Advanced", items: [p("CR", "Corporate Reporting"), p("SBM", "Strategic Business Management"), p("CS", "Case Study")] },
    ],
    eduPresets: ["ICAEW ACA | Certificate Level", "ICAEW ACA | Professional Level", "ICAEW ACA | Advanced Level", "A-Levels", "GCSEs"],
    papersPlaceholder: "Certificate Level complete | Audit & Assurance credit",
    courseTip: { title: "Courses worth listing:", lines: ["• ICAEW ethics learning programme", "• Data analytics or Excel courses", "• Firm insight days or spring weeks"] },
  },
  cma: {
    id: "cma",
    label: "US CMA",
    full: "Institute of Management Accountants (IMA)",
    stages: ["CMA Candidate", "CMA Candidate – Part 1 Passed", "CMA Candidate – Part 2 Passed", "CMA (Certified Management Accountant)"],
    idLabel: "IMA Member ID",
    idPlaceholder: "e.g. 1234567",
    idHint: "Your IMA member / candidate number. Optional on a CV.",
    papers: [{ group: "Exam", items: [p("Part 1", "Financial Planning, Performance and Analytics"), p("Part 2", "Strategic Financial Management")] }],
    eduPresets: ["US CMA | IMA", "Bachelor's", "Master's"],
    papersPlaceholder: "Part 1 passed | Part 2 sitting May",
    courseTip: { title: "Courses worth listing:", lines: ["• IMA ethics / CPE courses", "• Excel, Power BI, SQL or financial modelling courses"] },
  },
};

export const QUAL_BODY_IDS = Object.keys(QUAL_BODIES) as QualBodyId[];
export const qualOf = (cv: Pick<CVData, "qualBody">): QualBody => QUAL_BODIES[cv.qualBody ?? "icap"] ?? QUAL_BODIES.icap;

/** Back-compat export: the original ICAP stage list. */
export const ICAP_STAGES = QUAL_BODIES.icap.stages;
export const BASE_EDU_PRESETS = ["Matric (SSC)", "Inter (HSSC)", "O-Levels", "A-Levels", "Bachelor's", "Master's"];

/** One-line headline under the name, e.g. "CAF Qualified | FTS 67". */
export function headline(cv: CVData): string {
  const q = qualOf(cv);
  return `${cv.icapStage}${q.hasFts && cv.fts ? ` | FTS ${cv.fts}` : ""}`;
}

/* ── Sections ── */

export const SECTION_LABELS: Record<SectionId, string> = {
  profile: "Profile",
  qualification: "Qualification box",
  education: "Education",
  experience: "Work experience",
  courses: "Courses & training",
  skills: "Skills (technical + soft)",
  certifications: "Certifications",
  languages: "Languages",
  achievements: "Achievements",
  references: "References",
};

export const ALL_SECTIONS = Object.keys(SECTION_LABELS) as SectionId[];

/** Each template's own default order (the order the original templates used). */
export const TEMPLATE_ORDER: Record<TemplateId, SectionId[]> = {
  classic: ["profile", "qualification", "certifications", "skills", "languages", "references", "education", "experience", "courses", "achievements"],
  executive: ["profile", "qualification", "experience", "education", "courses", "skills", "achievements", "certifications", "languages", "references"],
  modern: ["profile", "experience", "education", "courses", "achievements", "qualification", "skills", "certifications", "languages", "references"],
  compact: ["profile", "qualification", "education", "experience", "courses", "achievements", "skills", "certifications", "languages", "references"],
  elegant: ["profile", "qualification", "education", "experience", "courses", "achievements", "skills", "certifications", "languages", "references"],
};

/** Conventional order applicant-tracking systems expect. */
export const ATS_ORDER: SectionId[] = ["profile", "qualification", "education", "experience", "courses", "skills", "certifications", "achievements", "languages", "references"];

/** Sections a template hides by default (they are shown elsewhere, e.g. in the header). */
export const TEMPLATE_HIDDEN: Record<TemplateId, SectionId[]> = {
  classic: [],
  // The original Executive layout never showed these; the header already carries the qualification line.
  executive: ["certifications", "languages", "references"],
  modern: [],
  compact: [],
  elegant: [],
};

export function sectionOrder(cv: CVData): SectionId[] {
  const base = cv.sectionOrder?.length ? cv.sectionOrder : cv.atsMode ? ATS_ORDER : TEMPLATE_ORDER[cv.layout] ?? TEMPLATE_ORDER.classic;
  const seen = new Set<SectionId>();
  const out: SectionId[] = [];
  for (const s of [...base, ...ALL_SECTIONS]) if (ALL_SECTIONS.includes(s) && !seen.has(s)) { seen.add(s); out.push(s); }
  return out;
}

export function hiddenSections(cv: CVData): SectionId[] {
  // ATS mode drops "References available on request" by default — it wastes a line parsers ignore.
  return cv.hiddenSections ?? (cv.atsMode ? ["references"] : TEMPLATE_HIDDEN[cv.layout] ?? []);
}

/** Ordered, visible sections. */
export function visibleSections(cv: CVData): SectionId[] {
  const hidden = new Set(hiddenSections(cv));
  return sectionOrder(cv).filter(s => !hidden.has(s));
}

export const TEMPLATES: { id: TemplateId; name: string; blurb: string; isNew?: boolean }[] = [
  { id: "classic", name: "Classic (2-Col)", blurb: "Industry standard split design" },
  { id: "executive", name: "Executive (1-Col)", blurb: "Elite single-column styling" },
  { id: "modern", name: "Modern", blurb: "Accent header, clean side panel", isNew: true },
  { id: "compact", name: "Compact", blurb: "Dense one-pager, label column", isNew: true },
  { id: "elegant", name: "Elegant", blurb: "Serif, centred, conservative", isNew: true },
];

/* ── Demo + blank ── */

export const DEMO: CVData = {
  themeColor: "#1a1a1a",
  fontFamily: "'Arial','Helvetica Neue',sans-serif",
  layout: "classic",
  spacing: "normal",
  name: "Ali Hassan Qureshi",
  phone: "+92 321 5556677",
  email: "ali.hassan@email.com",
  linkedin: "linkedin.com/in/alihassanqureshi",
  photo: "",
  qualBody: "icap",
  icapStage: "CAF Qualified",
  crn: "182743",
  fts: "67",
  papersCleared: "All 8 CAF Papers | First Attempt",
  papersPassed: [],
  profile:
    "CAF Qualified ICAP student seeking an audit trainee position at a Big-4 or mid-tier firm. Cleared all eight CAF papers on first attempt and earned 80%+ in four papers including Financial Reporting and Audit. Equipped with solid grounding in IFRS, ISAs, and corporate taxation. Eager to translate academic knowledge into practical client-facing work under structured articleship.",
  education: [
    { level: "CAF | ICAP", institution: "ICAP", grade: "All 8 Papers | First Attempt | 80%+ in FR & Audit", years: "2022 – 2024" },
    { level: "Inter (HSSC) – Pre-Engineering", institution: "Punjab College, Lahore", grade: "Grade: A | 85%", years: "2020 – 2022" },
    { level: "Matric (SSC)", institution: "City Grammar School, Lahore", grade: "Grade: A+ | 92%", years: "2018 – 2020" },
  ],
  workExp: [
    {
      company: "Siddiqui & Sons (Family Business)",
      role: "Accounts & Finance Intern",
      period: "Apr 2023 – Oct 2023",
      bullets: [
        "Maintained double-entry books, reconciled monthly bank statements for Rs. 3M+ turnover",
        "Prepared tax invoices and assisted in quarterly GST filing on FBR IRIS portal",
        "Developed Excel dashboards for weekly sales tracking, reducing reporting time by 40%",
      ],
    },
    {
      company: "Self-Employed",
      role: "Private Tutor – Accounts & Economics",
      period: "2021 – 2023",
      bullets: [
        "Tutored 12 O-Level and Matric students, maintaining 100% pass rate",
        "2 students scored distinctions in Edexcel O-Level Accounts (Grade A*)",
      ],
    },
  ],
  courses: [
    { name: "Presentation & Personal Effectiveness (PPE)", provider: "ICAP – Hands-On Course", year: "2024" },
    { name: "MS Office for Business", provider: "ICAP – Hands-On Course", year: "2024" },
    { name: "Data Analytics & FinTech", provider: "ICAP – Hands-On Course", year: "2024" },
    { name: "Advanced MS Excel & Financial Modelling", provider: "CFI (Online)", year: "2023" },
  ],
  expertise: ["MS Excel (Advanced)", "QuickBooks Desktop", "FBR IRIS Portal", "Financial Modelling", "SAP (Basic)"],
  certifications: ["PPE – ICAP Hands-On Course (Completed)", "MS Office for Business – ICAP HOC (Completed)"],
  skills: ["Analytical Thinking", "Attention to Detail", "Team Collaboration", "Problem-Solving", "Time Management", "Business Communication"],
  languages: ["English (Fluent)", "Urdu (Native)", "Punjabi (Conversational)"],
  accomplishments: [
    "Cleared all 8 CAF papers in first attempt – top 15% nationally in Financial Reporting",
    "Certificate of Merit – Board of Intermediate Education, Lahore (2022)",
    "1st Place, Inter-School Business Plan Competition, Punjab College (2021)",
    "Student Council Secretary, City Grammar School (2019 – 2020)",
    "Volunteer, Edhi Foundation – monthly food distribution drive (2021 – present)",
  ],
  references: "Available on request",
};

export const DEFAULT: CVData = {
  themeColor: "#1a1a1a",
  fontFamily: "'Arial','Helvetica Neue',sans-serif",
  layout: "classic",
  spacing: "normal",
  name: "", phone: "", email: "", linkedin: "", photo: "",
  qualBody: "icap",
  icapStage: "CAF Qualified", crn: "", fts: "", papersCleared: "",
  papersPassed: [],
  profile: "",
  education: [
    { level: "CAF | ICAP", institution: "ICAP", grade: "", years: "" },
    { level: "", institution: "", grade: "", years: "" },
  ],
  workExp: [{ company: "", role: "", period: "", bullets: [""] }],
  courses: [{ name: "", provider: "", year: "" }],
  expertise: [""], certifications: [""], skills: ["Attention to Detail", "Adaptability", "Team Collaboration"],
  languages: ["English", "Urdu"],
  accomplishments: [""],
  references: "Available on request",
};

const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);
const strArr = (v: unknown, fallback: string[]): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : fallback);

/** Merge a stored (possibly old / partial / hand-edited) CV over a base, coercing bad types. */
export function normalizeCV(raw: unknown, base: CVData = DEMO): CVData {
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Record<string, unknown>;
  const cv: CVData = { ...base, ...(r as Partial<CVData>) };
  for (const k of ["name", "phone", "email", "linkedin", "photo", "icapStage", "crn", "fts", "papersCleared", "profile", "references", "themeColor", "fontFamily"] as const) {
    cv[k] = str(r[k], base[k]);
  }
  for (const k of ["expertise", "certifications", "skills", "languages", "accomplishments"] as const) cv[k] = strArr(r[k], base[k]);
  cv.papersPassed = strArr(r.papersPassed, []);
  if (!TEMPLATES.some(t => t.id === cv.layout)) cv.layout = "classic";
  if (cv.qualBody && !QUAL_BODY_IDS.includes(cv.qualBody)) cv.qualBody = "icap";
  cv.education = Array.isArray(r.education) ? (r.education as Education[]).filter(e => e && typeof e === "object").map(e => ({ level: str(e.level), institution: str(e.institution), grade: str(e.grade), years: str(e.years) })) : base.education;
  cv.workExp = Array.isArray(r.workExp) ? (r.workExp as WorkExp[]).filter(w => w && typeof w === "object").map(w => ({ company: str(w.company), role: str(w.role), period: str(w.period), bullets: strArr(w.bullets, [""]) })) : base.workExp;
  cv.courses = Array.isArray(r.courses) ? (r.courses as Course[]).filter(c => c && typeof c === "object").map(c => ({ name: str(c.name), provider: str(c.provider), year: str(c.year) })) : base.courses;
  if (cv.sectionOrder && !Array.isArray(cv.sectionOrder)) cv.sectionOrder = undefined;
  if (cv.hiddenSections && !Array.isArray(cv.hiddenSections)) cv.hiddenSections = undefined;
  return cv;
}

/** Read the saved CV (if any) from localStorage. Client only. */
export function loadSavedCV(): CVData | null {
  try {
    const s = localStorage.getItem(LS_KEY);
    return s ? normalizeCV(JSON.parse(s)) : null;
  } catch {
    return null;
  }
}

/* ── Content helpers shared by every template, the ATS preview and the text PDF ── */

export const filled = {
  education: (cv: CVData) => cv.education.filter(e => e.level || e.institution),
  work: (cv: CVData) => cv.workExp.filter(w => w.company),
  courses: (cv: CVData) => cv.courses.filter(c => c.name),
  list: (xs: string[]) => xs.map(x => x.trim()).filter(Boolean),
};

/** "CAF Qualified (CRN: 182743) | FTS: 67 — All 8 CAF Papers" — used by single-line headers. */
export function qualSummary(cv: CVData): string {
  const q = qualOf(cv);
  return [
    cv.icapStage,
    cv.crn ? ` (${q.idLabel}: ${cv.crn})` : "",
    q.hasFts && cv.fts ? ` | FTS: ${cv.fts}` : "",
    cv.papersCleared ? ` — ${cv.papersCleared}` : "",
  ].join("");
}

export function hasSectionContent(cv: CVData, s: SectionId): boolean {
  switch (s) {
    case "profile": return !!cv.profile.trim();
    case "qualification": return !!(cv.crn || cv.papersCleared || cv.papersPassed?.length);
    case "education": return filled.education(cv).length > 0;
    case "experience": return filled.work(cv).length > 0;
    case "courses": return filled.courses(cv).length > 0;
    case "skills": return filled.list(cv.expertise).length + filled.list(cv.skills).length > 0;
    case "certifications": return filled.list(cv.certifications).length > 0;
    case "languages": return filled.list(cv.languages).length > 0;
    case "achievements": return filled.list(cv.accomplishments).length > 0;
    case "references": return !!cv.references.trim();
  }
}

export type AtsItem =
  | { t: "para"; text: string }
  | { t: "entry"; title: string; right?: string }
  | { t: "bullet"; text: string }
  | { t: "line"; label?: string; text: string };
export interface AtsBlock { heading: string; items: AtsItem[] }

const ATS_HEADINGS: Record<SectionId, string> = {
  profile: "Professional Summary",
  qualification: "Professional Qualification",
  education: "Education",
  experience: "Work Experience",
  courses: "Courses and Training",
  skills: "Skills",
  certifications: "Certifications",
  languages: "Languages",
  achievements: "Achievements",
  references: "References",
};

/** Plain, parser-friendly content blocks in the CV's section order. */
export function atsBlocks(cv: CVData): AtsBlock[] {
  const q = qualOf(cv);
  const out: AtsBlock[] = [];
  for (const s of visibleSections(cv)) {
    if (s !== "qualification" && !hasSectionContent(cv, s)) continue;
    const items: AtsItem[] = [];
    switch (s) {
      case "profile": items.push({ t: "para", text: cv.profile.trim() }); break;
      case "qualification":
        if (!cv.icapStage && !hasSectionContent(cv, s)) break;
        items.push({ t: "line", label: `${q.full} (${q.label})`, text: cv.icapStage });
        if (cv.crn) items.push({ t: "line", label: q.idLabel, text: cv.crn });
        if (q.hasFts && cv.fts) items.push({ t: "line", label: "FTS Number", text: cv.fts });
        if (cv.papersPassed?.length) items.push({ t: "line", label: "Papers passed", text: cv.papersPassed.join(", ") });
        if (cv.papersCleared) items.push({ t: "line", text: cv.papersCleared });
        break;
      case "education":
        for (const e of filled.education(cv)) {
          items.push({ t: "entry", title: [e.level, e.institution].filter(Boolean).join(", "), right: e.years });
          if (e.grade) items.push({ t: "bullet", text: e.grade });
        }
        break;
      case "experience":
        for (const w of filled.work(cv)) {
          items.push({ t: "entry", title: w.role ? `${w.role}, ${w.company}` : w.company, right: w.period });
          for (const b of filled.list(w.bullets)) items.push({ t: "bullet", text: b });
        }
        break;
      case "courses":
        for (const c of filled.courses(cv)) items.push({ t: "bullet", text: [c.name, c.provider].filter(Boolean).join(", ") + (c.year ? ` (${c.year})` : "") });
        break;
      case "skills":
        if (filled.list(cv.expertise).length) items.push({ t: "line", label: "Technical", text: filled.list(cv.expertise).join(", ") });
        if (filled.list(cv.skills).length) items.push({ t: "line", label: "Professional", text: filled.list(cv.skills).join(", ") });
        break;
      case "certifications": for (const c of filled.list(cv.certifications)) items.push({ t: "bullet", text: c }); break;
      case "languages": items.push({ t: "para", text: filled.list(cv.languages).join(", ") }); break;
      case "achievements": for (const a of filled.list(cv.accomplishments)) items.push({ t: "bullet", text: a }); break;
      case "references": items.push({ t: "para", text: cv.references.trim() }); break;
    }
    if (items.length) out.push({ heading: ATS_HEADINGS[s], items });
  }
  return out;
}
