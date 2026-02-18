"use client";

import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  MapPin,
  Utensils,
  Hotel,
  Plane,
  Calendar,
  ShoppingBag,
  Coffee,
  Ticket,
  Sparkles,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/shared/navigation";
import { GroupLabel } from "@/components/shared/group-label";
import {
  AnimatedBackground,
  UnifiedCard,
  PageHeader,
} from "@/components/shared/page-layout";
import { FlowGuide } from "@/components/shared/flow-guide";
import { AIComparisonPanel } from "@/components/informatics";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const spendingCategories = [
  { name: "Accommodation", icon: Hotel, amount: 1050, percentage: 39, trend: "down" as const, change: -4 },
  { name: "Food & Dining", icon: Utensils, amount: 680, percentage: 25, trend: "up" as const, change: 8 },
  { name: "Transportation", icon: Plane, amount: 420, percentage: 16, trend: "down" as const, change: -15 },
  { name: "Activities", icon: Ticket, amount: 285, percentage: 11, trend: "up" as const, change: 5 },
  { name: "Shopping", icon: ShoppingBag, amount: 155, percentage: 6, trend: "up" as const, change: 10 },
  { name: "Others", icon: Coffee, amount: 80, percentage: 3, trend: "down" as const, change: -3 },
];

const monthlyData = [
  { month: "Jan", spent: 0, budget: 0 },
  { month: "Feb", spent: 0, budget: 0 },
  { month: "Mar", spent: 480, budget: 500 },
  { month: "Apr", spent: 1100, budget: 1200 },
  { month: "May", spent: 700, budget: 800 },
  { month: "Jun", spent: 390, budget: 600 },
];

const destinationStats = [
  { destination: "Melaka", trips: 1, avgSpend: 390, satisfaction: 95 },
  { destination: "Johor Bahru", trips: 1, avgSpend: 700, satisfaction: 88 },
  { destination: "Ipoh", trips: 1, avgSpend: 480, satisfaction: 90 },
  { destination: "Kuching", trips: 1, avgSpend: 1100, satisfaction: 92 },
];

const travelPatterns: { label: string; value: string; trend: "up" | "down" | "stable" }[] = [
  { label: "Average Trip Duration", value: "2.8 days", trend: "stable" },
  { label: "Avg. Budget per Trip", value: "RM 775", trend: "down" },
  { label: "Most Visited State", value: "Melaka", trend: "stable" },
  { label: "Budget Adherence Rate", value: "86%", trend: "up" },
];

