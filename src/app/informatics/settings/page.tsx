"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, User, Bell, Shield, HelpCircle, ChevronRight, LogOut, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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

  const handleResetDNA = () => {
    resetTravelDNA();
    setShowResetConfirm(false);
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="mb-2">
          <p className="text-muted-foreground text-sm">Preferences</p>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="px-6 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Travel Explorer</h3>
              <p className="text-muted-foreground text-sm">explorer@email.com</p>
              <p className="text-primary text-xs mt-1">Premium Member</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Settings Sections */}
      {settingsSections.map((section) => (
        <div key={section.title} className="px-6 mb-6">
          <h2 className="font-semibold text-foreground mb-3">{section.title}</h2>
          <Card className="overflow-hidden">
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
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground text-sm">{item.label}</span>
                  </div>
                  {hasToggle && "value" in item && "onChange" in item ? (
                    <Switch checked={item.value} onCheckedChange={item.onChange} />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </>
              );

              return hasAction ? (
                <button
                  key={item.label}
                  onClick={handleClick}
                  className={`w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors ${
                    index < section.items.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  {content}
                </button>
              ) : (
                <div
                  key={item.label}
                  className={`flex items-center justify-between p-4 ${
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

      {/* Reset Travel DNA */}
      <div className="px-6 mb-6">
        <h2 className="font-semibold text-foreground mb-3">Data Management</h2>
        <Card className="overflow-hidden">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-red-500/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <RotateCcw className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-left">
                <span className="text-foreground text-sm block">Reset Travel DNA</span>
                <span className="text-muted-foreground text-xs">
                  Clear all preferences and start onboarding again
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </Card>
      </div>

      {/* Sign Out */}
      <div className="px-6 mb-6">
        <Button
          variant="outline"
          className="w-full rounded-xl border-red-500/30 text-red-600 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* App Version */}
      <div className="px-6 text-center">
        <p className="text-muted-foreground text-xs">Jalan-Jalan v1.0.0</p>
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

            <h2 className="text-xl font-bold text-center mb-2">Reset Travel DNA?</h2>
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
    </div>
  );
}

