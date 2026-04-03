"use client";

import { useState, useEffect, useCallback } from 'react';

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

export interface UserProgressData {
    chapters: Record<number, ChapterProgress>;
    randomMocks: {
        highestScore: number;
        totalAttempted: number;
    };
    marathon: MarathonState;
    flaggedQuestionIds: string[];
}

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
    flaggedQuestionIds: []
};

export function useProgress(activeSubjectId?: string) {
    const [progress, setProgress] = useState<UserProgressData>(DEFAULT_PROGRESS);
    const [isLoaded, setIsLoaded] = useState(false);
    const [auth, setAuth] = useState<AuthState | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    // Load from localStorage on mount (client-side only)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const stored = window.localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setProgress({ ...DEFAULT_PROGRESS, ...parsed });
                } else {
                    setProgress(DEFAULT_PROGRESS);
                }
            } catch (e) {
                console.error("Error loading progress from localStorage", e);
                setProgress(DEFAULT_PROGRESS);
            }

            // Load auth state
            try {
                const storedAuth = window.localStorage.getItem(AUTH_KEY);
                if (storedAuth) {
                    setAuth(JSON.parse(storedAuth));
                }
            } catch {
                // ignore
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever progress changes (debounced for performance)
    useEffect(() => {
        if (!isLoaded) return;
        const timeoutId = setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        }, 800);
        return () => clearTimeout(timeoutId);
    }, [progress, isLoaded]);

    // Save chapter score
    const saveChapterScore = (chapterNum: number, score: number, totalQuestions: number) => {
        setProgress(prev => {
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
        setProgress(prev => ({
            ...prev,
            randomMocks: {
                highestScore: Math.max(prev.randomMocks.highestScore, score),
                totalAttempted: prev.randomMocks.totalAttempted + 1
            }
        }));
    };

    // Update marathon state — now includes subjectId
    const updateMarathonState = (questionIds: string[], currentIndex: number, score: number, subjectId?: string) => {
        setProgress(prev => ({
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
        setProgress(prev => ({
            ...prev,
            marathon: DEFAULT_PROGRESS.marathon
        }));
    };

    // Toggle flag for a specific question
    const toggleFlag = (questionId: string) => {
        setProgress(prev => {
            const isFlagged = (prev.flaggedQuestionIds || []).includes(questionId);
            return {
                ...prev,
                flaggedQuestionIds: isFlagged
                    ? prev.flaggedQuestionIds.filter(id => id !== questionId)
                    : [...(prev.flaggedQuestionIds || []), questionId]
            };
        });
    };

    const getTotalMasteredPoints = () => {
        let total = 0;
        Object.values(progress.chapters).forEach(ch => { total += ch.highestScore; });
        return total;
    };

    const clearAllProgress = () => {
        if (window.confirm("Are you sure you want to completely erase all your saved MCQ progress?")) {
            localStorage.removeItem(STORAGE_KEY);
            setProgress(DEFAULT_PROGRESS);
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

    // Push local progress to cloud for a specific subject
    const syncToCloud = useCallback(async (subjectId: string) => {
        if (!auth) return;
        setIsSyncing(true);
        try {
            await fetch("/api/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: auth.email,
                    subject_id: subjectId,
                    progress,
                }),
            });
        } catch (err) {
            console.error("[syncToCloud] error:", err);
        } finally {
            setIsSyncing(false);
        }
    }, [auth, progress]);

    // Pull cloud progress and merge into local for a subject
    const loadFromCloud = useCallback(async (subjectId: string) => {
        if (!auth) return;
        setIsSyncing(true);
        try {
            const res = await fetch(`/api/progress?email=${encodeURIComponent(auth.email)}&subject=${subjectId}`);
            const data = await res.json();
            if (!res.ok || !data.progress?.length) return;

            const cloudEntry = data.progress[0];
            if (!cloudEntry?.progress_json) return;

            const cloudProgress: UserProgressData = cloudEntry.progress_json;

            // Merge: for each cloud chapter, use whichever has a higher score
            setProgress(prev => {
                const mergedChapters = { ...cloudProgress.chapters };
                for (const [chStr, local] of Object.entries(prev.chapters)) {
                    const ch = Number(chStr);
                    const cloud = mergedChapters[ch];
                    if (!cloud || local.highestScore > cloud.highestScore) {
                        mergedChapters[ch] = local;
                    }
                }

                const mergedFlags = Array.from(new Set([
                    ...(prev.flaggedQuestionIds || []),
                    ...(cloudProgress.flaggedQuestionIds || []),
                ]));

                return {
                    ...prev,
                    chapters: mergedChapters,
                    flaggedQuestionIds: mergedFlags,
                    randomMocks: {
                        highestScore: Math.max(prev.randomMocks.highestScore, cloudProgress.randomMocks?.highestScore || 0),
                        totalAttempted: prev.randomMocks.totalAttempted,
                    },
                };
            });
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
        updateMarathonState,
        clearMarathonState,
        toggleFlag,
        getTotalMasteredPoints,
        clearAllProgress,
        signIn,
        signOut,
        syncToCloud,
        loadFromCloud,
    };
}
