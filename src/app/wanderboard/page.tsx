"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  Users,
  ChevronDown,
  MapPin,
  Sparkles,
  TrendingUp,
  Star,
} from "lucide-react";
import { DuoResponsiveLayout } from "@/components/shared";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DuoButton } from "@/components/shared/duo-wizard-layout";
import { cn } from "@/lib/utils";

const popularDestinations = [
  { name: "Langkawi", emoji: "🏝️", visitors: "2.4k" },
  { name: "Penang", emoji: "🍜", visitors: "3.1k" },
  { name: "Cameron Highlands", emoji: "🍓", visitors: "1.8k" },
  { name: "Melaka", emoji: "🏛️", visitors: "2.9k" },
];

const trendingSearches = [
  "Weekend getaway",
  "Beach resort",
  "Family friendly",
  "Budget trip",
];

export default function WanderboardLandingPage() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [pax, setPax] = useState<number | null>(null);
  const [showPaxDropdown, setShowPaxDropdown] = useState(false);

  const handleSearch = () => {
    router.push(
      `/dashboard?destination=${encodeURIComponent(destination)}&date=${date}&pax=${pax || 1}`
    );
  };

  const canSearch = destination.length > 0;

  return (
    <DuoResponsiveLayout>
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <DuoMascot mood="excited" size="lg" />
          </motion.div>

          <h1 className="text-3xl font-extrabold mt-6 mb-2">
            Get live data from
            <br />
            <span className="text-[var(--duo-green)]">your destination</span>
          </h1>
          <p className="text-muted-foreground">
            Real-time crowd levels, weather, and more
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="duo-card p-5 space-y-4"
        >
          {/* Destination Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-2">
              <MapPin className="w-4 h-4 text-[var(--duo-green)]" />
              Where to?
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search destination..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="duo-input !pl-12"
              />
            </div>
          </div>

          {/* Quick Destinations */}
          <div className="flex flex-wrap gap-2">
            {popularDestinations.map((dest) => (
              <button
                key={dest.name}
                onClick={() => setDestination(dest.name)}
                className={cn(
                  "px-3 py-1.5 rounded-full border-2 text-sm font-bold transition-all",
                  destination === dest.name
                    ? "border-[var(--duo-green)] bg-[var(--duo-green)]/10 text-[var(--duo-green)]"
                    : "border-border hover:border-[var(--duo-blue)]"
                )}
              >
                {dest.emoji} {dest.name}
              </button>
            ))}
          </div>

          {/* Date & Pax Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Date Picker */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold mb-2">
                <Calendar className="w-4 h-4 text-[var(--duo-blue)]" />
                When?
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="duo-input"
              />
            </div>

            {/* Pax Selector */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold mb-2">
                <Users className="w-4 h-4 text-[var(--duo-orange)]" />
                How many?
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowPaxDropdown(!showPaxDropdown)}
                  className="duo-input w-full flex items-center justify-between text-left"
                >
                  <span className={pax ? "text-foreground" : "text-muted-foreground"}>
                    {pax ? `${pax} ${pax === 1 ? "person" : "people"}` : "Select"}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      showPaxDropdown && "rotate-180"
                    )}
                  />
                </button>

                {showPaxDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-card border-2 border-border rounded-xl shadow-lg z-50 overflow-hidden"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          setPax(num);
                          setShowPaxDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-3 text-left text-sm font-semibold hover:bg-muted transition-colors",
                          pax === num && "bg-[var(--duo-green)]/10 text-[var(--duo-green)]"
                        )}
                      >
                        {num} {num === 1 ? "person" : "people"}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Search Button */}
          <DuoButton onClick={handleSearch} disabled={!canSearch} fullWidth size="lg">
            <Search className="w-5 h-5 mr-2" />
            Search Destination
          </DuoButton>
        </motion.div>

        {/* Trending Searches */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="flex items-center gap-2 font-bold text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            Trending Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((search) => (
              <button
                key={search}
                onClick={() => setDestination(search)}
                className="px-3 py-2 rounded-xl bg-muted text-sm font-semibold hover:bg-muted/80 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Popular Destinations Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="flex items-center gap-2 font-extrabold">
            <Star className="w-5 h-5 text-[var(--duo-yellow)]" />
            Popular Destinations
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {popularDestinations.map((dest, index) => (
              <motion.button
                key={dest.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                onClick={() => {
                  setDestination(dest.name);
                  handleSearch();
                }}
                className="duo-card duo-card-interactive p-4 text-left"
              >
                <span className="text-3xl mb-2 block">{dest.emoji}</span>
                <h4 className="font-bold">{dest.name}</h4>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {dest.visitors} this week
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* XP Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4"
        >
          <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
          <span>
            Earn <strong className="text-[var(--duo-green)]">+10 XP</strong> for
            checking live data!
          </span>
        </motion.div>
      </div>
    </DuoResponsiveLayout>
  );
}
