"use client";

import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  PageLayoutFull,
  PageSection,
  UnifiedCard,
  AnimatedBackground,
} from "@/components/shared/page-layout";
import { Navigation } from "@/components/shared/navigation";
import { GroupLabel } from "@/components/shared/group-label";
import { FlowGuide } from "@/components/shared/flow-guide";
import { EventCard } from "@/components/community/event-card";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Trip Card component
function TripCard({ title, dates, status }: { title: string; dates: string; status: "Active" | "Upcoming" }) {
  return (
    <UnifiedCard className="group p-0">
      <div className="p-6 space-y-1">
        <h3 className="font-semibold text-neutral-800 dark:text-neutral-100">{title}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{dates}</p>
      </div>
      <div className="px-6 pb-6 flex items-center justify-between">
        <Badge
          variant="outline"
          className={cn(
            "rounded-lg",
            status === "Active"
              ? "border-emerald-500/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
              : "border-orange-500/50 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
          )}
        >
          {status}
        </Badge>
        <span className="font-semibold text-neutral-600 dark:text-neutral-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          View More
        </span>
      </div>
    </UnifiedCard>
  );
}

// Story Card component
function StoryCard({
  id,
  location,
  place,
  author,
  authorBadge,
  tags,
  bgGradient
}: {
  id: number;
  location: string;
  place: string;
  author: string;
  authorBadge?: string;
  tags: string[];
  bgGradient: string;
}) {
  return (
    <Link href={`/community/stories/${id}`}>
      <UnifiedCard className="group p-0 gap-0">
        <div className="p-6 space-y-1 min-h-[88px] flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <MapPin className="size-4 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="font-semibold text-neutral-800 dark:text-neutral-100">{location}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{author}</span>
            {authorBadge && (
              <Badge
                variant="outline"
                className="rounded-lg border-orange-500/30 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs"
              >
                {authorBadge}
              </Badge>
            )}
          </div>
        </div>
        <div className={cn("h-48 md:h-56 relative overflow-hidden", bgGradient)}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="rounded-lg bg-white/90 dark:bg-black/50 backdrop-blur-sm text-neutral-700 dark:text-neutral-200 border-0 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <span className="text-sm font-semibold text-white">{place}</span>
          </div>
        </div>
      </UnifiedCard>
    </Link>
  );
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 relative">
      <Navigation />
      <GroupLabel group={4} />
      <AnimatedBackground variant="subtle" />

      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-8">
        {/* My Trip Section */}
        <section className="relative z-10 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
              My Trip
            </h2>
            <Link
              href="/predictions"
              className="text-base font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
            >
              Create New Trip
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <TripCard
              title="Malacca River Walk"
              dates="25th February - 26th February 2026"
              status="Active"
            />
            <TripCard
              title="Baba Nyonya Heritage Museum"
              dates="25th March - 26th March 2026"
              status="Upcoming"
            />
            <TripCard
              title="Menara Taming Sari"
              dates="25th April - 26th April 2026"
              status="Upcoming"
            />
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="relative z-10 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
              Upcoming Events
            </h2>
            <Link
              href="/community/events"
              className="text-base font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
            >
              View More
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <EventCard
              title="Jom Cuti Sekolah 2026"
              subtitle="School holiday travel deals and family activities"
              date="12 - 15 January 2026"
              location="Ayer Keroh, Melaka"
              type="Promotion Event"
              badges={["Family-friendly", "School Holiday"]}
              imageGradient="bg-gradient-to-br from-yellow-200 to-orange-300"
            />
            <EventCard
              title="Cuti Cuti Muslim-Friendly Fair"
              subtitle="Muslim-friendly travel packages and experiences"
              date="18- 20 January 2026"
              location="Ayer Molek, Melaka"
              type="Travel Fair"
              badges={["Muslim-friendly", "Travel Deals"]}
              imageGradient="bg-gradient-to-br from-green-200 to-teal-300"
            />
            <EventCard
              title="Play Your Way to Joy Festival"
              subtitle="Interactive activities and attractions for all ages"
              date="5- 7 February 2026"
              location="Pantai Klebang, Melaka"
              type="Festival"
              badges={["Family-friendly", "Popular Event"]}
              imageGradient="bg-gradient-to-br from-purple-200 to-pink-300"
            />
          </div>
        </section>

        {/* Community Story Section */}
        <section className="relative z-10 py-8 pb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
              Community Story
            </h2>
            <Link
              href="/community/stories"
              className="text-base font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
            >
              View More
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <StoryCard
              id={1}
              location="Kuala Lumpur, Malaysia"
              place="Kuala Lumpur City Centre"
              author="Imran Rosli"
              authorBadge="Verified Local"
              tags={["#LocalTourist", "#KLCC"]}
              bgGradient="bg-gradient-to-br from-blue-400 to-purple-500"
            />
            <StoryCard
              id={2}
              location="Langkawi Island, Malaysia"
              place="Langkawi Island Bridge"
              author="Farah Shazwanie"
              authorBadge="Frequent Traveller"
              tags={["#Langkawi"]}
              bgGradient="bg-gradient-to-br from-cyan-400 to-blue-500"
            />
            <StoryCard
              id={3}
              location="Macau, Hong Kong"
              place="Lisboeta, Macau"
              author="Saranya Mohabatten"
              authorBadge="Verified Local"
              tags={["#Macau", "#Local", "#Tourist"]}
              bgGradient="bg-gradient-to-br from-orange-400 to-red-500"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
