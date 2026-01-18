"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Share2,
  Check,
  Star,
  Users as CrowdIcon,
  CloudRain,
  Tag,
  Shield,
  Clock,
  Lightbulb,
  Zap,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { DuoResponsiveLayout } from "@/components/shared";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DuoButton } from "@/components/shared/duo-wizard-layout";
import { cn } from "@/lib/utils";

// Step Indicator Component - Duolingo Style
function DuoStepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: "Trip Details" },
    { num: 2, label: "Preferences" },
    { num: 3, label: "Your Plan" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, index) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold transition-all border-2",
                currentStep >= step.num
                  ? "bg-[var(--duo-green)] border-[var(--duo-green-dark)] text-white shadow-[0_4px_0_var(--duo-green-dark)]"
                  : "bg-muted border-border text-muted-foreground"
              )}
            >
              {currentStep > step.num ? <Check className="w-5 h-5" /> : step.num}
            </div>
            <span
              className={cn(
                "text-xs mt-2 font-bold",
                currentStep >= step.num ? "text-[var(--duo-green)]" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-12 h-2 mx-2 rounded-full transition-all",
                currentStep > step.num ? "bg-[var(--duo-green)]" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Plan Card Component - Duolingo Style
function DuoPlanCard({
  plan,
  selected,
  onSelect,
  recommended,
}: {
  plan: {
    id: string;
    title: string;
    description: string;
    price: number;
    crowdLevel: string;
    crowdColor: string;
    features?: string[];
  };
  selected: boolean;
  onSelect: () => void;
  recommended?: boolean;
}) {
  const crowdBgColor = plan.crowdColor === "green"
    ? "bg-[var(--duo-green)]/20 text-[var(--duo-green)]"
    : plan.crowdColor === "yellow"
    ? "bg-[var(--duo-yellow)]/20 text-[var(--duo-orange)]"
    : "bg-[var(--duo-orange)]/20 text-[var(--duo-orange)]";

  return (
    <motion.button
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative w-full p-5 rounded-3xl border-2 text-left transition-all",
        selected
          ? "border-[var(--duo-green)] bg-[var(--duo-green)]/5 shadow-[0_4px_0_var(--duo-green)]"
          : "border-border bg-white hover:border-[var(--duo-blue)] shadow-[0_4px_0_#E5E5E5]"
      )}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--duo-yellow)] text-white flex items-center gap-1 shadow-[0_2px_0_#E5A800]">
            <Star className="w-3 h-3" />
            Recommended
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <h3 className="font-extrabold">{plan.title}</h3>
        {selected && (
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-[var(--duo-green)] text-white">
            Selected
          </span>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-2xl font-extrabold">RM {plan.price.toLocaleString()}</span>
        <span className="text-sm text-muted-foreground">/ person</span>
      </div>

      <span className={cn("px-3 py-1 rounded-full text-xs font-bold", crowdBgColor)}>
        {plan.crowdLevel}
      </span>

      {plan.features && selected && (
        <div className="mt-4 pt-4 border-t-2 border-border space-y-2">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-[var(--duo-green)]" />
              {feature}
            </div>
          ))}
        </div>
      )}
    </motion.button>
  );
}

