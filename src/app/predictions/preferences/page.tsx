"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  DollarSign,
  Users,
  Shield,
  Bell,
  Check,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { DuoAppShell } from "@/components/shared/duo-bottom-nav";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DuoButton } from "@/components/shared/duo-wizard-layout";
import { cn } from "@/lib/utils";

// Step Indicator Component - Duolingo Style
function DuoStepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: "Trip Details" },
    { num: 2, label: "Preferences" },
    { num: 3, label: "Your Plan" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, index) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold transition-all border-2",
                currentStep >= step.num
                  ? "bg-[var(--duo-green)] border-[var(--duo-green-dark)] text-white shadow-[0_4px_0_var(--duo-green-dark)]"
                  : "bg-muted border-border text-muted-foreground"
              )}
            >
              {currentStep > step.num ? <Check className="w-5 h-5" /> : step.num}
            </div>
            <span
              className={cn(
                "text-xs mt-2 font-bold",
                currentStep >= step.num ? "text-[var(--duo-green)]" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-12 h-2 mx-2 rounded-full transition-all",
                currentStep > step.num ? "bg-[var(--duo-green)]" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Radio Option Component - Duolingo Style
function DuoRadioOption({
  selected,
  onSelect,
  title,
  description,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description?: string;
}) {
  return (
    <motion.button
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full p-4 rounded-2xl border-2 text-left transition-all",
        selected
          ? "border-[var(--duo-green)] bg-[var(--duo-green)]/10 shadow-[0_4px_0_var(--duo-green)]"
          : "border-border bg-white hover:border-[var(--duo-blue)] shadow-[0_4px_0_#E5E5E5]"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
            selected ? "border-[var(--duo-green)] bg-[var(--duo-green)]" : "border-border"
          )}
        >
          {selected && <Check className="w-4 h-4 text-white" />}
        </div>
        <div>
          <p className="font-bold">{title}</p>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
    </motion.button>
  );
}

// Checkbox Option Component - Duolingo Style
function DuoCheckboxOption({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <motion.button
      onClick={() => onChange(!checked)}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full p-4 rounded-2xl text-left transition-all flex items-center gap-3 border-2",
        checked
          ? "bg-[var(--duo-green)] border-[var(--duo-green-dark)] text-white shadow-[0_4px_0_var(--duo-green-dark)]"
          : "bg-white border-border hover:border-[var(--duo-blue)] shadow-[0_4px_0_#E5E5E5]"
      )}
    >
      <div
        className={cn(
          "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
          checked ? "bg-white" : "border-2 border-border bg-white"
        )}
      >
        {checked && <Check className="w-4 h-4 text-[var(--duo-green)]" />}
      </div>
      <span className="font-bold">{label}</span>
    </motion.button>
  );
}

