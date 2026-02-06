"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navigation } from "@/components/shared/navigation";
import { GroupLabel } from "@/components/shared/group-label";
import { FlowGuide } from "@/components/shared/flow-guide";
import {
  AnimatedBackground,
  UnifiedCard,
} from "@/components/shared/page-layout";
import {
  Sparkles,
  ChevronLeft,
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
} from "lucide-react";
import { cn } from "@/lib/utils";

// Step Indicator Component
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: "Trip Details" },
    { num: 2, label: "Preferences" },
    { num: 3, label: "Your Plan" },
  ];

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, index) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all shadow-lg",
                currentStep > step.num
                  ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-rose-500/25"
                  : currentStep === step.num
                  ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-rose-500/25"
                  : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 shadow-none"
              )}
            >
              {currentStep > step.num ? (
                <Check className="w-5 h-5" />
              ) : (
                step.num
              )}
            </div>
            <span
              className={cn(
                "text-xs mt-2 font-medium",
                currentStep >= step.num ? "text-rose-600 dark:text-rose-400" : "text-neutral-400 dark:text-neutral-500"
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-24 h-1 mx-2 rounded-full transition-all",
                currentStep > step.num ? "bg-gradient-to-r from-rose-500 to-pink-500" : "bg-neutral-200 dark:bg-neutral-700"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Plan Card Component
function PlanCard({
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
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative w-full p-5 rounded-xl border-2 text-left transition-all",
        selected
          ? "border-rose-500 bg-white dark:bg-neutral-800 shadow-lg shadow-rose-500/10"
          : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-800"
      )}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1 text-xs flex items-center gap-1 shadow-lg shadow-rose-500/25">
            <Star className="w-3 h-3" />
            Recommended
          </Badge>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-neutral-800 dark:text-neutral-100">{plan.title}</h3>
        {selected && (
          <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">Selected</Badge>
        )}
      </div>

      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">{plan.description}</p>

      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          RM {plan.price.toLocaleString()}
        </span>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">/ person</span>
      </div>

      <Badge
        className={cn(
          "text-xs font-medium",
          plan.crowdColor === "green"
            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
            : plan.crowdColor === "yellow"
            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
            : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
        )}
      >
        {plan.crowdLevel}
      </Badge>

      {plan.features && selected && (
        <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700 space-y-2">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              <Check className="w-4 h-4 text-rose-500" />
              {feature}
            </div>
          ))}
        </div>
      )}
    </button>
  );
}

