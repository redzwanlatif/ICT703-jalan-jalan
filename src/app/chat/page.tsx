"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Send,
  Sparkles,
  Map,
  Cloud,
  Wallet,
  Utensils,
  AlertTriangle,
  Calendar,
  Bot,
  User,
  Menu,
  Plus,
  MessageSquare,
  ChevronLeft,
} from "lucide-react";
import { DuoResponsiveLayout } from "@/components/shared";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { useGamification } from "@/contexts/gamification-context";
import { AuthGuard } from "@/components/shared/auth-guard";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// ============================================================================
// Quick Actions
// ============================================================================

const quickActions = [
  { id: "crowd", icon: Map, label: "Check crowds", color: "var(--duo-green)" },
  { id: "weather", icon: Cloud, label: "Weather", color: "var(--duo-blue)" },
  { id: "budget", icon: Wallet, label: "Budget help", color: "var(--duo-orange)" },
  { id: "food", icon: Utensils, label: "Food recs", color: "var(--duo-purple)" },
  { id: "plan", icon: Calendar, label: "Plan trip", color: "var(--duo-yellow)" },
  { id: "emergency", icon: AlertTriangle, label: "Emergency", color: "var(--duo-red)" },
];

const welcomeMessages: Record<string, string> = {
  default: `Hi! I'm your AI travel buddy. I can help you with:

• Checking crowd levels at destinations
• Weather forecasts and best travel times
• Budget planning and expense tracking
• Local food recommendations
• Creating trip itineraries
• Emergency assistance

What would you like help with today?`,
  crowd: "I can help you check crowd levels! Which Malaysian destination would you like to check? Popular spots include Langkawi, Penang, and Cameron Highlands.",
  weather: "Let me help you with weather info! Tell me your destination and travel dates, and I'll give you the forecast and best times to visit.",
  budget: "I'll help you manage your travel budget! Are you setting up a new trip budget, logging expenses, or tracking current spending?",
  food: "Let's find some great food! What are you craving? Street food, local restaurants, or fine dining? And where are you located?",
  plan: "Let's plan your perfect trip! Where would you like to go, how many days do you have, and do you prefer a relaxed or packed schedule?",
  emergency: "I'm here to help! Do you need directions to the nearest hospital, police station, or do you want safety tips for your area?",
};

// ============================================================================
// Memoized Message Components (60fps optimization)
// ============================================================================

const UserMessageBubble = memo(function UserMessageBubble({
  content,
  timestamp
}: {
  content: string;
  timestamp: string;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="flex justify-end"
    >
      <div className="max-w-[80%] flex flex-col items-end gap-1">
        <div
          className="px-4 py-3 rounded-2xl rounded-br-md font-semibold"
          style={{
            background: "var(--duo-blue)",
            color: "white",
          }}
        >
          {content}
        </div>
        <span className="text-xs text-muted-foreground px-1">{timestamp}</span>
      </div>
    </motion.div>
  );
});

const AssistantMessageBubble = memo(function AssistantMessageBubble({
  content,
  timestamp
}: {
  content: string;
  timestamp: string;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="flex gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-[var(--duo-green)] flex items-center justify-center shrink-0">
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div className="max-w-[80%] flex flex-col gap-1">
        <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-card border-2 border-border whitespace-pre-wrap">
          {content}
        </div>
        <span className="text-xs text-muted-foreground px-1">{timestamp}</span>
      </div>
    </motion.div>
  );
});

// ============================================================================
// Main Chat Page
// ============================================================================

export default function ChatPage() {
  const router = useRouter();
  const { addXp } = useGamification();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const getTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    setShowWelcome(false);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: getTimestamp(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `I received: "${userMessage.content}"\n\nThis is a demo response. In the full version, I'd provide helpful travel advice based on your question!`,
        timestamp: getTimestamp(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      addXp(5, "Asked a question!");
    }, 1000);
  }, [input, addXp]);

  const handleQuickAction = useCallback((actionId: string) => {
    setShowWelcome(false);
    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: welcomeMessages[actionId] || welcomeMessages.default,
        timestamp: getTimestamp(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 500);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AuthGuard>
      <DuoResponsiveLayout>
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-lg mx-auto">
        {/* Header */}
        <div className="px-4 py-3 border-b-2 border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--duo-green)] flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="font-bold">Jali AI</h1>
              <p className="text-xs text-muted-foreground">
                {isTyping ? "Typing..." : "Your travel assistant"}
              </p>
            </div>
            <span className="duo-xp-badge text-xs">+5 XP/question</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth contain-layout">
          {/* Welcome State */}
          <AnimatePresence mode="wait">
            {showWelcome && messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <DuoMascot mood="waving" size="lg" />

                <h2 className="text-xl font-extrabold mt-4 mb-2 text-center">
                  Hi! I&apos;m Jali
                </h2>
                <p className="text-muted-foreground text-center max-w-xs mb-6">
                  Your AI travel buddy. Ask me anything about your trip!
                </p>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => handleQuickAction(action.id)}
                        className="duo-card duo-card-interactive p-2 text-center"
                        style={{ borderColor: action.color }}
                      >
                        <Icon
                          className="w-5 h-5 mx-auto mb-1"
                          style={{ color: action.color }}
                        />
                        <span className="text-[10px] font-bold leading-tight">{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <LayoutGroup>
            <div className="space-y-4">
              {messages.map((message) =>
                message.role === "user" ? (
                  <UserMessageBubble
                    key={message.id}
                    content={message.content}
                    timestamp={message.timestamp}
                  />
                ) : (
                  <AssistantMessageBubble
                    key={message.id}
                    content={message.content}
                    timestamp={message.timestamp}
                  />
                )
              )}

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--duo-green)] flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-card border-2 border-border">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-muted-foreground"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </LayoutGroup>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 py-3 border-t-2 border-border bg-background/95 backdrop-blur-sm">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="duo-input flex-1"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                input.trim()
                  ? "bg-[var(--duo-green)] text-white"
                  : "bg-muted text-muted-foreground"
              )}
              style={{
                boxShadow: input.trim()
                  ? "0 4px 0 var(--duo-green-dark)"
                  : "0 4px 0 var(--border)",
              }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Quick suggestions when chat is active */}
          {messages.length > 0 && !isTyping && (
            <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
              {["Best time to visit?", "How crowded?", "Budget tips"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    inputRef.current?.focus();
                  }}
                  className="px-3 py-1.5 rounded-full border-2 border-border text-sm font-semibold whitespace-nowrap hover:border-[var(--duo-blue)] transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          </div>
        </div>
      </DuoResponsiveLayout>
    </AuthGuard>
  );
}
