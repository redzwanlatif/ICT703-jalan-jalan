"use client";  // To mark this as a Client Component

import { useState } from "react";
import { usePathname } from "next/navigation";  // Hook to get the current pathname
import Link from "next/link";

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
    <div className="sticky top-0 z-10 bg-white shadow-md py-4 px-6 flex justify-between items-center border-b border-gray-200">
      <div className="flex items-center space-x-6">
        {/* Dashboard Tab */}
        <Link href="/dashboard" passHref>
          <span
            className={`cursor-pointer text-lg font-semibold ${isActive("dashboard") ? "text-blue-700" : "text-gray-600"
              }`}
          >
            Dashboard
          </span>
        </Link>

        {/* Members Tab */}
        <Link href="/dashboard/member" passHref>
          <span
            className={`cursor-pointer text-lg font-semibold ${isActive("member") ? "text-blue-700" : "text-gray-600"
              }`}
          >
            Members
          </span>
        </Link>

        {/* Itinerary Tab */}
        <Link href="/dashboard/itenary" passHref>
          <span
            className={`cursor-pointer text-lg font-semibold ${isActive("itenary") ? "text-blue-700" : "text-gray-600"
              }`}
          >
            Itinerary
          </span>
        </Link>
      </div>
      <div className="text-right">
        <div className="text-xl text-blue-800">Total Trip Cost: RM{totalCost ?? 1400}</div>
        <div className="text-sm text-gray-500">
          {costPerPerson > 0 ? `RM${costPerPerson.toFixed(0)} per person` : 'RM350 per person'}
        </div>
      </div>
    </div>
  );
};

export default TabBar;