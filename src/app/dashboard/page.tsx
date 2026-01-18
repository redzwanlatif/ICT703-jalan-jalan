"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CalendarDays,
  Coins,
  Heart,
  Users,
  Wallet,
  MapPin,
  ChevronRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ChevronDown,
} from "lucide-react";
import { DuoResponsiveLayout } from "@/components/shared";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DuoButton } from "@/components/shared/duo-wizard-layout";
import TabBar from "@/components/ui/TabBar";
import { cn } from "@/lib/utils";
import { ConflictItem, SummaryStat, DashboardDestination } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DashboardTripSelector,
  useSelectedTrip,
  getMockupDataForDestination,
} from "@/components/dashboard/trip-selector";
import { Suspense } from "react";

function severityStyles(severity: ConflictItem["severity"]) {
  switch (severity) {
    case "high":
      return {
        container: "border-[var(--duo-red)] bg-[var(--duo-red)]/10",
        icon: "text-[var(--duo-red)]",
        badge: "bg-[var(--duo-red)] text-white",
      };
    case "medium":
      return {
        container: "border-[var(--duo-yellow)] bg-[var(--duo-yellow)]/10",
        icon: "text-[var(--duo-yellow)]",
        badge: "bg-[var(--duo-yellow)] text-white",
      };
    case "low":
    default:
      return {
        container: "border-[var(--duo-blue)] bg-[var(--duo-blue)]/10",
        icon: "text-[var(--duo-blue)]",
        badge: "bg-[var(--duo-blue)] text-white",
      };
  }
}

