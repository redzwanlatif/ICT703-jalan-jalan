"use client";

import * as React from "react";
import { Navigation } from "@/components/shared/navigation";
import TabBar from "@/components/ui/TabBar";
import {
  Users,
  Coins,
  Wallet,
  Heart,
  CalendarDays,
  Users2,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

/* =======================
   CUSTOM PIE LABEL RENDERER
======================= */

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  percent,
}: any) => {
  const radius = outerRadius + 35; // Increase distance from pie
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Determine text anchor based on position
  const textAnchor = x > cx ? 'start' : 'end';

  // Split long names into multiple lines
  const words = name.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word: string, idx: number) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length > 15 && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }

    if (idx === words.length - 1 && currentLine) {
      lines.push(currentLine);
    }
  });

  // If only one line, display with percentage
  if (lines.length === 1) {
    return (
      <text
        x={x}
        y={y}
        fill="#64748b"
        textAnchor={textAnchor}
        dominantBaseline="central"
        style={{ fontSize: '11px', fontWeight: '500' }}
      >
        {name} {percent}%
      </text>
    );
  }

  // Multiple lines - show name on multiple lines, percentage below
  return (
    <text
      x={x}
      y={y - (lines.length * 6)}
      fill="#64748b"
      textAnchor={textAnchor}
      style={{ fontSize: '11px', fontWeight: '500' }}
    >
      {lines.map((line, idx) => (
        <tspan key={idx} x={x} dy={idx === 0 ? 0 : 12}>
          {line}
        </tspan>
      ))}
      <tspan x={x} dy={12} style={{ fontWeight: '600' }}>
        {percent}%
      </tspan>
    </text>
  );
};

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