export default function InsightsPage() {
  const maxSpent = Math.max(...monthlyData.map((d) => d.spent));
  const totalSpent = monthlyData.reduce((sum, d) => sum + d.spent, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 relative">
      <Navigation />
      <GroupLabel group={3} />
      <AnimatedBackground variant="subtle" />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <PageHeader
          title="Spending Insights"
          subtitle="Review your spending patterns & trends"
          icon={<BarChart3 className="size-7 text-white" />}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <UnifiedCard className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="size-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <TrendingDown className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs mb-1">Total Spent (YTD)</p>
            <p className="text-xl font-bold text-neutral-800 dark:text-neutral-100">RM {totalSpent.toLocaleString()}</p>
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">Under budget</span>
          </UnifiedCard>
          <UnifiedCard className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="size-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <Calendar className="size-4 text-violet-600 dark:text-violet-400" />
              </div>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs mb-1">Trips This Year</p>
            <p className="text-xl font-bold text-neutral-800 dark:text-neutral-100">4</p>
            <span className="text-violet-600 dark:text-violet-400 text-xs font-medium">All local trips</span>
          </UnifiedCard>
        </div>

        {/* Past vs Current AI Insights */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-bold text-lg text-neutral-800 dark:text-neutral-100">
              Past vs Current Insights
            </h2>
            <Badge className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800 gap-1">
              <Sparkles className="size-3" />
              AI
            </Badge>
          </div>
          <AIComparisonPanel />
        </section>

        {/* Monthly Trend Chart */}
        <div className="mb-6">
          <h2 className="font-bold text-lg text-neutral-800 dark:text-neutral-100 mb-4">Monthly Spending</h2>
          <UnifiedCard gradient className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">6-month trend</p>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                <TrendingDown className="size-4" />
                <span>14% under budget</span>
              </div>
            </div>

            <div className="h-32 flex items-end justify-between gap-2">
              {monthlyData.map((data) => {
                const chartHeight = 92;
                const barHeightPx = Math.max((data.spent / maxSpent) * chartHeight, 20);
                const isOverBudget = data.spent > data.budget;
                return (
                  <div
                    key={data.month}
                    className="flex flex-col items-center justify-end gap-2 flex-1"
                    style={{ height: "100%" }}
                  >
                    <div
                      className={cn(
                        "w-full rounded-t-lg transition-all duration-500",
                        isOverBudget
                          ? "bg-amber-500 dark:bg-amber-400"
                          : "bg-gradient-to-t from-violet-500 to-purple-400"
                      )}
                      style={{
                        height: `${barHeightPx}px`,
                        minHeight: "20px",
                      }}
                    />
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">{data.month}</span>
                      <span className="text-[10px] text-neutral-400">
                        RM{(data.spent / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </UnifiedCard>
        </div>

        {/* Spending by Category */}
        <div className="mb-6">
          <h2 className="font-bold text-lg text-neutral-800 dark:text-neutral-100 mb-4">By Category</h2>
          <div className="space-y-3">
            {spendingCategories.map((category) => (
              <UnifiedCard key={category.name} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                    <category.icon className="size-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-neutral-800 dark:text-neutral-100">{category.name}</span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                        RM {category.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={category.percentage} className="flex-1 h-2" />
                      <div
                        className={cn(
                          "flex items-center gap-1 text-xs font-medium",
                          category.trend === "up"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        )}
                      >
                        {category.trend === "up" ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>
                          {category.change > 0 ? "+" : ""}
                          {category.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </UnifiedCard>
            ))}
          </div>
        </div>

        {/* Destination Stats */}
        <div className="mb-6">
          <h2 className="font-bold text-lg text-neutral-800 dark:text-neutral-100 mb-4">By Destination</h2>
          <div className="space-y-3">
            {destinationStats.map((dest) => (
              <UnifiedCard key={dest.destination} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    <span className="font-medium text-neutral-800 dark:text-neutral-100">{dest.destination}</span>
                  </div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{dest.trips} trips</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Avg. Spend:{" "}
                    <span className="text-neutral-800 dark:text-neutral-100 font-semibold">
                      RM {dest.avgSpend.toLocaleString()}
                    </span>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">{dest.satisfaction}% satisfaction</span>
                </div>
              </UnifiedCard>
            ))}
          </div>
        </div>

        {/* Travel Patterns */}
        <div className="mb-6">
          <h2 className="font-bold text-lg text-neutral-800 dark:text-neutral-100 mb-4">Travel Patterns</h2>
          <UnifiedCard className="p-5 space-y-4">
            {travelPatterns.map((pattern) => (
              <div key={pattern.label} className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 text-sm">{pattern.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-800 dark:text-neutral-100">{pattern.value}</span>
                  {pattern.trend === "up" && <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                  {pattern.trend === "down" && <TrendingDown className="w-3 h-3 text-amber-600 dark:text-amber-400" />}
                </div>
              </div>
            ))}
          </UnifiedCard>
        </div>

        {/* Behavioural Insights */}
        <div className="mb-8">
          <h2 className="font-bold text-lg text-neutral-800 dark:text-neutral-100 mb-4">Behavioural Insights</h2>
          <UnifiedCard gradient className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="size-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-neutral-800 dark:text-neutral-100 text-sm">Biggest Expense</p>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">Accommodation takes 39% of your budget across all trips</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <PieChart className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-neutral-800 dark:text-neutral-100 text-sm">Budget Adherence</p>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">You stayed under budget on all 4 trips. Keep it up!</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                <Calendar className="size-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="font-medium text-neutral-800 dark:text-neutral-100 text-sm">Best Value Trip</p>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                  Melaka gave you the best value at only RM 390 for a 3-day trip
                </p>
              </div>
            </div>
          </UnifiedCard>
        </div>

        {/* Flow Guide */}
        <FlowGuide
          variant="card"
          title="Continue Your Journey"
          maxSuggestions={2}
        />
      </main>
    </div>
  );
}
