"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CalendarPlus,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Copy,
  Flame,
  MessageCircle,
  Minus,
  Pencil,
  Plus,
  Printer,
  RotateCcw,
  Sparkles,
  Target,
  Timer,
  Trash2,
  Trophy,
} from "lucide-react";
import type { BodyId } from "@/data/subjects";
import {
  addDays,
  buildICS,
  buildPlan,
  clampConfidence,
  daysBetween,
  formatMinutes,
  localISODate,
  parseISODate,
  weekdayOf,
  type Plan,
  type PlanBlock,
  type PlanDay,
  type PlannerChapter,
} from "@/lib/planner";
import { BODIES, PLANNER_URL, type CatalogSubject } from "./catalog";

/* ───────────── State & storage ───────────── */

const STORAGE_KEY = "thecahub:study-planner:v1";

interface FormState {
  body: BodyId;
  subjectIds: string[];
  examDate: string;
  weekdayHours: number;
  weekendHours: number;
  daysOff: number[];
  confidence: Record<string, number>;
}

interface Saved {
  v: 1;
  form: FormState;
  startDate: string;
  createdAt: string;
  done: Record<string, true>;
}

function loadSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Saved;
    if (s?.v !== 1 || !s.form?.subjectIds?.length || !s.startDate || !s.form.examDate) return null;
    return { ...s, done: s.done ?? {} };
  } catch {
    return null;
  }
}

function persist(s: Saved | null) {
  try {
    if (s) localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* private mode / quota: the plan still works for this visit */
  }
}

function defaultForm(today: string): FormState {
  const current = document.documentElement.dataset.body as BodyId | undefined;
  return {
    body: BODIES.some((b) => b.id === current) ? (current as BodyId) : "icap",
    subjectIds: [],
    examDate: addDays(today, 56),
    weekdayHours: 2,
    weekendHours: 4,
    daysOff: [],
    confidence: {},
  };
}

/* ───────────── Formatting helpers ───────────── */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
const CONF_LABEL = ["", "Weak", "Shaky", "OK", "Good", "Strong"];

