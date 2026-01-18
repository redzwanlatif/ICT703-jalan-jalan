"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Compass,
  LayoutDashboard,
  PlaneTakeoff,
  Wallet,
  BookOpen,
  BarChart3,
  Settings,
  ArrowRight,
  ArrowDown,
  Sparkles,
  User,
  CheckCircle2,
  Circle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

type FlowStep = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  phase: "setup" | "plan" | "track" | "reflect" | "analyze";
  isOptional?: boolean;
};

const flowSteps: FlowStep[] = [
  {
    id: "onboarding",
    title: "My Profile",
    subtitle: "Define Your Style",
    description: "Set your travel preferences, budget goals, and pacing style",
    icon: <Sparkles className="w-6 h-6" />,
    route: "/informatics",
    phase: "setup",
  },
  {
    id: "dashboard",
    title: "My Pulse",
    subtitle: "Your Home Base",
    description: "Overview of your travel health, watchlist, and quick insights",
    icon: <LayoutDashboard className="w-6 h-6" />,
    route: "/informatics/dashboard",
    phase: "plan",
  },
  {
    id: "planner",
    title: "Trip Planner",
    subtitle: "Plan Your Journey",
    description: "Create trips, set budgets, and organize your upcoming adventures",
    icon: <PlaneTakeoff className="w-6 h-6" />,
    route: "/informatics/planner",
    phase: "plan",
  },
  {
    id: "expenses",
    title: "Expense Tracker",
    subtitle: "Track Spending",
    description: "Log expenses in real-time during your trip",
    icon: <Wallet className="w-6 h-6" />,
    route: "/informatics/planner/1/expenses",
    phase: "track",
  },
  {
    id: "reflection",
    title: "Trip Reflection",
    subtitle: "Learn & Improve",
    description: "Review your trip, analyze spending, and capture lessons",
    icon: <BookOpen className="w-6 h-6" />,
    route: "/informatics/reflection",
    phase: "reflect",
  },
  {
    id: "insights",
    title: "Spending Insights",
    subtitle: "Deep Analytics",
    description: "Understand your travel patterns and spending behavior",
    icon: <BarChart3 className="w-6 h-6" />,
    route: "/informatics/insights",
    phase: "analyze",
    isOptional: true,
  },
  {
    id: "settings",
    title: "Settings",
    subtitle: "Preferences",
    description: "Manage your profile, notifications, and privacy",
    icon: <Settings className="w-6 h-6" />,
    route: "/informatics/settings",
    phase: "setup",
    isOptional: true,
  },
];

const phases = [
  { id: "setup", label: "Setup", color: "bg-purple-500" },
  { id: "plan", label: "Plan", color: "bg-blue-500" },
  { id: "track", label: "Track", color: "bg-amber-500" },
  { id: "reflect", label: "Reflect", color: "bg-green-500" },
  { id: "analyze", label: "Analyze", color: "bg-teal-500" },
];

