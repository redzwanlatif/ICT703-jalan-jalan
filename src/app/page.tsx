import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/shared/navigation";
import { Footer } from "@/components/shared/footer";
import { JourneySelector } from "@/components/shared/journey-selector";
import { EventCard } from "@/components/community/event-card";
import { StoryCard } from "@/components/community/story-card";
import {
  Map,
  Users,
  BarChart3,
  MessageCircle,
  Sparkles,
  Globe,
  Compass,
  ArrowRight,
  CheckCircle2,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Trip Card component
function TripCard({ title, dates, status }: { title: string; dates: string; status: "Active" | "Upcoming" }) {
  return (
    <UnifiedCard className="group p-0">
      <div className="p-6 space-y-1">
        <h3 className="font-semibold text-neutral-800 dark:text-neutral-100">{title}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{dates}</p>
      </div>
      <div className="px-6 pb-6 flex items-center justify-between">
        <Badge
          variant="outline"
          className={cn(
            "rounded-lg",
            status === "Active"
              ? "border-emerald-500/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
              : "border-orange-500/50 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
          )}
        >
          {status}
        </Badge>
        <span className="font-semibold text-neutral-600 dark:text-neutral-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          View More
        </span>
      </div>
    </UnifiedCard>
  );
}

import {
  UnifiedCard,
  AnimatedBackground,
} from "@/components/shared/page-layout";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "AI Planning Assistant",
    description: "Chat with our AI to plan smarter trips with context-aware recommendations for local events, traffic, and cultural holidays.",
    icon: MessageCircle,
    group: "Group 1",
    href: "/chat",
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Live Travel Dashboard",
    description: "Real-time dashboard with weather, crowd levels, trending spots, and booking status for your destination.",
    icon: Map,
    group: "Group 2",
    href: "/dashboard",
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Personal Travel Hub",
    description: "Track your travel goals, budgets, expenses and reflect on past trips with personalized insights.",
    icon: BarChart3,
    group: "Group 3",
    href: "/informatics/dashboard",
    color: "from-violet-500 to-purple-600",
  },
  {
    title: "Community & Stories",
    description: "Discover local tips, community stories, and authentic experiences from verified travelers.",
    icon: Users,
    group: "Group 4",
    href: "/community",
    color: "from-orange-500 to-amber-600",
  },
  {
    title: "Smart Trip Planner",
    description: "AI-powered trip planner with crowd predictions, weather alerts, and budget optimization.",
    icon: Sparkles,
    group: "Group 5",
    href: "/predictions",
    color: "from-rose-500 to-pink-600",
  },
];

const popularDestinations = [
  {
    name: "Langkawi",
    country: "Malaysia",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop",
    rating: 4.8,
  },
  {
    name: "Penang",
    country: "Malaysia",
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&h=300&fit=crop",
    rating: 4.7,
  },
  {
    name: "Cameron Highlands",
    country: "Malaysia",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop",
    rating: 4.6,
  },
];

