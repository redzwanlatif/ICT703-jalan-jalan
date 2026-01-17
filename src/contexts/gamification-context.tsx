"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

// ============================================================================
// Types
// ============================================================================

export type OnboardingStep =
  | "welcome"
  | "create-account"
  | "travel-style"
  | "travel-dna"
  | "trip-frequency"
  | "interests"
  | "goals"
  | "complete";

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  requirement: number;
  current: number;
};

export type UserLevel = {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
};

export type GamificationState = {
  // User status
  isFirstTime: boolean;
  isOnboarding: boolean;
  onboardingStep: OnboardingStep;
  onboardingProgress: number;

  // Gamification stats
  xp: number;
  level: UserLevel;
  streak: number;
  lastActiveDate: string | null;
  hearts: number;
  maxHearts: number;

  // User preferences (collected during onboarding)
  travelStyle: "budget" | "comfort" | "luxury" | null;
  budgetPreference: "saver" | "balanced" | "generous" | null;
  tripFrequency: "rarely" | "sometimes" | "often" | null;
  interests: string[];
  travelGoals: string[];

  // Travel DNA preferences (comfort/cost, pacing, budget)
  comfortCost: number; // 0-100, 0=value saver, 100=luxury
  travelPacing: number; // 0-100, 0=relaxed, 100=packed
  annualBudget: number; // in RM

  // Achievements
  achievements: Achievement[];

  // UI state
  showReward: boolean;
  rewardData: { type: string; amount: number; message: string } | null;
};

export type GamificationActions = {
  // Onboarding
  setOnboardingStep: (step: OnboardingStep) => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;

  // Preferences
  setTravelStyle: (style: GamificationState["travelStyle"]) => void;
  setBudgetPreference: (pref: GamificationState["budgetPreference"]) => void;
  setTripFrequency: (freq: GamificationState["tripFrequency"]) => void;
  setInterests: (interests: string[]) => void;
  setTravelGoals: (goals: string[]) => void;
  setComfortCost: (value: number) => void;
  setTravelPacing: (value: number) => void;
  setAnnualBudget: (value: number) => void;

  // Re-onboarding (reset travel DNA)
  resetTravelDNA: () => void;

  // Gamification
  addXp: (amount: number, reason?: string) => void;
  loseHeart: () => void;
  restoreHearts: () => void;
  checkStreak: () => void;

  // UI
  dismissReward: () => void;
  resetProgress: () => void;
};

// ============================================================================
// Level Configuration
// ============================================================================

const LEVELS: UserLevel[] = [
  { level: 1, title: "Wanderer", minXp: 0, maxXp: 100 },
  { level: 2, title: "Explorer", minXp: 100, maxXp: 250 },
  { level: 3, title: "Adventurer", minXp: 250, maxXp: 500 },
  { level: 4, title: "Voyager", minXp: 500, maxXp: 850 },
  { level: 5, title: "Globetrotter", minXp: 850, maxXp: 1300 },
  { level: 6, title: "Navigator", minXp: 1300, maxXp: 1900 },
  { level: 7, title: "Pioneer", minXp: 1900, maxXp: 2700 },
  { level: 8, title: "Trailblazer", minXp: 2700, maxXp: 3800 },
  { level: 9, title: "Legend", minXp: 3800, maxXp: 5200 },
  { level: 10, title: "Master Traveler", minXp: 5200, maxXp: Infinity },
];

const ONBOARDING_STEPS: OnboardingStep[] = [
  "welcome",
  "create-account",
  "travel-style",
  "travel-dna",
  "trip-frequency",
  "interests",
  "goals",
  "complete",
];

// ============================================================================
// Default State
// ============================================================================

const defaultState: GamificationState = {
  isFirstTime: true,
  isOnboarding: false,
  onboardingStep: "welcome",
  onboardingProgress: 0,

  xp: 0,
  level: LEVELS[0],
  streak: 0,
  lastActiveDate: null,
  hearts: 5,
  maxHearts: 5,

  travelStyle: null,
  budgetPreference: null,
  tripFrequency: null,
  interests: [],
  travelGoals: [],

  comfortCost: 50,
  travelPacing: 50,
  annualBudget: 15000,

  achievements: [],

  showReward: false,
  rewardData: null,
};

// ============================================================================
// Context
// ============================================================================

type GamificationContextType = GamificationState & GamificationActions;

const GamificationContext = createContext<GamificationContextType | null>(null);

const STORAGE_KEY = "jalan-jalan-gamification";

