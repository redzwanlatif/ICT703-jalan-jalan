"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Map,
  Users,
  BarChart3,
  MessageCircle,
  Sparkles,
  ChevronRight,
  Flame,
  Trophy,
  Target,
  Compass,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useGamification, getXpProgress } from "@/contexts/gamification-context";
import { DuoAppShell } from "@/components/shared/duo-bottom-nav";
import { DuoMascot, DuoMascotWithSpeech } from "@/components/shared/duo-mascot";
import { DuoButton, DuoProgressRing } from "@/components/shared/duo-wizard-layout";
import { cn } from "@/lib/utils";

// ============================================================================
// Feature Cards
// ============================================================================

const features = [
  {
    title: "Plan a Trip",
    description: "Create your perfect itinerary",
    icon: Map,
    href: "/predictions",
    color: "var(--duo-green)",
    colorDark: "var(--duo-green-dark)",
    xp: 25,
  },
  {
    title: "AI Chat",
    description: "Get instant travel advice",
    icon: MessageCircle,
    href: "/chat",
    color: "var(--duo-blue)",
    colorDark: "var(--duo-blue-dark)",
    xp: 15,
  },
  {
    title: "Dashboard",
    description: "Live travel data & insights",
    icon: BarChart3,
    href: "/dashboard",
    color: "var(--duo-orange)",
    colorDark: "var(--duo-orange-dark)",
    xp: 10,
  },
  {
    title: "Community",
    description: "Connect with travelers",
    icon: Users,
    href: "/community",
    color: "var(--duo-purple)",
    colorDark: "var(--duo-purple-dark)",
    xp: 20,
  },
];

// ============================================================================
// Daily Quests
// ============================================================================

const dailyQuests = [
  {
    id: "plan-trip",
    title: "Plan a trip",
    description: "Start planning your next adventure",
    xp: 25,
    progress: 0,
    target: 1,
    icon: Compass,
  },
  {
    id: "chat-ai",
    title: "Chat with AI",
    description: "Ask a travel question",
    xp: 15,
    progress: 0,
    target: 1,
    icon: MessageCircle,
  },
  {
    id: "explore-dashboard",
    title: "Check dashboard",
    description: "View travel insights",
    xp: 10,
    progress: 0,
    target: 1,
    icon: BarChart3,
  },
];

// ============================================================================
// Feature Card Component
// ============================================================================

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  colorDark: string;
  xp: number;
  index: number;
}

