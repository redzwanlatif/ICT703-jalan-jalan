"use client";

import Link from "next/link";
import { Navigation } from "@/components/shared/navigation";
import {
  AnimatedBackground,
  UnifiedCard,
} from "@/components/shared/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageCircle,
  LayoutDashboard,
  Wallet,
  Users,
  Sparkles,
  ExternalLink,
  Compass,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Group configuration
const groups = [
  {
    number: 0,
    name: "Onboarding & Auth",
    fullName: "User Onboarding & Authentication",
    description: "A Duolingo-inspired onboarding experience that collects travel preferences, creates accounts, and personalizes the platform experience.",
    icon: Sparkles,
    gradient: "from-amber-500 to-orange-500",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
    textClass: "text-amber-600 dark:text-amber-400",
    pages: [
      { path: "/", name: "Home / Stories", description: "Community stories feed with mascot" },
      { path: "/onboarding", name: "Onboarding Wizard", description: "8-step personalization flow" },
      { path: "/login", name: "Login", description: "User authentication" },
      { path: "/register", name: "Register", description: "New user registration" },
    ],
    features: [
      "Welcome dialog with accessibility",
      "Travel style selection",
      "Travel DNA setup",
      "Trip frequency preference",
      "Interest selection",
      "Goal setting",
      "XP rewards system",
    ],
  },
  {
    number: 1,
    name: "AI Chat Assistant",
    fullName: "Context-Aware Planning Assistant",
    description: "An intelligent AI assistant that helps users plan trips with context-aware recommendations, considering local events, weather, and cultural factors.",
    icon: MessageCircle,
    gradient: "from-emerald-500 to-teal-500",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
    textClass: "text-emerald-600 dark:text-emerald-400",
    pages: [
      { path: "/chat", name: "AI Chat", description: "Chat with AI travel assistant" },
    ],
    features: [
      "Natural language trip planning",
      "Context-aware recommendations",
      "Quick action shortcuts",
      "Conversation history",
    ],
  },
  {
    number: 2,
    name: "Travel Dashboard",
    fullName: "Interactive Travel Dashboard",
    description: "A comprehensive dashboard providing real-time travel data including weather, crowd levels, attractions, prices, and safety information for destinations.",
    icon: LayoutDashboard,
    gradient: "from-blue-500 to-indigo-500",
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/30",
    textClass: "text-blue-600 dark:text-blue-400",
    pages: [
      { path: "/wanderboard", name: "Wanderboard", description: "Search & destination entry" },
      { path: "/dashboard", name: "Live Dashboard", description: "8 real-time data cards" },
      { path: "/dashboard/itenary", name: "Itinerary", description: "Day-by-day itinerary view" },
      { path: "/dashboard/member", name: "Members", description: "Trip member management" },
    ],
    features: [
      "Real-time weather data",
      "Crowd level predictions",
      "Price comparisons",
      "Safety alerts",
      "Halal spot finder",
      "Traffic conditions",
    ],
  },
  {
    number: 3,
    name: "Personal Travel Hub",
    fullName: "Personal Travel Informatics",
    description: "A personal travel management hub for tracking budgets, expenses, travel patterns, and reflecting on past trips with AI-powered insights.",
    icon: Wallet,
    gradient: "from-violet-500 to-purple-500",
    bgClass: "bg-violet-500/10",
    borderClass: "border-violet-500/30",
    textClass: "text-violet-600 dark:text-violet-400",
    pages: [
      { path: "/informatics", name: "Informatics Onboarding", description: "Travel DNA setup" },
      { path: "/informatics/dashboard", name: "My Profile", description: "Personal travel dashboard" },
      { path: "/informatics/planner", name: "Trip Planner", description: "Plan upcoming trips" },
      { path: "/informatics/planner/1/expenses", name: "Expenses", description: "Trip expense tracking" },
      { path: "/informatics/insights", name: "Insights", description: "Spending analytics" },
      { path: "/informatics/reflection", name: "Reflection", description: "Trip reflections" },
      { path: "/informatics/settings", name: "Settings Hub", description: "Account settings" },
      { path: "/informatics/settings/profile", name: "Edit Profile", description: "Profile management" },
      { path: "/informatics/settings/privacy", name: "Privacy", description: "Privacy controls" },
    ],
    features: [
      "Budget tracking & goals",
      "Expense categorization",
      "Travel pattern analysis",
      "Trip watchlist",
      "Currency exchange rates",
      "AI-powered insights",
    ],
  },
  {
    number: 4,
    name: "Community Hub",
    fullName: "Social & Community Layer",
    description: "A social platform for travelers to share stories, discover local events, and connect with the community for authentic travel experiences.",
    icon: Users,
    gradient: "from-orange-500 to-amber-500",
    bgClass: "bg-orange-500/10",
    borderClass: "border-orange-500/30",
    textClass: "text-orange-600 dark:text-orange-400",
    pages: [
      { path: "/community", name: "Community Home", description: "Main community hub" },
      { path: "/community/events", name: "Events", description: "Upcoming travel events" },
      { path: "/community/stories", name: "Stories", description: "Community travel stories" },
      { path: "/community/stories/create", name: "Create Story", description: "Share your story" },
      { path: "/community/stories/1", name: "Story Detail", description: "Full story view" },
      { path: "/community/stories/1/report", name: "Report Story", description: "Flag content" },
      { path: "/admin", name: "Admin Dashboard", description: "Content moderation" },
    ],
    features: [
      "Community stories",
      "Local events calendar",
      "Verified local guides",
      "Trip sharing",
      "Story reporting",
      "Event discovery",
    ],
  },
  {
    number: 5,
    name: "Smart Planner",
    fullName: "Predictive & Collective Analytics",
    description: "An AI-powered trip planner that generates personalized itineraries with crowd predictions, weather alerts, and budget optimization.",
    icon: Sparkles,
    gradient: "from-rose-500 to-pink-500",
    bgClass: "bg-rose-500/10",
    borderClass: "border-rose-500/30",
    textClass: "text-rose-600 dark:text-rose-400",
    pages: [
      { path: "/predictions", name: "Trip Details", description: "Enter trip information" },
      { path: "/predictions/preferences", name: "Preferences", description: "Set travel preferences" },
      { path: "/predictions/plan", name: "Your Plan", description: "AI-generated travel plan" },
    ],
    features: [
      "AI itinerary generation",
      "Crowd predictions",
      "Weather alerts",
      "Price drop notifications",
      "Safety warnings",
      "Personalized suggestions",
    ],
  },
  {
    number: 6,
    name: "Group Trip Planning",
    fullName: "Collaborative Group Trip Flow",
    description: "A Duolingo-inspired group trip planning wizard that collects preferences from all members, identifies conflicts, and generates a consensus-based itinerary.",
    icon: Users,
    gradient: "from-cyan-500 to-blue-500",
    bgClass: "bg-cyan-500/10",
    borderClass: "border-cyan-500/30",
    textClass: "text-cyan-600 dark:text-cyan-400",
    pages: [
      { path: "/trip/new", name: "Create Trip", description: "Name, destination, dates wizard" },
      { path: "/trip/1/members", name: "Add Members", description: "Invite travel buddies" },
      { path: "/trip/1/preferences", name: "Set Preferences", description: "Each member sets preferences" },
      { path: "/trip/1/conflicts", name: "View Conflicts", description: "Preference conflicts summary" },
      { path: "/trip/1/plan", name: "Trip Plan", description: "Generated group itinerary" },
    ],
    features: [
      "Multi-step trip wizard",
      "Invite link sharing",
      "Per-member preferences",
      "Conflict detection",
      "Consensus building",
      "Group itinerary generation",
    ],
  },
];

