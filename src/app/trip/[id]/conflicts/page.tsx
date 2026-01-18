"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Lightbulb,
  Users,
  Wallet,
  Clock,
  Utensils,
  Zap,
  Home,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import { useTrip, type ConflictItem } from "@/contexts/trip-context";
import {
  DuoWizardLayout,
  DuoButton,
} from "@/components/shared/duo-wizard-layout";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { cn } from "@/lib/utils";

const conflictIcons: Record<string, React.ElementType> = {
  budget: Wallet,
  pacing: Zap,
  accommodation: Home,
  timing: Clock,
  dietary: Utensils,
  activity: Sparkles,
};

const severityColors = {
  high: {
    bg: "bg-[var(--duo-red)]/10",
    border: "border-[var(--duo-red)]",
    text: "text-[var(--duo-red)]",
    icon: "text-[var(--duo-red)]",
    shadow: "0 4px 0 var(--duo-red-dark)",
  },
  medium: {
    bg: "bg-[var(--duo-orange)]/10",
    border: "border-[var(--duo-orange)]",
    text: "text-[var(--duo-orange)]",
    icon: "text-[var(--duo-orange)]",
    shadow: "0 4px 0 var(--duo-orange-dark)",
  },
  low: {
    bg: "bg-[var(--duo-blue)]/10",
    border: "border-[var(--duo-blue)]",
    text: "text-[var(--duo-blue)]",
    icon: "text-[var(--duo-blue)]",
    shadow: "0 4px 0 var(--duo-blue-dark)",
  },
};

