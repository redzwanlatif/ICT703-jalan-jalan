"use client";

import { motion } from "framer-motion";
import { Member } from "../../types";
import { DollarSign, Calendar, Users2, TrendingUp, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface GroupAggregateProps {
  members: Member[];
}

const seasonEmojis: Record<string, string> = {
  Raya: "🌙",
  CNY: "🧧",
  Merdeka: "🇲🇾",
  Deepavali: "🪔",
};

const crowdEmojis: Record<string, string> = {
  avoid: "🚫",
  okay: "👥",
  "no-preference": "🤷",
};

export function GroupAggregate({ members }: GroupAggregateProps) {
  // Calculate group aggregates
  const avgMinBudget = Math.round(
    members.reduce((sum, m) => sum + m.budgetMin, 0) / members.length
  );
  const avgMaxBudget = Math.round(
    members.reduce((sum, m) => sum + m.budgetMax, 0) / members.length
  );
  const avgBudget = Math.round((avgMinBudget + avgMaxBudget) / 2);

  // Season distribution
  const seasonCounts = members.reduce((acc, member) => {
    member.seasons.forEach((season) => {
      acc[season] = (acc[season] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topSeasons = Object.entries(seasonCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Crowd preference distribution
  const crowdCounts = members.reduce((acc, member) => {
    acc[member.crowdPreference] = (acc[member.crowdPreference] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCrowd = Object.entries(crowdCounts).sort((a, b) => b[1] - a[1])[0];

  const getCrowdLabel = (pref: string) => {
    switch (pref) {
      case "avoid":
        return "Avoid Crowds";
      case "okay":
        return "Okay with Crowds";
      default:
        return "No Preference";
    }
  };

  const statCards = [
    {
      icon: DollarSign,
      iconBg: "bg-[var(--duo-green)]/10",
      iconColor: "text-[var(--duo-green)]",
      title: "Average Budget",
      value: `RM${avgBudget.toLocaleString()}`,
      subtitle: `Range: RM${avgMinBudget.toLocaleString()} — RM${avgMaxBudget.toLocaleString()}`,
      accentColor: "var(--duo-green)",
      delay: 0,
    },
    {
      icon: Calendar,
      iconBg: "bg-[var(--duo-purple)]/10",
      iconColor: "text-[var(--duo-purple)]",
      title: "Top Season",
      value: topSeasons[0]?.[0] || "—",
      emoji: seasonEmojis[topSeasons[0]?.[0]] || "📅",
      subtitle: `${topSeasons[0]?.[1] || 0}/${members.length} members`,
      accentColor: "var(--duo-purple)",
      delay: 0.1,
    },
    {
      icon: Users2,
      iconBg: "bg-[var(--duo-blue)]/10",
      iconColor: "text-[var(--duo-blue)]",
      title: "Crowd Preference",
      value: topCrowd ? getCrowdLabel(topCrowd[0]) : "—",
      emoji: crowdEmojis[topCrowd?.[0]] || "🤷",
      subtitle: `${topCrowd?.[1] || 0}/${members.length} members`,
      accentColor: "var(--duo-blue)",
      delay: 0.2,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: stat.delay, type: "spring", stiffness: 300 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="duo-card p-5 relative overflow-hidden"
          >
            <div className="relative">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className={cn("p-2.5 rounded-xl", stat.iconBg)}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <stat.icon className={cn("w-5 h-5", stat.iconColor)} />
                </motion.div>
                <h4 className="font-bold text-sm text-muted-foreground">
                  {stat.title}
                </h4>
              </div>

              {/* Value */}
              <div className="flex items-center gap-2 mb-2">
                {stat.emoji && <span className="text-2xl">{stat.emoji}</span>}
                <motion.p
                  className="text-2xl font-extrabold"
                  style={{ color: stat.accentColor }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: stat.delay + 0.1 }}
                >
                  {stat.value}
                </motion.p>
              </div>

              {/* Subtitle */}
              <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Season Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="duo-card p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-[var(--duo-purple)]/10">
              <Trophy className="w-5 h-5 text-[var(--duo-purple)]" />
            </div>
            <h4 className="font-extrabold">Season Rankings</h4>
          </div>

          <div className="space-y-3">
            {topSeasons.map(([season, count], index) => {
              const percentage = Math.round((count / members.length) * 100);
              const colors = [
                { bg: "bg-[var(--duo-yellow)]", text: "text-[var(--duo-yellow-dark)]" },
                { bg: "bg-[var(--duo-blue)]/20", text: "text-[var(--duo-blue)]" },
                { bg: "bg-[var(--duo-orange)]/20", text: "text-[var(--duo-orange)]" },
              ];
              const color = colors[index] || colors[2];

              return (
                <motion.div
                  key={season}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm",
                      color.bg,
                      color.text
                    )}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold flex items-center gap-1.5">
                        <span>{seasonEmojis[season]}</span>
                        {season}
                      </span>
                      <span className="text-sm font-bold text-muted-foreground">
                        {count}/{members.length}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-[var(--duo-purple)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Crowd Preference Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="duo-card p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-[var(--duo-blue)]/10">
              <Target className="w-5 h-5 text-[var(--duo-blue)]" />
            </div>
            <h4 className="font-extrabold">Crowd Preferences</h4>
          </div>

          <div className="space-y-3">
            {Object.entries(crowdCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([pref, count], index) => {
                const percentage = Math.round((count / members.length) * 100);
                const colors: Record<string, string> = {
                  avoid: "bg-[var(--duo-red)]",
                  okay: "bg-[var(--duo-blue)]",
                  "no-preference": "bg-muted-foreground",
                };

                return (
                  <motion.div
                    key={pref}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm flex items-center gap-1.5">
                        <span>{crowdEmojis[pref]}</span>
                        {getCrowdLabel(pref)}
                      </span>
                      <span className="text-sm font-bold" style={{ color: `var(--duo-${pref === "avoid" ? "red" : pref === "okay" ? "blue" : "muted-foreground"})` }}>
                        {percentage}%
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={cn("h-full rounded-full", colors[pref])}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
