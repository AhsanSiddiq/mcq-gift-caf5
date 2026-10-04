/**
 * Smart Study Planner: pure scheduling logic (no React, no DOM, no Date.now()).
 *
 * Given chapters (question count = syllabus weight), a confidence score per chapter, daily study
 * hours and an exam date, `buildPlan` lays out a day-by-day plan:
 *   1. Learn phase (first ~85% of study days): every chapter gets first-pass study time in
 *      proportion to its weight, with spaced review passes (+1, +4, +11 days) slotted in ahead of
 *      new material on the day they fall due.
 *   2. Final phase (last ~15% of study days): timed mocks alternating with revision of the
 *      heaviest / least-confident chapters. The last day before the exam is light revision only.
 *
 * Dates are plain "YYYY-MM-DD" strings handled in UTC arithmetic, so the output is identical in
 * every time zone and deterministic for the same input (block ids are stable for localStorage).
 */

export type Confidence = 1 | 2 | 3 | 4 | 5;

export interface PlannerChapter {
  subjectId: string;
  chapter: number;
  topic: string;
  slug: string;
  /** Active question count, used as a proxy for syllabus weight. */
  count: number;
  /** 1 = weak, 3 = neutral (default), 5 = strong. */
  confidence?: number;
}

export interface PlannerInput {
  /** First day of the plan (usually today), YYYY-MM-DD. */
  startDate: string;
  /** Exam day, YYYY-MM-DD. No study is scheduled on it. */
  examDate: string;
  weekdayHours: number;
  weekendHours: number;
  /** Weekdays with no study, 0 = Sunday … 6 = Saturday. */
  daysOff?: number[];
  chapters: PlannerChapter[];
  /** Share of study days reserved for mocks and revision. Default 0.15. */
  finalShare?: number;
}

export type BlockKind = "learn" | "review" | "mock" | "revise";

export interface PlanBlock {
  id: string;
  kind: BlockKind;
  subjectId: string;
  minutes: number;
  chapter?: number;
  topic?: string;
  slug?: string;
  /** learn: which part of a chapter split over several days (1-based); review: which pass. */
  part?: number;
  /** learn: total number of parts for the chapter. */
  parts?: number;
}

export type DayPhase = "learn" | "final" | "off" | "exam";

export interface PlanDay {
  date: string;
  /** 0 = Sunday … 6 = Saturday. */
  weekday: number;
  phase: DayPhase;
  capacity: number;
  blocks: PlanBlock[];
}

export interface Plan {
  startDate: string;
  examDate: string;
  days: PlanDay[];
  totals: {
    calendarDays: number;
    studyDays: number;
    learnDays: number;
    finalDays: number;
    studyMinutes: number;
    learnMinutes: number;
    reviewMinutes: number;
    reviseMinutes: number;
    mocks: number;
    chapters: number;
  };
  /** Per chapter (key `${subjectId}:${chapter}`): first-pass minutes allocated. */
  allocation: Record<string, number>;
  warnings: string[];
}

/* ───────────── Date helpers (UTC, string in / string out) ───────────── */

