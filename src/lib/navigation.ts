import { allSubjects, subjectBody, subjectCode, LEVEL_LABEL, type BodyId, type Level, type Subject } from "@/data/subjects";

/** Shared site structure: qualification groups for the header menu and links used by breadcrumbs and next-step blocks. */

export interface QualGroup {
  body: BodyId;
  /** Short name shown in menus, e.g. "ICAP" */
  short: string;
  /** One-line description, e.g. "CA Pakistan" */
  note: string;
  /** Exam hub, e.g. /exams/icap */
  hub: string;
  levels: { level: Level; label: string; subjects: Subject[] }[];
}

const BODY_META: Record<BodyId, { short: string; note: string }> = {
  icap: { short: "ICAP", note: "CA Pakistan" },
  icai: { short: "ICAI", note: "CA India" },
  acca: { short: "ACCA", note: "Global" },
  cima: { short: "CIMA", note: "Certificate" },
  icaew: { short: "ICAEW", note: "ACA Certificate" },
  ima: { short: "US CMA", note: "IMA" },
};

export const BODY_ORDER: BodyId[] = ["icap", "icai", "acca", "cima", "icaew", "ima"];

const LEVEL_SHORT: Partial<Record<Level, string>> = {
  PRC: "PRC",
  CAF: "CAF",
  "CA-FOUNDATION": "CA Foundation",
  "CA-INTER": "CA Intermediate",
};

export const bodyShort = (b: BodyId) => BODY_META[b].short;
export const examHubHref = (b: BodyId) => `/exams/${b}`;
export const dailyHrefFor = (b: BodyId) => (b === "icap" ? "/daily" : `/daily/${b}`);
export const subjectHomeHref = (s: Pick<Subject, "level" | "id">) => `/${s.level.toLowerCase()}/${s.id}`;
export const bankHref = (s: Pick<Subject, "level" | "id">) => `${subjectHomeHref(s)}/mcqs`;

export const QUAL_GROUPS: QualGroup[] = BODY_ORDER.map((body) => {
  const subs = allSubjects.filter((s) => s.isAvailable && subjectBody(s) === body);
  const levels = Array.from(new Set(subs.map((s) => s.level))).map((level) => ({
    level,
    label: LEVEL_SHORT[level] ?? "",
    subjects: subs.filter((s) => s.level === level),
  }));
  return { body, ...BODY_META[body], hub: examHubHref(body), levels };
}).filter((g) => g.levels.length > 0);

/** Short paper label for menus: "PRC-1", "BA1", "P3"… with the body prefix removed. */
export function paperCode(s: Subject): string {
  return subjectCode(s).replace(/^(ACCA|CIMA|ICAEW|US CMA|CA Inter|CA Foundation)\s+/, "");
}

/** Breadcrumb trail down to a subject: Home › ICAP › PRC-1. */
export function subjectCrumbs(s: Subject) {
  const body = subjectBody(s);
  return [
    { name: "Home", href: "/" },
    { name: `${bodyShort(body)} exams`, short: bodyShort(body), href: examHubHref(body) },
    { name: `${subjectCode(s)} ${s.title}`, short: subjectCode(s), href: subjectHomeHref(s) },
  ];
}

export { LEVEL_LABEL };
