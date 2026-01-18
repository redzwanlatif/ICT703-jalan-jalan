"use client";

import * as React from "react";
import { useAccessibility } from "@/contexts/accessibility-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, Contrast } from "lucide-react";

interface AccessibilityDialogProps {
  children: React.ReactNode;
}

export function AccessibilityDialog({ children }: AccessibilityDialogProps) {
  const { highContrastMode, toggleHighContrast } = useAccessibility();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="size-5" />
            Accessibility Settings
          </DialogTitle>
          <DialogDescription>
            Customize your viewing experience for better readability.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* High Contrast Toggle */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-muted/30">
            <div className="flex items-start gap-3">
              <Contrast className="size-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <Label
                  htmlFor="high-contrast"
                  className="text-base font-semibold cursor-pointer"
                >
                  High Contrast Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Increases color contrast for better visibility. Uses black text on white backgrounds with bold borders.
                </p>
              </div>
            </div>
            <Switch
              id="high-contrast"
              checked={highContrastMode}
              onCheckedChange={toggleHighContrast}
              aria-label="Toggle high contrast mode"
            />
          </div>

          {/* Info section */}
          <div className="text-sm text-muted-foreground">
            <p>
              These settings are saved locally and will persist across sessions.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