export default function UserFlowPage() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>(["onboarding"]);

  const getPhaseColor = (phase: string) => {
    const phaseObj = phases.find((p) => p.id === phase);
    return phaseObj?.color || "bg-gray-500";
  };

  const getPhaseTextColor = (phase: string) => {
    switch (phase) {
      case "setup":
        return "text-purple-600 dark:text-purple-400";
      case "plan":
        return "text-blue-600 dark:text-blue-400";
      case "track":
        return "text-amber-600 dark:text-amber-400";
      case "reflect":
        return "text-green-600 dark:text-green-400";
      case "analyze":
        return "text-teal-600 dark:text-teal-400";
      default:
        return "text-gray-600";
    }
  };

  const getPhaseBgColor = (phase: string) => {
    switch (phase) {
      case "setup":
        return "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800";
      case "plan":
        return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800";
      case "track":
        return "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800";
      case "reflect":
        return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
      case "analyze":
        return "bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const mainFlow = flowSteps.filter((s) => !s.isOptional);
  const optionalSteps = flowSteps.filter((s) => s.isOptional);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Group Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              GROUP 3
            </span>
            <span className="text-xs text-muted-foreground">
              Personal Travel Informatics
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-xl">
              <Compass className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Your Travel Journey</h1>
              <p className="text-sm text-muted-foreground">
                Follow this flow to get the most out of Travel Pulse
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Module Overview */}
        <Card className="mb-6 border-teal-200 dark:border-teal-800 bg-gradient-to-r from-teal-50 to-transparent dark:from-teal-950/30">
          <CardContent className="p-4">
            <h2 className="font-semibold text-teal-700 dark:text-teal-300 mb-2">
              Module Overview
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              Group 3 provides <strong>Personal Travel Informatics</strong> — a system for tracking,
              analyzing, and improving your travel behavior through data-driven insights.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 rounded bg-white dark:bg-slate-800 border">
                9 Screens
              </span>
              <span className="text-xs px-2 py-1 rounded bg-white dark:bg-slate-800 border">
                Budget Tracking
              </span>
              <span className="text-xs px-2 py-1 rounded bg-white dark:bg-slate-800 border">
                Trip Planning
              </span>
              <span className="text-xs px-2 py-1 rounded bg-white dark:bg-slate-800 border">
                Spending Analytics
              </span>
              <span className="text-xs px-2 py-1 rounded bg-white dark:bg-slate-800 border">
                Post-Trip Reflection
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Phase Legend */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-3 text-muted-foreground">
              THE TRAVEL LIFECYCLE
            </p>
            <div className="flex flex-wrap gap-2">
              {phases.map((phase, index) => (
                <div key={phase.id} className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${phase.color}`}
                  />
                  <span className="text-sm font-medium">{phase.label}</span>
                  {index < phases.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Flow - Visual Journey */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ArrowDown className="w-5 h-5" />
            Main Journey
          </h2>

          {mainFlow.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Connector Line */}
              {index < mainFlow.length - 1 && (
                <div className="absolute left-8 top-full w-0.5 h-4 bg-gradient-to-b from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-700 z-0" />
              )}

              <Link href={step.route}>
                <Card
                  className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer border-2 ${getPhaseBgColor(step.phase)} ${
                    activeStep === step.id ? "ring-2 ring-primary" : ""
                  }`}
                  onMouseEnter={() => setActiveStep(step.id)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  {/* Phase indicator bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${getPhaseColor(step.phase)}`}
                  />

                  <CardContent className="p-4 pl-5">
                    <div className="flex items-start gap-4">
                      {/* Step Number & Icon */}
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${getPhaseColor(step.phase)} text-white shadow-lg`}
                        >
                          {step.icon}
                        </div>
                        <span className="text-xs font-bold text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{step.title}</h3>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPhaseColor(step.phase)} text-white`}
                          >
                            {step.subtitle}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>

                      {/* Status & Arrow */}
                      <div className="flex items-center gap-2">
                        {completedSteps.includes(step.id) ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground/30" />
                        )}
                        <ArrowRight
                          className={`w-5 h-5 transition-transform ${
                            activeStep === step.id
                              ? "translate-x-1 text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        {/* Optional/Anytime Access */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-muted-foreground">
            <Settings className="w-5 h-5" />
            Access Anytime
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {optionalSteps.map((step) => (
              <Link key={step.id} href={step.route}>
                <Card
                  className={`h-full transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer border ${getPhaseBgColor(step.phase)}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPhaseColor(step.phase)} text-white`}
                      >
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {step.subtitle}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Start CTA */}
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold mb-1">Ready to Start?</h3>
                <p className="text-white/80 text-sm">
                  Begin your journey by setting up your Profile
                </p>
              </div>
              <Link href="/informatics">
                <Button
                  variant="secondary"
                  size="lg"
                  className="gap-2 font-semibold"
                >
                  <Sparkles className="w-4 h-4" />
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Flow Diagram - Visual Map */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5" />
            Visual Flow Map
          </h2>

          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="relative">
                {/* SVG Flow Diagram */}
                <svg
                  viewBox="0 0 800 400"
                  className="w-full h-auto"
                  style={{ minHeight: "300px" }}
                >
                  {/* Background Grid */}
                  <defs>
                    <pattern
                      id="grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        className="text-slate-200 dark:text-slate-800"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Flow Arrows */}
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3.5, 0 7"
                        className="fill-slate-400"
                      />
                    </marker>
                  </defs>

                  {/* Connection Lines */}
                  {/* Onboarding to Dashboard */}
                  <path
                    d="M 150 80 L 150 140"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-purple-400"
                    markerEnd="url(#arrowhead)"
                  />

                  {/* Dashboard to Planner */}
                  <path
                    d="M 200 180 L 300 180"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-blue-400"
                    markerEnd="url(#arrowhead)"
                  />

                  {/* Planner to Expenses */}
                  <path
                    d="M 400 220 L 400 280"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-amber-400"
                    markerEnd="url(#arrowhead)"
                  />

                  {/* Expenses to Reflection */}
                  <path
                    d="M 450 320 L 550 320"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-green-400"
                    markerEnd="url(#arrowhead)"
                  />

                  {/* Reflection back to Dashboard (cycle) */}
                  <path
                    d="M 650 280 Q 700 200 650 140 Q 600 100 200 140"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                    className="text-slate-400"
                    markerEnd="url(#arrowhead)"
                  />

                  {/* Dashboard to Insights (optional) */}
                  <path
                    d="M 100 180 L 100 280"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="text-teal-400"
                    markerEnd="url(#arrowhead)"
                  />

                  {/* Nodes */}
                  {/* Onboarding */}
                  <g transform="translate(100, 30)">
                    <rect
                      width="100"
                      height="50"
                      rx="8"
                      className="fill-purple-500"
                    />
                    <text
                      x="50"
                      y="30"
                      textAnchor="middle"
                      className="fill-white text-xs font-medium"
                    >
                      My Profile
                    </text>
                  </g>

                  {/* Dashboard */}
                  <g transform="translate(100, 140)">
                    <rect
                      width="100"
                      height="60"
                      rx="8"
                      className="fill-blue-500"
                    />
                    <text
                      x="50"
                      y="25"
                      textAnchor="middle"
                      className="fill-white text-xs font-bold"
                    >
                      DASHBOARD
                    </text>
                    <text
                      x="50"
                      y="42"
                      textAnchor="middle"
                      className="fill-white/80 text-xs"
                    >
                      Home Base
                    </text>
                  </g>

                  {/* Planner */}
                  <g transform="translate(300, 140)">
                    <rect
                      width="100"
                      height="60"
                      rx="8"
                      className="fill-blue-500"
                    />
                    <text
                      x="50"
                      y="25"
                      textAnchor="middle"
                      className="fill-white text-xs font-bold"
                    >
                      PLANNER
                    </text>
                    <text
                      x="50"
                      y="42"
                      textAnchor="middle"
                      className="fill-white/80 text-xs"
                    >
                      Create Trips
                    </text>
                  </g>

                  {/* Expenses */}
                  <g transform="translate(350, 280)">
                    <rect
                      width="100"
                      height="60"
                      rx="8"
                      className="fill-amber-500"
                    />
                    <text
                      x="50"
                      y="25"
                      textAnchor="middle"
                      className="fill-white text-xs font-bold"
                    >
                      EXPENSES
                    </text>
                    <text
                      x="50"
                      y="42"
                      textAnchor="middle"
                      className="fill-white/80 text-xs"
                    >
                      Track Spending
                    </text>
                  </g>

                  {/* Reflection */}
                  <g transform="translate(550, 280)">
                    <rect
                      width="100"
                      height="60"
                      rx="8"
                      className="fill-green-500"
                    />
                    <text
                      x="50"
                      y="25"
                      textAnchor="middle"
                      className="fill-white text-xs font-bold"
                    >
                      REFLECT
                    </text>
                    <text
                      x="50"
                      y="42"
                      textAnchor="middle"
                      className="fill-white/80 text-xs"
                    >
                      Learn & Grow
                    </text>
                  </g>

                  {/* Insights (optional) */}
                  <g transform="translate(50, 280)">
                    <rect
                      width="100"
                      height="50"
                      rx="8"
                      className="fill-teal-500"
                      opacity="0.8"
                    />
                    <text
                      x="50"
                      y="30"
                      textAnchor="middle"
                      className="fill-white text-xs font-medium"
                    >
                      Insights
                    </text>
                  </g>

                  {/* Legend */}
                  <g transform="translate(550, 50)">
                    <text
                      x="0"
                      y="0"
                      className="fill-slate-500 text-xs font-medium"
                    >
                      Legend:
                    </text>
                    <line
                      x1="0"
                      y1="20"
                      x2="40"
                      y2="20"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-slate-400"
                    />
                    <text
                      x="50"
                      y="24"
                      className="fill-slate-500 text-xs"
                    >
                      Main flow
                    </text>
                    <line
                      x1="0"
                      y1="40"
                      x2="40"
                      y2="40"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="text-slate-400"
                    />
                    <text
                      x="50"
                      y="44"
                      className="fill-slate-500 text-xs"
                    >
                      Optional / Return
                    </text>
                  </g>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Scenarios */}
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold">Common User Scenarios</h2>

          <div className="grid gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-sm font-bold text-purple-600">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">First-Time User</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      My Profile → Dashboard → Explore features
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                        Onboarding
                      </span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                        Dashboard
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-bold text-blue-600">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Planning a Trip</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Dashboard → Planner → Create new trip with budget
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                        Dashboard
                      </span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                        Planner
                      </span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                        New Trip
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-sm font-bold text-amber-600">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">During a Trip</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Planner → Active Trip → Log expenses in real-time
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                        Planner
                      </span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">
                        Expenses
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-sm font-bold text-green-600">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">After a Trip</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Reflection → Analyze spending → Save lessons learned
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                        Reflection
                      </span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded">
                        Insights
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
