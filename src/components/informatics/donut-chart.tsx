"use client";

import { useEffect, useState } from "react";

interface DonutChartProps {
  percentage: number;
  label: string;
  total: string;
  variant?: "default" | "on-colored-bg";
}

export function DonutChart({ percentage, label, total, variant = "default" }: DonutChartProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 200);
    return () => clearTimeout(timer);
  }, [percentage]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  const isOnColoredBg = variant === "on-colored-bg";
  const bgCircleColor = isOnColoredBg ? "rgba(255, 255, 255, 0.2)" : undefined;
  const progressCircleColor = isOnColoredBg ? "rgba(255, 255, 255, 0.9)" : undefined;
  const textColor = isOnColoredBg ? "text-white" : "text-foreground";
  const mutedTextColor = isOnColoredBg ? "text-white/80" : "text-muted-foreground";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        {/* Background Circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            className={isOnColoredBg ? "" : "stroke-secondary"}
            strokeWidth="12"
            style={bgCircleColor ? { stroke: bgCircleColor } : undefined}
          />
          {/* Progress Circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            className={isOnColoredBg ? "" : "stroke-primary"}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ 
              transition: "stroke-dashoffset 1s ease-out",
              ...(progressCircleColor ? { stroke: progressCircleColor } : {})
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${textColor}`}>
            {animatedPercentage}%
          </span>
          <span className={`text-xs ${mutedTextColor} mt-1`}>used</span>
        </div>
      </div>

      <div className="text-center mt-4">
        <p className={`text-sm font-medium ${textColor}`}>{label}</p>
        <p className={`text-xs ${mutedTextColor}`}>of {total}</p>
      </div>
    </div>
  );
}

