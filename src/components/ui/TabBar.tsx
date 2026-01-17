"use client";

import { usePathname } from "next/navigation";
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

  const isActive = (href: string) => {
    return pathname === href;
  };

  const costPerPerson = totalCost && memberCount ? totalCost / memberCount : 350;

  return (
    <div className="bg-card border-b-2 border-border">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {/* Tabs */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const active = isActive(tab.href);
              const Icon = tab.icon;
              return (
                <Link key={tab.id} href={tab.href}>
                  <motion.div
                    className={cn(
                      "relative px-3 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors",
                      active
                        ? "text-[var(--duo-green)]"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[var(--duo-green)]/10 rounded-xl border-2 border-[var(--duo-green)]/30"
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
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--duo-green)]/10 border-2 border-[var(--duo-green)]/30">
            <Wallet className="w-4 h-4 text-[var(--duo-green)]" />
            <div className="text-right">
              <p className="text-xs font-extrabold text-[var(--duo-green)]">
                RM{totalCost ?? 1400}
              </p>
              <p className="text-[10px] text-muted-foreground">
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
