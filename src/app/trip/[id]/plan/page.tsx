"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Wallet,
  Sun,
  Coffee,
  Utensils,
  Moon,
  Check,
  Share2,
  Download,
  ChevronRight,
  Sparkles,
  Home as HomeIcon,
  Clock,
  Star,
} from "lucide-react";
import { useTrip, type TripMember } from "@/contexts/trip-context";
import { useGamification } from "@/contexts/gamification-context";
import { DuoAppShell } from "@/components/shared/duo-bottom-nav";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DuoButton } from "@/components/shared/duo-wizard-layout";
import { cn } from "@/lib/utils";

// Mock itinerary generator based on preferences
const generateItinerary = (
  destination: string,
  startDate: string,
  endDate: string,
  pacing: string,
  activities: string[],
  budget: number,
  members: TripMember[]
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const activityTemplates: Record<string, string[]> = {
    adventure: ["Hiking trail", "Kayaking", "Zipline adventure", "ATV tour", "Snorkeling"],
    culture: ["Museum visit", "Heritage walk", "Traditional crafts workshop", "Temple tour", "Local market"],
    nature: ["Nature reserve", "Waterfall hike", "Bird watching", "Botanical garden", "Beach walk"],
    food: ["Street food tour", "Cooking class", "Local restaurant", "Night market", "Food festival"],
    relaxation: ["Spa treatment", "Beach day", "Pool time", "Sunset viewing", "Meditation session"],
    nightlife: ["Night market", "Live music venue", "Rooftop bar", "Night cruise", "Beach party"],
    shopping: ["Local market", "Souvenir shops", "Shopping mall", "Handicraft village", "Outlet stores"],
  };

  // Helper to find which members like a specific activity type
  const getMembersSuitableFor = (activityType: string): TripMember[] => {
    return members.filter(
      (m) => m.preferences?.activities.includes(activityType as any) ?? false
    );
  };

  const itinerary = [];
  const activitiesPerDay = pacing === "relaxed" ? 2 : pacing === "packed" ? 5 : 3;

  for (let d = 0; d < days; d++) {
    const date = new Date(start);
    date.setDate(date.getDate() + d);

    const dayActivities = [];
    const shuffledActivities = [...activities].sort(() => Math.random() - 0.5);

    for (let a = 0; a < activitiesPerDay; a++) {
      const activityType = shuffledActivities[a % shuffledActivities.length];
      const templates = activityTemplates[activityType] || ["Free time"];
      const template = templates[Math.floor(Math.random() * templates.length)];
      const suitableMembers = getMembersSuitableFor(activityType);

      dayActivities.push({
        id: `${d}-${a}`,
        time: a === 0 ? "Morning" : a === 1 ? "Midday" : a === 2 ? "Afternoon" : a === 3 ? "Evening" : "Night",
        title: template,
        type: activityType,
        cost: Math.round((budget / activitiesPerDay) * (0.5 + Math.random() * 0.5)),
        duration: "1-2 hours",
        suitableFor: suitableMembers,
      });
    }

    itinerary.push({
      day: d + 1,
      date: date.toISOString().split("T")[0],
      activities: dayActivities,
    });
  }

  return itinerary;
};

const timeIcons: Record<string, React.ElementType> = {
  Morning: Coffee,
  Midday: Sun,
  Afternoon: Sun,
  Evening: Moon,
  Night: Moon,
};

