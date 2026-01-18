"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, Home } from "lucide-react";
import { useGamification } from "@/contexts/gamification-context";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface WizardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showProgress?: boolean;
  showBack?: boolean;
  showSkip?: boolean;
  showHome?: boolean;
  onBack?: () => void;
  onSkip?: () => void;
  footer?: React.ReactNode;
  mascot?: React.ReactNode;
  className?: string;
}

interface WizardOptionProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

interface WizardFooterProps {
  children: React.ReactNode;
  className?: string;
}

// ============================================================================
// Wizard Layout
// ============================================================================

export function DuoWizardLayout({
  children,
  title,
  subtitle,
  showProgress = true,
  showBack = false,
  showSkip = false,
  showHome = false,
  onBack,
  onSkip,
  footer,
  mascot,
  className,
}: WizardLayoutProps) {
  const { onboardingProgress, skipOnboarding } = useGamification();

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      skipOnboarding();
    }
  };

  return (
    <div className="duo-wizard-container">
      {/* Progress Bar */}
      {showProgress && (
        <div className="duo-wizard-progress">
          <div
            className="duo-wizard-progress-fill"
            style={{ width: `${onboardingProgress}%` }}
          />
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b-2 border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          {showBack && onBack ? (
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : (
            <div className="w-10" />
          )}

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Jalan-Jalan"
              width={120}
              height={0}
              className="w-32 h-auto object-contain"
            />
          </div>

          {(showSkip || showHome) ? (
            <div className="flex items-center gap-1">
              {showHome && (
                <Link
                  href="/"
                  className="p-2 rounded-xl hover:bg-muted transition-colors"
                  aria-label="Go to home"
                >
                  <Home className="w-6 h-6 text-muted-foreground" />
                </Link>
              )}
              {showSkip && (
                <button
                  onClick={handleSkip}
                  className="p-2 -mr-2 rounded-xl hover:bg-muted transition-colors"
                  aria-label="Skip"
                >
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              )}
            </div>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </header>

      {/* Content */}
      <main className={cn("duo-wizard-content pt-4", className)}>
        {mascot && (
          <div className="mb-6 duo-mascot">
            {mascot}
          </div>
        )}

        {title && (
          <h1 className="duo-wizard-title">{title}</h1>
        )}

        {subtitle && (
          <p className="duo-wizard-subtitle">{subtitle}</p>
        )}

        {children}
      </main>

      {/* Footer */}
      {footer && (
        <div className="duo-wizard-footer">
          <div className="duo-wizard-footer-inner">
            {footer}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Wizard Option Card
// ============================================================================

export function DuoWizardOption({
  children,
  selected = false,
  onClick,
  icon,
  className,
}: WizardOptionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "duo-wizard-option text-left",
        selected && "selected",
        className
      )}
    >
      {icon && (
        <div className={cn(
          "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
          selected ? "bg-[var(--duo-blue)]/20" : "bg-muted"
        )}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">{children}</div>
      <div className={cn(
        "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
        selected
          ? "border-[var(--duo-blue)] bg-[var(--duo-blue)]"
          : "border-border"
      )}>
        {selected && (
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </button>
  );
}

// ============================================================================
// Wizard Multi-Select Option
// ============================================================================

interface WizardMultiOptionProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function DuoWizardMultiOption({
  children,
  selected = false,
  onClick,
  icon,
  className,
}: WizardMultiOptionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all duration-150",
        selected
          ? "border-[var(--duo-blue)] bg-[var(--duo-blue)]/10"
          : "border-border bg-card hover:border-[var(--duo-blue)]/50",
        className
      )}
      style={{
        boxShadow: selected
          ? "0 4px 0 var(--duo-blue-dark)"
          : "0 4px 0 var(--border)",
      }}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="font-bold">{children}</span>
      {selected && (
        <div className="ml-auto w-5 h-5 rounded-full bg-[var(--duo-blue)] flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  );
}

// ============================================================================
// Wizard Footer
// ============================================================================

export function DuoWizardFooter({ children, className }: WizardFooterProps) {
  return (
    <div className={cn("w-full flex items-center justify-between gap-4", className)}>
      {children}
    </div>
  );
}

// ============================================================================
// Duo Button
// ============================================================================

interface DuoButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "blue" | "orange" | "purple";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}

export function DuoButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className,
  type = "button",
  fullWidth = false,
}: DuoButtonProps) {
  const variants = {
    primary: "duo-btn",
    secondary: "duo-btn duo-btn-outline",
    outline: "duo-btn duo-btn-outline",
    blue: "duo-btn duo-btn-blue",
    orange: "duo-btn duo-btn-orange",
    purple: "duo-btn duo-btn-purple",
  };

  const sizes = {
    sm: "duo-btn-sm",
    md: "",
    lg: "duo-btn-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        variants[variant],
        sizes[size],
        disabled && "duo-btn-disabled",
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </button>
  );
}

// ============================================================================
// Duo Progress Ring
// ============================================================================

interface DuoProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

export function DuoProgressRing({
  progress,
  size = 80,
  strokeWidth = 8,
  className,
  children,
}: DuoProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          className="text-muted"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-[var(--duo-green)] transition-all duration-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Duo Slider
// ============================================================================

interface DuoSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}

export function DuoSlider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  leftLabel,
  rightLabel,
  className,
}: DuoSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 bg-[var(--duo-gray-light)] rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-8
            [&::-webkit-slider-thumb]:h-8
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[var(--duo-green)]
            [&::-webkit-slider-thumb]:border-4
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow-[0_4px_10px_rgba(0,0,0,0.2)]
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:active:scale-110
            [&::-webkit-slider-thumb]:transition-transform"
          style={{
            background: `linear-gradient(to right, var(--duo-green) ${percentage}%, var(--duo-gray-light) ${percentage}%)`,
          }}
        />
      </div>
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between mt-2 text-sm font-semibold text-muted-foreground">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export {
  type WizardLayoutProps,
  type WizardOptionProps,
  type WizardFooterProps,
  type DuoButtonProps,
  type DuoProgressRingProps,
  type DuoSliderProps,
};
