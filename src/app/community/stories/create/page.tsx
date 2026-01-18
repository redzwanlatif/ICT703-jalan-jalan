"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Image as ImageIcon, Search, X, MapPin, Check, Sparkles, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { DuoResponsiveLayout } from "@/components/shared";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DuoButton } from "@/components/shared/duo-wizard-layout";
import { cn } from "@/lib/utils";

export default function CreateStoryPage() {
  const router = useRouter();
  const [tags, setTags] = useState(["#Muslimfriendly", "#staycation", "#localfood"]);
  const [newTag, setNewTag] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      if (tags.length >= 3) return;
      const formattedTag = newTag.startsWith("#") ? newTag : `#${newTag}`;
      setTags([...tags, formattedTag]);
      setNewTag("");
    }
  };

  const handleSubmit = () => {
    router.push("/community/stories");
  };

  return (
    <DuoResponsiveLayout showTopBar showBottomNav>
        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
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
            <h1 className="text-2xl font-extrabold">Create Story</h1>
            <p className="text-muted-foreground">Share your travel experience</p>
          </div>
          <DuoMascot mood="excited" size="sm" />
        </motion.div>

        {/* Share Image Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h2 className="font-extrabold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[var(--duo-purple)]" />
            Share Image
          </h2>
          <p className="text-sm text-muted-foreground">
            Upload your amazing travel photo (Maximum 4 images)
          </p>
          <div className="grid grid-cols-4 gap-3">
            <button className="aspect-square rounded-2xl border-2 border-dashed border-border flex items-center justify-center bg-muted/50 hover:bg-muted hover:border-[var(--duo-blue)] transition-all">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </button>
            <div className="aspect-square rounded-2xl border-2 border-border bg-muted/30" />
            <div className="aspect-square rounded-2xl border-2 border-border bg-muted/30" />
            <div className="aspect-square rounded-2xl border-2 border-border bg-muted/30" />
          </div>
        </motion.section>

        {/* Add Title */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          <h2 className="font-extrabold">Add a title</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Write your interesting title"
            className="duo-input w-full"
          />
        </motion.section>

        {/* Add Location */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="font-extrabold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[var(--duo-blue)]" />
            Add Location
          </h2>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search location"
                className="duo-input !pl-12 w-full"
              />
            </div>
            <button className="duo-btn px-4">
              Search
            </button>
          </div>
        </motion.section>

        {/* Tell us about your trip */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3"
        >
          <h2 className="font-extrabold">Tell us about your trip</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share about your trip with maximum 100 words"
            className="duo-input min-h-[150px] resize-none w-full"
          />
        </motion.section>

        {/* Create Tags */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h2 className="font-extrabold">Create Tags</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTag()}
              placeholder="Create Tags"
              className="duo-input flex-1"
            />
            <button onClick={addTag} className="duo-btn px-4">
              Add
            </button>
          </div>
          <p className="text-xs text-muted-foreground">(Maximum 3 tags per story)</p>

          {/* Tag badges */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <motion.span
                key={tag}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-full border-2 border-[var(--duo-purple)] bg-[var(--duo-purple)]/10 text-[var(--duo-purple)]"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-[var(--duo-red)] transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </div>
        </motion.section>

        {/* Confirmation & Submit */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-4 pt-4"
        >
          <button
            onClick={() => setAgreed(!agreed)}
            className="flex items-start gap-3 w-full text-left"
          >
            <div
              className={cn(
                "w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                agreed
                  ? "bg-[var(--duo-green)] border-[var(--duo-green-dark)]"
                  : "border-border"
              )}
            >
              {agreed && <Check className="w-4 h-4 text-white" />}
            </div>
            <span className="text-sm text-muted-foreground">
              I confirm that all photos and videos I have uploaded are my own, and I agree to be bound by Jalan-Jalan's Terms of Service and Community Guidelines.
            </span>
          </button>

          <DuoButton
            onClick={handleSubmit}
            disabled={!agreed}
            fullWidth
            size="lg"
          >
            Submit Story
          </DuoButton>

          {/* XP Hint */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
            <span>
              Earn <strong className="text-[var(--duo-green)]">+25 XP</strong> for sharing your story!
            </span>
          </div>
        </motion.section>
        </div>
    </DuoResponsiveLayout>
  );
}
