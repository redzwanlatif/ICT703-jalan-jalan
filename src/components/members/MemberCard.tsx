"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Member } from "../../types";
import {
  Edit2,
  Save,
  X,
  DollarSign,
  Calendar,
  Heart,
  Users2,
  Sparkles,
  Check,
} from "lucide-react";
import { allInterests, allSeasons } from "../../data/seed";
import { cn } from "@/lib/utils";

interface MemberCardProps {
  member: Member;
  onUpdate: (updatedMember: Member) => void;
}

const avatarGradients = [
  "from-[var(--duo-green)] to-[var(--duo-blue)]",
  "from-[var(--duo-blue)] to-[var(--duo-purple)]",
  "from-[var(--duo-purple)] to-[var(--duo-orange)]",
  "from-[var(--duo-orange)] to-[var(--duo-yellow)]",
  "from-[var(--duo-yellow)] to-[var(--duo-green)]",
];

const seasonEmojis: Record<string, string> = {
  Raya: "🌙",
  CNY: "🧧",
  Merdeka: "🇲🇾",
  Deepavali: "🪔",
};

const interestEmojis: Record<string, string> = {
  Beach: "🏖️",
  Mountain: "🏔️",
  Culture: "🏛️",
  Food: "🍜",
  Adventure: "🎢",
  Shopping: "🛍️",
  Nature: "🌿",
  Nightlife: "🎉",
};

