"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Zap,
  Home,
  Sun,
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  Mountain,
  Utensils,
  Camera,
  Music,
  Palmtree,
  Building,
  ShoppingBag,
  Heart,
  AlertCircle,
} from "lucide-react";
import {
  useTrip,
  type MemberPreferences,
  type TripMember,
  type TravelStyle,
  type PacingStyle,
  type AccommodationType,
  type ActivityType,
  defaultPreferences,
} from "@/contexts/trip-context";
import {
  DuoWizardLayout,
  DuoWizardOption,
  DuoWizardMultiOption,
  DuoButton,
  DuoSlider,
} from "@/components/shared/duo-wizard-layout";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { cn } from "@/lib/utils";

type PreferenceStep = "select-member" | "style" | "budget" | "pacing" | "accommodation" | "activities" | "timing" | "summary";

const activityOptions: { id: ActivityType; icon: React.ElementType; label: string }[] = [
  { id: "adventure", icon: Mountain, label: "Adventure" },
  { id: "culture", icon: Building, label: "Culture" },
  { id: "nature", icon: Palmtree, label: "Nature" },
  { id: "food", icon: Utensils, label: "Food" },
  { id: "relaxation", icon: Sun, label: "Relaxation" },
  { id: "nightlife", icon: Music, label: "Nightlife" },
  { id: "shopping", icon: ShoppingBag, label: "Shopping" },
];

