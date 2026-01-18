"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

// ============================================================================
// Types
// ============================================================================

export type AccessibilityState = {
  highContrastMode: boolean;
  hasSeenWelcome: boolean;
};

export type AccessibilityActions = {
  toggleHighContrast: () => void;
  setHighContrast: (enabled: boolean) => void;
  markWelcomeSeen: () => void;
};

// ============================================================================
// Default State
// ============================================================================

const defaultState: AccessibilityState = {
  highContrastMode: false,
  hasSeenWelcome: false,
};

// ============================================================================
// Context
// ============================================================================

type AccessibilityContextType = AccessibilityState & AccessibilityActions;

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

const STORAGE_KEY = "jalan-jalan-accessibility";

// ============================================================================
// Provider
// ============================================================================

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AccessibilityState>(defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState({ ...defaultState, ...parsed });
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

  // Apply/remove high-contrast class on document
  useEffect(() => {
    if (isHydrated) {
      if (state.highContrastMode) {
        document.documentElement.classList.add("high-contrast");
      } else {
        document.documentElement.classList.remove("high-contrast");
      }
    }
  }, [state.highContrastMode, isHydrated]);

  // Actions
  const toggleHighContrast = useCallback(() => {
    setState((prev) => ({ ...prev, highContrastMode: !prev.highContrastMode }));
  }, []);

  const setHighContrast = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, highContrastMode: enabled }));
  }, []);

  const markWelcomeSeen = useCallback(() => {
    setState((prev) => ({ ...prev, hasSeenWelcome: true }));
  }, []);

  const value: AccessibilityContextType = {
    ...state,
    toggleHighContrast,
    setHighContrast,
    markWelcomeSeen,
  };

  // Don't render until hydrated to avoid hydration mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
