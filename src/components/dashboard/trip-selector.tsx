"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Check,
  Clock,
  History,
  Plane,
  Plus,
  X,
  MapPin,
  Bot,
  Wand2,
} from "lucide-react";
import { useTrip, TripPlan } from "@/contexts/trip-context";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface DashboardTripSelectorProps {
  className?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.toLocaleDateString("en-MY", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-MY", { month: "short", day: "numeric" })}`;
}

export function getTripStatus(trip: TripPlan): "past" | "current" | "upcoming" {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);

  if (end < today) return "past";
  if (start <= today && end >= today) return "current";
  return "upcoming";
}

export function categorizeTripsByStatus(trips: TripPlan[]) {
  const past: TripPlan[] = [];
  const current: TripPlan[] = [];
  const upcoming: TripPlan[] = [];

  trips.forEach((trip) => {
    const status = getTripStatus(trip);
    if (status === "past") past.push(trip);
    else if (status === "current") current.push(trip);
    else upcoming.push(trip);
  });

  // Sort upcoming by start date (nearest first)
  upcoming.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  // Sort past by end date (most recent first)
  past.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

  return { past, current, upcoming };
}

// ============================================================================
// Hook for selected trip
// ============================================================================

export function useSelectedTrip() {
  const searchParams = useSearchParams();
  const { getAllTrips } = useTrip();

  const allTrips = getAllTrips();
  const { past, current, upcoming } = categorizeTripsByStatus(allTrips);

  // Get trip ID from URL or auto-select
  const tripIdFromUrl = searchParams.get("tripId");

  let selectedTripId = tripIdFromUrl;

  // Auto-select if no tripId in URL
  if (!selectedTripId && allTrips.length > 0) {
    if (current.length > 0) {
      selectedTripId = current[0].id;
    } else if (upcoming.length > 0) {
      selectedTripId = upcoming[0].id;
    } else if (past.length > 0) {
      selectedTripId = past[0].id;
    }
  }

  const selectedTrip = allTrips.find((t) => t.id === selectedTripId);

  return {
    selectedTrip,
    selectedTripId,
    allTrips,
    past,
    current,
    upcoming,
  };
}

// ============================================================================
// Trip Selector Component
// ============================================================================

