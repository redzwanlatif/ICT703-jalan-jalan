"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Sparkles, ChevronRight } from "lucide-react";
import { useTrip } from "@/contexts/trip-context";
import {
  DuoWizardLayout,
  DuoButton,
} from "@/components/shared/duo-wizard-layout";
import { DuoMascot } from "@/components/shared/duo-mascot";

const popularDestinations = [
  { name: "Langkawi", emoji: "🏝️" },
  { name: "Penang", emoji: "🍜" },
  { name: "Cameron Highlands", emoji: "🍓" },
  { name: "Tioman", emoji: "🐠" },
  { name: "Malacca", emoji: "🏛️" },
  { name: "Kuching", emoji: "🐱" },
];

export default function NewTripPage() {
  const router = useRouter();
  const { createTrip } = useTrip();
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [step, setStep] = useState<"name" | "destination" | "dates">("name");
  const [hasPrefilledData, setHasPrefilledData] = useState(false);

  // Load trip details from sessionStorage (from /predictions page)
  useEffect(() => {
    const stored = sessionStorage.getItem("tripDetails");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.destination) setDestination(data.destination);
        if (data.startDate) setStartDate(data.startDate);
        if (data.endDate) setEndDate(data.endDate);
        // Mark that we have prefilled data (destination and dates already set)
        if (data.destination && data.startDate && data.endDate) {
          setHasPrefilledData(true);
        }
      } catch (e) {
        console.error("Failed to parse trip details:", e);
      }
    }
  }, []);

  const handleNext = () => {
    if (step === "name" && tripName.trim()) {
      // If we have prefilled destination and dates, skip directly to creating trip
      if (hasPrefilledData && destination && startDate && endDate) {
        const trip = createTrip(tripName, destination, startDate, endDate);
        // Clear the sessionStorage after using the data
        sessionStorage.removeItem("tripDetails");
        router.push(`/trip/${trip.id}/members`);
      } else {
        setStep("destination");
      }
    } else if (step === "destination" && destination.trim()) {
      setStep("dates");
    } else if (step === "dates" && startDate && endDate) {
      const trip = createTrip(tripName, destination, startDate, endDate);
      // Clear the sessionStorage after using the data
      sessionStorage.removeItem("tripDetails");
      router.push(`/trip/${trip.id}/members`);
    }
  };

  const handleBack = () => {
    if (step === "destination") setStep("name");
    else if (step === "dates") setStep("destination");
  };

  const canProceed = () => {
    if (step === "name") return tripName.trim().length > 0;
    if (step === "destination") return destination.trim().length > 0;
    if (step === "dates") return startDate && endDate && new Date(endDate) >= new Date(startDate);
    return false;
  };

  return (
    <DuoWizardLayout
      title={
        step === "name" ? "Name your trip" :
        step === "destination" ? "Where to?" :
        "When are you going?"
      }
      subtitle={
        step === "name" ? "Give your group adventure a memorable name" :
        step === "destination" ? "Pick a destination for your group" :
        "Set your travel dates"
      }
      showProgress
      showBack={step !== "name"}
      showSkip={false}
      onBack={handleBack}
      mascot={
        <DuoMascot
          mood={step === "dates" ? "excited" : "encouraging"}
          size="md"
        />
      }
      footer={
        <DuoButton
          onClick={handleNext}
          disabled={!canProceed()}
          fullWidth
        >
          {step === "dates" || (step === "name" && hasPrefilledData) ? "Create Trip" : "Continue"}
          <ChevronRight className="w-5 h-5 ml-1" />
        </DuoButton>
      }
    >
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="w-full space-y-6"
      >
        {/* Step: Trip Name */}
        {step === "name" && (
          <div className="space-y-4">
            {/* Show prefilled trip details summary */}
            {hasPrefilledData && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="duo-card p-4"
                style={{
                  borderColor: "var(--duo-green)",
                  background: "color-mix(in srgb, var(--duo-green) 10%, var(--card))",
                }}
              >
                <p className="text-sm font-bold text-[var(--duo-green)] mb-2">Trip details saved!</p>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {destination}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            )}

            <div className="relative">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--duo-purple)]" />
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="e.g., Beach Weekend Getaway"
                className="duo-input !pl-12"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-semibold">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Weekend Escape",
                  "Birthday Trip",
                  "Team Bonding",
                  "Family Vacation",
                  "Friends Reunion",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setTripName(suggestion)}
                    className="px-3 py-1.5 rounded-full border-2 border-border text-sm font-semibold hover:border-[var(--duo-blue)] hover:text-[var(--duo-blue)] transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step: Destination */}
        {step === "destination" && (
          <div className="space-y-4">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--duo-green)]" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination..."
                className="duo-input !pl-12"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-semibold">Popular destinations:</p>
              <div className="grid grid-cols-2 gap-2">
                {popularDestinations.map((dest) => (
                  <button
                    key={dest.name}
                    onClick={() => setDestination(dest.name)}
                    className={`duo-card duo-card-interactive p-3 text-left ${
                      destination === dest.name ? "duo-card-green" : ""
                    }`}
                  >
                    <span className="text-2xl mr-2">{dest.emoji}</span>
                    <span className="font-bold">{dest.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step: Dates */}
        {step === "dates" && (
          <div className="space-y-4">
            <div className="duo-card p-4 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--duo-blue)]" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="duo-input !pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--duo-orange)]" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    className="duo-input !pl-12"
                  />
                </div>
              </div>
            </div>

            {startDate && endDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="duo-card p-4 text-center"
                style={{
                  borderColor: "var(--duo-green)",
                  background: "color-mix(in srgb, var(--duo-green) 10%, var(--card))",
                }}
              >
                <Users className="w-8 h-8 mx-auto mb-2 text-[var(--duo-green)]" />
                <p className="font-bold text-lg">
                  {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                </p>
                <p className="text-sm text-muted-foreground">
                  in {destination}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </DuoWizardLayout>
  );
}
