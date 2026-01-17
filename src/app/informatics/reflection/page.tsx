"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, BookOpen, Calendar, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import { DuoAppShell } from "@/components/shared/duo-bottom-nav";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DuoButton } from "@/components/shared/duo-wizard-layout";
import { cn } from "@/lib/utils";

interface Trip {
  id: number;
  name: string;
  destination: string;
  country: string;
  dates: string;
  image: string;
  budgetData: {
    category: string;
    planned: number;
    actual: number;
  }[];
}

const trips: Trip[] = [
  {
    id: 1,
    name: "Europe 2024",
    destination: "Europe",
    country: "Multiple Countries",
    dates: "Sep 5 - Sep 20",
    image: "✈️",
    budgetData: [
      { category: "Flights", planned: 3000, actual: 2800 },
      { category: "Hotels", planned: 4000, actual: 4500 },
      { category: "Food", planned: 2000, actual: 2800 },
      { category: "Transport", planned: 1000, actual: 1200 },
      { category: "Activities", planned: 1500, actual: 1800 },
    ],
  },
  {
    id: 2,
    name: "Penang Trip",
    destination: "Penang",
    country: "Malaysia",
    dates: "Aug 12 - Aug 14",
    image: "🍜",
    budgetData: [
      { category: "Transport", planned: 200, actual: 180 },
      { category: "Hotels", planned: 300, actual: 280 },
      { category: "Food", planned: 250, actual: 320 },
      { category: "Activities", planned: 150, actual: 120 },
    ],
  },
  {
    id: 3,
    name: "Johor Getaway",
    destination: "Johor Bahru",
    country: "Malaysia",
    dates: "Jul 5 - Jul 7",
    image: "🏖️",
    budgetData: [
      { category: "Transport", planned: 150, actual: 140 },
      { category: "Hotels", planned: 400, actual: 380 },
      { category: "Food", planned: 300, actual: 350 },
      { category: "Activities", planned: 200, actual: 180 },
    ],
  },
  {
    id: 4,
    name: "Melaka Heritage",
    destination: "Melaka",
    country: "Malaysia",
    dates: "Jun 8 - Jun 10",
    image: "🏛️",
    budgetData: [
      { category: "Transport", planned: 100, actual: 90 },
      { category: "Hotels", planned: 250, actual: 240 },
      { category: "Food", planned: 200, actual: 180 },
      { category: "Activities", planned: 50, actual: 60 },
    ],
  },
];

const tags = ["Hidden Fees", "Impulse Buy", "Transport", "Emergency", "Dining Out", "Shopping"];

export default function ReflectionPage() {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [selectedTripId, setSelectedTripId] = useState<number>(1);

  const selectedTrip = trips.find((trip) => trip.id === selectedTripId) || trips[0];
  const budgetData = selectedTrip.budgetData;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const maxValue = Math.max(...budgetData.flatMap((d) => [d.planned, d.actual]));

  const handleSave = () => {
    router.push("/informatics/dashboard");
  };

  return (
    <DuoAppShell showTopBar showBottomNav>
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <DuoMascot mood="thinking" size="sm" />
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">Trip Report</h1>
            <p className="text-muted-foreground">Reflect on {selectedTrip.name}</p>
          </div>
        </motion.div>

        {/* Trip Selection */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h2 className="font-extrabold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[var(--duo-blue)]" />
            Select Trip
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {trips.map((trip, index) => (
              <motion.button
                key={trip.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => setSelectedTripId(trip.id)}
                className={cn(
                  "text-left transition-all rounded-2xl p-3 border-2",
                  selectedTripId === trip.id
                    ? "border-[var(--duo-green)] bg-[var(--duo-green)]/10 shadow-[0_4px_0_var(--duo-green)]"
                    : "border-border bg-white hover:border-[var(--duo-blue)] shadow-[0_4px_0_#E5E5E5]"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{trip.image}</span>
                  <h3 className="font-bold text-sm truncate">{trip.destination}</h3>
                </div>
                <p className="text-xs text-muted-foreground truncate">{trip.country}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{trip.dates}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Selected Trip Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="duo-card p-4"
          style={{
            background: "linear-gradient(135deg, var(--duo-purple) 0%, #A855F7 100%)",
            borderColor: "#7C3AED",
          }}
        >
          <div className="flex items-center gap-3 text-white">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
              {selectedTrip.image}
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold">{selectedTrip.destination}</h3>
              <p className="text-sm text-white/80">{selectedTrip.country}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-white/70">
                <Calendar className="w-3 h-3" />
                {selectedTrip.dates}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="font-extrabold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[var(--duo-orange)]" />
            Budget vs Actual
          </h2>

          <div className="duo-card p-5 space-y-4">
            {budgetData.map((item, index) => {
              const plannedWidth = (item.planned / maxValue) * 100;
              const actualWidth = (item.actual / maxValue) * 100;
              const isOver = item.actual > item.planned;
              const percentDiff = (((item.actual - item.planned) / item.planned) * 100).toFixed(0);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold">{item.category}</span>
                    <span
                      className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-full",
                        isOver
                          ? "bg-[var(--duo-orange)]/20 text-[var(--duo-orange)]"
                          : "bg-[var(--duo-green)]/20 text-[var(--duo-green)]"
                      )}
                    >
                      {isOver ? "+" : ""}{percentDiff}%
                    </span>
                  </div>
                  <div className="relative h-6 flex gap-1">
                    {/* Planned Bar */}
                    <div
                      className="h-full bg-muted rounded-lg transition-all duration-500"
                      style={{ width: `${plannedWidth}%` }}
                    />
                    {/* Actual Bar */}
                    <div
                      className={cn(
                        "h-full rounded-lg transition-all duration-700",
                        isOver ? "bg-[var(--duo-orange)]" : "bg-[var(--duo-green)]"
                      )}
                      style={{ width: `${actualWidth}%` }}
                    />
                  </div>
                </motion.div>
              );
            })}

            {/* Legend */}
            <div className="flex items-center gap-4 pt-4 border-t-2 border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-muted" />
                <span className="text-xs text-muted-foreground font-semibold">Planned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[var(--duo-green)]" />
                <span className="text-xs text-muted-foreground font-semibold">Under</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[var(--duo-orange)]" />
                <span className="text-xs text-muted-foreground font-semibold">Over</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Reason Tags */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3"
        >
          <h2 className="font-extrabold">Why did you exceed the budget?</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <motion.button
                key={tag}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all border-2",
                  selectedTags.includes(tag)
                    ? "bg-[var(--duo-green)] border-[var(--duo-green-dark)] text-white shadow-[0_3px_0_var(--duo-green-dark)]"
                    : "bg-white border-border hover:border-[var(--duo-blue)] shadow-[0_3px_0_#E5E5E5]"
                )}
              >
                {selectedTags.includes(tag) && <Check className="w-3 h-3 inline mr-1" />}
                {tag}
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Note to Future Self */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h2 className="font-extrabold">Note to future self</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What would you do differently next time?"
            className="duo-input min-h-[100px] resize-none w-full"
          />
        </motion.section>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="space-y-4 pt-4"
        >
          <DuoButton onClick={handleSave} fullWidth size="lg">
            <BookOpen className="w-5 h-5 mr-2" />
            Save Lesson to Profile
          </DuoButton>

          <Link href="/community/stories/create">
            <button className="w-full duo-btn duo-btn-outline">
              Share Your Story
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </Link>

          {/* XP Hint */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
            <span>
              Earn <strong className="text-[var(--duo-green)]">+30 XP</strong> for completing your reflection!
            </span>
          </div>
        </motion.div>
      </div>
    </DuoAppShell>
  );
}
