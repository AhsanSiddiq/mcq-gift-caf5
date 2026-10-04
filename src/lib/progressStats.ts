import { localDay, type QuestionAttempt, type UserProgressData } from "@/hooks/useProgress";
import { allSubjects, subjectBody, subjectCode, type BodyId, type Subject } from "@/data/subjects";

/** Chapters need at least this many answers before we call them "weak". */
export const WEAK_MIN_ATTEMPTS = 5;
/** Below this accuracy a chapter is worth drilling. */
export const WEAK_THRESHOLD = 0.7;

export interface ChapterStat {
  subjectId: string;
  chapter: number;
  attempts: number;
  correct: number;
  questions: number;
  accuracy: number;
}

export interface SubjectStat {
  subject: Subject;
  href: string;
  questions: number;
  attempts: number;
  correct: number;
  accuracy: number;
  mistakes: number;
  flagged: number;
  lastAt: number;
  chapters: ChapterStat[];
}

export interface ProgressStats {
  questions: number;
  attempts: number;
  correct: number;
  accuracy: number;
  mistakes: number;
  flagged: number;
  subjects: SubjectStat[];
  weakest: ChapterStat[];
}

export const subjectHref = (s: Subject) => `/${s.level.toLowerCase()}/${s.id}`;
export const findSubject = (id: string) => allSubjects.find((s) => s.id === id);

/** CAF-4 and PRC-3 restart chapter numbering for their second part; mirror the topical page. */
export function chapterLabel(subjectId: string, ch: number): string {
  if (subjectId === "caf-4" && ch > 15) return `Company Law Ch ${ch - 15}`;
  if (subjectId === "prc-3" && ch > 8) return `Economics Ch ${ch - 8}`;
  return `Chapter ${ch}`;
}

export const chapterName = (subjectId: string, ch: number) => {
  const s = findSubject(subjectId);
  return `${s ? subjectCode(s) : subjectId.toUpperCase()} ${chapterLabel(subjectId, ch)}`;
};

/**
 * Aggregate the per-question history into dashboard numbers.
 * `flagSubjects` maps flagged ids to subjects (from the store, or looked up for old flags).
 */
export function computeStats(
  progress: UserProgressData,
  flagSubjects: Record<string, string>,
  /** Only count subjects that pass (e.g. one qualification). Omit for everything. */
  include?: (subjectId: string) => boolean,
): ProgressStats {
  const attempts = progress.attempts || {};
  const flags = progress.flaggedQuestionIds || [];
  const bySubject = new Map<string, SubjectStat & { chapterMap: Map<number, ChapterStat> }>();

  const ensure = (id: string) => {
    let s = bySubject.get(id);
    if (!s) {
      const subject = findSubject(id);
      if (!subject) return undefined;
      s = {
        subject, href: subjectHref(subject), questions: 0, attempts: 0, correct: 0, accuracy: 0,
        mistakes: 0, flagged: 0, lastAt: 0, chapters: [], chapterMap: new Map(),
      };
      bySubject.set(id, s);
    }
    return s;
  };

  for (const a of Object.values(attempts) as QuestionAttempt[]) {
    if (!a || !a.s || !a.a || (include && !include(a.s))) continue;
    const s = ensure(a.s);
    if (!s) continue;
    s.questions++;
    s.attempts += a.a;
    s.correct += a.k;
    if (a.l === 0) s.mistakes++;
    s.lastAt = Math.max(s.lastAt, a.t || 0);
    let ch = s.chapterMap.get(a.c);
    if (!ch) {
      ch = { subjectId: a.s, chapter: a.c, attempts: 0, correct: 0, questions: 0, accuracy: 0 };
      s.chapterMap.set(a.c, ch);
    }
    ch.questions++;
    ch.attempts += a.a;
    ch.correct += a.k;
  }

  let flaggedTotal = 0;
  for (const id of flags) {
    const sid = flagSubjects[id] || attempts[id]?.s;
    if (include && (!sid || !include(sid))) continue;
    flaggedTotal++;
    const s = sid ? ensure(sid) : undefined;
    if (s) s.flagged++;
  }

  const subjects: SubjectStat[] = [];
  const allChapters: ChapterStat[] = [];
  for (const s of bySubject.values()) {
    s.accuracy = s.attempts ? s.correct / s.attempts : 0;
    s.chapters = [...s.chapterMap.values()]
      .map((c) => ({ ...c, accuracy: c.attempts ? c.correct / c.attempts : 0 }))
      .sort((a, b) => a.chapter - b.chapter);
    allChapters.push(...s.chapters);
    const { chapterMap: _unused, ...plain } = s; // eslint-disable-line @typescript-eslint/no-unused-vars
    subjects.push(plain);
  }
  subjects.sort((a, b) => b.lastAt - a.lastAt || b.attempts - a.attempts);

  const weakest = allChapters
    .filter((c) => c.attempts >= WEAK_MIN_ATTEMPTS)
    .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts)
    .slice(0, 5);

  const totals = subjects.reduce(
    (t, s) => ({ q: t.q + s.questions, a: t.a + s.attempts, k: t.k + s.correct, m: t.m + s.mistakes }),
    { q: 0, a: 0, k: 0, m: 0 }
  );

  return {
    questions: totals.q,
    attempts: totals.a,
    correct: totals.k,
    accuracy: totals.a ? totals.k / totals.a : 0,
    mistakes: totals.m,
    flagged: flaggedTotal,
    subjects,
    weakest,
  };
}

