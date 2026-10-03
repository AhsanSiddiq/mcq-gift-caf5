/**
 * Import a global question bank (scripts/data/global/<subject>.json, see SPEC.md) into Supabase.
 *   NEXT_PUBLIC_SUPABASE_URL=… SUPABASE_SERVICE_KEY=… npx tsx scripts/import-global.ts acca-fa [--dry]
 * Idempotent: re-running replaces the subject's questions with the file's contents.
 */
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { allSubjects } from "../src/data/subjects";

type Q = {
  id: string;
  chapter: number;
  topic: string;
  question_text: string;
  options: Record<"A" | "B" | "C" | "D", string>;
  correct: "A" | "B" | "C" | "D";
  explanation: string;
  difficulty?: string;
};

const [subjectId, flag] = process.argv.slice(2);
const subject = allSubjects.find((s) => s.id === subjectId);
if (!subject) throw new Error(`Unknown subject ${subjectId}`);

const file = JSON.parse(readFileSync(`scripts/data/global/${subjectId}.json`, "utf8")) as { subject_id: string; questions: Q[] };
if (file.subject_id !== subjectId) throw new Error("subject_id mismatch");

// ── validate ──
const errors: string[] = [];
const ids = new Set<string>();
const topicByChapter = new Map<number, string>();
for (const q of file.questions) {
  if (ids.has(q.id)) errors.push(`duplicate id ${q.id}`);
  ids.add(q.id);
  if (!Number.isInteger(q.chapter) || q.chapter < 1) errors.push(`${q.id}: bad chapter`);
  const t = topicByChapter.get(q.chapter);
  if (t && t !== q.topic) errors.push(`${q.id}: topic differs within chapter ${q.chapter}`);
  topicByChapter.set(q.chapter, q.topic);
  for (const k of ["A", "B", "C", "D"] as const) if (!q.options?.[k]?.trim()) errors.push(`${q.id}: missing option ${k}`);
  if (!["A", "B", "C", "D"].includes(q.correct)) errors.push(`${q.id}: bad correct`);
  if (new Set(Object.values(q.options ?? {}).map((o) => o.trim().toLowerCase())).size !== 4) errors.push(`${q.id}: duplicate options`);
  if (!q.question_text?.trim() || !q.explanation?.trim()) errors.push(`${q.id}: empty text`);
}
const dist = file.questions.reduce<Record<string, number>>((m, q) => ((m[q.correct] = (m[q.correct] ?? 0) + 1), m), {});
console.log(`${subjectId}: ${file.questions.length} questions, ${topicByChapter.size} chapters, answer spread`, dist);
if (errors.length) {
  console.error(errors.slice(0, 30).join("\n"));
  throw new Error(`${errors.length} validation errors`);
}
if (flag === "--dry") process.exit(0);

// ── write ──
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

async function main() {
  const { data: existing } = await db.from("questions").select("id").eq("subject_id", subjectId);
  const oldIds = (existing ?? []).map((r) => r.id as string);
  for (let i = 0; i < oldIds.length; i += 200) {
    await db.from("options").delete().in("question_id", oldIds.slice(i, i + 200));
  }
  if (oldIds.length) await db.from("questions").delete().eq("subject_id", subjectId);

  const rows = file.questions.map((q) => ({
    id: q.id,
    subject_id: subjectId,
    level: subject!.level,
    topic: q.topic,
    chapter: q.chapter,
    question_text: q.question_text,
    explanation: q.explanation,
    difficulty: q.difficulty ?? "medium",
    source: "thecahub-original",
    is_active: true,
  }));
  for (let i = 0; i < rows.length; i += 200) {
    const { error } = await db.from("questions").insert(rows.slice(i, i + 200));
    if (error) throw error;
  }
  const opts = file.questions.flatMap((q) =>
    (["A", "B", "C", "D"] as const).map((k) => ({ question_id: q.id, option_key: k, option_text: q.options[k], is_correct: q.correct === k }))
  );
  for (let i = 0; i < opts.length; i += 500) {
    const { error } = await db.from("options").insert(opts.slice(i, i + 500));
    if (error) throw error;
  }
  console.log(`imported ${rows.length} questions / ${opts.length} options (replaced ${oldIds.length})`);
}
main().catch((e) => { console.error(e); process.exit(1); });
