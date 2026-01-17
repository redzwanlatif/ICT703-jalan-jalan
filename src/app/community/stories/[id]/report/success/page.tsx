"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { DuoAppShell } from "@/components/shared/duo-bottom-nav";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DuoButton } from "@/components/shared/duo-wizard-layout";

export default function ReportSuccessPage() {
  return (
    <DuoAppShell showTopBar showBottomNav>
      {/* Modal Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Success Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-white rounded-2xl z-50 border-2 border-border shadow-[0_8px_0_rgba(0,0,0,0.1)]"
      >
        <div className="p-8 space-y-6 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
            className="mx-auto w-20 h-20 rounded-full bg-[var(--duo-green)] flex items-center justify-center shadow-[0_6px_0_var(--duo-green-dark)]"
          >
            <Check className="w-10 h-10 text-white stroke-[3]" />
          </motion.div>

          {/* Mascot */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <DuoMascot mood="happy" size="md" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <h2 className="text-2xl font-extrabold text-[var(--duo-green)]">
              Report Submitted!
            </h2>
            <p className="text-muted-foreground">
              Thank you for helping keep our community safe. We'll review your report and take appropriate action.
            </p>
          </motion.div>

          {/* XP Reward */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--duo-yellow)]/20 border-2 border-[var(--duo-yellow)]"
          >
            <Sparkles className="w-5 h-5 text-[var(--duo-yellow)]" />
            <span className="font-extrabold text-[var(--duo-yellow)]">+10 XP</span>
            <span className="text-sm text-muted-foreground">for reporting</span>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/community/stories">
              <DuoButton fullWidth size="lg">
                Back to Stories
                <ArrowRight className="w-5 h-5 ml-2" />
              </DuoButton>
            </Link>
          </motion.div>

          {/* Info text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xs text-muted-foreground"
          >
            You'll receive a notification once we've reviewed your report
          </motion.p>
        </div>
      </motion.div>
    </DuoAppShell>
  );
}
