"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Users,
  Mail,
  X,
  ChevronRight,
  Crown,
  Check,
  Copy,
  Share2,
} from "lucide-react";
import { useTrip, type TripMember } from "@/contexts/trip-context";
import {
  DuoWizardLayout,
  DuoButton,
} from "@/components/shared/duo-wizard-layout";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { cn } from "@/lib/utils";

export default function MembersPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;

  const {
    currentTrip,
    loadTrip,
    addMember,
    removeMember,
    canProceed,
    setStep,
  } = useTrip();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!currentTrip || currentTrip.id !== tripId) {
      const loaded = loadTrip(tripId);
      if (!loaded) {
        router.replace("/trip/new");
      }
    }
  }, [tripId, currentTrip, loadTrip, router]);

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      addMember(newMemberName.trim(), newMemberEmail.trim());
      setNewMemberName("");
      setNewMemberEmail("");
      setShowAddModal(false);
    }
  };

  const handleCopyInvite = () => {
    const inviteLink = `${window.location.origin}/trip/${tripId}/join`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    setStep("preferences");
    router.push(`/trip/${tripId}/preferences`);
  };

  if (!currentTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <DuoMascot mood="thinking" size="lg" />
      </div>
    );
  }

  return (
    <>
      <DuoWizardLayout
        title="Who's coming?"
        subtitle={`Add your travel buddies to ${currentTrip.name}`}
        showProgress
        showBack
        onBack={() => router.push("/trip/new")}
        mascot={<DuoMascot mood="happy" size="md" />}
        footer={
          <div className="flex gap-3 w-full">
            <DuoButton
              variant="outline"
              onClick={() => setShowAddModal(true)}
              className="flex-1"
            >
              <UserPlus className="w-5 h-5 mr-1" />
              Add
            </DuoButton>
            <DuoButton
              onClick={handleContinue}
              disabled={!canProceed()}
              className="flex-1"
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-1" />
            </DuoButton>
          </div>
        }
      >
        <div className="w-full space-y-4">
          {/* Trip Info Card */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="duo-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{currentTrip.destination}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(currentTrip.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })} - {new Date(currentTrip.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--duo-blue)]" />
                <span className="font-bold">{currentTrip.members.length}</span>
              </div>
            </div>
          </motion.div>

          {/* Share Invite Link */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={handleCopyInvite}
            className="w-full duo-card duo-card-interactive p-4 flex items-center justify-between"
            style={{
              borderColor: copied ? "var(--duo-green)" : "var(--duo-blue)",
              boxShadow: copied
                ? "0 4px 0 var(--duo-green-dark)"
                : "0 4px 0 var(--duo-blue-dark)",
            }}
          >
            <div className="flex items-center gap-3">
              {copied ? (
                <Check className="w-5 h-5 text-[var(--duo-green)]" />
              ) : (
                <Share2 className="w-5 h-5 text-[var(--duo-blue)]" />
              )}
              <span className="font-bold">
                {copied ? "Link copied!" : "Share invite link"}
              </span>
            </div>
            <Copy className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          {/* Members List */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">
              Members ({currentTrip.members.length})
            </h3>

            <AnimatePresence mode="popLayout">
              {currentTrip.members.map((member, index) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  index={index}
                  onRemove={() => removeMember(member.id)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Minimum members hint */}
          {currentTrip.members.length < 2 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-muted-foreground"
            >
              Add at least 1 more member to continue
            </motion.p>
          )}
        </div>
      </DuoWizardLayout>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-card rounded-3xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-extrabold">Add Member</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-xl hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Name</label>
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Enter name..."
                    className="duo-input"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Email <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      placeholder="Enter email..."
                      className="duo-input !pl-12"
                    />
                  </div>
                </div>

                <DuoButton
                  onClick={handleAddMember}
                  disabled={!newMemberName.trim()}
                  fullWidth
                >
                  <UserPlus className="w-5 h-5 mr-1" />
                  Add Member
                </DuoButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// Member Card Component
// ============================================================================

interface MemberCardProps {
  member: TripMember;
  index: number;
  onRemove: () => void;
}

function MemberCard({ member, index, onRemove }: MemberCardProps) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "duo-card p-4 flex items-center gap-4",
        member.hasSetPreferences && "duo-card-green"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shrink-0",
          member.isOrganizer
            ? "bg-gradient-to-br from-[var(--duo-yellow)] to-[var(--duo-orange)]"
            : "bg-gradient-to-br from-[var(--duo-blue)] to-[var(--duo-purple)]"
        )}
      >
        {member.isOrganizer ? (
          <Crown className="w-5 h-5" />
        ) : (
          initials
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold truncate">{member.name}</span>
          {member.isOrganizer && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--duo-yellow)] text-black font-bold">
              Organizer
            </span>
          )}
        </div>
        {member.email && (
          <p className="text-sm text-muted-foreground truncate">{member.email}</p>
        )}
      </div>

      {/* Status / Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {member.hasSetPreferences ? (
          <div className="w-8 h-8 rounded-full bg-[var(--duo-green)] flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Pending</span>
        )}

        {!member.isOrganizer && (
          <button
            onClick={onRemove}
            className="p-2 rounded-xl hover:bg-destructive/10 text-destructive"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