// Alert Card Component - Duolingo Style
function DuoAlertCard({
  title,
  location,
  badge,
  badgeColor,
  details,
  suggestion,
  icon: Icon,
}: {
  title: string;
  location: string;
  badge: string;
  badgeColor: string;
  details: { icon: typeof Clock; text: string }[];
  suggestion: string;
  icon: typeof CrowdIcon;
}) {
  const [expanded, setExpanded] = useState(false);

  const badgeStyles = badgeColor === "red"
    ? "bg-[var(--duo-red)] text-white"
    : badgeColor === "orange"
    ? "bg-[var(--duo-orange)] text-white"
    : "bg-[var(--duo-green)] text-white";

  const iconBg = badgeColor === "red"
    ? "bg-[var(--duo-red)]/20"
    : badgeColor === "orange"
    ? "bg-[var(--duo-orange)]/20"
    : "bg-[var(--duo-green)]/20";

  const iconColor = badgeColor === "red"
    ? "text-[var(--duo-red)]"
    : badgeColor === "orange"
    ? "text-[var(--duo-orange)]"
    : "text-[var(--duo-green)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="duo-card p-4"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-start gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-sm">{title}</h4>
              <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", badgeStyles)}>
                {badge}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{location}</p>
          </div>
          <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", expanded && "rotate-180")} />
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 pt-3 border-t-2 border-border"
        >
          <div className="space-y-1 mb-3">
            {details.map((detail, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                <detail.icon className="w-3 h-3" />
                {detail.text}
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-[var(--duo-purple)]/10 border-2 border-[var(--duo-purple)]/20">
            <div className="flex items-start gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-[var(--duo-purple)] shrink-0 mt-0.5" />
              <span className="text-[var(--duo-purple)] font-semibold">{suggestion}</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function PlanPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("balanced");
  const [alertFilter, setAlertFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [tripDetails, setTripDetails] = useState({
    destination: "Langkawi, Kedah",
    dates: "Dec 18, 2025 to Dec 20, 2025",
    travelers: 2,
    estimatedCost: 1050,
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("tripDetails");
    if (stored) {
      const data = JSON.parse(stored);
      setTripDetails({
        destination: data.destination || "Langkawi, Kedah",
        dates: data.travelDates || "Dec 18, 2025 to Dec 20, 2025",
        travelers: data.travelers || 2,
        estimatedCost: 1050,
      });
    }
  }, []);

  const plans = [
    {
      id: "low-crowd",
      title: "Low Crowd Plan",
      description: "Avoid peak hours & crowded spots",
      price: 1200,
      crowdLevel: "LOW-MEDIUM Crowd",
      crowdColor: "green",
    },
    {
      id: "balanced",
      title: "Balanced Plan",
      description: "Mix of popular & hidden gems",
      price: 1050,
      crowdLevel: "MED-HIGH Crowd",
      crowdColor: "orange",
      features: ["Best of both worlds", "Flexible timing", "Well-rounded experience"],
    },
    {
      id: "budget-saver",
      title: "Budget Saver Plan",
      description: "Cheapest flights + mid-range hotel",
      price: 900,
      crowdLevel: "MEDIUM Crowd",
      crowdColor: "yellow",
    },
  ];

  const alerts = [
    {
      type: "crowd",
      title: "Crowd Forecast",
      location: "Cenang Beach",
      badge: "HIGH",
      badgeColor: "red",
      icon: CrowdIcon,
      details: [
        { icon: Calendar, text: "Sat, 13 Apr · 5-8 PM" },
        { icon: Clock, text: "Long waiting time expected" },
      ],
      suggestion:
        "AI Suggestion: Visit earlier (9-11 AM) for a quieter experience, or embrace the evening crowd for a vibrant atmosphere.",
    },
    {
      type: "weather",
      title: "Weather Alert",
      location: "Island Hopping",
      badge: "WARNING",
      badgeColor: "orange",
      icon: CloudRain,
      details: [
        { icon: Calendar, text: "13 Apr · Afternoon" },
        { icon: MapPin, text: "Affects: Island hopping activity" },
      ],
      suggestion:
        "AI Suggestion: Move this activity to Day 2 morning when weather conditions are more favorable.",
    },
    {
      type: "price",
      title: "Price Drop",
      location: "Hotel ABC",
      badge: "SAVE RM 80",
      badgeColor: "green",
      icon: Tag,
      details: [{ icon: Clock, text: "Valid until: Tonight, 11:59 PM" }],
      suggestion:
        "AI Suggestion: This price drop is a great opportunity! It offers a perfect mix of comfort and value.",
    },
    {
      type: "safety",
      title: "Safety Notice",
      location: "Area X",
      badge: "CAUTION",
      badgeColor: "orange",
      icon: Shield,
      details: [
        { icon: MapPin, text: "Night time" },
        { icon: Shield, text: "Use main road / different area" },
      ],
      suggestion:
        "AI Suggestion: Explore this area during daylight hours (10 AM - 6 PM) when it's safer.",
    },
  ];

  const tips = [
    "Mix your itinerary: visit popular spots in the morning, then explore hidden gems in the afternoon.",
    "Take advantage of flexible timing - many attractions offer discounted rates during off-peak hours.",
    "Consider staying near the main area but in a quieter side street for the best of both worlds.",
  ];

  const filteredAlerts =
    alertFilter === "all"
      ? alerts
      : alerts.filter((alert) => alert.type === alertFilter);

  const filterOptions = [
    { value: "all", label: "All Alerts" },
    { value: "crowd", label: "Crowd" },
    { value: "weather", label: "Weather" },
    { value: "price", label: "Price" },
    { value: "safety", label: "Safety" },
  ];

  return (
    <DuoResponsiveLayout showTopBar showBottomNav>
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Step Indicator */}
        <DuoStepIndicator currentStep={3} />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="duo-card p-5"
          style={{
            background: "linear-gradient(135deg, var(--duo-green) 0%, var(--duo-green-dark) 100%)",
            borderColor: "var(--duo-green-dark)",
          }}
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0 text-white">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-extrabold">AI Travel Plan</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20">
                  <Zap className="w-3 h-3 inline mr-1" />
                  AI
                </span>
              </div>
              <div className="space-y-1 text-sm text-white/90">
                <p className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {tripDetails.destination}
                </p>
                <p className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {tripDetails.dates}
                </p>
                <p className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {tripDetails.travelers} travelers • Est. RM {tripDetails.estimatedCost}/person
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Choose Your Plan */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h2 className="font-extrabold flex items-center gap-2">
            <Star className="w-5 h-5 text-[var(--duo-yellow)]" />
            Choose Your Plan
          </h2>
          <div className="space-y-3">
            {plans.map((plan) => (
              <DuoPlanCard
                key={plan.id}
                plan={plan}
                selected={selectedPlan === plan.id}
                onSelect={() => setSelectedPlan(plan.id)}
                recommended={plan.id === "balanced"}
              />
            ))}
          </div>
        </motion.section>

        {/* AI Travel Predictions & Alerts */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--duo-purple)]" />
              AI Alerts
            </h2>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="px-3 py-1.5 rounded-xl border-2 border-border text-sm font-bold flex items-center gap-2 hover:border-[var(--duo-blue)] transition-colors"
              >
                {filterOptions.find((f) => f.value === alertFilter)?.label}
                <ChevronDown className={cn("w-4 h-4 transition-transform", showFilterDropdown && "rotate-180")} />
              </button>
              {showFilterDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full right-0 mt-1 bg-white border-2 border-border rounded-xl shadow-lg z-50 overflow-hidden min-w-[120px]"
                >
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setAlertFilter(option.value);
                        setShowFilterDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm font-semibold hover:bg-muted transition-colors",
                        alertFilter === option.value && "bg-[var(--duo-green)]/10 text-[var(--duo-green)]"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {filteredAlerts.map((alert, index) => (
              <DuoAlertCard key={index} {...alert} />
            ))}
          </div>
        </motion.section>

        {/* AI Personalized Tips */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h2 className="font-extrabold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[var(--duo-yellow)]" />
            Smart Tips
          </h2>

          <div className="duo-card p-4 space-y-3" style={{ borderColor: "var(--duo-yellow)" }}>
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--duo-green)] flex items-center justify-center shrink-0 shadow-[0_2px_0_var(--duo-green-dark)]">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-sm pt-1">{tip}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 pt-4"
        >
          <DuoButton onClick={() => router.push("/dashboard")} fullWidth size="lg">
            <Check className="w-5 h-5 mr-2" />
            Confirm & Save Plan
          </DuoButton>

          <button className="w-full duo-btn duo-btn-outline flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Plan
          </button>

          {/* XP Hint */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
            <span>
              Earn <strong className="text-[var(--duo-green)]">+50 XP</strong> for completing your plan!
            </span>
          </div>
        </motion.div>
      </div>
    </DuoResponsiveLayout>
  );
}