export function MemberCard({ member, onUpdate }: MemberCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState(member);

  const handleSave = () => {
    onUpdate(editedMember);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedMember(member);
    setIsEditing(false);
  };

  const toggleInterest = (interest: string) => {
    setEditedMember((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const toggleSeason = (season: string) => {
    setEditedMember((prev) => ({
      ...prev,
      seasons: prev.seasons.includes(season)
        ? prev.seasons.filter((s) => s !== season)
        : [...prev.seasons, season],
    }));
  };

  // Generate consistent gradient based on member id
  const gradientIndex =
    member.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    avatarGradients.length;
  const avatarGradient = avatarGradients[gradientIndex];

  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      layout
      className={cn(
        "duo-card p-5 transition-all duration-300",
        isEditing && "ring-2 ring-[var(--duo-blue)] ring-offset-2"
      )}
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <motion.div
            className={cn(
              "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-extrabold text-lg shadow-lg",
              avatarGradient
            )}
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              initials
            )}
          </motion.div>

          <div>
            <h3 className="font-extrabold text-lg">{member.name}</h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-[var(--duo-yellow)]" />
              <span>Travel Buddy</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.button
              key="edit"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setIsEditing(true)}
              className="p-2.5 rounded-xl bg-[var(--duo-blue)]/10 hover:bg-[var(--duo-blue)]/20 text-[var(--duo-blue)] transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit2 className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.div
              key="actions"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex gap-2"
            >
              <motion.button
                onClick={handleSave}
                className="p-2.5 rounded-xl bg-[var(--duo-green)] text-white shadow-[0_3px_0_var(--duo-green-dark)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, y: 3, boxShadow: "none" }}
              >
                <Save className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={handleCancel}
                className="p-2.5 rounded-xl bg-[var(--duo-red)] text-white shadow-[0_3px_0_#B91C1C]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, y: 3, boxShadow: "none" }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-5">
        {/* Budget */}
        <motion.div layout>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-[var(--duo-green)]/10">
              <DollarSign className="w-4 h-4 text-[var(--duo-green)]" />
            </div>
            <label className="text-sm font-bold">Budget Range</label>
          </div>
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit-budget"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-3 items-center"
              >
                <div className="flex-1">
                  <input
                    type="number"
                    value={editedMember.budgetMin}
                    onChange={(e) =>
                      setEditedMember((prev) => ({
                        ...prev,
                        budgetMin: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="duo-input text-center font-bold"
                    placeholder="Min"
                  />
                </div>
                <span className="text-muted-foreground font-bold">—</span>
                <div className="flex-1">
                  <input
                    type="number"
                    value={editedMember.budgetMax}
                    onChange={(e) =>
                      setEditedMember((prev) => ({
                        ...prev,
                        budgetMax: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="duo-input text-center font-bold"
                    placeholder="Max"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="view-budget"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-2.5 rounded-xl bg-[var(--duo-green)]/10 border-2 border-[var(--duo-green)]/20"
              >
                <span className="font-extrabold text-[var(--duo-green)]">
                  RM{member.budgetMin.toLocaleString()} — RM
                  {member.budgetMax.toLocaleString()}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Seasons */}
        <motion.div layout>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-[var(--duo-purple)]/10">
              <Calendar className="w-4 h-4 text-[var(--duo-purple)]" />
            </div>
            <label className="text-sm font-bold">Preferred Seasons</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {(isEditing ? allSeasons : member.seasons).map((season) => {
              const isSelected = editedMember.seasons.includes(season);
              const showSeason = isEditing || member.seasons.includes(season);

              if (!showSeason) return null;

              return (
                <motion.button
                  key={season}
                  onClick={isEditing ? () => toggleSeason(season) : undefined}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 transition-all border-2",
                    isEditing
                      ? isSelected
                        ? "bg-[var(--duo-purple)] text-white border-[var(--duo-purple)] shadow-[0_2px_0_#6B21A8]"
                        : "bg-card border-border hover:border-[var(--duo-purple)] hover:text-[var(--duo-purple)]"
                      : "bg-[var(--duo-purple)]/10 text-[var(--duo-purple)] border-[var(--duo-purple)]/20"
                  )}
                  whileHover={isEditing ? { scale: 1.05 } : {}}
                  whileTap={isEditing ? { scale: 0.95 } : {}}
                  layout
                >
                  <span>{seasonEmojis[season] || "📅"}</span>
                  <span>{season}</span>
                  {isEditing && isSelected && <Check className="w-3 h-3" />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div layout>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-[var(--duo-orange)]/10">
              <Heart className="w-4 h-4 text-[var(--duo-orange)]" />
            </div>
            <label className="text-sm font-bold">Interests</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {(isEditing ? allInterests : member.interests).map((interest) => {
              const isSelected = editedMember.interests.includes(interest);
              const showInterest =
                isEditing || member.interests.includes(interest);

              if (!showInterest) return null;

              return (
                <motion.button
                  key={interest}
                  onClick={
                    isEditing ? () => toggleInterest(interest) : undefined
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 transition-all border-2",
                    isEditing
                      ? isSelected
                        ? "bg-[var(--duo-orange)] text-white border-[var(--duo-orange)] shadow-[0_2px_0_#C2410C]"
                        : "bg-card border-border hover:border-[var(--duo-orange)] hover:text-[var(--duo-orange)]"
                      : "bg-[var(--duo-orange)]/10 text-[var(--duo-orange)] border-[var(--duo-orange)]/20"
                  )}
                  whileHover={isEditing ? { scale: 1.05 } : {}}
                  whileTap={isEditing ? { scale: 0.95 } : {}}
                  layout
                >
                  <span>{interestEmojis[interest] || "✨"}</span>
                  <span>{interest}</span>
                  {isEditing && isSelected && <Check className="w-3 h-3" />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Crowd Preference */}
        <motion.div layout>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-[var(--duo-blue)]/10">
              <Users2 className="w-4 h-4 text-[var(--duo-blue)]" />
            </div>
            <label className="text-sm font-bold">Crowd Preference</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["avoid", "okay", "no-preference"] as const).map((pref) => {
              const isSelected = editedMember.crowdPreference === pref;
              const showPref =
                isEditing || member.crowdPreference === pref;
              const label =
                pref === "avoid"
                  ? "Avoid Crowds"
                  : pref === "okay"
                  ? "Okay with Crowds"
                  : "No Preference";
              const emoji =
                pref === "avoid" ? "🚫" : pref === "okay" ? "👥" : "🤷";

              if (!showPref) return null;

              return (
                <motion.button
                  key={pref}
                  onClick={
                    isEditing
                      ? () =>
                          setEditedMember((prev) => ({
                            ...prev,
                            crowdPreference: pref,
                          }))
                      : undefined
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 transition-all border-2",
                    isEditing
                      ? isSelected
                        ? "bg-[var(--duo-blue)] text-white border-[var(--duo-blue)] shadow-[0_2px_0_#1D4ED8]"
                        : "bg-card border-border hover:border-[var(--duo-blue)] hover:text-[var(--duo-blue)]"
                      : "bg-[var(--duo-blue)]/10 text-[var(--duo-blue)] border-[var(--duo-blue)]/20"
                  )}
                  whileHover={isEditing ? { scale: 1.05 } : {}}
                  whileTap={isEditing ? { scale: 0.95 } : {}}
                  layout
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                  {isEditing && isSelected && <Check className="w-3 h-3" />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
