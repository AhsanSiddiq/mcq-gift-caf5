import type { BodyId, Level } from "@/data/subjects";

/** Serialisable subject + chapter list handed from the server page to the planner. */
export interface CatalogChapter {
  chapter: number;
  topic: string;
  count: number;
  slug: string;
}

export interface CatalogSubject {
  id: string;
  code: string;
  title: string;
  level: Level;
  levelLabel: string;
  body: BodyId;
  chapters: CatalogChapter[];
}

export const BODIES: { id: BodyId; label: string; exams: string }[] = [
  { id: "icap", label: "ICAP", exams: "PRC & CAF" },
  { id: "acca", label: "ACCA", exams: "Applied Knowledge & Skills" },
  { id: "icai", label: "ICAI", exams: "CA Foundation & Inter" },
  { id: "cima", label: "CIMA", exams: "Certificate (BA1–BA4)" },
  { id: "icaew", label: "ICAEW", exams: "ACA Certificate Level" },
  { id: "ima", label: "US CMA", exams: "Part 1 & Part 2" },
];

export const PLANNER_URL = "https://www.thecahub.com/tools/study-planner";
