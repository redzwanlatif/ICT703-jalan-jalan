"use client";  // To mark this as a Client Component

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, MapPin } from "lucide-react";

type TabBarProps = {
  totalCost?: number;
  memberCount?: number;
};

const TabBar = ({ totalCost, memberCount }: TabBarProps) => {
  const pathname = usePathname(); // Get the current path from the URL

  // Function to determine if the current tab is active
  const isActive = (tab: string) => {
    // Compare pathname with exact tab route
    if (tab === "dashboard") {
      return pathname === "/dashboard";
    }
    if (tab === "itenary") {
      return pathname === "/dashboard/itenary";
    }
    if (tab === "member") {
      return pathname === "/dashboard/member";
    }
    return false;
  };

  const costPerPerson = totalCost && memberCount ? totalCost / memberCount : 0;

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-[#AD46FF]/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 flex justify-between items-start">
        <nav className="flex items-center gap-14 mt-20 ">
          {/* Dashboard Tab */}
          <Link href="/dashboard" passHref legacyBehavior>
            <a className="flex flex-col items-center group min-w-[80px]">
              <span className={`flex items-center gap-2 font-semibold text-base md:text-lg transition-colors duration-200 ${isActive("dashboard") ? "text-[#AD46FF]" : "text-slate-600 group-hover:text-[#AD46FF]"}`}>
                <LayoutDashboard className={`size-5 ${isActive("dashboard") ? "text-[#AD46FF]" : "text-slate-500 group-hover:text-[#AD46FF]"}`} />
                Dashboard
              </span>
              <span className={`mt-2 h-1 w-full rounded-full transition-all duration-200 ${isActive("dashboard") ? "bg-[#AD46FF]" : "bg-transparent"}`}></span>
            </a>
          </Link>
          {/* Members Tab */}
          <Link href="/dashboard/member" passHref legacyBehavior>
            <a className="flex flex-col items-center group min-w-[80px]">
              <span className={`flex items-center gap-2 font-semibold text-base md:text-lg transition-colors duration-200 ${isActive("member") ? "text-[#AD46FF]" : "text-slate-600 group-hover:text-[#AD46FF]"}`}>
                <Users className={`size-5 ${isActive("member") ? "text-[#AD46FF]" : "text-slate-500 group-hover:text-[#AD46FF]"}`} />
                Members
              </span>
              <span className={`mt-2 h-1 w-full rounded-full transition-all duration-200 ${isActive("member") ? "bg-[#AD46FF]" : "bg-transparent"}`}></span>
            </a>
          </Link>
          {/* Itinerary Tab */}
          <Link href="/dashboard/itenary" passHref legacyBehavior>
            <a className="flex flex-col items-center group min-w-[80px]">
              <span className={`flex items-center gap-2 font-semibold text-base md:text-lg transition-colors duration-200 ${isActive("itenary") ? "text-[#AD46FF]" : "text-slate-600 group-hover:text-[#AD46FF]"}`}>
                <MapPin className={`size-5 ${isActive("itenary") ? "text-[#AD46FF]" : "text-slate-500 group-hover:text-[#AD46FF]"}`} />
                Itinerary
              </span>
              <span className={`mt-2 h-1 w-full rounded-full transition-all duration-200 ${isActive("itenary") ? "bg-[#AD46FF]" : "bg-transparent"}`}></span>
            </a>
          </Link>
        </nav>
        <div className="text-right py-5">
            <div className="text-sm text-gray-500">Total Trip Cost</div>
          <div className="text-2xl font-bold text-black-500 ">RM{totalCost ?? 1400}</div>
          <div className="text-sm text-gray-500">
            {costPerPerson > 0 ? `RM${costPerPerson.toFixed(0)} per person` : 'RM350 per person'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabBar;