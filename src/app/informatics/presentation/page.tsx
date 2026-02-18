"use client";

import {
  BookOpen,
  ExternalLink,
  Presentation,
  Layers,
  Lightbulb,
  AlertTriangle,
  LayoutDashboard,
  PlaneTakeoff,
  Wallet,
  BarChart3,
  Settings,
  Bell,
  Target,
  ArrowRight,
  Compass,
  Quote,
  MessageCircle,
  FlaskConical,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AnimatedBackground,
  UnifiedCard,
} from "@/components/shared/page-layout";
import { LinkedCardMockup } from "@/components/informatics";
import { cn } from "@/lib/utils";

// ============================================================================
// Section Data
// ============================================================================

type Section = {
  id: string;
  step: number;
  title: string;
  headline?: string;
  stage?: string;
  bullets?: string[];
  theories?: { theory: string; author: string }[];
  featureLink?: { label: string; href: string };
  icon: React.ReactNode;
  speakerNotes: string[];
  transition?: string;
  highlightedData?: string[];
};

const stageColors: Record<string, string> = {
  Preparation:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  Collection:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  Integration:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  Reflection:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800",
  Analysis:
    "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800",
  "User Control":
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  "Behavioural Design":
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800",
};

const stageDotColors: Record<string, string> = {
  Integration: "bg-amber-500",
  Collection: "bg-blue-500",
  Reflection: "bg-green-500",
  Analysis: "bg-teal-500",
  "User Control": "bg-indigo-500",
  "Behavioural Design": "bg-rose-500",
};

