"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Map, MessageSquare, TrendingUp, ArrowRight, BookOpen, Dna, Users, User, Plus } from "lucide-react";
import { DuoMascot } from "./duo-mascot";
import { DuoButton } from "./duo-wizard-layout";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useGamification } from "@/contexts/gamification-context";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: "blue" | "green" | "purple" | "orange";
  index: number;
}

const FeatureCard = ({ icon: Icon, title, description, color, index }: FeatureCardProps) => {
  const colors = {
    blue: "bg-[var(--duo-blue)]/10 text-[var(--duo-blue)] border-[var(--duo-blue)]/20",
    green: "bg-[var(--duo-green)]/10 text-[var(--duo-green)] border-[var(--duo-green)]/20",
    purple: "bg-[var(--duo-purple)]/10 text-[var(--duo-purple)] border-[var(--duo-purple)]/20",
    orange: "bg-[var(--duo-orange)]/10 text-[var(--duo-orange)] border-[var(--duo-orange)]/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className={cn(
        "p-6 rounded-3xl border-2 transition-all hover:scale-[1.02] hover:shadow-lg bg-white",
        "flex flex-col gap-4"
      )}
    >
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", colors[color])}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-extrabold text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

export function LandingHero() {
  const { isFirstTime, onboardingStep } = useGamification();
  const isAuthenticated = !isFirstTime && onboardingStep === "complete";

  return (
    <section className="py-8 md:pt-16 md:pb-8 space-y-12">
      {/* Main Hero Content */}
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="shrink-0"
        >
          <DuoMascot mood="excited" size="xl" className="md:w-64 md:h-64" />
        </motion.div>

        <div className="flex-1 text-center md:text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--duo-yellow)]/10 text-[var(--duo-yellow-dark)] text-sm font-bold mb-4 border border-[var(--duo-yellow)]/20">
              <Sparkles className="w-4 h-4" />
              <span>Smart Travel Planning</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Plan Smarter,<br />
              <span className="text-[var(--duo-green)]">Travel Better.</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
              Discover your unique <strong>Travel DNA</strong>. Whether you're traveling <strong>solo</strong> or in a <strong>group</strong>, we personalize every retreat to match your style.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2"
          >
            {isAuthenticated ? (
              <Link href="/predictions">
                <DuoButton size="lg" className="px-8">
                  Plan New Trip
                  <Plus className="w-5 h-5 ml-2" />
                </DuoButton>
              </Link>
            ) : (
              <Link href="/onboarding">
                <DuoButton size="lg" className="px-8">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </DuoButton>
              </Link>
            )}
            <Link href="/chat">
              <button className="px-8 py-4 rounded-3xl border-2 border-[var(--jj-sky)] text-[var(--jj-sky-dark)] font-bold text-xl hover:bg-[var(--jj-sky)]/10 transition-all flex items-center gap-2 shadow-[0_6px_0_var(--jj-sky-light)] active:translate-y-[6px] active:shadow-none bg-white">
                <Sparkles className="w-5 h-5 text-[var(--duo-yellow)]" />
                Ask AI Assistant
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={Dna}
          title="Travel DNA"
          description="Build your personal travel profile. We analyze your preferences to curate the perfect solo or group experience."
          color="green"
          index={0}
        />
        <FeatureCard 
          icon={Users}
          title="Solo & Group"
          description="Optimized itineraries for everyone. Sync multiple DNA profiles for seamless group holiday planning."
          color="purple"
          index={1}
        />
        <FeatureCard 
          icon={TrendingUp}
          title="Predictive Insights"
          description="Smart analytics that evolve with you. Get ahead of crowds and price drops based on your travel habits."
          color="blue"
          index={2}
        />
      </div>
    </section>
  );
}
