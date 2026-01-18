"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Check, AlertTriangle, Sparkles } from "lucide-react";
import { DuoResponsiveLayout } from "@/components/shared";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DuoButton } from "@/components/shared/duo-wizard-layout";
import { cn } from "@/lib/utils";

const reportCategories = [
  { id: "misinformation", label: "Misinformation" },
  { id: "inappropriate", label: "Inappropriate Content" },
  { id: "fraud", label: "Fraud or Scam" },
  { id: "harassment", label: "Hate Speech or Harassment" },
  { id: "irrelevant", label: "Irrelevant Content" },
  { id: "other", label: "Other" },
];

export default function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const [category, setCategory] = useState("misinformation");
  const [justification, setJustification] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleClose = () => {
    router.back();
  };

  const handleConfirm = () => {
    router.push(`/community/stories/${id}/report/success`);
  };

  const selectedCategory = reportCategories.find((c) => c.id === category);

  return (
    <DuoResponsiveLayout showTopBar showBottomNav>
      {/* Modal Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={handleClose}
      />

      {/* Report Modal */}
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
                <AlertTriangle className="w-6 h-6 text-[var(--duo-red)]" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold">Report Story</h2>
                <p className="text-sm text-muted-foreground">Help keep our community safe</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-xl border-2 border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Report Category */}
            <div className="space-y-2">
              <label className="font-bold text-sm">Report category</label>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="duo-input w-full flex items-center justify-between text-left"
                >
                  <span>{selectedCategory?.label || "Select category"}</span>
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
                      {reportCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setCategory(cat.id);
                            setShowDropdown(false);
                          }}
                          className={cn(
                            "w-full px-4 py-3 text-left text-sm font-medium hover:bg-muted transition-colors flex items-center justify-between",
                            category === cat.id && "bg-[var(--duo-green)]/10 text-[var(--duo-green)]"
                          )}
                        >
                          {cat.label}
                          {category === cat.id && (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Justification */}
            <div className="space-y-2">
              <label className="font-bold text-sm">Justification</label>
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Please provide details about why you are reporting this story..."
                className="duo-input min-h-[120px] resize-none w-full"
              />
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <button
            onClick={() => setConfirmed(!confirmed)}
            className="flex items-start gap-3 w-full text-left"
          >
            <div
              className={cn(
                "w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                confirmed
                  ? "bg-[var(--duo-green)] border-[var(--duo-green-dark)]"
                  : "border-border"
              )}
            >
              {confirmed && <Check className="w-4 h-4 text-white" />}
            </div>
            <span className="text-sm text-muted-foreground">
              I confirm that this report is not false, misleading, or intended to harass.
            </span>
          </button>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 py-3 px-4 rounded-xl border-2 border-border font-bold hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <DuoButton
              onClick={handleConfirm}
              disabled={!confirmed || !justification.trim()}
              fullWidth
              className="flex-1"
            >
              Submit Report
            </DuoButton>
          </div>

          {/* Helper text */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3 text-[var(--duo-yellow)]" />
            <span>Reports help keep our community safe for everyone</span>
          </div>
        </div>
      </motion.div>
    </DuoResponsiveLayout>
  );
}
