"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Wallet,
  CalendarDays,
  Clock,
  AlertCircle,
  Lightbulb,
  X,
  Plus,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Map,
  AlertTriangle,
} from "lucide-react";
import { DuoAppShell } from "@/components/shared/duo-bottom-nav";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DuoButton } from "@/components/shared/duo-wizard-layout";
import TabBar from "@/components/ui/TabBar";
import { cn } from "@/lib/utils";
import { initialMembers, initialDestinations } from "@/data/seed";
import Link from "next/link";

type ConflictIssue = {
  id: string;
  member: string;
  description: string;
  severity: "high" | "medium" | "low";
};

type Destination = {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: string;
  season: string;
  interests: string[];
  groupMatch: number;
  individualMatches: {
    name: string;
    percentage: number;
  }[];
  note?: string;
};

const calculateGroupMatch = (
  destination: Destination,
  members: typeof initialMembers
): number => {
  let totalScore = 0;
  const maxScore = members.length * 3;

  members.forEach((member) => {
    let memberScore = 0;
    if (destination.cost <= member.budgetMax) memberScore += 1;
    if (member.seasons.includes(destination.season)) memberScore += 1;
    const commonInterests = destination.interests.filter((interest) =>
      member.interests.includes(interest)
    );
    if (commonInterests.length > 0) memberScore += 1;
    totalScore += memberScore;
  });

  return Math.round((totalScore / maxScore) * 100);
};

const calculateIndividualMatch = (
  destination: Destination,
  member: (typeof initialMembers)[0]
): number => {
  let score = 0;
  const maxScore = 3;
  if (destination.cost <= member.budgetMax) score += 1;
  if (member.seasons.includes(destination.season)) score += 1;
  const commonInterests = destination.interests.filter((interest) =>
    member.interests.includes(interest)
  );
  if (commonInterests.length > 0) score += 1;
  return Math.round((score / maxScore) * 100);
};

function severityStyles(severity: ConflictIssue["severity"]) {
  switch (severity) {
    case "high":
      return {
        container: "border-[var(--duo-red)] bg-[var(--duo-red)]/10",
        icon: "text-[var(--duo-red)]",
        badge: "bg-[var(--duo-red)] text-white",
        dot: "bg-[var(--duo-red)]",
      };
    case "medium":
      return {
        container: "border-[var(--duo-orange)] bg-[var(--duo-orange)]/10",
        icon: "text-[var(--duo-orange)]",
        badge: "bg-[var(--duo-orange)] text-white",
        dot: "bg-[var(--duo-orange)]",
      };
    case "low":
    default:
      return {
        container: "border-[var(--duo-blue)] bg-[var(--duo-blue)]/10",
        icon: "text-[var(--duo-blue)]",
        badge: "bg-[var(--duo-blue)] text-white",
        dot: "bg-[var(--duo-blue)]",
      };
  }
}

