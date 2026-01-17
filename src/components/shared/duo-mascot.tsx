"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ============================================================================
// Mascot Variants
// ============================================================================

type MascotMood = "happy" | "excited" | "thinking" | "encouraging" | "celebrating" | "waving";
type MascotSize = "sm" | "md" | "lg" | "xl";

interface DuoMascotProps {
  mood?: MascotMood;
  size?: MascotSize;
  animate?: boolean;
  className?: string;
}

// ============================================================================
// Jalan-Jalan Bus Mascot
// Official mascot from /public/mascot.png
// ============================================================================

export function DuoMascot({
  mood = "happy",
  size = "md",
  animate = true,
  className,
}: DuoMascotProps) {
  const sizes: Record<MascotSize, { container: string; width: number; height: number }> = {
    sm: { container: "w-16 h-16", width: 64, height: 64 },
    md: { container: "w-24 h-24", width: 96, height: 96 },
    lg: { container: "w-32 h-32", width: 128, height: 128 },
    xl: { container: "w-48 h-48", width: 192, height: 192 },
  };

  const animations: Record<MascotMood, string> = {
    happy: animate ? "duo-mascot" : "",
    excited: animate ? "duo-mascot-celebrate" : "",
    thinking: "",
    encouraging: animate ? "duo-mascot" : "",
    celebrating: animate ? "duo-mascot-celebrate" : "",
    waving: animate ? "duo-mascot-wave" : "",
  };

  // Optional overlay effects based on mood
  const getMoodOverlay = () => {
    switch (mood) {
      case "celebrating":
        return (
          <div className="absolute inset-0 pointer-events-none">
            {/* Confetti/sparkles around the mascot */}
            <div className="absolute -top-2 -left-2 w-3 h-3 rounded-full bg-duo-yellow animate-ping" />
            <div className="absolute -top-1 -right-3 w-2 h-2 rounded-full bg-jj-coral animate-ping delay-100" />
            <div className="absolute top-1/4 -left-4 w-2 h-2 rounded-full bg-jj-sky animate-ping delay-200" />
            <div className="absolute top-1/4 -right-4 w-3 h-3 rounded-full bg-jj-green animate-ping delay-150" />
          </div>
        );
      case "thinking":
        return (
          <div className="absolute -top-4 -right-2 flex gap-1">
            <div className="w-2 h-2 rounded-full bg-jj-cream-dark" />
            <div className="w-3 h-3 rounded-full bg-jj-cream-dark" />
            <div className="w-4 h-4 rounded-full bg-jj-cream-dark flex items-center justify-center">
              <span className="text-jj-brown text-xs font-bold">?</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("relative", sizes[size].container, animations[mood], className)}>
      <Image
        src="/mascot.png"
        alt="Jalan-Jalan Bus Mascot"
        width={sizes[size].width}
        height={sizes[size].height}
        className="w-full h-full object-contain"
        priority={size === "lg" || size === "xl"}
      />
      {getMoodOverlay()}
    </div>
  );
}

// ============================================================================
// Mascot with Speech Bubble
// ============================================================================

interface MascotWithSpeechProps extends DuoMascotProps {
  message?: string;
  position?: "left" | "right";
}

export function DuoMascotWithSpeech({
  message,
  position = "right",
  ...mascotProps
}: MascotWithSpeechProps) {
  if (!message) {
    return <DuoMascot {...mascotProps} />;
  }

  return (
    <div className={cn(
      "flex items-end gap-3",
      position === "left" && "flex-row-reverse"
    )}>
      <DuoMascot {...mascotProps} />

      <div className={cn(
        "relative px-4 py-3 rounded-2xl bg-card border-2 border-jj-cream-dark max-w-[200px]",
        "shadow-[0_4px_0_var(--jj-cream-dark)]"
      )}>
        <p className="text-sm font-semibold text-jj-brown">{message}</p>
        <div
          className={cn(
            "absolute bottom-3 w-3 h-3 bg-card border-b-2 border-l-2 border-jj-cream-dark rotate-45",
            position === "right" ? "-left-2" : "-right-2"
          )}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Preset Mascot Messages
// ============================================================================

export const mascotMessages = {
  welcome: "Hi there! Let's go jalan-jalan!",
  onboarding: "Let's set up your travel profile!",
  encouragement: "You're doing great! Keep exploring!",
  celebrate: "Amazing! You earned some XP!",
  streak: "Awesome streak! Keep it up!",
  thinking: "Hmm, where should we go next?",
  error: "Oops! Let me try a different route.",
  complete: "You did it! Ready to explore?",
  planTrip: "Where shall we adventure next?",
  dashboard: "Here's your travel overview!",
  community: "Connect with fellow travelers!",
};

// ============================================================================
// Exports
// ============================================================================

export type { DuoMascotProps, MascotMood, MascotSize, MascotWithSpeechProps };
