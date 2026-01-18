"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  Plane,
  Wallet,
  ChevronLeft,
  Check,
  Clock,
  Zap,
  Leaf,
} from "lucide-react";
import { DuoResponsiveLayout } from "@/components/shared";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DuoButton, DuoSlider } from "@/components/shared/duo-wizard-layout";
import { useGamification } from "@/contexts/gamification-context";
import { cn } from "@/lib/utils";

export default function EditDNAPage() {
  const router = useRouter();
  const {
    comfortCost,
    setComfortCost,
    travelPacing,
    setTravelPacing,
    annualBudget,
    setAnnualBudget,
    addXp,
  } = useGamification();

  const [localComfortCost, setLocalComfortCost] = useState(comfortCost);
  const [localPacing, setLocalPacing] = useState(travelPacing);
  const [localBudget, setLocalBudget] = useState(annualBudget.toString());

  const formatBudget = (value: string) => {
    const num = parseInt(value.replace(/\D/g, "")) || 0;
    return num.toLocaleString();
  };

  const handleSave = () => {
    setComfortCost(localComfortCost);
    setTravelPacing(localPacing);
    setAnnualBudget(parseInt(localBudget.replace(/\D/g, "")) || 15000);
    addXp(10, "Travel DNA updated!");
    router.push("/informatics/dashboard");
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
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl border-2 border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">Edit Travel DNA</h1>
            <p className="text-muted-foreground text-sm">
              Update your travel preferences
            </p>
          </div>
          <DuoMascot mood="happy" size="sm" />
        </motion.div>

        {/* Comfort vs Cost Slider */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="duo-card p-5 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--duo-green)]/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[var(--duo-green)]" />
            </div>
            <div>
              <h3 className="font-bold">Comfort vs. Cost</h3>
              <p className="text-xs text-muted-foreground">
                What matters more to you?
              </p>
            </div>
          </div>

          <div className="py-4">
            <DuoSlider
              value={localComfortCost}
              onChange={setLocalComfortCost}
              min={0}
              max={100}
            />
          </div>

          <div className="flex justify-between">
            <motion.button
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all border-2",
                localComfortCost < 50
                  ? "border-[var(--duo-green)] bg-[var(--duo-green)]/10 text-[var(--duo-green)]"
                  : "border-border text-muted-foreground"
              )}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLocalComfortCost(25)}
            >
              <Leaf className="w-4 h-4 inline mr-1" />
              Value Saver
            </motion.button>
            <motion.button
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all border-2",
                localComfortCost >= 50
                  ? "border-[var(--duo-purple)] bg-[var(--duo-purple)]/10 text-[var(--duo-purple)]"
                  : "border-border text-muted-foreground"
              )}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLocalComfortCost(75)}
            >
              <Sparkles className="w-4 h-4 inline mr-1" />
              Luxury
            </motion.button>
          </div>
        </motion.div>

        {/* Pacing Slider */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="duo-card p-5 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--duo-blue)]/20 flex items-center justify-center">
              <Plane className="w-5 h-5 text-[var(--duo-blue)]" />
            </div>
            <div>
              <h3 className="font-bold">Travel Pacing</h3>
              <p className="text-xs text-muted-foreground">
                How do you like to explore?
              </p>
            </div>
          </div>

          <div className="py-4">
            <DuoSlider
              value={localPacing}
              onChange={setLocalPacing}
              min={0}
              max={100}
            />
          </div>

          <div className="flex justify-between">
            <motion.button
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all border-2",
                localPacing < 50
                  ? "border-[var(--duo-blue)] bg-[var(--duo-blue)]/10 text-[var(--duo-blue)]"
                  : "border-border text-muted-foreground"
              )}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLocalPacing(25)}
            >
              <Clock className="w-4 h-4 inline mr-1" />
              Relaxed
            </motion.button>
            <motion.button
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all border-2",
                localPacing >= 50
                  ? "border-[var(--duo-orange)] bg-[var(--duo-orange)]/10 text-[var(--duo-orange)]"
                  : "border-border text-muted-foreground"
              )}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLocalPacing(75)}
            >
              <Zap className="w-4 h-4 inline mr-1" />
              Packed
            </motion.button>
          </div>
        </motion.div>

        {/* Budget Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="duo-card p-5 space-y-4"
          style={{
            background:
              "linear-gradient(135deg, var(--duo-green) 0%, var(--duo-green-dark) 100%)",
            borderColor: "var(--duo-green-dark)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Annual Travel Budget</h3>
              <p className="text-xs text-white/80">
                Set your yearly travel goal
              </p>
            </div>
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">
              RM
            </span>
            <input
              type="text"
              value={formatBudget(localBudget)}
              onChange={(e) => setLocalBudget(e.target.value.replace(/\D/g, ""))}
              className="duo-input !pl-14 text-2xl font-extrabold h-16"
              placeholder="15,000"
            />
          </div>

          <p className="text-xs text-white/80 text-center">
            This helps us track your spending patterns
          </p>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 pt-4"
        >
          <DuoButton onClick={handleSave} fullWidth size="lg">
            <Check className="w-5 h-5 mr-2" />
            Save Changes
          </DuoButton>

          <button
            onClick={() => router.back()}
            className="w-full py-3 text-muted-foreground font-bold hover:text-foreground transition-colors"
          >
            Cancel
          </button>

          {/* XP Hint */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
            <span>
              Earn <strong className="text-[var(--duo-green)]">+10 XP</strong> for
              updating your profile!
            </span>
          </div>
        </motion.div>
      </div>
    </DuoResponsiveLayout>
  );
}
