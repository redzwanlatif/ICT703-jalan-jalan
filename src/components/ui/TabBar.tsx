"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, Map, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

type TabBarProps = {
  totalCost?: number;
  memberCount?: number;
};

const tabs = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: "member", label: "Members", href: "/dashboard/member", icon: Users },
  { id: "itenary", label: "Itinerary", href: "/dashboard/itenary", icon: Map },
];

const TabBar = ({ totalCost, memberCount }: TabBarProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");

  const isActive = (href: string) => {
    return pathname === href;
  };

  // Build href with preserved tripId
  const getHref = (baseHref: string) => {
    if (tripId) {
      return `${baseHref}?tripId=${tripId}`;
    }
    return baseHref;
  };

  const displayCost = totalCost ?? 1400;
  const costPerPerson = displayCost && memberCount ? displayCost / memberCount : 350;

  return (
    <div className="sticky top-14 lg:top-16 z-[80] bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Tabs */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const active = isActive(tab.href);
              const Icon = tab.icon;
              return (
                <Link key={tab.id} href={getHref(tab.href)}>
                  <motion.div
                    className={cn(
                      "relative px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all",
                      active
                        ? "text-[var(--duo-green)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={cn(
                      "w-4 h-4 transition-colors",
                      active ? "text-[var(--duo-green)]" : ""
                    )} />
                    <span className="hidden sm:inline whitespace-nowrap">{tab.label}</span>
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[var(--duo-green)]/10 rounded-lg border border-[var(--duo-green)]/30 -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Cost Display */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--duo-green)]/10 to-[var(--duo-green)]/5 border border-[var(--duo-green)]/30 shadow-sm">
            <div className="p-1.5 rounded-md bg-[var(--duo-green)]/20">
              <Wallet className="w-4 h-4 text-[var(--duo-green)]" />
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[var(--duo-green)] leading-tight">
                RM{displayCost.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                RM{costPerPerson.toFixed(0)}/person
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabBar;