const benefits = [
  "AI-powered context-aware recommendations",
  "Real-time event and holiday integration",
  "Group travel coordination tools",
  "Budget tracking and optimization",
  "Community-verified local tips",
  "Predictive crowd and availability insights",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        {/* My Trip Section */}
        <section className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
              My Trip
            </h2>
            <div className="relative flex items-center justify-center max-w-6xl mx-auto px-4">
              <p className="text-muted-foreground text-center max-w-2xl">
                Manage your active and upcoming travel itineraries
              </p>
              <Link
                href="/predictions"
                className="absolute right-0 text-base font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors hidden md:block"
              >
                Create New Trip →
              </Link>
            </div>
            <Link
              href="/predictions"
              className="md:hidden inline-block mt-4 text-base font-semibold text-orange-600 dark:text-orange-400"
            >
              Create New Trip →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <TripCard
              title="Malacca River Walk"
              dates="25th February - 26th February 2026"
              status="Active"
            />
            <TripCard
              title="Baba Nyonya Heritage Museum"
              dates="25th March - 26th March 2026"
              status="Upcoming"
            />
            <TripCard
              title="Menara Taming Sari"
              dates="25th April - 26th April 2026"
              status="Upcoming"
            />
          </div>
        </section>


        {/* Upcoming Events Section */}
        <section className="container mx-auto px-4 py-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
            <div className="relative flex items-center justify-center max-w-6xl mx-auto px-4">
              <p className="text-muted-foreground text-center max-w-2xl">
                Discover exciting events and activities happening across Malaysia
              </p>
              <Link
                href="/community/events"
                className="absolute right-0 text-base font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors hidden md:block"
              >
                View More →
              </Link>
            </div>
            <Link
              href="/community/events"
              className="md:hidden inline-block mt-4 text-base font-semibold text-orange-600 dark:text-orange-400"
            >
              View More →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <EventCard
              title="Jom Cuti Sekolah 2026"
              subtitle="School holiday travel deals and family activities"
              date="12 - 15 January 2026"
              location="Ayer Keroh, Melaka"
              type="Promotion Event"
              badges={["Family-friendly", "School Holiday"]}
              image="event-01.png"
              imageGradient="bg-gradient-to-br from-yellow-200 to-orange-300"
            />
            <EventCard
              title="Cuti Cuti Muslim-Friendly Fair"
              subtitle="Muslim-friendly travel packages and experiences"
              date="18 - 20 January 2026"
              location="Ayer Molek, Melaka"
              type="Travel Fair"
              badges={["Muslim-friendly", "Travel Deals"]}
              image="event-02.png"
              imageGradient="bg-gradient-to-br from-green-200 to-teal-300"
            />
            <EventCard
              title="Play Your Way to Joy Festival"
              subtitle="Interactive activities and attractions for all ages"
              date="5 - 7 February 2026"
              location="Pantai Klebang, Melaka"
              type="Festival"
              badges={["Family-friendly", "Popular Event"]}
              image="event-03.png"
              imageGradient="bg-gradient-to-br from-purple-200 to-pink-300"
            />
          </div>
        </section>

        {/* Community Story Section */}
        <section className="bg-muted/30 py-5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Community Story</h2>
              <div className="relative flex items-center justify-center max-w-6xl mx-auto px-4">
                <p className="text-muted-foreground text-center max-w-2xl">
                  Real experiences and authentic stories from verified travelers
                </p>
                <Link
                  href="/community/stories"
                  className="absolute right-0 text-base font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors hidden md:block"
                >
                  View More →
                </Link>
              </div>
              <Link
                href="/community/stories"
                className="md:hidden inline-block mt-4 text-base font-semibold text-orange-600 dark:text-orange-400"
              >
                View More →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <StoryCard
                id={1}
                location="Melaka"
                place="Malacca Sultanate Museum"
                author="Imran Rosli"
                authorBadge="Verified Local"
                tags={["#LocalTourist", "#Melaka"]}
                bgGradient="bg-gradient-to-br from-blue-400 to-purple-500"
                image="story-01.webp"
              />
              <StoryCard
                id={2}
                location="Melaka"
                place="Muzium Samudera"
                author="Farah Shazwanie"
                authorBadge="Frequent Traveller"
                tags={["#Melaka"]}
                bgGradient="bg-gradient-to-br from-cyan-400 to-blue-500"
                image="story-02.webp"
              />
              <StoryCard
                id={3}
                location="Melaka"
                place="Kampung Morten"
                author="Hafiz Suhaimi"
                authorBadge="Verified Local"
                tags={["#Melaka", "#Local", "#Tourist"]}
                bgGradient="bg-gradient-to-br from-orange-400 to-red-500"
                image="story-03.webp"
              />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjAyIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

          <div className="relative container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
                <Sparkles className="size-4" />
                Smart Holiday Planning Platform
              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent animate-fade-in">
                Plan Smarter, Travel Better
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in">
                A cognitive travel planning platform that helps you make informed,
                context-aware decisions for your perfect holiday retreat.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                <Link href="/predictions">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg shadow-emerald-500/25"
                  >
                    <Sparkles className="size-5 mr-2" />
                    Start Planning
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <MessageCircle className="size-5 mr-2" />
                    Talk to AI
                  </Button>
                </Link>
              </div>

              {/* Journey Selector */}
              <div className="mt-12 max-w-2xl mx-auto animate-fade-in">
                <JourneySelector />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover all the tools and features designed to make your travel planning experience seamless and intelligent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} href={feature.href}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon className="size-6 text-white" />
                      </div>
                      <CardTitle className="flex items-center justify-between">
                        {feature.title}
                        <ArrowRight className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </CardTitle>
                      <CardDescription className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        {feature.group}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to plan your perfect trip with context-aware intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
                  <Search className="size-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-emerald-600 mb-2">01</div>
                <h3 className="font-semibold text-lg mb-2">Search & Discover</h3>
                <p className="text-muted-foreground text-sm">
                  Explore destinations with AI-powered search that considers your preferences and travel context.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
                  <Compass className="size-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">02</div>
                <h3 className="font-semibold text-lg mb-2">Plan Your Trip</h3>
                <p className="text-muted-foreground text-sm">
                  Create detailed itineraries with smart scheduling that avoids crowds and optimizes your time.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/25">
                  <Globe className="size-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-violet-600 mb-2">03</div>
                <h3 className="font-semibold text-lg mb-2">Travel & Share</h3>
                <p className="text-muted-foreground text-sm">
                  Enjoy your trip with real-time updates and share your experiences with the community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Everything You Need for Smart Travel Planning
              </h2>
              <p className="text-muted-foreground mb-8">
                Our platform combines cutting-edge AI with human-centered design to deliver
                a travel planning experience that&apos;s intuitive, intelligent, and incredibly powerful.
              </p>

              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link href="/predictions">
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0">
                    Get Started
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl blur-3xl" />
              <Card className="relative">
                <CardHeader className="text-center border-b">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <MessageCircle className="size-5 text-emerald-600" />
                    AI Travel Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg p-4 text-sm">
                      <p className="text-muted-foreground">
                        &quot;I want to visit Langkawi next month. What should I know about local events?&quot;
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-lg p-4 text-sm border border-emerald-100 dark:border-emerald-900">
                      <p>
                        <strong className="text-emerald-700 dark:text-emerald-400">AI Assistant:</strong>{" "}
                        Great choice! In January, Langkawi hosts the annual Eagle Festival.
                        I&apos;d recommend visiting the Sky Bridge early morning (before 10 AM) to avoid crowds.
                        The weather forecast shows mostly sunny days with occasional evening showers.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Plan Your Perfect Trip?
            </h2>
            <p className="text-emerald-100 max-w-2xl mx-auto mb-8 text-lg">
              Join thousands of travelers who use Jalan-Jalan to create memorable,
              well-planned holiday experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/predictions">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-emerald-50"
                >
                  Start Planning Now
                  <ArrowRight className="size-5 ml-2" />
                </Button>
              </Link>
              <Link href="/chat">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-white/10"
                >
                  Talk to AI Assistant
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}