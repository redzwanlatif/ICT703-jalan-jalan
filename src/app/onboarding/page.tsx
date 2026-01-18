"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Wallet,
  Calendar,
  Mountain,
  Utensils,
  Camera,
  Music,
  Palmtree,
  Building,
  Heart,
  Compass,
  Target,
  TrendingUp,
  Users,
  Sparkles,
  ChevronRight,
  Leaf,
  Zap,
  Clock,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
} from "lucide-react";
import { useGamification, type OnboardingStep } from "@/contexts/gamification-context";
import {
  DuoWizardLayout,
  DuoWizardOption,
  DuoWizardMultiOption,
  DuoButton,
  DuoSlider,
} from "@/components/shared/duo-wizard-layout";
import { DuoMascot, DuoMascotWithSpeech } from "@/components/shared/duo-mascot";
import { cn } from "@/lib/utils";

// ============================================================================
// Step Components
// ============================================================================

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <DuoWizardLayout
      showProgress={false}
      showBack={false}
      showSkip={false}
      showHome
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <DuoMascot mood="excited" size="xl" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-extrabold mt-8 mb-4"
        >
          Welcome!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-muted-foreground mb-8 max-w-md"
        >
          Your travel adventure starts here. Let&apos;s set up your profile to personalize your experience!
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-xs"
        >
          <DuoButton onClick={onNext} size="lg" fullWidth>
            Let&apos;s Go! <ChevronRight className="w-5 h-5" />
          </DuoButton>
        </motion.div>
      </div>
    </DuoWizardLayout>
  );
}

function CreateAccountStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const canContinue = name.trim() && email.trim() && password.length >= 6;

  const handleContinue = () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    // Store in sessionStorage for now (would normally send to backend)
    sessionStorage.setItem("onboarding-user", JSON.stringify({ name, email }));
    onNext();
  };

  return (
    <DuoWizardLayout
      title="Create your account"
      subtitle="Join thousands of travelers exploring the world"
      showBack
      showSkip={false}
      onBack={onBack}
      mascot={<DuoMascot mood="waving" size="md" />}
      footer={
        <DuoButton
          onClick={handleContinue}
          disabled={!canContinue}
          fullWidth
        >
          Continue
        </DuoButton>
      }
    >
      <div className="w-full space-y-4">
        {/* Name Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-bold mb-2">Your name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="What should we call you?"
              className="duo-input !pl-12"
            />
          </div>
        </motion.div>

        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-bold mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="your@email.com"
              className="duo-input !pl-12"
            />
          </div>
        </motion.div>

        {/* Password Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-bold mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Create a password (min 6 chars)"
              className="duo-input !pl-12 !pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3 rounded-xl bg-[var(--duo-red)]/10 border-2 border-[var(--duo-red)] text-[var(--duo-red)] text-sm font-semibold text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Login Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-muted-foreground pt-2"
        >
          Already have an account?{" "}
          <a href="/login" className="font-bold text-[var(--duo-blue)] hover:underline">
            Log in
          </a>
        </motion.p>
      </div>
    </DuoWizardLayout>
  );
}

function TravelStyleStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { travelStyle, setTravelStyle } = useGamification();

  const styles = [
    {
      value: "budget" as const,
      icon: <Wallet className="w-6 h-6 text-[var(--duo-green)]" />,
      title: "Budget Explorer",
      description: "I love finding deals and stretching my travel budget",
    },
    {
      value: "comfort" as const,
      icon: <Plane className="w-6 h-6 text-[var(--duo-blue)]" />,
      title: "Comfort Seeker",
      description: "A balance of value and comfort is perfect for me",
    },
    {
      value: "luxury" as const,
      icon: <Sparkles className="w-6 h-6 text-[var(--duo-purple)]" />,
      title: "Luxury Traveler",
      description: "I prefer premium experiences and top-notch service",
    },
  ];

  return (
    <DuoWizardLayout
      title="What's your travel style?"
      subtitle="This helps us recommend the best options for you"
      showBack
      showSkip
      onBack={onBack}
      mascot={<DuoMascot mood="thinking" size="md" />}
      footer={
        <DuoButton
          onClick={onNext}
          disabled={!travelStyle}
          fullWidth
        >
          Continue
        </DuoButton>
      }
    >
      <div className="duo-wizard-options">
        {styles.map((style) => (
          <DuoWizardOption
            key={style.value}
            selected={travelStyle === style.value}
            onClick={() => setTravelStyle(style.value)}
            icon={style.icon}
          >
            <div>
              <p className="font-bold text-lg">{style.title}</p>
              <p className="text-sm text-muted-foreground">{style.description}</p>
            </div>
          </DuoWizardOption>
        ))}
      </div>
    </DuoWizardLayout>
  );
}

function TravelDNAStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const {
    comfortCost, setComfortCost,
    travelPacing, setTravelPacing,
    annualBudget, setAnnualBudget
  } = useGamification();

  const [budgetInput, setBudgetInput] = useState(annualBudget.toLocaleString());

  const formatBudget = (value: string) => {
    const num = parseInt(value.replace(/\D/g, "")) || 0;
    return num.toLocaleString();
  };

  const handleBudgetChange = (value: string) => {
    const num = parseInt(value.replace(/\D/g, "")) || 0;
    setBudgetInput(formatBudget(value));
    setAnnualBudget(num);
  };

  return (
    <DuoWizardLayout
      title="Define Your Travel DNA"
      subtitle="These preferences help personalize your experience"
      showBack
      showSkip
      onBack={onBack}
      mascot={<DuoMascot mood="encouraging" size="md" />}
      footer={
        <DuoButton onClick={onNext} fullWidth>
          Continue
        </DuoButton>
      }
    >
      <div className="w-full space-y-5">
        {/* Comfort vs Cost */}
        <div className="duo-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-jj-green/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-jj-green" />
            </div>
            <div>
              <h3 className="font-bold">Comfort vs. Cost</h3>
              <p className="text-xs text-muted-foreground">What matters more?</p>
            </div>
          </div>

          <DuoSlider
            value={comfortCost}
            onChange={setComfortCost}
            min={0}
            max={100}
          />

          <div className="flex justify-between">
            <button
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2",
                comfortCost < 50
                  ? "border-jj-green bg-jj-green/10 text-jj-green"
                  : "border-border text-muted-foreground"
              )}
              onClick={() => setComfortCost(25)}
            >
              <Leaf className="w-3 h-3 inline mr-1" />
              Value Saver
            </button>
            <button
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2",
                comfortCost >= 50
                  ? "border-jj-navy bg-jj-navy/10 text-jj-navy"
                  : "border-border text-muted-foreground"
              )}
              onClick={() => setComfortCost(75)}
            >
              <Sparkles className="w-3 h-3 inline mr-1" />
              Luxury
            </button>
          </div>
        </div>

        {/* Travel Pacing */}
        <div className="duo-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-jj-sky/20 flex items-center justify-center">
              <Plane className="w-5 h-5 text-jj-sky-dark" />
            </div>
            <div>
              <h3 className="font-bold">Travel Pacing</h3>
              <p className="text-xs text-muted-foreground">How do you explore?</p>
            </div>
          </div>

          <DuoSlider
            value={travelPacing}
            onChange={setTravelPacing}
            min={0}
            max={100}
          />

          <div className="flex justify-between">
            <button
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2",
                travelPacing < 50
                  ? "border-jj-sky bg-jj-sky/10 text-jj-sky-dark"
                  : "border-border text-muted-foreground"
              )}
              onClick={() => setTravelPacing(25)}
            >
              <Clock className="w-3 h-3 inline mr-1" />
              Relaxed
            </button>
            <button
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2",
                travelPacing >= 50
                  ? "border-jj-terracotta bg-jj-terracotta/10 text-jj-terracotta"
                  : "border-border text-muted-foreground"
              )}
              onClick={() => setTravelPacing(75)}
            >
              <Zap className="w-3 h-3 inline mr-1" />
              Packed
            </button>
          </div>
        </div>

        {/* Annual Budget */}
        <div
          className="duo-card p-5 space-y-4"
          style={{
            background: "linear-gradient(135deg, var(--jj-terracotta) 0%, var(--jj-terracotta-dark) 100%)",
            borderColor: "var(--jj-terracotta-dark)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Annual Travel Budget</h3>
              <p className="text-xs text-white/80">Your yearly travel goal</p>
            </div>
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">
              RM
            </span>
            <input
              type="text"
              value={budgetInput}
              onChange={(e) => handleBudgetChange(e.target.value)}
              className="duo-input !pl-14 text-xl font-extrabold h-14"
              placeholder="15,000"
            />
          </div>
        </div>
      </div>
    </DuoWizardLayout>
  );
}

function FrequencyStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { tripFrequency, setTripFrequency } = useGamification();

  const frequencies = [
    {
      value: "rarely" as const,
      icon: "🌱",
      title: "Just Getting Started",
      description: "1-2 trips per year",
    },
    {
      value: "sometimes" as const,
      icon: "✈️",
      title: "Regular Traveler",
      description: "3-5 trips per year",
    },
    {
      value: "often" as const,
      icon: "🌍",
      title: "Frequent Flyer",
      description: "6+ trips per year",
    },
  ];

  return (
    <DuoWizardLayout
      title="How often do you travel?"
      subtitle="We'll adjust recommendations based on your travel frequency"
      showBack
      showSkip
      onBack={onBack}
      mascot={<DuoMascot mood="happy" size="md" />}
      footer={
        <DuoButton
          onClick={onNext}
          disabled={!tripFrequency}
          fullWidth
        >
          Continue
        </DuoButton>
      }
    >
      <div className="duo-wizard-options">
        {frequencies.map((freq) => (
          <DuoWizardOption
            key={freq.value}
            selected={tripFrequency === freq.value}
            onClick={() => setTripFrequency(freq.value)}
            icon={<span className="text-2xl">{freq.icon}</span>}
          >
            <div>
              <p className="font-bold text-lg">{freq.title}</p>
              <p className="text-sm text-muted-foreground">{freq.description}</p>
            </div>
          </DuoWizardOption>
        ))}
      </div>
    </DuoWizardLayout>
  );
}

function InterestsStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { interests, setInterests } = useGamification();

  const allInterests = [
    { id: "nature", icon: <Mountain className="w-4 h-4" />, label: "Nature" },
    { id: "food", icon: <Utensils className="w-4 h-4" />, label: "Food" },
    { id: "culture", icon: <Building className="w-4 h-4" />, label: "Culture" },
    { id: "adventure", icon: <Compass className="w-4 h-4" />, label: "Adventure" },
    { id: "relaxation", icon: <Palmtree className="w-4 h-4" />, label: "Relaxation" },
    { id: "photography", icon: <Camera className="w-4 h-4" />, label: "Photography" },
    { id: "nightlife", icon: <Music className="w-4 h-4" />, label: "Nightlife" },
    { id: "romance", icon: <Heart className="w-4 h-4" />, label: "Romance" },
  ];

  const toggleInterest = (id: string) => {
    if (interests.includes(id)) {
      setInterests(interests.filter((i) => i !== id));
    } else {
      setInterests([...interests, id]);
    }
  };

  return (
    <DuoWizardLayout
      title="What do you love about traveling?"
      subtitle="Select all that interest you (pick at least 2)"
      showBack
      showSkip
      onBack={onBack}
      mascot={<DuoMascot mood="excited" size="md" />}
      footer={
        <DuoButton
          onClick={onNext}
          disabled={interests.length < 2}
          fullWidth
        >
          Continue
        </DuoButton>
      }
    >
      <div className="grid grid-cols-2 gap-3 w-full">
        {allInterests.map((interest) => (
          <DuoWizardMultiOption
            key={interest.id}
            selected={interests.includes(interest.id)}
            onClick={() => toggleInterest(interest.id)}
            icon={interest.icon}
          >
            {interest.label}
          </DuoWizardMultiOption>
        ))}
      </div>
    </DuoWizardLayout>
  );
}

function GoalsStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { travelGoals, setTravelGoals } = useGamification();

  const allGoals = [
    { id: "explore-new", icon: <Compass className="w-4 h-4" />, label: "Explore new places" },
    { id: "save-money", icon: <Wallet className="w-4 h-4" />, label: "Save on travel" },
    { id: "plan-better", icon: <Target className="w-4 h-4" />, label: "Plan trips better" },
    { id: "track-spending", icon: <TrendingUp className="w-4 h-4" />, label: "Track spending" },
    { id: "meet-people", icon: <Users className="w-4 h-4" />, label: "Meet travelers" },
    { id: "create-memories", icon: <Camera className="w-4 h-4" />, label: "Create memories" },
  ];

  const toggleGoal = (id: string) => {
    if (travelGoals.includes(id)) {
      setTravelGoals(travelGoals.filter((g) => g !== id));
    } else {
      setTravelGoals([...travelGoals, id]);
    }
  };

  return (
    <DuoWizardLayout
      title="What are your travel goals?"
      subtitle="We'll help you achieve them!"
      showBack
      showSkip
      onBack={onBack}
      mascot={<DuoMascot mood="encouraging" size="md" />}
      footer={
        <DuoButton
          onClick={onNext}
          disabled={travelGoals.length < 1}
          fullWidth
        >
          Complete Setup
        </DuoButton>
      }
    >
      <div className="grid grid-cols-2 gap-3 w-full">
        {allGoals.map((goal) => (
          <DuoWizardMultiOption
            key={goal.id}
            selected={travelGoals.includes(goal.id)}
            onClick={() => toggleGoal(goal.id)}
            icon={goal.icon}
          >
            {goal.label}
          </DuoWizardMultiOption>
        ))}
      </div>
    </DuoWizardLayout>
  );
}

function CompleteStep() {
  const router = useRouter();
  const { completeOnboarding, xp } = useGamification();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => {
      completeOnboarding();

      // Check for redirect URL (from protected pages)
      const redirectUrl = sessionStorage.getItem("auth-redirect");
      if (redirectUrl) {
        sessionStorage.removeItem("auth-redirect");
        router.push(redirectUrl);
      } else {
        router.push("/");
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [completeOnboarding, router]);

  return (
    <DuoWizardLayout showProgress={false} showBack={false} showSkip={false}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        {showConfetti && (
          <div className="duo-confetti">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="duo-sparkle"
                initial={{
                  x: "50vw",
                  y: "50vh",
                  scale: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
                style={{
                  background: [
                    "var(--duo-green)",
                    "var(--duo-blue)",
                    "var(--duo-orange)",
                    "var(--duo-purple)",
                    "var(--duo-yellow)",
                  ][i % 5],
                }}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <DuoMascot mood="celebrating" size="xl" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-extrabold mt-8 mb-4"
        >
          You&apos;re all set! 🎉
        </motion.h1>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.7 }}
          className="duo-xp-badge text-xl px-6 py-3 mb-4"
        >
          +50 XP Earned!
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-lg text-muted-foreground"
        >
          Taking you to your adventure...
        </motion.p>
      </div>
    </DuoWizardLayout>
  );
}

// ============================================================================
// Main Onboarding Page
// ============================================================================

export default function OnboardingPage() {
  const router = useRouter();
  const { isFirstTime, onboardingStep, setOnboardingStep } = useGamification();

  // Redirect if not first time
  useEffect(() => {
    if (!isFirstTime && onboardingStep === "complete") {
      router.replace("/");
    }
  }, [isFirstTime, onboardingStep, router]);

  const steps: Record<OnboardingStep, React.ReactNode> = {
    welcome: <WelcomeStep onNext={() => setOnboardingStep("create-account")} />,
    "create-account": (
      <CreateAccountStep
        onNext={() => setOnboardingStep("travel-style")}
        onBack={() => setOnboardingStep("welcome")}
      />
    ),
    "travel-style": (
      <TravelStyleStep
        onNext={() => setOnboardingStep("travel-dna")}
        onBack={() => setOnboardingStep("create-account")}
      />
    ),
    "travel-dna": (
      <TravelDNAStep
        onNext={() => setOnboardingStep("trip-frequency")}
        onBack={() => setOnboardingStep("travel-style")}
      />
    ),
    "trip-frequency": (
      <FrequencyStep
        onNext={() => setOnboardingStep("interests")}
        onBack={() => setOnboardingStep("travel-dna")}
      />
    ),
    interests: (
      <InterestsStep
        onNext={() => setOnboardingStep("goals")}
        onBack={() => setOnboardingStep("trip-frequency")}
      />
    ),
    goals: (
      <GoalsStep
        onNext={() => setOnboardingStep("complete")}
        onBack={() => setOnboardingStep("interests")}
      />
    ),
    complete: <CompleteStep />,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={onboardingStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        {steps[onboardingStep]}
      </motion.div>
    </AnimatePresence>
  );
}
