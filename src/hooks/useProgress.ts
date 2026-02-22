"use client";

import { useState, useEffect } from 'react';

// Define the shape of our persistent progress data
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

const STORAGE_KEY = 'mcq_gift_progress_v1';

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
        inProgress: false
    },
    flaggedQuestionIds: []
};

export function useProgress() {
    const [progress, setProgress] = useState<UserProgressData>(DEFAULT_PROGRESS);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount (client-side only)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const stored = window.localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    // Merge with DEFAULT_PROGRESS to ensure all keys exist even for older saves
                    const parsed = JSON.parse(stored);
                    setProgress({ ...DEFAULT_PROGRESS, ...parsed });
                } else {
                    setProgress(DEFAULT_PROGRESS);
                }
            } catch (e) {
                console.error("Error loading progress from localStorage", e);
                setProgress(DEFAULT_PROGRESS);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever progress changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        }
    }, [progress, isLoaded]);

    // Record a completed chapter attempt
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
                        isCompleted: newHighestScore === totalQuestions // consider completed if they got 100%
                    }
                }
            };
        });
    };

    // Record a completed random mock attempt
    const saveRandomMockScore = (score: number) => {
        setProgress(prev => ({
            ...prev,
            randomMocks: {
                highestScore: Math.max(prev.randomMocks.highestScore, score),
                totalAttempted: prev.randomMocks.totalAttempted + 1
            }
        }));
    };

    // Save/Update the exact state of an ongoing marathon
    const updateMarathonState = (questionIds: string[], currentIndex: number, score: number) => {
        setProgress(prev => ({
            ...prev,
            marathon: {
                questionIds,
                currentIndex,
                score,
                inProgress: true
            }
        }));
    };

    // Clear marathon state when finished or manually reset
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

    // Helper to get total unique questions mastered (score > 0 essentially, or just total completed)
    // We'll define "mastered" as total uniquely correct points across highest chapter scores + sum of marathon completions if we wanted,
    // but simpler to just sum up the highest chapter scores for the dashboard metric.
    const getTotalMasteredPoints = () => {
        let total = 0;
        Object.values(progress.chapters).forEach(ch => {
            total += ch.highestScore;
        });
        return total;
    };

    const clearAllProgress = () => {
        if (window.confirm("Are you sure you want to completely erase all your saved MCQ progress?")) {
            localStorage.removeItem(STORAGE_KEY);
            setProgress(DEFAULT_PROGRESS);
        }
    };

    return {
        progress,
        isLoaded,
        saveChapterScore,
        saveRandomMockScore,
        updateMarathonState,
        clearMarathonState,
        toggleFlag,
        getTotalMasteredPoints,
        clearAllProgress
    };
}