const sections: Section[] = [
  {
    id: "problem",
    step: 1,
    title: "The Problem",
    headline: "Travellers keep making the same mistakes.",
    icon: <AlertTriangle className="size-5" />,
    bullets: [
      "Going overbudget repeatedly with no visibility into spending patterns",
      "Overbooking activities in short trips — leading to burnout, not enjoyment",
      "No tools to learn from past travel experiences — the feedback loop is broken",
    ],
    speakerNotes: [
      "The course brief highlights a recurring problem — travellers go overbudget, overplan, and repeat the same mistakes trip after trip.",
      "There's no feedback loop. No way to learn from your own travel data. Most travel apps help you book, but none help you reflect or improve.",
      "That's the gap Travel Pulse fills — we turn travel data into learning.",
    ],
    transition:
      "So how do we solve this? We started with a proven framework from HCI research...",
  },
  {
    id: "approach",
    step: 2,
    title: "Our Approach — Stage-Based Model",
    headline: "A framework for personal informatics",
    icon: <Compass className="size-5" />,
    bullets: [
      "Built around Li, Dey & Forlizzi's (2010) Stage-Based Model of Personal Informatics",
      "Five stages form a complete feedback loop: Preparation → Collection → Integration → Reflection → Action",
      "Each screen maps directly to one of these stages",
    ],
    theories: [
      {
        theory: "Stage-Based Model of Personal Informatics",
        author: "Li, Dey & Forlizzi (2010)",
      },
    ],
    featureLink: { label: "View User Flow", href: "/informatics/flow" },
    speakerNotes: [
      "We built Travel Pulse around Li, Dey, and Forlizzi's Stage-Based Model of Personal Informatics, published at CHI 2010.",
      "This model defines five stages — Preparation, Collection, Integration, Reflection, and Action. It's a cycle, not a line — the idea is that reflecting on past trips feeds back into better preparation for future ones.",
      "Every screen in our module maps directly to one of these stages. This gives the entire system a coherent structure grounded in established research.",
    ],
    transition:
      "Let me give you a quick overview of all the screens before we dive into each one...",
  },
  {
    id: "overview",
    step: 3,
    title: "Feature Overview",
    headline: "8 screens. One journey.",
    icon: <Target className="size-5" />,
    bullets: [
      "Dashboard — Your travel health at a glance (Integration)",
      "Trip Planner — Create and organise trips (Collection)",
      "Expense Tracker — Log spending in real-time (Collection)",
      "Trip Reflection — Learn from completed trips (Reflection)",
      "Spending Insights — Deep analytics on patterns (Analysis)",
      "Settings & Privacy — Full data control (User Control)",
    ],
    featureLink: { label: "Explore User Flow", href: "/informatics/flow" },
    speakerNotes: [
      "Travel Pulse has 8 screens, each serving a specific role in the informatics lifecycle.",
      "We'll walk through each one and explain the design rationale — not just what it does, but why we designed it that way and which HCI theory backs each decision.",
    ],
    transition:
      "Let's start with the dashboard — the home screen and the Integration stage...",
  },
  {
    id: "dashboard",
    step: 4,
    title: "Dashboard — My Travel Pulse",
    headline:
      "Integration Stage — where raw data becomes meaningful information",
    stage: "Integration",
    icon: <LayoutDashboard className="size-5" />,
    bullets: [
      "Donut chart follows Tufte's data-ink ratio — every pixel serves a purpose, no chart junk",
      "Metric cards use Gestalt principles (proximity & similarity) for visual grouping",
      "AI insight carousel prompts reflection — data alone isn't enough",
      "Active Trip Watchlist tracks price trends for planned destinations",
      "Currency exchange widget gives context for international travel",
    ],
    theories: [
      { theory: "Data-Ink Ratio", author: "Tufte (1983)" },
      { theory: "Gestalt Principles", author: "Proximity & Similarity" },
      { theory: "System-Driven Reflection", author: "Baumer & Gay (2015)" },
    ],
    featureLink: { label: "Open Dashboard", href: "/informatics/dashboard" },
    highlightedData: [
      "Donut chart: 65% of RM 15,000 yearly budget used",
      "Metric cards: 4 Trips | 12% Avg. Overspend | 88% Savings Goal",
      "Watchlist: London & Tokyo price trends",
      "Currency: EUR, GBP, CHF → MYR live rates",
    ],
    speakerNotes: [
      "The dashboard is the Integration Stage — where raw data becomes meaningful information. This is the user's home screen.",
      "The donut chart follows Tufte's data-ink ratio principle: every pixel serves a purpose, there's no chart junk. The metric cards below use Gestalt principles — proximity groups related data together, and similarity ensures visual consistency across cards.",
      "The insight carousel is particularly important. Baumer and Gay's research at CHI 2015 showed that reflection doesn't happen from data alone — it needs to be prompted. So the carousel delivers AI-generated insights that actively push users to think about their travel patterns.",
      "The user can see at a glance: yearly budget status, trip count, average overspend, and savings goal. The Active Trip Watchlist tracks price trends, and the currency widget gives exchange rate context. All designed so the user can assess their travel health in one screen.",
    ],
    transition:
      "From the dashboard, users can jump into the Trip Planner to start organising their next trip...",
  },
  {
    id: "planner",
    step: 5,
    title: "Trip Planner",
    headline: "Collection Stage — organise trips by how travellers think",
    stage: "Collection",
    icon: <PlaneTakeoff className="size-5" />,
    bullets: [
      "Trips grouped by temporal status (Active, Upcoming, Past) — matching natural mental models",
      "Progressive Disclosure: simple view first, budget breakdown on demand",
      "New Trip modal keeps interaction lightweight while supporting detailed planning",
    ],
    theories: [
      { theory: "Mental Models", author: "Temporal Grouping" },
      { theory: "Progressive Disclosure", author: "Nielsen Norman Group" },
    ],
    featureLink: {
      label: "Open Trip Planner",
      href: "/informatics/planner",
    },
    speakerNotes: [
      "The Trip Planner is the Collection Stage. We organise trips by their temporal status — Active, Upcoming, and Past — which matches the user's natural mental model. They don't need to learn our system; it mirrors how they already think about trips.",
      "The New Trip modal applies Progressive Disclosure. The initial view is simple — destination, dates. Budget breakdown is available but not forced upfront. This keeps the interaction lightweight while still supporting detailed planning when users want it.",
    ],
    transition:
      "Once a trip is active, users track their expenses in real-time...",
  },
  {
    id: "expenses",
    step: 6,
    title: "Expense Tracker",
    headline: "Collection Stage — making budget status impossible to ignore",
    stage: "Collection",
    icon: <Wallet className="size-5" />,
    bullets: [
      "Category grid instead of dropdown — Recognition Rather Than Recall (Nielsen Heuristic #6)",
      "Budget progress bar always visible — applying Fogg's Behavioral Model",
      "Real-time expense logging keeps data fresh and accurate",
    ],
    theories: [
      {
        theory: "Recognition Rather Than Recall",
        author: "Nielsen Heuristic #6",
      },
      { theory: "Fogg Behavioral Model", author: "Fogg (2009)" },
    ],
    featureLink: {
      label: "Open Expense Tracker",
      href: "/informatics/planner/1/expenses",
    },
    speakerNotes: [
      "The Expense Tracker continues the Collection Stage. Categories use a visual grid instead of a dropdown — this implements Nielsen's Heuristic number 6: Recognition Rather Than Recall. Users see all category options at once; no memorising required.",
      "The budget progress bar is always visible at the top. This applies Fogg's Behavioral Model — by making the budget status immediately visible during expense entry, we increase both the ability and motivation to stay within budget. It's a subtle but effective nudge.",
      "The key design decision here is that budget awareness happens during input, not after. Users see the impact of each expense in real time.",
    ],
    transition:
      "After the trip is over, users move to the Reflection page — this is the core of Travel Pulse...",
  },
  {
    id: "reflection",
    step: 7,
    title: "Trip Reflection",
    headline: "Reflection Stage — the core of Travel Pulse",
    stage: "Reflection",
    icon: <BookOpen className="size-5" />,
    bullets: [
      "Breakdown — Budget vs. Actual chart shows exactly where overspending happened, category by category",
      "Inquiry — Reason tags (Impulse Buy, Hidden Fees, Dining Out) scaffold the question of why it happened",
      "Transformation — 'Note to Future Self' captures the user's own resolution for next time",
      "Maps to Fleck & Fitzpatrick's Reflection Framework — moving users from R0 (no reflection) to R3/R4 (transformative reflection)",
    ],
    theories: [
      {
        theory: "Three Dimensions of Reflection",
        author: "Baumer & Gay (2015)",
      },
      {
        theory: "Reflection Framework R0–R4",
        author: "Fleck & Fitzpatrick (2010)",
      },
    ],
    featureLink: {
      label: "Open Reflection",
      href: "/informatics/reflection",
    },
    speakerNotes: [
      "This is the core of Travel Pulse — the Reflection Stage. It directly addresses the problem statement: helping travellers learn from past experiences.",
      "We apply Baumer and Gay's three dimensions of reflection. First, Breakdown — the Budget vs. Actual chart shows exactly where the user overspent, category by category. Second, Inquiry — pre-defined reason tags like 'Impulse Buy' or 'Dining Out' scaffold the question of why it happened. Third, Transformation — the 'Note to Future Self' captures the user's own resolution for next time.",
      "This also maps to Fleck and Fitzpatrick's Reflection Framework. Most apps stop at R0 — just showing data. We aim for R3 to R4 — transformative reflection — by providing the right prompts at the right time. The user doesn't just see numbers, they understand why and commit to change.",
    ],
    transition:
      "For deeper analysis over time, users can go to Spending Insights...",
  },
  {
    id: "insights",
    step: 8,
    title: "Spending Insights",
    headline: "Analysis Stage — turning numbers into actionable narrative",
    stage: "Analysis",
    icon: <BarChart3 className="size-5" />,
    bullets: [
      "Monthly spending charts use Tufte's small multiples for easy comparison",
      "Category breakdowns show where money goes: Accommodation 35%, Food 25%, Transport 20%, Activities 20%",
      "Behavioural insights use narrative framing — human-readable sentences, not raw numbers",
    ],
    theories: [
      { theory: "Small Multiples", author: "Tufte (1983)" },
      { theory: "Narrative Framing", author: "Behavioural Insights" },
    ],
    featureLink: { label: "Open Insights", href: "/informatics/insights" },
    speakerNotes: [
      "Spending Insights delivers the Analysis Stage. Monthly spending charts use Tufte's small multiples — the same chart format repeated across months, making comparison easy at a glance.",
      "The Behavioural Insights section uses narrative framing — instead of raw numbers, we convert data into human-readable statements. For example, 'You tend to spend more on dining when travelling in Europe.' This makes patterns actionable, not just visible.",
      "The goal is that users leave this screen with concrete understanding of their habits — not just charts, but sentences they can act on.",
    ],
    transition:
      "Of course, tracking personal data requires trust, so let's talk about privacy...",
  },
  {
    id: "settings",
    step: 9,
    title: "Settings & Privacy",
    headline: "User Control & Freedom — trust through data control",
    stage: "User Control",
    icon: <Settings className="size-5" />,
    bullets: [
      "Granular privacy toggles with plain-language descriptions (Value-Centered Design)",
      "Download My Data & Delete Account — GDPR-aligned patterns",
      "Trust is critical for adoption (Technology Acceptance Model)",
      "Implements Nielsen's Heuristic #3: User Control & Freedom",
    ],
    theories: [
      { theory: "Value-Centered Design", author: "Privacy Controls" },
      { theory: "Technology Acceptance Model", author: "Davis (1989)" },
    ],
    featureLink: {
      label: "Open Privacy Settings",
      href: "/informatics/settings/privacy",
    },
    speakerNotes: [
      "The Settings module implements User Control and Freedom — Nielsen's Heuristic number 3. Privacy settings follow Value-Centered Design principles: each toggle has a plain-language description so users understand exactly what they're sharing and with whom.",
      "Download My Data and Delete Account options follow GDPR-aligned patterns. This supports trust, which is critical in the Technology Acceptance Model — users won't adopt a system that tracks their spending data if they don't feel in control of it.",
      "We made a conscious design choice: privacy isn't buried in a sub-menu. It's a first-class screen because trust is a prerequisite for the entire system to work.",
    ],
    transition:
      "Finally, let's talk about how Travel Pulse proactively guides behaviour...",
  },
  {
    id: "nudges",
    step: 10,
    title: "Nudge System",
    headline: "Behavioural nudges that guide without forcing",
    stage: "Behavioural Design",
    icon: <Bell className="size-5" />,
    bullets: [
      "Contextual warnings based on detected spending and planning patterns",
      "Examples: 'You tend to overspend on last-minute bookings' or 'You packed too many activities for a 3-day trip'",
      "Every nudge is always dismissible — no dark patterns",
      "Follows Libertarian Paternalism: guide behaviour, but never force choices",
    ],
    theories: [
      { theory: "Nudge Theory", author: "Thaler & Sunstein (2008)" },
      { theory: "Libertarian Paternalism", author: "Choice Architecture" },
    ],
    speakerNotes: [
      "A key feature is the Behavioural Nudge system, based on Thaler and Sunstein's Nudge Theory from 2008. The system detects patterns in the user's data and delivers contextual warnings at the right moment.",
      "For example, if a user historically overspends on last-minute bookings, they'll see a gentle reminder when creating a new trip close to the departure date. Or if they're packing too many activities into a short trip, they'll see a suggestion to pace themselves.",
      "Crucially, every nudge is dismissible. This follows the principle of Libertarian Paternalism — we guide, but never force. No dark patterns. The user always has full autonomy. This is important because the moment users feel manipulated, they lose trust in the entire system.",
    ],
    transition:
      "Before we wrap up with the design summary, let's discuss some limitations and future directions...",
  },
  {
    id: "limitations",
    step: 11,
    title: "Limitations & Future Works",
    headline:
      "Honest assessment of current prototype gaps and the road ahead",
    icon: <FlaskConical className="size-5" />,
    bullets: [
      "Manual expense entry creates friction — users must log every transaction by hand, increasing cognitive load and reducing compliance over time",
      "localStorage-only persistence — all data is browser-bound with no cloud sync, risking data loss and preventing cross-device access",
      "Mock data limitations — current prototype uses static sample data; real-world patterns would differ significantly",
      "No real-time API integrations — currency rates, flight prices, and hotel costs are simulated rather than live",
      "Key future work: Link payment cards (Visa/Mastercard) for automatic transaction capture with push notifications to the user's device",
      "Additional future works: receipt OCR scanning, multi-currency auto-conversion, shared expense splitting among travel companions, and cloud sync across devices",
    ],
    theories: [
      {
        theory: "Minimal Effort Principle",
        author: "Zipf (1949)",
      },
      {
        theory: "Automation & Trust",
        author: "Parasuraman & Riley (1997)",
      },
    ],
    highlightedData: [
      "Card linking → auto-categorisation → push notification flow",
      "Manual entry friction: avg. 45 seconds per expense vs. 0 seconds with card linking",
      "Potential compliance increase: estimated 3x more expenses captured automatically",
      "Future: OCR receipt scan → instant expense entry with category suggestion",
    ],
    speakerNotes: [
      "No prototype is complete without an honest discussion of its limitations. The biggest friction point right now is manual expense entry. Users have to open the app, select a category, type the amount — every single time. Zipf's Minimal Effort Principle tells us that if a task requires too much effort, people simply won't do it consistently.",
      "We also rely on localStorage, meaning all data lives in the browser. There's no cloud sync, no cross-device access. If someone clears their browser data, everything is gone. In a production system, this would need a proper backend.",
      "Our data is also mock data — real travel spending patterns would be more varied and messy. And our currency rates and price trends are simulated, not pulled from live APIs.",
      "The most impactful future work would be linking a payment card — Visa or Mastercard — directly to Travel Pulse. Every transaction would be automatically captured, categorised using merchant codes, and synced to the active trip's budget. The user would receive a push notification: 'RM 18.90 at Nasi Lemak Antarabangsa — categorised as Food.' No manual entry needed.",
      "Parasuraman and Riley's research on Automation and Trust tells us that for users to accept automated categorisation, the system needs to be transparent about how it works and allow manual overrides. That's why we'd show the auto-category with an option to change it.",
      "Other future directions include OCR receipt scanning for offline purchases, automatic multi-currency conversion, shared expense splitting for group trips, and cloud sync so your data follows you across devices.",
    ],
    transition:
      "Now let's step back and look at how all of this ties together from a design theory perspective...",
  },
];

