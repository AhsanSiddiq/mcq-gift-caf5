import { unstable_cache } from "next/cache";
import type { MCQ } from "@/data/mcqs";
import { supabase } from "@/lib/supabase";
import { allSubjects, type Subject } from "@/data/subjects";

/** Server-side reads for the crawlable question-bank pages (/[level]/[subject]/mcqs/...). */

export interface ChapterMeta {
  chapter: number;
  topic: string;
  count: number;
  slug: string;
}

export interface BankQuestion {
  id: string;
  question: string;
  options: { key: string; text: string; correct: boolean }[];
  explanation: string | null;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

export function chapterSlug(chapter: number, topic: string): string {
  const t = slugify(topic);
  return t && t !== `chapter-${chapter}` ? `chapter-${chapter}-${t}` : `chapter-${chapter}`;
}

/** Returns the subject only when the URL's level matches it — avoids duplicate URLs like /prc/caf-5. */
export function resolveSubject(level: string, subjectId: string): Subject | undefined {
  const s = allSubjects.find((x) => x.id === subjectId.toLowerCase());
  return s && s.isAvailable && s.level.toLowerCase() === level.toLowerCase() ? s : undefined;
}

export async function getChapters(subjectId: string): Promise<ChapterMeta[]> {
  const rows: { chapter: number | null; topic: string | null }[] = [];
  const pageSize = 1000;
  for (let page = 0; page < 20; page++) {
    const { data, error } = await supabase
      .from("questions")
      .select("chapter, topic")
      .eq("subject_id", subjectId)
      .eq("is_active", true)
      .range(page * pageSize, (page + 1) * pageSize - 1);
    if (error || !data?.length) break;
    rows.push(...data);
    if (data.length < pageSize) break;
  }

  const map = new Map<number, ChapterMeta>();
  for (const r of rows) {
    if (r.chapter == null) continue;
    const existing = map.get(r.chapter);
    if (existing) existing.count++;
    else {
      const topic = r.topic || `Chapter ${r.chapter}`;
      map.set(r.chapter, { chapter: r.chapter, topic, count: 1, slug: chapterSlug(r.chapter, topic) });
    }
  }
  return [...map.values()].sort((a, b) => a.chapter - b.chapter);
}

export async function getChapterQuestions(subjectId: string, chapter: number): Promise<BankQuestion[]> {
  const { data } = await supabase
    .from("questions")
    .select("id, question_text, explanation, options(option_key, option_text, is_correct)")
    .eq("subject_id", subjectId)
    .eq("chapter", chapter)
    .eq("is_active", true)
    .order("created_at");

  return (data ?? []).map((row) => ({
    id: row.id as string,
    question: row.question_text as string,
    explanation: (row.explanation as string | null) ?? null,
    options: ((row.options ?? []) as { option_key: string; option_text: string; is_correct: boolean }[])
      .sort((a, b) => a.option_key.localeCompare(b.option_key))
      .map((o) => ({ key: o.option_key, text: o.option_text, correct: o.is_correct })),
  }));
}

/* ───────────── Cached full-subject loader (quiz + daily challenge) ───────────── */


async function fetchSubjectMCQs(subjectId: string): Promise<MCQ[]> {
  const out: MCQ[] = [];
  const pageSize = 1000;
  for (let page = 0; page < 10; page++) {
    const { data, error } = await supabase
      .from("questions")
      .select("id, chapter, topic, question_text, explanation, options(option_key, option_text, is_correct)")
      .eq("subject_id", subjectId)
      .eq("is_active", true)
      .order("chapter")
      .order("created_at")
      .range(page * pageSize, (page + 1) * pageSize - 1);
    if (error || !data?.length) break;
    for (const row of data) {
      const opts = ((row.options ?? []) as { option_key: string; option_text: string; is_correct: boolean }[])
        .sort((a, b) => a.option_key.localeCompare(b.option_key));
      const correct = opts.find((o) => o.is_correct);
      out.push({
        id: row.id as string,
        chapter: row.chapter as number,
        chapterTitle: row.topic as string,
        question: row.question_text as string,
        options: opts.map((o) => `${o.option_key}) ${o.option_text}`),
        correctAnswer: correct ? `${correct.option_key}) ${correct.option_text}` : "",
        explanation: (row.explanation as string) ?? "",
      });
    }
    if (data.length < pageSize) break;
  }
  return out;
}

/** All active MCQs of a subject, cached for an hour so quizzes don't re-download the bank on every visit. */
export const getSubjectMCQs = (subjectId: string) =>
  unstable_cache(() => fetchSubjectMCQs(subjectId), ["subject-mcqs", subjectId], {
    revalidate: 3600,
    tags: [`questions:${subjectId}`],
  })();

/* ───────────── Per-question pages (/[level]/[subject]/mcqs/[chapter]/[question]) ───────────── */

/** Length of the stable id suffix at the end of every question slug. */
export const QUESTION_HASH_LEN = 7;

/**
 * Short, stable, URL-safe id for a question: FNV-1a (32-bit) of the DB id in base36.
 * DB ids are heterogeneous (UUIDs, "c1q1", "acca-aa-c01-q001"…), so we hash rather than truncate.
 */
export function questionHash(id: string): string {
  let h = 0x811c9dc5;
  for (const b of new TextEncoder().encode(id)) {
    h ^= b;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36).padStart(QUESTION_HASH_LEN, "0");
}

const SLUG_STOPWORDS = new Set(
  ("a an the of to in on for by with at from and or as is are was were be been being which what who whom whose when " +
    "where why how this that these those it its into than then there their they following would should could will shall " +
    "may can does do did has have had not most best correct statement statements true false").split(" ")
);

/** Keyword slug from the question text (stopwords dropped, at most 8 words / ~50 chars) + the stable id hash. */
export function questionSlug(id: string, text: string): string {
  const words = text
    .slice(0, 400)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]s\b/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w && !SLUG_STOPWORDS.has(w) && (w.length > 1 || /\d/.test(w)));
  let kw = "";
  for (const w of words.slice(0, 8)) {
    if (kw && kw.length + 1 + w.length > 50) break;
    kw = kw ? `${kw}-${w}` : w;
  }
  return `${kw ? kw.slice(0, 50) : "question"}-${questionHash(id)}`;
}