const DAY_MS = 86_400_000;
const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseISODate(s: string): number {
  const m = ISO_RE.exec(s);
  if (!m) throw new Error(`Invalid date "${s}" (expected YYYY-MM-DD)`);
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

export function formatISODate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export function addDays(iso: string, n: number): string {
  return formatISODate(parseISODate(iso) + n * DAY_MS);
}

export function daysBetween(fromISO: string, toISO: string): number {
  return Math.round((parseISODate(toISO) - parseISODate(fromISO)) / DAY_MS);
}

export function weekdayOf(iso: string): number {
  return new Date(parseISODate(iso)).getUTCDay();
}

/** Local calendar date of a JS Date as YYYY-MM-DD (for "today" in the browser). */
export function localISODate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/* ───────────── Weights ───────────── */

const CONFIDENCE_FACTOR: Record<Confidence, number> = { 1: 1.6, 2: 1.3, 3: 1, 4: 0.8, 5: 0.6 };

export function clampConfidence(c: number | undefined): Confidence {
  const n = Math.round(Number.isFinite(c) ? (c as number) : 3);
  return Math.min(5, Math.max(1, n)) as Confidence;
}

/** Syllabus weight: question count (floored so tiny chapters still get time) × confidence factor. */
export function chapterWeight(c: PlannerChapter): number {
  return Math.max(5, c.count) * CONFIDENCE_FACTOR[clampConfidence(c.confidence)];
}

export const chapterKey = (c: Pick<PlannerChapter, "subjectId" | "chapter">) => `${c.subjectId}:${c.chapter}`;

const round5 = (n: number) => Math.max(5, Math.round(n / 5) * 5);

/* ───────────── Scheduling ───────────── */

/** Spaced-repetition offsets (calendar days after a chapter's first pass) and review sizes. */
const REVIEW_OFFSETS = [1, 4, 11];
const REVIEW_SHARE = [0.2, 0.15, 0.12];
const MIN_LEARN = 15;
const MIN_SLOT = 15;
const MOCK_MINUTES = 120;
/** Most first-pass minutes one chapter gets in a single day. */
const MAX_CHUNK = 120;

/**
 * Interleaves chapters of several papers so each paper progresses at a similar pace: always pick
 * the paper with the smallest share of its weight already queued (stable on ties).
 */
function interleave(chapters: PlannerChapter[]): PlannerChapter[] {
  const bySubject = new Map<string, PlannerChapter[]>();
  for (const c of chapters) {
    const list = bySubject.get(c.subjectId) ?? [];
    list.push(c);
    bySubject.set(c.subjectId, list);
  }
  const queues = [...bySubject.entries()].map(([id, list]) => ({
    id,
    list: [...list].sort((a, b) => a.chapter - b.chapter),
    total: list.reduce((s, c) => s + chapterWeight(c), 0),
    done: 0,
    i: 0,
  }));
  const out: PlannerChapter[] = [];
  while (out.length < chapters.length) {
    let best = -1;
    for (let q = 0; q < queues.length; q++) {
      if (queues[q].i >= queues[q].list.length) continue;
      if (best === -1 || queues[q].done / queues[q].total < queues[best].done / queues[best].total - 1e-9) best = q;
    }
    const q = queues[best];
    const c = q.list[q.i++];
    q.done += chapterWeight(c);
    out.push(c);
  }
  return out;
}

interface SimResult {
  learnBlocks: Map<number, PlanBlock[]>; // learn-day index -> blocks
  unfinished: number; // chapters whose first pass didn't complete
  learnMinutes: Map<string, number>;
}

/** Simulates the learn phase for a given learn-time budget factor. */
function simulateLearn(
  learnDays: { date: string; capacity: number }[],
  ordered: PlannerChapter[],
  totalWeight: number,
  budget: number,
): SimResult {
  const alloc = new Map<string, number>();
  for (const c of ordered) alloc.set(chapterKey(c), Math.max(MIN_LEARN, round5((budget * chapterWeight(c)) / totalWeight)));

  type Review = { due: string; c: PlannerChapter; pass: number; minutes: number };
  const reviews: Review[] = [];
  const blocks = new Map<number, PlanBlock[]>();
  // Chapters whose first pass has started but not finished, oldest first.
  type Active = { c: PlannerChapter; remaining: number; part: number };
  const active: Active[] = [];
  let ci = 0; // next chapter not yet started
  let finished = 0;
  const lastDate = learnDays.length ? learnDays[learnDays.length - 1].date : "";
  const pending = () => active.length > 0 || ci < ordered.length;

  for (let d = 0; d < learnDays.length; d++) {
    const { date, capacity } = learnDays[d];
    let free = capacity;
    const today: PlanBlock[] = [];

    // 1) Due reviews first (oldest due first); ones that don't fit roll to the next day.
    reviews.sort((a, b) => a.due.localeCompare(b.due) || a.pass - b.pass);
    for (let r = 0; r < reviews.length; ) {
      const rv = reviews[r];
      if (rv.due > date) break;
      // Never let reviews eat the whole day while new chapters are still waiting.
      const reserve = pending() ? Math.min(MIN_SLOT, Math.floor(capacity / 2)) : 0;
      if (rv.minutes <= free - reserve) {
        today.push({ id: "", kind: "review", subjectId: rv.c.subjectId, chapter: rv.c.chapter, topic: rv.c.topic, slug: rv.c.slug, minutes: rv.minutes, part: rv.pass });
        free -= rv.minutes;
        reviews.splice(r, 1);
      } else r++;
    }

    // 2) New material: continue started chapters, then open new ones. A chapter gets at most
    //    MAX_CHUNK minutes a day, so long days mix chapters instead of one 4-hour slog.
    const touched = new Set<Active>();
    for (;;) {
      let a = active.find((x) => !touched.has(x));
      if (!a && ci < ordered.length) {
        const next = ordered[ci++];
        a = { c: next, remaining: alloc.get(chapterKey(next))!, part: 1 };
        active.push(a);
      }
      if (!a || free < Math.min(MIN_SLOT, a.remaining)) break;
      touched.add(a);
      const take = Math.min(free, a.remaining, MAX_CHUNK);
      const { c } = a;
      today.push({ id: "", kind: "learn", subjectId: c.subjectId, chapter: c.chapter, topic: c.topic, slug: c.slug, minutes: take, part: a.part++ });
      free -= take;
      a.remaining -= take;
      if (a.remaining <= 0) {
        active.splice(active.indexOf(a), 1);
        finished++;
        // First pass done: queue spaced reviews that still fall inside the learn phase.
        const total = alloc.get(chapterKey(c))!;
        REVIEW_OFFSETS.forEach((off, k) => {
          const due = addDays(date, off);
          if (due <= lastDate) reviews.push({ due, c, pass: k + 1, minutes: Math.max(10, Math.min(45, round5(total * REVIEW_SHARE[k]))) });
        });
      }
    }
    if (today.length) blocks.set(d, today);
  }

  return { learnBlocks: blocks, unfinished: ordered.length - finished, learnMinutes: alloc };
}

export function buildPlan(input: PlannerInput): Plan {
  const { startDate, examDate } = input;
  const calendarDays = daysBetween(startDate, examDate);
  const warnings: string[] = [];
  const off = new Set(input.daysOff ?? []);
  const hoursToMin = (h: number) => Math.max(0, Math.round((Number.isFinite(h) ? h : 0) * 60));
  const chapters = input.chapters;

  // Calendar skeleton: start … exam - 1, then the exam day itself.
  const days: PlanDay[] = [];
  for (let i = 0; i < Math.max(0, calendarDays); i++) {
    const date = addDays(startDate, i);
    const weekday = weekdayOf(date);
    const capacity = off.has(weekday) ? 0 : hoursToMin(weekday === 0 || weekday === 6 ? input.weekendHours : input.weekdayHours);
    days.push({ date, weekday, phase: capacity > 0 ? "learn" : "off", capacity, blocks: [] });
  }
  if (calendarDays >= 0) days.push({ date: examDate, weekday: weekdayOf(examDate), phase: "exam", capacity: 0, blocks: [] });

  const study = days.filter((d) => d.phase === "learn");
  const finalShare = input.finalShare ?? 0.15;
  const finalCount = study.length >= 2 ? Math.min(study.length - 1, Math.max(1, Math.round(study.length * finalShare))) : 0;
  const learnDays = study.slice(0, study.length - finalCount);
  const finalDays = study.slice(study.length - finalCount);
  finalDays.forEach((d) => (d.phase = "final"));

  if (calendarDays <= 0) warnings.push("Your exam date needs to be after the start date.");
  else if (!study.length) warnings.push("No study time available: add some hours or remove a day off.");
  if (!chapters.length) warnings.push("Pick at least one paper with chapters to plan.");

  const totalWeight = chapters.reduce((s, c) => s + chapterWeight(c), 0);
  const ordered = interleave(chapters);
  const learnCapacity = learnDays.reduce((s, d) => s + d.capacity, 0);

  // Largest first-pass budget that still lets every chapter finish inside the learn phase.
  let sim: SimResult | null = null;
  if (ordered.length && learnDays.length) {
    let lo = 0;
    let hi = learnCapacity;
    let best = simulateLearn(learnDays, ordered, totalWeight, 0);
    if (best.unfinished === 0) {
      for (let it = 0; it < 24 && hi - lo > 5; it++) {
        const mid = (lo + hi) / 2;
        const r = simulateLearn(learnDays, ordered, totalWeight, mid);
        if (r.unfinished === 0) {
          best = r;
          lo = mid;
        } else hi = mid;
      }
    } else {
      warnings.push(
        `Not enough time to cover all ${ordered.length} chapters before the exam: ${best.unfinished} won't get a first pass. Add study hours or drop a paper.`,
      );
    }
    sim = best;
    for (const [d, blocks] of sim.learnBlocks) learnDays[d].blocks = blocks;
  } else if (ordered.length && study.length && !learnDays.length) {
    warnings.push("Too close to the exam for a full first pass: the plan is revision only.");
  }

  // Final phase: mocks alternate with revision of the heaviest / weakest chapters.
  const subjects = [...new Set(ordered.map((c) => c.subjectId))];
  const revisionOrder = [...chapters].sort((a, b) => chapterWeight(b) - chapterWeight(a) || a.subjectId.localeCompare(b.subjectId) || a.chapter - b.chapter);
  let rv = 0;
  let mockTurn = 0;
  finalDays.forEach((day, i) => {
    const last = i === finalDays.length - 1;
    let free = day.capacity;
    if (!last && i % 2 === 0 && subjects.length && free >= 60) {
      const minutes = Math.min(free, MOCK_MINUTES);
      day.blocks.push({ id: "", kind: "mock", subjectId: subjects[mockTurn++ % subjects.length], minutes });
      free -= minutes;
    }
    const slot = last ? 30 : day.capacity > 120 ? 45 : 30;
    let guard = 0;
    while (revisionOrder.length && free >= MIN_SLOT && guard++ < revisionOrder.length) {
      const c = revisionOrder[rv++ % revisionOrder.length];
      const minutes = Math.min(free, slot);
      day.blocks.push({ id: "", kind: "revise", subjectId: c.subjectId, chapter: c.chapter, topic: c.topic, slug: c.slug, minutes });
      free -= minutes;
    }
  });

  // Stable ids + learn-part totals.
  const partsByChapter = new Map<string, number>();
  for (const d of days) for (const b of d.blocks) if (b.kind === "learn") partsByChapter.set(`${b.subjectId}:${b.chapter}`, (partsByChapter.get(`${b.subjectId}:${b.chapter}`) ?? 0) + 1);
  for (const d of days)
    d.blocks.forEach((b, i) => {
      b.id = `${d.date}-${i}-${b.kind}-${b.subjectId}${b.chapter != null ? `-${b.chapter}` : ""}`;
      if (b.kind === "learn") b.parts = partsByChapter.get(`${b.subjectId}:${b.chapter}`);
    });

  const sum = (k: BlockKind) => days.reduce((s, d) => s + d.blocks.filter((b) => b.kind === k).reduce((t, b) => t + b.minutes, 0), 0);
  const learnMinutes = sum("learn");
  const reviewMinutes = sum("review");
  const reviseMinutes = sum("revise");
  const mockBlocks = days.flatMap((d) => d.blocks.filter((b) => b.kind === "mock"));

  return {
    startDate,
    examDate,
    days,
    totals: {
      calendarDays: Math.max(0, calendarDays),
      studyDays: study.length,
      learnDays: learnDays.length,
      finalDays: finalDays.length,
      studyMinutes: learnMinutes + reviewMinutes + reviseMinutes + mockBlocks.reduce((s, b) => s + b.minutes, 0),
      learnMinutes,
      reviewMinutes,
      reviseMinutes,
      mocks: mockBlocks.length,
      chapters: chapters.length,
    },
    allocation: Object.fromEntries(sim ? sim.learnMinutes : []),
    warnings,
  };
}

/* ───────────── Calendar export (.ics) ───────────── */

function icsEscape(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/([,;])/g, "\\$1");
}

