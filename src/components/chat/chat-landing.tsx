"use client";

import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInput } from "./chat-input";
import { QuickActions } from "./quick-actions";

interface ChatLandingProps {
  onSend?: (message: string) => void;
  onQuickAction?: (actionId: string) => void;
  onBack?: () => void;
}

export function ChatLanding({ onSend, onQuickAction, onBack }: ChatLandingProps) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[2805px] h-[1080px] opacity-80"
          style={{
            background: `
              radial-gradient(circle at 114% 61%, rgba(130, 29, 53, 0.4) 0%, rgba(241, 40, 68, 0) 100%),
              radial-gradient(circle at 100% 100%, rgba(31, 92, 140, 0.4) 0%, rgba(77, 163, 236, 0) 100%),
              radial-gradient(circle at 105% 13%, rgba(165, 32, 232, 0.5) 0%, rgba(189, 107, 231, 0.3) 50%, rgba(237, 104, 255, 0) 100%),
              radial-gradient(circle at 83% -5%, rgba(9, 250, 142, 0.3) 0%, rgba(9, 250, 238, 0) 100%),
              radial-gradient(circle at 99% 112%, rgba(77, 163, 236, 0.4) 0%, rgba(77, 163, 236, 0) 100%),
              #FFFFFF
            `,
            filter: "blur(400px)",
            left: "-723px",
            top: "-28px",
          }}
        />
      </div>

      {/* Back Button */}
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="absolute top-6 left-6 gap-2 text-purple-800 hover:text-purple-900"
        >
          <ChevronLeft className="w-4 h-4" />
          Go back home
        </Button>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-[832px] px-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="Jalan-Jalan"
            width={64}
            height={64}
            className="w-16 h-16 object-contain"
          />
          <h1 className="text-2xl font-semibold text-jj-brown text-center tracking-tight">
            Jalan-Jalan AI — Smarter Planning. Smoother Journeys.
          </h1>
        </div>

        {/* Chat Input Card */}
        <div className="w-full bg-white/80 backdrop-blur-sm rounded-[14px] border border-black/10 shadow-xl p-6">
          <ChatInput onSend={onSend} />
        </div>

        {/* Quick Actions */}
        <QuickActions onSelect={onQuickAction} />
      </div>
    </div>
  );
}