/** Extracts the id hash from a question slug (whatever keywords precede it). */
export function parseQuestionSlug(slug: string): string | null {
  const m = new RegExp(`(?:^|-)([0-9a-z]{${QUESTION_HASH_LEN}})$`).exec(slug.toLowerCase());
  return m ? m[1] : null;
}

/** Chapter list cached for an hour: question pages regenerate independently and all need it. */
export const getChaptersCached = (subjectId: string) =>
  unstable_cache(() => getChapters(subjectId), ["bank-chapters", subjectId], {
    revalidate: 3600,
    tags: [`questions:${subjectId}`],
  })();

async function fetchChapterQuestionsOrdered(subjectId: string, chapter: number): Promise<BankQuestion[]> {
  const { data, error } = await supabase
    .from("questions")
    .select("id, question_text, explanation, options(option_key, option_text, is_correct)")
    .eq("subject_id", subjectId)
    .eq("chapter", chapter)
    .eq("is_active", true)
    .order("created_at")
    .order("id");
  // Throw rather than cache an empty chapter on a transient DB error
  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id as string,
    question: row.question_text as string,
    explanation: (row.explanation as string | null) ?? null,
    options: ((row.options ?? []) as { option_key: string; option_text: string; is_correct: boolean }[])
      .sort((a, b) => a.option_key.localeCompare(b.option_key))
      .map((o) => ({ key: o.option_key, text: o.option_text, correct: o.is_correct })),
  }));
}

/** A chapter's questions in a deterministic order (created_at, then id), cached for an hour. */
export const getChapterQuestionsCached = (subjectId: string, chapter: number) =>
  unstable_cache(() => fetchChapterQuestionsOrdered(subjectId, chapter), ["bank-chapter-questions", subjectId, String(chapter)], {
    revalidate: 3600,
    tags: [`questions:${subjectId}`],
  })();

export interface QuestionRef {
  id: string;
  subjectId: string;
  chapter: number;
  question: string;
}

/**
 * Every active question (id, subject, chapter, text) from a single query. PostgREST caps a
 * response at 1000 rows, so that one query's pages are fetched in parallel. Used by the sitemap.
 */
export async function getAllQuestionRefs(): Promise<QuestionRef[]> {
  const pageSize = 1000;
  const page = (n: number) =>
    supabase
      .from("questions")
      .select("id, subject_id, chapter, question_text", n === 0 ? { count: "exact" } : undefined)
      .eq("is_active", true)
      .not("chapter", "is", null)
      .order("id")
      .range(n * pageSize, (n + 1) * pageSize - 1);

  const first = await page(0);
  if (first.error) throw first.error;
  const pages = Math.ceil((first.count ?? 0) / pageSize);
  const rest = await Promise.all(Array.from({ length: Math.max(0, pages - 1) }, (_, i) => page(i + 1)));
  const rows = [first, ...rest].flatMap((r) => {
    if (r.error) throw r.error;
    return r.data ?? [];
  });

  return rows.map((r) => ({
    id: r.id as string,
    subjectId: r.subject_id as string,
    chapter: r.chapter as number,
    question: (r.question_text as string) ?? "",
  }));
}
