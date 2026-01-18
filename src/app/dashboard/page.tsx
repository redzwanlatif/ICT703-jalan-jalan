"use client"

import * as React from "react"
import { Navigation } from "@/components/shared/navigation"
import TabBar from "../../components/ui/TabBar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertTriangle,
  CalendarDays,
  Coins,
  Heart,
  Users,
  Wallet,
} from "lucide-react"
import { ConflictItem, SummaryStat, DashboardDestination } from "@/types"


const severityStyles = (severity: ConflictItem["severity"]) => {
  const styles = {
    high: {
      container: "bg-red-50 border-red-200 text-red-900",
      icon: "text-red-700",
      text: "text-red-900",
      sub: "text-red-800/80",
    },
    medium: {
      container: "bg-yellow-50 border-yellow-200 text-yellow-900",
      icon: "text-yellow-800",
      text: "text-yellow-900",
      sub: "text-yellow-900/80",
    },
    low: {
      container: "bg-blue-50 border-blue-200 text-blue-900",
      icon: "text-blue-700",
      text: "text-blue-900",
      sub: "text-blue-900/80",
    },
  }
  return styles[severity] || styles.low
}

const Pill = ({
  dotClassName,
  children,
}: {
  dotClassName: string
  children: React.ReactNode
}) => (
  <div className="inline-flex items-center gap-2">
    <span className={`size-3 rounded-full ${dotClassName}`} />
    <span className="text-sm text-slate-700">{children}</span>
  </div>
)

