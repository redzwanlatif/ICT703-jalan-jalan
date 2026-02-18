"use client";

import { CreditCard, Wifi, Utensils, Car, Bed } from "lucide-react";
import { UnifiedCard } from "@/components/shared/page-layout";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const mockTransactions = [
  {
    icon: Utensils,
    label: "Nasi Lemak Antarabangsa",
    category: "Food",
    amount: "RM 18.90",
    time: "12:34 PM",
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  },
  {
    icon: Car,
    label: "Grab — KLIA to Hotel",
    category: "Transport",
    amount: "RM 12.00",
    time: "10:15 AM",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  },
  {
    icon: Bed,
    label: "Hotel & Co Melaka",
    category: "Hotel",
    amount: "RM 240.00",
    time: "Yesterday",
    color: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",
  },
];

export function LinkedCardMockup() {
  return (
    <div className="relative mt-5">
      <Badge className="absolute -top-2 right-3 z-10 bg-amber-500 text-white border-amber-500 text-[10px] px-2">
        Future Feature
      </Badge>

      <UnifiedCard gradient className="overflow-hidden">
        <div className="p-5 space-y-4">
          {/* Credit card graphic */}
          <div className="relative rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-5 text-white shadow-lg overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/4" />
            </div>

            <div className="relative z-10 flex items-start justify-between mb-6">
              <CreditCard className="size-8 opacity-80" />
              <Wifi className="size-5 opacity-60 rotate-90" />
            </div>
            <p className="relative z-10 text-lg font-mono tracking-[0.2em] mb-4 opacity-90">
              &#x2022;&#x2022;&#x2022;&#x2022; &#x2022;&#x2022;&#x2022;&#x2022; &#x2022;&#x2022;&#x2022;&#x2022; 4289
            </p>
            <div className="relative z-10 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider opacity-60 mb-0.5">
                  Cardholder
                </p>
                <p className="text-sm font-medium">AHMAD TRAVELLER</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider opacity-60 mb-0.5">
                  Linked
                </p>
                <p className="text-sm font-medium">Travel Pulse</p>
              </div>
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                Live
              </span>
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Auto-synced with Travel Pulse
            </span>
          </div>

          {/* Auto-captured transactions */}
          <div className="space-y-2.5">
            {mockTransactions.map((tx) => (
              <div
                key={tx.label}
                className="flex items-center gap-3 rounded-lg border border-black/5 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-900/50 px-3 py-2.5"
              >
                <div
                  className={cn(
                    "size-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    tx.color
                  )}
                >
                  <tx.icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100 truncate">
                    {tx.label}
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {tx.category} &middot; {tx.time}
                  </p>
                </div>
                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 flex-shrink-0">
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-neutral-400 dark:text-neutral-500 italic">
            Transactions auto-categorised &amp; synced to your trip budget
          </p>
        </div>
      </UnifiedCard>
    </div>
  );
}
