"use client";

import {
  DollarSign,
  Target,
  Clock,
  AlertTriangle,
  TrendingDown,
  Utensils,
  MapPin,
  CalendarCheck,
  Sparkles,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UnifiedCard } from "@/components/shared/page-layout";
import { TravelEvolutionCard } from "./travel-evolution-card";
import { cn } from "@/lib/utils";

// ── Tab 1: Overview data ──────────────────────────────────────────────
const overviewMetrics = [
  {
    metric: "Avg Trip Cost",
    pastValue: "RM 920",
    currentValue: "RM 668",
    trend: "improved" as const,
    icon: DollarSign,
  },
  {
    metric: "Budget Adherence",
    pastValue: "72%",
    currentValue: "88%",
    trend: "improved" as const,
    icon: Target,
  },
  {
    metric: "Avg Trip Duration",
    pastValue: "3.5 days",
    currentValue: "2.8 days",
    trend: "stable" as const,
    icon: Clock,
  },
  {
    metric: "Overspend Rate",
    pastValue: "28%",
    currentValue: "12%",
    trend: "improved" as const,
    icon: AlertTriangle,
  },
];

// ── Tab 2: Spending comparison data ───────────────────────────────────
const spendingComparison = [
  { category: "Accommodation", past: 420, current: 262 },
  { category: "Food & Dining", past: 250, current: 170 },
  { category: "Transportation", past: 180, current: 105 },
  { category: "Activities", past: 100, current: 71 },
];

// ── Tab 3: AI Insights data ───────────────────────────────────────────
const aiInsights = [
  {
    icon: TrendingDown,
    title: "Spending Discipline Improved",
    insight:
      "Your overspend rate dropped from 28% to 12% — a 57% reduction. You're consistently staying closer to planned budgets, especially on accommodation and transport.",
    confidence: "High" as const,
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30",
  },
  {
    icon: Utensils,
    title: "Food Spending Shifted",
    insight:
      "Dining habits shifted from sit-down restaurants to street food and local markets. Average meal cost dropped 32% while satisfaction scores remained stable.",
    confidence: "High" as const,
    color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30",
  },
  {
    icon: MapPin,
    title: "Destination Preference Evolution",
    insight:
      "Your recent trips favour cultural and heritage destinations (Melaka, Ipoh) over urban centres. This correlates with lower costs and higher satisfaction ratings.",
    confidence: "Medium" as const,
    color: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30",
  },
  {
    icon: CalendarCheck,
    title: "Trip Planning Improved",
    insight:
      "Booking lead time increased from an average of 5 days to 18 days. Earlier planning correlates with 27% lower accommodation costs in your data.",
    confidence: "High" as const,
    color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30",
  },
];

// ── Component ─────────────────────────────────────────────────────────
export function AIComparisonPanel() {
  const maxSpending = Math.max(
    ...spendingComparison.flatMap((s) => [s.past, s.current])
  );

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="w-full grid grid-cols-3 mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="spending">Spending</TabsTrigger>
        <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
      </TabsList>

      {/* ── Overview Tab ──────────────────────────────────────────── */}
      <TabsContent value="overview">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {overviewMetrics.map((m) => (
            <TravelEvolutionCard key={m.metric} {...m} />
          ))}
        </div>
      </TabsContent>

      {/* ── Spending Tab ──────────────────────────────────────────── */}
      <TabsContent value="spending">
        <UnifiedCard gradient className="p-5">
          <div className="flex items-center gap-4 mb-5 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded bg-neutral-300 dark:bg-neutral-600" />
              <span className="text-neutral-500 dark:text-neutral-400">
                Past (2023)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded bg-gradient-to-r from-violet-500 to-purple-500" />
              <span className="text-neutral-500 dark:text-neutral-400">
                Current (2024)
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {spendingComparison.map((item) => {
              const change = Math.round(
                ((item.current - item.past) / item.past) * 100
              );
              return (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                      {item.category}
                    </span>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {change}%
                    </span>
                  </div>
                  {/* Past bar */}
                  <div className="h-4 w-full rounded bg-neutral-100 dark:bg-neutral-800 mb-1 overflow-hidden">
                    <div
                      className="h-full rounded bg-neutral-300 dark:bg-neutral-600 transition-all"
                      style={{
                        width: `${(item.past / maxSpending) * 100}%`,
                      }}
                    />
                  </div>
                  {/* Current bar */}
                  <div className="h-4 w-full rounded bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full rounded bg-gradient-to-r from-violet-500 to-purple-500 transition-all"
                      style={{
                        width: `${(item.current / maxSpending) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                    <span>RM {item.past}</span>
                    <span>RM {item.current}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </UnifiedCard>
      </TabsContent>

      {/* ── AI Insights Tab ───────────────────────────────────────── */}
      <TabsContent value="ai-insights">
        <div className="space-y-3">
          {aiInsights.map((item) => (
            <UnifiedCard key={item.title} className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "size-9 rounded-xl flex items-center justify-center flex-shrink-0",
                    item.color
                  )}
                >
                  <item.icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                      {item.title}
                    </h4>
                    <span
                      className={cn(
                        "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                        item.confidence === "High"
                          ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                      )}
                    >
                      {item.confidence} confidence
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {item.insight}
                  </p>
                </div>
              </div>
            </UnifiedCard>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