// User journeys
const userJourneys = [
  {
    name: "First-Time User",
    description: "New users discovering and onboarding to the platform",
    steps: [
      { group: 0, action: "View community stories", page: "/" },
      { group: 0, action: "Start onboarding wizard", page: "/onboarding" },
      { group: 0, action: "Set travel preferences", page: "/onboarding" },
      { group: 5, action: "Plan first trip", page: "/predictions" },
      { group: 2, action: "Explore dashboard", page: "/dashboard" },
    ],
  },
  {
    name: "Solo Trip Planning",
    description: "Individual users planning their next adventure",
    steps: [
      { group: 5, action: "Enter trip details", page: "/predictions" },
      { group: 5, action: "Set preferences", page: "/predictions/preferences" },
      { group: 5, action: "Review AI plan", page: "/predictions/plan" },
      { group: 2, action: "Check live data", page: "/dashboard" },
      { group: 3, action: "Set budget", page: "/informatics/planner" },
    ],
  },
  {
    name: "Group Trip Planning",
    description: "Planning trips with friends and family",
    steps: [
      { group: 6, action: "Create group trip", page: "/trip/new" },
      { group: 6, action: "Add travel buddies", page: "/trip/1/members" },
      { group: 6, action: "Set member preferences", page: "/trip/1/preferences" },
      { group: 6, action: "Review conflicts", page: "/trip/1/conflicts" },
      { group: 6, action: "View group plan", page: "/trip/1/plan" },
    ],
  },
  {
    name: "During Travel",
    description: "Users currently on their trip",
    steps: [
      { group: 2, action: "Check weather & crowd", page: "/dashboard" },
      { group: 2, action: "View itinerary", page: "/dashboard/itenary" },
      { group: 1, action: "Ask AI for tips", page: "/chat" },
      { group: 3, action: "Log expenses", page: "/informatics/planner/1/expenses" },
    ],
  },
  {
    name: "Post-Trip",
    description: "Users reflecting on their journey",
    steps: [
      { group: 3, action: "Review spending", page: "/informatics/insights" },
      { group: 3, action: "Add reflection", page: "/informatics/reflection" },
      { group: 4, action: "Share story", page: "/community/stories/create" },
      { group: 3, action: "Update goals", page: "/informatics/dashboard" },
    ],
  },
];

