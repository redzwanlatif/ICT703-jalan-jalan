"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  TrendingDown,
  TrendingUp,
  Lightbulb,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Plane,
  Settings,
  Target,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { DuoResponsiveLayout } from "@/components/shared";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DonutChart, WatchlistCard } from "@/components/informatics";
import { useGamification } from "@/contexts/gamification-context";
import { AuthGuard } from "@/components/shared/auth-guard";
import { cn } from "@/lib/utils";

const insights = [
  {
    text: "You tend to overspend on food by 20%. We have adjusted your next budget recommendation.",
  },
  {
    text: "You missed typical local events during your last travel period. Consider checking local calendars next time.",
  },
  {
    text: "You travelled during the peak period. If you had travelled a week earlier, you could have saved around RM 50.00.",
  },
  {
    text: "Your accommodation costs have decreased by 15% compared to last year. Great job finding better deals!",
  },
  {
    text: "You typically book flights 3 weeks before departure. Booking 6 weeks early could save you up to 25%.",
  },
];

const currencyRates = [
  { currency: "EUR", rate: 4.72, change: 0.02, flag: "🇪🇺" },
  { currency: "GBP", rate: 5.58, change: -0.03, flag: "🇬🇧" },
  { currency: "CHF", rate: 4.89, change: 0.01, flag: "🇨🇭" },
];

export default function InformaticsDashboardPage() {
  const router = useRouter();
  const { annualBudget } = useGamification();
  const [currentInsight, setCurrentInsight] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
      setIsAnimating(false);
    }, 300);
    setIsPaused(true);
  };

  const goToPrevious = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentInsight((prev) => (prev - 1 + insights.length) % insights.length);
      setIsAnimating(false);
    }, 300);
    setIsPaused(true);
  };

  const goToInsight = (index: number) => {
    if (index === currentInsight) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentInsight(index);
      setIsAnimating(false);
    }, 300);
    setIsPaused(true);
  };

  useEffect(() => {
    if (isPaused) {
      const timeout = setTimeout(() => setIsPaused(false), 10000);
      return () => clearTimeout(timeout);
    }
  }, [isPaused, currentInsight]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentInsight((prev) => (prev + 1) % insights.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <AuthGuard>
      <DuoResponsiveLayout showTopBar showBottomNav>
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <DuoMascot mood="happy" size="sm" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Welcome back, Traveler</p>
            <h1 className="text-2xl font-extrabold">My Travel Pulse</h1>
          </div>
          <Link href="/informatics/settings">
            <button className="w-10 h-10 rounded-xl border-2 border-border flex items-center justify-center hover:bg-muted transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </Link>
        </motion.div>

        {/* Donut Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="duo-card p-6"
          style={{
            background: "linear-gradient(135deg, var(--duo-green) 0%, var(--duo-green-dark) 100%)",
            borderColor: "var(--duo-green-dark)",
          }}
        >
          <DonutChart percentage={65} label="Yearly Budget Used" total={`RM ${annualBudget.toLocaleString()}`} variant="on-colored-bg" />
        </motion.div>

        {/* Metric Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="duo-card p-4 text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-[var(--duo-purple)]/20 flex items-center justify-center mb-2">
              <Plane className="w-5 h-5 text-[var(--duo-purple)]" />
            </div>
            <p className="text-2xl font-extrabold">4</p>
            <p className="text-xs text-muted-foreground">Trips Taken</p>
          </div>

          <div className="duo-card p-4 text-center" style={{ borderColor: "var(--duo-orange)" }}>
            <div className="w-10 h-10 mx-auto rounded-xl bg-[var(--duo-orange)]/20 flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-[var(--duo-orange)]" />
            </div>
            <p className="text-2xl font-extrabold text-[var(--duo-orange)]">12%</p>
            <p className="text-xs text-muted-foreground">Avg. Overspend</p>
          </div>

          <div className="duo-card p-4 text-center" style={{ borderColor: "var(--duo-green)" }}>
            <div className="w-10 h-10 mx-auto rounded-xl bg-[var(--duo-green)]/20 flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-[var(--duo-green)]" />
            </div>
            <p className="text-2xl font-extrabold text-[var(--duo-green)]">88%</p>
            <p className="text-xs text-muted-foreground">Savings Goal</p>
          </div>
        </motion.div>

        {/* Watchlist */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="font-extrabold flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-[var(--duo-blue)]" />
            Active Trip Watchlist
          </h2>
          <div className="space-y-3">
            <WatchlistCard
              destination="London"
              country="United Kingdom"
              priceStatus="falling"
              change={-8}
              avgPrice="RM 3,200"
            />
            <WatchlistCard
              destination="Tokyo"
              country="Japan"
              priceStatus="rising"
              change={5}
              avgPrice="RM 4,500"
            />
          </div>
        </motion.section>

        {/* Insight Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="duo-card p-5"
          style={{ borderColor: "var(--duo-yellow)" }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--duo-yellow)] flex items-center justify-center flex-shrink-0 shadow-[0_4px_0_#E5A800]">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="font-bold">AI Insight</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--duo-purple)]/20 text-[var(--duo-purple)]">
                    AI
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                    onClick={goToPrevious}
                    disabled={insights.length <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                    onClick={goToNext}
                    disabled={insights.length <= 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div
                className={cn(
                  "transition-all duration-300",
                  isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                )}
              >
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insights[currentInsight].text}
                </p>
              </div>
              {/* Progress dots */}
              <div className="flex gap-1.5 mt-4">
                {insights.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToInsight(index)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      index === currentInsight
                        ? "w-6 bg-[var(--duo-yellow)]"
                        : "w-1.5 bg-[var(--duo-yellow)]/30 hover:bg-[var(--duo-yellow)]/50"
                    )}
                    aria-label={`Go to insight ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Currency Exchange Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="duo-card p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold flex items-center gap-2">
              💱 Currency Watch
            </h3>
            <RefreshCw className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          </div>
          <div className="space-y-2.5">
            {currencyRates.map((rate) => (
              <div key={rate.currency} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{rate.flag}</span>
                  <span className="text-sm font-semibold">{rate.currency}/MYR</span>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className="text-sm font-bold">
                    {rate.rate.toFixed(2)}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-full",
                      rate.change >= 0
                        ? "bg-[var(--duo-green)]/20 text-[var(--duo-green)]"
                        : "bg-[var(--duo-red)]/20 text-[var(--duo-red)]"
                    )}
                  >
                    {rate.change >= 0 ? "+" : ""}
                    {rate.change.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 text-center">Live rates • Updated just now</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-2 gap-3"
        >
          <Link href="/informatics/edit-dna">
            <button className="w-full duo-btn duo-btn-outline py-3">
              <Pencil className="w-5 h-5 mr-2" />
              Edit Travel DNA
            </button>
          </Link>
          <Link href="/predictions">
            <button className="w-full duo-btn py-3">
              <Sparkles className="w-5 h-5 mr-2" />
              Plan Trip
            </button>
          </Link>
        </motion.div>

        {/* XP Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2"
        >
          <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
          <span>
            Complete a trip to earn <strong className="text-[var(--duo-green)]">+100 XP</strong>!
          </span>
        </motion.div>
      </div>
      </DuoResponsiveLayout>
    </AuthGuard>
  );
}
