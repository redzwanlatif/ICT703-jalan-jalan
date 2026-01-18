"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ChevronRight,
  Check,
  ArrowLeft,
} from "lucide-react";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { DuoButton } from "@/components/shared/duo-wizard-layout";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Basics", icon: User },
  { id: 2, title: "Complete", icon: Check },
];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "John Traveler",
    email: "traveler@example.com",
    password: "password123",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const canProceedStep1 = formData.name && formData.email && formData.password;

  const handleNext = () => {
    if (currentStep === 1 && !canProceedStep1) {
      setError("Please fill in all required fields");
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    setError("");
  };

  const handleRegister = async () => {
    setIsLoading(true);
    // Simulate registration
    setTimeout(() => {
      router.push("/onboarding");
    }, 1500);
  };

  const getMascotMood = () => {
    if (currentStep === 2) return "celebrating";
    if (error) return "thinking";
    return "excited";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 py-2 md:py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 h-full">
          <Image
            src="/logo.png"
            alt="Jalan-Jalan"
            width={160}
            height={50}
            className="w-32 sm:w-40 md:w-[160px] h-auto object-contain"
            priority
          />
        </Link>
      </header>

      {/* Progress Steps */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-5 right-5 h-1 bg-border rounded-full">
              <motion.div
                className="h-full bg-jj-terracotta rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Step Indicators */}
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <motion.div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                      isCompleted
                        ? "bg-jj-terracotta border-jj-terracotta text-white"
                        : isActive
                        ? "bg-card border-jj-terracotta text-jj-terracotta"
                        : "bg-card border-border text-muted-foreground"
                    )}
                    animate={{ scale: isActive ? 1.1 : 1 }}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  <span
                    className={cn(
                      "text-xs font-bold mt-2",
                      isActive ? "text-jj-terracotta" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Basics */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="flex justify-center">
                    <DuoMascot mood={getMascotMood()} size="md" />
                  </div>
                  <h1 className="text-2xl font-extrabold mt-4">Let&apos;s get started!</h1>
                  <p className="text-muted-foreground">Create your account</p>
                </div>

                <div className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-bold mb-2">Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        placeholder="Your name"
                        className="duo-input !pl-12"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-bold mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        placeholder="your@email.com"
                        className="duo-input !pl-12"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-bold mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => updateFormData("password", e.target.value)}
                        placeholder="Create a password"
                        className="duo-input !pl-12 !pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

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

                <DuoButton onClick={handleNext} fullWidth size="lg">
                  Continue
                  <ChevronRight className="w-5 h-5 ml-1" />
                </DuoButton>
              </motion.div>
            )}

            {/* Step 2: Location */}
            {/* Step 2: Complete */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                >
                  <DuoMascot mood="celebrating" size="lg" />
                </motion.div>

                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-extrabold"
                  >
                    Welcome, {formData.name}!
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground mt-2"
                  >
                    Your adventure awaits
                  </motion.p>
                </div>

                {/* XP Reward */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="duo-xp-badge text-xl px-6 py-3 inline-flex"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  +200 XP Welcome Bonus!
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="duo-card p-4 text-left"
                >
                  <h3 className="font-bold mb-2">Account Summary</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {formData.name}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {formData.email}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-3 pt-4"
                >
                  <DuoButton
                    onClick={handleRegister}
                    disabled={isLoading}
                    fullWidth
                    size="lg"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        Start Your Journey
                        <Sparkles className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </DuoButton>

                  <button
                    onClick={handleBack}
                    className="text-sm text-muted-foreground hover:text-foreground font-semibold"
                  >
                    Go back
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Login (Only on Step 1) */}
          {currentStep === 1 && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-background text-muted-foreground font-semibold">
                    or
                  </span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <button
                  type="button"
                  className="w-full duo-btn duo-btn-outline flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8 text-muted-foreground"
              >
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-jj-terracotta hover:underline"
                >
                  Log in
                </Link>
              </motion.p>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