const theoryMapping = [
  { feature: "Dashboard donut chart", theory: "Data-Ink Ratio (Tufte)" },
  {
    feature: "Metric cards layout",
    theory: "Gestalt Proximity & Similarity",
  },
  {
    feature: "AI insight carousel",
    theory: "System-Driven Reflection (Baumer & Gay)",
  },
  { feature: "Trip temporal grouping", theory: "Mental Models" },
  {
    feature: "Expense category grid",
    theory: "Recognition Rather Than Recall (Nielsen #6)",
  },
  { feature: "Budget progress bar", theory: "Fogg Behavioral Model" },
  {
    feature: "Reflection page",
    theory: "Reflective Informatics (Baumer & Gay)",
  },
  {
    feature: "Privacy toggles",
    theory: "Value-Centered Design, User Control (Nielsen #3)",
  },
  {
    feature: "Behavioural nudges",
    theory: "Nudge Theory (Thaler & Sunstein)",
  },
  {
    feature: "Linked card concept",
    theory: "Minimal Effort Principle (Zipf)",
  },
];

const references = [
  "Li, I., Dey, A. K., & Forlizzi, J. (2010). A stage-based model of personal informatics systems. CHI '10, 557–566. ACM.",
  "Baumer, E. P., & Gay, G. (2015). Reflective informatics: Conceptual dimensions for designing technologies of reflection. CHI 2015, 585–594. ACM.",
  "Fleck, R., & Fitzpatrick, G. (2010). Reflecting on reflection: Framing a design landscape. OZCHI 2010, 216–223. ACM.",
  "Nielsen, J. (1994). 10 usability heuristics for user interface design. Nielsen Norman Group.",
  "Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257–285.",
  "Thaler, R. H., & Sunstein, C. R. (2008). Nudge: Improving decisions about health, wealth, and happiness. Yale University Press.",
  "Fogg, B. J. (2009). A behavior model for persuasive design. Persuasive Technology '09, Article 40. ACM.",
  "Tufte, E. R. (1983). The visual display of quantitative information. Graphics Press.",
  "Norman, D. A. (2013). The design of everyday things: Revised and expanded edition. Basic Books.",
  "Rooksby, J., Rost, M., Morrison, A., & Chalmers, M. (2014). Personal tracking as lived informatics. CHI 2014, 1163–1172. ACM.",
  "Zipf, G. K. (1949). Human behavior and the principle of least effort. Addison-Wesley.",
  "Parasuraman, R., & Riley, V. (1997). Humans and automation: Use, misuse, disuse, abuse. Human Factors, 39(2), 230–253.",
];