const DashboardPage = () => {
  const [conflictFilter, setConflictFilter] = React.useState<string>("all")

  const summary: SummaryStat[] = [
    {
      label: "Group Size",
      value: "4",
      sub: "travelers",
      icon: <Users className="size-4 text-violet-700" />,
    },
    {
      label: "Avg. Budget",
      value: "RM1325 - RM2625",
      sub: "per person",
      icon: <Wallet className="size-4 text-violet-700" />,
    },
    {
      label: "Preferred Seasons",
      value: "Raya, CNY, Merdeka, Deepavali",
      sub: "4 options",
      icon: <CalendarDays className="size-4 text-violet-700" />,
    },
    {
      label: "Common Interests",
      value: "Beach, Culture, Food",
      sub: "8 total interests",
      icon: <Heart className="size-4 text-violet-700" />,
    },
    {
      label: "Crowd Preference",
      value: "Avoid Crowds",
      sub: "2/4 members",
      icon: <Users className="size-4 text-violet-700" />,
    },
  ]

  const conflicts: ConflictItem[] = [
    {
      severity: "high",
      title: "Nurul Aisyah",
      description: "Nurul Aisyah prefers higher-budget trips (min RM1000)",
    },
    {
      severity: "high",
      title: "Wong Wei Ming",
      description: "Wong Wei Ming prefers higher-budget trips (min RM1500)",
    },
    {
      severity: "high",
      title: "Priya Devi",
      description: "Priya Devi prefers higher-budget trips (min RM800)",
    },
    {
      severity: "high",
      title: "Ahmad Zaki",
      description: "Ahmad Zaki prefers higher-budget trips (min RM2000)",
    },
    {
      severity: "medium",
      title: "Wong Wei Ming",
      description: "Wong Wei Ming may not enjoy the selected destinations",
    },
    {
      severity: "medium",
      title: "Ahmad Zaki",
      description: "Ahmad Zaki may not enjoy the selected destinations",
    },
    {
      severity: "low",
      title: "Wong Wei Ming",
      description: "Wong Wei Ming prefers different seasons for travel",
    },
  ]

  const destinations: DashboardDestination[] = [
    {
      title: "Melaka Historic City",
      description:
        "UNESCO World Heritage Site with rich history, colonial architecture, and famous street food",
      matchLabel: "59% Match",
      cost: "RM800",
      season: "Raya",
      interests: "Culture, Food, Shopping",
      alignmentPercent: 59,
    },
    {
      title: "Jonker Street & Chinatown",
      description:
        "Vibrant night market with antiques, local crafts, and delicious Peranakan cuisine",
      matchLabel: "47% Match",
      cost: "RM600",
      season: "CNY",
      interests: "Culture, Food, Shopping",
      alignmentPercent: 47,
    },
  ]

  const filteredConflicts = conflicts.filter((c) =>
    conflictFilter === "all" ? true : c.severity === conflictFilter
  )

  const conflictCounts = {
    high: conflicts.filter((c) => c.severity === "high").length,
    medium: conflicts.filter((c) => c.severity === "medium").length,
    low: conflicts.filter((c) => c.severity === "low").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-slate-100 text-slate-900">
      <div className="sticky top-0 z-20">
        <Navigation />
        <TabBar />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-2">
        <div className="flex flex-col gap-6">
          <header className="flex items-center gap-4 py-2 ">
            <div className="shrink-0 rounded-full bg-violet-100 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 text-violet-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25m0 0c0 3.727 3.023 6.75 6.75 6.75s6.75-3.023 6.75-6.75m-13.5 0h13.5m0 0V3m0 11.25c0 3.727-3.023 6.75-6.75 6.75s-6.75-3.023-6.75-6.75"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
          </header>

          {/* Group Summary */}
          <Card className="border-[#AD46FF] bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">Group Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {summary.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-start gap-3 rounded-xl bg-white"
                  >
                    <div className="shrink-0 rounded-xl bg-violet-100 p-2">
                      {s.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-slate-600">{s.label}</div>
                      <div className="mt-1 text-base font-bold text-slate-900">
                        {s.value}
                      </div>
                      <div className="text-xs text-slate-500">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Row: Budget Fit + Potential Conflicts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="border-[#AD46FF] bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">Budget Fit</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Budget Compatibility
                  </div>
                  <div className="text-sm font-bold text-slate-900">13%</div>
                </div>

                <div className="mt-2">
                  <Progress
                    value={13}
                    className="h-2 bg-violet-100 [&_[data-slot=progress-indicator]]:bg-red-400"
                  />
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-red-700">
                  <AlertTriangle className="size-5" />
                  Significantly over budget
                </div>

                <div className="mt-4 border-t border-violet-100 pt-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        Avg. Cost/Person
                      </div>
                      <div className="text-lg font-bold text-slate-900">
                        RM350
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        Avg. Budget Range
                      </div>
                      <div className="text-lg font-bold text-slate-900">
                        RM1,325 - RM2,625
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#AD46FF] gap-1 bg-white">
              <CardHeader className="pb-0">
                <CardTitle className="text-xl font-bold">
                  Potential Conflicts
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-1">
                <Select value={conflictFilter} onValueChange={setConflictFilter}>
                  <SelectTrigger 
                    className={`w-[180px] ${
                      conflictFilter === "high" 
                        ? "border-red-500 text-red-700 bg-red-50" 
                        : conflictFilter === "medium"
                        ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                        : conflictFilter === "low"
                        ? "border-blue-500 text-blue-700 bg-blue-50"
                        : "border-violet-300 text-violet-700 bg-violet-50"
                    }`}
                  >
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ({conflicts.length})</SelectItem>
                    <SelectItem value="high">High ({conflictCounts.high})</SelectItem>
                    <SelectItem value="medium">Medium ({conflictCounts.medium})</SelectItem>
                    <SelectItem value="low">Low ({conflictCounts.low})</SelectItem>
                  </SelectContent>
                </Select>

                <div className="mt-4 space-y-2">
                  {filteredConflicts.map((c, idx) => {
                    const s = severityStyles(c.severity)
                    return (
                      <div
                        key={`${c.title}-${idx}`}
                        className={`flex items-start gap-3 rounded-xl border p-3 ${s.container}`}
                      >
                        <div className="mt-0.5 rounded-md bg-white/60 p-1">
                          <Coins className={`size-4 ${s.icon}`} />
                        </div>
                        <div className="min-w-0">
                          <div className={`text-sm font-semibold ${s.text}`}>
                            {c.title}
                          </div>
                          <div className={`text-xs ${s.sub}`}>
                            {c.description}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Proposed Destinations */}
          <Card className="border-[#AD46FF] bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">
                Proposed Destinations
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                {destinations.map((d) => (
                  <div
                    key={d.title}
                    className="rounded-xl border-2 border-violet-100 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-lg font-bold text-slate-900">
                          {d.title}
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          {d.description}
                        </div>
                      </div>
                      <div className="shrink-0 rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-700">
                        {d.matchLabel}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <div className="inline-flex items-center gap-2">
                        <Coins className="size-4 text-slate-500" />
                        {d.cost}
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <CalendarDays className="size-4 text-slate-500" />
                        {d.season}
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <Heart className="size-4 text-slate-500" />
                        {d.interests}
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Group Alignment</span>
                        <span className="font-semibold text-slate-900">
                          {d.alignmentPercent}%
                        </span>
                      </div>
                      <Progress
                        value={d.alignmentPercent}
                        className="mt-2 h-2 bg-violet-100 [&_[data-slot=progress-indicator]]:bg-violet-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
