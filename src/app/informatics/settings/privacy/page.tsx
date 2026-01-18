"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, Share2, BarChart3, MapPin, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { DuoResponsiveLayout } from "@/components/shared";

export default function PrivacyPage() {
  const router = useRouter();
  const [dataSharing, setDataSharing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(false);

  const privacyOptions = [
    {
      icon: Share2,
      label: "Data Sharing",
      description: "Share anonymized data to improve recommendations",
      value: dataSharing,
      onChange: setDataSharing,
    },
    {
      icon: BarChart3,
      label: "Usage Analytics",
      description: "Help us understand how you use the app",
      value: analytics,
      onChange: setAnalytics,
    },
    {
      icon: MapPin,
      label: "Location Services",
      description: "Enable location-based features and suggestions",
      value: locationTracking,
      onChange: setLocationTracking,
    },
    {
      icon: Eye,
      label: "Public Profile",
      description: "Allow others to see your travel stats",
      value: profileVisibility,
      onChange: setProfileVisibility,
    },
  ];

  return (
    <DuoResponsiveLayout showTopBar showBottomNav>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/informatics/settings")}
            className="h-8 w-8"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Account</p>
            <h1 className="text-2xl font-extrabold text-foreground">Privacy Settings</h1>
          </div>
        </div>

        {/* Privacy Info */}
        <Card className="p-6 border-primary/20 bg-primary/5 mb-6 hover:shadow-md transition-shadow">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Control how your data is used and shared. Your privacy is important to us - all
            settings can be changed at any time.
          </p>
        </Card>

        {/* Privacy Options */}
        <Card className="overflow-hidden mb-6 gap-0">
          {privacyOptions.map((option, index) => (
            <div
              key={option.label}
              className={`flex items-center justify-between p-6 hover:bg-muted/30 transition-colors ${
                index < privacyOptions.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex items-start gap-3 flex-1 mr-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <option.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-foreground text-sm font-medium block">{option.label}</span>
                  <span className="text-muted-foreground text-xs mt-0.5">{option.description}</span>
                </div>
              </div>
              <Switch checked={option.value} onCheckedChange={option.onChange} />
            </div>
          ))}
        </Card>

        {/* Data Management */}
        <div className="mb-6">
          <h2 className="font-semibold text-foreground mb-3 px-1">Data Management</h2>
          <Card className="overflow-hidden gap-0">
            <button className="w-full flex items-center justify-between p-6 hover:bg-muted/50 active:bg-muted transition-all duration-200 border-b border-border">
              <span className="text-foreground text-sm font-medium">Download My Data</span>
              <span className="text-muted-foreground text-xs">Request copy</span>
            </button>
            <button className="w-full flex items-center justify-between p-6 hover:bg-red-500/10 active:bg-red-500/15 transition-all duration-200">
              <span className="text-red-600 text-sm font-medium">Delete Account</span>
              <span className="text-muted-foreground text-xs">Permanent</span>
            </button>
          </Card>
        </div>

        {/* Last Updated */}
        <div className="text-center pb-4">
          <p className="text-muted-foreground text-xs">Privacy policy last updated: December 2024</p>
        </div>
      </div>
    </DuoResponsiveLayout>
  );
}
