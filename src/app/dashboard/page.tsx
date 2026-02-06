"use client";

import * as React from "react";
import { Navigation } from "@/components/shared/navigation";
import TabBar from "../../components/ui/TabBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CalendarDays,
  Coins,
  Heart,
  Users,
  Wallet,
  LayoutDashboard,
  Users2,
  MapPin,
  ShieldAlert,
  Bell,
} from "lucide-react";

import { ConflictItem, SummaryStat } from "@/types";

/* =======================
   LABEL MAPS
======================= */

const seasonLabels: Record<string, string> = {
  "chinese-new-year": "Chinese New Year",
  "hari-raya-aidilfitri": "Hari Raya Aidilfitri",
  "hari-raya-haji": "Hari Raya Haji",
  deepavali: "Deepavali",
  thaipusam: "Thaipusam",
  wesak: "Wesak Day",
  christmas: "Christmas",
  merdeka: "Merdeka Day",
  "malaysia-day": "Malaysia Day",
  "school-holidays": "School Holidays",
};

const travelStyleLabels: Record<string, string> = {
  "low-budget": "Budget",
  balanced: "Balanced",
  comfortable: "Comfortable",
};

const crowdToleranceLabels: Record<string, string> = {
  "avoid-crowd": "Avoid crowds",
  "okay-crowd": "Okay with crowds",
  "no-preference": "No preference",
};

// Define gradients for icons
const summaryIconGradients = [
  "bg-gradient-to-br from-purple-400 to-purple-700",
  "bg-gradient-to-br from-green-400 to-green-600",
  "bg-gradient-to-br from-yellow-300 to-yellow-500",
  "bg-gradient-to-br from-pink-400 to-pink-600",
  "bg-gradient-to-br from-blue-400 to-blue-700",
];

/* =======================
   HELPERS
======================= */

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
  };
  return styles[severity] || styles.low;
};

const matchTier = (pct: number) => {
  if (pct <= 30) return "low";
  if (pct <= 70) return "mid";
  return "high";
};

const matchStyles = (pct: number) => {
  const tier = matchTier(pct);

  if (tier === "low") {
    return {
      badge: "bg-slate-100 text-slate-700",
      bar: "[&_[data-slot=progress-indicator]]:bg-slate-400",
    };
  }

  if (tier === "mid") {
    return {
      badge: "bg-yellow-100 text-yellow-800",
      bar: "[&_[data-slot=progress-indicator]]:bg-yellow-400",
    };
  }

  return {
    badge: "bg-green-100 text-green-800",
    bar: "[&_[data-slot=progress-indicator]]:bg-green-500",
  };
};

const Pill = ({
  dotClassName,
  children,
}: {
  dotClassName: string;
  children: React.ReactNode;
}) => (
  <div className="inline-flex items-center gap-2">
    <span className={"size-3 rounded-full " + dotClassName} />
    <span className="text-sm text-slate-700">{children}</span>
  </div>
);

/* =======================
   MATCH ENGINE (Traveler vs Place)
======================= */

type PlaceProfile = {
  id: string;
  title: string;
  description: string;
  interests: string;
  preferences: {
    travelStyle: "low-budget" | "balanced" | "comfortable";
    crowdTolerance: "avoid-crowd" | "okay-crowd" | "no-preference";
    preferredSeasons: string[];
    budgetMin: number;
    budgetMax: number;
  };
};

const toNum = (v: any) => Number(String(v).replace(/[^\d.]/g, ""));

const rangesOverlap = (aMin: number, aMax: number, bMin: number, bMax: number) =>
  Math.max(aMin, bMin) <= Math.min(aMax, bMax);