export default function PreferencesPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;

  const {
    currentTrip,
    loadTrip,
    updateMemberPreferences,
    getUnsetMembers,
    setCurrentMember,
    currentMemberId,
    getMemberById,
    setStep: setTripStep,
  } = useTrip();

  const [step, setStep] = useState<PreferenceStep>("select-member");
  const [preferences, setPreferences] = useState<MemberPreferences>(defaultPreferences);
  const [selectedMember, setSelectedMember] = useState<TripMember | null>(null);

  useEffect(() => {
    if (!currentTrip || currentTrip.id !== tripId) {
      const loaded = loadTrip(tripId);
      if (!loaded) {
        router.replace("/trip/new");
      }
    }
  }, [tripId, currentTrip, loadTrip, router]);

  useEffect(() => {
    // Auto-select member if there's only one unset
    const unsetMembers = getUnsetMembers();
    if (unsetMembers.length === 1 && step === "select-member") {
      handleSelectMember(unsetMembers[0]);
    }
  }, [currentTrip]);

  const handleSelectMember = (member: TripMember) => {
    setSelectedMember(member);
    setCurrentMember(member.id);
    setPreferences(member.preferences || defaultPreferences);
    setStep("style");
  };

  const handleNext = () => {
    const steps: PreferenceStep[] = ["select-member", "style", "budget", "pacing", "accommodation", "activities", "timing", "summary"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: PreferenceStep[] = ["select-member", "style", "budget", "pacing", "accommodation", "activities", "timing", "summary"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    } else {
      router.push(`/trip/${tripId}/members`);
    }
  };

  const handleSavePreferences = () => {
    if (selectedMember) {
      updateMemberPreferences(selectedMember.id, preferences);

      // Check if all members have set preferences (excluding current member who just saved)
      const remainingUnset = getUnsetMembers().filter(m => m.id !== selectedMember.id);
      if (remainingUnset.length === 0) {
        // All done, go to conflicts
        setTripStep("conflicts");
        router.push(`/trip/${tripId}/conflicts`);
      } else {
        // More members to set, reset and go back to member selection
        setSelectedMember(null);
        setCurrentMember(null);
        setPreferences(defaultPreferences);
        // Use setTimeout to ensure state updates are processed before changing step
        setTimeout(() => {
          setStep("select-member");
        }, 0);
      }
    }
  };

  const getProgress = () => {
    const steps: PreferenceStep[] = ["style", "budget", "pacing", "accommodation", "activities", "timing", "summary"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex === -1) return 0;
    return Math.round(((currentIndex + 1) / steps.length) * 100);
  };

  if (!currentTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <DuoMascot mood="thinking" size="lg" />
      </div>
    );
  }

  const unsetMembers = getUnsetMembers();

  // Helper to get proper possessive form (You → Your, others → name's)
  const getMemberDisplayName = () => {
    if (!selectedMember) return "";
    return selectedMember.name === "You" ? "Your" : `${selectedMember.name}'s`;
  };

  // Member indicator badge component
  const MemberBadge = () => {
    if (!selectedMember || step === "select-member") return null;
    return (
      <div className="flex items-center justify-center mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--duo-blue)]/10 border-2 border-[var(--duo-blue)]/30">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--duo-blue)] to-[var(--duo-purple)] flex items-center justify-center text-white text-xs font-bold">
            {selectedMember.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-bold text-[var(--duo-blue)]">
            Setting up for {selectedMember.name === "You" ? "You" : selectedMember.name}
          </span>
        </div>
      </div>
    );
  };

  return (
    <DuoWizardLayout
      title={
        step === "select-member" ? "Who's setting preferences?" :
        step === "style" ? `${getMemberDisplayName()} travel style` :
        step === "budget" ? "Daily budget" :
        step === "pacing" ? "Trip pacing" :
        step === "accommodation" ? "Where to stay" :
        step === "activities" ? "Favorite activities" :
        step === "timing" ? "Morning person?" :
        "Review preferences"
      }
      subtitle={
        step === "select-member" ? `${unsetMembers.length} member(s) haven't set preferences yet` :
        step === "style" ? "How do you like to travel?" :
        step === "budget" ? "Set your comfortable daily spending" :
        step === "pacing" ? "How packed should the schedule be?" :
        step === "accommodation" ? "Pick your preferred stay type" :
        step === "activities" ? "Select all that interest you" :
        step === "timing" ? "When do you like to start the day?" :
        "Looking good! Ready to save?"
      }
      showProgress={step !== "select-member"}
      showBack
      onBack={handleBack}
      mascot={
        <DuoMascot
          mood={step === "summary" ? "excited" : "encouraging"}
          size="sm"
        />
      }
      footer={
        step === "select-member" ? (
          unsetMembers.length === 0 ? (
            <DuoButton
              onClick={() => {
                setTripStep("conflicts");
                router.push(`/trip/${tripId}/conflicts`);
              }}
              fullWidth
            >
              Everyone's done! Continue <ChevronRight className="w-5 h-5 ml-1" />
            </DuoButton>
          ) : null
        ) : step === "summary" ? (
          <DuoButton onClick={handleSavePreferences} fullWidth>
            Save Preferences <Check className="w-5 h-5 ml-1" />
          </DuoButton>
        ) : (
          <DuoButton
            onClick={handleNext}
            disabled={step === "activities" && preferences.activities.length === 0}
            fullWidth
          >
            Continue <ChevronRight className="w-5 h-5 ml-1" />
          </DuoButton>
        )
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full"
        >
          {/* Member Badge - shows who we're setting up for */}
          <MemberBadge />
          {/* Select Member */}
          {step === "select-member" && (
            <div className="space-y-3">
              {unsetMembers.length === 0 ? (
                <div className="duo-card p-6 text-center">
                  <Check className="w-12 h-12 mx-auto mb-3 text-[var(--duo-green)]" />
                  <h3 className="font-bold text-lg">All preferences set!</h3>
                  <p className="text-muted-foreground">Everyone has shared their preferences.</p>
                </div>
              ) : (
                unsetMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleSelectMember(member)}
                    className="w-full duo-card duo-card-interactive p-4 flex items-center gap-4 text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--duo-blue)] to-[var(--duo-purple)] flex items-center justify-center text-white font-bold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{member.name}</p>
                      <p className="text-sm text-muted-foreground">Tap to set preferences</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                ))
              )}

              {/* Already set members */}
              {currentTrip.members.filter(m => m.hasSetPreferences).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase mb-2">
                    Already set ({currentTrip.members.filter(m => m.hasSetPreferences).length})
                  </h3>
                  {currentTrip.members.filter(m => m.hasSetPreferences).map((member) => (
                    <div
                      key={member.id}
                      className="duo-card duo-card-green p-3 flex items-center gap-3 mb-2"
                    >
                      <Check className="w-5 h-5 text-[var(--duo-green)]" />
                      <span className="font-semibold">{member.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Travel Style */}
          {step === "style" && (
            <div className="duo-wizard-options">
              {[
                { value: "budget" as TravelStyle, icon: "💰", title: "Budget Explorer", desc: "Find the best deals" },
                { value: "comfort" as TravelStyle, icon: "✨", title: "Comfort Seeker", desc: "Balance of value & comfort" },
                { value: "luxury" as TravelStyle, icon: "👑", title: "Luxury Traveler", desc: "Premium experiences" },
              ].map((style) => (
                <DuoWizardOption
                  key={style.value}
                  selected={preferences.travelStyle === style.value}
                  onClick={() => setPreferences({ ...preferences, travelStyle: style.value })}
                  icon={<span className="text-2xl">{style.icon}</span>}
                >
                  <div>
                    <p className="font-bold text-lg">{style.title}</p>
                    <p className="text-sm text-muted-foreground">{style.desc}</p>
                  </div>
                </DuoWizardOption>
              ))}
            </div>
          )}

          {/* Budget */}
          {step === "budget" && (
            <div className="space-y-6">
              <div className="duo-card p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Daily budget</p>
                <p className="text-4xl font-extrabold text-[var(--duo-green)]">
                  RM {preferences.dailyBudget}
                </p>
              </div>

              <DuoSlider
                value={preferences.dailyBudget}
                min={50}
                max={500}
                step={10}
                onChange={(value) => setPreferences({ ...preferences, dailyBudget: value })}
                leftLabel="RM 50"
                rightLabel="RM 500"
              />

              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                {[100, 200, 300].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setPreferences({ ...preferences, dailyBudget: amount })}
                    className={cn(
                      "p-2 rounded-xl border-2 font-bold transition-all",
                      preferences.dailyBudget === amount
                        ? "border-[var(--duo-green)] bg-[var(--duo-green)]/10"
                        : "border-border"
                    )}
                  >
                    RM {amount}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pacing */}
          {step === "pacing" && (
            <div className="duo-wizard-options">
              {[
                { value: "relaxed" as PacingStyle, icon: "🐢", title: "Relaxed", desc: "2-3 activities per day, lots of downtime" },
                { value: "moderate" as PacingStyle, icon: "🚶", title: "Moderate", desc: "4-5 activities, balanced schedule" },
                { value: "packed" as PacingStyle, icon: "🏃", title: "Packed", desc: "6+ activities, maximize every moment" },
              ].map((pacing) => (
                <DuoWizardOption
                  key={pacing.value}
                  selected={preferences.pacing === pacing.value}
                  onClick={() => setPreferences({ ...preferences, pacing: pacing.value })}
                  icon={<span className="text-2xl">{pacing.icon}</span>}
                >
                  <div>
                    <p className="font-bold text-lg">{pacing.title}</p>
                    <p className="text-sm text-muted-foreground">{pacing.desc}</p>
                  </div>
                </DuoWizardOption>
              ))}
            </div>
          )}

          {/* Accommodation */}
          {step === "accommodation" && (
            <div className="duo-wizard-options">
              {[
                { value: "hostel" as AccommodationType, icon: "🛏️", title: "Hostel", desc: "Budget-friendly, social" },
                { value: "hotel" as AccommodationType, icon: "🏨", title: "Hotel", desc: "Reliable comfort" },
                { value: "resort" as AccommodationType, icon: "🏖️", title: "Resort", desc: "Full amenities" },
                { value: "airbnb" as AccommodationType, icon: "🏠", title: "Airbnb/Villa", desc: "Home-like experience" },
                { value: "any" as AccommodationType, icon: "🤷", title: "Flexible", desc: "I'm fine with anything" },
              ].map((acc) => (
                <DuoWizardOption
                  key={acc.value}
                  selected={preferences.accommodation === acc.value}
                  onClick={() => setPreferences({ ...preferences, accommodation: acc.value })}
                  icon={<span className="text-2xl">{acc.icon}</span>}
                >
                  <div>
                    <p className="font-bold">{acc.title}</p>
                    <p className="text-sm text-muted-foreground">{acc.desc}</p>
                  </div>
                </DuoWizardOption>
              ))}
            </div>
          )}

          {/* Activities */}
          {step === "activities" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Select at least 2 activities you enjoy
              </p>
              <div className="grid grid-cols-2 gap-3">
                {activityOptions.map((activity) => {
                  const Icon = activity.icon;
                  const isSelected = preferences.activities.includes(activity.id);
                  return (
                    <DuoWizardMultiOption
                      key={activity.id}
                      selected={isSelected}
                      onClick={() => {
                        setPreferences({
                          ...preferences,
                          activities: isSelected
                            ? preferences.activities.filter(a => a !== activity.id)
                            : [...preferences.activities, activity.id],
                        });
                      }}
                      icon={<Icon className="w-5 h-5" />}
                    >
                      {activity.label}
                    </DuoWizardMultiOption>
                  );
                })}
              </div>
            </div>
          )}

          {/* Timing */}
          {step === "timing" && (
            <div className="duo-wizard-options">
              {[
                { value: "early" as const, icon: "🌅", title: "Early Bird", desc: "Up by 6-7 AM, start early" },
                { value: "normal" as const, icon: "☀️", title: "Normal", desc: "Up by 8-9 AM" },
                { value: "late" as const, icon: "🌙", title: "Night Owl", desc: "Up by 10+ AM, late nights" },
              ].map((timing) => (
                <DuoWizardOption
                  key={timing.value}
                  selected={preferences.wakeUpTime === timing.value}
                  onClick={() => setPreferences({ ...preferences, wakeUpTime: timing.value })}
                  icon={<span className="text-2xl">{timing.icon}</span>}
                >
                  <div>
                    <p className="font-bold text-lg">{timing.title}</p>
                    <p className="text-sm text-muted-foreground">{timing.desc}</p>
                  </div>
                </DuoWizardOption>
              ))}
            </div>
          )}

          {/* Summary */}
          {step === "summary" && (
            <div className="space-y-4">
              <div className="duo-card p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-[var(--duo-blue)]" />
                  {getMemberDisplayName()} Preferences
                </h3>

                <div className="space-y-3">
                  <SummaryItem
                    label="Travel Style"
                    value={preferences.travelStyle.charAt(0).toUpperCase() + preferences.travelStyle.slice(1)}
                    icon="💼"
                  />
                  <SummaryItem
                    label="Daily Budget"
                    value={`RM ${preferences.dailyBudget}`}
                    icon="💰"
                  />
                  <SummaryItem
                    label="Pacing"
                    value={preferences.pacing.charAt(0).toUpperCase() + preferences.pacing.slice(1)}
                    icon="⏱️"
                  />
                  <SummaryItem
                    label="Accommodation"
                    value={preferences.accommodation.charAt(0).toUpperCase() + preferences.accommodation.slice(1)}
                    icon="🏨"
                  />
                  <SummaryItem
                    label="Activities"
                    value={preferences.activities.join(", ") || "None selected"}
                    icon="🎯"
                  />
                  <SummaryItem
                    label="Wake-up Time"
                    value={
                      preferences.wakeUpTime === "early" ? "Early Bird" :
                      preferences.wakeUpTime === "late" ? "Night Owl" : "Normal"
                    }
                    icon="⏰"
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </DuoWizardLayout>
  );
}

function SummaryItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-muted-foreground flex items-center gap-2">
        <span>{icon}</span> {label}
      </span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
