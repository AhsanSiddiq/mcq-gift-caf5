import { subjectCode, type Subject } from "@/data/subjects";
import {
  getChapterQuestionsCached,
  getChaptersCached,
  getSubjectMCQs,
  parseQuestionSlug,
  questionHash,
  questionSlug,
  resolveSubject,
  type BankQuestion,
  type ChapterMeta,
} from "@/lib/questionBank";

export const BASE_URL = "https://www.thecahub.com";

export type QuestionParams = Promise<{ level: string; subject: string; chapter: string; question: string }>;

export interface ResolvedQuestion {
  s: Subject;
  code: string;
  chapters: ChapterMeta[];
  chapterIdx: number;
  meta: ChapterMeta;
  questions: BankQuestion[];
  idx: number;
  q: BankQuestion;
  /** Subject base path, e.g. /caf/caf-5 */
  base: string;
  /** Canonical path of this question page */
  path: string;
  /** True when the requested URL already is the canonical one */
  isCanonical: boolean;
}

export const questionPath = (base: string, chapterSlug: string, q: Pick<BankQuestion, "id" | "question">) =>
  `${base}/mcqs/${chapterSlug}/${questionSlug(q.id, q.question)}`;

/**
 * Finds a question by the id hash at the end of its slug. The keyword part of the slug and the
 * chapter segment are not trusted: a mismatch (or a question that moved chapter) still resolves,
 * with isCanonical=false so the caller can 308 to the canonical URL.
 */
export async function resolveQuestion(params: QuestionParams): Promise<ResolvedQuestion | null> {
  const { level, subject, chapter, question } = await params;
  const s = resolveSubject(level, subject);
  const hash = parseQuestionSlug(question);
  if (!s || !hash) return null;

  const chapters = await getChaptersCached(s.id);
  const requestedNum = Number(/^chapter-(\d+)/.exec(chapter)?.[1]);
  let chapterIdx = chapters.findIndex((c) => c.chapter === requestedNum);
  let questions = chapterIdx >= 0 ? await getChapterQuestionsCached(s.id, chapters[chapterIdx].chapter) : [];
  let idx = questions.findIndex((q) => questionHash(q.id) === hash);

  if (idx === -1) {
    // Wrong/old chapter in the URL: look the hash up across the whole subject
    const hit = (await getSubjectMCQs(s.id)).find((q) => questionHash(q.id) === hash);
    if (!hit) return null;
    chapterIdx = chapters.findIndex((c) => c.chapter === hit.chapter);
    if (chapterIdx === -1) return null;
    questions = await getChapterQuestionsCached(s.id, hit.chapter);
    idx = questions.findIndex((q) => q.id === hit.id);
    if (idx === -1) return null;
  }

  const meta = chapters[chapterIdx];
  const q = questions[idx];
  const base = `/${s.level.toLowerCase()}/${s.id}`;
  const path = questionPath(base, meta.slug, q);
  return {
    s,
    code: subjectCode(s),
    chapters,
    chapterIdx,
    meta,
    questions,
    idx,
    q,
    base,
    path,
    isCanonical: `/${level}/${subject}/mcqs/${chapter}/${question}` === path,
  };
}

/** Trims to at most `max` chars on a word boundary, adding an ellipsis when cut. */
export function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > max * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,;:.–-]+$/, "")}…`;
}