const computePlaceMatchPercent = (travelers: any[], place: PlaceProfile) => {
  if (!travelers || travelers.length === 0) return 0;

  const weights = {
    travelStyle: 25,
    crowdTolerance: 20,
    seasons: 25,
    budget: 30,
  };

  const totalWeight =
    weights.travelStyle + weights.crowdTolerance + weights.seasons + weights.budget;

  const scorePerTraveler = travelers.map((t: any) => {
    const p = t.preferences || {};
    const travelerStyle = p.travelStyle;
    const travelerCrowd = p.crowdTolerance;
    const travelerSeasons: string[] = Array.isArray(p.preferredSeasons)
      ? p.preferredSeasons
      : [];
    const travelerMin = toNum(p.budgetMin);
    const travelerMax = toNum(p.budgetMax);

    let score = 0;

    // Travel style match
    if (travelerStyle && travelerStyle === place.preferences.travelStyle) {
      score += weights.travelStyle;
    } else if (travelerStyle) {
      const partial =
        (travelerStyle === "balanced" &&
          (place.preferences.travelStyle === "low-budget" ||
            place.preferences.travelStyle === "comfortable")) ||
        (place.preferences.travelStyle === "balanced" &&
          (travelerStyle === "low-budget" || travelerStyle === "comfortable"));
      score += partial ? Math.round(weights.travelStyle * 0.5) : 0;
    }

    // Crowd tolerance match
    if (travelerCrowd && travelerCrowd === place.preferences.crowdTolerance) {
      score += weights.crowdTolerance;
    } else if (travelerCrowd) {
      if (travelerCrowd === "no-preference") score += Math.round(weights.crowdTolerance * 0.6);
    }

    // Seasons overlap
    const seasonOverlap = travelerSeasons.some((s) =>
      place.preferences.preferredSeasons.includes(s)
    );
    if (seasonOverlap) score += weights.seasons;

    // Budget overlap (traveler vs place)
    if (Number.isFinite(travelerMin) && Number.isFinite(travelerMax)) {
      const overlap = rangesOverlap(
        travelerMin,
        travelerMax,
        place.preferences.budgetMin,
        place.preferences.budgetMax
      );
      if (overlap) score += weights.budget;
      else {
        const travelerAvg = (travelerMin + travelerMax) / 2;
        const placeMid = (place.preferences.budgetMin + place.preferences.budgetMax) / 2;
        const diffPct = travelerAvg > 0 ? Math.abs(travelerAvg - placeMid) / travelerAvg : 1;
        if (diffPct <= 0.2) score += Math.round(weights.budget * 0.5);
      }
    }

    return score / totalWeight;
  });

  const avgScore =
    scorePerTraveler.reduce((a: number, b: number) => a + b, 0) / scorePerTraveler.length;

  return Math.max(0, Math.min(100, Math.round(avgScore * 100)));
};

const melakaPlaces: PlaceProfile[] = [
  {
    id: "melaka-heritage",
    title: "Melaka Historic City Core",
    description: "UNESCO heritage area with colonial landmarks, museums, and walkable streets.",
    interests: "Culture, History, City Walk",
    preferences: {
      travelStyle: "balanced",
      crowdTolerance: "okay-crowd",
      preferredSeasons: ["school-holidays", "malaysia-day", "merdeka", "christmas"],
      budgetMin: 250,
      budgetMax: 600,
    },
  },
  {
    id: "jonker",
    title: "Jonker Street Night Market",
    description: "Food, shopping, and busy night vibes (weekends are crowded).",
    interests: "Food, Shopping, Night Market",
    preferences: {
      travelStyle: "low-budget",
      crowdTolerance: "okay-crowd",
      preferredSeasons: ["chinese-new-year", "school-holidays", "christmas"],
      budgetMin: 150,
      budgetMax: 450,
    },
  },
  {
    id: "a-famosa",
    title: "A Famosa & Stadthuys",
    description: "Iconic historical spots for photos and short exploration.",
    interests: "Culture, Photos, History",
    preferences: {
      travelStyle: "balanced",
      crowdTolerance: "okay-crowd",
      preferredSeasons: ["school-holidays", "merdeka", "malaysia-day"],
      budgetMin: 150,
      budgetMax: 500,
    },
  },
  {
    id: "river-cruise",
    title: "Melaka River Cruise",
    description: "Relaxing evening ride with city lights and murals along the river.",
    interests: "Relax, Photos, Scenic",
    preferences: {
      travelStyle: "balanced",
      crowdTolerance: "no-preference",
      preferredSeasons: ["christmas", "school-holidays", "deepavali"],
      budgetMin: 200,
      budgetMax: 550,
    },
  },
  {
    id: "maritime-museum",
    title: "Maritime Museum & Flor de la Mar",
    description: "Indoor museum, good for hot/rainy days and history lovers.",
    interests: "Museums, History, Indoor",
    preferences: {
      travelStyle: "low-budget",
      crowdTolerance: "avoid-crowd",
      preferredSeasons: ["wesak", "thaipusam", "deepavali"],
      budgetMin: 100,
      budgetMax: 350,
    },
  },
  {
    id: "encore-theatre",
    title: "Encore Melaka Theatre (Show Night)",
    description: "A more premium night activity for groups who like performances.",
    interests: "Entertainment, Night, Premium",
    preferences: {
      travelStyle: "comfortable",
      crowdTolerance: "okay-crowd",
      preferredSeasons: ["christmas", "deepavali", "hari-raya-aidilfitri"],
      budgetMin: 350,
      budgetMax: 900,
    },
  },
  {
    id: "beach-klebang",
    title: "Klebang Beach & Coconut Shake",
    description: "Chill seaside vibe, best during off-peak for quieter experience.",
    interests: "Relax, Beach, Food",
    preferences: {
      travelStyle: "low-budget",
      crowdTolerance: "avoid-crowd",
      preferredSeasons: ["hari-raya-aidilfitri", "school-holidays", "christmas"],
      budgetMin: 120,
      budgetMax: 450,
    },
  },
  {
    id: "sky-tower",
    title: "Menara Taming Sari (Sky View)",
    description: "Quick panoramic ride; short queue off-peak.",
    interests: "Views, Photos, Landmark",
    preferences: {
      travelStyle: "balanced",
      crowdTolerance: "okay-crowd",
      preferredSeasons: ["school-holidays", "christmas", "malaysia-day"],
      budgetMin: 180,
      budgetMax: 550,
    },
  },
];
/* =======================
   CONFLICT ICON MAPPER
======================= */

