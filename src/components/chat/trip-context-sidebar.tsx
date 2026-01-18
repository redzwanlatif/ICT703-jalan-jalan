"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Users,
  ChevronDown,
  ChevronRight,
  Plus,
  Check,
  Plane,
  History,
  Bot,
  Wand2,
} from "lucide-react";
import { useTrip, TripPlan } from "@/contexts/trip-context";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface TripContextSidebarProps {
  selectedTripId: string | null;
  onSelectTrip: (tripId: string | null) => void;
  onStartAIPlanning?: () => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-MY", {
    month: "short",
    day: "numeric",
  });
}

function formatDateRange(startDate: string, endDate: string): string {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

function isUpcoming(trip: TripPlan): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(trip.startDate);
  return start >= today;
}

function isOngoing(trip: TripPlan): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  return start <= today && end >= today;
}

// ============================================================================
// Trip Card Component
// ============================================================================

interface TripCardProps {
  trip: TripPlan;
  isSelected: boolean;
  onSelect: () => void;
  badge?: "ongoing" | "upcoming";
}

function TripCard({ trip, isSelected, onSelect, badge }: TripCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left p-3 rounded-xl border-2 transition-all",
        isSelected
          ? "border-[var(--duo-green)] bg-[var(--duo-green)]/10"
          : "border-border hover:border-[var(--duo-blue)]/50 hover:bg-muted/50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--duo-blue)] shrink-0" />
            <span className="font-bold truncate">{trip.destination}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>{trip.members.length} {trip.members.length === 1 ? "member" : "members"}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {isSelected && (
            <div className="w-5 h-5 rounded-full bg-[var(--duo-green)] flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
          {badge === "ongoing" && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--duo-green)]/20 text-[var(--duo-green)]">
              NOW
            </span>
          )}
          {badge === "upcoming" && !isSelected && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--duo-blue)]/20 text-[var(--duo-blue)]">
              SOON
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ============================================================================
// Empty State Component
// ============================================================================

function EmptyState({ onStartAIPlanning }: { onStartAIPlanning?: () => void }) {
  return (
    <div className="text-center py-6">
      <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
        <Plane className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        No trips planned yet
      </p>
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Plan New Trip
        </p>
        <div className="grid grid-cols-2 gap-2">
          {onStartAIPlanning && (
            <button
              onClick={onStartAIPlanning}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-dashed border-border hover:border-[var(--duo-blue)] hover:bg-[var(--duo-blue)]/5 transition-all text-xs font-semibold text-muted-foreground hover:text-[var(--duo-blue)]"
            >
              <Bot className="w-5 h-5" />
              <span>AI Chat</span>
            </button>
          )}
          <Link
            href="/predictions"
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-dashed border-border hover:border-[var(--duo-green)] hover:bg-[var(--duo-green)]/5 transition-all text-xs font-semibold text-muted-foreground hover:text-[var(--duo-green)]",
              !onStartAIPlanning && "col-span-2"
            )}
          >
            <Wand2 className="w-5 h-5" />
            <span>Wizard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Trip Context Sidebar
// ============================================================================

export function TripContextSidebar({
  selectedTripId,
  onSelectTrip,
  onStartAIPlanning,
}: TripContextSidebarProps) {
  const { getAllTrips } = useTrip();
  const [showPastTrips, setShowPastTrips] = useState(false);

  const trips = getAllTrips();

  // Categorize trips
  const { ongoingTrips, upcomingTrips, pastTrips } = useMemo(() => {
    const ongoing: TripPlan[] = [];
    const upcoming: TripPlan[] = [];
    const past: TripPlan[] = [];

    trips.forEach((trip) => {
      if (isOngoing(trip)) {
        ongoing.push(trip);
      } else if (isUpcoming(trip)) {
        upcoming.push(trip);
      } else {
        past.push(trip);
      }
    });

    // Sort upcoming by start date (nearest first)
    upcoming.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    // Sort past by end date (most recent first)
    past.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

    return { ongoingTrips: ongoing, upcomingTrips: upcoming, pastTrips: past };
  }, [trips]);

  const selectedTrip = trips.find((t) => t.id === selectedTripId);

  const handleClearSelection = () => {
    onSelectTrip(null);
  };

  if (trips.length === 0) {
    return (
      <div className="duo-card p-4">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[var(--duo-blue)]" />
          Trip Context
        </h3>
        <EmptyState onStartAIPlanning={onStartAIPlanning} />
      </div>
    );
  }

  return (
    <div className="duo-card p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[var(--duo-blue)]" />
          Trip Context
        </h3>
        {selectedTrip && (
          <button
            onClick={handleClearSelection}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Current Selection */}
      {selectedTrip && (
        <div className="pb-3 border-b border-border">
          <p className="text-xs text-muted-foreground mb-2">Active context:</p>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--duo-green)]/10 border border-[var(--duo-green)]/30">
            <div className="w-2 h-2 rounded-full bg-[var(--duo-green)]" />
            <span className="font-bold text-sm text-[var(--duo-green)]">
              {selectedTrip.destination}
            </span>
          </div>
        </div>
      )}

      {/* Ongoing Trips */}
      {ongoingTrips.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Ongoing
          </p>
          <div className="space-y-2">
            {ongoingTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                isSelected={selectedTripId === trip.id}
                onSelect={() => onSelectTrip(trip.id)}
                badge="ongoing"
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Trips */}
      {upcomingTrips.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Upcoming
          </p>
          <div className="space-y-2">
            {upcomingTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                isSelected={selectedTripId === trip.id}
                onSelect={() => onSelectTrip(trip.id)}
                badge="upcoming"
              />
            ))}
          </div>
        </div>
      )}

      {/* Past Trips (Collapsible) */}
      {pastTrips.length > 0 && (
        <div>
          <button
            onClick={() => setShowPastTrips(!showPastTrips)}
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 hover:text-foreground transition-colors"
          >
            <History className="w-3 h-3" />
            Past Trips ({pastTrips.length})
            {showPastTrips ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
          <AnimatePresence>
            {showPastTrips && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2 overflow-hidden"
              >
                {pastTrips.slice(0, 5).map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    isSelected={selectedTripId === trip.id}
                    onSelect={() => onSelectTrip(trip.id)}
                  />
                ))}
                {pastTrips.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    +{pastTrips.length - 5} more trips
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Create New Trip Options */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Plan New Trip
        </p>
        <div className="grid grid-cols-2 gap-2">
          {/* AI Chat Option */}
          {onStartAIPlanning && (
            <button
              onClick={onStartAIPlanning}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-dashed border-border hover:border-[var(--duo-blue)] hover:bg-[var(--duo-blue)]/5 transition-all text-xs font-semibold text-muted-foreground hover:text-[var(--duo-blue)]"
            >
              <Bot className="w-5 h-5" />
              <span>AI Chat</span>
            </button>
          )}
          {/* Wizard Option */}
          <Link
            href="/predictions"
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-dashed border-border hover:border-[var(--duo-green)] hover:bg-[var(--duo-green)]/5 transition-all text-xs font-semibold text-muted-foreground hover:text-[var(--duo-green)]",
              !onStartAIPlanning && "col-span-2"
            )}
          >
            <Wand2 className="w-5 h-5" />
            <span>Wizard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