function FeatureCard({ title, description, icon: Icon, href, color, colorDark, xp, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={href} className="block">
        <div
          className="duo-card duo-card-interactive p-5 group"
          style={{
            borderColor: color,
            boxShadow: `0 4px 0 ${colorDark}`,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
              style={{ background: color }}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">{title}</h3>
              <p className="text-sm text-muted-foreground truncate">{description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="duo-xp-badge text-xs">+{xp} XP</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================================================
// Quest Card Component
// ============================================================================

interface QuestCardProps {
  quest: typeof dailyQuests[0];
  index: number;
}

function QuestCard({ quest, index }: QuestCardProps) {
  const Icon = quest.icon;
  const progress = (quest.progress / quest.target) * 100;
  const completed = quest.progress >= quest.target;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl border-2",
        completed
          ? "bg-[var(--duo-green)]/10 border-[var(--duo-green)]"
          : "bg-card border-border"
      )}
      style={{
        boxShadow: completed
          ? "0 4px 0 var(--duo-green-dark)"
          : "0 4px 0 var(--border)",
      }}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
          completed ? "bg-[var(--duo-green)]" : "bg-muted"
        )}
      >
        <Icon className={cn("w-6 h-6", completed ? "text-white" : "text-muted-foreground")} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={cn("font-bold", completed && "line-through text-muted-foreground")}>
          {quest.title}
        </h4>
        <p className="text-sm text-muted-foreground">{quest.description}</p>
      </div>
      <div className="text-right shrink-0">
        <span className={cn(
          "font-bold text-sm",
          completed ? "text-[var(--duo-green)]" : "text-muted-foreground"
        )}>
          +{quest.xp} XP
        </span>
        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden mt-1">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              background: completed ? "var(--duo-green)" : "var(--duo-blue)",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Stats Card
// ============================================================================

function StatsCard() {
  const { xp, level, streak } = useGamification();
  const xpProgress = getXpProgress(xp, level);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="duo-card p-5"
    >
      <div className="flex items-center gap-4">
        {/* Progress Ring */}
        <DuoProgressRing progress={xpProgress} size={70} strokeWidth={6}>
          <div className="text-center">
            <span className="font-extrabold text-lg">{level.level}</span>
          </div>
        </DuoProgressRing>

        {/* Stats */}
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-lg">{level.title}</h3>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
              <span className="font-bold text-sm">{xp} XP</span>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-[var(--duo-orange)]" />
              <span className="font-bold text-sm">{streak} day streak</span>
            </div>
          </div>
          {/* XP to next level */}
          <div className="mt-2">
            <div className="duo-xp-bar">
              <div
                className="duo-xp-fill"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {level.maxXp === Infinity
                ? "Max level reached!"
                : `${level.maxXp - xp} XP to next level`}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function HomePage() {
  const router = useRouter();
  const { isFirstTime, onboardingStep, level, travelStyle } = useGamification();

  // Redirect first-time users to onboarding
  useEffect(() => {
    if (isFirstTime && onboardingStep !== "complete") {
      router.replace("/onboarding");
    }
  }, [isFirstTime, onboardingStep, router]);

  // Show loading state while checking
  if (isFirstTime && onboardingStep !== "complete") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <DuoMascot mood="happy" size="lg" animate />
      </div>
    );
  }

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Get mascot message
  const getMascotMessage = () => {
    if (!travelStyle) return "Ready for your next adventure?";
    switch (travelStyle) {
      case "budget":
        return "Let's find some great deals!";
      case "comfort":
        return "Time to plan something nice!";
      case "luxury":
        return "Premium experiences await!";
      default:
        return "Where to next?";
    }
  };

  return (
    <DuoAppShell>
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Greeting with Mascot */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4"
        >
          <DuoMascot mood="happy" size="md" />
          <div className="flex-1 pt-2">
            <h1 className="text-2xl font-extrabold">
              {getGreeting()}, Explorer!
            </h1>
            <p className="text-muted-foreground">{getMascotMessage()}</p>
          </div>
        </motion.div>

        {/* Stats Card */}
        <StatsCard />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-extrabold text-lg mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-[var(--duo-green)]" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Daily Quests */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="font-extrabold text-lg mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[var(--duo-orange)]" />
            Daily Quests
          </h2>
          <div className="space-y-3">
            {dailyQuests.map((quest, index) => (
              <QuestCard key={quest.id} quest={quest} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Trending Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="font-extrabold text-lg mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--duo-purple)]" />
            Trending Destinations
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {[
              { name: "Langkawi", emoji: "🏝️", travelers: "2.1k" },
              { name: "Penang", emoji: "🍜", travelers: "1.8k" },
              { name: "Cameron", emoji: "🍓", travelers: "1.2k" },
              { name: "Tioman", emoji: "🐠", travelers: "890" },
            ].map((dest, index) => (
              <Link key={dest.name} href={`/predictions?destination=${dest.name}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="duo-card duo-card-interactive p-4 min-w-[140px] text-center"
                >
                  <span className="text-3xl">{dest.emoji}</span>
                  <h4 className="font-bold mt-2">{dest.name}</h4>
                  <p className="text-xs text-muted-foreground">{dest.travelers} travelers</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Start Planning CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="duo-card p-6 text-center"
          style={{
            background: "linear-gradient(135deg, var(--duo-green) 0%, var(--duo-green-dark) 100%)",
            borderColor: "var(--duo-green-dark)",
            boxShadow: "0 4px 0 var(--duo-green-dark)",
          }}
        >
          <h3 className="font-extrabold text-xl text-white mb-2">
            Ready to explore?
          </h3>
          <p className="text-white/80 text-sm mb-4">
            Plan your next adventure and earn XP!
          </p>
          <Link href="/predictions">
            <button className="w-full py-3 px-6 bg-white text-[var(--duo-green)] font-bold rounded-2xl hover:bg-white/90 transition-all">
              Start Planning <ChevronRight className="w-5 h-5 inline ml-1" />
            </button>
          </Link>
        </motion.div>

        {/* User Flow Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <Link
            href="/user-flow"
            className="text-sm text-muted-foreground hover:text-[var(--duo-blue)] transition-colors"
          >
            View User Journey Map →
          </Link>
        </motion.div>
      </div>
    </DuoAppShell>
  );
}
