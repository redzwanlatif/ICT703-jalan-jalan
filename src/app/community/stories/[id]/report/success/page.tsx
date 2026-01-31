"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Navigation } from "@/components/shared/navigation";
import { GroupLabel } from "@/components/shared/group-label";
import {
  ChevronLeft,
  ChevronRight,
  PlaneTakeoff,
  Check,
} from "lucide-react";

// Mock data for the story detail (same as story detail page)
const storyData = {
  location: "Club Med Finolhu, Maldives",
  address: "N 2051, Gasfinolhu, Kaafu Atoll, Maldives",
  author: {
    name: "Alif Haikal",
    badge: "Frequent Traveller",
    avatar: "AH",
  },
  title: "The Finolhu Villas: All-inclusive Resort in Maldives",
  content: `Club Med Maldives is an excellent choice for travelers seeking a relaxing yet well-organized all-inclusive island getaway. The resort is located on a private island with crystal-clear waters, white sandy beaches, and beautiful marine life, creating a truly tropical and peaceful atmosphere. Guests frequently praise the friendly and professional staff, who provide attentive service while maintaining a warm and welcoming environment. The all-inclusive concept is a major advantage, offering a good variety of international and Asian cuisine, quality drinks, and snacks throughout the day, allowing guests to enjoy their stay without worrying about additional costs. Activities such as snorkeling, water sports, fitness classes, and evening entertainment add to the overall experience, while the calm setting also makes it ideal for couples and honeymooners.`,
  images: [
    { id: 1, src: "/placeholder.svg" },
    { id: 2, src: "/placeholder.svg" },
    { id: 3, src: "/placeholder.svg" },
  ],
  experiences: [
    {
      id: 1,
      author: {
        name: "Shazwanie",
        badge: "Frequent Traveller",
        avatar: "SH",
      },
      content:
        "The island is absolutely beautiful with clear blue water and soft white sand. The snorkeling is amazing, and we saw many fish right near the villa. Staff were very friendly and always smiling, making us feel welcome throughout our stay. Food variety was good and drinks were included, which made the holiday very relaxing.",
    },
  ],
};

export default function ReportSuccessPage() {
  return (
    <div className="min-h-screen bg-white relative">
      <Navigation />
      <GroupLabel group={4} />

      {/* Main Content (Background - Story Detail) */}
      <main className="px-4 sm:px-6 md:px-12 lg:px-14 xl:px-[56px] py-8">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <h1 className="text-xl md:text-2xl lg:text-[30px] font-semibold tracking-tight text-slate-700">
            Community Stories
          </h1>
          <Link href="/community/stories/create">
            <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-slate-50 text-sm font-semibold w-full sm:w-auto">
              Create Community Story
            </Button>
          </Link>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
          {/* Left Column - Image & Story Info */}
          <div className="w-full lg:w-1/2 xl:w-[675px]">
            {/* Location Header */}
            <div className="p-6">
              <h2 className="text-base font-semibold text-slate-700">
                {storyData.location}
              </h2>
              <p className="text-sm text-slate-500">{storyData.address}</p>
            </div>

            {/* Main Image Placeholder */}
            <div className="w-full h-48 md:h-64 lg:h-80 xl:h-[450px] bg-gradient-to-br from-purple-900 to-purple-600 rounded-lg" />

            {/* Image Carousel */}
            <div className="flex items-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg border border-white shadow-sm bg-white/10"
              >
                <ChevronLeft className="h-4 w-4 text-slate-700" />
              </Button>

              <div className="flex-1 flex gap-2 md:gap-4">
                {storyData.images.map((image) => (
                  <div
                    key={image.id}
                    className="flex-1 h-24 md:h-32 lg:h-48 bg-gradient-to-br from-sky-200 to-sky-400 rounded-lg border border-white shadow-sm"
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg border border-white shadow-sm bg-white/10"
              >
                <ChevronRight className="h-4 w-4 text-slate-700" />
              </Button>
            </div>
          </div>

          {/* Right Column - Story Content */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Author Info */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-purple-900 text-white text-[10px] font-semibold">
                      {storyData.author.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-base font-semibold text-slate-700">
                    {storyData.author.name}
                  </span>
                  <div className="relative ml-2">
                    <PlaneTakeoff className="w-6 h-6 text-purple-900 drop-shadow-md" />
                  </div>
                  <Badge
                    variant="outline"
                    className="ml-2 rounded-lg border-0"
                    style={{
                      backgroundColor: storyData.author.badge === "Verified Local" ? "#E6F3FF" : "#FE9A01",
                      color: storyData.author.badge === "Verified Local" ? "#1d4ed8" : "white"
                    }}
                  >
                    {storyData.author.badge}
                  </Badge>
                </div>
              </div>

              {/* Story Title & Content */}
              <h2 className="text-base font-semibold text-slate-700">
                {storyData.title}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                {storyData.content}
              </p>
            </div>

            {/* Comment Input */}
            <div className="flex items-center gap-0 bg-slate-700 rounded-[10px] overflow-hidden">
              <div className="flex-1" />
              <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-slate-50 text-sm font-semibold m-3">
                Send
              </Button>
            </div>

            {/* Traveler Experiences */}
            <div className="flex flex-col gap-5">
              <h3 className="text-base font-semibold text-slate-700">
                Traveler Experiences
              </h3>

              {storyData.experiences.map((experience) => (
                <div key={experience.id} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-purple-900 text-white text-[10px] font-semibold">
                        {experience.author.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-base font-semibold text-slate-700">
                      {experience.author.name}
                    </span>
                    <Badge
                      variant="outline"
                      className="rounded-lg border-0"
                      style={{
                        backgroundColor: experience.author.badge === "Verified Local" ? "#E6F3FF" : "#FE9A01",
                        color: experience.author.badge === "Verified Local" ? "#1d4ed8" : "white"
                      }}
                    >
                      {experience.author.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {experience.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="flex gap-4 md:gap-8 lg:gap-12">
              <Input
                placeholder="Add Comment"
                className="border-purple-900 shadow-sm"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" />

      {/* Success Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-[593px] min-h-[400px] bg-white rounded-[20px] z-50">
        <div className="px-4 sm:px-[35px] py-[22px]">
          {/* Modal Header */}
          <div className="flex flex-col gap-7">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl lg:text-[30px] font-semibold tracking-tight text-slate-700">
                Report
              </h2>
            </div>
          </div>
        </div>

        {/* Success Content */}
        <div className="flex flex-col items-center gap-3 px-4 sm:px-12 md:px-[124px] py-12 md:py-[87px]">
          {/* Success Icon */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-purple-900 flex items-center justify-center">
            <Check className="w-8 h-8 md:w-10 md:h-10 text-white stroke-[4px]" />
          </div>

          {/* Success Message */}
          <p className="text-sm md:text-base font-semibold text-slate-700 text-center">
            YOUR REPORT IS SUCCESSFULLY SUBMITTED
          </p>
        </div>

        {/* Back to Home Button */}
        <div className="px-4 sm:px-[35px] pb-6">
          <Link href="/community">
            <Button className="w-full h-[49px] bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-slate-50 text-sm font-semibold">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

