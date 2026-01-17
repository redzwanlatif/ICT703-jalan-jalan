"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Users,
  ChevronRight,
  Sparkles,
  Star,
  Plus,
  Ticket,
  BookOpen,
  TrendingUp,
  Clock,
} from "lucide-react";
import { DuoAppShell } from "@/components/shared/duo-bottom-nav";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DuoButton } from "@/components/shared/duo-wizard-layout";
import { cn } from "@/lib/utils";

// Trip data
const trips = [
  {
    id: 1,
    title: "Malacca River Walk",
    dates: "25th - 26th Feb 2026",
    status: "active" as const,
    emoji: "🚣",
  },
  {
    id: 2,
    title: "Baba Nyonya Museum",
    dates: "25th - 26th Mar 2026",
    status: "upcoming" as const,
    emoji: "🏛️",
  },
  {
    id: 3,
    title: "Menara Taming Sari",
    dates: "25th - 26th Apr 2026",
    status: "upcoming" as const,
    emoji: "🗼",
  },
];

// Events data
const events = [
  {
    id: 1,
    title: "Jom Cuti Sekolah 2026",
    subtitle: "School holiday travel deals",
    date: "12 - 15 Jan",
    location: "Ayer Keroh, Melaka",
    type: "Promotion",
    color: "var(--duo-yellow)",
    emoji: "🎉",
  },
  {
    id: 2,
    title: "Cuti Muslim-Friendly Fair",
    subtitle: "Muslim-friendly packages",
    date: "18 - 20 Jan",
    location: "Ayer Molek, Melaka",
    type: "Travel Fair",
    color: "var(--duo-green)",
    emoji: "🌙",
  },
  {
    id: 3,
    title: "Play Your Way Festival",
    subtitle: "Interactive activities for all",
    date: "5 - 7 Feb",
    location: "Pantai Klebang",
    type: "Festival",
    color: "var(--duo-purple)",
    emoji: "🎪",
  },
];

// Stories data
const stories = [
  {
    id: 1,
    place: "Malacca Sultanate Museum",
    author: "Imran Rosli",
    badge: "Verified Local",
    tags: ["#LocalTourist", "#Melaka"],
    color: "var(--duo-blue)",
  },
  {
    id: 2,
    place: "Muzium Samudera",
    author: "Farah Shazwanie",
    badge: "Frequent Traveller",
    tags: ["#Melaka"],
    color: "var(--duo-purple)",
  },
  {
    id: 3,
    place: "Kampung Morten",
    author: "Hafiz Suhaimi",
    badge: "Verified Local",
    tags: ["#Local", "#Tourist"],
    color: "var(--duo-orange)",
  },
];

export default function CommunityPage() {
  return (
    <DuoAppShell showTopBar showBottomNav>
      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <DuoMascot mood="happy" size="sm" />
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">Community</h1>
            <p className="text-muted-foreground">Trips, events & stories</p>
          </div>
        </motion.div>

        {/* My Trips Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[var(--duo-green)]" />
              My Trips
            </h2>
            <Link
              href="/predictions"
              className="text-sm font-bold text-[var(--duo-blue)] hover:underline flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              New Trip
            </Link>
          </div>

          <div className="space-y-2">
            {trips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Link href={`/trip/${trip.id}/plan`}>
                  <div className="duo-card duo-card-interactive p-4 flex items-center gap-4">
                    <span className="text-3xl">{trip.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate">{trip.title}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {trip.dates}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        trip.status === "active"
                          ? "bg-[var(--duo-green)]/20 text-[var(--duo-green)]"
                          : "bg-[var(--duo-orange)]/20 text-[var(--duo-orange)]"
                      )}
                    >
                      {trip.status === "active" ? "Active" : "Upcoming"}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Upcoming Events Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[var(--duo-purple)]" />
              Upcoming Events
            </h2>
            <Link
              href="/community/events"
              className="text-sm font-bold text-[var(--duo-blue)] hover:underline flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="flex-shrink-0 w-[200px]"
              >
                <div
                  className="duo-card p-4 h-full"
                  style={{ borderColor: event.color }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{event.emoji}</span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                      style={{
                        background: `color-mix(in srgb, ${event.color} 20%, transparent)`,
                        color: event.color,
                      }}
                    >
                      {event.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm mb-1 line-clamp-1">{event.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                    {event.subtitle}
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {event.date}
                    </p>
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Community Stories Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[var(--duo-orange)]" />
              Community Stories
            </h2>
            <Link
              href="/community/stories"
              className="text-sm font-bold text-[var(--duo-blue)] hover:underline flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-2">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Link href={`/community/stories/${story.id}`}>
                  <div
                    className="duo-card duo-card-interactive p-4"
                    style={{ borderColor: story.color }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: `color-mix(in srgb, ${story.color} 20%, transparent)`,
                        }}
                      >
                        <MapPin
                          className="w-6 h-6"
                          style={{ color: story.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold truncate">{story.place}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            by {story.author}
                          </span>
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                            style={{
                              background: `color-mix(in srgb, ${story.color} 20%, transparent)`,
                              color: story.color,
                            }}
                          >
                            {story.badge}
                          </span>
                        </div>
                        <div className="flex gap-1 mt-2">
                          {story.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Create Story CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 pt-4"
        >
          <Link href="/community/stories/create">
            <DuoButton fullWidth>
              <Plus className="w-5 h-5 mr-2" />
              Share Your Story
            </DuoButton>
          </Link>

          {/* XP Hint */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
            <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
            <span>
              Earn <strong className="text-[var(--duo-green)]">+25 XP</strong> for
              sharing stories!
            </span>
          </div>
        </motion.div>
      </div>
    </DuoAppShell>
  );
}