// Short labels for pie chart display
const seasonShortLabels: Record<string, string> = {
  "chinese-new-year": "CNY",
  "hari-raya-aidilfitri": "Aidilfitri",
  "hari-raya-haji": "Raya Haji",
  deepavali: "Deepavali",
  thaipusam: "Thaipusam",
  wesak: "Wesak",
  christmas: "Christmas",
  merdeka: "Merdeka",
  "malaysia-day": "M'sia Day",
  "school-holidays": "School Hol.",
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

/* =======================
   HELPERS
======================= */

const countValues = (arr: string[]) =>
  arr.reduce((acc: Record<string, number>, v) => {
    const key = String(v || "");
    if (!key) return acc;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

const toPct = (count: number, total: number) =>
  total ? Math.round((count / total) * 100) : 0;

const topValue = (counts: Record<string, number>) => {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return (entries[0] || ["", 0]) as [string, number];
};

// Most = green, mid = yellow, low = grey
const getRankColor = (count: number, max: number) => {
  if (!max) return "#94a3b8"; // grey
  if (count === max) return "#22c55e"; // green
  if (count >= max * 0.5) return "#eab308"; // yellow
  return "#94a3b8"; // grey
};

export default function MembersPage() {
  const [jsonData, setJsonData] = React.useState<any>(null);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        const res = await fetch("/api/data", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch /api/data");
        const data = await res.json();
        setJsonData(data);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Unknown error");
      }
    };

    fetchData();
  }, []);

  const travelers = React.useMemo(
    () => (Array.isArray(jsonData?.travelers) ? jsonData.travelers : []),
    [jsonData]
  );

  const totalTravelers = travelers.length;


/* =======================
   BUDGET CALCULATIONS (FIXED)
======================= */

// Collect mins, maxes, and averages separately
const minBudgets = travelers
  .map((t: any) => Number(t?.preferences?.budgetMin))
  .filter((v: number) => !isNaN(v));

const maxBudgets = travelers
  .map((t: any) => Number(t?.preferences?.budgetMax))
  .filter((v: number) => !isNaN(v));

const avgBudgets = travelers
  .map((t: any) => {
    const min = Number(t?.preferences?.budgetMin || 0);
    const max = Number(t?.preferences?.budgetMax || 0);
    return min && max ? (min + max) / 2 : 0;
  })
  .filter((v: number) => v > 0);

// ✅ TRUE lowest & highest
const groupMinBudget = minBudgets.length ? Math.min(...minBudgets) : 0;
const groupMaxBudget = maxBudgets.length ? Math.max(...maxBudgets) : 0;

// ✅ Correct average
const averageBudget = avgBudgets.length
  ? Math.round(avgBudgets.reduce((a, b) => a + b, 0) / avgBudgets.length)
  : 0;

// Marker position
const avgPositionPct =
  groupMaxBudget > groupMinBudget
    ? ((averageBudget - groupMinBudget) /
        (groupMaxBudget - groupMinBudget)) *
      100
    : 50;



  /* =======================
     BUILD ARRAYS
  ======================= */

  const travelStyleArr = travelers
    .map((t: any) => t?.preferences?.travelStyle || "")
    .filter(Boolean);

  const crowdArr = travelers
    .map((t: any) => t?.preferences?.crowdTolerance || "")
    .filter(Boolean);

  // MULTI-SELECT
  const seasonArr = travelers
    .flatMap((t: any) => t?.preferences?.preferredSeasons || [])
    .filter(Boolean);

  /* =======================
     COUNTS
  ======================= */

  const travelStyleCounts = countValues(travelStyleArr);
  const crowdCounts = countValues(crowdArr);

  // Pie % based on total selections (sum = 100%)
  const seasonCounts = countValues(seasonArr);
  const totalSeasonSelections = Object.values(seasonCounts).reduce(
    (s, c) => s + c,
    0
  );

  const maxTravelStyle = Math.max(0, ...Object.values(travelStyleCounts));
  const maxCrowd = Math.max(0, ...Object.values(crowdCounts));
  const maxSeasonCount = Math.max(0, ...Object.values(seasonCounts));

  /* =======================
     TOP PICKS
  ======================= */

  const [topStyleKey, topStyleCount] = topValue(travelStyleCounts);
  const [topCrowdKey, topCrowdCount] = topValue(crowdCounts);

  /* =======================
     CHART DATA (hide 0)
  ======================= */

  const travelStyleChart = Object.entries(travelStyleCounts)
    .map(([key, count]) => ({
      key,
      name: travelStyleLabels[key] || key,
      count,
      percent: toPct(count, totalTravelers),
      fill: getRankColor(count, maxTravelStyle),
    }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);

  const crowdChart = Object.entries(crowdCounts)
    .map(([key, count]) => ({
      key,
      name: crowdToleranceLabels[key] || key,
      count,
      percent: toPct(count, totalTravelers),
      fill: getRankColor(count, maxCrowd),
    }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);

  // ✅ show ALL selected seasons (no slice)
  const seasonPie = Object.entries(seasonCounts)
    .map(([key, count]) => ({
      key,
      name: seasonShortLabels[key] || seasonLabels[key] || key,
      fullName: seasonLabels[key] || key,
      count,
      percent: totalSeasonSelections
        ? Math.round((count / totalSeasonSelections) * 100)
        : 0,
      fill: getRankColor(count, maxSeasonCount),
    }))
    .filter((d: { count: number }) => d.count > 0)
    .sort((a: { count: number }, b: { count: number }) => b.count - a.count);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #f5f3ff 0%, #F1F5F9 20%)",
      }}
    >
      <div className="sticky top-0 z-20">
        <Navigation />
        <TabBar />
      </div>

      <main className="container mx-auto px-6 lg:px-24 py-4">
        <header className="flex items-center gap-7 pt-11 mb-8">
          <div className="shrink-0 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-4 transition-transform duration-300 group-hover:scale-110">
            <Users className="size-8 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">My Travel Group Members</h1>
        </header>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        ) : !jsonData ? (
          <div className="text-slate-600">Loading...</div>
        ) : (
          <div className="space-y-6">
            {/* GROUP PREFERENCES OVERVIEW */}
            <div className="rounded-2xl border border-[#AD46FF] bg-white p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Group Preferences Overview
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Travel Style (bar) */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-800">
                    Travel Style
                  </div>

                  

                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    {travelStyleLabels[topStyleKey] || "—"}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Chosen by{" "}
                    <span className="font-semibold">{topStyleCount}</span>{" "}
                    traveler(s)
                  </div>

                  <div className="mt-4 h-[190px]">
                    {travelStyleChart.length === 0 ? (
                      <div className="text-sm text-slate-600">No data</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={travelStyleChart}
                          layout="vertical"
                          margin={{ top: 8, right: 40, left: 0, bottom: 8 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" hide />
                          <YAxis
                            type="category"
                            dataKey="name"
                            width={110}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip
                            formatter={(value: any, _name: any, props: any) => {
                              const p = props?.payload?.percent ?? 0;
                              return [`${value} (${p}%)`, "Selected"];
                            }}
                          />
                          <Bar dataKey="count" radius={[6, 6, 6, 6]}>
                            {travelStyleChart.map((entry, index) => (
                              <Cell
                                key={"cell-style-" + index}
                                fill={entry.fill}
                              />
                            ))}
                            <LabelList
                              dataKey="percent"
                              position="right"
                              formatter={(v: any) => v + "%"}
                              style={{
                                fill: "#0f172a",
                                fontSize: 12,
                              }}
                            />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Travel Style Insight */}
<div className="mt-4 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
  {travelStyleChart.length === 0 ? (
    "No travel style preference data available."
  ) : travelStyleChart[0].percent >= 60 ? (
    <>
      <span className="font-semibold text-emerald-700">
        Strong alignment:
      </span>{" "}
      Most travelers prefer a{" "}
      <span className="font-semibold">
        {travelStyleChart[0].name}
      </span>{" "}
      travel style. This makes it easier to plan accommodations, activities,
      and transport that suit the whole group.
    </>
  ) : (
    <>
      <span className="font-semibold text-yellow-700">
        Mixed preferences:
      </span>{" "}
      The group shows varied travel styles. Consider balancing comfort,
      budget, and flexibility when planning the trip.
    </>
  )}
</div>

                </div>

                {/* Crowd Preference (column) */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-800">
                    Crowd Preference
                  </div>

                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    {crowdToleranceLabels[topCrowdKey] || "—"}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Chosen by{" "}
                    <span className="font-semibold">{topCrowdCount}</span>{" "}
                    traveler(s)
                  </div>

                  <div className="mt-4 h-[190px]">
                    {crowdChart.length === 0 ? (
                      <div className="text-sm text-slate-600">No data</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={crowdChart}
                          margin={{ top: 20, right: 12, left: 0, bottom: 6 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            interval={0}
                          />
                          <YAxis hide />
                          <Tooltip
                            formatter={(value: any, _name: any, props: any) => {
                              const p = props?.payload?.percent ?? 0;
                              return [`${value} (${p}%)`, "Selected"];
                            }}
                          />
                          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                            {crowdChart.map((entry, index) => (
                              <Cell
                                key={"cell-crowd-" + index}
                                fill={entry.fill}
                              />
                            ))}
                            <LabelList
                              dataKey="percent"
                              position="top"
                              formatter={(v: any) => v + "%"}
                              style={{
                                fill: "#0f172a",
                                fontSize: 12,
                              }}
                            />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Crowd Preference Insight */}
<div className="mt-4 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
  {crowdChart.length === 0 ? (
    "No crowd preference data available."
  ) : crowdChart[0].key === "avoid-crowd" ? (
    <>
      <span className="font-semibold text-emerald-700">
        Crowd-sensitive group:
      </span>{" "}
      Most travelers prefer to avoid crowds. Consider off-peak travel times,
      quieter destinations, and less crowded attractions.
    </>
  ) : crowdChart[0].key === "okay-crowd" ? (
    <>
      <span className="font-semibold text-yellow-700">
        Crowd-tolerant group:
      </span>{" "}
      The group is generally okay with crowds. Popular attractions and busy
      periods are acceptable.
    </>
  ) : (
    <>
      <span className="font-semibold text-slate-700">
        Flexible crowd preference:
      </span>{" "}
      Travelers have no strong preference regarding crowds, giving more
      flexibility in planning.
    </>
  )}
</div>

                </div>

                {/* Season Preference (pie) */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-800">
                    Season Preference
                  </div>
                   <div className="mt-2 text-2xl font-bold text-slate-900">
                    Christmas
                  </div>

                  <div className="mt-1 text-sm text-slate-600">
                    Seasons selected by the group
                  </div>

                  <div className="mt-4 h-[320px]" style={{ overflow: 'visible' }}>
                    {seasonPie.length === 0 ? (
                      <div className="text-sm text-slate-600">No data</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 30, right: 70, bottom: 30, left: 70 }} style={{ overflow: 'visible' }}>
                          <Tooltip
                            formatter={(value: any, _name: any, props: any) => {
                              const p = props?.payload?.percent ?? 0;
                              return [`${value} (${p}%)`, props?.payload?.fullName || props?.payload?.name];
                            }}
                          />
                          <Pie
                            data={seasonPie}
                            dataKey="count"
                            nameKey="name"
                            innerRadius={35}
                            outerRadius={55}
                            paddingAngle={2}
                            label={renderCustomLabel}
                            labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                          >
                            {seasonPie.map((s, i) => (
                              <Cell
                                key={s.key + "-" + i}
                                fill={s.fill}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Legend (scroll if many) */}
                  {seasonPie.length > 0 && (
                    <div className="mt-2 max-h-[160px] overflow-y-auto pr-1 grid grid-cols-2 gap-2">
                      {seasonPie.map((s, i) => (
                        <div
                          key={s.key + "-legend-" + i}
                          className="flex items-center justify-between rounded-lg bg-white border border-slate-200 px-2 py-1"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="size-2 rounded-full"
                              style={{ backgroundColor: s.fill }}
                            />
                            <span className="text-xs text-slate-700 truncate">
                              {s.fullName}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-slate-800">
                            {s.percent}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

{/* =======================
    BUDGET SENSITIVITY OVERVIEW
======================= */}
<div className="rounded-2xl border border-[#AD46FF] bg-white p-6">
<h2 className="text-xl font-bold text-slate-900">
  Budget Sensitivity Overview
</h2>
<p className="mt-1 text-sm text-slate-600">
  Highlights travelers who are more affected by budget changes compared to the group average.
</p>


  {/* Numbers */}
  <div className="mt-6 grid grid-cols-3 gap-6 text-center">
    <div>
      <div className="text-xs text-slate-500">Lowest Budget</div>
      <div className="text-xl font-bold text-red-600">
        RM{groupMinBudget.toFixed(0)}
      </div>
    </div>

    <div>
      <div className="text-xs text-slate-500">Group Average</div>
      <div className="text-xl font-bold text-violet-700">
        RM{averageBudget.toFixed(0)}
      </div>
    </div>

    <div>
      <div className="text-xs text-slate-500">Highest Budget</div>
      <div className="text-xl font-bold text-red-600">
        RM{groupMaxBudget.toFixed(0)}
      </div>
    </div>
  </div>

  {/* Gradient Bar */}
  <div className="mt-6 space-y-2">
  <div
  className="relative h-3 w-full rounded-full"
  style={{
    background:
      "linear-gradient(to right, #ef4444 0%, #fb923c 25%, #22c55e 50%, #fb923c 75%, #ef4444 100%)",
  }}
>

      {/* Average Marker */}
      <div
        className="absolute -top-1 h-5 w-1 rounded-full bg-violet-700"
        style={{ left: `${avgPositionPct}%` }}
      />
    </div>

    <div className="flex justify-between text-xs text-slate-500">
      <span>RM{groupMinBudget.toFixed(0)}</span>
      <span>RM{groupMaxBudget.toFixed(0)}</span>
    </div>
  </div>

  {/* Insight */}
  <div className="mt-5 rounded-lg bg-violet-50 border border-violet-100 p-4 text-sm text-violet-800">
    {groupMaxBudget - groupMinBudget > averageBudget
      ? "The group has a wide budget range. Expect trade-offs between cost and comfort."
      : "The group has a relatively aligned budget range, making planning easier."}
  </div>
</div>



            {/* INDIVIDUAL MEMBER DETAILS */}
<div className="rounded-2xl border border-[#AD46FF] bg-white p-10 mb-10">
<h2 className="text-xl font-bold text-slate-900">
  Individual Member Details
</h2>
<p className="mt-1 text-sm text-slate-600">
  View each traveler’s preferences to understand individual needs and preferences.
</p>

  <div className="mt-4 overflow-x-auto">
    <table className="w-full min-w-[1000px] border-collapse">
    <thead>
  <tr className="text-left text-sm text-slate-600">
    <th className="py-3 font-medium">
      <div className="flex items-center gap-2">
        <Users className="size-4 text-slate-400" />
        Member
      </div>
    </th>

    <th className="py-3 font-medium">
      <div className="flex items-center gap-2">
        <Coins className="size-4 text-slate-400" />
        Budget Range
      </div>
    </th>

    <th className="py-3 font-medium">
      <div className="flex items-center gap-2">
        <Wallet className="size-4 text-slate-400" />
        Avg Budget
      </div>
    </th>

    <th className="py-3 font-medium">
      <div className="flex items-center gap-2">
        <Heart className="size-4 text-slate-400" />
        Travel Style
      </div>
    </th>

    <th className="py-3 font-medium">
      <div className="flex items-center gap-2">
        <CalendarDays className="size-4 text-slate-400" />
        Preferred Seasons
      </div>
    </th>

    <th className="py-3 font-medium">
      <div className="flex items-center gap-2">
        <Users2 className="size-4 text-slate-400" />
        Crowd Preference
      </div>
    </th>
  </tr>
</thead>


      <tbody>
        {travelers.map((t: any, idx: number) => {
          const name: string = t?.name || "Unknown";

          // initials badge
          const initials = name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((x) => x[0]?.toUpperCase())
            .join("");

          const min = Number(t?.preferences?.budgetMin || 0);
          const max = Number(t?.preferences?.budgetMax || 0);
          const avg = (min + max) / 2;

          const seasons: string[] = Array.isArray(t?.preferences?.preferredSeasons)
            ? t.preferences.preferredSeasons
            : [];

          const crowdKey = t?.preferences?.crowdTolerance || "";
          const crowdLabel = crowdToleranceLabels[crowdKey] || "—";

          const styleKey = t?.preferences?.travelStyle || "";
          const styleLabel = travelStyleLabels[styleKey] || "—";

          const crowdPillClass =
            crowdKey === "avoid-crowd"
              ? "bg-pink-50 text-pink-700 border-pink-200"
              : crowdKey === "okay-crowd"
              ? "bg-violet-50 text-violet-700 border-violet-200"
              : "bg-slate-100 text-slate-700 border-slate-200";

          const stylePillClass =
            styleKey === "comfortable"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : styleKey === "balanced"
              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
              : styleKey === "low-budget"
              ? "bg-slate-100 text-slate-700 border-slate-200"
              : "bg-slate-100 text-slate-700 border-slate-200";

          // EXPAND/COLLAPSE seasons per traveler
          // We store expanded rows as: { [rowKey]: boolean }
          const rowKey = name + "-" + idx;

          return (
            <tr key={rowKey} className="border-t border-slate-100">
              {/* Member */}
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-700">
                    {initials || "U"}
                  </div>
                  <div className="font-semibold text-slate-900">{name}</div>
                </div>
              </td>



              {/* Budget Range */}
              <td className="py-4 text-slate-700">
                RM{min.toLocaleString()} - RM{max.toLocaleString()}
              </td>

              {/* Avg Budget */}
              <td className="py-4 font-semibold text-slate-900">
                RM{Math.round(avg).toLocaleString()}
              </td>


              {/* Travel Style */}
              <td className="py-4">
                <span
                  className={
                    "inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold " +
                    stylePillClass
                  }
                >
                  {styleLabel}
                </span>
              </td>

              {/* Preferred Seasons (click +X more) */}
              <td className="py-4">
                <SeasonChips
                  seasons={seasons}
                  rowKey={rowKey}
                  seasonLabels={seasonLabels}
                />
              </td>

              {/* Crowd Preference */}
              <td className="py-4">
                <span
                  className={
                    "inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold " +
                    crowdPillClass
                  }
                >
                  {crowdLabel}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>

    {travelers.length === 0 && (
      <div className="py-6 text-sm text-slate-600">No traveler data found.</div>
    )}
  </div>
</div>


          </div>

          
        )}

        
      </main>
    </div>
  );
}

function SeasonChips({
  seasons,
  rowKey,
  seasonLabels,
}: {
  seasons: string[];
  rowKey: string;
  seasonLabels: Record<string, string>;
}) {
  const [expanded, setExpanded] = React.useState(false);

  if (!seasons || seasons.length === 0) {
    return <span className="text-sm text-slate-500">—</span>;
  }

  const visibleCount = 4;
  const shown = expanded ? seasons : seasons.slice(0, visibleCount);
  const remaining = Math.max(0, seasons.length - visibleCount);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {shown.map((s) => (
        <span
          key={rowKey + "-season-" + s}
          className="rounded-md border border-violet-200 bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700"
        >
          {seasonLabels[s] || s}
        </span>
      ))}

      {!expanded && remaining > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          +{remaining} more
        </button>
      )}

      {expanded && seasons.length > visibleCount && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          Show less
        </button>
      )}
    </div>
  );
}