const getConflictIcon = (
  description: string,
  severity: ConflictItem["severity"]
) => {
  const baseClass =
    severity === "high"
      ? "text-red-600"
      : severity === "medium"
      ? "text-yellow-600"
      : "text-blue-600";

  const text = (description || "").toLowerCase();

  if (text.includes("budget"))
    return <Wallet className={"size-4 " + baseClass} />;

  if (text.includes("travel style"))
    return <Heart className={"size-4 " + baseClass} />;

  if (text.includes("crowd"))
    return <Users className={"size-4 " + baseClass} />;

  if (text.includes("safety") || text.includes("late-night"))
    return <ShieldAlert className={"size-4 " + baseClass} />;

  if (text.includes("season"))
    return <CalendarDays className={"size-4 " + baseClass} />;

  if (text.includes("notification"))
    return <Bell className={"size-4 " + baseClass} />;

  return <AlertTriangle className={"size-4 " + baseClass} />;
};

/* =======================
   PAGE
======================= */

const DashboardPage = () => {
  const [conflictFilter, setConflictFilter] = React.useState<string>("all");
  const [jsonData, setJsonData] = React.useState<any>(null);

  const [budgetBreakdownFilter, setBudgetBreakdownFilter] = React.useState<
    "within" | "below" | "above"
  >("within");


  const [melakaOpen, setMelakaOpen] = React.useState(false);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/data");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setJsonData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!jsonData) return <div>Loading...</div>;

  const travelers = jsonData.travelers || [];
  const groupSize = travelers.length;

  // average budget per person
  const averageBudget =
    travelers.length > 0
      ? travelers.reduce((total: number, traveler: any) => {
          const minBudget = toNum(traveler.preferences.budgetMin);
          const maxBudget = toNum(traveler.preferences.budgetMax);
          return total + (minBudget + maxBudget) / 2;
        }, 0) / travelers.length
      : 0;

  const formattedAvgBudget = averageBudget ? "RM " + averageBudget.toFixed(0) : "RM 0";

  // most selected
  const getMostSelected = (array: string[]) => {
    const counts = array.reduce((acc: any, value: string) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
    const mostSelectedValue = Object.entries(counts).reduce(
      (a: any, b: any) => (a[1] > b[1] ? a : b),
      ["", 0] as any
    );
    return mostSelectedValue as [string, number];
  };

  const allPreferredSeasons = travelers.flatMap((t: any) => t.preferences.preferredSeasons || []);
  const [mostPreferredSeason, seasonCount] = getMostSelected(allPreferredSeasons);

  const allTravelStyles = travelers.map((t: any) => t.preferences.travelStyle);
  const [mostCommonTravelStyle, styleCount] = getMostSelected(allTravelStyles);

  const allCrowdTolerances = travelers.map((t: any) => t.preferences.crowdTolerance);
  const [mostCommonCrowdPreference, crowdCount] = getMostSelected(allCrowdTolerances);

  const summary: SummaryStat[] = [
    {
      label: "Group Size",
      value: groupSize.toString(),
      sub: "travelers",
      icon: <Users className="size-4 text-violet-700" />,
    },
    {
      label: "Avg. Budget",
      value: formattedAvgBudget,
      sub: "per person",
      icon: <Wallet className="size-4 text-violet-700" />,
    },
    {
      label: "Preferred Seasons",
      value: seasonLabels[mostPreferredSeason] || "None",
      sub: seasonCount + " traveler(s)",
      icon: <CalendarDays className="size-4 text-violet-700" />,
    },
    {
      label: "Common Travel Style",
      value: travelStyleLabels[mostCommonTravelStyle] || "None",
      sub: styleCount + " traveler(s)",
      icon: <Heart className="size-4 text-violet-700" />,
    },
    {
      label: "Crowd Preference",
      value: crowdToleranceLabels[mostCommonCrowdPreference] || "None",
      sub: crowdCount + " traveler(s)",
      icon: <Users className="size-4 text-violet-700" />,
    },
  ];

  /* =======================
     BUDGET FIT
======================= */

  const budgets = travelers.map((t: any) => ({
    name: t.name,
    min: toNum(t.preferences.budgetMin),
    max: toNum(t.preferences.budgetMax),
  }));

  const groupMinBudget = budgets.length > 0 ? Math.min(...budgets.map((b) => b.min)) : 0;
  const groupMaxBudget = budgets.length > 0 ? Math.max(...budgets.map((b) => b.max)) : 0;

  // avg < min => traveler wants higher budget => above
  // avg > max => traveler wants lower budget  => below
  const getBucket = (b: { min: number; max: number }, avg: number) => {
    if (avg >= b.min && avg <= b.max) return "within" as const;
    if (avg < b.min) return "above" as const;
    return "below" as const;
  };

  const withinCount = budgets.filter((b) => averageBudget >= b.min && averageBudget <= b.max).length;
  const aboveCount = budgets.filter((b) => averageBudget < b.min).length;
  const belowCount = budgets.filter((b) => averageBudget > b.max).length;

  const clampDist = (x: number, min: number, max: number) => (x < min ? min - x : x > max ? x - max : 0);

  const budgetCompatibilityPct = budgets.length
    ? Math.round(
        budgets.reduce((acc: number, b: any) => {
          const dist = clampDist(averageBudget, b.min, b.max);
          const score = Math.max(0, 100 - (dist / Math.max(1, averageBudget)) * 100);
          return acc + score;
        }, 0) / budgets.length
      )
    : 0;

  const budgetStatus = belowCount > 0 ? "Some travelers may not afford the current budget" : "Budget fits most travelers";

  const budgetBuckets = budgets.reduce(
    (acc: any, b: any) => {
      const bucket = getBucket(b, averageBudget);
      acc[bucket].push(b);
      return acc;
    },
    { within: [], below: [], above: [] }
  );

  const selectedBudgetBucket = budgetBuckets[budgetBreakdownFilter] as Array<{
    name: string;
    min: number;
    max: number;
  }>;

  /* =======================
     POTENTIAL CONFLICTS
======================= */

  const conflicts: ConflictItem[] = [];

  travelers.forEach((traveler: any) => {
    const travelerMinBudget = toNum(traveler.preferences.budgetMin);
    const travelerMaxBudget = toNum(traveler.preferences.budgetMax);

    const budgetConflictSeverity =
      travelerMinBudget < averageBudget * 0.7 || travelerMaxBudget < averageBudget * 0.7
        ? "high"
        : travelerMinBudget < averageBudget * 0.9 || travelerMaxBudget < averageBudget * 0.9
        ? "medium"
        : "low";

    if (budgetConflictSeverity !== "low") {
      conflicts.push({
        severity: budgetConflictSeverity,
        title: traveler.name,
        description:
          traveler.name +
          " prefers a budget between RM" +
          travelerMinBudget +
          " and RM" +
          travelerMaxBudget +
          ", which is low compared to the group's average budget.",
      });
    }

    if (traveler.preferences.travelStyle !== mostCommonTravelStyle) {
      conflicts.push({
        severity: "medium",
        title: traveler.name,
        description: traveler.name + " prefers a different travel style.",
      });
    }

    if (traveler.preferences.crowdTolerance !== mostCommonCrowdPreference) {
      conflicts.push({
        severity: "low",
        title: traveler.name,
        description: traveler.name + " prefers a different crowd tolerance.",
      });
    }

    const travelerSafety = traveler.preferences.safetyOptions;
    if (travelerSafety && travelerSafety.avoidLateNight !== true) {
      conflicts.push({
        severity: "medium",
        title: traveler.name,
        description: traveler.name + " prefers late-night activities (safety conflict).",
      });
    }

    const travelerSeasons = traveler.preferences.preferredSeasons || [];
    const seasonDiff = travelerSeasons.filter((season: string) => season !== mostPreferredSeason);
    if (seasonDiff.length > 0) {
      conflicts.push({
        severity: "medium",
        title: traveler.name,
        description: traveler.name + " prefers different seasons for travel.",
      });
    }

    const travelerNotifications = traveler.preferences.notifications;
    if (travelerNotifications && Object.values(travelerNotifications).some((v: any) => v !== true)) {
      conflicts.push({
        severity: "low",
        title: traveler.name,
        description: traveler.name + " has different notification preferences.",
      });
    }
  });

  const filteredConflicts = conflictFilter === "all" ? conflicts : conflicts.filter((c) => c.severity === conflictFilter);

  const conflictCounts = {
    high: conflicts.filter((c) => c.severity === "high").length,
    medium: conflicts.filter((c) => c.severity === "medium").length,
    low: conflicts.filter((c) => c.severity === "low").length,
  };

  /* =======================
     PLACE MATCH LIST
======================= */

  const placeCards = melakaPlaces
    .map((place) => {
      const match = computePlaceMatchPercent(travelers, place);
      return { place, match };
    })
    .sort((a, b) => b.match - a.match);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(to bottom, #f5f3ff 0%, #F1F5F9 20%)" }}>
      <div className="sticky top-0 z-20">
        <Navigation />
        <TabBar />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-0">
        <div className="flex flex-col gap-6">
          <header className="flex items-center gap-7 pt-15 mb-2">
            <div className="shrink-0 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-4 transition-transform duration-300 group-hover:scale-110">
              <LayoutDashboard className="size-8 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Main Dashboard</h1>
          </header>

          {/* Group Summary */}
          <Card className="border-[#AD46FF] bg-white mt-0">
          <CardHeader className="pb-0">
  <CardTitle className="text-xl font-bold">Group Summary</CardTitle>
  <p className="mt-1 text-sm text-slate-600">
    This summary highlights common preferences across all travelers to help guide itinerary and place matching.
  </p>
</CardHeader>

            <CardContent className="pt-2">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {summary.map((s, i) => (
                  <div key={s.label} className="flex items-start gap-3 rounded-xl bg-white">
                    <div className={"shrink-0 rounded-2xl " + summaryIconGradients[i] + " p-4 flex items-center justify-center"}>
                      {React.isValidElement(s.icon)
                        ? React.cloneElement(s.icon, { className: "size-10 text-white" })
                        : null}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-slate-600">{s.label}</div>
                      <div className="mt-1 text-xl font-bold text-slate-900">{s.value}</div>
                      <div className="text-xs text-slate-500">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Budget Fit + Potential Conflicts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
{/* BUDGET FIT */}
<Card className="border-[#AD46FF] bg-white">
<CardHeader className="pb-2">
  <CardTitle className="text-xl font-bold">Budget Fit</CardTitle>
  <p className="mt-1 text-sm text-slate-600">
    Helps you see whether the planned budget works for everyone in the group.
  </p>
</CardHeader>


  <CardContent className="pt-2 space-y-4">
    {(() => {
      const bs = matchStyles(budgetCompatibilityPct);

      return (
        <>
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">Budget Compatibility</div>
            <div className="text-sm font-bold text-slate-900">
              {budgetCompatibilityPct}%
            </div>
          </div>

          <Progress
            value={budgetCompatibilityPct}
            className={"h-2 bg-slate-100 " + bs.bar}
          />
        </>
      );
    })()}

    <div className="flex items-start gap-2 text-sm font-medium">
      <div className="mt-0.5 rounded-md bg-red-50 p-1">
        <AlertTriangle className="size-4 text-red-600" />
      </div>
      <div className="text-slate-700">{budgetStatus}</div>
    </div>

    <div className="h-px w-full bg-slate-100" />

    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="text-xs text-slate-500">Avg. Cost/Person</div>
        <div className="mt-1 text-lg font-bold text-slate-900">
          RM{averageBudget.toFixed(0)}
        </div>
      </div>

      <div className="text-right">
        <div className="text-xs text-slate-500">Avg. Budget Range</div>
        <div className="mt-1 text-lg font-bold text-slate-900">
          RM{groupMinBudget.toFixed(0)} – RM{groupMaxBudget.toFixed(0)}
        </div>
      </div>
    </div>

    {/* Traveler Budget Breakdown (clickable) */}
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs font-semibold text-slate-700 mb-2">
        Traveler Budget Breakdown
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
        <button
          type="button"
          onClick={() => setBudgetBreakdownFilter("within")}
          className={
            "inline-flex items-center gap-2 rounded-full px-2 py-1 " +
            (budgetBreakdownFilter === "within"
              ? "bg-white border border-slate-200"
              : "")
          }
        >
          <span className="size-2 rounded-full bg-green-500" />
          Within range: <span className="font-semibold">{withinCount}</span>
        </button>


        {/* ABOVE avg = YELLOW */}
        <button
          type="button"
          onClick={() => setBudgetBreakdownFilter("above")}
          className={
            "inline-flex items-center gap-2 rounded-full px-2 py-1 " +
            (budgetBreakdownFilter === "above"
              ? "bg-white border border-slate-200"
              : "")
          }
        >
          <span className="size-2 rounded-full bg-yellow-500" />
          Above avg: <span className="font-semibold">{aboveCount}</span>
        </button>


        {/* BELOW avg = RED */}
        <button
          type="button"
          onClick={() => setBudgetBreakdownFilter("below")}
          className={
            "inline-flex items-center gap-2 rounded-full px-2 py-1 " +
            (budgetBreakdownFilter === "below"
              ? "bg-white border border-slate-200"
              : "")
          }
        >
          <span className="size-2 rounded-full bg-red-500" />
          Below avg: <span className="font-semibold">{belowCount}</span>
        </button>


      </div>

      <div className="mt-3 rounded-lg bg-white border border-slate-200 p-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-700">
            {budgetBreakdownFilter === "within"
              ? "Within range details"
              : budgetBreakdownFilter === "below"
              ? "Below average details"
              : "Above average details"}
          </div>
          <div className="text-xs text-slate-500">
            Avg: RM{averageBudget.toFixed(0)}
          </div>
        </div>

        {selectedBudgetBucket.length === 0 ? (
          <div className="mt-2 text-sm text-slate-500">
            {budgetBreakdownFilter === "within"
              ? "No travelers have a budget range that includes the current average."
              : budgetBreakdownFilter === "below"
              ? "No travelers are below the current average."
              : "No travelers are above the current average."}
          </div>
        ) : (
          <div className="mt-2 space-y-2">
            {selectedBudgetBucket.map((b) => (
              <div
                key={b.name}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-2"
              >
                <div className="text-sm font-medium text-slate-900">{b.name}</div>
                <div className="text-sm text-slate-600">
                  RM{b.min} – RM{b.max}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </CardContent>
</Card>


           {/* POTENTIAL CONFLICTS */}
<Card className="border-[#AD46FF] gap-1 bg-white">
  <CardHeader className="pb-0">
  <CardTitle className="text-xl font-bold">Potential Conflicts</CardTitle>
<p className="mt-1 text-sm text-slate-600">
  Helps you spot preference differences early and avoid misunderstandings during the trip.
</p>


    <div className="flex flex-wrap items-center gap-3 mt-2">
      <span className="font-semibold text-slate-800">Conflict Level:</span>

      <button
        type="button"
        onClick={() => setConflictFilter("all")}
        className={
          "rounded-full px-2 py-1 " +
          (conflictFilter === "all"
            ? "bg-slate-100 border border-slate-300"
            : "")
        }
      >
        <Pill dotClassName="bg-slate-400">All ({conflicts.length})</Pill>
      </button>

      <button
        type="button"
        onClick={() => setConflictFilter("high")}
        className={
          "rounded-full px-2 py-1 " +
          (conflictFilter === "high"
            ? "bg-red-50 border border-red-200"
            : "")
        }
      >
        <Pill dotClassName="bg-red-500">High ({conflictCounts.high})</Pill>
      </button>

      <button
        type="button"
        onClick={() => setConflictFilter("medium")}
        className={
          "rounded-full px-2 py-1 " +
          (conflictFilter === "medium"
            ? "bg-yellow-50 border border-yellow-200"
            : "")
        }
      >
        <Pill dotClassName="bg-yellow-400">
          Medium ({conflictCounts.medium})
        </Pill>
      </button>

      <button
        type="button"
        onClick={() => setConflictFilter("low")}
        className={
          "rounded-full px-2 py-1 " +
          (conflictFilter === "low"
            ? "bg-blue-50 border border-blue-200"
            : "")
        }
      >
        <Pill dotClassName="bg-blue-500">Low ({conflictCounts.low})</Pill>
      </button>
    </div>
  </CardHeader>

  <CardContent className="pt-1">
    <div className="mt-4 max-h-[260px] overflow-y-auto pr-2 flex flex-col gap-2">
      {filteredConflicts.map((c, idx) => {
        const s = severityStyles(c.severity);
        return (
          <div
            key={c.title + "-" + idx}
            className={"flex items-start gap-3 rounded-xl border p-3 " + s.container}
          >
            <div className="mt-0.5 rounded-md bg-white/60 p-1">
              {/* ✅ dynamic icon per conflict type */}
              {getConflictIcon(c.description, c.severity)}
            </div>

            <div className="min-w-0">
              <div className={"text-sm font-semibold " + s.text}>{c.title}</div>
              <div className={"text-xs " + s.sub}>{c.description}</div>
            </div>
          </div>
        );
      })}

      {filteredConflicts.length === 0 && (
        <div className="text-sm text-slate-500">No conflicts for this filter 🎉</div>
      )}
    </div>
  </CardContent>
</Card>

          </div>

          {/* Proposed Destinations */}
          <Card className="border-[#AD46FF] bg-white">
            <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">Proposed Destinations</CardTitle>
<p className="mt-1 text-sm text-slate-600">
  These destinations have the highest compatibility scores for your group.
</p>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                {placeCards.slice(0, 2).map(({ place, match }) => {
                  const ms = matchStyles(match);

                  return (
                    <div key={place.id} className="rounded-xl border-2 border-violet-100 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-lg font-bold text-slate-900">{place.title}</div>
                          <div className="mt-1 text-sm text-slate-600">{place.description}</div>
                        </div>

                        <div className={"shrink-0 rounded-full px-3 py-1 text-sm font-bold " + ms.badge}>
                          {match}% Match
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <div className="inline-flex items-center gap-2">
                          <Coins className="size-4 text-slate-500" />
                          RM{place.preferences.budgetMin}–RM{place.preferences.budgetMax}
                        </div>
                        <div className="inline-flex items-center gap-2">
                          <Users2 className="size-4 text-slate-500" />
                          {crowdToleranceLabels[place.preferences.crowdTolerance]}
                        </div>
                        <div className="inline-flex items-center gap-2">
                          <Heart className="size-4 text-slate-500" />
                          {place.interests}
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Group Alignment</span>
                          <span className="font-semibold text-slate-900">{match}%</span>
                        </div>

                        <Progress value={match} className={"mt-2 h-2 bg-slate-100 " + ms.bar} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

{/* NEW: Melaka Place Guide (Collapsible) */}
<Card className="border-[#AD46FF] bg-white mb-10">
  {/* Clickable Header */}
  <button
    type="button"
    onClick={() => setMelakaOpen((v) => !v)}
    className="w-full text-left"
  >
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between gap-4">
        <CardTitle className="text-xl font-bold">
          Melaka Place Guide (Preferences)

          <p className="mt-1 text-sm text-slate-600">
  Alternative places that don’t rank as high, but could still be a good fit for your trip.
</p>

        </CardTitle>

        

        {/* Chevron */}
        <div
          className={
            "transition-transform duration-200 " +
            (melakaOpen ? "rotate-180" : "")
          }
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="#64748b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="text-sm text-slate-600">
        Click to {melakaOpen ? "hide" : "view"} recommendations
      </div>
    </CardHeader>
  </button>

  {/* Collapsible Body */}
  {melakaOpen && (
    <CardContent className="pt-2">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {placeCards.map(({ place, match }) => {
          const ms = matchStyles(match);
          const pref = place.preferences;

          const seasonsText =
            pref.preferredSeasons.length > 0
              ? pref.preferredSeasons
                  .slice(0, 3)
                  .map((s) => seasonLabels[s] || s)
                  .join(", ") + (pref.preferredSeasons.length > 3 ? "…" : "")
              : "Any";

          return (
            <div
              key={place.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-base font-bold text-slate-900">
                    {place.title}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {place.description}
                  </div>
                </div>

                <div
                  className={
                    "shrink-0 rounded-full px-3 py-1 text-sm font-bold " +
                    ms.badge
                  }
                >
                  {match}% Match
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm text-slate-700">
                <div className="inline-flex items-center gap-2">
                  <Heart className="size-4 text-slate-500" />
                  Style:{" "}
                  <span className="font-semibold">
                    {travelStyleLabels[pref.travelStyle]}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2">
                  <Users2 className="size-4 text-slate-500" />
                  Crowd:{" "}
                  <span className="font-semibold">
                    {crowdToleranceLabels[pref.crowdTolerance]}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4 text-slate-500" />
                  Seasons: <span className="font-semibold">{seasonsText}</span>
                </div>

                <div className="inline-flex items-center gap-2">
                  <Coins className="size-4 text-slate-500" />
                  Budget:{" "}
                  <span className="font-semibold">
                    RM{pref.budgetMin}–RM{pref.budgetMax}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <div className="inline-flex items-center gap-2">
                  <MapPin className="size-4 text-slate-500" />
                  {place.interests}
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Alignment</span>
                  <span className="font-semibold text-slate-900">{match}%</span>
                </div>
                <Progress
                  value={match}
                  className={"mt-2 h-2 bg-slate-100 " + ms.bar}
                />
              </div>
            </div>
          );
        })}
      </div>
    </CardContent>
  )}
</Card>

        </div>
      </main>
    </div>
  );
};

function MelakaPlaceGuideCard({
  title = "Melaka Place Guide (Preferences)",
  places,
}: {
  title?: string;
  places: Array<{
    name: string;
    preferences: {
      travelStyle: string;
      crowdTolerance: string;
      preferredSeasons: string[];
      budgetMin: number;
      budgetMax: number;
    };
    tags?: string[];
  }>;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="rounded-2xl border border-[#AD46FF] bg-white">
      {/* Header (clickable) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left p-6 flex items-center justify-between"
      >
        <div>
          <div className="text-xl font-bold text-slate-900">{title}</div>
          <div className="mt-1 text-sm text-slate-600">
            Click to {open ? "hide" : "view"} place preferences
          </div>
        </div>

        {/* Chevron */}
        <div
          className={
            "transition-transform duration-200 " + (open ? "rotate-180" : "")
          }
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="#64748b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* Body (collapsible) */}
      {open && (
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {places.map((p) => (
              <div
                key={p.name}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="text-lg font-bold text-slate-900">{p.name}</div>

                {p.tags?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-violet-200 bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Travel Style</span>
                    <span className="font-semibold">{p.preferences.travelStyle}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Crowd Tolerance</span>
                    <span className="font-semibold">
                      {p.preferences.crowdTolerance}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Budget Range</span>
                    <span className="font-semibold">
                      RM{p.preferences.budgetMin} – RM{p.preferences.budgetMax}
                    </span>
                  </div>

                  <div>
                    <div className="text-slate-500 mb-1">Preferred Seasons</div>
                    <div className="flex flex-wrap gap-2">
                      {p.preferences.preferredSeasons.map((s) => (
                        <span
                          key={p.name + "-" + s}
                          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {places.length === 0 && (
            <div className="text-sm text-slate-600">No place data available.</div>
          )}
        </div>
      )}
    </div>
  );
}

<br></br>

export default DashboardPage;