function DashboardContent() {
  const [conflictFilter, setConflictFilter] = React.useState<string>("all");
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);
  const [expandedCard, setExpandedCard] = React.useState<string | null>(null);

  // Use shared trip selector hook
  const { selectedTrip } = useSelectedTrip();

  // Use selected trip data or fallback
  const destination = selectedTrip?.destination || "Malaysia";
  const memberCount = selectedTrip?.members.length || 4;

  // Generate mockup data based on selected trip
  const mockupData = React.useMemo(() => {
    return getMockupDataForDestination(destination);
  }, [destination]);

  const summary: SummaryStat[] = [
    {
      label: "Group Size",
      value: String(memberCount),
      sub: memberCount === 1 ? "traveler" : "travelers",
      icon: <Users className="w-5 h-5 text-[var(--duo-purple)]" />,
    },
    {
      label: "Avg. Budget",
      value: mockupData.budgetRange,
      sub: "per person",
      icon: <Wallet className="w-5 h-5 text-[var(--duo-green)]" />,
    },
    {
      label: "Preferred Seasons",
      value: mockupData.seasons,
      sub: `${mockupData.seasonCount} options`,
      icon: <CalendarDays className="w-5 h-5 text-[var(--duo-blue)]" />,
    },
    {
      label: "Common Interests",
      value: mockupData.interests,
      sub: `${mockupData.interestCount} total interests`,
      icon: <Heart className="w-5 h-5 text-[var(--duo-red)]" />,
    },
  ];

  // Generate conflicts based on trip members
  const conflicts: ConflictItem[] = React.useMemo(() => {
    const names = selectedTrip?.members.map(m => m.name) || mockupData.memberNames;
    const conflictTemplates = [
      { severity: "high" as const, template: "Prefers higher-budget trips (min RM1000)" },
      { severity: "high" as const, template: "Has dietary restrictions not fully covered" },
      { severity: "medium" as const, template: "May not enjoy all selected activities" },
      { severity: "medium" as const, template: "Prefers different accommodation type" },
      { severity: "low" as const, template: "Prefers different travel pace" },
      { severity: "low" as const, template: "Has minor schedule conflicts" },
    ];

    // Generate different conflicts based on member count
    const numConflicts = Math.min(memberCount + 1, 4);
    return conflictTemplates.slice(0, numConflicts).map((c, i) => ({
      severity: c.severity,
      title: names[i % names.length] || `Member ${i + 1}`,
      description: c.template,
    }));
  }, [selectedTrip, memberCount, mockupData.memberNames]);

  const destinations: DashboardDestination[] = mockupData.destinations;

  const filteredConflicts = conflicts.filter((c) => {
    if (conflictFilter === "all") return true;
    return c.severity === conflictFilter;
  });

  const conflictCounts = {
    high: conflicts.filter((c) => c.severity === "high").length,
    medium: conflicts.filter((c) => c.severity === "medium").length,
    low: conflicts.filter((c) => c.severity === "low").length,
  };

  const filterOptions = [
    { value: "all", label: `All (${conflicts.length})`, color: "var(--duo-green)" },
    { value: "high", label: `High (${conflictCounts.high})`, color: "var(--duo-red)" },
    { value: "medium", label: `Medium (${conflictCounts.medium})`, color: "var(--duo-yellow)" },
    { value: "low", label: `Low (${conflictCounts.low})`, color: "var(--duo-blue)" },
  ];

  return (
    <DuoResponsiveLayout showTopBar showBottomNav>
      <TabBar />
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <DuoMascot mood="thinking" size="sm" />
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">Trip Dashboard</h1>
            <p className="text-muted-foreground flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {destination}
            </p>
          </div>
        </motion.div>

        {/* Trip Selector */}
        <Suspense fallback={<div className="duo-card p-3 animate-pulse h-16" />}>
          <DashboardTripSelector />
        </Suspense>

        {/* Group Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h2 className="font-extrabold flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--duo-purple)]" />
            Group Summary
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {summary.map((s, index) => {
              const isClickable = ["Avg. Budget", "Preferred Seasons", "Common Interests"].includes(s.label);
              
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={cn(
                    "duo-card p-4",
                    isClickable && "cursor-pointer hover:border-[var(--duo-blue)] transition-colors"
                  )}
                  onClick={() => isClickable && setExpandedCard(s.label)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      {s.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="font-bold text-sm truncate mt-0.5">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.sub}</p>
                      {isClickable && (
                        <p className="text-[10px] text-[var(--duo-blue)] mt-1 font-semibold">
                          Tap to expand
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Detail Modal */}
          <Dialog open={expandedCard !== null} onOpenChange={(open) => !open && setExpandedCard(null)}>
            <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                {expandedCard && (
                  <>
                    {expandedCard === "Avg. Budget" && (
                      <>
                        <DialogTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[var(--duo-green)]/10 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-[var(--duo-green)]" />
                          </div>
                          <span>Average Budget Details</span>
                        </DialogTitle>
                        <div className="space-y-4 pt-4">
                          <div className="bg-[var(--duo-green)]/5 rounded-lg p-4 border-l-4 border-[var(--duo-green)]">
                            <p className="text-sm font-semibold text-muted-foreground mb-3">Budget Breakdown:</p>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center py-2 border-b border-border/50">
                                <span className="text-sm text-muted-foreground">Low</span>
                                <span className="text-base font-bold text-[var(--duo-green)]">RM1,325/person</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-border/50">
                                <span className="text-sm text-muted-foreground">Average</span>
                                <span className="text-base font-bold text-[var(--duo-green)]">RM1,975/person</span>
                              </div>
                              <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-muted-foreground">High</span>
                                <span className="text-base font-bold text-[var(--duo-green)]">RM2,625/person</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground text-center">Based on 4 travelers' preferences</p>
                        </div>
                      </>
                    )}
                    
                    {expandedCard === "Preferred Seasons" && (
                      <>
                        <DialogTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[var(--duo-blue)]/10 flex items-center justify-center">
                            <CalendarDays className="w-5 h-5 text-[var(--duo-blue)]" />
                          </div>
                          <span>Preferred Seasons Details</span>
                        </DialogTitle>
                        <div className="space-y-4 pt-4">
                          <p className="text-sm font-semibold text-muted-foreground">Season Details:</p>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--duo-blue)]/5 border border-[var(--duo-blue)]/20">
                              <span className="text-2xl shrink-0">🌙</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold">Raya (Hari Raya Aidilfitri)</p>
                                <p className="text-xs text-muted-foreground mt-1">April - May</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--duo-red)]/5 border border-[var(--duo-red)]/20">
                              <span className="text-2xl shrink-0">🧧</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold">CNY (Chinese New Year)</p>
                                <p className="text-xs text-muted-foreground mt-1">January - February</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--duo-blue)]/5 border border-[var(--duo-blue)]/20">
                              <span className="text-2xl shrink-0">🇲🇾</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold">Merdeka (Independence Day)</p>
                                <p className="text-xs text-muted-foreground mt-1">August</p>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground text-center">All 4 travelers prefer these seasons</p>
                        </div>
                      </>
                    )}
                    
                    {expandedCard === "Common Interests" && (
                      <>
                        <DialogTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[var(--duo-red)]/10 flex items-center justify-center">
                            <Heart className="w-5 h-5 text-[var(--duo-red)]" />
                          </div>
                          <span>Common Interests Details</span>
                        </DialogTitle>
                        <div className="space-y-4 pt-4">
                          <p className="text-sm font-semibold text-muted-foreground">All Interests:</p>
                          <div className="flex flex-wrap gap-2">
                            {["Beach", "Culture", "Food", "Shopping", "Nature", "Adventure", "Photography", "Nightlife"].map((interest) => (
                              <span
                                key={interest}
                                className="px-3 py-1.5 rounded-full text-sm font-bold bg-[var(--duo-red)]/10 text-[var(--duo-red)] border border-[var(--duo-red)]/20"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground text-center">Shared interests across all group members</p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Budget Fit */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="duo-card p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[var(--duo-green)]" />
              Budget Fit
            </h2>
            <span className={cn(
              "text-2xl font-extrabold",
              mockupData.budgetFit >= 70 ? "text-[var(--duo-green)]" :
              mockupData.budgetFit >= 50 ? "text-[var(--duo-yellow)]" :
              "text-[var(--duo-red)]"
            )}>
              {mockupData.budgetFit}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="duo-progress-bar h-3">
              <div
                className="duo-progress-fill"
                style={{
                  width: `${mockupData.budgetFit}%`,
                  background: mockupData.budgetFit >= 70 ? "var(--duo-green)" :
                             mockupData.budgetFit >= 50 ? "var(--duo-yellow)" :
                             "var(--duo-red)",
                }}
              />
            </div>
            <div className={cn(
              "flex items-center gap-2 text-sm font-semibold",
              mockupData.budgetFit >= 70 ? "text-[var(--duo-green)]" :
              mockupData.budgetFit >= 50 ? "text-[var(--duo-yellow)]" :
              "text-[var(--duo-red)]"
            )}>
              {mockupData.budgetFit >= 70 ? (
                <><TrendingUp className="w-4 h-4" /> Good budget alignment</>
              ) : mockupData.budgetFit >= 50 ? (
                <><TrendingUp className="w-4 h-4" /> Moderate budget fit</>
              ) : (
                <><TrendingDown className="w-4 h-4" /> Budget needs adjustment</>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t-2 border-border">
            <div>
              <p className="text-xs text-muted-foreground">Avg. Cost/Person</p>
              <p className="text-lg font-extrabold">RM{mockupData.avgCost}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg. Budget Range</p>
              <p className="text-lg font-extrabold">{mockupData.budgetRange}</p>
            </div>
          </div>
        </motion.div>

        {/* Potential Conflicts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
          <h2 className="font-extrabold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[var(--duo-yellow)]" />
            Potential Conflicts
          </h2>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={cn(
                  "px-3 py-1.5 rounded-xl border-2 text-sm font-bold flex items-center gap-2 transition-colors",
                  conflictFilter === "all"
                    ? "border-border hover:border-[var(--duo-blue)]"
                    : {
                        "border-[var(--duo-red)] text-[var(--duo-red)] bg-[var(--duo-red)]/5":
                          conflictFilter === "high",
                        "border-[var(--duo-yellow)] text-[var(--duo-yellow)] bg-[var(--duo-yellow)]/5":
                          conflictFilter === "medium",
                        "border-[var(--duo-blue)] text-[var(--duo-blue)] bg-[var(--duo-blue)]/5":
                          conflictFilter === "low",
                      }
                )}
              >
                {conflictFilter !== "all" && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: filterOptions.find(
                        (f) => f.value === conflictFilter
                      )?.color,
                    }}
                  />
                )}
                {filterOptions.find((f) => f.value === conflictFilter)?.label}
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    showFilterDropdown && "rotate-180"
                  )}
                />
              </button>
              {showFilterDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full right-0 mt-1 bg-card border-2 border-border rounded-xl shadow-lg z-50 overflow-hidden min-w-[140px]"
                >
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setConflictFilter(option.value);
                        setShowFilterDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm font-semibold hover:bg-muted transition-colors flex items-center gap-2",
                        conflictFilter === option.value && {
                          "bg-[var(--duo-green)]/10 text-[var(--duo-green)]":
                            option.color === "var(--duo-green)",
                          "bg-[var(--duo-red)]/10 text-[var(--duo-red)]":
                            option.color === "var(--duo-red)",
                          "bg-[var(--duo-yellow)]/10 text-[var(--duo-yellow)]":
                            option.color === "var(--duo-yellow)",
                          "bg-[var(--duo-blue)]/10 text-[var(--duo-blue)]":
                            option.color === "var(--duo-blue)",
                        }
                      )}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {filteredConflicts.map((c, idx) => {
              const styles = severityStyles(c.severity);
              return (
                <motion.div
                  key={`${c.title}-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn("duo-card p-4 flex items-start gap-3", styles.container)}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/60"
                    )}
                  >
                    <Coins className={cn("w-4 h-4", styles.icon)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm">{c.title}</p>
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                          styles.badge
                        )}
                      >
                        {c.severity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{c.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Proposed Destinations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <h2 className="font-extrabold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[var(--duo-blue)]" />
            Proposed Destinations
          </h2>

          <div className="space-y-3">
            {destinations.map((d, index) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="duo-card p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{d.title}</h3>
                    <p className="text-xs text-muted-foreground">{d.description}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 px-3 py-1 rounded-full text-xs font-bold",
                      d.alignmentPercent >= 50
                        ? "bg-[var(--duo-green)]/20 text-[var(--duo-green)]"
                        : "bg-[var(--duo-orange)]/20 text-[var(--duo-orange)]"
                    )}
                  >
                    {d.matchLabel}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    {d.cost}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {d.season}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {d.interests}
                  </span>
                </div>

                {/* Alignment Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Group Alignment</span>
                    <span className="font-bold">{d.alignmentPercent}%</span>
                  </div>
                  <div className="duo-progress-bar h-2">
                    <div
                      className="duo-progress-fill"
                      style={{
                        width: `${d.alignmentPercent}%`,
                        background:
                          d.alignmentPercent >= 50
                            ? "var(--duo-green)"
                            : "var(--duo-orange)",
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-6"
        >
          <Link href="/dashboard/itenary" className="block mb-4">
            <DuoButton fullWidth>
              View Full Itinerary
              <ChevronRight className="w-5 h-5 ml-1" />
            </DuoButton>
          </Link>

          <Link href="/dashboard/member" className="block">
            <button className="w-full duo-btn duo-btn-outline">
              <Users className="w-5 h-5 mr-2" />
              Manage Members
            </button>
          </Link>

          {/* XP Hint */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
            <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
            <span>
              Earn <strong className="text-[var(--duo-green)]">+15 XP</strong> for
              resolving conflicts!
            </span>
          </div>
        </motion.div>
      </div>
    </DuoResponsiveLayout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <DuoResponsiveLayout showTopBar showBottomNav>
        <TabBar />
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-muted rounded-xl" />
            <div className="h-12 bg-muted rounded-xl" />
            <div className="h-64 bg-muted rounded-xl" />
          </div>
        </div>
      </DuoResponsiveLayout>
    }>
      <DashboardContent />
    </Suspense>
  );
}
