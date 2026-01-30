"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type GroupNumber = 1 | 2 | 3 | 4 | 5;

interface GroupLabelProps {
  group: GroupNumber;
  className?: string;
}

const groupConfig: Record<GroupNumber, { name: string; color: string; bg: string }> = {
  1: {
    name: "Context-Aware Planning Assistant",
    color: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800",
  },
  2: {
    name: "Interactive Travel Dashboard",
    color: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-100 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800",
  },
  3: {
    name: "Personal Travel Informatics",
    color: "text-violet-700 dark:text-violet-300",
    bg: "bg-violet-100 dark:bg-violet-900/50 border-violet-200 dark:border-violet-800",
  },
  4: {
    name: "Social & Community Layer",
    color: "text-orange-700 dark:text-orange-300",
    bg: "bg-orange-100 dark:bg-orange-900/50 border-orange-200 dark:border-orange-800",
  },
  5: {
    name: "Predictive & Collective Analytics",
    color: "text-rose-700 dark:text-rose-300",
    bg: "bg-rose-100 dark:bg-rose-900/50 border-rose-200 dark:border-rose-800",
  },
};

export function GroupLabel({ group, className }: GroupLabelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = groupConfig[group];

  return (
    <div
      className={cn(
        "fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 flex items-center gap-2 rounded-full border shadow-lg backdrop-blur-sm select-none cursor-pointer",
        "transition-all duration-300 ease-out",
        isExpanded ? "px-3 py-2" : "p-1.5",
        config.bg,
        className
      )}
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-bold shrink-0",
          "bg-white dark:bg-gray-800 shadow-sm",
          "size-6 text-xs",
          config.color
        )}
      >
        {group}
      </div>

      {/* Expandable text - works on all screen sizes */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out whitespace-nowrap",
          isExpanded ? "max-w-[280px] opacity-100" : "max-w-0 opacity-0"
        )}
      >
        <span className={cn("text-sm font-medium pr-1", config.color)}>
          Group {group}: {config.name}
        </span>
      </div>
    </div>
  );
}