export default function ItineraryPage() {
  const [selectedDay, setSelectedDay] = React.useState("1");
  const [conflictFilter, setConflictFilter] = React.useState<string>("all");
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);

  const [currentSelectedDestinations, setCurrentSelectedDestinations] =
    React.useState<Destination[]>(() => {
      const selected = initialDestinations.slice(0, 2).map((dest) => {
        const destinationForCalc = {
          ...dest,
          cost: dest.cost,
          interests: dest.category,
          groupMatch: 0,
          individualMatches: [],
          note: "",
          duration: `${dest.duration} days`,
          season: dest.season,
          id: dest.id,
          name: dest.name,
          description: dest.description,
        };
        return {
          ...destinationForCalc,
          groupMatch: calculateGroupMatch(destinationForCalc, initialMembers),
          individualMatches: initialMembers.map((member) => ({
            name: member.name.split(" ")[0],
            percentage: calculateIndividualMatch(destinationForCalc, member),
          })),
        };
      });
      return selected;
    });

  const [currentAvailableDestinations, setCurrentAvailableDestinations] =
    React.useState<Destination[]>(() => {
      const available = initialDestinations.slice(2, 4).map((dest) => {
        const destinationForCalc = {
          ...dest,
          cost: dest.cost,
          interests: dest.category,
          groupMatch: 0,
          individualMatches: [],
          note: "",
          duration: `${dest.duration} days`,
          season: dest.season,
          id: dest.id,
          name: dest.name,
          description: dest.description,
        };
        return {
          ...destinationForCalc,
          groupMatch: calculateGroupMatch(destinationForCalc, initialMembers),
          individualMatches: initialMembers.map((member) => ({
            name: member.name.split(" ")[0],
            percentage: calculateIndividualMatch(destinationForCalc, member),
          })),
        };
      });
      return available;
    });

  const totalCost = currentSelectedDestinations.reduce(
    (acc, dest) => acc + dest.cost,
    0
  );
  const memberCount = 4;

  const handleSelectDestination = (destination: Destination) => {
    setCurrentAvailableDestinations((prev) =>
      prev.filter((d) => d.id !== destination.id)
    );
    setCurrentSelectedDestinations((prev) => [...prev, destination]);
  };

  const handleDeselectDestination = (destination: Destination) => {
    setCurrentSelectedDestinations((prev) =>
      prev.filter((d) => d.id !== destination.id)
    );
    setCurrentAvailableDestinations((prev) => [...prev, destination]);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage > 60)
      return "bg-[var(--duo-green)]/20 text-[var(--duo-green)]";
    if (percentage >= 50)
      return "bg-[var(--duo-orange)]/20 text-[var(--duo-orange)]";
    return "bg-[var(--duo-red)]/20 text-[var(--duo-red)]";
  };

  const day1Activities = [
    "Morning: Arrive in Melaka, check into hotel.",
    "Afternoon: Explore A Famosa fortress and St. Paul's Hill.",
    "Evening: Dinner and shopping at Jonker Street Night Market.",
  ];

  const conflictIssues: ConflictIssue[] = [
    {
      id: "1",
      member: "Wong",
      description: "Budget for shopping is too low.",
      severity: "high",
    },
    {
      id: "2",
      member: "Nurul",
      description: "Accommodation budget exceeds limit.",
      severity: "high",
    },
    {
      id: "3",
      member: "Ahmad",
      description: "Food and dining budget is insufficient.",
      severity: "high",
    },
    {
      id: "4",
      member: "Priya",
      description: "Transportation costs are too high.",
      severity: "high",
    },
    {
      id: "5",
      member: "Ahmad",
      description: "Not interested in historical sites.",
      severity: "medium",
    },
    {
      id: "6",
      member: "Wong",
      description: "Prefers adventure activities over cultural tours.",
      severity: "medium",
    },
    {
      id: "7",
      member: "Priya",
      description: "Prefers different travel season.",
      severity: "low",
    },
  ];

  const filteredConflicts = conflictIssues.filter((c) => {
    if (conflictFilter === "all") return true;
    return c.severity === conflictFilter;
  });

  const conflictCounts = {
    high: conflictIssues.filter((c) => c.severity === "high").length,
    medium: conflictIssues.filter((c) => c.severity === "medium").length,
    low: conflictIssues.filter((c) => c.severity === "low").length,
  };

  const filterOptions = [
    { value: "all", label: `All (${conflictIssues.length})` },
    {
      value: "high",
      label: `High (${conflictCounts.high})`,
      color: "var(--duo-red)",
    },
    {
      value: "medium",
      label: `Medium (${conflictCounts.medium})`,
      color: "var(--duo-orange)",
    },
    {
      value: "low",
      label: `Low (${conflictCounts.low})`,
      color: "var(--duo-blue)",
    },
  ];

  return (
    <DuoAppShell showTopBar showBottomNav>
      <div className="sticky top-0 z-20 bg-background">
        <TabBar totalCost={totalCost} memberCount={memberCount} />
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <DuoMascot mood="excited" size="sm" />
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">Trip Itinerary</h1>
            <p className="text-muted-foreground flex items-center gap-1">
              <Map className="w-4 h-4" />3 days •{" "}
              {currentSelectedDestinations.length} destinations
            </p>
          </div>
        </motion.div>

        {/* Day Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex gap-2"
        >
          {["1", "2", "3"].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2",
                selectedDay === day
                  ? "bg-[var(--duo-green)] text-white border-[var(--duo-green)] shadow-[0_3px_0_var(--duo-green-dark)]"
                  : "bg-card border-border hover:border-[var(--duo-green)]"
              )}
            >
              Day {day}
            </button>
          ))}
        </motion.div>

        {/* Day Content */}
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="duo-card p-4 space-y-4"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[var(--duo-blue)]" />
            <h3 className="font-extrabold">Jonker Street & A Famosa</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Explore UNESCO World Heritage sites including A Famosa fortress, St.
            Paul's Hill, and vibrant Jonker Street with its night market,
            antiques, and authentic Peranakan cuisine
          </p>

          <div className="flex flex-wrap gap-3 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Wallet className="w-4 h-4" />
              RM600
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />1 day
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <CalendarDays className="w-4 h-4" />
              CNY
            </span>
          </div>

          {/* Group Match */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Group Match</span>
              <span className="font-bold text-[var(--duo-purple)]">47%</span>
            </div>
            <div className="duo-progress-bar h-2">
              <div
                className="duo-progress-fill"
                style={{ width: "47%", background: "var(--duo-purple)" }}
              />
            </div>
          </div>

          {/* Interests */}
          <div className="flex flex-wrap gap-2">
            {["Culture", "Food", "Shopping"].map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--duo-purple)]/10 text-[var(--duo-purple)] border-2 border-[var(--duo-purple)]/20"
              >
                {interest}
              </span>
            ))}
          </div>

          {/* Activities */}
          <div className="pt-4 border-t-2 border-border">
            <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[var(--duo-blue)]" />
              Day {selectedDay} Activities
            </h4>
            <ul className="space-y-2">
              {day1Activities.map((activity, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-[var(--duo-green)] font-bold">•</span>
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Conflict Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[var(--duo-orange)]" />
              Conflict Analysis
            </h2>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="px-3 py-1.5 rounded-xl border-2 border-border text-sm font-bold flex items-center gap-2 hover:border-[var(--duo-blue)] transition-colors"
              >
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
                        "w-full px-4 py-2 text-left text-sm font-semibold hover:bg-muted transition-colors",
                        conflictFilter === option.value &&
                          "bg-[var(--duo-green)]/10 text-[var(--duo-green)]"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Conflict Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="duo-card p-3 text-center">
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-[var(--duo-red)]/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-[var(--duo-red)]" />
              </div>
              <p className="text-xl font-extrabold text-[var(--duo-red)]">
                {conflictCounts.high}
              </p>
              <p className="text-xs text-muted-foreground">Budget</p>
            </div>
            <div className="duo-card p-3 text-center">
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-[var(--duo-orange)]/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-[var(--duo-orange)]" />
              </div>
              <p className="text-xl font-extrabold text-[var(--duo-orange)]">
                {conflictCounts.medium}
              </p>
              <p className="text-xs text-muted-foreground">Interest</p>
            </div>
            <div className="duo-card p-3 text-center">
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-[var(--duo-blue)]/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-[var(--duo-blue)]" />
              </div>
              <p className="text-xl font-extrabold text-[var(--duo-blue)]">
                {conflictCounts.low}
              </p>
              <p className="text-xs text-muted-foreground">Season</p>
            </div>
          </div>

          {/* Conflict List */}
          <div className="space-y-2">
            {filteredConflicts.map((issue, idx) => {
              const styles = severityStyles(issue.severity);
              return (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "duo-card p-3 flex items-start gap-3",
                    styles.container
                  )}
                >
                  <div
                    className={cn("w-2 h-2 rounded-full mt-1.5", styles.dot)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{issue.member}</p>
                    <p className="text-xs text-muted-foreground">
                      {issue.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Recommendations */}
          <div className="duo-card p-4 bg-[var(--duo-purple)]/5 border-[var(--duo-purple)]/20">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-[var(--duo-purple)] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm mb-2">Recommendations</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    • Add destinations that match underserved interests to
                    improve group satisfaction
                  </li>
                  <li>
                    • Consider flexible travel dates to accommodate different
                    season preferences
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Selected Destinations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="font-extrabold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[var(--duo-green)]" />
            Selected Destinations
          </h2>

          <div className="space-y-3">
            {currentSelectedDestinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="duo-card p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold">{dest.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {dest.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeselectDestination(dest)}
                    className="p-2 rounded-lg hover:bg-[var(--duo-red)]/10 text-[var(--duo-red)]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Wallet className="w-3 h-3" />
                    RM{dest.cost}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {dest.season}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {dest.duration}
                  </span>
                </div>

                {/* Group Match */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Group Match</span>
                    <span className="font-bold">{dest.groupMatch}%</span>
                  </div>
                  <div className="duo-progress-bar h-2">
                    <div
                      className="duo-progress-fill"
                      style={{
                        width: `${dest.groupMatch}%`,
                        background:
                          dest.groupMatch > 60
                            ? "var(--duo-green)"
                            : "var(--duo-orange)",
                      }}
                    />
                  </div>
                </div>

                {/* Individual Matches */}
                <div className="flex flex-wrap gap-2">
                  {dest.individualMatches.map((match) => (
                    <span
                      key={match.name}
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-bold",
                        getMatchColor(match.percentage)
                      )}
                    >
                      {match.name}: {match.percentage}%
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Available Destinations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3"
        >
          <h2 className="font-extrabold flex items-center gap-2">
            <Plus className="w-5 h-5 text-[var(--duo-blue)]" />
            Available Destinations
          </h2>

          <div className="space-y-3">
            {currentAvailableDestinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                className="duo-card p-4 space-y-3 border-dashed"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold">{dest.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {dest.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectDestination(dest)}
                    className="p-2 rounded-lg bg-[var(--duo-green)]/10 hover:bg-[var(--duo-green)]/20 text-[var(--duo-green)]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Wallet className="w-3 h-3" />
                    RM{dest.cost}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {dest.season}
                  </span>
                </div>

                {/* Group Match */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Group Match</span>
                    <span className="font-bold">{dest.groupMatch}%</span>
                  </div>
                  <div className="duo-progress-bar h-2">
                    <div
                      className="duo-progress-fill"
                      style={{
                        width: `${dest.groupMatch}%`,
                        background:
                          dest.groupMatch > 60
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

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 pt-4"
        >
          <Link href="/dashboard">
            <button className="w-full duo-btn duo-btn-outline">
              <ChevronRight className="w-5 h-5 mr-2 rotate-180" />
              Back to Dashboard
            </button>
          </Link>

          {/* XP Hint */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
            <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
            <span>
              Earn <strong className="text-[var(--duo-green)]">+20 XP</strong>{" "}
              for planning your itinerary!
            </span>
          </div>
        </motion.div>
      </div>
    </DuoAppShell>
  );
}
