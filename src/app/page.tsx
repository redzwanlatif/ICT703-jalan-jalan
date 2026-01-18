"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  BookOpen,
  Sparkles,
  LogIn,
  UserPlus,
  X,
} from "lucide-react";
import { useGamification } from "@/contexts/gamification-context";
import { DuoResponsiveLayout, LandingHero } from "@/components/shared";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DuoButton } from "@/components/shared/duo-wizard-layout";
import { StoryCard } from "@/components/community/story-card";

// Stories data
const stories = [
  {
    id: 1,
    location: "Melaka",
    place: "Malacca Sultanate Palace Museum",
    author: "Imran Rosli",
    authorBadge: "Verified Local",
    tags: ["#LocalTourist", "#Melaka"],
    bgGradient: "bg-gradient-to-br from-blue-400 to-purple-500",
    image: "story-01.webp"
  },
  {
    id: 2,
    location: "Melaka",
    place: "Museum Samudera",
    author: "Farah Shazwanie",
    authorBadge: "Frequent Traveller",
    tags: ["#Melaka"],
    bgGradient: "bg-gradient-to-br from-cyan-400 to-blue-500",
    image: "story-02.webp"
  },
  {
    id: 3,
    location: "Melaka",
    place: "Kampung Morten",
    author: "Hafiz Suhaimi",
    authorBadge: "Verified Local",
    tags: ["#Melaka", "#Local", "#Tourist"],
    bgGradient: "bg-gradient-to-br from-orange-400 to-red-500",
    image: "story-03.webp"
  },
  {
    id: 4,
    location: "Melaka",
    place: "Jonker Street Night Market",
    author: "Imran Rosli",
    authorBadge: "Verified Local",
    tags: ["#Melaka", "#Local", "#Tourist"],
    bgGradient: "bg-gradient-to-br from-blue-400 to-purple-500",
    image: "story-02.webp"
  },
  {
    id: 5,
    location: "Melaka",
    place: "St. Paul's Church",
    author: "Farah Shazwanie",
    authorBadge: "Frequent Traveller",
    tags: ["#Melaka"],
    bgGradient: "bg-gradient-to-br from-cyan-400 to-blue-500",
    image: "story-03.webp"
  },
  {
    id: 6,
    location: "Melaka",
    place: "A Famosa",
    author: "Saranya Mohabatten",
    authorBadge: "Verified Local",
    tags: ["#Melaka", "#Local", "#Tourist"],
    bgGradient: "bg-gradient-to-br from-orange-400 to-red-500",
    image: "story-01.webp"
  },
  {
    id: 7,
    location: "Melaka",
    place: "Dataran Pahlawan",
    author: "Imran Rosli",
    authorBadge: "Verified Local",
    tags: ["#Melaka", "#Local", "#Tourist"],
    bgGradient: "bg-gradient-to-br from-blue-400 to-purple-500",
    image: "story-02.webp"
  },
  {
    id: 8,
    location: "Melaka",
    place: "Melaka River Cruise",
    author: "Farah Shazwanie",
    authorBadge: "Frequent Traveller",
    tags: ["#Melaka"],
    bgGradient: "bg-gradient-to-br from-cyan-400 to-blue-500",
    image: "story-03.webp"
  },
  {
    id: 9,
    location: "Melaka",
    place: "St. John's Fort",
    author: "Saranya Mohabatten",
    authorBadge: "Verified Local",
    tags: ["#Melaka", "#Local", "#Tourist"],
    bgGradient: "bg-gradient-to-br from-orange-400 to-red-500",
    image: "story-03.webp"
  },
  {
    id: 10,
    location: "Melaka",
    place: "Jonker Street Night Market",
    author: "Imran Rosli",
    authorBadge: "Verified Local",
    tags: ["#Melaka", "#Local", "#Tourist"],
    bgGradient: "bg-gradient-to-br from-blue-400 to-purple-500",
    image: "story-01.webp"
  },
  {
    id: 11,
    location: "Melaka",
    place: "St. John's Fort",
    author: "Farah Shazwanie",
    authorBadge: "Frequent Traveller",
    tags: ["#Melaka"],
    bgGradient: "bg-gradient-to-br from-cyan-400 to-blue-500",
    image: "story-02.webp"
  },
  {
    id: 12,
    location: "Melaka",
    place: "St. John's Fort",
    author: "Saranya Mohabatten",
    authorBadge: "Verified Local",
    tags: ["#Melaka", "#Local", "#Tourist"],
    bgGradient: "bg-gradient-to-br from-orange-400 to-red-500",
    image: "story-03.webp"
  },
];

