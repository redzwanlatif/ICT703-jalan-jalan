"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Map,
  MessageSquare,
  LayoutDashboard,
  User,
  Trophy,
  Flame,
  Heart,
  Sparkles,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useGamification, getXpProgress } from "@/contexts/gamification-context";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ============================================================================
// Navigation Items
// ============================================================================

const navItems = [
  {
    href: "/",
    icon: Home,
    label: "Home",
    matchPaths: ["/"],
  },
  {
    href: "/predictions",
    icon: Map,
    label: "Plan",
    matchPaths: ["/predictions"],
  },
  {
    href: "/chat",
    icon: MessageSquare,
    label: "AI Chat",
    matchPaths: ["/chat"],
  },
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    matchPaths: ["/dashboard", "/wanderboard"],
  },
  {
    href: "/informatics/dashboard",
    icon: User,
    label: "Profile",
    matchPaths: ["/informatics"],
  },
];

// ============================================================================
// Bottom Navigation Component
// ============================================================================

export function DuoBottomNav() {
  const pathname = usePathname();
  const { xp, level, streak, hearts, maxHearts } = useGamification();

  const isActive = (item: typeof navItems[0]) => {
    if (item.href === "/" && pathname === "/") return true;
    return item.matchPaths.some(path => path !== "/" && pathname.startsWith(path));
  };

  return (
    <nav className="duo-bottom-nav">
      <div className="duo-bottom-nav-inner">
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("duo-nav-item", active && "active")}
            >
              <Icon className={cn(
                "duo-nav-item-icon w-5 h-5 transition-transform duration-200",
                active && "scale-110"
              )} />
              <span className={cn(
                "duo-nav-item-label transition-all duration-200",
                active && "font-extrabold"
              )}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ============================================================================
// Top Stats Bar
// ============================================================================

export function DuoTopStatsBar() {
  const { xp, level, streak, hearts, maxHearts } = useGamification();
  const xpProgress = getXpProgress(xp, level);

  return (
    <header className="sticky top-0 z-[100] bg-white border-b-2 border-[#E5E5E5]">
      <div className="flex items-center justify-between px-4 py-2 md:py-2 max-w-5xl mx-auto h-14 md:h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 h-full">
          <Image
            src="/logo.png"
            alt="Jalan-Jalan"
            width={130}
            height={130}
            className="h-full w-auto object-contain"
          />
        </Link>

        {/* Stats */}
        <div className="flex items-center gap-3">
          {/* Streak */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="duo-streak text-sm h-9 w-16 flex items-center justify-center gap-2 rounded-2xl font-bold cursor-help">
                <Flame className="w-4 h-4 duo-streak-flame" />
                <span>{streak}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{streak} day streak</p>
            </TooltipContent>
          </Tooltip>

          {/* Hearts */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="duo-hearts text-sm h-9 w-16 flex items-center justify-center gap-1 rounded-xl font-bold cursor-help">
                <Heart className="w-4 h-4 fill-current" />
                <span>{hearts}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{hearts} of {maxHearts} hearts</p>
            </TooltipContent>
          </Tooltip>

          {/* XP / Level */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="duo-level-badge duo-level-badge-sm">
              {level.level}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#777777]">
                {level.title}
              </span>
              <div className="w-16 h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--duo-yellow)] transition-all"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Profile / Login Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 rounded-full bg-[#E5E5E5] flex items-center justify-center hover:bg-[#D5D5D5] transition-colors">
                <User className="w-5 h-5 text-[#777777]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <Link href="/login">
                <DropdownMenuItem className="cursor-pointer">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </DropdownMenuItem>
              </Link>
              <Link href="/onboarding">
                <DropdownMenuItem className="cursor-pointer">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

// ============================================================================
// App Shell (combines top bar, content, and bottom nav)
// ============================================================================

interface DuoAppShellProps {
  children: React.ReactNode;
  showTopBar?: boolean;
  showBottomNav?: boolean;
  className?: string;
}

export function DuoAppShell({
  children,
  showTopBar = true,
  showBottomNav = true,
  className,
}: DuoAppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showTopBar && <DuoTopStatsBar />}

      <main className={cn(
        "flex-1",
        showBottomNav && "safe-bottom",
        className
      )}>
        {children}
      </main>

      {showBottomNav && <DuoBottomNav />}
    </div>
  );
}

// ============================================================================
// Reward Modal
// ============================================================================

export function DuoRewardModal() {
  const { showReward, rewardData, dismissReward } = useGamification();

  if (!showReward || !rewardData) return null;

  const icons: Record<string, React.ReactNode> = {
    xp: <Sparkles className="w-16 h-16 text-[var(--duo-yellow)]" />,
    level: <Trophy className="w-16 h-16 text-[var(--duo-yellow)]" />,
    streak: <Flame className="w-16 h-16 text-[var(--duo-orange)]" />,
  };

  return (
    <div className="duo-reward-overlay" onClick={dismissReward}>
      <div className="duo-reward-modal" onClick={e => e.stopPropagation()}>
        <div className="duo-reward-icon">
          {icons[rewardData.type] || icons.xp}
        </div>

        <h2 className="text-2xl font-extrabold mb-2">
          {rewardData.type === "xp" && `+${rewardData.amount} XP`}
          {rewardData.type === "level" && `Level ${rewardData.amount}!`}
          {rewardData.type === "streak" && `${rewardData.amount} Days!`}
        </h2>

        <p className="text-[#777777] mb-6">
          {rewardData.message}
        </p>

        <button
          onClick={dismissReward}
          className="duo-btn w-full"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Floating Action Button (for quick actions)
// ============================================================================

interface DuoFabProps {
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  label?: string;
  className?: string;
}

export function DuoFab({ icon, onClick, href, label, className }: DuoFabProps) {
  const content = (
    <>
      {icon}
      {label && <span className="sr-only">{label}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn("duo-fab", className)}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cn("duo-fab", className)}>
      {content}
    </button>
  );
}

// ============================================================================
// Mini Stats Display (for embedding in pages)
// ============================================================================

export function DuoMiniStats() {
  const { xp, level, streak } = useGamification();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5">
        <Flame className="w-5 h-5 text-[var(--duo-orange)]" />
        <span className="font-bold">{streak}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <Trophy className="w-5 h-5 text-[var(--duo-yellow)]" />
        <span className="font-bold">Lvl {level.level}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <Sparkles className="w-5 h-5 text-[var(--duo-purple)]" />
        <span className="font-bold">{xp} XP</span>
      </div>
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export type { DuoAppShellProps, DuoFabProps };
