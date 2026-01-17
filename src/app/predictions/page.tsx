"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Minus,
  Plus,
  ChevronRight,
  UsersRound,
} from "lucide-react";
import { DuoAppShell } from "@/components/shared/duo-bottom-nav";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DuoButton } from "@/components/shared/duo-wizard-layout";
import { useGamification } from "@/contexts/gamification-context";
import { cn } from "@/lib/utils";

const popularDestinations = [
  { name: "Langkawi", emoji: "🏝️" },
  { name: "Penang", emoji: "🍜" },
  { name: "Cameron Highlands", emoji: "🍓" },
  { name: "Tioman", emoji: "🐠" },
  { name: "Malacca", emoji: "🏛️" },
  { name: "Kuching", emoji: "🐱" },
];

export default function PredictionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addXp } = useGamification();

  const initialDestination = searchParams.get("destination") || "";

  const [destination, setDestination] = useState(initialDestination);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(1);

  const canContinue = destination && startDate && endDate;

  const handleContinue = () => {
    // Save trip details to sessionStorage for both flows
    sessionStorage.setItem("tripDetails", JSON.stringify({
      destination,
      startDate,
      endDate,
      travelers
    }));

    if (travelers > 1) {
      // Multiple travelers - go to group trip wizard
      router.push("/trip/new");
    } else {
      // Solo traveler - continue with regular flow
      addXp(10, "Started planning!");
      router.push("/predictions/preferences");
    }
  };

  return (
    <DuoAppShell>
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <DuoMascot mood="excited" size="sm" />
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">Plan Your Trip</h1>
            <p className="text-muted-foreground">Where to next, explorer?</p>
          </div>
        </motion.div>

        {/* Destination */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <label className="flex items-center gap-2 font-bold">
            <div className="w-8 h-8 rounded-lg bg-[var(--duo-green)]/20 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[var(--duo-green)]" />
            </div>
            Where are you going?
          </label>

          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination..."
              className="duo-input !pl-12"
            />
          </div>

          {/* Quick destinations */}
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
        </motion.div>

        {/* Dates */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <label className="flex items-center gap-2 font-bold">
            <div className="w-8 h-8 rounded-lg bg-[var(--duo-blue)]/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[var(--duo-blue)]" />
            </div>
            When are you traveling?
          </label>

          <div className="duo-card p-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="duo-input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split("T")[0]}
                className="duo-input"
              />
            </div>
          </div>
        </motion.div>

        {/* Travelers */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <label className="flex items-center gap-2 font-bold">
            <div className="w-8 h-8 rounded-lg bg-[var(--duo-orange)]/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-[var(--duo-orange)]" />
            </div>
            How many travelers?
          </label>

          <div className="duo-card p-6">
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setTravelers(Math.max(1, travelers - 1))}
                className="w-14 h-14 rounded-full border-2 border-border flex items-center justify-center hover:border-[var(--duo-blue)] transition-colors"
                style={{ boxShadow: "0 4px 0 var(--border)" }}
              >
                <Minus className="w-6 h-6" />
              </button>

              <div className="text-center">
                <span className="text-5xl font-extrabold">{travelers}</span>
                <p className="text-sm text-muted-foreground">
                  {travelers === 1 ? "traveler" : "travelers"}
                </p>
              </div>

              <button
                onClick={() => setTravelers(travelers + 1)}
                className="w-14 h-14 rounded-full border-2 border-border flex items-center justify-center hover:border-[var(--duo-blue)] transition-colors"
                style={{ boxShadow: "0 4px 0 var(--border)" }}
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Group trip hint */}
          {travelers > 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="duo-card p-4 flex items-center gap-3"
              style={{
                borderColor: "var(--duo-purple)",
                background: "color-mix(in srgb, var(--duo-purple) 10%, var(--card))",
              }}
            >
              <UsersRound className="w-6 h-6 text-[var(--duo-purple)] shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-sm">Group trip detected!</p>
                <p className="text-xs text-muted-foreground">
                  You&apos;ll set up a group trip where everyone can add their preferences.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Trip Summary */}
        {destination && startDate && endDate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="duo-card p-4"
            style={{
              background: "linear-gradient(135deg, var(--duo-green) 0%, var(--duo-green-dark) 100%)",
              borderColor: "var(--duo-green-dark)",
            }}
          >
            <div className="text-white">
              <h3 className="font-extrabold text-lg mb-2">Trip Summary</h3>
              <div className="space-y-1 text-white/90">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {destination}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                </p>
                <p className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {travelers} {travelers === 1 ? "person" : "people"}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 pt-4"
        >
          <DuoButton
            onClick={handleContinue}
            disabled={!canContinue}
            fullWidth
            size="lg"
          >
            {travelers > 1 ? (
              <>
                <UsersRound className="w-5 h-5 mr-2" />
                Set Up Group Trip
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-5 h-5 ml-1" />
              </>
            )}
          </DuoButton>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>Earn 25+ XP by planning a trip!</span>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-4 text-sm"
        >
          <Link
            href="/chat"
            className="text-[var(--duo-blue)] hover:underline font-semibold"
          >
            Need help? Chat with AI →
          </Link>
        </motion.div>
      </div>
    </DuoAppShell>
  );
}
