"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Facebook,
  Twitter,
  Link as LinkIcon,
  AlertCircle,
  MapPin,
  Sparkles,
  PlaneTakeoff,
  MessageCircle,
} from "lucide-react";
import { DuoResponsiveLayout } from "@/components/shared";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DuoButton } from "@/components/shared/duo-wizard-layout";
import { StoryCard } from "@/components/community/story-card";
import { ReportModal } from "@/components/community/report-modal";
import { cn } from "@/lib/utils";

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
        avatar: "/community/story-user-3.webp",
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
    <DuoResponsiveLayout showTopBar showBottomNav>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Link href="/community/stories">
            <button className="w-10 h-10 rounded-xl border-2 border-border flex items-center justify-center hover:bg-muted transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">Community Stories</h1>
            <p className="text-muted-foreground">Travel experiences shared by locals</p>
          </div>
          <Link href="/community/stories/create">
            <DuoButton size="sm">Create Story</DuoButton>
          </Link>
        </motion.div>

        {/* Top Section: Location & Author - Aligned Heights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Location Info */}
            <div className="duo-card p-4 h-full">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--duo-blue)]/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[var(--duo-blue)]" />
                </div>
                <div>
                  <h2 className="font-extrabold text-lg">{storyData.location}</h2>
                  <p className="text-sm text-muted-foreground">{storyData.address}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            {/* Author Section */}
            <div className="duo-card p-4 space-y-3 h-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--duo-green)]">
                  <Image
                    src={storyData.author.avatar}
                    alt={storyData.author.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <span className="font-bold">{storyData.author.name}</span>
                  <div className="flex items-center gap-2">
                    <PlaneTakeoff className="w-4 h-4 text-[var(--duo-purple)]" />
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-bold border",
                      storyData.author.badge === "Verified Local"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-500/30"
                        : "bg-[var(--duo-purple)]/10 text-[var(--duo-purple)] border-[var(--duo-purple)]/30"
                    )}>
                      {storyData.author.badge}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-[var(--duo-blue)]/10 transition-colors">
                    <Facebook className="w-4 h-4 text-muted-foreground hover:text-[var(--duo-blue)]" />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-[var(--duo-blue)]/10 transition-colors">
                    <Twitter className="w-4 h-4 text-muted-foreground hover:text-[var(--duo-blue)]" />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                    <LinkIcon className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <ReportModal>
                    <button className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-[var(--duo-red)]/10 transition-colors">
                      <AlertCircle className="w-4 h-4 text-muted-foreground hover:text-[var(--duo-red)]" />
                    </button>
                  </ReportModal>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Images */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-border">
              <Image
                src={storyData.mainImage}
                alt={storyData.location}
                fill
                className="object-cover"
              />
            </div>

            {/* Image Carousel */}
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-xl border-2 border-border flex items-center justify-center hover:bg-muted transition-colors shrink-0">
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-3 gap-3 flex-1">
                {storyData.images.map((img, index) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border-2 border-border hover:border-[var(--duo-blue)] transition-colors"
                  >
                    <Image
                      src={img.src}
                      alt={`Gallery ${img.id}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>

              <button className="w-10 h-10 rounded-xl border-2 border-border flex items-center justify-center hover:bg-muted transition-colors shrink-0">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Right Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-5"
          >
            {/* Story Content */}
            <div className="duo-card p-5 space-y-3">
              <h3 className="text-xl font-extrabold">{storyData.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {storyData.content}
              </p>
            </div>

            {/* Comment Input */}
            <div className="duo-card p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="duo-input flex-1"
                />
                <DuoButton size="sm">
                  <Send className="w-4 h-4 mr-1" />
                  Send
                </DuoButton>
              </div>
            </div>

            {/* Traveler Experiences */}
            <div className="space-y-4">
              <h4 className="font-extrabold flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[var(--duo-purple)]" />
                Traveler Experiences
              </h4>

              {storyData.experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="duo-card p-4 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[var(--duo-green)]">
                      <Image
                        src={exp.author.avatar}
                        alt={exp.author.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <span className="font-bold text-sm">{exp.author.name}</span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-bold border",
                      exp.author.badge === "Verified Local"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-500/30"
                        : "bg-[var(--duo-green)]/10 text-[var(--duo-green)] border-[var(--duo-green)]/30"
                    )}>
                      {exp.author.badge}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {exp.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* More Stories Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-8 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold">
              More Stories about {storyData.location}
            </h3>
            <Link
              href="/community/stories"
              className="text-sm font-bold text-[var(--duo-blue)] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moreStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <StoryCard {...story} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* XP Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-4"
        >
          <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
          <span>
            Earn <strong className="text-[var(--duo-green)]">+5 XP</strong> for reading stories!
          </span>
        </motion.div>
      </div>
    </DuoResponsiveLayout>
  );
}
