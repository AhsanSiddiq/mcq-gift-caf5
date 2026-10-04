"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowRight, BarChart3, BookOpen, Bookmark, CalendarDays, CheckCircle2, CloudUpload,
  Flame, Layers, RotateCcw, Shuffle, Target, TrendingDown, Trophy,
} from "lucide-react";
import { useProgress, localDay } from "@/hooks/useProgress";
import EmailLoginModal from "@/components/EmailLoginModal";
import { subjectCode, type BodyId } from "@/data/subjects";
import { BODY_COOKIE, getBody } from "@/data/regions";
import { themeFor } from "@/data/themes";
import { applyBodyTheme } from "@/lib/bodyTheme";
import { dailyBodies, todayPKT } from "@/lib/daily";
import {
  WEAK_MIN_ATTEMPTS, WEAK_THRESHOLD, bodyOfSubject, buildHeatmap, chapterLabel, chapterName, computeStats,
  dailyHref, dailyStoreKey, findSubject, readDailyStreak, subjectHref,
  type ChapterStat, type DailyStreak, type HeatCell, type SubjectStat,
} from "@/lib/progressStats";

const HEADING = { color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" } as const;
const CARD = { background: "var(--bg-2)", border: "1px solid var(--border)" } as const;
const RED = "#f87171";
const AMBER = "#fbbf24";
const BODY_ORDER: BodyId[] = ["icap", "acca", "icai", "cima", "icaew", "ima"];

type Filter = "all" | BodyId;

const pct = (n: number) => `${Math.round(n * 100)}%`;
/** Status colour for accuracy, always shown next to the number itself (never colour alone). */
const accColor = (acc: number) => (acc >= 0.8 ? "var(--green)" : acc >= 0.6 ? AMBER : RED);
const bodyLabel = (id: string) => getBody(id)?.short ?? id.toUpperCase();

interface SubjectMeta { total: number; chapters: { chapter: number; topic: string; count: number }[] }
interface FlagInfo { id: string; subject_id: string; chapter: number; topic: string; preview: string }

/** Make the whole site follow the chosen qualification (accent colour, home page, daily). */
function chooseBody(id: BodyId) {
  document.cookie = `${BODY_COOKIE}=${encodeURIComponent(id)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  applyBodyTheme();
}

/* ── localStorage-backed daily streaks, read without a hydration mismatch ── */
const noop = () => () => {};
function useDailyStreaks(): DailyStreak[] | null {
  const raw = useSyncExternalStore(
    (cb) => {
      window.addEventListener("storage", cb);
      window.addEventListener("cah:daily-changed", cb);
      return () => { window.removeEventListener("storage", cb); window.removeEventListener("cah:daily-changed", cb); };
    },
    () => {
      try { return dailyBodies().map((b) => localStorage.getItem(dailyStoreKey(b)) ?? "").join("\u0000"); }
      catch { return ""; }
    },
    () => null,
  );
  return useMemo(() => {
    if (raw === null) return null;
    const today = todayPKT();
    return dailyBodies().map((b) => readDailyStreak(b, today)).filter((s): s is DailyStreak => s !== null);
  }, [raw]);
}

/** The qualification the visitor is browsing (set on <html data-body> before paint). */
function useCurrentBody(): string {
  return useSyncExternalStore(noop, () => document.documentElement.dataset.body || "icap", () => "icap");
}

/* ── Small presentational pieces ── */

function Bar({ value, label, color = "var(--green)" }: { value: number; label: string; color?: string }) {
  const v = Math.max(0, Math.min(1, value));
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)}
      className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${v * 100}%`, minWidth: v > 0 ? 4 : 0, background: color }} />
    </div>
  );
}

function Ring({ value, size = 128, stroke = 11, label }: { value: number | null; size?: number; stroke?: number; label: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = value === null ? 0 : Math.max(0, Math.min(1, value));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--green)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${c * v} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dasharray 0.8s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
        <span className="font-bold tabular-nums" style={{ ...HEADING, fontSize: size * 0.24, lineHeight: 1 }}>{value === null ? "—" : pct(v)}</span>
        <span className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: "var(--text-3)" }}>accuracy</span>
      </div>
    </div>
  );
}

