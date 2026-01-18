"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, User, Bell, Shield, HelpCircle, ChevronRight, LogOut, AlertTriangle, ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { DuoResponsiveLayout } from "@/components/shared";
import { AccessibilityDialog } from "@/components/shared/accessibility-dialog";
import { useGamification } from "@/contexts/gamification-context";

export default function SettingsPage() {
  const router = useRouter();
  const { resetTravelDNA } = useGamification();
  const [notifications, setNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const settingsSections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Edit Profile", action: "profile" },
        { icon: Shield, label: "Privacy Settings", action: "privacy" },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          label: "Push Notifications",
          toggle: true,
          value: notifications,
          onChange: setNotifications,
        },
        {
          icon: Bell,
          label: "Price Drop Alerts",
          toggle: true,
          value: priceAlerts,
          onChange: setPriceAlerts,
        },
        {
          icon: Bell,
          label: "Weekly Summary",
          toggle: true,
          value: weeklyReport,
          onChange: setWeeklyReport,
        },
      ],
    },
    {
      title: "Support",
      items: [{ icon: HelpCircle, label: "Help Centre", action: "help" }],
    },
  ];

  // Accessibility section is rendered separately with the dialog

  const handleResetDNA = () => {
    resetTravelDNA();
    setShowResetConfirm(false);
    router.push("/onboarding");
  };

  return (
    <DuoResponsiveLayout showTopBar showBottomNav>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/informatics/dashboard")}
            className="h-8 w-8"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <p className="text-muted-foreground text-sm">Preferences</p>
            <h1 className="text-2xl font-extrabold text-foreground">Settings</h1>
          </div>
        </div>

        {/* User Profile Card */}
        <Card className="p-6 mb-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">👤</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">Travel Explorer</h3>
              <p className="text-muted-foreground text-sm">explorer@email.com</p>
              <p className="text-primary text-xs mt-1">Premium Member</p>
            </div>
          </div>
        </Card>

        {/* Accessibility Section */}
        <div className="mb-6">
          <h2 className="font-semibold text-foreground mb-3 px-1">Accessibility</h2>
          <Card className="overflow-hidden gap-0">
            <AccessibilityDialog>
              <button className="w-full flex items-center justify-between p-6 hover:bg-muted/50 active:bg-muted transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <span className="text-foreground text-sm font-medium block">Accessibility Settings</span>
                    <span className="text-muted-foreground text-xs">
                      High contrast, text size, and more
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </button>
            </AccessibilityDialog>
          </Card>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <div key={section.title} className="mb-6">
            <h2 className="font-semibold text-foreground mb-3 px-1">{section.title}</h2>
            <Card className="overflow-hidden gap-0">
              {section.items.map((item, index) => {
                const hasAction = "action" in item;
                const handleClick = () => {
                  if (hasAction && item.action === "profile") router.push("/informatics/settings/profile");
                  else if (hasAction && item.action === "privacy") router.push("/informatics/settings/privacy");
                };

                const hasToggle = "toggle" in item && item.toggle;
                const content = (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-foreground text-sm font-medium">{item.label}</span>
                    </div>
                    {hasToggle && "value" in item && "onChange" in item ? (
                      <Switch checked={item.value} onCheckedChange={item.onChange} />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </>
                );

                return hasAction ? (
                  <button
                    key={item.label}
                    onClick={handleClick}
                    className={`w-full flex items-center justify-between p-6 hover:bg-muted/50 active:bg-muted transition-all duration-200 ${
                      index < section.items.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    {content}
                  </button>
                ) : (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between p-6 hover:bg-muted/30 transition-colors ${
                      index < section.items.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    {content}
                  </div>
                );
              })}
            </Card>
          </div>
        ))}

        {/* Reset Profile */}
        <div className="mb-6">
          <h2 className="font-semibold text-foreground mb-3 px-1">Data Management</h2>
          <Card className="overflow-hidden gap-0">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-between p-6 hover:bg-red-500/10 active:bg-red-500/15 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-left">
                  <span className="text-foreground text-sm font-medium block">Reset Profile Data</span>
                  <span className="text-muted-foreground text-xs">
                    Clear all preferences and start onboarding again
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </button>
          </Card>
        </div>

        {/* Sign Out */}
        <div className="mb-6">
          <Button
            variant="outline"
            className="w-full rounded-xl border-red-500/30 text-red-600 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* App Version */}
        <div className="text-center pb-4">
          <p className="text-muted-foreground text-xs">Jalan-Jalan v1.0.0</p>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowResetConfirm(false)}
        >
          <div
            className="bg-card rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            <h2 className="text-xl font-bold text-center mb-2">Reset Profile Data?</h2>
            <p className="text-muted-foreground text-center text-sm mb-6">
              This will clear all your travel preferences and restart the onboarding process. This action cannot be undone.
            </p>

            <div className="space-y-3">
              <Button
                onClick={handleResetDNA}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Yes, Reset Everything
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowResetConfirm(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </DuoResponsiveLayout>
  );
}

