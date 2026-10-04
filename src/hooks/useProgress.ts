"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

export interface ChapterProgress {
    highestScore: number;
    totalQuestionsCompleted: number;
    isCompleted: boolean;
}

export interface MarathonState {
    questionIds: string[];
    currentIndex: number;
    score: number;
    inProgress: boolean;
    subjectId?: string; // ← FIX: scope per subject
}

/**
 * Per-question answer history. Keys are kept short because the whole blob is
 * stored in localStorage and synced to Supabase as-is.
 */
export interface QuestionAttempt {
    /** subject id, e.g. "caf-5" */
    s: string;
    /** chapter number */
    c: number;
    /** total attempts */
    a: number;
    /** correct attempts */
    k: number;
    /** last attempt correct? 1 = yes, 0 = no. 0 means it is on the mistakes list. */
    l: 0 | 1;
    /** last attempt time (ms since epoch) */
    t: number;
}

export interface UserProgressData {
    chapters: Record<number, ChapterProgress>;
    randomMocks: {
        highestScore: number;
        totalAttempted: number;
    };
    marathon: MarathonState;
    flaggedQuestionIds: string[];
    /** Added later — optional so older saved data (and cloud rows) still load. */
    attempts?: Record<string, QuestionAttempt>;
    /** Subject a flagged question belongs to, when known. */
    flagSubjects?: Record<string, string>;
    /** Answers per local day per subject: { "2026-10-04": { "caf-5": 12 } }. Drives the activity heatmap. */
    activity?: Record<string, Record<string, number>>;
}

/** Local calendar date as YYYY-MM-DD. */
export const localDay = (d = new Date()) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Keep the activity log small: ~6 months is plenty for the heatmap. */
const ACTIVITY_KEEP_DAYS = 180;

export interface AuthState {
    email: string;
    token: string;
}

const STORAGE_KEY = 'mcq_gift_progress_v2'; // bumped to avoid v1 conflicts
const AUTH_KEY = 'mcq_gift_auth_v1';

const DEFAULT_PROGRESS: UserProgressData = {
    chapters: {},
    randomMocks: {
        highestScore: 0,
        totalAttempted: 0
    },
    marathon: {
        questionIds: [],
        currentIndex: 0,
        score: 0,
        inProgress: false,
        subjectId: undefined,
    },
    flaggedQuestionIds: [],
    attempts: {},
    flagSubjects: {},
    activity: {},
};

/** Fills in any fields missing from older saved data. */
export function normalizeProgress(raw: unknown): UserProgressData {
    const p = (raw && typeof raw === 'object' ? raw : {}) as Partial<UserProgressData>;
    return {
        ...DEFAULT_PROGRESS,
        ...p,
        chapters: p.chapters && typeof p.chapters === 'object' ? p.chapters : {},
        randomMocks: { ...DEFAULT_PROGRESS.randomMocks, ...(p.randomMocks || {}) },
        marathon: { ...DEFAULT_PROGRESS.marathon, ...(p.marathon || {}) },
        flaggedQuestionIds: Array.isArray(p.flaggedQuestionIds) ? p.flaggedQuestionIds : [],
        attempts: p.attempts && typeof p.attempts === 'object' ? p.attempts : {},
        flagSubjects: p.flagSubjects && typeof p.flagSubjects === 'object' ? p.flagSubjects : {},
        activity: p.activity && typeof p.activity === 'object' ? p.activity : {},
    };
}

/** True when the question is on the student's mistakes list (last answer was wrong). */
export const isMistake = (a: QuestionAttempt | undefined) => !!a && a.l === 0;

/* ─────────────────────────────────────────────────────────────────────────────
 * Shared store. Every component that calls useProgress() reads and writes the
 * same state, so e.g. a flag toggled in MCQCard can no longer be overwritten by
 * QuizInterface saving its own stale copy.
 * ──────────────────────────────────────────────────────────────────────────── */

let state: UserProgressData = DEFAULT_PROGRESS;
let loaded = false;
const listeners = new Set<() => void>();

function readStorage(): UserProgressData {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored ? normalizeProgress(JSON.parse(stored)) : DEFAULT_PROGRESS;
    } catch (e) {
        console.error("Error loading progress from localStorage", e);
        return DEFAULT_PROGRESS;
    }
}

function ensureLoaded() {
    if (loaded || typeof window === 'undefined') return;
    state = readStorage();
    loaded = true;
    // Keep other open tabs in step.
    window.addEventListener('storage', (e) => {
        if (e.key !== STORAGE_KEY) return;
        state = e.newValue ? safeParse(e.newValue) : DEFAULT_PROGRESS;
        listeners.forEach(l => l());
    });
}

