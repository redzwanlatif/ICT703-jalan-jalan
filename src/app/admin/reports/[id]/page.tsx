"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  PlaneTakeoff,
  X,
  FileWarning,
  Calendar,
  Mail,
  AlertTriangle,
  FileText,
  Trash2,
  XCircle,
  Check,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { DuoAppShell } from "@/components/shared/duo-bottom-nav";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DuoButton } from "@/components/shared/duo-wizard-layout";
import { cn } from "@/lib/utils";

const deleteReasons = [
  { id: "misleading", label: "The community story contains misleading information" },
  { id: "inappropriate", label: "Inappropriate content" },
  { id: "spam", label: "Spam or promotional content" },
  { id: "other", label: "Other" },
];

// Mock report data
const reportData = {
  id: 1,
  reportDate: "21/1/2026",
  email: "ali@gmail.com",
  typeOfReport: "Misinformation",
  justification:
    "The community story claims the resort offered activity such as fitness classes. However, according to the official website and my visit on 31 December 2025, the activity is actually not available at their resort. This information mislead others during their trip.",
  story: {
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
  },
};

export default function AdminReportDetailPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState("misleading");
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedReason = deleteReasons.find((r) => r.id === deleteReason);

  return (
    <DuoAppShell showTopBar showBottomNav>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Link href="/admin">
            <button className="w-10 h-10 rounded-xl border-2 border-border flex items-center justify-center hover:bg-muted transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">Report Details</h1>
            <p className="text-muted-foreground">Review and take action</p>
          </div>
          <DuoMascot mood="thinking" size="sm" />
        </motion.div>

        {/* Story Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="duo-card overflow-hidden"
        >
          {/* Location Header */}
          <div className="p-5 border-b-2 border-border">
            <h2 className="font-extrabold text-lg">{reportData.story.location}</h2>
            <p className="text-sm text-muted-foreground">{reportData.story.address}</p>
          </div>

          {/* Main Image */}
          <div className="w-full h-64 md:h-80 bg-gradient-to-br from-[var(--duo-green)] to-[var(--duo-green-dark)]" />

          {/* Image Carousel */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-xl border-2 border-border flex items-center justify-center hover:bg-muted transition-colors shrink-0">
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex-1 grid grid-cols-3 gap-3">
                {reportData.story.images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="aspect-video rounded-xl bg-gradient-to-br from-[var(--duo-blue)]/30 to-[var(--duo-blue)]/50 border-2 border-border"
                  />
                ))}
              </div>

              <button className="w-10 h-10 rounded-xl border-2 border-border flex items-center justify-center hover:bg-muted transition-colors shrink-0">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Author & Story Content */}
          <div className="p-5 border-t-2 border-border space-y-4">
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--duo-green)] flex items-center justify-center text-white font-bold text-sm">
                {reportData.story.author.avatar}
              </div>
              <span className="font-bold">{reportData.story.author.name}</span>
              <PlaneTakeoff className="w-5 h-5 text-[var(--duo-purple)]" />
              <span className="text-xs px-2 py-1 rounded-full bg-[var(--duo-purple)]/10 text-[var(--duo-purple)] font-bold border border-[var(--duo-purple)]/30">
                {reportData.story.author.badge}
              </span>
            </div>

            {/* Story Title & Content */}
            <h3 className="font-extrabold">{reportData.story.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {reportData.story.content}
            </p>
          </div>
        </motion.div>

        {/* Report Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="duo-card p-5 space-y-5"
        >
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <FileWarning className="w-5 h-5 text-[var(--duo-red)]" />
            Report Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Report Date */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
              <div className="w-10 h-10 rounded-xl bg-[var(--duo-blue)]/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[var(--duo-blue)]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Report Date</p>
                <p className="font-bold">{reportData.reportDate}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
              <div className="w-10 h-10 rounded-xl bg-[var(--duo-purple)]/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[var(--duo-purple)]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Reporter Email</p>
                <p className="font-bold">{reportData.email}</p>
              </div>
            </div>

            {/* Type of Report */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
              <div className="w-10 h-10 rounded-xl bg-[var(--duo-orange)]/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[var(--duo-orange)]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Type of Report</p>
                <p className="font-bold">{reportData.typeOfReport}</p>
              </div>
            </div>
          </div>

          {/* Justification */}
          <div className="p-4 rounded-xl bg-[var(--duo-red)]/5 border-2 border-[var(--duo-red)]/20">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-[var(--duo-red)]" />
              <span className="font-bold text-sm">Justification</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {reportData.justification}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button className="flex-1 py-3 px-4 rounded-xl border-2 border-[var(--duo-green)] text-[var(--duo-green)] font-bold hover:bg-[var(--duo-green)]/10 transition-colors flex items-center justify-center gap-2">
              <XCircle className="w-5 h-5" />
              Reject Report
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-[var(--duo-red)] text-white font-bold hover:bg-[var(--duo-red)]/90 transition-colors shadow-[0_4px_0_#B91C1C] hover:translate-y-[2px] hover:shadow-[0_2px_0_#B91C1C] flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete Story
            </button>
          </div>
        </motion.div>

        {/* XP Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-4"
        >
          <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
          <span>
            Earn <strong className="text-[var(--duo-green)]">+15 XP</strong> for reviewing this report!
          </span>
        </motion.div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowDeleteModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg bg-white rounded-2xl z-50 border-2 border-border shadow-[0_8px_0_rgba(0,0,0,0.1)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--duo-red)]/10 flex items-center justify-center">
                      <Trash2 className="w-6 h-6 text-[var(--duo-red)]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold">Delete Story</h2>
                      <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="w-10 h-10 rounded-xl border-2 border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Reason Selection */}
                <div className="space-y-2">
                  <label className="font-bold text-sm">Reason for deletion</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="duo-input w-full flex items-center justify-between text-left"
                    >
                      <span className="text-sm">{selectedReason?.label || "Select reason"}</span>
                      <ChevronDown className={cn(
                        "w-5 h-5 transition-transform",
                        showDropdown && "rotate-180"
                      )} />
                    </button>

                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-border rounded-xl shadow-lg z-10 overflow-hidden"
                        >
                          {deleteReasons.map((reason) => (
                            <button
                              key={reason.id}
                              onClick={() => {
                                setDeleteReason(reason.id);
                                setShowDropdown(false);
                              }}
                              className={cn(
                                "w-full px-4 py-3 text-left text-sm font-medium hover:bg-muted transition-colors flex items-center justify-between",
                                deleteReason === reason.id && "bg-[var(--duo-red)]/10 text-[var(--duo-red)]"
                              )}
                            >
                              {reason.label}
                              {deleteReason === reason.id && (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-3 px-4 rounded-xl border-2 border-border font-bold hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <Link href="/admin" className="flex-1">
                    <button className="w-full py-3 px-4 rounded-xl bg-[var(--duo-red)] text-white font-bold hover:bg-[var(--duo-red)]/90 transition-colors shadow-[0_4px_0_#B91C1C] hover:translate-y-[2px] hover:shadow-[0_2px_0_#B91C1C]">
                      Confirm Delete
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DuoAppShell>
  );
}