/* ── Daily-challenge streaks (written by src/app/daily/DailyChallenge.tsx) ── */

export interface DailyStreak {
  body: string;
  current: number;
  best: number;
  playedToday: boolean;
  last?: string;
  /** Dates (YYYY-MM-DD, PKT) a challenge was completed. */
  days: string[];
}

export const dailyStoreKey = (body: string) => (body === "icap" ? "cah_daily_v1" : `cah_daily_v1_${body}`);
export const dailyHref = (body: string) => (body === "icap" ? "/daily" : `/daily/${body}`);

function prevDate(date: string): string {
  return new Date(Date.parse(date + "T00:00:00Z") - 86_400_000).toISOString().slice(0, 10);
}

/** A stored streak only counts as "current" if the last game was today or yesterday. */
export function readDailyStreak(body: string, today: string): DailyStreak | null {
  let raw: string | null = null;
  try { raw = localStorage.getItem(dailyStoreKey(body)); } catch { return null; }
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as { streak?: number; best?: number; last?: string; history?: Record<string, unknown> };
    const alive = s.last === today || s.last === prevDate(today);
    return {
      body,
      current: alive ? s.streak || 0 : 0,
      best: Math.max(s.best || 0, s.streak || 0),
      playedToday: s.last === today,
      last: s.last,
      days: Object.keys(s.history || {}),
    };
  } catch {
    return null;
  }
}

/* ── Qualification filter ── */

/** Exam body of a subject id ("icap", "acca", …), or undefined for unknown ids. */
export const bodyOfSubject = (subjectId: string): BodyId | undefined => {
  const s = findSubject(subjectId);
  return s ? subjectBody(s) : undefined;
};

/* ── Activity heatmap ── */

export interface HeatCell {
  day: string; // YYYY-MM-DD (local)
  count: number; // answers that day
  daily: boolean; // daily challenge played that day
  future: boolean;
}

/**
 * The last `weeks` weeks as columns of 7 days (Mon→Sun), ending with the current week.
 * `activity` is UserProgressData.activity; `dailyDays` are dates a daily challenge was played.
 */
export function buildHeatmap(
  activity: Record<string, Record<string, number>>,
  dailyDays: Set<string>,
  include: ((subjectId: string) => boolean) | undefined,
  weeks = 8,
  now = new Date(),
): HeatCell[][] {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const mondayOffset = (today.getDay() + 6) % 7; // 0 = Monday
  const start = new Date(today);
  start.setDate(today.getDate() - mondayOffset - (weeks - 1) * 7);
  const cols: HeatCell[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col: HeatCell[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      const key = localDay(date);
      const subs = activity[key] || {};
      const count = Object.entries(subs).reduce((n, [sid, c]) => n + (!include || include(sid) ? Number(c) || 0 : 0), 0);
      col.push({ day: key, count, daily: dailyDays.has(key), future: date > today });
    }
    cols.push(col);
  }
  return cols;
}