function safeParse(raw: string): UserProgressData {
    try { return normalizeProgress(JSON.parse(raw)); } catch { return state; }
}

function setStore(updater: (prev: UserProgressData) => UserProgressData) {
    ensureLoaded();
    const next = updater(state);
    if (next === state) return;
    state = next;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // private mode / quota — keep in memory
    }
    listeners.forEach(l => l());
}

function subscribe(cb: () => void) {
    listeners.add(cb);
    return () => { listeners.delete(cb); };
}
const getSnapshot = () => { ensureLoaded(); return state; };
const getServerSnapshot = () => DEFAULT_PROGRESS;
const getLoaded = () => { ensureLoaded(); return loaded; };
const getServerLoaded = () => false;

/** Merge cloud progress into local: best scores win, flags union, newest attempt per question wins. */
function mergeProgress(local: UserProgressData, cloudRaw: unknown): UserProgressData {
    const cloud = normalizeProgress(cloudRaw);

    const mergedChapters = { ...cloud.chapters };
    for (const [chStr, l] of Object.entries(local.chapters)) {
        const ch = Number(chStr);
        const c = mergedChapters[ch];
        if (!c || l.highestScore > c.highestScore) mergedChapters[ch] = l;
    }

    const mergedFlags = Array.from(new Set([...local.flaggedQuestionIds, ...cloud.flaggedQuestionIds]));

    const mergedAttempts: Record<string, QuestionAttempt> = { ...cloud.attempts };
    for (const [id, l] of Object.entries(local.attempts || {})) {
        const c = mergedAttempts[id];
        if (!c || (l.t || 0) >= (c.t || 0)) mergedAttempts[id] = l;
    }

    // Activity: per day + subject, keep the larger count (the same answers are often on both sides).
    const mergedActivity: Record<string, Record<string, number>> = {};
    for (const src of [cloud.activity || {}, local.activity || {}]) {
        for (const [day, subs] of Object.entries(src)) {
            const out = (mergedActivity[day] ||= {});
            for (const [sid, n] of Object.entries(subs || {})) out[sid] = Math.max(out[sid] || 0, Number(n) || 0);
        }
    }

    return {
        ...local,
        chapters: mergedChapters,
        flaggedQuestionIds: mergedFlags,
        attempts: mergedAttempts,
        activity: mergedActivity,
        flagSubjects: { ...cloud.flagSubjects, ...local.flagSubjects },
        randomMocks: {
            highestScore: Math.max(local.randomMocks.highestScore, cloud.randomMocks.highestScore || 0),
            totalAttempted: local.randomMocks.totalAttempted,
        },
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useProgress(activeSubjectId?: string) {
    const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const isLoaded = useSyncExternalStore(subscribe, getLoaded, getServerLoaded);
    const [auth, setAuth] = useState<AuthState | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    // Load auth state (client-side only)
    useEffect(() => {
        try {
            const storedAuth = window.localStorage.getItem(AUTH_KEY);
            if (storedAuth) setAuth(JSON.parse(storedAuth));
        } catch {
            // ignore
        }
    }, []);

    // Save chapter score
    const saveChapterScore = (chapterNum: number, score: number, totalQuestions: number) => {
        setStore(prev => {
            const currentChapterData = prev.chapters[chapterNum] || { highestScore: 0, totalQuestionsCompleted: 0, isCompleted: false };
            const newHighestScore = Math.max(currentChapterData.highestScore, score);
            return {
                ...prev,
                chapters: {
                    ...prev.chapters,
                    [chapterNum]: {
                        ...currentChapterData,
                        highestScore: newHighestScore,
                        totalQuestionsCompleted: totalQuestions,
                        isCompleted: newHighestScore === totalQuestions
                    }
                }
            };
        });
    };

    // Record a completed random mock
    const saveRandomMockScore = (score: number) => {
        setStore(prev => ({
            ...prev,
            randomMocks: {
                highestScore: Math.max(prev.randomMocks.highestScore, score),
                totalAttempted: prev.randomMocks.totalAttempted + 1
            }
        }));
    };

    // Record a single answered question. Answering correctly removes it from the mistakes list.
    const recordAnswer = useCallback((questionId: string, subjectId: string, chapter: number, correct: boolean) => {
        setStore(prev => {
            const attempts = prev.attempts || {};
            const before = attempts[questionId];
            const day = localDay();
            let activity = prev.activity || {};
            if (!activity[day]) {
                // New day: drop entries older than the retention window.
                const cutoff = localDay(new Date(Date.now() - ACTIVITY_KEEP_DAYS * 86_400_000));
                activity = Object.fromEntries(Object.entries(activity).filter(([d]) => d >= cutoff));
            }
            const today = activity[day] || {};
            activity = { ...activity, [day]: { ...today, [subjectId]: (today[subjectId] || 0) + 1 } };
            return {
                ...prev,
                activity,
                attempts: {
                    ...attempts,
                    [questionId]: {
                        s: subjectId,
                        c: Number(chapter) || 0,
                        a: (before?.a || 0) + 1,
                        k: (before?.k || 0) + (correct ? 1 : 0),
                        l: correct ? 1 : 0,
                        t: Date.now(),
                    },
                },
            };
        });
    }, []);

    // Update marathon state — now includes subjectId
    const updateMarathonState = (questionIds: string[], currentIndex: number, score: number, subjectId?: string) => {
        setStore(prev => ({
            ...prev,
            marathon: {
                questionIds,
                currentIndex,
                score,
                inProgress: true,
                subjectId: subjectId || prev.marathon.subjectId,
            }
        }));
    };

    // Clear marathon state
    const clearMarathonState = () => {
        setStore(prev => ({
            ...prev,
            marathon: DEFAULT_PROGRESS.marathon
        }));
    };

    // Toggle flag for a specific question
    const toggleFlag = (questionId: string, subjectId?: string) => {
        setStore(prev => {
            const flags = prev.flaggedQuestionIds || [];
            const isFlagged = flags.includes(questionId);
            const flagSubjects = { ...(prev.flagSubjects || {}) };
            if (isFlagged) delete flagSubjects[questionId];
            else if (subjectId) flagSubjects[questionId] = subjectId;
            return {
                ...prev,
                flaggedQuestionIds: isFlagged
                    ? flags.filter(id => id !== questionId)
                    : [...flags, questionId],
                flagSubjects,
            };
        });
    };

    /** Remember the subject of flags saved before subjects were recorded. */
    const setFlagSubjects = useCallback((map: Record<string, string>) => {
        setStore(prev => ({ ...prev, flagSubjects: { ...map, ...(prev.flagSubjects || {}) } }));
    }, []);

    const getTotalMasteredPoints = () => {
        let total = 0;
        Object.values(progress.chapters).forEach(ch => { total += ch.highestScore; });
        return total;
    };

    const clearAllProgress = () => {
        if (window.confirm("Are you sure you want to completely erase all your saved MCQ progress?")) {
            localStorage.removeItem(STORAGE_KEY);
            setStore(() => DEFAULT_PROGRESS);
        }
    };

    // ── Cloud Auth ──

    const signIn = useCallback((email: string, token: string) => {
        const authData = { email, token };
        setAuth(authData);
        localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    }, []);

    const signOut = useCallback(() => {
        setAuth(null);
        localStorage.removeItem(AUTH_KEY);
    }, []);

    // Push local progress to cloud for a specific subject. Reads the store at call
    // time so a score saved a moment earlier is included.
    const syncToCloud = useCallback(async (subjectId: string, authOverride?: AuthState) => {
        const a = authOverride || auth;
        if (!a) return;
        setIsSyncing(true);
        try {
            await fetch("/api/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: a.email,
                    token: a.token,
                    subject_id: subjectId,
                    progress: getSnapshot(),
                }),
            });
        } catch (err) {
            console.error("[syncToCloud] error:", err);
        } finally {
            setIsSyncing(false);
        }
    }, [auth]);

    // Pull cloud progress and merge into local for a subject (or every subject when omitted)
    const loadFromCloud = useCallback(async (subjectId?: string, authOverride?: AuthState) => {
        const a = authOverride || auth;
        if (!a) return;
        setIsSyncing(true);
        try {
            const qs = subjectId ? `?subject=${encodeURIComponent(subjectId)}` : "";
            const res = await fetch(`/api/progress${qs}`, {
                headers: { "x-cah-email": a.email, "x-cah-token": a.token },
            });
            const data = await res.json();
            if (!res.ok || !data.progress?.length) return;

            const rows = (data.progress as { progress_json?: unknown }[]).filter(r => r?.progress_json);
            if (!rows.length) return;
            setStore(prev => rows.reduce((acc, row) => mergeProgress(acc, row.progress_json), prev));
        } catch (err) {
            console.error("[loadFromCloud] error:", err);
        } finally {
            setIsSyncing(false);
        }
    }, [auth]);

    return {
        progress,
        isLoaded,
        auth,
        isSyncing,
        saveChapterScore,
        saveRandomMockScore,
        recordAnswer,
        updateMarathonState,
        clearMarathonState,
        toggleFlag,
        setFlagSubjects,
        getTotalMasteredPoints,
        clearAllProgress,
        signIn,
        signOut,
        syncToCloud,
        loadFromCloud,
    };
}