// Alert Card Component
function AlertCard({
  type,
  title,
  location,
  badge,
  badgeColor,
  details,
  suggestion,
  icon: Icon,
  iconBgColor,
}: {
  type: string;
  title: string;
  location: string;
  badge: string;
  badgeColor: string;
  details: { icon: typeof Clock; text: string }[];
  suggestion: string;
  icon: typeof CrowdIcon;
  iconBgColor: string;
}) {
  return (
    <UnifiedCard hover className="p-5">
      <div className="flex items-start gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-lg", iconBgColor)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-neutral-800 dark:text-neutral-100">{title}</h4>
            <Badge
              className={cn(
                "text-xs font-medium",
                badgeColor === "red"
                  ? "bg-red-500 text-white"
                  : badgeColor === "orange"
                  ? "bg-orange-500 text-white"
                  : "bg-emerald-500 text-white"
              )}
            >
              {badge}
            </Badge>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{location}</p>

          <div className="space-y-1 mb-3">
            {details.map((detail, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                <detail.icon className="w-4 h-4" />
                {detail.text}
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-700">
            <div className="flex items-start gap-2 text-sm text-rose-600 dark:text-rose-400 italic">
              <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{suggestion}</span>
            </div>
          </div>
        </div>
      </div>
    </UnifiedCard>
  );
}

// Tip Card Component
function TipCard({ tipNumber, text }: { tipNumber: number; text: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-500/25">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <span className="text-rose-600 dark:text-rose-400 font-semibold">Tip {tipNumber}: </span>
        <span className="text-neutral-700 dark:text-neutral-300">{text}</span>
      </div>
    </div>
  );
}

export default function PlanPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("balanced");
  const [alertFilter, setAlertFilter] = useState("all");
  const [tripDetails, setTripDetails] = useState({
    destination: "Melaka",
    dates: "Dec 18, 2025 to Dec 20, 2025",
    travelers: 4,
    estimatedCost: 800,
  });

  useEffect(() => {
    // Try to get trip details from sessionStorage
    const stored = sessionStorage.getItem("tripDetails");
    if (stored) {
      const data = JSON.parse(stored);
      setTripDetails({
        destination: data.destination || "Melaka",
        dates: data.travelDates || "Dec 18, 2025 to Dec 20, 2025",
        travelers: data.travelers || 4,
        estimatedCost: 800,
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
      location: "Jonker Street Night Market",
      badge: "HIGH",
      badgeColor: "red",
      icon: CrowdIcon,
      iconBgColor: "bg-orange-100 text-orange-600",
      details: [
        { icon: Calendar, text: "Fri-Sun · 6-10 PM" },
        { icon: Clock, text: "Long waiting time expected" },
      ],
      suggestion:
        "AI Suggestion: Jonker Street Night Market will be very crowded during weekend evenings. Your Balanced Plan allows flexibility - visit during weekday evenings or explore the area during late afternoon for a quieter experience.",
    },
    {
      type: "weather",
      title: "Weather Alert",
      location: "Melaka River Cruise",
      badge: "WARNING",
      badgeColor: "orange",
      icon: CloudRain,
      iconBgColor: "bg-blue-100 text-blue-600",
      details: [
        { icon: Calendar, text: "Dec 19 · Afternoon" },
        { icon: MapPin, text: "Affects: River cruise activity" },
      ],
      suggestion:
        "AI Suggestion: Afternoon thunderstorms may affect the river cruise. With your Balanced Plan's flexible scheduling, I recommend taking the morning cruise (9-11 AM) for better weather and scenic views.",
    },
    {
      type: "price",
      title: "Price Drop",
      location: "Hatten Hotel Melaka",
      badge: "SAVE RM 80",
      badgeColor: "green",
      icon: Tag,
      iconBgColor: "bg-green-100 text-green-600",
      details: [
        { icon: Clock, text: "Valid until: Tonight, 11:59 PM" },
      ],
      suggestion:
        "AI Suggestion: This price drop on Hatten Hotel is a great opportunity! It's located in the heart of Melaka, within walking distance to Jonker Street and A Famosa - perfect for your Balanced Plan.",
    },
    {
      type: "safety",
      title: "Safety Notice",
      location: "Chinatown Area",
      badge: "CAUTION",
      badgeColor: "orange",
      icon: Shield,
      iconBgColor: "bg-red-100 text-red-600",
      details: [
        { icon: MapPin, text: "Late night (after 11 PM)" },
        { icon: Shield, text: "Stay on main streets" },
      ],
      suggestion:
        "AI Suggestion: The Chinatown area is generally safe but stick to well-lit main streets after 11 PM. Your Balanced Plan includes activities that wrap up by 10 PM for optimal safety.",
    },
  ];

  const tips = [
    "Mix your itinerary: visit A Famosa and St. Paul's Hill in the cool morning, then explore Jonker Street's cafes in the afternoon before the night market opens.",
    "Take advantage of flexible timing - many Melaka attractions like museums offer discounted rates during weekday mornings.",
    "Consider staying near Jonker Street but on a quieter side street for easy access to attractions while enjoying peaceful nights.",
  ];

  const filteredAlerts =
    alertFilter === "all"
      ? alerts
      : alerts.filter((alert) => alert.type === alertFilter);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 relative">
      <Navigation />
      <GroupLabel group={5} />
      <AnimatedBackground variant="subtle" />

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Step Indicator */}
        <StepIndicator currentStep={3} />

        {/* AI-Generated Travel Plan Header */}
        <UnifiedCard gradient className="p-5 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/25">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">AI-Generated Travel Plan</h1>
                  <Badge className="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    AI Powered
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-neutral-500 dark:text-neutral-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {tripDetails.destination}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {tripDetails.dates}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {tripDetails.travelers} travelers
                  </span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-100">
                    Est. cost: RM {tripDetails.estimatedCost.toLocaleString()} / person
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-neutral-600 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </UnifiedCard>

        {/* Choose Your Plan */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={selectedPlan === plan.id}
                onSelect={() => setSelectedPlan(plan.id)}
                recommended={plan.id === "balanced"}
              />
            ))}
          </div>
        </div>

        {/* AI Travel Predictions & Alerts */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">AI Travel Predictions & Alerts</h2>
              <Badge className="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Real-time
              </Badge>
            </div>
            <Select value={alertFilter} onValueChange={setAlertFilter}>
              <SelectTrigger className="w-40 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <SelectValue placeholder="All Alerts" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="crowd">Crowd</SelectItem>
                <SelectItem value="weather">Weather</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredAlerts.map((alert, index) => (
              <AlertCard key={index} {...alert} />
            ))}
          </div>
        </div>

        {/* AI Personalized Suggestions */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">AI Personalized Suggestions</h2>
            <Badge className="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Smart Tips
            </Badge>
          </div>

          <UnifiedCard className="p-5 bg-rose-50/50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/30">
            <div className="space-y-4">
              {tips.map((tip, index) => (
                <TipCard key={index} tipNumber={index + 1} text={tip} />
              ))}
            </div>
          </UnifiedCard>
        </div>

        {/* Action Button */}
        <div className="text-center mb-12">
          <Button
            size="lg"
            onClick={() => router.push("/dashboard")}
            className={cn(
              "h-14 px-12 text-lg font-semibold",
              "bg-gradient-to-r from-rose-500 to-pink-500",
              "hover:from-rose-600 hover:to-pink-600",
              "text-white border-0",
              "shadow-xl shadow-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/40",
              "transition-all duration-300"
            )}
          >
            Confirm & Save Plan
          </Button>
        </div>

        {/* Flow Guide - What's Next */}
        <FlowGuide
          variant="banner"
          title="What's Next?"
          maxSuggestions={3}
        />
      </main>
    </div>
  );
}