export default function PlanPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;

  const { currentTrip, loadTrip, updateTrip } = useTrip();
  const { addXp } = useGamification();

  const [itinerary, setItinerary] = useState<ReturnType<typeof generateItinerary>>([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (!currentTrip || currentTrip.id !== tripId) {
      const loaded = loadTrip(tripId);
      if (!loaded) {
        router.replace("/trip/new");
        return;
      }
    }
  }, [tripId, currentTrip, loadTrip, router]);

  useEffect(() => {
    if (currentTrip?.aggregatedPreferences) {
      const generated = generateItinerary(
        currentTrip.destination,
        currentTrip.startDate,
        currentTrip.endDate,
        currentTrip.aggregatedPreferences.preferredPacing,
        currentTrip.aggregatedPreferences.topActivities,
        currentTrip.aggregatedPreferences.budgetRange.average,
        currentTrip.members
      );
      setItinerary(generated);
    }
  }, [currentTrip]);

  const handleConfirmTrip = () => {
    updateTrip({ status: "confirmed" });
    addXp(50, "Trip confirmed!");
    setShowConfirmModal(false);
    router.push("/");
  };

  if (!currentTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <DuoMascot mood="thinking" size="lg" />
      </div>
    );
  }

  const totalCost = itinerary.reduce(
    (sum, day) => sum + day.activities.reduce((daySum, act) => daySum + act.cost, 0),
    0
  );

  return (
    <DuoAppShell showTopBar showBottomNav>
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <DuoMascot mood="excited" size="sm" />
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">{currentTrip.name}</h1>
            <p className="text-muted-foreground flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {currentTrip.destination}
            </p>
          </div>
        </motion.div>

        {/* Trip Overview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="duo-card p-4"
          style={{
            background: "linear-gradient(135deg, var(--duo-green) 0%, var(--duo-green-dark) 100%)",
            borderColor: "var(--duo-green-dark)",
          }}
        >
          <div className="grid grid-cols-3 gap-4 text-white text-center">
            <div>
              <Calendar className="w-6 h-6 mx-auto mb-1 opacity-80" />
              <p className="text-sm opacity-80">Duration</p>
              <p className="font-bold">{itinerary.length} days</p>
            </div>
            <div>
              <Users className="w-6 h-6 mx-auto mb-1 opacity-80" />
              <p className="text-sm opacity-80">Group</p>
              <p className="font-bold">{currentTrip.members.length} people</p>
            </div>
            <div>
              <Wallet className="w-6 h-6 mx-auto mb-1 opacity-80" />
              <p className="text-sm opacity-80">Est. Total</p>
              <p className="font-bold">RM {totalCost}</p>
            </div>
          </div>
        </motion.div>

        {/* Day Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide"
        >
          {itinerary.map((day, index) => (
            <button
              key={day.day}
              onClick={() => setSelectedDay(index)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-2xl font-bold transition-all",
                selectedDay === index
                  ? "bg-[var(--duo-blue)] text-white"
                  : "bg-muted hover:bg-muted/80"
              )}
              style={{
                boxShadow: selectedDay === index
                  ? "0 4px 0 var(--duo-blue-dark)"
                  : "0 4px 0 var(--border)",
              }}
            >
              <span className="block text-xs opacity-80">Day {day.day}</span>
              <span>
                {new Date(day.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Selected Day Itinerary */}
        {itinerary[selectedDay] && (
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            <h2 className="font-extrabold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[var(--duo-blue)]" />
              Day {itinerary[selectedDay].day} Schedule
            </h2>

            {itinerary[selectedDay].activities.map((activity, index) => {
              const TimeIcon = timeIcons[activity.time] || Sun;
              const suitableMembers = activity.suitableFor || [];
              const allMembersCount = currentTrip.members.length;
              const isSuitableForAll = suitableMembers.length === allMembersCount;

              // Find members NOT suitable for this activity
              const notSuitableMembers = currentTrip.members.filter(
                (m) => !suitableMembers.some((sm) => sm.id === m.id)
              );

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="duo-card p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--duo-blue)]/10 flex items-center justify-center shrink-0">
                      <TimeIcon className="w-5 h-5 text-[var(--duo-blue)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-muted-foreground uppercase">
                          {activity.time}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                          {activity.type}
                        </span>
                      </div>
                      <h3 className="font-bold">{activity.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Wallet className="w-3 h-3" />
                          ~RM {activity.cost}/person
                        </span>
                      </div>

                      {/* Member Suitability Section */}
                      <div className="mt-3 pt-3 border-t border-border space-y-2">
                        {/* Suitable For */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">Suitable for:</span>
                          {isSuitableForAll ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--duo-green)] bg-[var(--duo-green)]/10 px-2 py-0.5 rounded-full">
                              <Users className="w-3 h-3" />
                              Everyone
                            </span>
                          ) : suitableMembers.length > 0 ? (
                            <div className="flex items-center gap-1">
                              <div className="flex -space-x-1.5">
                                {suitableMembers.slice(0, 4).map((member) => (
                                  <div
                                    key={member.id}
                                    className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--duo-green)] to-[var(--duo-green-dark)] flex items-center justify-center text-white text-[10px] font-bold border-2 border-card"
                                    title={member.name}
                                  >
                                    {member.name.charAt(0).toUpperCase()}
                                  </div>
                                ))}
                                {suitableMembers.length > 4 && (
                                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold border-2 border-card">
                                    +{suitableMembers.length - 4}
                                  </div>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground ml-1">
                                {suitableMembers.map((m) => m.name === "You" ? "You" : m.name).join(", ")}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              General activity
                            </span>
                          )}
                        </div>

                        {/* Might Not Be Suitable For */}
                        {notSuitableMembers.length > 0 && !isSuitableForAll && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-muted-foreground">Might not suit:</span>
                            <div className="flex items-center gap-1">
                              <div className="flex -space-x-1.5">
                                {notSuitableMembers.slice(0, 4).map((member) => (
                                  <div
                                    key={member.id}
                                    className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--duo-orange)] to-[var(--duo-red)] flex items-center justify-center text-white text-[10px] font-bold border-2 border-card"
                                    title={member.name}
                                  >
                                    {member.name.charAt(0).toUpperCase()}
                                  </div>
                                ))}
                                {notSuitableMembers.length > 4 && (
                                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold border-2 border-card">
                                    +{notSuitableMembers.length - 4}
                                  </div>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground ml-1">
                                {notSuitableMembers.map((m) => m.name === "You" ? "You" : m.name).join(", ")}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 pt-4"
        >
          <DuoButton onClick={() => setShowConfirmModal(true)} fullWidth size="lg">
            <Check className="w-5 h-5 mr-2" />
            Confirm This Trip
          </DuoButton>

          <div className="flex gap-3">
            <button className="flex-1 duo-btn duo-btn-outline">
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </button>
            <button className="flex-1 duo-btn duo-btn-outline">
              <Download className="w-5 h-5 mr-2" />
              Export
            </button>
          </div>

          <Link
            href={`/trip/${tripId}/conflicts`}
            className="block text-center text-sm text-muted-foreground hover:text-[var(--duo-blue)] transition-colors"
          >
            ← Back to preferences
          </Link>
        </motion.div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowConfirmModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-card rounded-3xl p-6 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <DuoMascot mood="celebrating" size="md" />

            <h2 className="text-2xl font-extrabold mt-4 mb-2">Confirm Trip?</h2>
            <p className="text-muted-foreground mb-6">
              Lock in your {itinerary.length}-day adventure to {currentTrip.destination}!
            </p>

            <div className="duo-xp-badge text-lg px-4 py-2 mb-6">
              +50 XP Reward
            </div>

            <div className="space-y-3">
              <DuoButton onClick={handleConfirmTrip} fullWidth>
                <Sparkles className="w-5 h-5 mr-2" />
                Yes, Confirm!
              </DuoButton>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="w-full py-3 text-muted-foreground font-bold hover:text-foreground transition-colors"
              >
                Not yet
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </DuoAppShell>
  );
}
