"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useGamification } from "./gamification-context";

// ============================================================================
// Types
// ============================================================================

export type TravelStyle = "budget" | "comfort" | "luxury";
export type PacingStyle = "relaxed" | "moderate" | "packed";
export type AccommodationType = "hostel" | "hotel" | "resort" | "airbnb" | "any";
export type ActivityType = "adventure" | "culture" | "nature" | "food" | "relaxation" | "nightlife" | "shopping";

export interface MemberPreferences {
  travelStyle: TravelStyle;
  dailyBudget: number; // in RM
  pacing: PacingStyle;
  accommodation: AccommodationType;
  activities: ActivityType[];
  dietaryRestrictions: string[];
  mobilityNeeds: string;
  wakeUpTime: "early" | "normal" | "late";
  mustSee: string[];
  mustAvoid: string[];
}

export interface TripMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOrganizer: boolean;
  hasSetPreferences: boolean;
  preferences: MemberPreferences | null;
  joinedAt: Date;
}

export interface ConflictItem {
  id: string;
  type: "budget" | "pacing" | "accommodation" | "activity" | "timing" | "dietary";
  severity: "high" | "medium" | "low";
  description: string;
  affectedMembers: string[];
  suggestions: string[];
  resolved: boolean;
  resolution?: string;
}

export interface TripPlan {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: "planning" | "preferences" | "conflicts" | "ready" | "confirmed";
  selectedPlan?: string;
  organizer: TripMember;
  members: TripMember[];
  conflicts: ConflictItem[];
  aggregatedPreferences: {
    budgetRange: { min: number; max: number; average: number };
    preferredPacing: PacingStyle;
    topActivities: ActivityType[];
    accommodationVotes: Record<AccommodationType, number>;
    dietaryNeeds: string[];
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TripWizardState {
  currentTrip: TripPlan | null;
  currentMemberId: string | null;
  step: "create" | "members" | "preferences" | "conflicts" | "recommendations" | "plan";
}

export interface TripContextType extends TripWizardState {
  // Trip actions
  createTrip: (name: string, destination: string, startDate: string, endDate: string) => TripPlan;
  loadTrip: (tripId: string) => TripPlan | null;
  updateTrip: (updates: Partial<TripPlan>) => void;
  deleteTrip: () => void;

  // Member actions
  addMember: (name: string, email: string) => TripMember;
  removeMember: (memberId: string) => void;
  setCurrentMember: (memberId: string | null) => void;
  updateMemberPreferences: (memberId: string, preferences: MemberPreferences) => void;

  // Conflict actions
  analyzeConflicts: () => ConflictItem[];
  resolveConflict: (conflictId: string, resolution: string) => void;

  // Navigation
  setStep: (step: TripWizardState["step"]) => void;
  canProceed: () => boolean;

  // Helpers
  getMemberById: (id: string) => TripMember | undefined;
  getUnsetMembers: () => TripMember[];
  getAllTrips: () => TripPlan[];
}

// ============================================================================
// Default Preferences
// ============================================================================

export const defaultPreferences: MemberPreferences = {
  travelStyle: "comfort",
  dailyBudget: 200,
  pacing: "moderate",
  accommodation: "hotel",
  activities: [],
  dietaryRestrictions: [],
  mobilityNeeds: "",
  wakeUpTime: "normal",
  mustSee: [],
  mustAvoid: [],
};

// ============================================================================
// Context
// ============================================================================

const TripContext = createContext<TripContextType | null>(null);

const STORAGE_KEY = "jalan-jalan-trips";
const CURRENT_TRIP_KEY = "jalan-jalan-current-trip";

// ============================================================================
// Provider
// ============================================================================

export function TripProvider({ children }: { children: React.ReactNode }) {
  const { addXp } = useGamification();
  const [state, setState] = useState<TripWizardState>({
    currentTrip: null,
    currentMemberId: null,
    step: "create",
  });
  const [allTrips, setAllTrips] = useState<TripPlan[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const storedTrips = localStorage.getItem(STORAGE_KEY);
    const currentTripId = localStorage.getItem(CURRENT_TRIP_KEY);

    if (storedTrips) {
      try {
        const trips = JSON.parse(storedTrips);
        setAllTrips(trips);

        if (currentTripId) {
          const current = trips.find((t: TripPlan) => t.id === currentTripId);
          if (current) {
            setState(prev => ({
              ...prev,
              currentTrip: current,
              step: current.status === "planning" ? "members" : current.status,
            }));
          }
        }
      } catch (e) {
        console.error("Failed to load trips:", e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allTrips));
      if (state.currentTrip) {
        localStorage.setItem(CURRENT_TRIP_KEY, state.currentTrip.id);
      }
    }
  }, [allTrips, state.currentTrip, isHydrated]);

  // ============================================================================
  // Trip Actions
  // ============================================================================

  const createTrip = useCallback((
    name: string,
    destination: string,
    startDate: string,
    endDate: string
  ): TripPlan => {
    const organizer: TripMember = {
      id: `member-${Date.now()}`,
      name: "You",
      email: "you@example.com",
      isOrganizer: true,
      hasSetPreferences: false,
      preferences: null,
      joinedAt: new Date(),
    };

    const newTrip: TripPlan = {
      id: `trip-${Date.now()}`,
      name,
      destination,
      startDate,
      endDate,
      status: "planning",
      organizer,
      members: [organizer],
      conflicts: [],
      aggregatedPreferences: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setAllTrips(prev => [...prev, newTrip]);
    setState(prev => ({
      ...prev,
      currentTrip: newTrip,
      currentMemberId: organizer.id,
      step: "members",
    }));

    addXp(10, "Created a new trip!");
    return newTrip;
  }, [addXp]);

  const loadTrip = useCallback((tripId: string): TripPlan | null => {
    const trip = allTrips.find(t => t.id === tripId);
    if (trip) {
      setState(prev => ({
        ...prev,
        currentTrip: trip,
        step: trip.status === "planning" ? "members" : trip.status as TripWizardState["step"],
      }));
      return trip;
    }
    return null;
  }, [allTrips]);

  const updateTrip = useCallback((updates: Partial<TripPlan>) => {
    setState(prev => {
      if (!prev.currentTrip) return prev;
      const updated = { ...prev.currentTrip, ...updates, updatedAt: new Date() };
      setAllTrips(trips => trips.map(t => t.id === updated.id ? updated : t));
      return { ...prev, currentTrip: updated };
    });
  }, []);

  const deleteTrip = useCallback(() => {
    if (state.currentTrip) {
      setAllTrips(prev => prev.filter(t => t.id !== state.currentTrip!.id));
      localStorage.removeItem(CURRENT_TRIP_KEY);
      setState({ currentTrip: null, currentMemberId: null, step: "create" });
    }
  }, [state.currentTrip]);

  // ============================================================================
  // Member Actions
  // ============================================================================

  const addMember = useCallback((name: string, email: string): TripMember => {
    const newMember: TripMember = {
      id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      isOrganizer: false,
      hasSetPreferences: false,
      preferences: null,
      joinedAt: new Date(),
    };

    setState(prev => {
      if (!prev.currentTrip) return prev;
      const updated = {
        ...prev.currentTrip,
        members: [...prev.currentTrip.members, newMember],
        updatedAt: new Date(),
      };
      setAllTrips(trips => trips.map(t => t.id === updated.id ? updated : t));
      return { ...prev, currentTrip: updated };
    });

    return newMember;
  }, []);

  const removeMember = useCallback((memberId: string) => {
    setState(prev => {
      if (!prev.currentTrip) return prev;
      const updated = {
        ...prev.currentTrip,
        members: prev.currentTrip.members.filter(m => m.id !== memberId),
        updatedAt: new Date(),
      };
      setAllTrips(trips => trips.map(t => t.id === updated.id ? updated : t));
      return { ...prev, currentTrip: updated };
    });
  }, []);

  const setCurrentMember = useCallback((memberId: string | null) => {
    setState(prev => ({ ...prev, currentMemberId: memberId }));
  }, []);

  const updateMemberPreferences = useCallback((memberId: string, preferences: MemberPreferences) => {
    setState(prev => {
      if (!prev.currentTrip) return prev;
      const updated = {
        ...prev.currentTrip,
        members: prev.currentTrip.members.map(m =>
          m.id === memberId
            ? { ...m, preferences, hasSetPreferences: true }
            : m
        ),
        updatedAt: new Date(),
      };
      setAllTrips(trips => trips.map(t => t.id === updated.id ? updated : t));
      addXp(15, "Preferences saved!");
      return { ...prev, currentTrip: updated };
    });
  }, [addXp]);

  // ============================================================================
  // Conflict Analysis
  // ============================================================================

  const analyzeConflicts = useCallback((): ConflictItem[] => {
    if (!state.currentTrip) return [];

    const members = state.currentTrip.members.filter(m => m.hasSetPreferences && m.preferences);
    if (members.length < 2) return [];

    const conflicts: ConflictItem[] = [];

    // Budget conflicts
    const budgets = members.map(m => m.preferences!.dailyBudget);
    const budgetRange = Math.max(...budgets) - Math.min(...budgets);
    if (budgetRange > 100) {
      const lowBudgetMembers = members.filter(m => m.preferences!.dailyBudget < 150);
      const highBudgetMembers = members.filter(m => m.preferences!.dailyBudget > 250);

      conflicts.push({
        id: `conflict-budget-${Date.now()}`,
        type: "budget",
        severity: budgetRange > 200 ? "high" : "medium",
        description: `Daily budget varies from RM${Math.min(...budgets)} to RM${Math.max(...budgets)}`,
        affectedMembers: [...lowBudgetMembers, ...highBudgetMembers].map(m => m.name),
        suggestions: [
          "Split costs based on individual budgets",
          "Choose mid-range options that work for everyone",
          "Plan some activities separately based on budget",
        ],
        resolved: false,
      });
    }

    // Pacing conflicts
    const pacingVotes = members.reduce((acc, m) => {
      acc[m.preferences!.pacing] = (acc[m.preferences!.pacing] || 0) + 1;
      return acc;
    }, {} as Record<PacingStyle, number>);

    if (Object.keys(pacingVotes).length > 1) {
      const relaxedMembers = members.filter(m => m.preferences!.pacing === "relaxed").map(m => m.name);
      const packedMembers = members.filter(m => m.preferences!.pacing === "packed").map(m => m.name);

      if (relaxedMembers.length > 0 && packedMembers.length > 0) {
        conflicts.push({
          id: `conflict-pacing-${Date.now()}`,
          type: "pacing",
          severity: "medium",
          description: "Members have different pacing preferences",
          affectedMembers: [...relaxedMembers, ...packedMembers],
          suggestions: [
            "Alternate between active and relaxed days",
            "Allow optional activities for energetic members",
            "Schedule free time for everyone to do their own thing",
          ],
          resolved: false,
        });
      }
    }

    // Wake-up time conflicts
    const earlyBirds = members.filter(m => m.preferences!.wakeUpTime === "early");
    const nightOwls = members.filter(m => m.preferences!.wakeUpTime === "late");

    if (earlyBirds.length > 0 && nightOwls.length > 0) {
      conflicts.push({
        id: `conflict-timing-${Date.now()}`,
        type: "timing",
        severity: "low",
        description: "Mix of early birds and night owls in the group",
        affectedMembers: [...earlyBirds, ...nightOwls].map(m => m.name),
        suggestions: [
          "Plan morning activities as optional",
          "Start group activities around 10-11 AM",
          "Evening dinners together, mornings flexible",
        ],
        resolved: false,
      });
    }

    // Dietary conflicts
    const allDietary = members.flatMap(m => m.preferences!.dietaryRestrictions);
    const uniqueDietary = [...new Set(allDietary)].filter(Boolean);

    if (uniqueDietary.length > 0) {
      conflicts.push({
        id: `conflict-dietary-${Date.now()}`,
        type: "dietary",
        severity: "medium",
        description: `Dietary needs: ${uniqueDietary.join(", ")}`,
        affectedMembers: members.filter(m => m.preferences!.dietaryRestrictions.length > 0).map(m => m.name),
        suggestions: [
          "Research restaurants with diverse options",
          "Book accommodations with kitchen access",
          "Create a shared dietary requirements list",
        ],
        resolved: false,
      });
    }

    // Calculate aggregated preferences
    const aggregated = {
      budgetRange: {
        min: Math.min(...budgets),
        max: Math.max(...budgets),
        average: Math.round(budgets.reduce((a, b) => a + b, 0) / budgets.length),
      },
      preferredPacing: (Object.entries(pacingVotes).sort((a, b) => b[1] - a[1])[0]?.[0] || "moderate") as PacingStyle,
      topActivities: [...new Set(members.flatMap(m => m.preferences!.activities))].slice(0, 5) as ActivityType[],
      accommodationVotes: members.reduce((acc, m) => {
        acc[m.preferences!.accommodation] = (acc[m.preferences!.accommodation] || 0) + 1;
        return acc;
      }, {} as Record<AccommodationType, number>),
      dietaryNeeds: uniqueDietary,
    };

    updateTrip({ conflicts, aggregatedPreferences: aggregated, status: "conflicts" });
    return conflicts;
  }, [state.currentTrip, updateTrip]);

  const resolveConflict = useCallback((conflictId: string, resolution: string) => {
    setState(prev => {
      if (!prev.currentTrip) return prev;
      const updated = {
        ...prev.currentTrip,
        conflicts: prev.currentTrip.conflicts.map(c =>
          c.id === conflictId ? { ...c, resolved: true, resolution } : c
        ),
        updatedAt: new Date(),
      };
      setAllTrips(trips => trips.map(t => t.id === updated.id ? updated : t));
      addXp(5, "Conflict resolved!");
      return { ...prev, currentTrip: updated };
    });
  }, [addXp]);

  // ============================================================================
  // Navigation
  // ============================================================================

  const setStep = useCallback((step: TripWizardState["step"]) => {
    setState(prev => ({ ...prev, step }));

    if (state.currentTrip && step !== "create") {
      const statusMap: Record<string, TripPlan["status"]> = {
        members: "planning",
        preferences: "preferences",
        conflicts: "conflicts",
        recommendations: "conflicts",
        plan: "ready",
      };
      updateTrip({ status: statusMap[step] || state.currentTrip.status });
    }
  }, [state.currentTrip, updateTrip]);

  const canProceed = useCallback((): boolean => {
    if (!state.currentTrip) return false;

    switch (state.step) {
      case "create":
        return true;
      case "members":
        return state.currentTrip.members.length >= 2;
      case "preferences":
        return state.currentTrip.members.every(m => m.hasSetPreferences);
      case "conflicts":
        return state.currentTrip.conflicts.every(c => c.resolved) ||
               state.currentTrip.conflicts.length === 0;
      case "recommendations":
        return true;
      case "plan":
        return true;
      default:
        return false;
    }
  }, [state.currentTrip, state.step]);

  // ============================================================================
  // Helpers
  // ============================================================================

  const getMemberById = useCallback((id: string): TripMember | undefined => {
    return state.currentTrip?.members.find(m => m.id === id);
  }, [state.currentTrip]);

  const getUnsetMembers = useCallback((): TripMember[] => {
    return state.currentTrip?.members.filter(m => !m.hasSetPreferences) || [];
  }, [state.currentTrip]);

  const getAllTrips = useCallback((): TripPlan[] => {
    return allTrips;
  }, [allTrips]);

  // ============================================================================
  // Value
  // ============================================================================

  const value: TripContextType = {
    ...state,
    createTrip,
    loadTrip,
    updateTrip,
    deleteTrip,
    addMember,
    removeMember,
    setCurrentMember,
    updateMemberPreferences,
    analyzeConflicts,
    resolveConflict,
    setStep,
    canProceed,
    getMemberById,
    getUnsetMembers,
    getAllTrips,
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
}
