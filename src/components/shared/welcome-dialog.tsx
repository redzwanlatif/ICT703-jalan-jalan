"use client";

import * as React from "react";
import Image from "next/image";
import { useAccessibility } from "@/contexts/accessibility-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export function WelcomeDialog() {
  const { hasSeenWelcome, markWelcomeSeen, setHighContrast } = useAccessibility();
  const [open, setOpen] = React.useState(false);

  // Show dialog on first visit only
  React.useEffect(() => {
    if (!hasSeenWelcome) {
      setOpen(true);
    }
  }, [hasSeenWelcome]);

  const handleEnableHighContrast = () => {
    setHighContrast(true);
    markWelcomeSeen();
    setOpen(false);
  };

  const handleContinue = () => {
    markWelcomeSeen();
    setOpen(false);
  };

  // Don't render if already seen
  if (hasSeenWelcome) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4">
            <Image
              src="/mascot.png"
              alt="Jalan-Jalan Mascot"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to Jalan-Jalan!
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            Your travel adventure awaits! We want everyone to enjoy planning their journeys.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border">
            <Eye className="size-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Accessibility Options</p>
              <p className="text-sm text-muted-foreground mt-1">
                We offer a high contrast mode for better readability. You can enable it now or access it anytime from the navigation bar.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            onClick={handleEnableHighContrast}
            className="w-full bg-jj-terracotta hover:bg-jj-terracotta-dark text-white"
          >
            <Eye className="size-4 mr-2" />
            Enable High Contrast
          </Button>
          <Button
            variant="outline"
            onClick={handleContinue}
            className="w-full"
          >
            Continue without changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
