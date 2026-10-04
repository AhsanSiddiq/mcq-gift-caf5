/**
 * Assert tests for the study-planner algorithm (src/lib/planner.ts).
 * Run: npx tsx scripts/test-planner.ts
 */
import assert from "node:assert/strict";
import { addDays, buildICS, buildPlan, chapterKey, daysBetween, formatMinutes, weekdayOf, type PlannerChapter } from "../src/lib/planner";

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ok  ${name}`);
}

const ch = (subjectId: string, chapter: number, count: number, confidence?: number): PlannerChapter => ({
  subjectId,
  chapter,
  topic: `Topic ${chapter}`,
  slug: `chapter-${chapter}-topic-${chapter}`,
  count,
  confidence,
});

const fa = [ch("acca-fa", 1, 40), ch("acca-fa", 2, 120), ch("acca-fa", 3, 60), ch("acca-fa", 4, 80), ch("acca-fa", 5, 20)];
const base = { startDate: "2026-10-05", examDate: "2026-12-04", weekdayHours: 2, weekendHours: 4, chapters: fa };

test("date helpers", () => {
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(daysBetween("2026-10-05", "2026-12-04"), 60);
  assert.equal(weekdayOf("2026-10-04"), 0); // Sunday
  assert.equal(formatMinutes(135), "2h 15m");
  assert.equal(formatMinutes(45), "45m");
});

const plan = buildPlan(base);

test("calendar covers start to exam day", () => {
  assert.equal(plan.days.length, 61);
  assert.equal(plan.days[0].date, "2026-10-05");
  assert.equal(plan.days.at(-1)!.date, "2026-12-04");
  assert.equal(plan.days.at(-1)!.phase, "exam");
  assert.equal(plan.days.at(-1)!.blocks.length, 0);
  assert.deepEqual(plan.warnings, []);
});

test("no day exceeds its capacity", () => {
  for (const d of plan.days) assert.ok(d.blocks.reduce((s, b) => s + b.minutes, 0) <= d.capacity, d.date);
});

test("every chapter gets a complete first pass, in the learn phase", () => {
  for (const c of fa) {
    const learn = plan.days.flatMap((d) =>
      d.blocks.filter((b) => b.kind === "learn" && b.chapter === c.chapter).map((b) => ({ ...b, phase: d.phase })),
    );
    assert.ok(learn.length > 0, `chapter ${c.chapter} scheduled`);
    assert.ok(learn.every((b) => b.phase === "learn"));
    assert.equal(learn.reduce((s, b) => s + b.minutes, 0), plan.allocation[chapterKey(c)]);
    assert.ok(learn.every((b) => b.parts === learn.length));
  }
});

test("time is allocated by weight (question count)", () => {
  const a = (n: number) => plan.allocation[`acca-fa:${n}`];
  assert.ok(a(2) > a(4) && a(4) > a(3) && a(3) > a(1) && a(1) > a(5), JSON.stringify(plan.allocation));
});

test("low confidence earns more time than high confidence", () => {
  const p = buildPlan({ ...base, chapters: [ch("x", 1, 50, 1), ch("x", 2, 50, 3), ch("x", 3, 50, 5)] });
  assert.ok(p.allocation["x:1"] > p.allocation["x:2"] && p.allocation["x:2"] > p.allocation["x:3"], JSON.stringify(p.allocation));
});

test("the plan uses most of the available learn-phase time", () => {
  const learnCap = plan.days.filter((d) => d.phase === "learn").reduce((s, d) => s + d.capacity, 0);
  const used = plan.totals.learnMinutes + plan.totals.reviewMinutes;
  assert.ok(used / learnCap > 0.85, `${used}/${learnCap}`);
});

test("final ~15% of study days are mocks + revision only", () => {
  const study = plan.days.filter((d) => d.phase === "learn" || d.phase === "final");
  const final = plan.days.filter((d) => d.phase === "final");
  assert.equal(final.length, Math.round(study.length * 0.15));
  assert.ok(final.every((d) => d.blocks.every((b) => b.kind === "mock" || b.kind === "revise")));
  assert.ok(plan.totals.mocks >= 2);
  // phases are contiguous: all learn days come before all final days
  const lastLearn = plan.days.map((d) => d.phase).lastIndexOf("learn");
  const firstFinal = plan.days.findIndex((d) => d.phase === "final");
  assert.ok(lastLearn < firstFinal);
  // the day before the exam is light: no mock
  assert.ok(final.at(-1)!.blocks.every((b) => b.kind === "revise"));
});

test("spaced reviews come after the chapter's first pass", () => {
  const reviews = plan.days.flatMap((d) => d.blocks.filter((b) => b.kind === "review").map((b) => ({ b, date: d.date })));
  assert.ok(reviews.length >= fa.length, "reviews are scheduled");
  for (const { b, date } of reviews) {
    const lastLearn = plan.days.filter((d) => d.blocks.some((x) => x.kind === "learn" && x.chapter === b.chapter)).at(-1)!.date;
    assert.ok(daysBetween(lastLearn, date) >= 1, `review of ch ${b.chapter} on ${date} after ${lastLearn}`);
  }
});

test("realistic paper (20 chapters): most chapters get 2+ spaced reviews", () => {
  const chapters = Array.from({ length: 20 }, (_, i) => ch("acca-fr", i + 1, 20 + ((i * 37) % 60)));
  const p = buildPlan({ ...base, chapters });
  const passes = new Map<number, number>();
  for (const d of p.days) for (const b of d.blocks) if (b.kind === "review") passes.set(b.chapter!, (passes.get(b.chapter!) ?? 0) + 1);
  const twoPlus = [...passes.values()].filter((n) => n >= 2).length;
  assert.ok(twoPlus >= 15, `only ${twoPlus}/20 chapters have 2+ reviews`);
  assert.deepEqual(p.warnings, []);
});

test("days off get no study", () => {
  const p = buildPlan({ ...base, daysOff: [5] }); // Fridays
  for (const d of p.days.filter((x) => x.weekday === 5 && x.phase !== "exam")) {
    assert.equal(d.blocks.length, 0);
    assert.equal(d.phase, "off");
  }
});

test("no chapter gets more than 2h of first-pass study in one day", () => {
  for (const d of plan.days) {
    const per = new Map<number, number>();
    for (const b of d.blocks) if (b.kind === "learn") per.set(b.chapter!, (per.get(b.chapter!) ?? 0) + b.minutes);
    for (const [c, m] of per) assert.ok(m <= 120, `${d.date} ch ${c}: ${m}m`);
  }
  const sat = plan.days.find((d) => d.weekday === 6 && d.phase === "learn")!;
  assert.ok(new Set(sat.blocks.map((b) => b.chapter)).size >= 2, "a 4h weekend mixes chapters");
});

test("weekend hours apply on Sat/Sun", () => {
  const sat = plan.days.find((d) => d.weekday === 6)!;
  const mon = plan.days.find((d) => d.weekday === 1)!;
  assert.equal(sat.capacity, 240);
  assert.equal(mon.capacity, 120);
});

test("several papers are interleaved, not studied back to back", () => {
  const ma = [ch("acca-ma", 1, 60), ch("acca-ma", 2, 60), ch("acca-ma", 3, 60)];
  const p = buildPlan({ ...base, chapters: [...fa, ...ma] });
  const learnOrder = p.days.flatMap((d) => d.blocks).filter((b) => b.kind === "learn").map((b) => b.subjectId);
  const firstMa = learnOrder.indexOf("acca-ma");
  assert.ok(firstMa >= 0 && firstMa < learnOrder.length / 3, "MA starts early");
  const mocks = p.days.flatMap((d) => d.blocks).filter((b) => b.kind === "mock").map((b) => b.subjectId);
  assert.equal(new Set(mocks).size, 2, "mocks rotate across papers");
});

test("deterministic, with stable unique ids", () => {
  assert.deepEqual(buildPlan(base), plan);
  const ids = plan.days.flatMap((d) => d.blocks.map((b) => b.id));
  assert.equal(new Set(ids).size, ids.length);
});

test("too little time produces a warning, never a crash", () => {
  const tight = buildPlan({ ...base, examDate: "2026-10-07", weekdayHours: 0.5 });
  assert.ok(tight.warnings.length > 0);
  const past = buildPlan({ ...base, examDate: "2026-10-01" });
  assert.ok(past.warnings.some((w) => /after/.test(w)));
  assert.equal(past.days.length, 0);
  const none = buildPlan({ ...base, chapters: [] });
  assert.ok(none.warnings.some((w) => /paper/.test(w)));
  const zero = buildPlan({ ...base, weekdayHours: 0, weekendHours: 0 });
  assert.ok(zero.warnings.some((w) => /hours/.test(w)));
});

test("ics export is RFC 5545 shaped", () => {
  const ics = buildICS(plan, {
    title: "ACCA FA",
    label: (b) => `Ch ${b.chapter ?? "-"}; ${b.kind}, ${b.minutes}m`,
    url: (b) => (b.slug ? `https://www.thecahub.com/acca/acca-fa/mcqs/${b.slug}` : undefined),
    stamp: "2026-10-04T10:00:00.000Z",
  });
  assert.ok(ics.startsWith("BEGIN:VCALENDAR\r\n") && ics.endsWith("END:VCALENDAR\r\n"));
  const studyDays = plan.days.filter((d) => d.blocks.length).length;
  assert.equal(ics.match(/BEGIN:VEVENT/g)!.length, studyDays + 1);
  assert.ok(ics.includes("DTSTAMP:20261004T100000Z"));
  assert.ok(ics.includes("DTSTART;VALUE=DATE:20261204"));
  assert.ok(ics.includes("\\;") && ics.includes("\\,"), "commas and semicolons escaped");
  for (const line of ics.split("\r\n")) assert.ok(new TextEncoder().encode(line).length <= 75, line);
});

console.log(`\n${passed} planner tests passed`);