const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(parseISODate(iso)).toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });
const shortDate = (iso: string) => fmtDate(iso, { weekday: "short", day: "numeric", month: "short" });
const longDate = (iso: string) => fmtDate(iso, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
/** First day of the plan-relative week (weeks start on the plan's start day) containing `iso`. */
const weekStartOf = (start: string, iso: string) => addDays(start, Math.floor(daysBetween(start, iso) / 7) * 7);

const tint = (pct: number) => `color-mix(in srgb, var(--green) ${pct}%, transparent)`;
const card = { background: "var(--bg-2)", border: "1px solid var(--border)" } as const;
const headingFont = "var(--font-space-grotesk), sans-serif";

const KIND_META: Record<PlanBlock["kind"], { label: string; Icon: typeof BookOpen; color: string; bg: string }> = {
  learn: { label: "Learn", Icon: BookOpen, color: "var(--green)", bg: tint(14) },
  review: { label: "Review", Icon: RotateCcw, color: "var(--gold)", bg: "color-mix(in srgb, var(--gold) 14%, transparent)" },
  revise: { label: "Revise", Icon: Target, color: "var(--text-2)", bg: "var(--bg-3)" },
  mock: { label: "Mock exam", Icon: Timer, color: "#fff", bg: "var(--green)" },
};

/* ───────────── Main component ───────────── */

export default function StudyPlanner({ catalog }: { catalog: CatalogSubject[] }) {
  const [today] = useState(() => localISODate(new Date()));
  const [saved, setSaved] = useState<Saved | null>(() => loadSaved());
  const [form, setForm] = useState<FormState>(() => loadSaved()?.form ?? defaultForm(localISODate(new Date())));
  const [view, setView] = useState<"form" | "plan">(() => (loadSaved() ? "plan" : "form"));

  const subjectsById = useMemo(() => new Map(catalog.map((s) => [s.id, s])), [catalog]);

  // Paint the page in the chosen qualification's accent (BodyThemeSync resets it on navigation).
  const activeBody = view === "plan" && saved ? saved.form.body : form.body;
  useEffect(() => {
    document.documentElement.dataset.body = activeBody;
  }, [activeBody]);

  const plan = useMemo(() => (saved ? buildPlan(toInput(saved.form, saved.startDate, subjectsById)) : null), [saved, subjectsById]);

  const build = () => {
    const next: Saved = { v: 1, form, startDate: today, createdAt: new Date().toISOString(), done: saved?.done ?? {} };
    persist(next);
    setSaved(next);
    setView("plan");
    requestAnimationFrame(() => document.getElementById("sp-top")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const toggleDone = useCallback((id: string) => {
    setSaved((s) => {
      if (!s) return s;
      const done = { ...s.done };
      if (done[id]) delete done[id];
      else done[id] = true;
      const next = { ...s, done };
      persist(next);
      return next;
    });
  }, []);

  const reset = () => {
    if (!confirm("Delete this plan and start again?")) return;
    persist(null);
    setSaved(null);
    setForm(defaultForm(today));
    setView("form");
  };

  return (
    <div id="sp-top" style={{ scrollMarginTop: 96 }}>
      <PrintStyles />
      {view === "plan" && saved && plan ? (
        <PlanView
          plan={plan}
          saved={saved}
          today={today}
          subjectsById={subjectsById}
          onToggle={toggleDone}
          onEdit={() => {
            setForm(saved.form);
            setView("form");
          }}
          onReset={reset}
        />
      ) : (
        <PlannerForm
          catalog={catalog}
          form={form}
          setForm={setForm}
          today={today}
          onBuild={build}
          onCancel={saved ? () => setView("plan") : undefined}
        />
      )}
    </div>
  );
}

function toInput(form: FormState, startDate: string, subjectsById: Map<string, CatalogSubject>) {
  const chapters: PlannerChapter[] = form.subjectIds.flatMap((id) =>
    (subjectsById.get(id)?.chapters ?? []).map((c) => ({
      subjectId: id,
      chapter: c.chapter,
      topic: c.topic,
      slug: c.slug,
      count: c.count,
      confidence: form.confidence[`${id}:${c.chapter}`] ?? 3,
    })),
  );
  return {
    startDate,
    examDate: form.examDate,
    weekdayHours: form.weekdayHours,
    weekendHours: form.weekendHours,
    daysOff: form.daysOff,
    chapters,
  };
}

/* ───────────── Form ───────────── */

function PlannerForm({
  catalog,
  form,
  setForm,
  today,
  onBuild,
  onCancel,
}: {
  catalog: CatalogSubject[];
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  today: string;
  onBuild: () => void;
  onCancel?: () => void;
}) {
  const [showConfidence, setShowConfidence] = useState(false);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const papers = catalog.filter((s) => s.body === form.body);
  const groups = [...new Set(papers.map((p) => p.levelLabel))].map((label) => ({ label, items: papers.filter((p) => p.levelLabel === label) }));
  const selected = form.subjectIds.map((id) => catalog.find((s) => s.id === id)).filter((s): s is CatalogSubject => !!s);

  const daysAway = form.examDate ? daysBetween(today, form.examDate) : 0;
  let hours = 0;
  for (let i = 0; i < Math.min(Math.max(daysAway, 0), 2000); i++) {
    const wd = weekdayOf(addDays(today, i));
    if (!form.daysOff.includes(wd)) hours += wd === 0 || wd === 6 ? form.weekendHours : form.weekdayHours;
  }
  const chapterCount = selected.reduce((s, p) => s + p.chapters.length, 0);

  const problems: string[] = [];
  if (!selected.length) problems.push("Pick at least one paper.");
  if (!form.examDate || daysAway < 1) problems.push("Choose an exam date after today.");
  else if (hours <= 0) problems.push("Add some study hours or remove a day off.");

  const togglePaper = (id: string) =>
    set("subjectIds", form.subjectIds.includes(id) ? form.subjectIds.filter((x) => x !== id) : [...form.subjectIds, id]);
  const toggleOff = (wd: number) => set("daysOff", form.daysOff.includes(wd) ? form.daysOff.filter((x) => x !== wd) : [...form.daysOff, wd]);
  const setConf = (key: string, v: number) => setForm((f) => ({ ...f, confidence: { ...f.confidence, [key]: v } }));
  const setAllConf = (s: CatalogSubject, v: number) =>
    setForm((f) => ({ ...f, confidence: { ...f.confidence, ...Object.fromEntries(s.chapters.map((c) => [`${s.id}:${c.chapter}`, v])) } }));

  return (
    <div className="flex flex-col gap-4 sp-noprint">
      {/* 1. Qualification */}
      <Step n={1} title="Your qualification">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {BODIES.map((b) => {
            const on = form.body === b.id;
            return (
              <button
                key={b.id}
                type="button"
                aria-pressed={on}
                onClick={() => setForm((f) => (f.body === b.id ? f : { ...f, body: b.id, subjectIds: [] }))}
                className="rounded-xl px-2 py-3 text-sm font-bold transition-all active:scale-[0.97]"
                style={{
                  fontFamily: headingFont,
                  background: on ? "var(--green)" : "var(--bg-3)",
                  color: on ? "#fff" : "var(--text-1)",
                  border: `1px solid ${on ? "var(--green)" : "var(--border)"}`,
                }}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </Step>

      {/* 2. Papers */}
      <Step n={2} title="Your papers" hint={selected.length ? `${selected.length} selected · ${chapterCount} ch` : "Pick one or more"}>
        <div className="flex flex-col gap-4">
          {groups.map((g) => (
            <div key={g.label}>
              {groups.length > 1 && (
                <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-3)" }}>
                  {g.label}
                </p>
              )}
              <div className="grid sm:grid-cols-2 gap-2">
                {g.items.map((p) => {
                  const on = form.subjectIds.includes(p.id);
                  const empty = !p.chapters.length;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={on}
                      disabled={empty}
                      onClick={() => togglePaper(p.id)}
                      className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-all active:scale-[0.99] disabled:opacity-40"
                      style={{ background: on ? tint(12) : "var(--bg-3)", border: `1px solid ${on ? "var(--green)" : "var(--border)"}` }}
                    >
                      <span
                        className="shrink-0 grid place-items-center rounded-md"
                        style={{ width: 20, height: 20, background: on ? "var(--green)" : "transparent", border: `1.5px solid ${on ? "var(--green)" : "var(--text-3)"}` }}
                      >
                        {on && <Check className="w-3.5 h-3.5" color="#fff" strokeWidth={3} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold" style={{ color: "var(--text-1)", fontFamily: headingFont }}>
                          {p.code}
                        </span>
                        <span className="block text-xs truncate" style={{ color: "var(--text-2)" }}>
                          {p.title}
                        </span>
                      </span>
                      <span className="shrink-0 text-[11px] font-semibold" style={{ color: "var(--text-3)" }}>
                        {empty ? "soon" : `${p.chapters.length} ch`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Step>

      {/* 3. Exam date */}
      <Step n={3} title="Exam date" hint={daysAway > 0 ? `${daysAway} days away` : undefined}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            type="date"
            value={form.examDate}
            min={addDays(today, 1)}
            onChange={(e) => set("examDate", e.target.value)}
            aria-label="Exam date"
            className="rounded-xl px-4 py-3 text-base font-semibold w-full sm:w-auto"
            style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-1)", colorScheme: "dark light" }}
          />
          <div className="flex gap-2">
            {[4, 8, 12, 16].map((w) => {
              const d = addDays(today, w * 7);
              const on = form.examDate === d;
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => set("examDate", d)}
                  className="flex-1 sm:flex-none rounded-lg px-3 py-2 text-xs font-bold"
                  style={{ background: on ? tint(16) : "var(--bg-3)", color: on ? "var(--green)" : "var(--text-2)", border: `1px solid ${on ? "var(--green)" : "var(--border)"}` }}
                >
                  {w} wks
                </button>
              );
            })}
          </div>
        </div>
      </Step>

      {/* 4. Time */}
      <Step n={4} title="Study time" hint={hours > 0 ? `≈ ${Math.round(hours)}h until exam` : undefined}>
        <div className="grid grid-cols-2 gap-3 mb-5">
          <Stepper label="Weekdays" value={form.weekdayHours} onChange={(v) => set("weekdayHours", v)} />
          <Stepper label="Weekends" value={form.weekendHours} onChange={(v) => set("weekendHours", v)} />
        </div>
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-2)" }}>
          Days off <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(tap to rest that day every week)</span>
        </p>
        <div className="grid grid-cols-7 gap-1.5">
          {WEEK_ORDER.map((wd) => {
            const offDay = form.daysOff.includes(wd);
            return (
              <button
                key={wd}
                type="button"
                aria-pressed={offDay}
                aria-label={`${WEEKDAYS[wd]} ${offDay ? "off" : "study"}`}
                onClick={() => toggleOff(wd)}
                className="rounded-lg py-2.5 text-xs font-bold transition-all"
                style={{
                  background: offDay ? "transparent" : "var(--bg-3)",
                  color: offDay ? "var(--text-3)" : "var(--text-1)",
                  border: `1px ${offDay ? "dashed" : "solid"} ${offDay ? "var(--text-3)" : "var(--border)"}`,
                  textDecoration: offDay ? "line-through" : "none",
                }}
              >
                {WEEKDAYS[wd].slice(0, 2)}
              </button>
            );
          })}
        </div>
      </Step>

      {/* 5. Confidence (optional) */}
      {selected.length > 0 && (
        <section className="rounded-2xl" style={card}>
          <button
            type="button"
            onClick={() => setShowConfidence((s) => !s)}
            aria-expanded={showConfidence}
            className="w-full flex items-center gap-3 px-4 sm:px-5 py-4 text-left"
          >
            <StepBadge n={5} />
            <span className="flex-1 min-w-0">
              <span className="block font-bold text-[15px]" style={{ color: "var(--text-1)", fontFamily: headingFont }}>
                Rate your confidence <span style={{ color: "var(--text-3)", fontWeight: 500 }}>(optional)</span>
              </span>
              <span className="block text-xs" style={{ color: "var(--text-2)" }}>
                Weak chapters get more time, strong ones less.
              </span>
            </span>
            <ChevronDown className="w-5 h-5 shrink-0 transition-transform" style={{ color: "var(--text-3)", transform: showConfidence ? "rotate(180deg)" : "none" }} />
          </button>
          {showConfidence && (
            <div className="px-4 sm:px-5 pb-5 flex flex-col gap-6">
              {selected.map((s) => (
                <div key={s.id}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-sm font-bold" style={{ color: "var(--text-1)", fontFamily: headingFont }}>
                      {s.code}
                    </p>
                    <div className="flex gap-1">
                      {[1, 3, 5].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setAllConf(s, v)}
                          className="rounded-md px-2 py-1 text-[11px] font-semibold"
                          style={{ background: "var(--bg-3)", color: "var(--text-2)", border: "1px solid var(--border)" }}
                        >
                          All {CONF_LABEL[v].toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ul className="flex flex-col">
                    {s.chapters.map((c) => {
                      const key = `${s.id}:${c.chapter}`;
                      const v = clampConfidence(form.confidence[key]);
                      return (
                        <li key={key} className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_180px_56px] items-center gap-x-3 gap-y-1 py-2" style={{ borderTop: "1px solid var(--border)" }}>
                          <span className="text-[13px] truncate" style={{ color: "var(--text-2)" }}>
                            <span style={{ color: "var(--text-3)" }}>{c.chapter}.</span> {c.topic}
                          </span>
                          <span className="text-[11px] font-bold text-right sm:order-3" style={{ color: v <= 2 ? "var(--green)" : "var(--text-3)" }}>
                            {CONF_LABEL[v]}
                          </span>
                          <input
                            type="range"
                            min={1}
                            max={5}
                            step={1}
                            value={v}
                            onChange={(e) => setConf(key, Number(e.target.value))}
                            aria-label={`Confidence in ${c.topic}`}
                            className="col-span-2 sm:col-span-1 w-full"
                            style={{ accentColor: "var(--green)" }}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Build */}
      <div className="flex flex-col gap-3 pt-2">
        {problems.length > 0 && selected.length > 0 && (
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            {problems[0]}
          </p>
        )}
        <button
          type="button"
          onClick={onBuild}
          disabled={problems.length > 0}
          className="w-full rounded-2xl px-6 py-4 text-base font-bold text-white inline-flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "var(--green)", fontFamily: headingFont, boxShadow: `0 10px 30px -10px ${tint(70)}` }}
        >
          <Sparkles className="w-5 h-5" /> {onCancel ? "Rebuild my plan from today" : "Build my study plan"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm font-semibold py-2" style={{ color: "var(--text-2)" }}>
            Cancel, back to my plan
          </button>
        )}
        <p className="text-xs text-center" style={{ color: "var(--text-3)" }}>
          Free, no sign-up. Your plan is saved on this device.
        </p>
      </div>
    </div>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <span
      className="shrink-0 grid place-items-center rounded-full text-xs font-bold"
      style={{ width: 26, height: 26, background: tint(16), color: "var(--green)", fontFamily: headingFont }}
    >
      {n}
    </span>
  );
}

function Step({ n, title, hint, children }: { n: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl px-4 sm:px-5 py-4 sm:py-5" style={card}>
      <div className="flex items-center gap-3 mb-4">
        <StepBadge n={n} />
        <h2 className="flex-1 min-w-0 font-bold text-[15px] whitespace-nowrap" style={{ color: "var(--text-1)", fontFamily: headingFont }}>
          {title}
        </h2>
        {hint && (
          <span className="text-xs font-semibold text-right whitespace-nowrap rounded-full px-2.5 py-1" style={{ color: "var(--green)", background: tint(10) }}>
            {hint}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const step = (d: number) => onChange(Math.min(14, Math.max(0, Math.round((value + d) * 2) / 2)));
  const btn = "grid place-items-center rounded-lg w-10 h-10 shrink-0 transition-all active:scale-95 disabled:opacity-30";
  return (
    <div className="rounded-xl p-3" style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
      <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-2)" }}>
        {label}
      </p>
      <div className="flex items-center justify-between gap-1">
        <button type="button" className={btn} style={{ background: "var(--bg-2)", color: "var(--text-1)" }} onClick={() => step(-0.5)} disabled={value <= 0} aria-label={`Fewer ${label.toLowerCase()} hours`}>
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-center" style={{ fontFamily: headingFont }}>
          <span className="text-2xl font-bold" style={{ color: "var(--text-1)" }}>
            {value}
          </span>
          <span className="text-xs font-semibold ml-0.5" style={{ color: "var(--text-3)" }}>
            h/day
          </span>
        </span>
        <button type="button" className={btn} style={{ background: "var(--bg-2)", color: "var(--text-1)" }} onClick={() => step(0.5)} disabled={value >= 14} aria-label={`More ${label.toLowerCase()} hours`}>
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ───────────── Plan view ───────────── */

interface PlanCtx {
  subjectsById: Map<string, CatalogSubject>;
  done: Record<string, true>;
  onToggle: (id: string) => void;
}

function PlanView({
  plan,
  saved,
  today,
  subjectsById,
  onToggle,
  onEdit,
  onReset,
}: {
  plan: Plan;
  saved: Saved;
  today: string;
  subjectsById: Map<string, CatalogSubject>;
  onToggle: (id: string) => void;
  onEdit: () => void;
  onReset: () => void;
}) {
  const [tab, setTab] = useState<"today" | "week" | "all">("today");
  const ctx: PlanCtx = { subjectsById, done: saved.done, onToggle };
  const codes = saved.form.subjectIds.map((id) => subjectsById.get(id)?.code ?? id);
  const examName = codes.join(" + ");

  const allBlocks = plan.days.flatMap((d) => d.blocks);
  const doneMinutes = allBlocks.filter((b) => saved.done[b.id]).reduce((s, b) => s + b.minutes, 0);
  const pct = plan.totals.studyMinutes ? Math.round((doneMinutes / plan.totals.studyMinutes) * 100) : 0;
  const streak = useMemo(() => computeStreak(plan, saved.done, today), [plan, saved.done, today]);

  return (
    <div className="flex flex-col gap-4">
      <div className="sp-noprint flex flex-col gap-4">
        <Countdown plan={plan} today={today} examName={examName} pct={pct} doneMinutes={doneMinutes} streak={streak} />

        <Actions plan={plan} examName={examName} codes={codes} subjectsById={subjectsById} today={today} />

        {plan.warnings.length > 0 && (
          <div className="rounded-2xl px-4 py-3 flex gap-3 text-sm" style={{ background: "color-mix(in srgb, var(--gold) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--gold) 35%, transparent)", color: "var(--text-1)" }}>
            <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: "var(--gold)" }} />
            <div>
              {plan.warnings.map((w) => (
                <p key={w}>{w}</p>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl" style={card} role="tablist">
          {(
            [
              ["today", "Today"],
              ["week", "Week"],
              ["all", "Full plan"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className="rounded-xl py-2.5 text-sm font-bold transition-all"
              style={{ fontFamily: headingFont, background: tab === id ? "var(--bg-3)" : "transparent", color: tab === id ? "var(--text-1)" : "var(--text-2)", boxShadow: tab === id ? "0 1px 0 var(--border)" : "none" }}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "today" && <TodayView plan={plan} today={today} ctx={ctx} />}
        {tab === "week" && <WeekView plan={plan} today={today} ctx={ctx} />}
        {tab === "all" && <FullPlan plan={plan} today={today} ctx={ctx} />}

        <Stats plan={plan} />

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-1">
          <button type="button" onClick={onEdit} className="inline-flex items-center gap-1.5 text-sm font-semibold py-2" style={{ color: "var(--text-2)" }}>
            <Pencil className="w-4 h-4" /> Edit inputs
          </button>
          <button type="button" onClick={onReset} className="inline-flex items-center gap-1.5 text-sm font-semibold py-2" style={{ color: "var(--text-3)" }}>
            <Trash2 className="w-4 h-4" /> Start over
          </button>
        </div>
      </div>

      <PrintPlan plan={plan} examName={examName} subjectsById={subjectsById} />
    </div>
  );
}

function computeStreak(plan: Plan, done: Record<string, true>, today: string): number {
  let streak = 0;
  const byDate = new Map(plan.days.map((d) => [d.date, d]));
  const todayDay = byDate.get(today);
  const complete = (d: PlanDay) => d.blocks.length > 0 && d.blocks.every((b) => done[b.id]);
  if (todayDay && complete(todayDay)) streak++;
  for (let date = addDays(today, -1); date >= plan.startDate; date = addDays(date, -1)) {
    const d = byDate.get(date);
    if (!d || !d.blocks.length) continue; // rest days don't break a streak
    if (!complete(d)) break;
    streak++;
  }
  return streak;
}

/* Countdown hero */

function Countdown({ plan, today, examName, pct, doneMinutes, streak }: { plan: Plan; today: string; examName: string; pct: number; doneMinutes: number; streak: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const days = daysBetween(today, plan.examDate);
  // Exams usually start in the morning: count down to 09:00 local time on exam day.
  const [y, m, d] = plan.examDate.split("-").map(Number);
  const ms = Math.max(0, new Date(y, m - 1, d, 9).getTime() - now);
  const hh = Math.floor(ms / 3_600_000);
  const mm = Math.floor((ms % 3_600_000) / 60_000);
  const ss = Math.floor((ms % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");

  const span = Math.max(1, daysBetween(plan.startDate, plan.examDate));
  const finalStart = plan.days.find((x) => x.phase === "final")?.date;
  const finalPct = finalStart ? (daysBetween(plan.startDate, finalStart) / span) * 100 : 100;
  const todayPct = Math.min(100, Math.max(0, (daysBetween(plan.startDate, today) / span) * 100));

  return (
    <section
      className="relative overflow-hidden rounded-3xl px-5 sm:px-8 pt-6 pb-6 sm:pt-8"
      style={{
        background: `radial-gradient(120% 140% at 0% 0%, ${tint(30)}, transparent 55%), radial-gradient(80% 120% at 100% 100%, ${tint(12)}, transparent 60%), var(--bg-2)`,
        border: `1px solid ${tint(35)}`,
      }}
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--green)", fontFamily: headingFont }}>
            {days > 0 ? "Exam countdown" : days === 0 ? "It's exam day" : "Exam done"}
          </p>
          {days > 0 ? (
            <>
              <div className="flex items-end gap-3">
                <span className="font-bold tabular-nums" style={{ fontSize: "clamp(4.5rem,18vw,7.5rem)", lineHeight: 0.85, letterSpacing: "-0.05em", color: "var(--text-1)", fontFamily: headingFont }}>
                  {days}
                </span>
                <span className="pb-1.5 sm:pb-3">
                  <span className="block text-xl sm:text-2xl font-bold" style={{ color: "var(--text-1)", fontFamily: headingFont }}>
                    {days === 1 ? "day" : "days"}
                  </span>
                  <span className="block text-sm font-semibold tabular-nums" style={{ color: "var(--text-2)" }}>
                    {pad(hh % 24)}:{pad(mm)}:{pad(ss)}
                  </span>
                </span>
              </div>
              <p className="mt-3 text-[15px]" style={{ color: "var(--text-2)" }}>
                to <strong style={{ color: "var(--text-1)" }}>{examName}</strong> · {fmtDate(plan.examDate, { weekday: "short", day: "numeric", month: "long" })}
              </p>
            </>
          ) : (
            <p className="text-3xl font-bold" style={{ color: "var(--text-1)", fontFamily: headingFont }}>
              {days === 0 ? `Good luck in ${examName}!` : `Hope ${examName} went well.`}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 md:w-[280px] shrink-0">
          <div className="rounded-2xl px-4 py-3" style={{ background: "color-mix(in srgb, var(--bg) 55%, transparent)", border: "1px solid var(--border)" }}>
            <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--text-1)", fontFamily: headingFont }}>
              {pct}%
            </p>
            <p className="text-[11px] font-semibold" style={{ color: "var(--text-3)" }}>
              plan done · {formatMinutes(doneMinutes)}
            </p>
          </div>
          <div className="rounded-2xl px-4 py-3" style={{ background: "color-mix(in srgb, var(--bg) 55%, transparent)", border: "1px solid var(--border)" }}>
            <p className="text-2xl font-bold tabular-nums inline-flex items-center gap-1" style={{ color: "var(--text-1)", fontFamily: headingFont }}>
              <Flame className="w-5 h-5" style={{ color: streak ? "var(--gold)" : "var(--text-3)" }} />
              {streak}
            </p>
            <p className="text-[11px] font-semibold" style={{ color: "var(--text-3)" }}>
              day streak
            </p>
          </div>
        </div>
      </div>

      {/* Timeline: learn phase → mocks & revision → exam */}
      <div className="mt-6">
        <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: "var(--bg-3)" }}>
          <div className="absolute inset-y-0 left-0" style={{ width: `${pct}%`, background: "var(--green)", borderRadius: 999 }} />
          <div className="absolute inset-y-0" style={{ left: `${finalPct}%`, right: 0, background: "repeating-linear-gradient(135deg, transparent 0 4px, color-mix(in srgb, var(--gold) 45%, transparent) 4px 7px)" }} />
        </div>
        <div className="relative h-5 mt-1">
          <span className="absolute -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider" style={{ left: `${Math.min(92, Math.max(8, todayPct))}%`, color: "var(--text-1)" }}>
            ▲ today
          </span>
        </div>
        <div className="flex justify-between text-[11px] font-semibold" style={{ color: "var(--text-3)" }}>
          <span>Learn + spaced review</span>
          <span style={{ color: "var(--gold)" }}>Mocks & revision</span>
        </div>
      </div>
    </section>
  );
}

/* Calendar / print / share */

function Actions({ plan, examName, codes, subjectsById, today }: { plan: Plan; examName: string; codes: string[]; subjectsById: Map<string, CatalogSubject>; today: string }) {
  const [copied, setCopied] = useState(false);
  const days = Math.max(0, daysBetween(today, plan.examDate));
  const shareUrl = `${PLANNER_URL}?utm_source=whatsapp&utm_medium=share&utm_campaign=study_planner`;
  const shareText =
    `📚 ${days} days to my ${examName} exam.\n` +
    `I just built a free day-by-day study plan on The CA Hub: ${plan.totals.chapters} chapters, ${Math.round(plan.totals.studyMinutes / 60)} study hours, ${plan.totals.mocks} mock exams, all mapped out.\n\n` +
    `Make yours in 30 seconds 👉 ${shareUrl}`;

  const downloadIcs = () => {
    const ics = buildICS(plan, {
      title: examName,
      label: (b) => blockLabel(b, subjectsById),
      url: (b) => {
        const s = subjectsById.get(b.subjectId);
        if (!s) return undefined;
        return `https://www.thecahub.com${b.kind === "mock" ? mockHref(s) : b.slug ? chapterHref(s, b.slug) : ""}`;
      },
      stamp: new Date().toISOString(),
      homeUrl: PLANNER_URL,
    });
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `study-plan-${codes.join("-").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  const btn = "inline-flex items-center justify-center gap-2 rounded-xl px-2 py-3 text-[13px] sm:text-sm font-bold whitespace-nowrap transition-all active:scale-[0.98]";
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      <a
        href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btn} col-span-2 sm:col-span-1`}
        style={{ background: "#25D366", color: "#062b16", textDecoration: "none" }}
      >
        <MessageCircle className="w-4 h-4" /> Share on WhatsApp
      </a>
      <button type="button" onClick={downloadIcs} className={btn} style={{ ...card, color: "var(--text-1)" }}>
        <CalendarPlus className="w-4 h-4" style={{ color: "var(--green)" }} /> Add to calendar
      </button>
      <button type="button" onClick={() => window.print()} className={btn} style={{ ...card, color: "var(--text-1)" }}>
        <Printer className="w-4 h-4" style={{ color: "var(--green)" }} /> Print / PDF
      </button>
      <button type="button" onClick={copyLink} className={`${btn} col-span-2 sm:col-span-1`} style={{ ...card, color: "var(--text-1)" }}>
        {copied ? <Check className="w-4 h-4" style={{ color: "var(--green)" }} /> : <Copy className="w-4 h-4" style={{ color: "var(--green)" }} />}
        {copied ? "Copied!" : "Copy invite"}
      </button>
    </div>
  );
}

/* Links & labels */

const subjectBase = (s: CatalogSubject) => `/${s.level.toLowerCase()}/${s.id}`;
const chapterHref = (s: CatalogSubject, slug: string) => `${subjectBase(s)}/mcqs/${slug}`;
const quizHref = (s: CatalogSubject, chapter: number) => `${subjectBase(s)}/quiz?mode=topical&chapter=${chapter}`;
const mockHref = (s: CatalogSubject) => `${subjectBase(s)}/quiz?mode=exam`;

function blockLabel(b: PlanBlock, subjectsById: Map<string, CatalogSubject>): string {
  const code = subjectsById.get(b.subjectId)?.code ?? b.subjectId;
  const time = formatMinutes(b.minutes);
  if (b.kind === "mock") return `Timed mock exam: ${code} (${time})`;
  const what = b.kind === "learn" ? (b.parts && b.parts > 1 ? `Learn (part ${b.part}/${b.parts})` : "Learn") : b.kind === "review" ? `Review #${b.part}` : "Revise";
  return `${what}: ${code} Ch ${b.chapter} ${b.topic} (${time})`;
}

/* Block row */

function BlockRow({ block, ctx, compact = false }: { block: PlanBlock; ctx: PlanCtx; compact?: boolean }) {
  const s = ctx.subjectsById.get(block.subjectId);
  const isDone = !!ctx.done[block.id];
  const meta = KIND_META[block.kind];
  const sub =
    block.kind === "learn" && block.parts && block.parts > 1
      ? `Part ${block.part} of ${block.parts}`
      : block.kind === "review"
        ? `Spaced review #${block.part}`
        : block.kind === "revise"
          ? "Revision + MCQs"
          : block.kind === "mock"
            ? "Exam conditions, no notes"
            : "First pass + MCQs";
  const title = block.kind === "mock" ? `${s?.code ?? ""} full mock` : block.topic;
  const practice = s ? (block.kind === "mock" ? mockHref(s) : quizHref(s, block.chapter!)) : undefined;

  if (compact) {
    return (
      <li className="flex items-start gap-2 py-1.5">
        <CheckButton done={isDone} onClick={() => ctx.onToggle(block.id)} label={blockLabel(block, ctx.subjectsById)} size={18} />
        <span className="min-w-0 flex-1 text-[12.5px] leading-snug" style={{ color: isDone ? "var(--text-3)" : "var(--text-1)", textDecoration: isDone ? "line-through" : "none" }}>
          {block.kind !== "learn" && (
            <span className="text-[10px] font-bold uppercase tracking-wider mr-1" style={{ color: block.kind === "mock" ? "var(--green)" : meta.color }}>
              {block.kind === "review" ? `Review ${block.part}` : block.kind === "revise" ? "Revise" : "Mock exam"}
            </span>
          )}
          <span className="font-bold" style={{ color: block.kind === "mock" ? "var(--green)" : meta.color === "#fff" ? "var(--green)" : meta.color }}>
            {block.kind === "mock" ? "" : `${s?.code.replace(/^(ACCA|CIMA|ICAEW|US CMA|CA Foundation|CA Inter) /, "") ?? ""} Ch${block.chapter}`}
          </span>{" "}
          {s && (block.kind === "mock" || block.slug) ? (
            <Link href={block.kind === "mock" ? mockHref(s) : chapterHref(s, block.slug!)} className="hover:underline" style={{ color: "inherit", textDecoration: isDone ? "line-through" : undefined }}>
              {block.kind === "mock" ? `${s.code} (timed)` : block.topic}
            </Link>
          ) : (
            block.topic
          )}
          <span style={{ color: "var(--text-3)" }}> · {formatMinutes(block.minutes)}</span>
        </span>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 rounded-2xl px-3 sm:px-4 py-3 transition-all" style={{ background: isDone ? "transparent" : "var(--bg-3)", border: "1px solid var(--border)", opacity: isDone ? 0.65 : 1 }}>
      <CheckButton done={isDone} onClick={() => ctx.onToggle(block.id)} label={blockLabel(block, ctx.subjectsById)} size={26} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
          <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: meta.bg, color: meta.color }}>
            <meta.Icon className="w-3 h-3" /> {meta.label}
          </span>
          <span className="text-[11px] font-semibold" style={{ color: "var(--text-3)" }}>
            {s?.code}
            {block.chapter != null && ` · Ch ${block.chapter}`} · {formatMinutes(block.minutes)}
          </span>
        </div>
        {s && block.slug ? (
          <Link href={chapterHref(s, block.slug)} className="block font-semibold text-[15px] leading-snug truncate" style={{ color: "var(--text-1)", textDecoration: isDone ? "line-through" : "none" }}>
            {title}
          </Link>
        ) : (
          <p className="font-semibold text-[15px] leading-snug truncate" style={{ color: "var(--text-1)" }}>
            {title}
          </p>
        )}
        <p className="text-xs" style={{ color: "var(--text-3)" }}>
          {sub}
        </p>
      </div>
      {practice && (
        <Link
          href={practice}
          className="shrink-0 inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold"
          style={{ background: block.kind === "mock" ? "var(--green)" : tint(14), color: block.kind === "mock" ? "#fff" : "var(--green)", textDecoration: "none" }}
          aria-label={`Practise MCQs: ${title}`}
        >
          {block.kind === "mock" ? "Start" : "MCQs"} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </li>
  );
}

function CheckButton({ done, onClick, label, size }: { done: boolean; onClick: () => void; label: string; size: number }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-label={label}
      onClick={onClick}
      className="shrink-0 grid place-items-center rounded-full transition-all active:scale-90"
      style={{ width: size, height: size, background: done ? "var(--green)" : "transparent", border: `2px solid ${done ? "var(--green)" : "var(--text-3)"}` }}
    >
      {done && <Check style={{ width: size * 0.6, height: size * 0.6 }} color="#fff" strokeWidth={3.5} />}
    </button>
  );
}

/* Today */

function TodayView({ plan, today, ctx }: { plan: Plan; today: string; ctx: PlanCtx }) {
  const day = plan.days.find((d) => d.date === today);
  const blocks = day?.blocks ?? [];
  const doneCount = blocks.filter((b) => ctx.done[b.id]).length;
  const allDone = blocks.length > 0 && doneCount === blocks.length;
  const minutes = blocks.reduce((s, b) => s + b.minutes, 0);

  const catchUp = plan.days
    .filter((d) => d.date < today && d.date >= addDays(today, -7))
    .flatMap((d) => d.blocks.filter((b) => !ctx.done[b.id]).map((b) => ({ b, date: d.date })));
  const next = plan.days.find((d) => d.date > today && d.blocks.length);

  // Celebrate finishing the day.
  const [celebrated, setCelebrated] = useState(allDone);
  useEffect(() => {
    if (!allDone || celebrated) return;
    setCelebrated(true);
    import("canvas-confetti").then(({ default: confetti }) => {
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--green").trim();
      confetti({ particleCount: 120, spread: 75, origin: { y: 0.7 }, colors: [accent, "#ffffff", accent] });
    });
  }, [allDone, celebrated]);

  let empty: { Icon: typeof Coffee; title: string; text: string } | null = null;
  if (!day || today < plan.startDate) empty = { Icon: CalendarDays, title: "Your plan hasn't started yet", text: `It starts on ${shortDate(plan.startDate)}.` };
  else if (day.phase === "exam") empty = { Icon: Trophy, title: "Exam day", text: "No studying today. Read the question twice, manage your time and trust your prep." };
  else if (today > plan.examDate) empty = { Icon: Trophy, title: "Your exam is behind you", text: "Edit your inputs to plan your next paper." };
  else if (!blocks.length) empty = { Icon: Coffee, title: "Rest day", text: "Recharge. Rest is part of the plan." };

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-3xl p-4 sm:p-6" style={card}>
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--green)", fontFamily: headingFont }}>
              Today&apos;s tasks
            </p>
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-1)", fontFamily: headingFont }}>
              {fmtDate(today, { weekday: "long", day: "numeric", month: "short" })}
            </h2>
          </div>
          {blocks.length > 0 && (
            <p className="text-right text-sm font-semibold" style={{ color: "var(--text-2)" }}>
              <span style={{ color: "var(--text-1)" }}>{doneCount}</span>/{blocks.length} done
              <span className="block text-xs" style={{ color: "var(--text-3)" }}>
                {formatMinutes(minutes)} planned
              </span>
            </p>
          )}
        </div>

        {blocks.length > 0 && (
          <div className="h-2 rounded-full mb-4 overflow-hidden" style={{ background: "var(--bg-3)" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(doneCount / blocks.length) * 100}%`, background: "var(--green)" }} />
          </div>
        )}

        {empty ? (
          <div className="flex items-start gap-3 rounded-2xl px-4 py-5" style={{ background: "var(--bg-3)" }}>
            <empty.Icon className="w-6 h-6 shrink-0" style={{ color: "var(--green)" }} />
            <div>
              <p className="font-bold" style={{ color: "var(--text-1)" }}>
                {empty.title}
              </p>
              <p className="text-sm" style={{ color: "var(--text-2)" }}>
                {empty.text}
              </p>
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {blocks.map((b) => (
              <BlockRow key={b.id} block={b} ctx={ctx} />
            ))}
          </ul>
        )}

        {allDone && (
          <p className="mt-4 rounded-2xl px-4 py-3 text-sm font-semibold text-center" style={{ background: tint(12), color: "var(--text-1)" }}>
            Day complete. That&apos;s how exams are passed, one day at a time.
          </p>
        )}
      </section>

      {catchUp.length > 0 && (
        <section className="rounded-3xl p-4 sm:p-6" style={card}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold" style={{ color: "var(--text-1)", fontFamily: headingFont }}>
              Catch up
            </h3>
            <span className="text-xs font-semibold" style={{ color: "var(--text-3)" }}>
              {catchUp.length} unticked from the last 7 days
            </span>
          </div>
          <div className="flex flex-col">
            {catchUp.slice(0, 6).map(({ b, date }) => (
              <div key={b.id} className="flex items-start gap-2">
                <span className="text-[11px] font-semibold w-14 shrink-0 pt-2" style={{ color: "var(--text-3)" }}>
                  {shortDate(date).replace(/^\w+ /, "")}
                </span>
                <ul className="flex-1 min-w-0">
                  <BlockRow block={b} ctx={ctx} compact />
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {next && (
        <section className="rounded-3xl p-4 sm:p-6" style={card}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-3)", fontFamily: headingFont }}>
            Up next · {shortDate(next.date)}
          </p>
          <ul className="flex flex-col">
            {next.blocks.map((b) => (
              <BlockRow key={b.id} block={b} ctx={ctx} compact />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/* Week */

function DayHeader({ day, date, today }: { day?: PlanDay; date: string; today: string }) {
  const isToday = date === today;
  const phase = day?.phase;
  const tag = phase === "exam" ? "EXAM" : phase === "final" ? "Mocks" : phase === "off" ? "Rest" : null;
  return (
    <div className="flex items-center justify-between gap-2 mb-1">
      <span className="text-sm font-bold" style={{ color: isToday ? "var(--green)" : "var(--text-1)", fontFamily: headingFont }}>
        {WEEKDAYS[weekdayOf(date)]} <span style={{ color: isToday ? "var(--green)" : "var(--text-3)", fontWeight: 600 }}>{fmtDate(date, { day: "numeric", month: "short" })}</span>
      </span>
      {tag && (
        <span
          className="text-[10px] font-bold uppercase tracking-wider rounded px-1.5 py-0.5"
          style={{
            background: phase === "exam" ? "var(--green)" : phase === "final" ? "color-mix(in srgb, var(--gold) 16%, transparent)" : "var(--bg-3)",
            color: phase === "exam" ? "#fff" : phase === "final" ? "var(--gold)" : "var(--text-3)",
          }}
        >
          {tag}
        </span>
      )}
    </div>
  );
}

function WeekView({ plan, today, ctx }: { plan: Plan; today: string; ctx: PlanCtx }) {
  // Weeks run from the plan's start day, so "this week" is always today + the next six days.
  const firstWeek = plan.startDate;
  const lastWeek = weekStartOf(plan.startDate, plan.examDate);
  const [week, setWeek] = useState(() => {
    const w = weekStartOf(plan.startDate, today);
    return w < firstWeek ? firstWeek : w > lastWeek ? lastWeek : w;
  });
  const byDate = useMemo(() => new Map(plan.days.map((d) => [d.date, d])), [plan]);
  const dates = Array.from({ length: 7 }, (_, i) => addDays(week, i));
  const weekBlocks = dates.flatMap((d) => byDate.get(d)?.blocks ?? []);
  const weekDone = weekBlocks.filter((b) => ctx.done[b.id]).length;
  const weekNo = Math.floor(daysBetween(firstWeek, week) / 7) + 1;
  const totalWeeks = Math.floor(daysBetween(firstWeek, lastWeek) / 7) + 1;

  const navBtn = "grid place-items-center rounded-xl w-10 h-10 disabled:opacity-30";
  return (
    <section className="rounded-3xl p-4 sm:p-6" style={card}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <button type="button" className={navBtn} style={{ background: "var(--bg-3)", color: "var(--text-1)" }} onClick={() => setWeek(addDays(week, -7))} disabled={week <= firstWeek} aria-label="Previous week">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="font-bold" style={{ color: "var(--text-1)", fontFamily: headingFont }}>
            Week {weekNo} <span style={{ color: "var(--text-3)", fontWeight: 500 }}>of {totalWeeks}</span>
          </p>
          <p className="text-xs" style={{ color: "var(--text-3)" }}>
            {fmtDate(week, { day: "numeric", month: "short" })} – {fmtDate(addDays(week, 6), { day: "numeric", month: "short" })}
            {weekBlocks.length > 0 && ` · ${weekDone}/${weekBlocks.length} done`}
          </p>
        </div>
        <button type="button" className={navBtn} style={{ background: "var(--bg-3)", color: "var(--text-1)" }} onClick={() => setWeek(addDays(week, 7))} disabled={week >= lastWeek} aria-label="Next week">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {dates.map((date) => {
          const day = byDate.get(date);
          const outside = !day;
          const isToday = date === today;
          return (
            <div
              key={date}
              className="rounded-2xl p-3 sm:px-4 md:grid md:grid-cols-[150px_1fr] md:gap-4 md:items-start"
              style={{
                background: isToday ? tint(8) : "var(--bg-3)",
                border: `1px solid ${isToday ? "var(--green)" : "var(--border)"}`,
                opacity: outside || date < today ? 0.6 : 1,
              }}
            >
              <DayHeader day={day} date={date} today={today} />
              {outside ? (
                <p className="text-xs" style={{ color: "var(--text-3)" }}>
                  Outside your plan
                </p>
              ) : day!.phase === "exam" ? (
                <p className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>
                  Good luck!
                </p>
              ) : day!.blocks.length === 0 ? (
                <p className="text-xs" style={{ color: "var(--text-3)" }}>
                  Rest day
                </p>
              ) : (
                <ul className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-6">
                  {day!.blocks.map((b) => (
                    <BlockRow key={b.id} block={b} ctx={ctx} compact />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* Full plan */

function FullPlan({ plan, today, ctx }: { plan: Plan; today: string; ctx: PlanCtx }) {
  const weeks = useMemo(() => {
    const m = new Map<string, PlanDay[]>();
    for (const d of plan.days) {
      const w = weekStartOf(plan.startDate, d.date);
      m.set(w, [...(m.get(w) ?? []), d]);
    }
    return [...m.entries()];
  }, [plan]);
  const currentWeek = weekStartOf(plan.startDate, today);

  return (
    <div className="flex flex-col gap-2">
      {weeks.map(([w, days], i) => {
        const blocks = days.flatMap((d) => d.blocks);
        const done = blocks.filter((b) => ctx.done[b.id]).length;
        const mins = blocks.reduce((s, b) => s + b.minutes, 0);
        const tag = days.some((d) => d.phase === "final") ? "Mocks" : days.some((d) => d.phase === "exam") ? "Exam" : null;
        return (
          <details key={w} open={w === currentWeek || (i === 0 && currentWeek < w)} className="sp-week rounded-2xl" style={card}>
            <summary className="flex items-center gap-3 px-4 py-3.5 cursor-pointer" style={{ listStyle: "none" }}>
              <span className="min-w-0 sm:flex sm:items-baseline sm:gap-3">
                <span className="block font-bold text-sm whitespace-nowrap" style={{ color: "var(--text-1)", fontFamily: headingFont }}>
                  Week {i + 1}
                </span>
                <span className="block text-xs whitespace-nowrap" style={{ color: "var(--text-3)" }}>
                  {fmtDate(days[0].date, { day: "numeric", month: "short" })} – {fmtDate(days[days.length - 1].date, { day: "numeric", month: "short" })}
                </span>
              </span>
              {tag && (
                <span
                  className="text-[10px] font-bold uppercase tracking-wider rounded px-1.5 py-0.5"
                  style={tag === "Exam" ? { background: "var(--green)", color: "#fff" } : { background: "color-mix(in srgb, var(--gold) 16%, transparent)", color: "var(--gold)" }}
                >
                  {tag}
                </span>
              )}
              <span className="ml-auto text-xs font-semibold tabular-nums whitespace-nowrap" style={{ color: blocks.length && done === blocks.length ? "var(--green)" : "var(--text-2)" }}>
                {blocks.length ? `${done}/${blocks.length} · ${formatMinutes(mins)}` : "—"}
              </span>
              <ChevronDown className="sp-chev w-4 h-4 shrink-0 transition-transform" style={{ color: "var(--text-3)" }} />
            </summary>
            <div className="px-4 pb-4 flex flex-col gap-3">
              {days.map((d) => (
                <div key={d.date} className="pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <DayHeader day={d} date={d.date} today={today} />
                  {d.blocks.length ? (
                    <ul className="flex flex-col">
                      {d.blocks.map((b) => (
                        <BlockRow key={b.id} block={b} ctx={ctx} compact />
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>
                      {d.phase === "exam" ? "Exam day. Good luck!" : "Rest day"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}

/* Stats */

function Stats({ plan }: { plan: Plan }) {
  const t = plan.totals;
  const items = [
    { k: "Chapters", v: String(t.chapters) },
    { k: "Study hours", v: String(Math.round(t.studyMinutes / 60)) },
    { k: "Review sessions", v: String(plan.days.reduce((s, d) => s + d.blocks.filter((b) => b.kind === "review").length, 0)) },
    { k: "Mock exams", v: String(t.mocks) },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {items.map((i) => (
        <div key={i.k} className="rounded-2xl px-4 py-3" style={card}>
          <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--text-1)", fontFamily: headingFont }}>
            {i.v}
          </p>
          <p className="text-xs font-semibold" style={{ color: "var(--text-3)" }}>
            {i.k}
          </p>
        </div>
      ))}
    </div>
  );
}

/* Print */

function PrintPlan({ plan, examName, subjectsById }: { plan: Plan; examName: string; subjectsById: Map<string, CatalogSubject> }) {
  return (
    <div className="sp-print">
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{examName}: study plan</h2>
      <p style={{ margin: "4px 0 12px", fontSize: 12 }}>
        Exam: {longDate(plan.examDate)} · {plan.totals.chapters} chapters · {Math.round(plan.totals.studyMinutes / 60)} study hours · {plan.totals.mocks} mocks ·
        made with thecahub.com/tools/study-planner
      </p>
      <table>
        <thead>
          <tr>
            <th style={{ width: "18%" }}>Day</th>
            <th>Tasks</th>
            <th style={{ width: "9%" }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {plan.days.map((d) => (
            <tr key={d.date} className={d.phase === "exam" ? "sp-print-exam" : d.blocks.length ? "" : "sp-print-rest"}>
              <td>{shortDate(d.date)}</td>
              <td>
                {d.phase === "exam"
                  ? `EXAM DAY: ${examName}`
                  : d.blocks.length
                    ? d.blocks.map((b) => (
                        <div key={b.id}>☐ {blockLabel(b, subjectsById)}</div>
                      ))
                    : "Rest"}
              </td>
              <td>{d.blocks.length ? formatMinutes(d.blocks.reduce((s, b) => s + b.minutes, 0)) : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PrintStyles() {
  return (
    <style>{`
      .sp-print { display: none; }
      .sp-week[open] .sp-chev { transform: rotate(180deg); }
      .sp-week summary::-webkit-details-marker, .sp-faq summary::-webkit-details-marker { display: none; }
      @media print {
        @page { margin: 12mm; }
        html, body { background: #fff !important; color: #000 !important; }
        header, footer, nav, .sp-noprint, ins.adsbygoogle, body > div > button.fixed { display: none !important; }
        .sp-page { padding: 0 !important; min-height: 0 !important; }
        .sp-page > div { padding: 0 !important; max-width: none !important; }
        .sp-print { display: block !important; color: #000; font-family: var(--font-inter), system-ui, sans-serif; }
        .sp-print table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
        .sp-print th, .sp-print td { border: 1px solid #ccc; padding: 4px 6px; text-align: left; vertical-align: top; }
        .sp-print th { background: #f2f2f2; }
        .sp-print tr { break-inside: avoid; }
        .sp-print-rest td { color: #888; }
        .sp-print-exam td { font-weight: 700; background: #f2f2f2; }
      }
    `}</style>
  );
}