// Auth Prompt Modal Component
function AuthPromptModal({
  isOpen,
  onClose,
  action
}: {
  isOpen: boolean;
  onClose: () => void;
  action: string;
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Mascot */}
          <div className="flex justify-center mb-4">
            <DuoMascot mood="waving" size="md" />
          </div>

          {/* Content */}
          <h2 className="text-xl font-extrabold text-center mb-2">
            Join Jalan-Jalan!
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-6">
            Sign up or log in to {action}
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/onboarding" className="block">
              <DuoButton fullWidth>
                <UserPlus className="w-5 h-5 mr-2" />
                Sign Up
              </DuoButton>
            </Link>

            <Link href="/login" className="block">
              <button className="w-full py-3 px-6 border-2 border-[var(--duo-blue)] text-[var(--duo-blue)] font-bold rounded-2xl hover:bg-[var(--duo-blue)]/10 transition-all flex items-center justify-center gap-2">
                <LogIn className="w-5 h-5" />
                Log In
              </button>
            </Link>
          </div>

          {/* XP Hint */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
            <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
            <span>
              Earn <strong className="text-[var(--duo-green)]">+50 XP</strong> welcome bonus!
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function WelcomePage() {
  const router = useRouter();
  const { isFirstTime, onboardingStep } = useGamification();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authAction, setAuthAction] = useState("");

  // Check if user is authenticated
  const isAuthenticated = !isFirstTime && onboardingStep === "complete";

  // Handle actions that require authentication
  const handleAuthAction = (action: string, href: string) => {
    if (isAuthenticated) {
      router.push(href);
    } else {
      setAuthAction(action);
      setShowAuthPrompt(true);
    }
  };

  return (
    <DuoResponsiveLayout showTopBar showBottomNav>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <LandingHero />

        {/* Community Stories Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 pt-8 pb-6"
        >
          <DuoMascot mood="happy" size="sm" />
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold">Community Stories</h2>
            <p className="text-muted-foreground text-sm md:text-base">Discover travel experiences from our community</p>
          </div>
        </motion.div>

        <div className="space-y-8">
          {/* Create Story CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="duo-card p-5"
          style={{
            background: "linear-gradient(135deg, var(--duo-purple) 0%, #A855F7 100%)",
            borderColor: "#7C3AED",
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-white">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-extrabold">Share Your Story</h2>
                <p className="text-sm text-white/80">Inspire fellow travelers</p>
              </div>
            </div>
            <button
              onClick={() => handleAuthAction("share your story", "/community/stories/create")}
              className="px-4 py-2 rounded-xl bg-white text-[var(--duo-purple)] font-bold shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create
            </button>
          </div>
        </motion.div>

        {/* Stories Grid */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.03 }}
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
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-4"
        >
          <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
          <span>
            Earn <strong className="text-[var(--duo-green)]">+25 XP</strong> for sharing stories!
          </span>
        </motion.div>

          {/* Auth Prompt Modal */}
          <AuthPromptModal
            isOpen={showAuthPrompt}
            onClose={() => setShowAuthPrompt(false)}
            action={authAction}
          />
        </div>
      </div>
    </DuoResponsiveLayout>
  );
}
