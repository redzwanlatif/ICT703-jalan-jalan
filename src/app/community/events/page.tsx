"use client";

import { Navigation } from "@/components/shared/navigation";
import { GroupLabel } from "@/components/shared/group-label";
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
      image: "event-01.png"
    },
    {
      title: "Cuti Cuti Muslim-Friendly Fair",
      subtitle: "Muslim-friendly travel packages and experiences",
      date: "18 - 20 January 2025",
      location: "Ayer Molek, Melaka",
      type: "Travel Fair",
      badges: ["Muslim-friendly", "Travel Deals"],
      imageGradient: "bg-gradient-to-br from-green-200 to-teal-300",
      image: "event-02.png"
    },
    {
      title: "Play Your Way to Joy Festival",
      subtitle: "Interactive activities and attractions for all ages",
      date: "5 - 7 February",
      location: "Ayer Keroh, Melaka",
      type: "Festival",
      badges: ["Family-friendly", "Popular Event"],
      imageGradient: "bg-gradient-to-br from-purple-200 to-pink-300",
      image: "event-03.png"
    },
    {
      title: "Jom Cuti Sekolah 2025",
      subtitle: "School holiday travel deals and family activities",
      date: "12 - 15 January 2025",
      location: "Ayer Keroh, Melaka",
      type: "Promotion Event",
      badges: ["Family-friendly", "School Holiday"],
      imageGradient: "bg-gradient-to-br from-yellow-200 to-orange-300",
      image: "event-01.png"
    },
    {
      title: "Cuti Cuti Muslim-Friendly Fair",
      subtitle: "Muslim-friendly travel packages and experiences",
      date: "18 - 20 January 2025",
      location: "Ayer Molek, Melaka",
      type: "Travel Fair",
      badges: ["Muslim-friendly", "Travel Deals"],
      imageGradient: "bg-gradient-to-br from-green-200 to-teal-300",
      image: "event-02.png"
    },
    {
      title: "Play Your Way to Joy Festival",
      subtitle: "Interactive activities and attractions for all ages",
      date: "5 - 7 February",
      location: "Ayer Keroh, Melaka",
      type: "Festival",
      badges: ["Family-friendly", "Popular Event"],
      imageGradient: "bg-gradient-to-br from-purple-200 to-pink-300",
      image: "event-03.png"
    },
    {
      title: "Jom Cuti Sekolah 2025",
      subtitle: "School holiday travel deals and family activities",
      date: "12 - 15 January 2025",
      location: "Ayer Keroh, Melaka",
      type: "Promotion Event",
      badges: ["Family-friendly", "School Holiday"],
      imageGradient: "bg-gradient-to-br from-yellow-200 to-orange-300",
      image: "event-01.png"
    },
    {
      title: "Cuti Cuti Muslim-Friendly Fair",
      subtitle: "Muslim-friendly travel packages and experiences",
      date: "18 - 20 January 2025",
      location: "Ayer Molek, Melaka",
      type: "Travel Fair",
      badges: ["Muslim-friendly", "Travel Deals"],
      imageGradient: "bg-gradient-to-br from-green-200 to-teal-300",
      image: "event-02.png"
    },
    {
      title: "Play Your Way to Joy Festival",
      subtitle: "Interactive activities and attractions for all ages",
      date: "5 - 7 February",
      location: "Ayer Keroh, Melaka",
      type: "Festival",
      badges: ["Family-friendly", "Popular Event"],
      imageGradient: "bg-gradient-to-br from-purple-200 to-pink-300",
      image: "event-03.png"
    },
    {
      title: "Jom Cuti Sekolah 2025",
      subtitle: "School holiday travel deals and family activities",
      date: "12 - 15 January 2025",
      location: "Ayer Keroh, Melaka",
      type: "Promotion Event",
      badges: ["Family-friendly", "School Holiday"],
      imageGradient: "bg-gradient-to-br from-yellow-200 to-orange-300",
      image: "event-01.png"
    },
    {
      title: "Cuti Cuti Muslim-Friendly Fair",
      subtitle: "Muslim-friendly travel packages and experiences",
      date: "18 - 20 January 2025",
      location: "Ayer Molek, Melaka",
      type: "Travel Fair",
      badges: ["Muslim-friendly", "Travel Deals"],
      imageGradient: "bg-gradient-to-br from-green-200 to-teal-300",
      image: "event-02.png"
    },
    {
      title: "Play Your Way to Joy Festival",
      subtitle: "Interactive activities and attractions for all ages",
      date: "5 - 7 February",
      location: "Ayer Keroh, Melaka",
      type: "Festival",
      badges: ["Family-friendly", "Popular Event"],
      imageGradient: "bg-gradient-to-br from-purple-200 to-pink-300",
      image: "event-03.png"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <GroupLabel group={4} />

      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-8">
        {/* Title Section */}
        <section className="relative z-10 py-8">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
            Upcoming Events
          </h2>
        </section>

        {/* Events Grid */}
        <section className="relative z-10 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {events.map((event, i) => (
              <EventCard key={i} {...event} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

