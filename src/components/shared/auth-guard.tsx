"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGamification } from "@/contexts/gamification-context";
import { DuoMascot } from "@/components/shared/duo-mascot";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard - Protects pages that require authentication
 *
 * - If user is not authenticated (isFirstTime), redirects to /login
 * - After login, new users will go through /onboarding
 * - After onboarding completion, they return to the protected page
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isFirstTime, onboardingStep } = useGamification();

  // Check if user is authenticated (completed onboarding)
  const isAuthenticated = !isFirstTime && onboardingStep === "complete";

  useEffect(() => {
    if (!isAuthenticated) {
      // Store the intended destination for redirect after login
      if (typeof window !== "undefined") {
        sessionStorage.setItem("auth-redirect", window.location.pathname);
      }
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  // Show loading while checking auth
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <DuoMascot mood="thinking" size="lg" animate />
      </div>
    );
  }

  return <>{children}</>;
}