export default function PreferencesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);

  // Form state
  const [travelStyle, setTravelStyle] = useState("balanced");
  const [crowdPreference, setCrowdPreference] = useState("avoid");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  // Safety Options
  const [avoidLateNight, setAvoidLateNight] = useState(true);
  const [preferWellLit, setPreferWellLit] = useState(true);
  const [verifiedTransport, setVerifiedTransport] = useState(true);

  // Alert Preferences
  const [highCrowd, setHighCrowd] = useState(true);
  const [weatherDisruptions, setWeatherDisruptions] = useState(true);
  const [priceDrops, setPriceDrops] = useState(true);
  const [safetyWarnings, setSafetyWarnings] = useState(true);

  const loadingSteps = [
    "Analyzing your preferences...",
    "Finding the best routes...",
    "Optimizing your itinerary...",
  ];

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              router.push("/predictions/plan");
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 60);

      const stepInterval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev >= loadingSteps.length - 1) return prev;
          return prev + 1;
        });
      }, 1000);

      return () => {
        clearInterval(interval);
        clearInterval(stepInterval);
      };
    }
  }, [isLoading, router, loadingSteps.length]);

  const handleGeneratePlan = () => {
    sessionStorage.setItem(
      "travelPreferences",
      JSON.stringify({
        travelStyle,
        crowdPreference,
        budget: { min: minBudget, max: maxBudget },
        safetyOptions: { avoidLateNight, preferWellLit, verifiedTransport },
        alertPreferences: { highCrowd, weatherDisruptions, priceDrops, safetyWarnings },
      })
    );
    setIsLoading(true);
  };

  return (
    <DuoAppShell showTopBar showBottomNav>
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Step Indicator */}
        <DuoStepIndicator currentStep={2} />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <DuoMascot mood="thinking" size="md" />
          </motion.div>
          <h1 className="text-2xl font-extrabold mt-4 mb-2">Your Preferences</h1>
          <p className="text-muted-foreground">Customize your travel experience</p>
        </motion.div>

        {/* Travel Style */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--duo-green)]/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[var(--duo-green)]" />
            </div>
            <h2 className="font-extrabold">Travel Style</h2>
          </div>
          <div className="space-y-2">
            <DuoRadioOption
              selected={travelStyle === "low-budget"}
              onSelect={() => setTravelStyle("low-budget")}
              title="Low Budget"
              description="Save money, maximize experiences"
            />
            <DuoRadioOption
              selected={travelStyle === "balanced"}
              onSelect={() => setTravelStyle("balanced")}
              title="Balanced"
              description="Mix of comfort and value"
            />
            <DuoRadioOption
              selected={travelStyle === "comfortable"}
              onSelect={() => setTravelStyle("comfortable")}
              title="Comfortable"
              description="Prioritize comfort and convenience"
            />
          </div>
        </motion.section>

        {/* Crowd Preference */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--duo-purple)]/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-[var(--duo-purple)]" />
            </div>
            <h2 className="font-extrabold">Crowd Preference</h2>
          </div>
          <div className="space-y-2">
            <DuoRadioOption
              selected={crowdPreference === "avoid"}
              onSelect={() => setCrowdPreference("avoid")}
              title="Avoid crowds"
            />
            <DuoRadioOption
              selected={crowdPreference === "some"}
              onSelect={() => setCrowdPreference("some")}
              title="Okay with some crowd"
            />
            <DuoRadioOption
              selected={crowdPreference === "no-preference"}
              onSelect={() => setCrowdPreference("no-preference")}
              title="No preference"
            />
          </div>
        </motion.section>

        {/* Budget */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--duo-yellow)]/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[var(--duo-orange)]" />
            </div>
            <h2 className="font-extrabold">Budget (per person)</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">RM</span>
              <input
                type="text"
                placeholder="Min"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                className="duo-input !pl-12 w-full"
              />
            </div>
            <span className="text-muted-foreground font-bold">to</span>
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">RM</span>
              <input
                type="text"
                placeholder="Max"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="duo-input !pl-12 w-full"
              />
            </div>
          </div>
        </motion.section>

        {/* Safety Options */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--duo-blue)]/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[var(--duo-blue)]" />
            </div>
            <h2 className="font-extrabold">Safety Options</h2>
          </div>
          <div className="space-y-2">
            <DuoCheckboxOption
              checked={avoidLateNight}
              onChange={setAvoidLateNight}
              label="Avoid late-night activities"
            />
            <DuoCheckboxOption
              checked={preferWellLit}
              onChange={setPreferWellLit}
              label="Prefer well-lit areas at night"
            />
            <DuoCheckboxOption
              checked={verifiedTransport}
              onChange={setVerifiedTransport}
              label="Verified transport only"
            />
          </div>
        </motion.section>

        {/* Alert Preferences */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--duo-orange)]/20 flex items-center justify-center">
              <Bell className="w-4 h-4 text-[var(--duo-orange)]" />
            </div>
            <h2 className="font-extrabold">Alert Preferences</h2>
          </div>
          <div className="space-y-2">
            <DuoCheckboxOption
              checked={highCrowd}
              onChange={setHighCrowd}
              label="High crowd predictions"
            />
            <DuoCheckboxOption
              checked={weatherDisruptions}
              onChange={setWeatherDisruptions}
              label="Weather disruptions"
            />
            <DuoCheckboxOption
              checked={priceDrops}
              onChange={setPriceDrops}
              label="Price drops"
            />
            <DuoCheckboxOption
              checked={safetyWarnings}
              onChange={setSafetyWarnings}
              label="Safety warnings"
            />
          </div>
        </motion.section>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="space-y-3 pt-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => router.back()} className="duo-btn duo-btn-outline">
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <DuoButton onClick={handleGeneratePlan} fullWidth>
              Generate Plan
              <ArrowRight className="w-5 h-5 ml-1" />
            </DuoButton>
          </div>

          {/* XP Hint */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
            <span>
              Earn <strong className="text-[var(--duo-green)]">+25 XP</strong> for setting preferences!
            </span>
          </div>
        </motion.div>
      </div>

      {/* Loading Modal */}
      {isLoading && (
        <div className="duo-reward-overlay">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="duo-reward-modal"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--duo-green)] flex items-center justify-center shadow-[0_6px_0_var(--duo-green-dark)]"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>

            <h2 className="text-xl font-extrabold mb-2">Generating Your Plan</h2>
            <p className="text-muted-foreground mb-6">Our AI is creating your perfect itinerary...</p>

            <div className="space-y-2 mb-6">
              {loadingSteps.map((step, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all",
                    index <= loadingStep
                      ? "bg-[var(--duo-green)]/10"
                      : "opacity-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full transition-all",
                      index <= loadingStep ? "bg-[var(--duo-green)]" : "bg-muted"
                    )}
                  />
                  <span className="text-sm font-semibold">{step}</span>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-[var(--duo-green)] font-bold">{loadingProgress}%</span>
              </div>
              <div className="duo-progress-bar h-3">
                <div
                  className="duo-progress-fill transition-all"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </DuoAppShell>
  );
}
