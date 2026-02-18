"use client";

import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Trend = "improved" | "regressed" | "stable";

interface TravelEvolutionCardProps {
  metric: string;
  pastValue: string;
  currentValue: string;
  trend: Trend;
  icon: LucideIcon;
}

const trendConfig: Record<Trend, { label: string; color: string; Icon: LucideIcon }> = {
  improved: {
    label: "Improved",
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30",
    Icon: TrendingUp,
  },
  regressed: {
    label: "Regressed",
    color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30",
    Icon: TrendingDown,
  },
  stable: {
    label: "Stable",
    color: "text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800",
    Icon: Minus,
  },
};

export function TravelEvolutionCard({
  metric,
  pastValue,
  currentValue,
  trend,
  icon: MetricIcon,
}: TravelEvolutionCardProps) {
  const { label, color, Icon: TrendIcon } = trendConfig[trend];

  return (
    <div className="rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-950 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-black/5 dark:border-white/5">
        <MetricIcon className="size-4 text-violet-600 dark:text-violet-400" />
        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
          {metric}
        </span>
        <span
          className={cn(
            "ml-auto inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full",
            color
          )}
        >
          <TrendIcon className="size-3" />
          {label}
        </span>
      </div>

      {/* Past vs Current split */}
      <div className="grid grid-cols-2 divide-x divide-black/5 dark:divide-white/5">
        <div className="p-3 text-center bg-neutral-50/50 dark:bg-neutral-900/30">
          <p className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
            Past (2023)
          </p>
          <p className="text-lg font-bold text-neutral-600 dark:text-neutral-300">
            {pastValue}
          </p>
        </div>
        <div className="p-3 text-center bg-violet-50/30 dark:bg-violet-950/20">
          <p className="text-[10px] uppercase tracking-wider text-violet-500 dark:text-violet-400 mb-1">
            Current (2024)
          </p>
          <p className="text-lg font-bold text-violet-700 dark:text-violet-300">
            {currentValue}
          </p>
        </div>
      </div>
    </div>
  );
}
