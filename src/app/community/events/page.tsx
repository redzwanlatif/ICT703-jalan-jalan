"use client";

import { motion } from "framer-motion";
import { Ticket, Calendar, Sparkles } from "lucide-react";
import { DuoResponsiveLayout } from "@/components/shared";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { EventCard } from "@/components/community/event-card";

export default function UpcomingEventsPage() {
  const events = [
    {
      title: "Jom Cuti Sekolah 2025",
      subtitle: "School holiday travel deals and family activities",
      date: "12 - 15 January 2025",
      location: "Ayer Keroh, Melaka",
      type: "Promotion Event",
      badges: ["Family-friendly", "School Holiday"],
      imageGradient: "bg-gradient-to-br from-yellow-200 to-orange-300",
      image: "event-01.webp"
    },
    {
      title: "Cuti Cuti Muslim-Friendly Fair",
      subtitle: "Muslim-friendly travel packages and experiences",
      date: "18 - 20 January 2025",
      location: "Ayer Molek, Melaka",
      type: "Travel Fair",
      badges: ["Muslim-friendly", "Travel Deals"],
      imageGradient: "bg-gradient-to-br from-green-200 to-teal-300",
      image: "event-02.webp"
    },
    {
      title: "Play Your Way to Joy Festival",
      subtitle: "Interactive activities and attractions for all ages",
      date: "5 - 7 February",
      location: "Ayer Keroh, Melaka",
      type: "Festival",
      badges: ["Family-friendly", "Popular Event"],
      imageGradient: "bg-gradient-to-br from-purple-200 to-pink-300",
      image: "event-03.webp"
    },
    {
      title: "Jom Cuti Sekolah 2025",
      subtitle: "School holiday travel deals and family activities",
      date: "12 - 15 January 2025",
      location: "Ayer Keroh, Melaka",
      type: "Promotion Event",
      badges: ["Family-friendly", "School Holiday"],
      imageGradient: "bg-gradient-to-br from-yellow-200 to-orange-300",
      image: "event-01.webp"
    },
    {
      title: "Cuti Cuti Muslim-Friendly Fair",
      subtitle: "Muslim-friendly travel packages and experiences",
      date: "18 - 20 January 2025",
      location: "Ayer Molek, Melaka",
      type: "Travel Fair",
      badges: ["Muslim-friendly", "Travel Deals"],
      imageGradient: "bg-gradient-to-br from-green-200 to-teal-300",
      image: "event-02.webp"
    },
    {
      title: "Play Your Way to Joy Festival",
      subtitle: "Interactive activities and attractions for all ages",
      date: "5 - 7 February",
      location: "Ayer Keroh, Melaka",
      type: "Festival",
      badges: ["Family-friendly", "Popular Event"],
      imageGradient: "bg-gradient-to-br from-purple-200 to-pink-300",
      image: "event-03.webp"
    },
    {
      title: "Jom Cuti Sekolah 2025",
      subtitle: "School holiday travel deals and family activities",
      date: "12 - 15 January 2025",
      location: "Ayer Keroh, Melaka",
      type: "Promotion Event",
      badges: ["Family-friendly", "School Holiday"],
      imageGradient: "bg-gradient-to-br from-yellow-200 to-orange-300",
      image: "event-01.webp"
    },
    {
      title: "Cuti Cuti Muslim-Friendly Fair",
      subtitle: "Muslim-friendly travel packages and experiences",
      date: "18 - 20 January 2025",
      location: "Ayer Molek, Melaka",
      type: "Travel Fair",
      badges: ["Muslim-friendly", "Travel Deals"],
      imageGradient: "bg-gradient-to-br from-green-200 to-teal-300",
      image: "event-02.webp"
    },
    {
      title: "Play Your Way to Joy Festival",
      subtitle: "Interactive activities and attractions for all ages",
      date: "5 - 7 February",
      location: "Ayer Keroh, Melaka",
      type: "Festival",
      badges: ["Family-friendly", "Popular Event"],
      imageGradient: "bg-gradient-to-br from-purple-200 to-pink-300",
      image: "event-03.webp"
    },
    {
      title: "Jom Cuti Sekolah 2025",
      subtitle: "School holiday travel deals and family activities",
      date: "12 - 15 January 2025",
      location: "Ayer Keroh, Melaka",
      type: "Promotion Event",
      badges: ["Family-friendly", "School Holiday"],
      imageGradient: "bg-gradient-to-br from-yellow-200 to-orange-300",
      image: "event-01.webp"
    },
    {
      title: "Cuti Cuti Muslim-Friendly Fair",
      subtitle: "Muslim-friendly travel packages and experiences",
      date: "18 - 20 January 2025",
      location: "Ayer Molek, Melaka",
      type: "Travel Fair",
      badges: ["Muslim-friendly", "Travel Deals"],
      imageGradient: "bg-gradient-to-br from-green-200 to-teal-300",
      image: "event-02.webp"
    },
    {
      title: "Play Your Way to Joy Festival",
      subtitle: "Interactive activities and attractions for all ages",
      date: "5 - 7 February",
      location: "Ayer Keroh, Melaka",
      type: "Festival",
      badges: ["Family-friendly", "Popular Event"],
      imageGradient: "bg-gradient-to-br from-purple-200 to-pink-300",
      image: "event-03.webp"
    }
  ];

  return (
    <DuoResponsiveLayout showTopBar showBottomNav>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <DuoMascot mood="excited" size="sm" />
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">Upcoming Events</h1>
            <p className="text-muted-foreground">Discover travel events near you</p>
          </div>
        </motion.div>

        {/* Featured Event Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="duo-card p-5"
          style={{
            background: "linear-gradient(135deg, var(--duo-yellow) 0%, var(--duo-orange) 100%)",
            borderColor: "#E5A800",
          }}
        >
          <div className="flex items-center gap-3 text-white">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold">School Holiday Special!</h2>
              <p className="text-sm text-white/80 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                12 - 15 January 2025
              </p>
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.03 }}
              >
                <EventCard {...event} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* XP Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-4"
        >
          <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
          <span>
            Earn <strong className="text-[var(--duo-green)]">+10 XP</strong> for attending events!
          </span>
        </motion.div>
      </div>
    </DuoResponsiveLayout>
  );
}
