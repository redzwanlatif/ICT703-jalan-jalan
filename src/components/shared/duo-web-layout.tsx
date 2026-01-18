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
  Flame,
  Heart,
  Sparkles,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { useGamification, getXpProgress } from "@/contexts/gamification-context";
import { DuoTopStatsBar, DuoBottomNav } from "./duo-bottom-nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ============================================================================
// Navigation Items
// ============================================================================

// Match mobile bottom nav for consistent UX
const mainNavItems = [
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
// Web Navigation Bar
// ============================================================================

export function DuoWebNav() {
  const pathname = usePathname();
  const { xp, level, streak, hearts, maxHearts } = useGamification();
  const xpProgress = getXpProgress(xp, level);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (item: typeof mainNavItems[0]) => {
    if (item.href === "/" && pathname === "/") return true;
    return item.matchPaths.some(path => path !== "/" && pathname.startsWith(path));
  };

  return (
    <header className="sticky top-0 z-[100] w-full bg-white dark:bg-gray-950 border-b-2 border-[#E5E5E5] dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/logo.png"
              alt="Jalan-Jalan"
              width={140}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation - matches mobile bottom nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "gap-2 font-semibold transition-all",
                      active && "bg-[var(--duo-green)]/10 text-[var(--duo-green)]"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Right Side - Stats & Profile */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Streak */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--duo-orange)]/10 text-[var(--duo-orange)] font-bold text-sm cursor-help">
                  <Flame className="w-4 h-4" />
                  <span>{streak}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{streak} day streak!</p>
              </TooltipContent>
            </Tooltip>

            {/* Hearts */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--duo-red)]/10 text-[var(--duo-red)] font-bold text-sm cursor-help">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{hearts}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{hearts} of {maxHearts} hearts</p>
              </TooltipContent>
            </Tooltip>

            {/* XP & Level */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--duo-yellow)]/10 cursor-help">
                  <div className="w-7 h-7 rounded-full bg-[var(--duo-yellow)] flex items-center justify-center text-white font-bold text-xs">
                    {level.level}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[var(--duo-yellow-dark)]">
                      {xp} XP
                    </span>
                    <div className="w-12 h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--duo-yellow)] transition-all"
                        style={{ width: `${xpProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Level {level.level} - {level.title}</p>
              </TooltipContent>
            </Tooltip>

            {/* Notifications */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--duo-red)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="w-9 h-9 rounded-full bg-[var(--duo-blue)] flex items-center justify-center text-white font-bold">
                    <User className="w-5 h-5" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b">
                  <p className="font-bold">Traveler</p>
                  <p className="text-xs text-muted-foreground">{level.title}</p>
                </div>
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
                <DropdownMenuSeparator />
                <Link href="/informatics/dashboard">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                </Link>
                <Link href="/informatics/settings">
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <User className="w-5 h-5" />
              </Button>
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

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t">
            {/* Mobile Stats */}
            <div className="flex items-center justify-center gap-3 pb-4 mb-4 border-b">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--duo-orange)]/10 text-[var(--duo-orange)] font-bold text-sm">
                <Flame className="w-4 h-4" />
                <span>{streak}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--duo-red)]/10 text-[var(--duo-red)] font-bold text-sm">
                <Heart className="w-4 h-4 fill-current" />
                <span>{hearts}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--duo-yellow)]/10">
                <div className="w-6 h-6 rounded-full bg-[var(--duo-yellow)] flex items-center justify-center text-white font-bold text-xs">
                  {level.level}
                </div>
                <span className="text-xs font-bold">{xp} XP</span>
              </div>
            </div>

            {/* Mobile Nav Items - matches mobile bottom nav */}
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 font-semibold",
                        active && "bg-[var(--duo-green)]/10 text-[var(--duo-green)]"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

          </nav>
        )}
      </div>
    </header>
  );
}

// ============================================================================
// Web Footer
// ============================================================================

export function DuoWebFooter() {
  const [showComingSoon, setShowComingSoon] = React.useState(false);

  const footerLinks = [
    {
      title: "Product",
      links: [
        { href: "/predictions", label: "Trip Planner", exists: true },
        { href: "/chat", label: "AI Assistant", exists: true },
        { href: "/dashboard", label: "Dashboard", exists: true },
        { href: "/community", label: "Community", exists: true },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About Us", exists: false },
        { href: "/careers", label: "Careers", exists: false },
        { href: "/press", label: "Press", exists: false },
        { href: "/contact", label: "Contact", exists: false },
      ],
    },
    {
      title: "Resources",
      links: [
        { href: "/blog", label: "Blog", exists: false },
        { href: "/help", label: "Help Center", exists: false },
        { href: "/guides", label: "Travel Guides", exists: false },
        { href: "/sitemap", label: "Sitemap", exists: true },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/privacy", label: "Privacy", exists: false },
        { href: "/terms", label: "Terms", exists: false },
        { href: "/cookies", label: "Cookies", exists: false },
      ],
    },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="Jalan-Jalan"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Your cognitive travel companion. Plan smarter, travel better.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--duo-green)]/10 text-[var(--duo-green)] text-xs font-bold">
                <Sparkles className="w-3 h-3" />
                AI-Powered
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-bold mb-3">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {link.exists ? (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => setShowComingSoon(true)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Jalan-Jalan. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-[var(--duo-red)] fill-current" />
            <span>for travelers</span>
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="max-w-xs sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center flex flex-col items-center gap-4 pt-4">
              <div className="w-16 h-16 rounded-full bg-[var(--duo-yellow)]/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[var(--duo-yellow)]" />
              </div>
              <span className="text-xl font-extrabold">Coming Soon!</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-muted-foreground">
              We're working hard to bring you this feature. Stay tuned for updates!
            </p>
          </div>
          <button
            onClick={() => setShowComingSoon(false)}
            className="duo-btn w-full mt-2"
          >
            Got it!
          </button>
        </DialogContent>
      </Dialog>
    </footer>
  );
}

// ============================================================================
// Web Layout Shell
// ============================================================================

interface DuoWebLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  showFooter?: boolean;
  sidebar?: React.ReactNode;
  sidebarPosition?: "left" | "right";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
}

const maxWidthClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  full: "max-w-full",
};

export function DuoWebLayout({
  children,
  showNav = true,
  showFooter = true,
  sidebar,
  sidebarPosition = "left",
  maxWidth = "2xl",
  className,
}: DuoWebLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showNav && <DuoWebNav />}

      <main className={cn("flex-1", className)}>
        <div className={cn("mx-auto px-4 lg:px-8 py-6", maxWidthClasses[maxWidth])}>
          {sidebar ? (
            <div className={cn(
              "grid gap-6",
              sidebarPosition === "left"
                ? "lg:grid-cols-[280px_1fr]"
                : "lg:grid-cols-[1fr_280px]"
            )}>
              {sidebarPosition === "left" && (
                <aside className="hidden lg:block">
                  <div className="sticky top-24">{sidebar}</div>
                </aside>
              )}
              <div>{children}</div>
              {sidebarPosition === "right" && (
                <aside className="hidden lg:block">
                  <div className="sticky top-24">{sidebar}</div>
                </aside>
              )}
            </div>
          ) : (
            children
          )}
        </div>
      </main>

      {showFooter && <DuoWebFooter />}
    </div>
  );
}

// ============================================================================
// Web Grid Components
// ============================================================================

interface WebGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const gridColClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
};

const gapClasses = {
  sm: "gap-3",
  md: "gap-4 lg:gap-6",
  lg: "gap-6 lg:gap-8",
};

export function WebGrid({ children, cols = 3, gap = "md", className }: WebGridProps) {
  return (
    <div className={cn("grid", gridColClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
}

// ============================================================================
// Web Section Components
// ============================================================================

interface WebSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function WebSection({ children, title, subtitle, action, className }: WebSectionProps) {
  return (
    <section className={cn("mb-8", className)}>
      {(title || action) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h2 className="text-2xl font-bold">{title}</h2>}
            {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

// ============================================================================
// Web Sidebar Component
// ============================================================================

interface WebSidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function WebSidebar({ children, className }: WebSidebarProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  );
}

interface WebSidebarCardProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function WebSidebarCard({ children, title, icon, className }: WebSidebarCardProps) {
  return (
    <div className={cn("duo-card p-4", className)}>
      {title && (
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h3 className="font-bold">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}

// ============================================================================
// Responsive Layout (Auto-switches between Mobile and Desktop)
// ============================================================================

interface DuoResponsiveLayoutProps {
  children: React.ReactNode;
  /** Show top bar on mobile */
  showTopBar?: boolean;
  /** Show bottom nav on mobile */
  showBottomNav?: boolean;
  /** Show nav on desktop */
  showNav?: boolean;
  /** Show footer on desktop */
  showFooter?: boolean;
  /** Desktop sidebar content */
  sidebar?: React.ReactNode;
  /** Desktop sidebar position */
  sidebarPosition?: "left" | "right";
  /** Desktop max width */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Additional class for mobile */
  mobileClassName?: string;
  /** Additional class for desktop */
  desktopClassName?: string;
}

export function DuoResponsiveLayout({
  children,
  showTopBar = true,
  showBottomNav = true,
  showNav = true,
  showFooter = true,
  sidebar,
  sidebarPosition = "left",
  maxWidth = "2xl",
  mobileClassName,
  desktopClassName,
}: DuoResponsiveLayoutProps) {
  return (
    <>
      {/* Mobile Layout (< lg) */}
      <div className={cn("lg:hidden min-h-screen flex flex-col bg-background", mobileClassName)}>
        {showTopBar && <DuoTopStatsBar />}
        <main className={cn("flex-1", showBottomNav && "pb-20")}>
          {children}
        </main>
        {showBottomNav && <DuoBottomNav />}
      </div>

      {/* Desktop Layout (>= lg) */}
      <div className={cn("hidden lg:flex min-h-screen flex-col bg-background", desktopClassName)}>
        {showNav && <DuoWebNav />}
        <main className="flex-1">
          <div className={cn("mx-auto px-4 lg:px-8 py-6", maxWidthClasses[maxWidth])}>
            {sidebar ? (
              <div className={cn(
                "grid gap-6",
                sidebarPosition === "left"
                  ? "lg:grid-cols-[280px_1fr]"
                  : "lg:grid-cols-[1fr_280px]"
              )}>
                {sidebarPosition === "left" && (
                  <aside>
                    <div className="sticky top-24">{sidebar}</div>
                  </aside>
                )}
                <div>{children}</div>
                {sidebarPosition === "right" && (
                  <aside>
                    <div className="sticky top-24">{sidebar}</div>
                  </aside>
                )}
              </div>
            ) : (
              children
            )}
          </div>
        </main>
        {showFooter && <DuoWebFooter />}
      </div>
    </>
  );
}

// ============================================================================
// Exports
// ============================================================================

export type {
  DuoWebLayoutProps,
  DuoResponsiveLayoutProps,
  WebGridProps,
  WebSectionProps,
  WebSidebarProps,
  WebSidebarCardProps,
};