// ============================================================================
// Provider
// ============================================================================

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GamificationState>(defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Recalculate level based on XP
        const level = LEVELS.find(l => parsed.xp >= l.minXp && parsed.xp < l.maxXp) || LEVELS[0];
        setState({ ...defaultState, ...parsed, level });
      } catch {
        setState(defaultState);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isHydrated]);

  // Calculate level from XP
  const calculateLevel = useCallback((xp: number): UserLevel => {
    return LEVELS.find(l => xp >= l.minXp && xp < l.maxXp) || LEVELS[LEVELS.length - 1];
  }, []);

  // Onboarding actions
  const setOnboardingStep = useCallback((step: OnboardingStep) => {
    const stepIndex = ONBOARDING_STEPS.indexOf(step);
    const progress = Math.round((stepIndex / (ONBOARDING_STEPS.length - 1)) * 100);
    setState(prev => ({
      ...prev,
      onboardingStep: step,
      onboardingProgress: progress,
      isOnboarding: step !== "complete" && step !== "welcome",
    }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setState(prev => ({
      ...prev,
      isFirstTime: false,
      isOnboarding: false,
      onboardingStep: "complete",
      onboardingProgress: 100,
      xp: prev.xp + 50, // Bonus XP for completing onboarding
      showReward: true,
      rewardData: {
        type: "xp",
        amount: 50,
        message: "Welcome to Jalan-Jalan!",
      },
    }));
  }, []);

  const skipOnboarding = useCallback(() => {
    setState(prev => ({
      ...prev,
      isFirstTime: false,
      isOnboarding: false,
      onboardingStep: "complete",
      onboardingProgress: 100,
    }));
  }, []);

  // Preference setters
  const setTravelStyle = useCallback((style: GamificationState["travelStyle"]) => {
    setState(prev => ({ ...prev, travelStyle: style }));
  }, []);

  const setBudgetPreference = useCallback((pref: GamificationState["budgetPreference"]) => {
    setState(prev => ({ ...prev, budgetPreference: pref }));
  }, []);

  const setTripFrequency = useCallback((freq: GamificationState["tripFrequency"]) => {
    setState(prev => ({ ...prev, tripFrequency: freq }));
  }, []);

  const setInterests = useCallback((interests: string[]) => {
    setState(prev => ({ ...prev, interests }));
  }, []);

  const setTravelGoals = useCallback((goals: string[]) => {
    setState(prev => ({ ...prev, travelGoals: goals }));
  }, []);

  const setComfortCost = useCallback((value: number) => {
    setState(prev => ({ ...prev, comfortCost: value }));
  }, []);

  const setTravelPacing = useCallback((value: number) => {
    setState(prev => ({ ...prev, travelPacing: value }));
  }, []);

  const setAnnualBudget = useCallback((value: number) => {
    setState(prev => ({ ...prev, annualBudget: value }));
  }, []);

  // Reset Travel DNA - allows re-onboarding from profile settings
  const resetTravelDNA = useCallback(() => {
    setState(prev => ({
      ...prev,
      isFirstTime: true,
      isOnboarding: false,
      onboardingStep: "welcome",
      onboardingProgress: 0,
      travelStyle: null,
      budgetPreference: null,
      tripFrequency: null,
      interests: [],
      travelGoals: [],
      comfortCost: 50,
      travelPacing: 50,
      annualBudget: 15000,
    }));
  }, []);

  // Gamification actions
  const addXp = useCallback((amount: number, reason?: string) => {
    setState(prev => {
      const newXp = prev.xp + amount;
      const newLevel = calculateLevel(newXp);
      const leveledUp = newLevel.level > prev.level.level;

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        showReward: true,
        rewardData: leveledUp
          ? { type: "level", amount: newLevel.level, message: `You reached ${newLevel.title}!` }
          : { type: "xp", amount, message: reason || "Great job!" },
      };
    });
  }, [calculateLevel]);

  const loseHeart = useCallback(() => {
    setState(prev => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1),
    }));
  }, []);

  const restoreHearts = useCallback(() => {
    setState(prev => ({
      ...prev,
      hearts: prev.maxHearts,
    }));
  }, []);

  const checkStreak = useCallback(() => {
    const today = new Date().toDateString();
    setState(prev => {
      if (prev.lastActiveDate === today) {
        return prev; // Already checked in today
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasActiveYesterday = prev.lastActiveDate === yesterday.toDateString();

      return {
        ...prev,
        streak: wasActiveYesterday ? prev.streak + 1 : 1,
        lastActiveDate: today,
        showReward: wasActiveYesterday && prev.streak > 0,
        rewardData: wasActiveYesterday && prev.streak > 0
          ? { type: "streak", amount: prev.streak + 1, message: `${prev.streak + 1} day streak!` }
          : null,
      };
    });
  }, []);

  // UI actions
  const dismissReward = useCallback(() => {
    setState(prev => ({
      ...prev,
      showReward: false,
      rewardData: null,
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Check streak on mount
  useEffect(() => {
    if (isHydrated && !state.isFirstTime) {
      checkStreak();
    }
  }, [isHydrated, state.isFirstTime, checkStreak]);

  const value: GamificationContextType = {
    ...state,
    setOnboardingStep,
    completeOnboarding,
    skipOnboarding,
    setTravelStyle,
    setBudgetPreference,
    setTripFrequency,
    setInterests,
    setTravelGoals,
    setComfortCost,
    setTravelPacing,
    setAnnualBudget,
    resetTravelDNA,
    addXp,
    loseHeart,
    restoreHearts,
    checkStreak,
    dismissReward,
    resetProgress,
  };

  // Don't render until hydrated to avoid hydration mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification must be used within a GamificationProvider");
  }
  return context;
}

// ============================================================================
// Helper functions
// ============================================================================

export function getXpProgress(xp: number, level: UserLevel): number {
  if (level.maxXp === Infinity) return 100;
  const xpInLevel = xp - level.minXp;
  const levelRange = level.maxXp - level.minXp;
  return Math.round((xpInLevel / levelRange) * 100);
}

export function getXpToNextLevel(xp: number, level: UserLevel): number {
  if (level.maxXp === Infinity) return 0;
  return level.maxXp - xp;
}
