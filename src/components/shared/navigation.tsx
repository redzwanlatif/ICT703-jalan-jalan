"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home,
  Sparkles,
  LayoutDashboard,
  Wallet,
  Users,
  MessageCircle,
  Menu,
  X,
  ChevronDown,
  Bot,
  Compass,
  Eye,
} from "lucide-react";
import { AccessibilityDialog } from "./accessibility-dialog";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  {
    href: "/predictions",
    label: "Plan Trip",
    icon: Sparkles,
    children: [
      { href: "/predictions", label: "Smart Planner", icon: Compass, description: "AI-powered trip planning" },
      { href: "/chat", label: "AI Assistant", icon: Bot, description: "Chat with our travel AI" },
    ]
  },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/informatics/dashboard", label: "My Travel", icon: Wallet },
  { href: "/community", label: "Community", icon: Users },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const isItemActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Jalan-Jalan"
              width={44}
              height={44}
              className="size-11 object-contain"
              priority
            />
            <span className="font-bold text-xl tracking-tight text-jj-terracotta hidden sm:inline">
              Jalan-Jalan
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const hasChildren = "children" in item && item.children;
              const isActive = isItemActive(item.href) ||
                (hasChildren && item.children?.some(child => isItemActive(child.href)));

              if (hasChildren) {
                const isDropdownOpen = openDropdown === item.href;
                return (
                  <div
                    key={item.href}
                    className="relative"
                    ref={dropdownRef}
                  >
                    <Button
                      variant={isActive || isDropdownOpen ? "secondary" : "ghost"}
                      size="sm"
                      className={cn(
                        "gap-2 transition-all",
                        (isActive || isDropdownOpen) && "bg-jj-cream text-jj-terracotta hover:bg-jj-cream-dark/50 dark:bg-jj-brown/20 dark:text-jj-terracotta-light"
                      )}
                      onClick={() => setOpenDropdown(isDropdownOpen ? null : item.href)}
                    >
                      <Icon className="size-4" />
                      {item.label}
                      <ChevronDown className={cn("size-3 transition-transform", isDropdownOpen && "rotate-180")} />
                    </Button>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border py-2 z-50">
                        {item.children?.map((child) => {
                          const ChildIcon = child.icon;
                          const isChildActive = isItemActive(child.href);
                          return (
                            <Link 
                              key={child.href} 
                              href={child.href}
                              onClick={() => setOpenDropdown(null)}
                            >
                              <div className={cn(
                                "px-4 py-2 hover:bg-jj-cream dark:hover:bg-jj-brown/20 cursor-pointer",
                                isChildActive && "bg-jj-cream dark:bg-jj-brown/20"
                              )}>
                                <div className="flex items-center gap-3">
                                  <ChildIcon className={cn("size-4", isChildActive ? "text-jj-terracotta" : "text-muted-foreground")} />
                                  <div>
                                    <div className={cn("text-sm font-medium", isChildActive && "text-jj-terracotta dark:text-jj-terracotta-light")}>
                                      {child.label}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{child.description}</div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2 transition-all",
                      isActive && "bg-jj-cream text-jj-terracotta hover:bg-jj-cream-dark/50 dark:bg-jj-brown/20 dark:text-jj-terracotta-light"
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Accessibility Toggle */}
            <AccessibilityDialog>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Accessibility settings"
              >
                <Eye className="size-5" />
              </Button>
            </AccessibilityDialog>

            <Link href="/login" className="hidden md:block">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register" className="hidden md:block">
              <Button
                size="sm"
                className="bg-jj-terracotta hover:bg-jj-terracotta-dark text-white border-0 shadow-[0_3px_0_var(--jj-terracotta-dark)]"
              >
                Sign Up
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const hasChildren = "children" in item && item.children;
                const isActive = isItemActive(item.href);

                if (hasChildren) {
                  return (
                    <div key={item.href} className="space-y-1">
                      <div className="px-4 py-2 text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Icon className="size-4" />
                        {item.label}
                      </div>
                      {item.children?.map((child) => {
                        const ChildIcon = child.icon;
                        const isChildActive = isItemActive(child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Button
                              variant={isChildActive ? "secondary" : "ghost"}
                              className={cn(
                                "w-full justify-start gap-3 pl-8",
                                isChildActive && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              )}
                            >
                              <ChildIcon className="size-4" />
                              {child.label}
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        isActive && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      )}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}

              {/* Mobile accessibility and auth links */}
              <div className="border-t mt-2 pt-2 flex flex-col gap-1">
                <AccessibilityDialog>
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <Eye className="size-4" />
                    Accessibility
                  </Button>
                </AccessibilityDialog>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-jj-terracotta hover:bg-jj-terracotta-dark text-white shadow-[0_3px_0_var(--jj-terracotta-dark)]">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

