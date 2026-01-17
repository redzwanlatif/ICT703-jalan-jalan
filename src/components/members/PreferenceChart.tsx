"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Member } from "../../types";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import { PieChartIcon, Compass, Sparkles } from "lucide-react";

interface PreferenceChartProps {
  members: Member[];
}

const seasonDetails: { [key: string]: { description: string; monthRange: string; emoji: string } } = {
  Raya: {
    description: "Eid celebration - vibrant festivities and family gatherings",
    monthRange: "April - May",
    emoji: "🌙",
  },
  CNY: {
    description: "Chinese New Year - colorful celebrations and cultural traditions",
    monthRange: "January - February",
    emoji: "🧧",
  },
  Merdeka: {
    description: "Malaysia Independence Day - patriotic celebrations and festivities",
    monthRange: "August",
    emoji: "🇲🇾",
  },
  Deepavali: {
    description: "Festival of Lights - cultural and spiritual celebrations",
    monthRange: "October - November",
    emoji: "🪔",
  },
};

// Duolingo color palette
const DUO_COLORS = [
  "#58CC02", // duo-green
  "#1CB0F6", // duo-blue
  "#A560E8", // duo-purple
  "#FF9600", // duo-orange
  "#FFC800", // duo-yellow
  "#FF4B4B", // duo-red
  "#2B70C9", // darker blue
  "#89E219", // lighter green
];

const RADIAN = Math.PI / 180;

const CustomSeasonTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const season = data.payload.season;
    const actualCount = data.value - 1;
    const percentage = ((actualCount / data.payload.totalMembers) * 100).toFixed(0);
    const seasonInfo = seasonDetails[season];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="duo-card px-4 py-3 !shadow-lg"
      >
        <p className="font-extrabold flex items-center gap-2">
          <span>{seasonInfo?.emoji}</span>
          {season}
        </p>
        <p className="text-sm text-[var(--duo-purple)] font-bold">
          {actualCount} / {data.payload.totalMembers} members ({percentage}%)
        </p>
        {seasonInfo && (
          <p className="text-xs text-muted-foreground mt-1">
            {seasonInfo.monthRange}
          </p>
        )}
      </motion.div>
    );
  }
  return null;
};

const CustomInterestTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="duo-card px-4 py-3 !shadow-lg"
      >
        <p className="font-extrabold" style={{ color: data.payload.fill }}>
          {data.name}
        </p>
        <p className="text-sm font-bold">
          {data.value} {data.value === 1 ? "member" : "members"}
        </p>
      </motion.div>
    );
  }
  return null;
};

export function PreferenceChart({ members }: PreferenceChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Calculate interest distribution
  const interestCounts: { [key: string]: number } = {};
  members.forEach((member) => {
    member.interests.forEach((interest) => {
      interestCounts[interest] = (interestCounts[interest] || 0) + 1;
    });
  });

  const pieData = Object.entries(interestCounts).map(([name, value], index) => ({
    name,
    value,
    fill: DUO_COLORS[index % DUO_COLORS.length],
  }));

  // Calculate season preferences
  const allSeasons = ["Raya", "CNY", "Merdeka", "Deepavali"];
  const seasonCounts: { [key: string]: number } = {};

  allSeasons.forEach((season) => {
    seasonCounts[season] = 0;
  });

  members.forEach((member) => {
    member.seasons.forEach((season) => {
      seasonCounts[season] = (seasonCounts[season] || 0) + 1;
    });
  });

  const radarData = allSeasons.map((season) => ({
    season,
    count: (seasonCounts[season] || 0) + 1,
    totalMembers: members.length,
  }));

  const maxCount = Math.max(...Object.values(seasonCounts), 1);
  const scaledMax = Math.ceil((maxCount + 1) * 1.2);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }: any) => {
    if (percent < 0.08) return null;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-bold"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Interest Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="duo-card p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-[var(--duo-orange)]/10">
              <PieChartIcon className="w-5 h-5 text-[var(--duo-orange)]" />
            </div>
            <div>
              <h3 className="font-extrabold">Interest Distribution</h3>
              <p className="text-sm text-muted-foreground">
                What the group loves
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                stroke="white"
                strokeWidth={3}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    style={{
                      filter: activeIndex === index ? "brightness(1.1)" : "none",
                      transform: activeIndex === index ? "scale(1.05)" : "scale(1)",
                      transformOrigin: "center",
                      transition: "all 0.2s ease",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomInterestTooltip />} />
              <Legend
                formatter={(value, entry: any) => (
                  <span className="font-bold text-sm" style={{ color: entry.color }}>
                    {value}
                  </span>
                )}
                wrapperStyle={{ paddingTop: "20px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Season Preferences */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="duo-card p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-[var(--duo-purple)]/10">
              <Compass className="w-5 h-5 text-[var(--duo-purple)]" />
            </div>
            <div>
              <h3 className="font-extrabold">Season Preferences</h3>
              <p className="text-sm text-muted-foreground">
                When to travel together
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <RadarChart
              data={radarData}
              margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
            >
              <PolarGrid
                gridType="polygon"
                stroke="var(--border)"
                strokeWidth={2}
              />
              <PolarAngleAxis
                dataKey="season"
                tick={({ x, y, payload }) => {
                  const emoji = seasonDetails[payload.value]?.emoji || "📅";
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={0}
                        y={0}
                        dy={-8}
                        textAnchor="middle"
                        className="text-lg"
                      >
                        {emoji}
                      </text>
                      <text
                        x={0}
                        y={0}
                        dy={10}
                        textAnchor="middle"
                        className="text-xs font-bold fill-foreground"
                      >
                        {payload.value}
                      </text>
                    </g>
                  );
                }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, scaledMax]}
                tick={false}
              />
              <Tooltip
                content={<CustomSeasonTooltip />}
                cursor={{ fill: "rgba(165, 96, 232, 0.1)" }}
              />
              <Radar
                name="Preferences"
                dataKey="count"
                stroke="var(--duo-purple)"
                fill="var(--duo-purple)"
                fillOpacity={0.5}
                strokeWidth={3}
                dot={{
                  r: 6,
                  fill: "var(--duo-purple)",
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Fun insight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
      >
        <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
        <span>
          <strong className="text-foreground">{members.length} travelers</strong> with{" "}
          <strong className="text-[var(--duo-green)]">{pieData.length} shared interests</strong>
        </span>
      </motion.div>
    </div>
  );
}
