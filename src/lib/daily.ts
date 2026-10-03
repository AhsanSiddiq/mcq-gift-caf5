import { allSubjects, subjectBody, type BodyId } from "@/data/subjects";

/** Daily challenge #1 was 2026-10-01 (Pakistan time). */
const EPOCH = Date.UTC(2026, 9, 1);
export const DAILY_SIZE = 10;

/** Today's date in Pakistan (where most players are), as YYYY-MM-DD. */
export function todayPKT(now = new Date()): string {
  return new Date(now.getTime() + 5 * 3600_000).toISOString().slice(0, 10);
}

export function dailyNumber(date: string): number {
  return Math.floor((Date.parse(date + "T00:00:00Z") - EPOCH) / 86_400_000) + 1;
}

export function liveSubjectsFor(body: BodyId) {
  return allSubjects.filter((s) => s.isAvailable && subjectBody(s) === body);
}

/** Bodies with at least one live subject (each gets its own daily puzzle). */
export function dailyBodies(): BodyId[] {
  return Array.from(new Set(allSubjects.filter((s) => s.isAvailable).map(subjectBody)));
}

/** Rotate through the body's live subjects, one per day — one shared puzzle per audience. */
export function dailySubject(date: string, body: BodyId = "icap") {
  const live = liveSubjectsFor(body);
  const n = dailyNumber(date);
  return live[((n % live.length) + live.length) % live.length];
}

/** Deterministic seeded pick so everyone gets the same questions on the same day. */
export function seededPick<T>(items: T[], count: number, seed: string): T[] {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, count);
}