function GroupCard({ group }: { group: typeof groups[0] }) {
  const Icon = group.icon;

  return (
    <UnifiedCard className="p-6 h-full">
      <div className="flex items-start gap-4 mb-4">
        <div className={cn(
          "size-14 rounded-2xl flex items-center justify-center shadow-lg",
          `bg-gradient-to-br ${group.gradient}`
        )}>
          <Icon className="size-7 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={cn(group.bgClass, group.textClass, "border-0")}>
              {group.number === 0 ? "Shared" : `Group ${group.number}`}
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
            {group.name}
          </h3>
        </div>
      </div>

      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        {group.description}
      </p>

      {/* Pages */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Pages</h4>
        <div className="space-y-2">
          {group.pages.map((page) => (
            <Link
              key={page.path}
              href={page.path}
              className={cn(
                "flex items-center justify-between p-2 rounded-lg",
                "bg-neutral-50 dark:bg-neutral-800/50",
                "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                "transition-colors group"
              )}
            >
              <div>
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {page.name}
                </span>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {page.description}
                </p>
              </div>
              <ExternalLink className="size-4 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Features</h4>
        <div className="flex flex-wrap gap-1.5">
          {group.features.map((feature) => (
            <Badge
              key={feature}
              variant="outline"
              className="text-xs bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
            >
              {feature}
            </Badge>
          ))}
        </div>
      </div>
    </UnifiedCard>
  );
}

function JourneyFlow({ journey }: { journey: typeof userJourneys[0] }) {
  return (
    <UnifiedCard className="p-6">
      <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-2">
        {journey.name}
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        {journey.description}
      </p>

      <div className="relative">
        {/* Flow line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700" />

        <div className="space-y-4">
          {journey.steps.map((step, index) => {
            const group = groups.find(g => g.number === step.group)!;
            const Icon = group.icon;

            return (
              <Link
                key={index}
                href={step.page}
                className="relative flex items-center gap-4 group"
              >
                {/* Step indicator */}
                <div className={cn(
                  "relative z-10 size-12 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110",
                  `bg-gradient-to-br ${group.gradient}`
                )}>
                  <Icon className="size-5 text-white" />
                </div>

                {/* Step content */}
                <div className="flex-1 flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                        {step.action}
                      </span>
                      <Badge variant="outline" className={cn("text-xs", group.textClass, group.borderClass)}>
                        {step.group === 0 ? "Shared" : `G${step.group}`}
                      </Badge>
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {step.page}
                    </span>
                  </div>
                  <ChevronRight className="size-4 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </UnifiedCard>
  );
}

export default function UserFlowPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 relative">
      <Navigation />
      <AnimatedBackground variant="subtle" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-4">
            <Compass className="size-4" />
            Platform Overview
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
            User Journey & System Map
          </h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-3xl mx-auto">
            Explore how the Jalan-Jalan platform is organized into 7 feature modules,
            each designed to support different aspects of your travel planning experience.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="groups" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="groups">Feature Groups</TabsTrigger>
            <TabsTrigger value="journeys">User Journeys</TabsTrigger>
          </TabsList>

          {/* Groups Tab */}
          <TabsContent value="groups">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <GroupCard key={group.number} group={group} />
              ))}
            </div>

            {/* Quick Stats */}
            <UnifiedCard gradient className="mt-8 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">7</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Feature Modules</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">35+</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Pages</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">45+</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Features</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">5</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">User Journeys</p>
                </div>
              </div>
            </UnifiedCard>
          </TabsContent>

          {/* Journeys Tab */}
          <TabsContent value="journeys">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userJourneys.map((journey) => (
                <JourneyFlow key={journey.name} journey={journey} />
              ))}
            </div>

            {/* Journey Legend */}
            <UnifiedCard className="mt-8 p-6">
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                Group Color Legend
              </h3>
              <div className="flex flex-wrap gap-4">
                {groups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.number} className="flex items-center gap-2">
                      <div className={cn(
                        "size-8 rounded-lg flex items-center justify-center",
                        `bg-gradient-to-br ${group.gradient}`
                      )}>
                        <Icon className="size-4 text-white" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                          {group.number === 0 ? "Shared" : `Group ${group.number}`}
                        </span>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {group.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </UnifiedCard>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-xl mx-auto">
            Begin planning your perfect trip with our AI-powered platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/onboarding">
              <Button className={cn(
                "h-12 px-6 font-semibold",
                "bg-gradient-to-r from-amber-500 to-orange-500",
                "hover:from-amber-600 hover:to-orange-600",
                "text-white border-0",
                "shadow-lg shadow-amber-500/25"
              )}>
                <Sparkles className="size-5 mr-2" />
                Get Started
              </Button>
            </Link>
            <Link href="/trip/new">
              <Button className={cn(
                "h-12 px-6 font-semibold",
                "bg-gradient-to-r from-cyan-500 to-blue-500",
                "hover:from-cyan-600 hover:to-blue-600",
                "text-white border-0",
                "shadow-lg shadow-cyan-500/25"
              )}>
                <Users className="size-5 mr-2" />
                Plan Group Trip
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" className="h-12 px-6 font-semibold">
                <MessageCircle className="size-5 mr-2" />
                Talk to AI
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
