"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Check,
  Star,
  ChevronRight,
  ChevronDown,
  Clock,
  CloudRain,
  Tag,
  Shield,
  Users as CrowdIcon,
} from "lucide-react";
import { useTrip } from "@/contexts/trip-context";
import { DuoResponsiveLayout } from "@/components/shared";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DuoButton } from "@/components/shared/duo-wizard-layout";
import { cn } from "@/lib/utils";

// Plan Card Component
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
  const crowdBgColor =
    plan.crowdColor === "green"
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
          : "border-border bg-card hover:border-[var(--duo-blue)] shadow-[0_4px_0_hsl(var(--border))]"
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
        <span className="text-2xl font-extrabold">
          RM {plan.price.toLocaleString()}
        </span>
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

// Alert Card Component
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

  const badgeStyles =
    badgeColor === "red"
      ? "bg-[var(--duo-red)] text-white"
      : badgeColor === "orange"
      ? "bg-[var(--duo-orange)] text-white"
      : "bg-[var(--duo-green)] text-white";

  const iconBg =
    badgeColor === "red"
      ? "bg-[var(--duo-red)]/20"
      : badgeColor === "orange"
      ? "bg-[var(--duo-orange)]/20"
      : "bg-[var(--duo-green)]/20";

  const iconColor =
    badgeColor === "red"
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
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              iconBg
            )}
          >
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-sm">{title}</h4>
              <span
                className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", badgeStyles)}
              >
                {badge}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{location}</p>
          </div>
          <ChevronDown
            className={cn(
              "w-5 h-5 text-muted-foreground transition-transform",
              expanded && "rotate-180"
            )}
          />
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

export default function RecommendationsPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;

  const { currentTrip, loadTrip, updateTrip } = useTrip();
  const [selectedPlan, setSelectedPlan] = useState("balanced");

  useEffect(() => {
    if (!currentTrip || currentTrip.id !== tripId) {
      const loaded = loadTrip(tripId);
      if (!loaded) {
        router.replace("/trip/new");
      }
    }
  }, [tripId, currentTrip, loadTrip, router]);

  if (!currentTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <DuoMascot mood="thinking" size="lg" />
      </div>
    );
  }

  const memberCount = currentTrip.members.length;
  const avgBudget = currentTrip.aggregatedPreferences?.budgetRange.average || 200;

  const plans = [
    {
      id: "low-crowd",
      title: "Low Crowd Plan",
      description: "Avoid peak hours & crowded spots for your group",
      price: Math.round(avgBudget * 1.15),
      crowdLevel: "LOW-MEDIUM Crowd",
      crowdColor: "green",
      features: [
        "Off-peak timing for all activities",
        "Hidden gems & local favorites",
        "More space for group photos",
      ],
    },
    {
      id: "balanced",
      title: "Balanced Plan",
      description: "Mix of popular spots & hidden gems",
      price: avgBudget,
      crowdLevel: "MED-HIGH Crowd",
      crowdColor: "orange",
      features: [
        "Best of both worlds",
        "Flexible timing for the group",
        "Well-rounded experience",
      ],
    },
    {
      id: "budget-saver",
      title: "Budget Saver Plan",
      description: "Best value options for the whole group",
      price: Math.round(avgBudget * 0.85),
      crowdLevel: "MEDIUM Crowd",
      crowdColor: "yellow",
      features: [
        "Group discounts included",
        "Free activities prioritized",
        "Budget-friendly dining spots",
      ],
    },
  ];

  const alerts = [
    {
      type: "crowd",
      title: "Crowd Forecast",
      location: currentTrip.destination,
      badge: "HIGH",
      badgeColor: "red",
      icon: CrowdIcon,
      details: [
        { icon: Calendar, text: `${new Date(currentTrip.startDate).toLocaleDateString()} - Peak period` },
        { icon: Clock, text: "Longer wait times expected" },
      ],
      suggestion: `AI Suggestion: With ${memberCount} people, consider the Low Crowd Plan to avoid waiting in long queues.`,
    },
    {
      type: "weather",
      title: "Weather Alert",
      location: "Outdoor Activities",
      badge: "WARNING",
      badgeColor: "orange",
      icon: CloudRain,
      details: [
        { icon: Calendar, text: "Afternoon showers possible" },
        { icon: MapPin, text: "Affects: Outdoor activities" },
      ],
      suggestion: "AI Suggestion: Schedule outdoor activities in the morning for your group.",
    },
    {
      type: "price",
      title: "Group Discount",
      location: "Available for your group",
      badge: `${memberCount}+ PEOPLE`,
      badgeColor: "green",
      icon: Tag,
      details: [{ icon: Users, text: `Group of ${memberCount} qualifies for discounts` }],
      suggestion: "AI Suggestion: The Budget Saver Plan includes special group rates at select venues.",
    },
  ];

  const handleContinue = () => {
    updateTrip({ selectedPlan });
    router.push(`/trip/${tripId}/plan`);
  };

  return (
    <DuoResponsiveLayout showTopBar showBottomNav>
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <DuoMascot mood="excited" size="sm" className="mx-auto mb-3" />
          <h1 className="text-2xl font-extrabold mb-2">Choose Your Plan</h1>
          <p className="text-muted-foreground text-sm">
            AI-generated options for {memberCount} travelers
          </p>
        </motion.div>

        {/* Trip Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="duo-card p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--duo-blue)]/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[var(--duo-blue)]" />
              </div>
              <div>
                <h3 className="font-bold">{currentTrip.destination}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(currentTrip.startDate).toLocaleDateString()} -{" "}
                  {new Date(currentTrip.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-[var(--duo-purple)]">
                <Users className="w-4 h-4" />
                <span className="font-bold">{memberCount}</span>
              </div>
              <p className="text-xs text-muted-foreground">travelers</p>
            </div>
          </div>
        </motion.div>

        {/* Plan Selection */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--duo-purple)]" />
            AI Recommendations
          </h2>

          <div className="space-y-4">
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
        </div>

        {/* Alerts Section */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--duo-orange)]" />
            Smart Alerts
          </h2>

          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <DuoAlertCard key={index} {...alert} />
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className="pt-4 pb-20">
          <DuoButton onClick={handleContinue} fullWidth>
            Continue with {plans.find((p) => p.id === selectedPlan)?.title}
            <ChevronRight className="w-5 h-5 ml-1" />
          </DuoButton>
        </div>
      </div>
    </DuoResponsiveLayout>
  );
}
