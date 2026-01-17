"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Member } from "../../types";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndividualMemberDetailsProps {
  members: Member[];
}

const avatarGradients = [
  "from-[var(--duo-green)] to-[var(--duo-blue)]",
  "from-[var(--duo-blue)] to-[var(--duo-purple)]",
  "from-[var(--duo-purple)] to-[var(--duo-orange)]",
  "from-[var(--duo-orange)] to-[var(--duo-yellow)]",
  "from-[var(--duo-yellow)] to-[var(--duo-green)]",
];

const seasonColors: Record<string, string> = {
  Raya: "bg-[var(--duo-green)]/10 text-[var(--duo-green)] border-[var(--duo-green)]/20",
  CNY: "bg-[var(--duo-red)]/10 text-[var(--duo-red)] border-[var(--duo-red)]/20",
  Merdeka: "bg-[var(--duo-blue)]/10 text-[var(--duo-blue)] border-[var(--duo-blue)]/20",
  Deepavali: "bg-[var(--duo-yellow)]/10 text-[var(--duo-yellow-dark)] border-[var(--duo-yellow)]/20",
};

const seasonEmojis: Record<string, string> = {
  Raya: "🌙",
  CNY: "🧧",
  Merdeka: "🇲🇾",
  Deepavali: "🪔",
};

export function IndividualMemberDetails({ members }: IndividualMemberDetailsProps) {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "budget">("name");
  const [sortAsc, setSortAsc] = useState(true);

  const getCrowdLabel = (pref: string) => {
    switch (pref) {
      case "avoid":
        return { label: "Avoid Crowds", emoji: "🚫", color: "bg-[var(--duo-red)]/10 text-[var(--duo-red)]" };
      case "okay":
        return { label: "Okay with Crowds", emoji: "👥", color: "bg-[var(--duo-blue)]/10 text-[var(--duo-blue)]" };
      default:
        return { label: "No Preference", emoji: "🤷", color: "bg-muted text-muted-foreground" };
    }
  };

  const sortedMembers = [...members].sort((a, b) => {
    if (sortBy === "name") {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    const avgA = (a.budgetMin + a.budgetMax) / 2;
    const avgB = (b.budgetMin + b.budgetMax) / 2;
    return sortAsc ? avgA - avgB : avgB - avgA;
  });

  const toggleSort = (field: "name" | "budget") => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-3">
      {/* Sort Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => toggleSort("name")}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-bold border-2 transition-all flex items-center gap-1",
            sortBy === "name"
              ? "bg-[var(--duo-blue)] text-white border-[var(--duo-blue)] shadow-[0_2px_0_#1D4ED8]"
              : "bg-card border-border hover:border-[var(--duo-blue)]"
          )}
        >
          Name
          {sortBy === "name" && (
            sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
          )}
        </button>
        <button
          onClick={() => toggleSort("budget")}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-bold border-2 transition-all flex items-center gap-1",
            sortBy === "budget"
              ? "bg-[var(--duo-green)] text-white border-[var(--duo-green)] shadow-[0_2px_0_var(--duo-green-dark)]"
              : "bg-card border-border hover:border-[var(--duo-green)]"
          )}
        >
          Budget
          {sortBy === "budget" && (
            sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Member Cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedMembers.map((member, index) => {
            const memberAvg = Math.round((member.budgetMin + member.budgetMax) / 2);
            const gradientIndex =
              member.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
              avatarGradients.length;
            const isExpanded = expandedMember === member.id;
            const crowdInfo = getCrowdLabel(member.crowdPreference);

            const initials = member.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <motion.button
                  onClick={() => setExpandedMember(isExpanded ? null : member.id)}
                  className={cn(
                    "w-full duo-card p-4 text-left transition-all",
                    isExpanded && "ring-2 ring-[var(--duo-blue)] ring-offset-2"
                  )}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm shrink-0",
                        avatarGradients[gradientIndex]
                      )}
                    >
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold truncate">{member.name}</h4>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-bold text-[var(--duo-green)]">
                          RM{memberAvg.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground">avg budget</span>
                      </div>
                    </div>

                    {/* Quick Tags */}
                    <div className="hidden sm:flex items-center gap-2 shrink-0">
                      {member.seasons.slice(0, 2).map((season) => (
                        <span
                          key={season}
                          className="text-lg"
                          title={season}
                        >
                          {seasonEmojis[season]}
                        </span>
                      ))}
                      {member.seasons.length > 2 && (
                        <span className="text-xs font-bold text-muted-foreground">
                          +{member.seasons.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Expand Icon */}
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-2 rounded-lg bg-muted"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </div>
                </motion.button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 px-4 pb-2 space-y-4 mt-2 border-t-2 border-border">
                        {/* Budget Range */}
                        <div className="duo-card p-3 bg-[var(--duo-green)]/5 border-l-4 border-[var(--duo-green)]">
                          <p className="text-xs font-bold text-muted-foreground mb-1">Budget Range</p>
                          <p className="font-extrabold text-[var(--duo-green)]">
                            RM{member.budgetMin.toLocaleString()} — RM{member.budgetMax.toLocaleString()}
                          </p>
                        </div>

                        {/* Seasons */}
                        <div>
                          <p className="text-xs font-bold text-muted-foreground mb-2">Preferred Seasons</p>
                          <div className="flex flex-wrap gap-2">
                            {member.seasons.map((season) => (
                              <span
                                key={season}
                                className={cn(
                                  "px-3 py-1.5 rounded-full text-xs font-bold border-2 flex items-center gap-1.5",
                                  seasonColors[season] || "bg-muted"
                                )}
                              >
                                <span>{seasonEmojis[season]}</span>
                                {season}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Crowd Preference */}
                        <div>
                          <p className="text-xs font-bold text-muted-foreground mb-2">Crowd Preference</p>
                          <span
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 border-2",
                              crowdInfo.color,
                              crowdInfo.color.includes("red") ? "border-[var(--duo-red)]/20" : 
                              crowdInfo.color.includes("blue") ? "border-[var(--duo-blue)]/20" : 
                              "border-border"
                            )}
                          >
                            <span>{crowdInfo.emoji}</span>
                            {crowdInfo.label}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
