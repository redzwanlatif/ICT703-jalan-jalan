"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  MapPin,
  Wallet,
  CalendarDays,
} from "lucide-react";

type TripData = {
  trip_details?: {
    destination?: string;
    start_date?: string;
    end_date?: string;
  };
  travelers?: any[];
};

const formatDateShort = (iso?: string) => {
  if (!iso) return "";
  // "2026-02-03" -> "3 Feb"
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

const dayDiffInclusive = (start?: string, end?: string) => {
  if (!start || !end) return 0;
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 0;
  const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  return diff + 1; // inclusive
};

const TabBar = () => {
  const pathname = usePathname();
  const [data, setData] = React.useState<TripData | null>(null);

  React.useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/data", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch /api/data");
        const json = (await res.json()) as TripData;
        setData(json);
      } catch (e) {
        console.error(e);
        setData(null);
      }
    };
    run();
  }, []);

  const travelers = Array.isArray(data?.travelers) ? data!.travelers : [];
  const memberCount = travelers.length;

  // Budget per person from travelers budget range average (same approach you used)
  const avgBudgetPerPerson =
    memberCount > 0
      ? travelers.reduce((sum: number, t: any) => {
          const min = Number(t?.preferences?.budgetMin ?? 0);
          const max = Number(t?.preferences?.budgetMax ?? 0);
          return sum + (min + max) / 2;
        }, 0) / memberCount
      : 0;

  const destination = data?.trip_details?.destination || "—";
  const startDate = data?.trip_details?.start_date || "";
  const endDate = data?.trip_details?.end_date || "";
  const durationDays = dayDiffInclusive(startDate, endDate);

  const isActive = (tab: "dashboard" | "itenary" | "member") => {
    if (tab === "dashboard") return pathname === "/dashboard";
    if (tab === "itenary") return pathname === "/dashboard/itenary";
    if (tab === "member") return pathname === "/dashboard/member";
    return false;
  };

  const TabLink = ({
    href,
    active,
    label,
    icon,
  }: {
    href: string;
    active: boolean;
    label: string;
    icon: React.ReactNode;
  }) => (
    <Link href={href} className="flex flex-col items-center group min-w-[90px]">
      <span
        className={
          "flex items-center gap-2 font-semibold text-base md:text-lg transition-colors duration-200 " +
          (active
            ? "text-[#AD46FF]"
            : "text-slate-600 group-hover:text-[#AD46FF]")
        }
      >
        <span
          className={
            "transition-colors duration-200 " +
            (active
              ? "text-[#AD46FF]"
              : "text-slate-500 group-hover:text-[#AD46FF]")
          }
        >
          {icon}
        </span>
        {label}
      </span>
      <span
        className={
          "mt-2 h-1 w-full rounded-full transition-all duration-200 " +
          (active ? "bg-[#AD46FF]" : "bg-transparent")
        }
      />
    </Link>
  );

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-[#AD46FF]/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 flex justify-between items-center">
        <nav className="flex items-center gap-14 py-5">
          <TabLink
            href="/dashboard"
            active={isActive("dashboard")}
            label="Main"
            icon={<LayoutDashboard className="size-5" />}
          />

          <TabLink
            href="/dashboard/member"
            active={isActive("member")}
            label="Members"
            icon={<Users className="size-5" />}
          />

          <TabLink
            href="/dashboard/itenary"
            active={isActive("itenary")}
            label="Itinerary"
            icon={<MapPin className="size-5" />}
          />
        </nav>

        {/* ✅ Compact, important trip summary (from JSON) */}
        <div className="flex items-center gap-4 py-4">
          {/* Destination + dates */}
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <CalendarDays className="size-4 text-slate-600" />
            <div className="leading-tight">
              <div className="text-xs text-slate-500">Trip</div>
              <div className="text-sm font-semibold text-slate-900">
                {destination}
                {startDate && endDate ? (
                  <span className="text-slate-600 font-medium">
                    {" "}
                    · {formatDateShort(startDate)}–{formatDateShort(endDate)}
                    {durationDays ? ` (${durationDays}d)` : ""}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Members count */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <Users className="size-4 text-slate-600" />
            <div className="leading-tight">
              <div className="text-xs text-slate-500">Members</div>
              <div className="text-sm font-semibold text-slate-900">
                {memberCount || 0}
              </div>
            </div>
          </div>

          {/* Avg budget per person */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <Wallet className="size-4 text-slate-600" />
            <div className="leading-tight text-right">
              <div className="text-xs text-slate-500">Avg Budget / Person</div>
              <div className="text-sm font-semibold text-slate-900">
                {avgBudgetPerPerson > 0
                  ? "RM" + Math.round(avgBudgetPerPerson).toLocaleString()
                  : "—"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabBar;
