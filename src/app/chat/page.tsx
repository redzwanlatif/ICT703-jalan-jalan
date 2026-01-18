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
  MapPin,
  ChevronDown,
  X,
  Lightbulb,
  ArrowRight,
  Info,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { DuoResponsiveLayout } from "@/components/shared";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { useTrip, TripPlan } from "@/contexts/trip-context";
import { TripContextSidebar } from "@/components/chat/trip-context-sidebar";
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

// Trip planning conversation step types
type TripPlanningStep = "idle" | "destination" | "dates" | "members" | "preferences" | "confirm";

interface TripPlanningData {
  destination: string;
  startDate: string;
  endDate: string;
  memberCount: number;
  memberNames: string[];
  preferences: string[];
}

export default function ChatPage() {
  const router = useRouter();
  const { getAllTrips, createTrip } = useTrip();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [showTripSelector, setShowTripSelector] = useState(false);
  const [xpToast, setXpToast] = useState<string | null>(null);
  const [newlyCreatedTripId, setNewlyCreatedTripId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Trip planning conversation state
  const [tripPlanningStep, setTripPlanningStep] = useState<TripPlanningStep>("idle");
  const [tripPlanningData, setTripPlanningData] = useState<TripPlanningData>({
    destination: "",
    startDate: "",
    endDate: "",
    memberCount: 1,
    memberNames: [],
    preferences: [],
  });

  // Get trips and selected trip
  const trips = getAllTrips();
  const selectedTrip = trips.find((t) => t.id === selectedTripId);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    // Only scroll to bottom when there are messages (not on initial load)
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  const getTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Handle creating a new trip from chat
  const handleCreateTrip = useCallback(() => {
    // Use createTrip from context
    const tripName = `${tripPlanningData.destination} Trip`;
    const newTrip = createTrip(
      tripName,
      tripPlanningData.destination,
      tripPlanningData.startDate,
      tripPlanningData.endDate
    );

    // Add members to the trip (simplified - just store names for now)
    const memberNames = tripPlanningData.memberNames;

    setSelectedTripId(newTrip.id);
    setTripPlanningStep("idle");
    setTripPlanningData({
      destination: "",
      startDate: "",
      endDate: "",
      memberCount: 1,
      memberNames: [],
      preferences: [],
    });

    // Show success message
    const successMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: `🎉 **Trip Created Successfully!**

Your trip to **${tripPlanningData.destination}** has been created!

📅 **Dates:** ${tripPlanningData.startDate} to ${tripPlanningData.endDate}
👥 **Travelers:** ${memberNames.join(", ")}

I've automatically selected this trip as your active context. Now you can ask me about:
• 🌤️ Weather forecasts for your dates
• 🍜 Food recommendations
• 💰 Budget planning
• 🗺️ Day-by-day itinerary

What would you like to know about your trip?`,
      timestamp: getTimestamp(),
    };
    setMessages(prev => [...prev, successMessage]);

    // Store newly created trip ID for showing dashboard button
    setNewlyCreatedTripId(newTrip.id);

    // Show XP toast
    setXpToast("+25 XP for creating a trip!");
    setTimeout(() => setXpToast(null), 3000);
  }, [tripPlanningData, createTrip]);

  // Process trip planning conversation
  const processTripPlanningInput = useCallback((userInput: string): { response: string; nextStep: TripPlanningStep; updatedData: TripPlanningData } => {
    const input = userInput.trim();
    let response = "";
    let nextStep = tripPlanningStep;
    const updatedData = { ...tripPlanningData };

    switch (tripPlanningStep) {
      case "destination":
        // Parse destination
        const destinations = ["penang", "langkawi", "cameron highlands", "melaka", "kuala lumpur", "kl", "sabah", "sarawak", "johor bahru", "ipoh"];
        const foundDest = destinations.find(d => input.toLowerCase().includes(d));
        if (foundDest) {
          updatedData.destination = foundDest === "kl" ? "Kuala Lumpur" : foundDest.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          nextStep = "dates";
          response = `Great choice! **${updatedData.destination}** is amazing! 🌴

Now, when are you planning to travel?

Please provide your travel dates in this format:
• **Start date** and **End date**
• Example: "Jan 25 to Jan 30" or "25/1/2025 to 30/1/2025"

When would you like to go?`;
        } else {
          // Assume they typed a destination name
          updatedData.destination = input.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          nextStep = "dates";
          response = `I'll set your destination as **${updatedData.destination}**! 📍

Now, when are you planning to travel?

Please provide your travel dates:
• Example: "Jan 25 to Jan 30" or "25/1/2025 to 30/1/2025"

When would you like to go?`;
        }
        break;

      case "dates":
        // Parse dates - simple parsing for demo
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const nextWeekEnd = new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000);

        // Simple date extraction
        updatedData.startDate = nextWeek.toISOString().split("T")[0];
        updatedData.endDate = nextWeekEnd.toISOString().split("T")[0];
        nextStep = "members";
        response = `Perfect! I've noted your dates. 📅

**Trip dates:** ${updatedData.startDate} to ${updatedData.endDate}

Now, let's set up your travel group!

👥 **How many people** will be traveling?
And what are their **names**?

Example: "3 people: Sarah, Ahmad, Michelle"`;
        break;

      case "members":
        // Parse member count and names
        const numberMatch = input.match(/(\d+)/);
        const memberCount = numberMatch ? parseInt(numberMatch[1]) : 1;
        updatedData.memberCount = Math.min(Math.max(memberCount, 1), 10);

        // Extract names after colon or from the input
        let names: string[] = [];
        if (input.includes(":")) {
          names = input.split(":")[1].split(/[,&]/).map(n => n.trim()).filter(n => n);
        } else {
          // Try to extract capitalized names
          names = input.match(/[A-Z][a-z]+/g) || [];
        }

        if (names.length === 0) {
          names = Array.from({ length: updatedData.memberCount }, (_, i) => `Traveler ${i + 1}`);
        }

        updatedData.memberNames = names.slice(0, updatedData.memberCount);
        while (updatedData.memberNames.length < updatedData.memberCount) {
          updatedData.memberNames.push(`Traveler ${updatedData.memberNames.length + 1}`);
        }

        nextStep = "preferences";
        response = `Awesome! Your group is set! 🎉

👥 **Travelers:** ${updatedData.memberNames.join(", ")}

Last question! What are your **travel preferences**?

Choose from or type your interests:
• 🍜 Food & Culinary
• 🏛️ Culture & Heritage
• 🏖️ Beach & Relaxation
• 🌿 Nature & Adventure
• 🛍️ Shopping
• 📸 Photography

Example: "Food, Beach, Culture"`;
        break;

      case "preferences":
        // Parse preferences
        const prefKeywords: Record<string, string> = {
          "food": "Food & Culinary",
          "culinary": "Food & Culinary",
          "eat": "Food & Culinary",
          "culture": "Culture & Heritage",
          "heritage": "Culture & Heritage",
          "history": "Culture & Heritage",
          "beach": "Beach & Relaxation",
          "relax": "Beach & Relaxation",
          "nature": "Nature & Adventure",
          "adventure": "Nature & Adventure",
          "hiking": "Nature & Adventure",
          "shopping": "Shopping",
          "shop": "Shopping",
          "photo": "Photography",
          "photography": "Photography",
        };

        const foundPrefs = new Set<string>();
        Object.entries(prefKeywords).forEach(([keyword, pref]) => {
          if (input.toLowerCase().includes(keyword)) {
            foundPrefs.add(pref);
          }
        });

        updatedData.preferences = foundPrefs.size > 0 ? Array.from(foundPrefs) : ["General Tourism"];
        nextStep = "confirm";

        response = `Perfect! Here's your trip summary:

🗺️ **Trip to ${updatedData.destination}**

📅 **Dates:** ${updatedData.startDate} to ${updatedData.endDate}
👥 **Travelers:** ${updatedData.memberNames.join(", ")} (${updatedData.memberCount} people)
❤️ **Interests:** ${updatedData.preferences.join(", ")}

Does this look correct? Type **"yes"** or **"create"** to create your trip, or **"edit"** to make changes.`;
        break;

      case "confirm":
        if (input.toLowerCase().includes("yes") || input.toLowerCase().includes("create") || input.toLowerCase().includes("confirm")) {
          // Will trigger trip creation
          nextStep = "idle";
          response = "CREATING_TRIP"; // Special flag
        } else if (input.toLowerCase().includes("edit") || input.toLowerCase().includes("change") || input.toLowerCase().includes("no")) {
          nextStep = "destination";
          response = `No problem! Let's start over.

🗺️ **Where would you like to go?**

Popular destinations:
• 🏝️ Langkawi - Island paradise
• 🍜 Penang - Food haven
• 🌿 Cameron Highlands - Cool retreat
• 🏛️ Melaka - Historical charm
• 🌆 Kuala Lumpur - City vibes

Where are you thinking?`;
        } else {
          response = `I didn't catch that. Please type:
• **"yes"** or **"create"** to create your trip
• **"edit"** to make changes`;
        }
        break;

      default:
        nextStep = "idle";
        response = "";
    }

    return { response, nextStep, updatedData };
  }, [tripPlanningStep, tripPlanningData]);

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
    const currentInput = input.trim();
    setInput("");
    setIsTyping(true);

    // Check if we're in trip planning mode
    if (tripPlanningStep !== "idle") {
      const { response, nextStep, updatedData } = processTripPlanningInput(currentInput);

      setTimeout(() => {
        if (response === "CREATING_TRIP") {
          // Create the trip
          setTripPlanningData(updatedData);
          setTripPlanningStep(nextStep);
          setIsTyping(false);
          // Use a small timeout to ensure state is updated
          setTimeout(() => {
            handleCreateTrip();
          }, 100);
        } else {
          setTripPlanningData(updatedData);
          setTripPlanningStep(nextStep);
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: response,
            timestamp: getTimestamp(),
          };
          setMessages(prev => [...prev, assistantMessage]);
          setIsTyping(false);
        }
      }, 800);
      return;
    }

    // Check if user wants to plan a new trip
    const lowerInput = currentInput.toLowerCase();
    if (
      (lowerInput.includes("plan") && lowerInput.includes("trip")) ||
      (lowerInput.includes("new") && lowerInput.includes("trip")) ||
      (lowerInput.includes("create") && lowerInput.includes("trip")) ||
      lowerInput.includes("start planning")
    ) {
      setTripPlanningStep("destination");
      setTimeout(() => {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: `🗺️ **Let's Plan Your Trip!**

I'll help you create a new trip step by step. First, let's start with the basics.

**Where would you like to go?**

Popular Malaysian destinations:
• 🏝️ **Langkawi** - Island paradise with beaches & duty-free shopping
• 🍜 **Penang** - Street food heaven & heritage sites
• 🌿 **Cameron Highlands** - Cool mountain retreat
• 🏛️ **Melaka** - Historical charm & Peranakan culture
• 🌆 **Kuala Lumpur** - City vibes & modern attractions

Just type your destination!`,
          timestamp: getTimestamp(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 800);
      return;
    }

    // Generate mockup response based on context
    const generateMockResponse = (question: string, trip: TripPlan | undefined): string => {
      const lowerQuestion = question.toLowerCase();

      if (trip) {
        // WITH CONTEXT - Personalized responses
        const tripDays = Math.ceil(
          (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        const memberCount = trip.members.length;

        if (lowerQuestion.includes("weather") || lowerQuestion.includes("rain") || lowerQuestion.includes("hot")) {
          return `🌤️ **Weather Forecast for ${trip.destination}**

Based on your trip dates (${trip.startDate} to ${trip.endDate}):

• **Expected Temperature**: 28-33°C during the day
• **Humidity**: Around 75-85%
• **Rain Chance**: 40% (afternoon showers typical)

**Packing Suggestions for your ${tripDays}-day trip:**
• Light, breathable clothing
• Umbrella or light rain jacket
• Sunscreen SPF 50+
• Comfortable walking shoes

Since you're traveling with ${memberCount} ${memberCount === 1 ? "person" : "people"}, consider bringing a portable fan for outdoor activities!`;
        }

        if (lowerQuestion.includes("food") || lowerQuestion.includes("eat") || lowerQuestion.includes("restaurant")) {
          return `🍜 **Food Recommendations in ${trip.destination}**

Perfect for your group of ${memberCount}! Here are my top picks:

**Must-Try Local Dishes:**
1. **Char Kuey Teow** - Smoky stir-fried noodles
2. **Nasi Lemak** - Fragrant coconut rice with sambal
3. **Roti Canai** - Flaky flatbread with curry

**Recommended Restaurants:**
• *Restoran Kapitan* - Best curry in town
• *Lorong Selamat Char Kuey Teow* - Famous hawker stall
• *Jawi House* - Great for groups, Peranakan cuisine

**Budget for ${memberCount} people (${tripDays} days):**
Estimated: RM${30 * memberCount * tripDays} - RM${60 * memberCount * tripDays}

Would you like me to add these to your itinerary?`;
        }

        if (lowerQuestion.includes("budget") || lowerQuestion.includes("cost") || lowerQuestion.includes("money") || lowerQuestion.includes("expensive")) {
          return `💰 **Budget Breakdown for ${trip.destination}**

**${tripDays}-Day Trip for ${memberCount} ${memberCount === 1 ? "Traveler" : "Travelers"}**

| Category | Per Person | Total (${memberCount} pax) |
|----------|------------|--------------|
| Accommodation | RM${80 * tripDays} | RM${80 * tripDays * memberCount} |
| Food & Drinks | RM${50 * tripDays} | RM${50 * tripDays * memberCount} |
| Transport | RM${30 * tripDays} | RM${30 * tripDays * memberCount} |
| Activities | RM${40 * tripDays} | RM${40 * tripDays * memberCount} |
| Misc | RM${20 * tripDays} | RM${20 * tripDays * memberCount} |

**Estimated Total: RM${220 * tripDays * memberCount}**

💡 *Tip: Book accommodations early for ${trip.destination} - prices can increase by 30% closer to your dates!*

Want me to track expenses during your trip?`;
        }

        if (lowerQuestion.includes("crowd") || lowerQuestion.includes("busy") || lowerQuestion.includes("peak")) {
          return `👥 **Crowd Levels in ${trip.destination}**

**For your dates (${trip.startDate} to ${trip.endDate}):**

📊 **Expected Crowd Level: Moderate**

**Peak Hours to Avoid:**
• Popular attractions: 10 AM - 2 PM
• Restaurants: 12 PM - 1 PM, 7 PM - 8 PM
• Shopping areas: Weekends after 3 PM

**Best Times for Your Group of ${memberCount}:**
• Morning (8-10 AM): Great for photos, fewer tourists
• Late afternoon (4-6 PM): Cooler, less crowded
• Evening (after 8 PM): Night markets come alive!

**Pro Tip:** With ${memberCount} people, I recommend booking popular restaurants in advance. Want me to suggest reservation-worthy spots?`;
        }

        // Default contextual response
        return `Thanks for your question about "${question}"!

📍 **Trip Context: ${trip.destination}**
📅 Dates: ${trip.startDate} to ${trip.endDate}
👥 Travelers: ${memberCount} ${memberCount === 1 ? "person" : "people"}

Based on your ${tripDays}-day trip, here's what I can help you with:

• 🗺️ **Itinerary Planning** - Day-by-day activities
• 🍜 **Food Recommendations** - Local favorites & restaurants
• 💰 **Budget Tracking** - Expense management for your group
• 🚗 **Transport Options** - Getting around ${trip.destination}
• ☀️ **Weather Updates** - Pack smart for your dates

What specific aspect would you like me to dive into?`;
      } else {
        // WITHOUT CONTEXT - Generic responses with prompts to select trip
        if (lowerQuestion.includes("weather")) {
          return `🌤️ **Weather Information**

I can provide detailed weather forecasts, but I'll need to know:

• **Which destination** are you asking about?
• **What dates** are you traveling?

💡 **Tip:** Select a trip from the sidebar and I'll automatically know your destination and dates!

Once you select a trip, I can tell you:
• Daily temperature forecasts
• Rain probability
• What to pack
• Best times for outdoor activities`;
        }

        if (lowerQuestion.includes("food") || lowerQuestion.includes("eat") || lowerQuestion.includes("restaurant")) {
          return `🍜 **Food Recommendations**

I'd love to suggest amazing local food! To give you the best recommendations, please tell me:

• **Where** are you traveling to?
• **How many people** in your group?
• **Any dietary restrictions?**

💡 **Quick Tip:** Select a trip from the sidebar, and I'll give you personalized food recommendations based on your destination and group size!

Popular Malaysian destinations I know well:
• Penang - Street food paradise
• Langkawi - Seafood heaven
• KL - Diverse culinary scene
• Malacca - Peranakan delights`;
        }

        if (lowerQuestion.includes("budget") || lowerQuestion.includes("cost") || lowerQuestion.includes("money")) {
          return `💰 **Budget Planning**

I can help you create a detailed budget! I'll need to know:

• **Destination** - Costs vary by location
• **Duration** - How many days?
• **Group size** - Per person vs total costs
• **Travel style** - Budget, mid-range, or luxury?

💡 **Pro Tip:** Select a trip from the sidebar, and I'll calculate a personalized budget breakdown instantly!

**General Malaysia Travel Costs:**
• Budget: RM100-150/day per person
• Mid-range: RM200-350/day per person
• Luxury: RM500+/day per person`;
        }

        // Default non-contextual response
        return `Thanks for your question: "${question}"

I'm your AI travel assistant for Malaysia! I can help with:

🗺️ **Trip Planning** - Itineraries & recommendations
🍜 **Food & Dining** - Local cuisine & restaurants
💰 **Budget** - Cost estimates & expense tracking
☀️ **Weather** - Forecasts & packing tips
👥 **Crowd Levels** - Best times to visit
🚨 **Safety** - Travel advisories & tips

**To get personalized assistance:**
Select a trip from the sidebar (or tap "Trip" on mobile) and I'll tailor my answers to your specific destination, dates, and group!

What would you like to explore?`;
      }
    };

    // Simulate AI response
    setTimeout(() => {
      const responseContent = generateMockResponse(userMessage.content, selectedTrip);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: responseContent,
        timestamp: getTimestamp(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      // Show simple XP toast
      setXpToast("+5 XP");
      setTimeout(() => setXpToast(null), 2000);
    }, 1200);
  }, [input, selectedTrip]);

  const handleQuickAction = useCallback((actionId: string) => {
    setShowWelcome(false);

    // Special case: If clicking "plan" without a trip, start trip planning mode
    if (actionId === "plan" && !selectedTrip) {
      setTripPlanningStep("destination");
      setIsTyping(true);
      setTimeout(() => {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: `🗺️ **Let's Plan Your Trip!**

I'll help you create a new trip step by step. First, let's start with the basics.

**Where would you like to go?**

Popular Malaysian destinations:
• 🏝️ **Langkawi** - Island paradise with beaches & duty-free shopping
• 🍜 **Penang** - Street food heaven & heritage sites
• 🌿 **Cameron Highlands** - Cool mountain retreat
• 🏛️ **Melaka** - Historical charm & Peranakan culture
• 🌆 **Kuala Lumpur** - City vibes & modern attractions

Just type your destination!`,
          timestamp: getTimestamp(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 800);
      return;
    }

    setIsTyping(true);

    // Generate context-aware quick action responses
    const generateQuickActionResponse = (action: string, trip: TripPlan | undefined): string => {
      if (trip) {
        const tripDays = Math.ceil(
          (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        const memberCount = trip.members.length;

        switch (action) {
          case "crowd":
            return `👥 **Crowd Forecast for ${trip.destination}**

📅 Your dates: ${trip.startDate} to ${trip.endDate}

**Current Prediction: 🟡 Moderate**

| Location | Expected Crowd |
|----------|----------------|
| Main attractions | 🟡 Moderate |
| Beaches/Nature | 🟢 Low |
| Shopping areas | 🟠 Busy |
| Restaurants | 🟡 Moderate |

**Best Times for Your Group of ${memberCount}:**
• Early morning (7-9 AM) - Quiet, great for photos
• Late afternoon (4-6 PM) - Cooling down, fewer tourists
• Weekdays are generally less crowded

**Insider Tips for ${trip.destination}:**
• Book popular restaurants 1-2 days ahead
• Visit main attractions right at opening time
• Evening markets are busiest 7-9 PM

Would you like specific crowd info for any attraction?`;

          case "weather":
            return `🌤️ **Weather Forecast for ${trip.destination}**

📅 Your trip: ${trip.startDate} to ${trip.endDate} (${tripDays} days)

**Overall Forecast: Tropical & Warm**

| Day | Weather | Temp | Rain |
|-----|---------|------|------|
| Day 1 | ☀️ Sunny | 32°C | 20% |
| Day 2 | ⛅ Partly Cloudy | 31°C | 35% |
| Day 3 | 🌦️ Afternoon Showers | 30°C | 60% |
${tripDays > 3 ? `| Day 4+ | ☀️ Mostly Sunny | 31°C | 30% |` : ""}

**Packing Checklist for ${memberCount} ${memberCount === 1 ? "Traveler" : "Travelers"}:**
✅ Light, breathable clothing
✅ Umbrella or rain jacket
✅ Sunscreen SPF 50+
✅ Sunglasses & hat
✅ Comfortable walking shoes
✅ Refillable water bottle

**Best Activity Times:**
• Outdoor activities: 7-11 AM or 4-6 PM
• Beach time: Before 11 AM
• Indoor attractions: 12-3 PM (hottest hours)

Need specific activity recommendations based on weather?`;

          case "budget":
            return `💰 **Budget Planner for ${trip.destination}**

📅 ${tripDays}-Day Trip | 👥 ${memberCount} ${memberCount === 1 ? "Traveler" : "Travelers"}

**Estimated Daily Budget (per person):**

| Category | Budget | Mid-Range | Comfort |
|----------|--------|-----------|---------|
| Accommodation | RM50 | RM120 | RM250 |
| Food & Drinks | RM40 | RM80 | RM150 |
| Transport | RM20 | RM50 | RM100 |
| Activities | RM30 | RM80 | RM150 |
| **Daily Total** | **RM140** | **RM330** | **RM650** |

**Trip Total Estimates (${memberCount} pax, ${tripDays} days):**
• 💚 Budget: RM${140 * memberCount * tripDays}
• 💛 Mid-Range: RM${330 * memberCount * tripDays}
• 💜 Comfort: RM${650 * memberCount * tripDays}

**Money-Saving Tips for ${trip.destination}:**
• Eat at hawker centers (RM8-15/meal)
• Use Grab for transparent pricing
• Book attractions online for discounts
• Share dishes family-style with your group

Want me to help track expenses during your trip?`;

          case "food":
            return `🍜 **Food Guide for ${trip.destination}**

👥 Perfect for your group of ${memberCount}!

**Must-Try Local Dishes:**
1. 🍜 **Char Kuey Teow** - Smoky wok-fried noodles
2. 🍚 **Nasi Lemak** - Coconut rice with sambal
3. 🥟 **Dim Sum** - Best for group sharing
4. 🍢 **Satay** - Grilled skewers with peanut sauce
5. 🧁 **Cendol** - Shaved ice dessert

**Top Restaurants for Groups:**
| Name | Cuisine | Price/pax | Best For |
|------|---------|-----------|----------|
| Restoran Kapitan | Indian-Malay | RM25 | Curry lovers |
| Tek Sen | Chinese | RM30 | Local favorite |
| Hameediyah | Nasi Kandar | RM20 | Authentic taste |

**Food Budget (${memberCount} pax, ${tripDays} days):**
• Street food: RM${25 * memberCount * tripDays}
• Mix of both: RM${50 * memberCount * tripDays}
• Restaurants: RM${80 * memberCount * tripDays}

**Dietary Options Available:**
✅ Halal ✅ Vegetarian ✅ Seafood-free options

Want me to create a food itinerary for your trip?`;

          case "plan":
            return `🗺️ **Trip Planner for ${trip.destination}**

📅 ${trip.startDate} to ${trip.endDate} (${tripDays} days)
👥 ${memberCount} ${memberCount === 1 ? "Traveler" : "Travelers"}

**Suggested ${tripDays}-Day Itinerary:**

${tripDays >= 1 ? `**Day 1 - Arrival & Explore**
• Morning: Check-in, freshen up
• Afternoon: ${trip.destination} city walk
• Evening: Local dinner & night market
` : ""}
${tripDays >= 2 ? `**Day 2 - Main Attractions**
• Morning: Top attractions (beat the crowds!)
• Afternoon: Cultural sites & temples
• Evening: Sunset spot & seafood dinner
` : ""}
${tripDays >= 3 ? `**Day 3 - Adventure Day**
• Morning: Nature/beach activities
• Afternoon: Shopping & souvenirs
• Evening: Fine dining experience
` : ""}
${tripDays >= 4 ? `**Day 4+ - Flexible**
• Day trips to nearby attractions
• Relaxation time
• Hidden gems exploration
` : ""}
**Group Activities Perfect for ${memberCount}:**
• Food tour (great for sharing dishes!)
• Guided walking tour
• Cooking class
• Island hopping (if coastal)

Want me to detail any specific day?`;

          case "emergency":
            return `🚨 **Emergency Info for ${trip.destination}**

📅 Your trip: ${trip.startDate} to ${trip.endDate}
👥 ${memberCount} ${memberCount === 1 ? "traveler" : "travelers"} - save these contacts!

**Emergency Numbers:**
• 🚔 Police: **999**
• 🚑 Ambulance: **999**
• 🔥 Fire: **994**
• 🏥 Tourist Police: **03-2166 8322**

**Nearest Hospitals in ${trip.destination}:**
1. General Hospital - 24/7 Emergency
2. Private Medical Centre - English-speaking staff
3. Tourist Clinic - Travel health specialists

**Embassy Contacts:**
• Your country's embassy (save before trip!)
• Malaysian Tourism Hotline: 1-300-88-5050

**Safety Tips for Your Group:**
• Share live location with each other
• Keep copies of passports separately
• Note your hotel address in Malay
• Download offline maps

**Travel Insurance:**
${memberCount > 1 ? `• Group policy recommended for ${memberCount} travelers` : "• Individual policy recommended"}
• Keep policy number accessible
• Know claim procedure

**Quick Phrases:**
• "Tolong!" = Help!
• "Hospital" = Hospital (same word)
• "Polis" = Police

Stay safe! Anything specific you'd like to prepare for?`;

          default:
            return welcomeMessages[action] || welcomeMessages.default;
        }
      } else {
        // Without context - prompt to select trip
        switch (action) {
          case "crowd":
            return `👥 **Crowd Level Checker**

I can show you real-time crowd predictions! But first, I need to know:

• **Which destination?**
• **What dates?**

💡 **Quick Tip:** Select a trip from the sidebar and I'll instantly show crowd forecasts for your specific dates!

**Popular Destinations I Track:**
• Penang - Georgetown, beaches
• Langkawi - Beaches, Sky Bridge
• KL - KLCC, Batu Caves
• Malacca - Jonker Street, heritage sites

Select a trip or tell me where you're going!`;

          case "weather":
            return `🌤️ **Weather Forecasts**

I can give you detailed weather info! To provide accurate forecasts, I need:

• **Destination**
• **Travel dates**

💡 **Pro Tip:** Select a trip from the sidebar for instant weather forecasts tailored to your exact dates!

**General Malaysia Climate:**
• Temperature: 27-33°C year-round
• Rainy season: Nov-Feb (East Coast), Apr-Oct (West Coast)
• Humidity: 70-90%

Which destination are you curious about?`;

          case "budget":
            return `💰 **Budget Planning**

I can create a detailed budget breakdown! I'll need to know:

• **Destination** - Costs vary by location
• **Trip duration** - How many days?
• **Group size** - Per person calculations
• **Travel style** - Budget, mid-range, or comfort?

💡 **Easy Way:** Select a trip from the sidebar and I'll calculate everything automatically!

**Quick Malaysia Budget Guide:**
• Budget: RM100-150/day/person
• Mid-Range: RM250-400/day/person
• Comfort: RM500+/day/person

Ready to plan your budget?`;

          case "food":
            return `🍜 **Food Recommendations**

Malaysia is a food paradise! To give you the best recommendations:

• **Where are you going?**
• **How many people?**
• **Any dietary requirements?**

💡 **Shortcut:** Select a trip from the sidebar for personalized food guides!

**Regional Highlights:**
• 🍜 Penang - Street food capital
• 🦐 Langkawi - Fresh seafood
• 🍛 KL - International variety
• 🥘 Malacca - Peranakan cuisine

What are you craving?`;

          case "plan":
            return `🗺️ **Trip Planning**

Let's create your perfect itinerary! I'll need:

• **Destination**
• **Number of days**
• **Group size**
• **Travel style** - Relaxed or action-packed?

💡 **Quick Start:** Select a trip from the sidebar and I'll generate a custom itinerary instantly!

**Popular Trip Types:**
• 🏖️ Beach getaway (3-5 days)
• 🏛️ Cultural exploration (4-7 days)
• 🍜 Food tour (2-4 days)
• 🌿 Nature adventure (3-5 days)

Where would you like to go?`;

          case "emergency":
            return `🚨 **Emergency Assistance**

I'm here to help! What do you need?

**Quick Emergency Numbers (Malaysia):**
• 🚔 Police: **999**
• 🚑 Ambulance: **999**
• 🔥 Fire: **994**
• 📞 Tourist Hotline: **1-300-88-5050**

💡 **Tip:** Select a trip from the sidebar and I'll provide location-specific emergency info, nearest hospitals, and embassy contacts!

**How can I help?**
• Find nearest hospital
• Police station locations
• Embassy contacts
• Safety tips
• Travel insurance info

What's your situation?`;

          default:
            return welcomeMessages[action] || welcomeMessages.default;
        }
      }
    };

    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: generateQuickActionResponse(actionId, selectedTrip),
        timestamp: getTimestamp(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  }, [selectedTrip]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Start AI trip planning from sidebar button
  const handleStartAIPlanning = useCallback(() => {
    setShowWelcome(false);
    setTripPlanningStep("destination");
    setIsTyping(true);
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `🗺️ **Let's Plan Your Trip!**

I'll help you create a new trip step by step. First, let's start with the basics.

**Where would you like to go?**

Popular Malaysian destinations:
• 🏝️ **Langkawi** - Island paradise with beaches & duty-free shopping
• 🍜 **Penang** - Street food heaven & heritage sites
• 🌿 **Cameron Highlands** - Cool mountain retreat
• 🏛️ **Melaka** - Historical charm & Peranakan culture
• 🌆 **Kuala Lumpur** - City vibes & modern attractions

Just type your destination!`,
        timestamp: getTimestamp(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 500);
  }, []);

  return (
    <DuoResponsiveLayout
        sidebar={
          <TripContextSidebar
            selectedTripId={selectedTripId}
            onSelectTrip={setSelectedTripId}
            onStartAIPlanning={handleStartAIPlanning}
          />
        }
        sidebarPosition="left"
        showFooter={false}
      >
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-lg mx-auto lg:max-w-none">
        {/* Header */}
        <div className="px-4 py-3 border-b-2 border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--duo-green)] flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-bold">Jali AI</h1>
                {/* Desktop: Show trip context badge */}
                {selectedTrip && (
                  <span className="hidden lg:inline-flex items-center gap-1 text-xs bg-[var(--duo-green)]/10 text-[var(--duo-green)] px-2 py-0.5 rounded-full font-semibold">
                    <MapPin className="w-3 h-3" />
                    {selectedTrip.destination}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {isTyping ? "Typing..." : "Your travel assistant"}
              </p>
            </div>
            {/* Mobile: Trip context selector */}
            <button
              onClick={() => setShowTripSelector(true)}
              className="lg:hidden flex items-center gap-1 px-2 py-1 rounded-lg border border-border text-xs font-semibold hover:bg-muted/50 transition-colors"
            >
              {selectedTrip ? (
                <>
                  <MapPin className="w-3 h-3 text-[var(--duo-green)]" />
                  <span className="max-w-[80px] truncate">{selectedTrip.destination}</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span>Trip</span>
                </>
              )}
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Mobile Trip Selector Bottom Sheet */}
        <AnimatePresence>
          {showTripSelector && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowTripSelector(false)}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
              />
              {/* Bottom Sheet */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="lg:hidden fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-[70] max-h-[70vh] overflow-hidden shadow-[0_-8px_30px_rgb(0,0,0,0.12)]"
              >
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-bold">Select Trip Context</h3>
                  <button
                    onClick={() => setShowTripSelector(false)}
                    className="p-1 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 overflow-y-auto max-h-[calc(70vh-60px)] pb-24">
                  <TripContextSidebar
                    selectedTripId={selectedTripId}
                    onSelectTrip={(tripId) => {
                      setSelectedTripId(tripId);
                      setShowTripSelector(false);
                    }}
                    onStartAIPlanning={() => {
                      setShowTripSelector(false);
                      handleStartAIPlanning();
                    }}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth contain-layout">
          {/* Welcome State */}
          <AnimatePresence mode="wait">
            {showWelcome && messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-6"
              >
                <DuoMascot mood="waving" size="lg" />

                <h2 className="text-xl font-extrabold mt-4 mb-2 text-center">
                  Hi! I&apos;m Jali
                </h2>
                <p className="text-muted-foreground text-center max-w-xs mb-4">
                  Your AI travel buddy. Ask me anything about your trip!
                </p>

                {/* Context Status Card */}
                <div className="w-full max-w-sm mb-4">
                  {selectedTrip ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3 rounded-xl bg-[var(--duo-green)]/10 border-2 border-[var(--duo-green)]/30"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[var(--duo-green)] flex items-center justify-center">
                          <MapPin className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-bold text-sm text-[var(--duo-green)]">
                          Trip Context Active
                        </span>
                      </div>
                      <p className="text-sm font-semibold">{selectedTrip.destination}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedTrip.startDate} → {selectedTrip.endDate} • {selectedTrip.members.length} {selectedTrip.members.length === 1 ? "traveler" : "travelers"}
                      </p>
                      <p className="text-xs text-[var(--duo-green)] mt-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        I&apos;ll personalize all answers for this trip!
                      </p>
                    </motion.div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[var(--duo-yellow)]/10 border-2 border-[var(--duo-yellow)]/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[var(--duo-yellow)] flex items-center justify-center">
                          <Lightbulb className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-bold text-sm text-[var(--duo-yellow-dark)]">
                          No Trip Selected
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Select a trip to get personalized answers with your destination, dates, and group size!
                      </p>
                      <div className="flex flex-col gap-2">
                        {trips.length > 0 ? (
                          <button
                            onClick={() => setShowTripSelector(true)}
                            className="lg:hidden flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-[var(--duo-yellow)] text-white font-bold text-xs hover:opacity-90 transition-opacity"
                          >
                            <MapPin className="w-3 h-3" />
                            Select a Trip
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : null}
                        <p className="hidden lg:block text-xs text-muted-foreground">
                          👈 Choose from the sidebar on the left
                        </p>
                        {trips.length === 0 && (
                          <div className="w-full space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center">
                              Plan Your First Trip
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={handleStartAIPlanning}
                                className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg border-2 border-dashed border-border hover:border-[var(--duo-blue)] hover:bg-[var(--duo-blue)]/5 transition-all text-xs font-semibold text-muted-foreground hover:text-[var(--duo-blue)]"
                              >
                                <Bot className="w-4 h-4" />
                                <span>AI Chat</span>
                              </button>
                              <Link
                                href="/predictions"
                                className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg border-2 border-dashed border-border hover:border-[var(--duo-green)] hover:bg-[var(--duo-green)]/5 transition-all text-xs font-semibold text-muted-foreground hover:text-[var(--duo-green)]"
                              >
                                <Wand2 className="w-4 h-4" />
                                <span>Wizard</span>
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* How Context Works - Collapsible Info */}
                <details className="w-full max-w-sm mb-4 group">
                  <summary className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors list-none">
                    <Info className="w-3 h-3" />
                    <span>How does trip context work?</span>
                    <ChevronDown className="w-3 h-3 ml-auto group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="mt-2 p-3 rounded-lg bg-muted/50 text-xs space-y-2">
                    <p><strong>What is Trip Context?</strong></p>
                    <p className="text-muted-foreground">
                      When you select a trip, I automatically know your destination, travel dates, and group size. This lets me give you specific, personalized answers instead of generic info.
                    </p>
                    <p className="mt-2"><strong>With context, I can tell you:</strong></p>
                    <ul className="text-muted-foreground space-y-1 ml-3">
                      <li>• Weather forecasts for your exact dates</li>
                      <li>• Budget calculations for your group size</li>
                      <li>• Crowd predictions for when you&apos;ll be there</li>
                      <li>• Custom itineraries for your trip length</li>
                    </ul>
                    <p className="mt-2"><strong>How to select:</strong></p>
                    <ul className="text-muted-foreground space-y-1 ml-3">
                      <li>• <span className="lg:hidden">Tap &quot;Trip&quot; button in header</span><span className="hidden lg:inline">Click a trip in the left sidebar</span></li>
                      <li>• Or ask me without context - I&apos;ll help you anyway!</li>
                    </ul>
                  </div>
                </details>

                {/* Quick Actions Grid */}
                <p className="text-xs font-semibold text-muted-foreground mb-2">Quick actions:</p>
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

              {/* View Trip in Dashboard Button */}
              {newlyCreatedTripId && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <Link
                    href={`/dashboard?tripId=${newlyCreatedTripId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--duo-green)] text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-[0_4px_0_var(--duo-green-dark)] active:translate-y-[4px] active:shadow-none"
                    onClick={() => setNewlyCreatedTripId(null)}
                  >
                    <MapPin className="w-4 h-4" />
                    View Trip in Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
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

        {/* XP Toast */}
        <AnimatePresence>
          {xpToast && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-center px-4 py-1"
            >
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--duo-yellow)] text-white text-xs font-bold shadow-md">
                <Sparkles className="w-3 h-3" />
                {xpToast}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

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
  );
}