export function DashboardTripSelector({ className }: DashboardTripSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showTripSelector, setShowTripSelector] = React.useState(false);

  const { selectedTrip, selectedTripId, allTrips, past, current, upcoming } = useSelectedTrip();

  const handleSelectTrip = (tripId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tripId", tripId);
    router.push(`?${params.toString()}`, { scroll: false });
    setShowTripSelector(false);
  };

  if (allTrips.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        <div className="duo-card p-4 text-center border-dashed">
          <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center mb-2">
            <Plane className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-bold text-sm">No trips yet</p>
          <p className="text-xs text-muted-foreground mb-3">Plan your first trip to see dashboard data</p>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/chat"
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-dashed border-border hover:border-[var(--duo-blue)] hover:bg-[var(--duo-blue)]/5 transition-all text-xs font-semibold text-muted-foreground hover:text-[var(--duo-blue)]"
            >
              <Bot className="w-5 h-5" />
              <span>AI Chat</span>
            </Link>
            <Link
              href="/predictions"
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-dashed border-border hover:border-[var(--duo-green)] hover:bg-[var(--duo-green)]/5 transition-all text-xs font-semibold text-muted-foreground hover:text-[var(--duo-green)]"
            >
              <Wand2 className="w-5 h-5" />
              <span>Wizard</span>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        <button
          onClick={() => setShowTripSelector(true)}
          className="w-full duo-card p-3 flex items-center justify-between hover:border-[var(--duo-blue)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              selectedTrip && getTripStatus(selectedTrip) === "current"
                ? "bg-[var(--duo-green)]/20"
                : selectedTrip && getTripStatus(selectedTrip) === "upcoming"
                ? "bg-[var(--duo-blue)]/20"
                : "bg-muted"
            )}>
              {selectedTrip && getTripStatus(selectedTrip) === "current" ? (
                <Plane className="w-5 h-5 text-[var(--duo-green)]" />
              ) : selectedTrip && getTripStatus(selectedTrip) === "upcoming" ? (
                <Clock className="w-5 h-5 text-[var(--duo-blue)]" />
              ) : (
                <History className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">
                  {selectedTrip ? selectedTrip.destination : "Select a Trip"}
                </span>
                {selectedTrip && (
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                    getTripStatus(selectedTrip) === "current"
                      ? "bg-[var(--duo-green)] text-white"
                      : getTripStatus(selectedTrip) === "upcoming"
                      ? "bg-[var(--duo-blue)] text-white"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {getTripStatus(selectedTrip)}
                  </span>
                )}
              </div>
              {selectedTrip && (
                <p className="text-xs text-muted-foreground">
                  {formatDateRange(selectedTrip.startDate, selectedTrip.endDate)} • {selectedTrip.members.length} {selectedTrip.members.length === 1 ? "member" : "members"}
                </p>
              )}
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </button>
      </motion.div>

      {/* Trip Selector Modal */}
      <AnimatePresence>
        {showTripSelector && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTripSelector(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-background rounded-2xl z-50 max-h-[80vh] overflow-hidden shadow-xl"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-bold">Select Trip</h3>
                <button
                  onClick={() => setShowTripSelector(false)}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(80vh-60px)] space-y-4">
                {/* Current Trips */}
                {current.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Plane className="w-3 h-3 text-[var(--duo-green)]" />
                      Currently Traveling
                    </p>
                    <div className="space-y-2">
                      {current.map((trip) => (
                        <button
                          key={trip.id}
                          onClick={() => handleSelectTrip(trip.id)}
                          className={cn(
                            "w-full text-left p-3 rounded-xl border-2 transition-all",
                            selectedTripId === trip.id
                              ? "border-[var(--duo-green)] bg-[var(--duo-green)]/10"
                              : "border-border hover:border-[var(--duo-green)]/50"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-sm">{trip.destination}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDateRange(trip.startDate, trip.endDate)} • {trip.members.length} members
                              </p>
                            </div>
                            {selectedTripId === trip.id && (
                              <div className="w-5 h-5 rounded-full bg-[var(--duo-green)] flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upcoming Trips */}
                {upcoming.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Clock className="w-3 h-3 text-[var(--duo-blue)]" />
                      Upcoming
                    </p>
                    <div className="space-y-2">
                      {upcoming.map((trip) => (
                        <button
                          key={trip.id}
                          onClick={() => handleSelectTrip(trip.id)}
                          className={cn(
                            "w-full text-left p-3 rounded-xl border-2 transition-all",
                            selectedTripId === trip.id
                              ? "border-[var(--duo-blue)] bg-[var(--duo-blue)]/10"
                              : "border-border hover:border-[var(--duo-blue)]/50"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-sm">{trip.destination}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDateRange(trip.startDate, trip.endDate)} • {trip.members.length} members
                              </p>
                            </div>
                            {selectedTripId === trip.id && (
                              <div className="w-5 h-5 rounded-full bg-[var(--duo-blue)] flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Past Trips */}
                {past.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
                      <History className="w-3 h-3" />
                      Past Trips
                    </p>
                    <div className="space-y-2">
                      {past.slice(0, 5).map((trip) => (
                        <button
                          key={trip.id}
                          onClick={() => handleSelectTrip(trip.id)}
                          className={cn(
                            "w-full text-left p-3 rounded-xl border-2 transition-all",
                            selectedTripId === trip.id
                              ? "border-[var(--duo-purple)] bg-[var(--duo-purple)]/10"
                              : "border-border hover:border-muted-foreground/50"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-sm">{trip.destination}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDateRange(trip.startDate, trip.endDate)} • {trip.members.length} members
                              </p>
                            </div>
                            {selectedTripId === trip.id && (
                              <div className="w-5 h-5 rounded-full bg-[var(--duo-purple)] flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                      {past.length > 5 && (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          +{past.length - 5} more past trips
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Create New Trip */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
                    Plan New Trip
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/chat"
                      onClick={() => setShowTripSelector(false)}
                      className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-dashed border-border hover:border-[var(--duo-blue)] hover:bg-[var(--duo-blue)]/5 transition-all text-xs font-semibold text-muted-foreground hover:text-[var(--duo-blue)]"
                    >
                      <Bot className="w-5 h-5" />
                      <span>AI Chat</span>
                    </Link>
                    <Link
                      href="/predictions"
                      onClick={() => setShowTripSelector(false)}
                      className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-dashed border-border hover:border-[var(--duo-green)] hover:bg-[var(--duo-green)]/5 transition-all text-xs font-semibold text-muted-foreground hover:text-[var(--duo-green)]"
                    >
                      <Wand2 className="w-5 h-5" />
                      <span>Wizard</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// Mockup Data Generator
// ============================================================================

export interface DayItinerary {
  location: string;
  description: string;
  activities: string[];
  cost: string;
  interests: string[];
}

export interface DashboardMockupData {
  budgetRange: string;
  budgetLow: number;
  budgetHigh: number;
  seasons: string;
  seasonCount: number;
  interests: string;
  interestCount: number;
  budgetFit: number;
  avgCost: number;
  destinations: Array<{
    title: string;
    description: string;
    matchLabel: string;
    cost: string;
    season: string;
    interests: string;
    alignmentPercent: number;
  }>;
  memberNames: string[];
  itinerary: {
    day1: DayItinerary;
    day2: DayItinerary;
    day3: DayItinerary;
  };
}

export function getMockupDataForDestination(destination: string): DashboardMockupData {
  const destinationData: Record<string, DashboardMockupData> = {
    "Penang": {
      budgetRange: "RM800 - RM1,500",
      budgetLow: 800,
      budgetHigh: 1500,
      seasons: "CNY, Thaipusam, Year-end",
      seasonCount: 3,
      interests: "Food, Culture, Heritage",
      interestCount: 6,
      budgetFit: 78,
      avgCost: 450,
      destinations: [
        { title: "Georgetown Heritage", description: "UNESCO World Heritage Site with street art and temples", matchLabel: "85% Match", cost: "RM600", season: "CNY", interests: "Culture, Food, Art", alignmentPercent: 85 },
        { title: "Penang Hill & Kek Lok Si", description: "Scenic hill with the largest Buddhist temple in Malaysia", matchLabel: "72% Match", cost: "RM400", season: "Year-end", interests: "Nature, Culture, Photography", alignmentPercent: 72 },
      ],
      memberNames: ["Sarah", "Ahmad", "Michelle", "Raj"],
      itinerary: {
        day1: { location: "Georgetown Heritage Walk", description: "Explore UNESCO World Heritage Site with iconic street art and historical temples", activities: ["Morning: Arrive in Penang, check into hotel in Georgetown.", "Afternoon: Street art walking tour through Armenian Street and Cannon Street.", "Evening: Dinner at Chulia Street, explore night food stalls."], cost: "RM300", interests: ["Culture", "Art", "Food"] },
        day2: { location: "Penang Hill & Kek Lok Si", description: "Visit the iconic hill station and Southeast Asia's largest Buddhist temple", activities: ["Morning: Take funicular train up Penang Hill, enjoy panoramic views.", "Afternoon: Visit Kek Lok Si Temple, explore the pagoda and gardens.", "Evening: Sunset at Gurney Drive, seafood dinner by the beach."], cost: "RM250", interests: ["Nature", "Culture", "Photography"] },
        day3: { location: "Batu Ferringhi & Departure", description: "Beach relaxation and last-minute shopping before departure", activities: ["Morning: Relax at Batu Ferringhi beach, optional water sports.", "Afternoon: Visit Tropical Spice Garden and Entopia butterfly farm.", "Evening: Night market shopping, depart Penang."], cost: "RM200", interests: ["Beach", "Nature", "Shopping"] },
      },
    },
    "Langkawi": {
      budgetRange: "RM1,200 - RM2,800",
      budgetLow: 1200,
      budgetHigh: 2800,
      seasons: "Dec-Mar, School holidays",
      seasonCount: 2,
      interests: "Beach, Nature, Adventure",
      interestCount: 5,
      budgetFit: 65,
      avgCost: 800,
      destinations: [
        { title: "Pantai Cenang Beach", description: "Famous beach strip with water sports and nightlife", matchLabel: "90% Match", cost: "RM500", season: "Dec-Mar", interests: "Beach, Nightlife, Water Sports", alignmentPercent: 90 },
        { title: "Sky Bridge & Cable Car", description: "Iconic curved bridge with panoramic island views", matchLabel: "78% Match", cost: "RM200", season: "Any", interests: "Adventure, Photography, Nature", alignmentPercent: 78 },
      ],
      memberNames: ["David", "Fatimah", "Jason", "Priya"],
      itinerary: {
        day1: { location: "Pantai Cenang & Beach Activities", description: "Arrive and enjoy the famous beach strip with water sports", activities: ["Morning: Arrive in Langkawi, transfer to Pantai Cenang resort.", "Afternoon: Jet ski, parasailing, or banana boat rides.", "Evening: Sunset beach walk, dinner at beachfront restaurant."], cost: "RM450", interests: ["Beach", "Adventure", "Water Sports"] },
        day2: { location: "Sky Bridge & Cable Car", description: "Experience the iconic curved bridge and panoramic island views", activities: ["Morning: Cable car ride to Mat Cincang mountain peak.", "Afternoon: Walk across Sky Bridge, SkyDome & SkyRex experience.", "Evening: Explore Langkawi Night Market (Pasar Malam)."], cost: "RM300", interests: ["Adventure", "Nature", "Photography"] },
        day3: { location: "Island Hopping & Departure", description: "Explore nearby islands and mangrove tours", activities: ["Morning: Island hopping tour - Pulau Dayang Bunting, Pulau Singa Besar.", "Afternoon: Kilim Geoforest Park mangrove tour, eagle feeding.", "Evening: Last minute duty-free shopping, depart Langkawi."], cost: "RM350", interests: ["Nature", "Wildlife", "Shopping"] },
      },
    },
    "Cameron Highlands": {
      budgetRange: "RM600 - RM1,200",
      budgetLow: 600,
      budgetHigh: 1200,
      seasons: "Year-round, School holidays",
      seasonCount: 2,
      interests: "Nature, Tea, Cool Weather",
      interestCount: 4,
      budgetFit: 88,
      avgCost: 350,
      destinations: [
        { title: "BOH Tea Plantation", description: "Scenic tea gardens with cafe and stunning views", matchLabel: "92% Match", cost: "RM100", season: "Any", interests: "Nature, Photography, Relaxation", alignmentPercent: 92 },
        { title: "Mossy Forest", description: "Ancient cloud forest with unique flora", matchLabel: "80% Match", cost: "RM150", season: "Dry season", interests: "Nature, Adventure, Hiking", alignmentPercent: 80 },
      ],
      memberNames: ["Wei Ling", "Kumar", "Aisyah", "Brandon"],
      itinerary: {
        day1: { location: "BOH Tea Plantation & Strawberry Farms", description: "Explore the famous tea gardens and pick fresh strawberries", activities: ["Morning: Drive up to Cameron Highlands, enjoy cool mountain air.", "Afternoon: Visit BOH Tea Plantation, tea tasting session.", "Evening: Check into resort, steamboat dinner in cool weather."], cost: "RM200", interests: ["Nature", "Food", "Relaxation"] },
        day2: { location: "Mossy Forest & Brinchang", description: "Trek through ancient cloud forest and explore the town", activities: ["Morning: Guided trek through Mossy Forest, see unique flora.", "Afternoon: Visit Brinchang town, Time Tunnel museum.", "Evening: Pasar Malam night market, local snacks and crafts."], cost: "RM180", interests: ["Nature", "Adventure", "Culture"] },
        day3: { location: "Lavender Garden & Departure", description: "Visit flower gardens and fresh markets before departing", activities: ["Morning: Lavender Garden and butterfly farm visit.", "Afternoon: Fresh vegetable market, stock up on local produce.", "Evening: Scenic drive back, depart Cameron Highlands."], cost: "RM120", interests: ["Nature", "Photography", "Shopping"] },
      },
    },
    "Melaka": {
      budgetRange: "RM500 - RM1,000",
      budgetLow: 500,
      budgetHigh: 1000,
      seasons: "Raya, CNY, Weekends",
      seasonCount: 3,
      interests: "History, Food, Culture",
      interestCount: 7,
      budgetFit: 82,
      avgCost: 300,
      destinations: [
        { title: "Jonker Street Night Market", description: "Vibrant night market with antiques and street food", matchLabel: "88% Match", cost: "RM200", season: "Weekends", interests: "Food, Shopping, Culture", alignmentPercent: 88 },
        { title: "A Famosa & Dutch Square", description: "Historic Portuguese fortress and colonial buildings", matchLabel: "75% Match", cost: "RM100", season: "Any", interests: "History, Photography, Culture", alignmentPercent: 75 },
      ],
      memberNames: ["Mei Ling", "Hafiz", "Rachel", "Suresh"],
      itinerary: {
        day1: { location: "Dutch Square & A Famosa", description: "Explore UNESCO World Heritage colonial architecture", activities: ["Morning: Arrive in Melaka, check into Jonker Street hotel.", "Afternoon: A Famosa fortress, St. Paul's Hill, Stadthuys.", "Evening: Dinner at Jonker Street, try chicken rice balls."], cost: "RM180", interests: ["History", "Culture", "Food"] },
        day2: { location: "Jonker Street & River Cruise", description: "Night market and scenic Melaka River experience", activities: ["Morning: Baba Nyonya Heritage Museum, Peranakan culture.", "Afternoon: Melaka River cruise, see murals and bridges.", "Evening: Jonker Street Night Market, antiques and street food."], cost: "RM200", interests: ["Culture", "Shopping", "Food"] },
        day3: { location: "Portuguese Settlement & Departure", description: "Visit Portuguese village and seafood before departing", activities: ["Morning: Portuguese Settlement, sample Portuguese-Eurasian food.", "Afternoon: Mahkota Parade shopping mall, last-minute souvenirs.", "Evening: Depart Melaka with satay celup takeaway."], cost: "RM150", interests: ["Food", "Culture", "Shopping"] },
      },
    },
    "Kuala Lumpur": {
      budgetRange: "RM1,000 - RM2,500",
      budgetLow: 1000,
      budgetHigh: 2500,
      seasons: "Year-round, Merdeka, NYE",
      seasonCount: 4,
      interests: "Shopping, Food, Nightlife",
      interestCount: 9,
      budgetFit: 55,
      avgCost: 600,
      destinations: [
        { title: "KLCC & Petronas Towers", description: "Iconic twin towers with shopping and park", matchLabel: "82% Match", cost: "RM400", season: "Any", interests: "Shopping, Photography, Dining", alignmentPercent: 82 },
        { title: "Batu Caves", description: "Hindu temple in limestone caves with 272 steps", matchLabel: "70% Match", cost: "RM50", season: "Thaipusam", interests: "Culture, Adventure, Photography", alignmentPercent: 70 },
      ],
      memberNames: ["Jennifer", "Amir", "Chong Wei", "Lakshmi"],
      itinerary: {
        day1: { location: "KLCC & Petronas Towers", description: "Explore the iconic twin towers and Bukit Bintang shopping", activities: ["Morning: Arrive in KL, check into Bukit Bintang hotel.", "Afternoon: KLCC mall, Petronas Towers skybridge visit.", "Evening: Dinner at Jalan Alor food street, explore nightlife."], cost: "RM400", interests: ["Shopping", "Photography", "Food"] },
        day2: { location: "Batu Caves & Cultural Sites", description: "Hindu temple and cultural heritage exploration", activities: ["Morning: Batu Caves, climb 272 steps to temple.", "Afternoon: Central Market for handicrafts, Chinatown Petaling Street.", "Evening: KL Tower observation deck, revolving restaurant dinner."], cost: "RM250", interests: ["Culture", "Adventure", "Shopping"] },
        day3: { location: "Sunway Lagoon & Departure", description: "Theme park fun and last-minute shopping", activities: ["Morning: Sunway Lagoon water park and theme park.", "Afternoon: Sunway Pyramid mall, ice skating rink.", "Evening: Premium outlet shopping, depart Kuala Lumpur."], cost: "RM350", interests: ["Adventure", "Shopping", "Entertainment"] },
      },
    },
  };

  // Default data if destination not found
  const defaultData: DashboardMockupData = {
    budgetRange: "RM1,000 - RM2,000",
    budgetLow: 1000,
    budgetHigh: 2000,
    seasons: "School holidays, Festive",
    seasonCount: 3,
    interests: "Beach, Food, Culture",
    interestCount: 5,
    budgetFit: 70,
    avgCost: 500,
    destinations: [
      { title: "Local Attraction 1", description: "Popular tourist destination", matchLabel: "75% Match", cost: "RM400", season: "Any", interests: "Culture, Food", alignmentPercent: 75 },
      { title: "Local Attraction 2", description: "Must-visit spot", matchLabel: "65% Match", cost: "RM300", season: "Any", interests: "Nature, Adventure", alignmentPercent: 65 },
    ],
    memberNames: ["Member 1", "Member 2", "Member 3", "Member 4"],
    itinerary: {
      day1: { location: "Arrival & City Exploration", description: "Arrive and explore the main city attractions", activities: ["Morning: Arrive at destination, check into hotel.", "Afternoon: Visit main tourist attractions.", "Evening: Dinner at local restaurant, explore night scene."], cost: "RM350", interests: ["Culture", "Food", "Sightseeing"] },
      day2: { location: "Day Trip & Activities", description: "Full day of activities and exploration", activities: ["Morning: Day trip to nearby attraction.", "Afternoon: Lunch at local eatery, continue sightseeing.", "Evening: Shopping and local market exploration."], cost: "RM300", interests: ["Adventure", "Nature", "Shopping"] },
      day3: { location: "Leisure & Departure", description: "Relaxation and departure preparations", activities: ["Morning: Leisurely breakfast, last-minute sightseeing.", "Afternoon: Souvenir shopping, pack for departure.", "Evening: Depart destination."], cost: "RM200", interests: ["Shopping", "Relaxation"] },
    },
  };

  return destinationData[destination] || defaultData;
}