// ============================================================================
// Reusable pieces
// ============================================================================

function StageBadge({ stage }: { stage: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-1.5 rounded-full border",
        stageColors[stage] ?? "bg-gray-100 text-gray-700 border-gray-200"
      )}
    >
      <Layers className="size-3.5" />
      {stage} Stage
    </span>
  );
}

function TheoryPill({
  theory,
  author,
}: {
  theory: string;
  author: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-sm">
      <BookOpen className="size-3.5 flex-shrink-0" />
      <span className="font-medium">{theory}</span>
      <span className="text-teal-600 dark:text-teal-400">— {author}</span>
    </div>
  );
}

// ============================================================================
// Section Card
// ============================================================================

function GuideSection({ section }: { section: Section }) {
  const dotColor = section.stage
    ? stageDotColors[section.stage] ?? "bg-violet-500"
    : "bg-violet-500";

  return (
    <div className="relative flex gap-5 md:gap-8">
      {/* Timeline rail */}
      <div className="hidden sm:flex flex-col items-center pt-1">
        <div
          className={cn(
            "size-12 rounded-full flex items-center justify-center text-white text-base font-bold shadow-lg flex-shrink-0",
            dotColor
          )}
        >
          {section.step}
        </div>
        <div className="w-px flex-1 bg-gradient-to-b from-neutral-300 to-transparent dark:from-neutral-700 mt-2" />
      </div>

      {/* Content card */}
      <UnifiedCard gradient hover={false} className="flex-1 mb-0">
        <div className="p-6 md:p-8">
          {/* Mobile step number */}
          <div className="flex items-center gap-3 mb-4 sm:hidden">
            <div
              className={cn(
                "size-8 rounded-full flex items-center justify-center text-white text-sm font-bold",
                dotColor
              )}
            >
              {section.step}
            </div>
            <span className="text-sm font-medium text-neutral-400">
              Step {section.step} of {sections.length}
            </span>
          </div>

          {/* Header */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="size-10 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
              {section.icon}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-100">
              {section.title}
            </h3>
            {section.stage && <StageBadge stage={section.stage} />}
          </div>

          {/* Headline */}
          {section.headline && (
            <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed mb-5">
              {section.headline}
            </p>
          )}

          {/* Bullets — key points */}
          {section.bullets && (
            <ul className="space-y-3 mb-5">
              {section.bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-base text-neutral-700 dark:text-neutral-300"
                >
                  <span className="mt-2 size-2 rounded-full bg-violet-400 flex-shrink-0" />
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {/* Highlighted data callouts */}
          {section.highlightedData && (
            <div className="mb-5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-4">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2.5">
                Data to highlight on screen
              </p>
              <ul className="space-y-1.5">
                {section.highlightedData.map((data, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-amber-800 dark:text-amber-200"
                  >
                    <span className="mt-1.5 size-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    {data}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Linked Card Mockup — only for limitations section */}
          {section.id === "limitations" && (
            <div className="mb-5">
              <LinkedCardMockup />
            </div>
          )}

          {/* Theories */}
          {section.theories && section.theories.length > 0 && (
            <div className="flex flex-wrap gap-2.5 mb-5">
              {section.theories.map((t, i) => (
                <TheoryPill key={i} theory={t.theory} author={t.author} />
              ))}
            </div>
          )}

          {/* Speaker notes — what to say */}
          <div className="rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="size-4 text-violet-600 dark:text-violet-400" />
              <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                What to say
              </p>
            </div>
            <div className="space-y-3">
              {section.speakerNotes.map((note, i) => (
                <p
                  key={i}
                  className="text-base text-violet-900 dark:text-violet-100 leading-relaxed"
                >
                  &ldquo;{note}&rdquo;
                </p>
              ))}
            </div>
          </div>

          {/* Transition */}
          {section.transition && (
            <div className="mt-4 flex items-start gap-2.5 px-4 py-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
              <ArrowRight className="size-4 text-neutral-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm italic text-neutral-500 dark:text-neutral-400">
                <span className="font-medium text-neutral-600 dark:text-neutral-300">
                  Transition:
                </span>{" "}
                &ldquo;{section.transition}&rdquo;
              </p>
            </div>
          )}

          {/* Feature link */}
          {section.featureLink && (
            <Link href={section.featureLink.href}>
              <Button variant="outline" className="gap-2 mt-4">
                <ExternalLink className="size-4" />
                {section.featureLink.label}
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          )}
        </div>
      </UnifiedCard>
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function PresentationPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 relative">
      <AnimatedBackground variant="subtle" />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <div className="text-center mb-14 md:mb-20">
          <div className="inline-flex items-center justify-center size-24 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-xl shadow-violet-500/30 mb-8">
            <Presentation className="size-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
            Travel Pulse
          </h1>
          <p className="text-xl md:text-2xl text-neutral-500 dark:text-neutral-400 mb-5">
            Personal Travel Informatics
          </p>
          <div className="inline-flex items-center gap-3 text-base text-neutral-400 dark:text-neutral-500">
            <span className="px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-medium">
              Group 3
            </span>
            <span>ICT703 MSc HCI</span>
          </div>

          {/* Opening script */}
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20 p-5 text-left">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="size-4 text-violet-600 dark:text-violet-400" />
                <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                  Opening — what to say
                </p>
              </div>
              <p className="text-base text-violet-900 dark:text-violet-100 leading-relaxed mb-3">
                &ldquo;Good morning/afternoon. We&apos;re Group 3, and our
                module is Travel Pulse — the Personal Travel Informatics
                system within the Jalan-Jalan platform.&rdquo;
              </p>
              <p className="text-base text-violet-900 dark:text-violet-100 leading-relaxed">
                &ldquo;Travel Pulse helps travellers track, reflect on, and
                learn from their travel experiences. We&apos;ll walk you
                through the problem we&apos;re solving, the HCI framework we
                used, and each feature with its design rationale.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* ── Guide Sections (timeline) ────────────────────────────── */}
        <div className="space-y-6 md:space-y-8">
          {sections.map((section) => (
            <GuideSection key={section.id} section={section} />
          ))}
        </div>

        {/* ── Design Summary — Norman's 3 Levels ──────────────────── */}
        <div className="mt-14 md:mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-3 text-center">
            Design Summary
          </h2>
          <p className="text-base text-neutral-500 dark:text-neutral-400 text-center mb-8">
            Norman&apos;s Three Levels of Design (2013)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                level: "Visceral",
                desc: "Clean UI, teal colour scheme, smooth animations — the first impression",
                color:
                  "border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20",
              },
              {
                level: "Behavioural",
                desc: "Intuitive interactions, clear feedback, low cognitive load via progressive disclosure",
                color:
                  "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20",
              },
              {
                level: "Reflective",
                desc: "Personal meaning through 'Note to Future Self', learning from past trips",
                color:
                  "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20",
              },
            ].map((item) => (
              <div
                key={item.level}
                className={cn(
                  "rounded-2xl border p-6 text-center",
                  item.color
                )}
              >
                <p className="text-base font-bold text-neutral-700 dark:text-neutral-200 mb-1.5">
                  {item.level}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Speaker notes for Design Summary */}
          <div className="rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20 p-5 mb-10">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="size-4 text-violet-600 dark:text-violet-400" />
              <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                What to say
              </p>
            </div>
            <p className="text-base text-violet-900 dark:text-violet-100 leading-relaxed mb-3">
              &ldquo;Tying it all together with Norman&apos;s three levels of
              design. At the Visceral level — the UI is clean, the teal
              colour scheme is calming, and animations like the donut chart
              are satisfying. This creates a positive first impression.&rdquo;
            </p>
            <p className="text-base text-violet-900 dark:text-violet-100 leading-relaxed mb-3">
              &ldquo;At the Behavioural level — interactions are intuitive,
              feedback is immediate, and cognitive load is kept low through
              progressive disclosure. Users can accomplish tasks without
              friction.&rdquo;
            </p>
            <p className="text-base text-violet-900 dark:text-violet-100 leading-relaxed">
              &ldquo;At the Reflective level — users build personal meaning
              through their reflections and notes to their future selves.
              This is where the system becomes more than a tool — it becomes
              a learning companion.&rdquo;
            </p>
          </div>

          {/* Theory mapping table */}
          <UnifiedCard gradient hover={false}>
            <div className="p-6 md:p-8">
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-5">
                Feature → Theory Mapping
              </h3>
              <div className="rounded-xl border border-black/5 dark:border-white/10 overflow-hidden">
                <div className="grid grid-cols-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900 px-5 py-3">
                  <span>Feature</span>
                  <span>HCI Theory / Principle</span>
                </div>
                {theoryMapping.map((row, i) => (
                  <div
                    key={i}
                    className={cn(
                      "grid grid-cols-2 text-base px-5 py-3 border-t border-black/5 dark:border-white/5",
                      i % 2 === 0
                        ? "bg-white dark:bg-neutral-950"
                        : "bg-neutral-50/50 dark:bg-neutral-900/50"
                    )}
                  >
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {row.feature}
                    </span>
                    <span className="text-teal-700 dark:text-teal-300 font-medium">
                      {row.theory}
                    </span>
                  </div>
                ))}
              </div>

              {/* What to say for the table */}
              <div className="mt-6 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="size-4 text-violet-600 dark:text-violet-400" />
                  <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                    What to say
                  </p>
                </div>
                <p className="text-base text-violet-900 dark:text-violet-100 leading-relaxed">
                  &ldquo;Here&apos;s the complete mapping of every feature
                  to its underlying theory. Every design decision is grounded
                  in established HCI research — from Nielsen&apos;s
                  heuristics to Tufte&apos;s information design principles to
                  Baumer and Gay&apos;s reflective informatics framework. Nothing
                  is arbitrary.&rdquo;
                </p>
              </div>
            </div>
          </UnifiedCard>
        </div>

        {/* ── Conclusion ──────────────────────────────────────────── */}
        <div className="mt-14 md:mt-20 text-center">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-xl shadow-violet-500/30 mb-6">
            <Lightbulb className="size-8 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100 mb-3">
            Conclusion
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 italic text-xl mb-10">
            &ldquo;Turning travel data into travel wisdom&rdquo;
          </p>

          <div className="max-w-xl mx-auto space-y-5 mb-10">
            {[
              "Stage-Based Model provides a complete feedback loop for travel informatics",
              "Theory-informed design transforms complex data into meaningful personal insights",
              "Reflection + Nudges close the gap between knowing and doing",
            ].map((takeaway, i) => (
              <div
                key={i}
                className="flex items-start gap-4 text-left text-base text-neutral-700 dark:text-neutral-300"
              >
                <span className="mt-0.5 flex items-center justify-center size-7 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300 text-sm font-bold flex-shrink-0">
                  {i + 1}
                </span>
                {takeaway}
              </div>
            ))}
          </div>

          {/* Closing script */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20 p-5 text-left">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="size-4 text-violet-600 dark:text-violet-400" />
                <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                  Closing — what to say
                </p>
              </div>
              <p className="text-base text-violet-900 dark:text-violet-100 leading-relaxed mb-3">
                &ldquo;To wrap up — Travel Pulse demonstrates that
                theory-informed design can transform complex travel data into
                meaningful personal insights.&rdquo;
              </p>
              <p className="text-base text-violet-900 dark:text-violet-100 leading-relaxed mb-3">
                &ldquo;The Stage-Based Model gives us a complete lifecycle,
                from preparation through to action. Reflective features and
                behavioural nudges close the gap between knowing something
                and actually changing behaviour.&rdquo;
              </p>
              <p className="text-base text-violet-900 dark:text-violet-100 leading-relaxed">
                &ldquo;Travel Pulse. Learn from every trip. Thank you.&rdquo;
              </p>
            </div>
          </div>

          <p className="text-base font-semibold text-violet-600 dark:text-violet-400">
            Travel Pulse — Learn from every trip.
          </p>
        </div>

        {/* ── References ──────────────────────────────────────────── */}
        <div className="mt-14 md:mt-20">
          <UnifiedCard gradient hover={false}>
            <div className="p-6 md:p-8">
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-5">
                References
              </h3>
              <ol className="space-y-3 list-decimal list-inside mb-8">
                {references.map((ref, i) => (
                  <li
                    key={i}
                    className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"
                  >
                    {ref}
                  </li>
                ))}
              </ol>

              <div className="flex flex-col items-center pt-6 border-t border-black/5 dark:border-white/10">
                <Quote className="size-10 text-violet-300 dark:text-violet-700 mb-4" />
                <p className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-1">
                  Thank You
                </p>
                <p className="text-base text-neutral-500 dark:text-neutral-400">
                  Group 3 — Travel Pulse | ICT703 MSc HCI
                </p>
              </div>
            </div>
          </UnifiedCard>
        </div>
      </main>
    </div>
  );
}
