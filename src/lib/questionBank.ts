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
  return s && s.level.toLowerCase() === level.toLowerCase() ? s : undefined;
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
