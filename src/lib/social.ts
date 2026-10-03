import { getSubjectMCQs } from "@/lib/questionBank";
import { dailyBodies, dailyNumber, dailySubject, liveSubjectsFor, seededPick, todayPKT } from "@/lib/daily";
import { getBody } from "@/data/regions";
import { subjectCode, type BodyId } from "@/data/subjects";
import type { MCQ } from "@/data/mcqs";

/**
 * Builds the daily social posts: one "question of the day" per exam body, picked from a
 * different paper than today's Daily Challenge so the post teases rather than spoils it.
 */

const SITE = "https://www.thecahub.com";
// Keep questions short enough to read on a phone-sized image card
const Q_MAX = 280;
const OPTION_MAX = 90;

export interface SocialPost {
  body: BodyId;
  bodyName: string;
  subjectCode: string;
  label: string; // "ICAP PRC-1", "ACCA PM" — body + paper without repeating the body
  subjectTitle: string;
  question: string;
  options: string[]; // without the "A) " prefix
  correctIndex: number;
  explanation: string;
  bankUrl: string;
  dailyUrl: string;
}

const strip = (o: string) => o.replace(/^[A-D]\)\s*/, "").trim();

function fitsCard(q: MCQ) {
  return q.question.length <= Q_MAX && q.options.length === 4 && q.options.every((o) => strip(o).length <= OPTION_MAX);
}

export async function buildPost(body: BodyId, date = todayPKT()): Promise<SocialPost | null> {
  const live = liveSubjectsFor(body);
  if (live.length === 0) return null;
  const today = dailySubject(date, body);
  const others = live.filter((s) => s.id !== today.id);
  const subject = seededPick(others.length ? others : live, 1, `social:${date}:${body}`)[0];
  const pool = await getSubjectMCQs(subject.id);
  const q = seededPick(pool.filter(fitsCard), 1, `social-q:${date}:${body}`)[0];
  if (!q) return null;
  const b = getBody(body);
  const bodyName = b?.short ?? body.toUpperCase();
  const code = subjectCode(subject);
  return {
    body,
    bodyName,
    subjectCode: code,
    label: code.toUpperCase().startsWith(bodyName.toUpperCase()) ? code : `${bodyName} ${code}`,
    subjectTitle: subject.title,
    question: q.question,
    options: q.options.map(strip),
    correctIndex: Math.max(0, q.options.indexOf(q.correctAnswer)),
    explanation: q.explanation,
    bankUrl: `${SITE}/${subject.level}/${subject.id}/mcqs`,
    dailyUrl: `${SITE}/daily${body === "icap" ? "" : `/${body}`}`,
  };
}

/** Which bodies to post today: ICAP (home market) every day, plus one rotating global body. */
export function bodiesForToday(date = todayPKT()): BodyId[] {
  const global = dailyBodies().filter((b) => b !== "icap");
  const pick = global.length ? global[dailyNumber(date) % global.length] : undefined;
  return ["icap" as BodyId, ...(pick ? [pick] : [])];
}

export function hashtags(p: SocialPost) {
  return `#${p.bodyName.replace(/[^A-Za-z0-9]/g, "")} #${p.subjectCode.replace(/[^A-Za-z0-9]/g, "")} #MCQ #Accounting #ExamPrep`;
}

/** Long-form text for Facebook / LinkedIn / X threads (answer withheld to drive clicks and comments). */
export function postText(p: SocialPost) {
  const letters = "ABCDEFGHIJ";
  return [
    `🧠 ${p.label} — Question of the Day`,
    "",
    p.question,
    "",
    ...p.options.map((o, i) => `${letters[i]}) ${o}`),
    "",
    "Comment your answer 👇 — the explanation is in the first comment.",
    "",
    `📚 Free ${p.subjectCode} question bank: ${p.bankUrl}`,
    `🔥 Today's 10-question Daily Challenge: ${p.dailyUrl}`,
    "",
    hashtags(p),
  ].join("\n");
}

export function answerText(p: SocialPost) {
  const letters = "ABCDEFGHIJ";
  return `✅ Answer: ${letters[p.correctIndex]}) ${p.options[p.correctIndex]}\n\n${p.explanation}\n\nPractise more: ${p.bankUrl}`;
}

/** Instagram captions can't hold clickable links, so point to the bio link instead. */
export function instagramCaption(p: SocialPost) {
  return [
    `🧠 ${p.label} — Question of the Day`,
    "",
    "Comment A, B, C or D 👇 — answer + explanation in the comments.",
    "",
    `Free ${p.bodyName} MCQ banks, timed mocks and a daily 10-question challenge — link in bio.`,
    "",
    `${hashtags(p)} #CAStudents #StudyGram`,
  ].join("\n");
}