function StatTile({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-1 min-w-0" style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>
        <span aria-hidden="true" style={{ color: "var(--green)" }}>{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      <div className="font-bold tabular-nums" style={{ ...HEADING, fontSize: "clamp(1.4rem, 5vw, 1.75rem)", lineHeight: 1.15 }}>{value}</div>
      {sub && <div className="text-xs truncate" style={{ color: "var(--text-2)" }}>{sub}</div>}
    </div>
  );
}

function SectionTitle({ id, icon, children, aside }: { id: string; icon: React.ReactNode; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <h2 id={id} className="font-bold text-lg flex items-center gap-2" style={HEADING}>
        <span aria-hidden="true" style={{ color: "var(--green)" }}>{icon}</span>{children}
      </h2>
      {aside}
    </div>
  );
}

const HEAT_STEPS = [0, 1, 10, 25, 50];
function heatLevel(n: number) {
  let l = 0;
  for (let i = 1; i < HEAT_STEPS.length; i++) if (n >= HEAT_STEPS[i]) l = i;
  return l;
}
const heatBg = (l: number) => (l === 0 ? "var(--bg-3)" : `color-mix(in srgb, var(--green) ${[0, 30, 55, 78, 100][l]}%, var(--bg-3))`);

function Heatmap({ cols }: { cols: HeatCell[][] }) {
  const days = cols.flat().filter((c) => !c.future);
  const active = days.filter((c) => c.count > 0 || c.daily).length;
  const total = days.reduce((n, c) => n + c.count, 0);
  const today = localDay();
  const fmt = (d: string) => new Date(d + "T12:00:00").toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
  const months = cols.map((col, i) => {
    const first = new Date(col[0].day + "T12:00:00");
    const prev = i > 0 ? new Date(cols[i - 1][0].day + "T12:00:00") : null;
    return !prev || prev.getMonth() !== first.getMonth() ? first.toLocaleDateString(undefined, { month: "short" }) : "";
  });
  return (
    <div>
      <div className="flex gap-2" role="img" aria-label={`Active on ${active} of the last ${days.length} days, ${total} answers in total.`}>
        <div className="grid gap-1 text-[10px] pt-5" style={{ gridTemplateRows: "repeat(7, 1fr)", color: "var(--text-3)" }} aria-hidden="true">
          {["Mon", "", "Wed", "", "Fri", "", "Sun"].map((d, i) => <span key={i} className="leading-none flex items-center">{d}</span>)}
        </div>
        <div className="flex-1 min-w-0" aria-hidden="true">
          <div className="grid gap-1 mb-1 text-[10px]" style={{ gridTemplateColumns: `repeat(${cols.length}, 1fr)`, color: "var(--text-3)", height: 16 }}>
            {months.map((m, i) => <span key={i} className="whitespace-nowrap">{m}</span>)}
          </div>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols.length}, 1fr)` }}>
            {cols.map((col, i) => (
              <div key={i} className="grid gap-1">
                {col.map((c) => (
                  <div key={c.day}
                    title={c.future ? undefined : `${fmt(c.day)}: ${c.count} answer${c.count === 1 ? "" : "s"}${c.daily ? " · daily challenge ✓" : ""}`}
                    className="rounded-[4px] relative"
                    style={{
                      aspectRatio: "1 / 1",
                      maxHeight: 30,
                      background: c.future ? "transparent" : heatBg(heatLevel(c.count)),
                      border: c.day === today ? "1.5px solid var(--text-2)" : c.future ? "1px dashed var(--border)" : "1px solid var(--border)",
                    }}>
                    {c.daily && <span className="absolute rounded-full" style={{ width: 6, height: 6, right: 2, top: 2, background: AMBER, boxShadow: "0 0 0 1.5px var(--bg-2)" }} />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-[11px]" style={{ color: "var(--text-3)" }}>
        <span className="flex items-center gap-1.5">
          <span className="rounded-full inline-block" style={{ width: 7, height: 7, background: AMBER }} aria-hidden="true" /> Daily challenge played
        </span>
        <span className="flex items-center gap-1" aria-hidden="true">
          Less {[0, 1, 2, 3, 4].map((l) => <span key={l} className="inline-block rounded-[3px]" style={{ width: 11, height: 11, background: heatBg(l), border: "1px solid var(--border)" }} />)} More
        </span>
      </div>
      <p className="sr-only">Active on {active} of the last {days.length} days.</p>
    </div>
  );
}

function SubjectCard({ s, meta }: { s: SubjectStat; meta?: SubjectMeta }) {
  const total = meta?.total;
  const coverage = total ? s.questions / total : 0;
  const todo = s.mistakes + s.flagged;
  const chapters = meta?.chapters ?? s.chapters.map((c) => ({ chapter: c.chapter, topic: chapterLabel(s.subject.id, c.chapter), count: 0 }));
  const byCh = new Map(s.chapters.map((c) => [c.chapter, c]));
  return (
    <li className="rounded-2xl p-5 flex flex-col gap-4 min-w-0" style={CARD}>
      <div className="flex items-start justify-between gap-3">
        <Link href={s.href} className="min-w-0" style={{ textDecoration: "none" }}>
          <span className="inline-block text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-2"
            style={{ color: "var(--green)", background: "color-mix(in srgb, var(--green) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--green) 22%, transparent)" }}>
            {subjectCode(s.subject)}
          </span>
          <span className="block font-bold leading-snug" style={HEADING}>{s.subject.title}</span>
        </Link>
        <span className="shrink-0 text-right">
          <span className="block font-black tabular-nums text-xl" style={{ color: accColor(s.accuracy), fontFamily: "var(--font-space-grotesk), sans-serif" }}>{pct(s.accuracy)}</span>
          <span className="block text-[11px]" style={{ color: "var(--text-3)" }}>accuracy</span>
        </span>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-2)" }}>
          <span>Bank covered</span>
          <span className="tabular-nums font-semibold">{total ? `${s.questions} / ${total}` : `${s.questions} answered`}</span>
        </div>
        <Bar value={coverage} label={`${subjectCode(s.subject)}: ${total ? pct(coverage) : s.questions} of the question bank answered`} />
      </div>

      {/* Chapter accuracy strip: one bar per chapter, height = accuracy */}
      {chapters.length > 0 && (
        <div>
          <div className="text-xs mb-1.5" style={{ color: "var(--text-2)" }}>Accuracy by chapter</div>
          <div className="flex items-end gap-[3px] h-12" role="img"
            aria-label={`Chapter accuracy: ${s.chapters.map((c) => `${chapterLabel(s.subject.id, c.chapter)} ${pct(c.accuracy)}`).join(", ") || "no answers yet"}`}>
            {chapters.map((c) => {
              const st = byCh.get(c.chapter);
              const h = st ? Math.max(0.08, st.accuracy) : 0;
              return (
                <div key={c.chapter} className="flex-1 min-w-[3px] h-full flex items-end rounded-[3px]" style={{ background: "var(--bg-3)" }}
                  title={`${chapterLabel(s.subject.id, c.chapter)} · ${c.topic}: ${st ? `${pct(st.accuracy)} over ${st.attempts} answers` : "not started"}`}>
                  {st && <div className="w-full rounded-[3px]" style={{ height: `${h * 100}%`, background: accColor(st.accuracy) }} />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-auto">
        <Link href={s.href} className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-bold rounded-xl px-3 py-2.5"
          style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-1)", textDecoration: "none" }}>
          Practise <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
        {todo > 0 && (
          <Link href={`${s.href}/quiz?mode=mistakes`} className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-bold rounded-xl px-3 py-2.5"
            style={{ background: "rgba(248,113,113,0.10)", border: "1px solid rgba(248,113,113,0.3)", color: RED, textDecoration: "none" }}>
            <RotateCcw className="w-4 h-4" aria-hidden="true" /> Review {todo}
          </Link>
        )}
      </div>
    </li>
  );
}

/* ── Page ── */

export default function DashboardClient() {
  const { progress, isLoaded, auth, signIn, loadFromCloud, isSyncing, setFlagSubjects } = useProgress();
  const [showLogin, setShowLogin] = useState(false);
  const [meta, setMeta] = useState<Record<string, SubjectMeta>>({});
  const [flagInfo, setFlagInfo] = useState<Record<string, FlagInfo>>({});
  const [filter, setFilter] = useState<Filter>("all");
  const streaks = useDailyStreaks();
  const themeBody = useCurrentBody();

  // Signed in: pull every synced subject row once and merge it into local progress.
  useEffect(() => {
    if (auth && isLoaded) loadFromCloud();
  }, [auth, isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const flags = useMemo(() => progress.flaggedQuestionIds || [], [progress.flaggedQuestionIds]);

  // Look up flagged questions (subject + preview). Also backfills subjects for old flags.
  const flagKey = flags.slice(0, 200).join(",");
  useEffect(() => {
    if (!isLoaded || !flagKey) return;
    let cancelled = false;
    fetch(`/api/questions/lookup?ids=${encodeURIComponent(flagKey)}`)
      .then((r) => (r.ok ? r.json() : { questions: [] }))
      .then((d: { questions: FlagInfo[] }) => {
        if (cancelled) return;
        const map: Record<string, FlagInfo> = {};
        for (const q of d.questions || []) map[q.id] = q;
        setFlagInfo(map);
        const missing: Record<string, string> = {};
        for (const q of d.questions || []) if (!progress.flagSubjects?.[q.id]) missing[q.id] = q.subject_id;
        if (Object.keys(missing).length) setFlagSubjects(missing);
      })
      .catch(() => { /* previews are optional */ });
    return () => { cancelled = true; };
  }, [isLoaded, flagKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const flagSubjects = useMemo(() => {
    const m: Record<string, string> = { ...(progress.flagSubjects || {}) };
    for (const q of Object.values(flagInfo)) if (!m[q.id]) m[q.id] = q.subject_id;
    return m;
  }, [progress.flagSubjects, flagInfo]);

  // Every qualification the student has touched (answers, flags, activity or a daily streak).
  const bodies = useMemo(() => {
    const set = new Set<string>();
    for (const a of Object.values(progress.attempts || {})) { const b = bodyOfSubject(a.s); if (b) set.add(b); }
    for (const sid of Object.values(flagSubjects)) { const b = bodyOfSubject(sid); if (b) set.add(b); }
    for (const s of streaks || []) if (s.last) set.add(s.body);
    return BODY_ORDER.filter((b) => set.has(b));
  }, [progress.attempts, flagSubjects, streaks]);

  // A filter for a qualification the student no longer has falls back to "All".
  const active: Filter = filter !== "all" && !bodies.includes(filter) ? "all" : filter;
  const include = useMemo(
    () => (active === "all" ? undefined : (sid: string) => bodyOfSubject(sid) === active),
    [active]
  );

  const stats = useMemo(() => computeStats(progress, flagSubjects, include), [progress, flagSubjects, include]);
  const allStats = useMemo(() => computeStats(progress, flagSubjects), [progress, flagSubjects]);

  // Chapter names + bank sizes for every subject the student has touched (fetched once, not per filter).
  const subjectKey = allStats.subjects.map((s) => s.subject.id).sort().join(",");
  useEffect(() => {
    if (!subjectKey) return;
    let cancelled = false;
    Promise.all(subjectKey.split(",").map((id) =>
      fetch(`/api/subjects-meta?subject=${encodeURIComponent(id)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => [id, d?.subjects?.[id]] as const)
        .catch(() => [id, undefined] as const)
    )).then((rows) => {
      if (cancelled) return;
      const next: Record<string, SubjectMeta> = {};
      for (const [id, m] of rows) if (m) next[id] = m;
      setMeta(next);
    });
    return () => { cancelled = true; };
  }, [subjectKey]);

  const topic = (c: Pick<ChapterStat, "subjectId" | "chapter">) =>
    meta[c.subjectId]?.chapters.find((x) => x.chapter === c.chapter)?.topic;

  const pickFilter = (f: Filter) => {
    setFilter(f);
    if (f !== "all") chooseBody(f);
  };

  const shownStreaks = useMemo(() => (streaks || []).filter((s) => active === "all" || s.body === active), [streaks, active]);
  const dailyDays = useMemo(() => new Set(shownStreaks.flatMap((s) => s.days)), [shownStreaks]);
  const heat = useMemo(() => buildHeatmap(progress.activity || {}, dailyDays, include, 8), [progress.activity, dailyDays, include]);
  const activeDays = heat.flat().filter((c) => !c.future && (c.count > 0 || c.daily)).length;

  const playedDaily = (streaks || []).some((s) => s.last);
  const hasActivity = allStats.attempts > 0 || flags.length > 0 || playedDaily;
  const legacyScores = Object.keys(progress.chapters || {}).length > 0;

  const bestStreak = shownStreaks.reduce((m, s) => Math.max(m, s.best), 0);
  const currentStreak = shownStreaks.reduce((m, s) => Math.max(m, s.current), 0);
  const homeBody = active !== "all" ? active : (dailyBodies() as string[]).includes(themeBody) ? themeBody : "icap";
  const homeStreak = (streaks || []).find((s) => s.body === homeBody);

  /* ── Loading ── */
  if (!isLoaded || streaks === null) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-20 animate-pulse" aria-busy="true" aria-label="Loading your progress">
        <span className="block rounded mb-3" style={{ height: 12, width: 90, background: "var(--border)" }} />
        <span className="block rounded mb-6" style={{ height: 32, width: "60%", background: "var(--border)" }} />
        <span className="block rounded-full mb-6" style={{ height: 40, width: "70%", background: "var(--border)" }} />
        <div className="rounded-3xl mb-6" style={{ ...CARD, height: 190 }} />
        <div className="rounded-2xl" style={{ ...CARD, height: 120 }} />
      </div>
    );
  }

  const loginModal = (
    <EmailLoginModal
      isOpen={showLogin}
      onClose={() => setShowLogin(false)}
      onSuccess={(email, token) => { signIn(email, token); loadFromCloud(undefined, { email, token }); }}
    />
  );

  /* ── Empty state ── */
  if (!hasActivity) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {loginModal}
        <div className="rounded-3xl p-6 sm:p-10 text-center" style={CARD}>
          <div className="mx-auto mb-5 rounded-2xl flex items-center justify-center"
            style={{ width: 64, height: 64, background: "color-mix(in srgb, var(--green) 12%, transparent)", color: "var(--green)" }}>
            <BarChart3 className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="font-bold mb-3" style={{ ...HEADING, fontSize: "clamp(1.6rem, 5vw, 2.2rem)", lineHeight: 1.15 }}>
            Your progress lives here
          </h1>
          <p className="mb-8 mx-auto" style={{ color: "var(--text-2)", maxWidth: 460, lineHeight: 1.65 }}>
            Answer a few questions and this page fills in: your accuracy, progress in every subject,
            the chapters dragging your score down, and a one-click review of everything you got wrong.
          </p>
          {legacyScores && (
            <p className="text-sm mb-6 rounded-xl px-4 py-3" style={{ background: "var(--bg-3)", color: "var(--text-2)" }}>
              Your earlier chapter scores are safe. Detailed per-question stats start with your next quiz.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/practice" className="inline-flex items-center justify-center gap-2 font-bold rounded-xl px-6 py-3.5 text-white"
              style={{ background: "var(--green)", textDecoration: "none", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              <BookOpen className="w-4 h-4" aria-hidden="true" /> Start practising
            </Link>
            <Link href={dailyHref(homeBody)} className="inline-flex items-center justify-center gap-2 font-bold rounded-xl px-6 py-3.5"
              style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-1)", textDecoration: "none", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              <Flame className="w-4 h-4" aria-hidden="true" style={{ color: AMBER }} /> Today&apos;s Daily Challenge
            </Link>
          </div>
          {!auth && (
            <button onClick={() => setShowLogin(true)} className="mt-6 inline-flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer"
              style={{ color: "var(--green)", background: "none", border: "none" }}>
              <CloudUpload className="w-4 h-4 shrink-0" aria-hidden="true" /> Practising on another device? Sign in to load it
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── Recommendation (follows the active filter) ── */
  const scope = active === "all" ? "" : ` ${bodyLabel(active)}`;
  const weakToDrill = stats.weakest.find((c) => c.accuracy < WEAK_THRESHOLD);
  const mostMistakes = [...stats.subjects].sort((a, b) => b.mistakes + b.flagged - (a.mistakes + a.flagged))[0];
  const mostRecent = stats.subjects[0];

  let rec: { title: string; detail: string; href: string; cta: string; icon: React.ReactNode };
  if (weakToDrill) {
    const s = findSubject(weakToDrill.subjectId)!;
    const t = topic(weakToDrill);
    rec = {
      title: `Drill ${chapterName(weakToDrill.subjectId, weakToDrill.chapter)} — ${pct(weakToDrill.accuracy)} accuracy`,
      detail: `${t ? `${t}. ` : ""}It's your weakest${scope} chapter over ${weakToDrill.attempts} answers. One focused pass usually lifts it fast.`,
      href: `${subjectHref(s)}/quiz?mode=topical&chapter=${weakToDrill.chapter}`,
      cta: "Drill this chapter",
      icon: <Target className="w-4 h-4" />,
    };
  } else if (mostMistakes && mostMistakes.mistakes + mostMistakes.flagged > 0) {
    const n = mostMistakes.mistakes + mostMistakes.flagged;
    rec = {
      title: `Clear ${n} ${subjectCode(mostMistakes.subject)} question${n === 1 ? "" : "s"} you missed or flagged`,
      detail: "Answer them correctly in review and they drop off your list for good.",
      href: `${mostMistakes.href}/quiz?mode=mistakes`,
      cta: "Review mistakes",
      icon: <RotateCcw className="w-4 h-4" />,
    };
  } else if (!homeStreak?.playedToday) {
    rec = {
      title: homeStreak?.current ? `Keep your ${homeStreak.current}-day ${bodyLabel(homeBody)} streak alive` : `Start a ${bodyLabel(homeBody)} daily streak today`,
      detail: "Ten questions, the same for everyone, about five minutes. Today's challenge is waiting.",
      href: dailyHref(homeBody),
      cta: "Play today's Daily",
      icon: <Flame className="w-4 h-4" />,
    };
  } else if (mostRecent) {
    rec = {
      title: `Take a ${subjectCode(mostRecent.subject)} random mock`,
      detail: "No weak spots or open mistakes right now. Test yourself across the whole syllabus.",
      href: `${mostRecent.href}/quiz?mode=random`,
      cta: "Start mock",
      icon: <Shuffle className="w-4 h-4" />,
    };
  } else {
    rec = {
      title: `Pick a${scope} subject and start a chapter`,
      detail: "Your streak is safe for today. Build up some answers so we can find your weak spots.",
      href: "/practice",
      cta: "Browse subjects",
      icon: <BookOpen className="w-4 h-4" />,
    };
  }

  const reviewSubjects = stats.subjects.filter((s) => s.mistakes + s.flagged > 0)
    .sort((a, b) => b.mistakes + b.flagged - (a.mistakes + a.flagged));
  const flaggedList = flags
    .filter((id) => !include || (flagSubjects[id] && include(flagSubjects[id])))
    .map((id) => flagInfo[id]).filter((q): q is FlagInfo => !!q).slice(0, 6);
  const playedStreaks = shownStreaks.filter((s) => s.last);

  const chips: { id: Filter; label: string }[] = [{ id: "all", label: "All" }, ...bodies.map((b) => ({ id: b as Filter, label: bodyLabel(b) }))];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-20">
      {loginModal}

      {/* Header */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            My progress
          </p>
          <h1 className="font-bold" style={{ ...HEADING, fontSize: "clamp(1.75rem, 5vw, 2.5rem)", lineHeight: 1.15 }}>
            Your study dashboard
          </h1>
        </div>
        {auth ? (
          <span className="self-start sm:self-auto text-xs font-medium px-3 py-1.5 rounded-full max-w-full truncate" role="status"
            style={{ background: "color-mix(in srgb, var(--green) 10%, transparent)", color: "var(--green)", border: "1px solid color-mix(in srgb, var(--green) 20%, transparent)" }}>
            {isSyncing ? "Syncing…" : `☁ Synced · ${auth.email}`}
          </span>
        ) : (
          <button onClick={() => setShowLogin(true)}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
            style={{ background: "color-mix(in srgb, var(--green) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--green) 25%, transparent)", color: "var(--green)" }}>
            <CloudUpload className="w-4 h-4" aria-hidden="true" /> Save progress to email
          </button>
        )}
      </div>

      {/* Qualification switcher */}
      <div role="group" aria-label="Filter by qualification"
        className="flex gap-1.5 p-1.5 rounded-2xl mb-6 overflow-x-auto max-w-full w-fit"
        style={{ background: "var(--bg-2)", border: "1px solid var(--border)", scrollbarWidth: "none" }}>
        {chips.map((c) => {
          const on = c.id === active;
          return (
            <button key={c.id} type="button" aria-pressed={on} onClick={() => pickFilter(c.id)}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold cursor-pointer transition-colors"
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                background: on ? "var(--green)" : "transparent",
                color: on ? "#fff" : "var(--text-2)",
                border: "1px solid transparent",
              }}>
              {c.id === "all"
                ? <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                : <span aria-hidden="true" className="inline-block rounded-full" style={{ width: 8, height: 8, background: themeFor(c.id).accent, boxShadow: on ? "0 0 0 1.5px #fff" : "none" }} />}
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Hero: ring + headline numbers */}
      <section aria-label="Overview" className="rounded-3xl p-5 sm:p-6 mb-6 flex flex-col md:flex-row md:items-center gap-5 md:gap-7 relative overflow-hidden"
        style={{ background: "radial-gradient(120% 140% at 0% 0%, color-mix(in srgb, var(--green) 14%, var(--bg-2)) 0%, var(--bg-2) 60%)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-5">
          <Ring value={stats.attempts ? stats.accuracy : null}
            label={stats.attempts ? `Accuracy ${pct(stats.accuracy)}: ${stats.correct} of ${stats.attempts} answers correct` : "No answers yet"} />
          <div className="md:hidden min-w-0">
            <p className="font-bold" style={{ ...HEADING, fontSize: 18 }}>{active === "all" ? "All qualifications" : bodyLabel(active)}</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>
              {stats.attempts ? `${stats.correct.toLocaleString()} of ${stats.attempts.toLocaleString()} answers correct` : "No answers here yet"}
            </p>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="hidden md:block font-bold mb-3" style={{ ...HEADING, fontSize: 18 }}>
            {active === "all" ? "All qualifications" : bodyLabel(active)}
            <span className="font-normal text-sm ml-2" style={{ color: "var(--text-2)" }}>
              {stats.attempts ? `${stats.correct.toLocaleString()} of ${stats.attempts.toLocaleString()} answers correct` : "No answers here yet"}
            </span>
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            <StatTile icon={<BookOpen className="w-3.5 h-3.5" />} label="Answered" value={stats.questions.toLocaleString()}
              sub={stats.attempts > stats.questions ? `${stats.attempts.toLocaleString()} incl. retries` : "unique questions"} />
            <StatTile icon={<Flame className="w-3.5 h-3.5" />} label="Streak" value={`${currentStreak} day${currentStreak === 1 ? "" : "s"}`}
              sub={`Best: ${bestStreak}`} />
            <StatTile icon={<RotateCcw className="w-3.5 h-3.5" />} label="To review" value={String(stats.mistakes)}
              sub={`mistakes · ${stats.flagged} flagged`} />
            <StatTile icon={<CalendarDays className="w-3.5 h-3.5" />} label="Active days" value={String(activeDays)}
              sub="in the last 8 weeks" />
          </div>
        </div>
      </section>

      {/* What to do next */}
      <section aria-labelledby="next-step" className="rounded-2xl p-5 sm:p-6 mb-6"
        style={{ background: "color-mix(in srgb, var(--green) 7%, var(--bg-2))", border: "1px solid color-mix(in srgb, var(--green) 35%, transparent)" }}>
        <p className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: "var(--green)" }}>
          <span aria-hidden="true">{rec.icon}</span> What to do next
        </p>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex-1 min-w-0">
            <h2 id="next-step" className="font-bold mb-1.5" style={{ ...HEADING, fontSize: "clamp(1.2rem, 4vw, 1.5rem)", lineHeight: 1.25 }}>{rec.title}</h2>
            <p className="text-sm" style={{ color: "var(--text-2)", lineHeight: 1.6 }}>{rec.detail}</p>
          </div>
          <Link href={rec.href} className="shrink-0 inline-flex items-center justify-center gap-2 font-bold rounded-xl px-6 py-3.5 text-white"
            style={{ background: "var(--green)", textDecoration: "none", fontFamily: "var(--font-space-grotesk), sans-serif", boxShadow: "0 4px 20px color-mix(in srgb, var(--green) 30%, transparent)" }}>
            {rec.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Mistakes review */}
      <section aria-labelledby="review-title" className="rounded-2xl p-5 sm:p-6 mb-6" style={CARD}>
        <SectionTitle id="review-title" icon={<RotateCcw className="w-5 h-5" />}>Mistakes review</SectionTitle>
        {reviewSubjects.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            {stats.attempts ? "Nothing to review — every question you've answered was right the last time. 🎯" : "Questions you get wrong or flag will collect here."}
          </p>
        ) : (
          <>
            <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>
              Every question you got wrong, plus the ones you flagged. Get it right in review and it leaves the list.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {reviewSubjects.map((s) => (
                <li key={s.subject.id}>
                  <Link href={`${s.href}/quiz?mode=mistakes`}
                    className="group flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 h-full"
                    style={{ background: "var(--bg-3)", border: "1px solid var(--border)", textDecoration: "none" }}>
                    <span className="min-w-0">
                      <span className="block font-bold text-sm truncate" style={HEADING}>
                        {subjectCode(s.subject)} <span style={{ color: "var(--text-2)", fontWeight: 500 }}>· {s.subject.title}</span>
                      </span>
                      <span className="block text-xs mt-0.5" style={{ color: "var(--text-2)" }}>
                        {s.mistakes > 0 && <><span style={{ color: RED, fontWeight: 700 }}>{s.mistakes}</span> wrong</>}
                        {s.mistakes > 0 && s.flagged > 0 && " · "}
                        {s.flagged > 0 && <><span style={{ color: AMBER, fontWeight: 700 }}>{s.flagged}</span> flagged</>}
                      </span>
                    </span>
                    <span className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--green)" }}>
                      Review {s.mistakes + s.flagged} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* Subjects */}
      <section aria-labelledby="subjects-title" className="mb-6">
        <SectionTitle id="subjects-title" icon={<BarChart3 className="w-5 h-5" />}
          aside={<Link href="/practice" className="text-sm font-bold" style={{ color: "var(--green)", textDecoration: "none" }}>All subjects →</Link>}>
          Subjects
        </SectionTitle>
        {stats.subjects.length === 0 ? (
          <p className="rounded-2xl p-5 text-sm" style={{ ...CARD, color: "var(--text-2)" }}>
            No {active === "all" ? "" : `${bodyLabel(active)} `}subjects practised yet.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.subjects.map((s) => <SubjectCard key={s.subject.id} s={s} meta={meta[s.subject.id]} />)}
          </ul>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Activity + streak */}
        <section aria-labelledby="activity-title" className="rounded-2xl p-5 sm:p-6" style={CARD}>
          <SectionTitle id="activity-title" icon={<CalendarDays className="w-5 h-5" />}>Activity</SectionTitle>
          <div className="flex gap-3 mb-5">
            <div className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 flex-1 min-w-0" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)" }}>
              <Flame className="w-5 h-5 shrink-0" style={{ color: AMBER }} aria-hidden="true" />
              <div className="min-w-0">
                <div className="font-black tabular-nums leading-none" style={{ ...HEADING, fontSize: 20 }}>{currentStreak}</div>
                <div className="text-xs truncate" style={{ color: "var(--text-2)" }}>current streak</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 flex-1 min-w-0" style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
              <Trophy className="w-5 h-5 shrink-0" style={{ color: "var(--gold)" }} aria-hidden="true" />
              <div className="min-w-0">
                <div className="font-black tabular-nums leading-none" style={{ ...HEADING, fontSize: 20 }}>{bestStreak}</div>
                <div className="text-xs truncate" style={{ color: "var(--text-2)" }}>best streak</div>
              </div>
            </div>
          </div>
          <Heatmap cols={heat} />
          {playedStreaks.length > 1 && (
            <ul className="flex flex-col gap-1.5 mt-4 text-sm">
              {playedStreaks.map((s) => (
                <li key={s.body} className="flex justify-between gap-3" style={{ color: "var(--text-2)" }}>
                  <span>{bodyLabel(s.body)} Daily</span>
                  <span className="tabular-nums">{s.current} now · best {s.best}{s.playedToday ? " · ✓ today" : ""}</span>
                </li>
              ))}
            </ul>
          )}
          <Link href={dailyHref(homeBody)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--green)", textDecoration: "none" }}>
            {homeStreak?.playedToday ? `See today's ${bodyLabel(homeBody)} result` : `Play today's ${bodyLabel(homeBody)} challenge`} <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </section>

        {/* Weakest chapters */}
        <section aria-labelledby="weak-title" className="rounded-2xl p-5 sm:p-6" style={CARD}>
          <SectionTitle id="weak-title" icon={<TrendingDown className="w-5 h-5" />}>Weakest chapters</SectionTitle>
          {stats.weakest.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-2)" }}>
              Answer at least {WEAK_MIN_ATTEMPTS} questions in a chapter and it shows up here, ranked by accuracy.
            </p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {stats.weakest.map((c) => {
                const s = findSubject(c.subjectId)!;
                const t = topic(c);
                return (
                  <li key={`${c.subjectId}-${c.chapter}`}>
                    <Link href={`${subjectHref(s)}/quiz?mode=topical&chapter=${c.chapter}`}
                      className="group block rounded-xl px-4 py-3" style={{ background: "var(--bg-3)", border: "1px solid var(--border)", textDecoration: "none" }}>
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>
                            {subjectCode(s)} · {chapterLabel(c.subjectId, c.chapter)}
                          </span>
                          <span className="block text-sm font-semibold truncate" style={{ color: "var(--text-1)" }}>{t || chapterLabel(c.subjectId, c.chapter)}</span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block font-black tabular-nums" style={{ color: accColor(c.accuracy), fontFamily: "var(--font-space-grotesk), sans-serif" }}>{pct(c.accuracy)}</span>
                          <span className="block text-[11px]" style={{ color: "var(--text-3)" }}>{c.attempts} answers</span>
                        </span>
                      </span>
                      <span className="block mt-2"><Bar value={c.accuracy} label={`${chapterName(c.subjectId, c.chapter)} accuracy`} color={accColor(c.accuracy)} /></span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Flagged */}
      <section aria-labelledby="flag-title" className="rounded-2xl p-5 sm:p-6" style={CARD}>
        <SectionTitle id="flag-title" icon={<Bookmark className="w-5 h-5" />}
          aside={stats.flagged > 0 ? <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(251,191,36,0.12)", color: AMBER }}>{stats.flagged}</span> : undefined}>
          Flagged questions
        </SectionTitle>
        {stats.flagged === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            Tap the bookmark on any question to save it for later. Flagged questions are included in mistakes review.
          </p>
        ) : (
          <>
            {flaggedList.length > 0 && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {flaggedList.map((q) => {
                  const s = findSubject(q.subject_id);
                  return (
                    <li key={q.id} className="rounded-xl px-3.5 py-2.5" style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
                      <span className="block text-[11px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "var(--text-3)" }}>
                        {s ? subjectCode(s) : q.subject_id} · {chapterLabel(q.subject_id, q.chapter)}
                      </span>
                      <span className="block text-sm line-clamp-2" style={{ color: "var(--text-2)" }}>{q.preview}</span>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="flex flex-wrap gap-2">
              {stats.subjects.filter((s) => s.flagged > 0).map((s) => (
                <Link key={s.subject.id} href={`${s.href}/quiz?mode=flagged`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold rounded-lg px-3 py-2"
                  style={{ background: "rgba(251,191,36,0.10)", border: "1px solid rgba(251,191,36,0.3)", color: AMBER, textDecoration: "none" }}>
                  Review {s.flagged} {subjectCode(s.subject)} flag{s.flagged === 1 ? "" : "s"}
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      <p className="mt-10 text-xs text-center flex items-center justify-center gap-1.5" style={{ color: "var(--text-3)" }}>
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        {auth
          ? "Progress is saved in this browser and synced to your email when you finish a quiz."
          : "Progress is saved in this browser. Sign in with your email to keep it across devices."}
      </p>
    </div>
  );
}
