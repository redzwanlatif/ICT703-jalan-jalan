"use client";

import { useState, Suspense, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Sparkles,
  BarChart3,
  User,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { initialMembers } from "@/data/seed";
import { Member } from "@/types";
import { MemberCard } from "@/components/members/MemberCard";
import { DuoResponsiveLayout } from "@/components/shared";
import { DuoMascot } from "@/components/shared/duo-mascot";
import TabBar from "@/components/ui/TabBar";
import { GroupAggregate } from "@/components/members/GroupAggregate";
import { PreferenceChart } from "@/components/members/PreferenceChart";
import { IndividualMemberDetails } from "@/components/members/IndividualMemberDetails";
import Link from "next/link";
import { DashboardTripSelector, useSelectedTrip } from "@/components/dashboard/trip-selector";

function MembersContent() {
  const { selectedTrip } = useSelectedTrip();

  // Convert trip members to Member type or use initialMembers as fallback
  const tripMembers = useMemo(() => {
    if (selectedTrip?.members && selectedTrip.members.length > 0) {
      return selectedTrip.members.map((m, index) => ({
        id: m.id || `member-${index}`,
        name: m.name,
        budgetMin: 500,
        budgetMax: 2000,
        interests: ["Culture", "Food", "Nature"],
        seasons: ["CNY", "Raya"],
        avatar: m.avatar,
      })) as Member[];
    }
    return initialMembers;
  }, [selectedTrip]);

  const [members, setMembers] = useState<Member[]>(tripMembers);

  // Update members when trip changes
  useEffect(() => {
    setMembers(tripMembers);
  }, [tripMembers]);
  const [activeSection, setActiveSection] = useState<
    "overview" | "charts" | "details" | "cards"
  >("overview");

  const handleUpdateMember = (updatedMember: Member) => {
    setMembers((prevMembers) =>
      prevMembers.map((m) => (m.id === updatedMember.id ? updatedMember : m))
    );
  };

  return (
    <DuoResponsiveLayout showTopBar showBottomNav>
      <TabBar />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <DuoMascot mood="happy" size="sm" />
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">Group Members</h1>
            <p className="text-muted-foreground flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {selectedTrip?.destination || "Malaysia"} • {members.length} travelers
            </p>
          </div>
        </motion.div>

        {/* Trip Selector */}
        <Suspense fallback={<div className="duo-card p-3 animate-pulse h-16" />}>
          <DashboardTripSelector />
        </Suspense>

        {/* Section Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          {[
            { id: "overview", label: "Overview", icon: Users },
            { id: "charts", label: "Charts", icon: BarChart3 },
            { id: "details", label: "Details", icon: User },
            { id: "cards", label: "Cards", icon: MapPin },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as typeof activeSection)}
                className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-all border-2 ${
                  isActive
                    ? "bg-[var(--duo-green)] text-white border-[var(--duo-green)] shadow-[0_3px_0_var(--duo-green-dark)]"
                    : "bg-card border-border hover:border-[var(--duo-green)]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Overview Section */}
        {activeSection === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h2 className="font-extrabold flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--duo-blue)]" />
              Group Overview
            </h2>
            <GroupAggregate members={members} />
          </motion.div>
        )}

        {/* Charts Section */}
        {activeSection === "charts" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h2 className="font-extrabold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[var(--duo-purple)]" />
              Group Preferences
            </h2>
            <PreferenceChart members={members} />
          </motion.div>
        )}

        {/* Details Section */}
        {activeSection === "details" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h2 className="font-extrabold flex items-center gap-2">
              <User className="w-5 h-5 text-[var(--duo-green)]" />
              Individual Details
            </h2>
            <div className="duo-card p-4">
              <IndividualMemberDetails members={members} />
            </div>
          </motion.div>
        )}

        {/* Cards Section */}
        {activeSection === "cards" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h2 className="font-extrabold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[var(--duo-orange)]" />
              All Members
            </h2>
            <div className="space-y-4">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <MemberCard member={member} onUpdate={handleUpdateMember} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Navigation Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-4"
        >
          <Link href="/dashboard">
            <button className="w-full duo-btn duo-btn-outline">
              <ChevronRight className="w-5 h-5 mr-2 rotate-180" />
              Back to Dashboard
            </button>
          </Link>
        </motion.div>

        {/* XP Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2"
        >
          <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
          <span>
            Earn <strong className="text-[var(--duo-green)]">+5 XP</strong> for
            updating member preferences!
          </span>
        </motion.div>
      </div>
    </DuoResponsiveLayout>
  );
}

export default function MembersPage() {
  return (
    <Suspense fallback={
      <DuoResponsiveLayout showTopBar showBottomNav>
        <TabBar />
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-muted rounded-xl" />
            <div className="h-12 bg-muted rounded-xl" />
            <div className="h-64 bg-muted rounded-xl" />
          </div>
        </div>
      </DuoResponsiveLayout>
    }>
      <MembersContent />
    </Suspense>
  );
}
