"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navigation } from "@/components/shared/navigation";
import { GroupLabel } from "@/components/shared/group-label";
import {
  ChevronLeft,
  ChevronRight,
  PlaneTakeoff,
  Send,
  Flag,
  Facebook,
  Twitter,
  Link as LinkIcon,
  AlertCircle,
  MapPin
} from "lucide-react";
import { StoryCard } from "@/components/community/story-card";
import { ReportModal } from "@/components/community/report-modal";

// Mock data for the story detail
const storyData = {
  location: "The Shore, Melaka",
  address: "193, Jalan Pengkalan Arang, Kampung Portugis, 75050 Melaka, Malaysia",
  author: {
    name: "Alif Haikal",
    badge: "Frequent Traveller",
    avatar: "/community/story-user-1.png",
  },
  title: "The Shore, Melaka",
  content: `The Shore, Melaka is an excellent choice for travelers seeking a relaxing yet well-organized all-inclusive island getaway. The resort is located on a private island with crystal-clear waters, white sandy beaches, and beautiful marine life, creating a truly tropical and peaceful atmosphere. Guests frequently praise the friendly and professional staff, who provide attentive service while maintaining a warm and welcoming environment. The all-inclusive concept is a major advantage, offering a good variety of international and Asian cuisine, quality drinks, and snacks throughout the day, allowing guests to enjoy their stay without worrying about additional costs. Activities such as snorkeling, water sports, fitness classes, and evening entertainment add to the overall experience, while the calm setting also makes it ideal for couples and honeymooners.`,
  images: [
    { id: 1, src: "/community/story-detail-1.png" },
    { id: 2, src: "/community/story-detail-2.png" },
    { id: 3, src: "/community/story-detail-3.png" },
  ],
  mainImage: "/community/story-detail-main.png",
  experiences: [
    {
      id: 1,
      author: {
        name: "Shazwanie",
        badge: "Frequent Traveller",
        avatar: "/community/story-user-2.png",
      },
      content:
        "The island is absolutely beautiful with clear blue water and soft white sand. The snorkeling is amazing, and we saw many fish right near the villa. Staff were very friendly and always smiling, making us feel welcome throughout our stay. Food variety was good and drinks were included, which made the holiday very relaxing.",
    },
    {
      id: 2,
      author: {
        name: "Aqilah",
        badge: "Verified Local",
        avatar: "/community/story-user-3.png",
      },
      content:
        "The location of the resort is excellent, with a private beach and beautiful greenery all around. However, some facilities and room interiors feel a bit dated and could benefit from upgrades. Despite this, the rooms were clean, and the staff provided good service throughout our stay.",
    },
  ],
};

const moreStories = [
  {
    id: 1,
    location: "Melaka",
    place: "The Shore, Melaka",
    author: "Imran Rosli",
    authorBadge: "Verified Local",
    tags: ["#LocalTourist", "#Melaka"],
    bgGradient: "bg-gradient-to-br from-blue-400 to-purple-500",
    image: "story-01.webp"
  },
  {
    id: 2,
    location: "Melaka",
    place: "The Shore, Melaka",
    author: "Farah Shazwanie",
    authorBadge: "Frequent Traveller",
    tags: ["#Melaka"],
    bgGradient: "bg-gradient-to-br from-cyan-400 to-blue-500",
    image: "story-02.webp"
  },
  {
    id: 3,
    location: "Melaka",
    place: "The Shore, Melaka",
    author: "Saranya Mohabatten",
    authorBadge: "Verified Local",
    tags: ["#Melaka", "#Local", "#Tourist"],
    bgGradient: "bg-gradient-to-br from-orange-400 to-red-500",
    image: "story-03.webp"
  },
];

export default function StoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <GroupLabel group={4} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-14 xl:px-[56px] py-8 pb-16">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">
            Community Stories
          </h1>
          <Link href="/community/stories/create">
            <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold px-6">
              Create Community Story
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
          {/* Left Column: Images */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-neutral-800">{storyData.location}</h2>
              <p className="text-neutral-500">{storyData.address}</p>
            </div>

            {/* Main Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
              <Image
                src={storyData.mainImage}
                alt={storyData.location}
                fill
                className="object-cover"
              />
            </div>

            {/* Image Carousel */}
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="shrink-0 h-10 w-10 rounded-full border-neutral-200">
                <ChevronLeft className="h-5 w-5 text-neutral-600" />
              </Button>

              <div className="grid grid-cols-3 gap-4 flex-1">
                {storyData.images.map((img) => (
                  <div key={img.id} className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                    <Image
                      src={img.src}
                      alt={`Gallery ${img.id}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              <Button variant="outline" size="icon" className="shrink-0 h-10 w-10 rounded-full border-neutral-200">
                <ChevronRight className="h-5 w-5 text-neutral-600" />
              </Button>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="space-y-8">
            {/* Author Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={storyData.author.avatar} />
                  <AvatarFallback>{storyData.author.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-neutral-800">{storyData.author.name}</span>

                <div className="flex items-center gap-2 ml-2 text-neutral-400">
                  <Facebook className="h-4 w-4 hover:text-blue-600 cursor-pointer transition-colors" />
                  <Twitter className="h-4 w-4 hover:text-blue-400 cursor-pointer transition-colors" />
                  <LinkIcon className="h-4 w-4 hover:text-neutral-600 cursor-pointer transition-colors" />
                  <ReportModal>
                    <button type="button" aria-label="Report this story" className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded">
                      <AlertCircle className="h-4 w-4 hover:text-red-500 cursor-pointer transition-colors" />
                    </button>
                  </ReportModal>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <PlaneTakeoff className="h-5 w-5 text-neutral-600" />
                <Badge variant="secondary" className="bg-white border text-xs font-normal border-neutral-200 text-neutral-600 hover:bg-neutral-50">
                  {storyData.author.badge}
                </Badge>
              </div>
            </div>

            {/* Story Content */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-neutral-800">{storyData.title}</h3>
              <p className="text-neutral-600 text-sm leading-relaxed whitespace-pre-line text-justify">
                {storyData.content}
              </p>
            </div>

            {/* Comment Input */}
            <div className="flex gap-2 p-1 bg-neutral-100 rounded-lg border border-neutral-200">
              <Input
                className="border-0 bg-transparent focus-visible:ring-0 shadow-none placeholder:text-neutral-500"
                placeholder="Add Comment"
              />
              <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white px-6">
                Send
              </Button>
            </div>

            {/* Traveler Experiences */}
            <div className="space-y-6">
              <h4 className="font-bold text-neutral-800">Traveler Experiences</h4>

              <div className="space-y-6">
                {storyData.experiences.map((exp) => (
                  <div key={exp.id} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={exp.author.avatar} />
                        <AvatarFallback>{exp.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-neutral-800 text-sm">{exp.author.name}</span>
                      <Badge variant="secondary" className="bg-white border text-[10px] font-normal border-neutral-200 text-neutral-500 h-5">
                        {exp.author.badge}
                      </Badge>
                    </div>
                    <p className="text-neutral-600 text-sm leading-relaxed pl-11 text-justify">
                      {exp.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* More Stories Section */}
        <div className="mt-16 sm:mt-24 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl md:text-2xl font-bold text-neutral-800">
              More Stories about {storyData.location}
            </h3>
            <Link href="/community/stories" className="text-base font-semibold text-neutral-600 hover:text-[#1E3A8A] transition-colors">
              View More
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moreStories.map((story) => (
              <StoryCard key={story.id} {...story} />
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