/** RFC 5545 line folding: lines longer than 75 octets continue on the next line after a space. */
function icsFold(line: string): string {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 75) return line;
  const out: string[] = [];
  let cur = "";
  let curLen = 0;
  for (const ch of line) {
    const len = enc.encode(ch).length;
    const limit = out.length ? 74 : 75; // continuation lines start with a space
    if (curLen + len > limit) {
      out.push(cur);
      cur = "";
      curLen = 0;
    }
    cur += ch;
    curLen += len;
  }
  out.push(cur);
  return out.join("\r\n ");
}

export interface IcsOptions {
  /** Used in the calendar name and exam event, e.g. "ACCA FA". */
  title: string;
  /** Short label for a block, e.g. "FA Ch 3: Double entry (45m)". */
  label: (b: PlanBlock) => string;
  /** Absolute practice URL for a block, if any. */
  url?: (b: PlanBlock) => string | undefined;
  /** DTSTAMP, as an ISO timestamp (pass new Date().toISOString()). */
  stamp: string;
  /** Page to link back to. */
  homeUrl?: string;
}

/** One all-day event per study day (with every block listed) plus the exam day. */
export function buildICS(plan: Plan, opts: IcsOptions): string {
  const stamp = opts.stamp.replace(/[-:]/g, "").replace(/\.\d+/, "").replace(/Z?$/, "Z");
  const ymd = (iso: string) => iso.replace(/-/g, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The CA Hub//Smart Study Planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${icsEscape(`${opts.title} study plan`)}`,
  ];
  for (const d of plan.days) {
    if (d.phase === "exam") {
      lines.push(
        "BEGIN:VEVENT",
        `UID:exam-${ymd(d.date)}@thecahub.com`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${ymd(d.date)}`,
        `DTEND;VALUE=DATE:${ymd(addDays(d.date, 1))}`,
        `SUMMARY:${icsEscape(`EXAM DAY: ${opts.title}`)}`,
        `DESCRIPTION:${icsEscape("You've got this. Sleep well, eat breakfast, arrive early.")}`,
        "END:VEVENT",
      );
      continue;
    }
    if (!d.blocks.length) continue;
    const mins = d.blocks.reduce((s, b) => s + b.minutes, 0);
    const head = d.phase === "final" ? (d.blocks.some((b) => b.kind === "mock") ? "Mock + revision" : "Revision") : "Study";
    const desc = d.blocks
      .map((b) => {
        const u = opts.url?.(b);
        return `• ${opts.label(b)}${u ? `\n  ${u}` : ""}`;
      })
      .join("\n");
    lines.push(
      "BEGIN:VEVENT",
      `UID:study-${ymd(d.date)}-${plan.examDate}@thecahub.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${ymd(d.date)}`,
      `DTEND;VALUE=DATE:${ymd(addDays(d.date, 1))}`,
      `SUMMARY:${icsEscape(`${head}: ${opts.title} (${formatMinutes(mins)})`)}`,
      `DESCRIPTION:${icsEscape(desc + (opts.homeUrl ? `\n\nYour plan: ${opts.homeUrl}` : ""))}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(icsFold).join("\r\n") + "\r\n";
}

export function formatMinutes(m: number): string {
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h ? (r ? `${h}h ${r}m` : `${h}h`) : `${r}m`;
}