export default function ConflictsPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;

  const {
    currentTrip,
    loadTrip,
    analyzeConflicts,
    resolveConflict,
    setStep: setTripStep,
  } = useTrip();

  const [analyzed, setAnalyzed] = useState(false);
  const [expandedConflict, setExpandedConflict] = useState<string | null>(null);
  const [celebrateMode, setCelebrateMode] = useState(false);

  useEffect(() => {
    if (!currentTrip || currentTrip.id !== tripId) {
      const loaded = loadTrip(tripId);
      if (!loaded) {
        router.replace("/trip/new");
      }
    }
  }, [tripId, currentTrip, loadTrip, router]);

  useEffect(() => {
    if (currentTrip && !analyzed) {
      analyzeConflicts();
      setAnalyzed(true);
    }
  }, [currentTrip, analyzed, analyzeConflicts]);

  const handleResolve = (conflictId: string, resolution: string) => {
    resolveConflict(conflictId, resolution);
    setExpandedConflict(null);

    // Check if all conflicts are resolved
    const allResolved = currentTrip?.conflicts
      .map(c => c.id === conflictId ? { ...c, resolved: true } : c)
      .every(c => c.resolved);

    if (allResolved) {
      setCelebrateMode(true);
      setTimeout(() => {
        setCelebrateMode(false);
      }, 2000);
    }
  };

  const handleContinue = () => {
    setTripStep("recommendations");
    router.push(`/trip/${tripId}/recommendations`);
  };

  if (!currentTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <DuoMascot mood="thinking" size="lg" />
      </div>
    );
  }

  const unresolvedCount = currentTrip.conflicts.filter(c => !c.resolved).length;
  const allResolved = unresolvedCount === 0;

  return (
    <>
      <DuoWizardLayout
        title={
          allResolved
            ? "All set!"
            : `${unresolvedCount} thing${unresolvedCount > 1 ? "s" : ""} to discuss`
        }
        subtitle={
          allResolved
            ? "Your group is aligned! Ready to see the plan?"
            : "Review and resolve these differences"
        }
        showProgress
        showBack
        onBack={() => router.push(`/trip/${tripId}/preferences`)}
        mascot={
          <DuoMascot
            mood={allResolved ? "celebrating" : "thinking"}
            size="sm"
          />
        }
        footer={
          <DuoButton onClick={handleContinue} fullWidth>
            {allResolved ? "See The Plan" : "Continue Anyway"}
            <ChevronRight className="w-5 h-5 ml-1" />
          </DuoButton>
        }
      >
        <div className="w-full space-y-4">
          {/* Aggregated Stats */}
          {currentTrip.aggregatedPreferences && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="duo-card p-4"
            >
              <h3 className="font-bold text-sm text-muted-foreground uppercase mb-3">
                Group Summary
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-xl bg-muted">
                  <Wallet className="w-5 h-5 mx-auto mb-1 text-[var(--duo-green)]" />
                  <p className="text-xs text-muted-foreground">Avg Budget</p>
                  <p className="font-bold">RM {currentTrip.aggregatedPreferences.budgetRange.average}/day</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted">
                  <Users className="w-5 h-5 mx-auto mb-1 text-[var(--duo-blue)]" />
                  <p className="text-xs text-muted-foreground">Members</p>
                  <p className="font-bold">{currentTrip.members.length} people</p>
                </div>
              </div>

              {/* Top Activities */}
              {currentTrip.aggregatedPreferences.topActivities.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Popular activities:</p>
                  <div className="flex flex-wrap gap-2">
                    {currentTrip.aggregatedPreferences.topActivities.map((activity) => (
                      <span
                        key={activity}
                        className="px-2 py-1 text-xs font-bold rounded-full bg-[var(--duo-green)]/10 text-[var(--duo-green)]"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* No Conflicts */}
          {currentTrip.conflicts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="duo-card duo-card-green p-6 text-center"
            >
              <PartyPopper className="w-12 h-12 mx-auto mb-3 text-[var(--duo-green)]" />
              <h3 className="font-bold text-xl mb-2">Perfect Match!</h3>
              <p className="text-muted-foreground">
                Everyone&apos;s preferences align perfectly. No conflicts to resolve!
              </p>
            </motion.div>
          )}

          {/* Conflicts List */}
          <AnimatePresence mode="popLayout">
            {currentTrip.conflicts.map((conflict, index) => (
              <ConflictCard
                key={conflict.id}
                conflict={conflict}
                index={index}
                expanded={expandedConflict === conflict.id}
                onToggle={() => setExpandedConflict(
                  expandedConflict === conflict.id ? null : conflict.id
                )}
                onResolve={(resolution) => handleResolve(conflict.id, resolution)}
              />
            ))}
          </AnimatePresence>
        </div>
      </DuoWizardLayout>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {celebrateMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-card rounded-3xl p-8 text-center max-w-sm mx-4"
            >
              <DuoMascot mood="celebrating" size="lg" />
              <h2 className="text-2xl font-extrabold mt-4 mb-2">All Resolved!</h2>
              <p className="text-muted-foreground">
                Great teamwork! Your group is aligned.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// Conflict Card Component
// ============================================================================

interface ConflictCardProps {
  conflict: ConflictItem;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onResolve: (resolution: string) => void;
}

function ConflictCard({ conflict, index, expanded, onToggle, onResolve }: ConflictCardProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const Icon = conflictIcons[conflict.type] || AlertTriangle;
  const colors = severityColors[conflict.severity];

  if (conflict.resolved) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="duo-card duo-card-green p-4 flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-[var(--duo-green)] flex items-center justify-center shrink-0">
          <Check className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold line-through text-muted-foreground">{conflict.description}</p>
          {conflict.resolution && (
            <p className="text-sm text-[var(--duo-green)]">✓ {conflict.resolution}</p>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "duo-card overflow-hidden",
        colors.border
      )}
      style={{ boxShadow: colors.shadow }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-4 text-left"
      >
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          colors.bg
        )}>
          <Icon className={cn("w-5 h-5", colors.icon)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-full uppercase",
              colors.bg, colors.text
            )}>
              {conflict.severity}
            </span>
            <span className="text-xs text-muted-foreground">
              {conflict.type}
            </span>
          </div>
          <p className="font-bold">{conflict.description}</p>
          <p className="text-sm text-muted-foreground">
            Affects: {conflict.affectedMembers.join(", ")}
          </p>
        </div>
        <ChevronRight className={cn(
          "w-5 h-5 text-muted-foreground transition-transform",
          expanded && "rotate-90"
        )} />
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border"
          >
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-bold text-sm flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-[var(--duo-yellow)]" />
                  Suggestions
                </h4>
                <div className="space-y-2">
                  {conflict.suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSuggestion(suggestion)}
                      className={cn(
                        "w-full text-left p-3 rounded-xl border-2 transition-all",
                        selectedSuggestion === suggestion
                          ? "border-[var(--duo-green)] bg-[var(--duo-green)]/10"
                          : "border-border hover:border-[var(--duo-blue)]"
                      )}
                    >
                      <span className="text-sm">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>

              <DuoButton
                onClick={() => selectedSuggestion && onResolve(selectedSuggestion)}
                disabled={!selectedSuggestion}
                fullWidth
              >
                <Check className="w-5 h-5 mr-1" />
                Mark as Resolved
              </DuoButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
