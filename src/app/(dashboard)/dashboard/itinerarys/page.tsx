"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/shared/navigation";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Clock,
  Plus,
  Sparkles,
  AlertTriangle,
  Sun,
  CloudRain,
  Users,
  DollarSign,
  Car,
  Plane,
  Hotel,
  Utensils,
  Camera,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Info,
  CheckCircle,
  ArrowRight,
  Lightbulb,
} from "lucide-react";

// Types
interface Activity {
  id: string;
  time: string;
  title: string;
  location: string;
  duration: string;
  type: "attraction" | "food" | "transport" | "accommodation" | "activity";
  notes?: string;
  contextAlert?: string;
  cost?: number;
}

interface Day {
  id: string;
  date: string;
  activities: Activity[];
  weather?: {
    condition: string;
    temp: string;
    precipitation: string;
  };
  events?: string[];
}

// Mock data for a sample trip
const sampleTrip = {
  destination: "Langkawi",
  startDate: "2026-02-15",
  endDate: "2026-02-18",
  travelers: 2,
  budget: 2500,
  days: [
    {
      id: "day-1",
      date: "2026-02-15",
      weather: { condition: "sunny", temp: "28°C", precipitation: "10%" },
      events: ["Eagle Festival Opening Ceremony"],
      activities: [
        {
          id: "act-1",
          time: "08:00",
          title: "Arrival at Langkawi International Airport",
          location: "LGK Airport",
          duration: "1h",
          type: "transport" as const,
          notes: "Flight MH1442 from KLIA",
          cost: 0,
        },
        {
          id: "act-2",
          time: "10:00",
          title: "Check-in at The Datai Langkawi",
          location: "Jalan Teluk Datai",
          duration: "1h",
          type: "accommodation" as const,
          cost: 850,
        },
        {
          id: "act-3",
          time: "12:00",
          title: "Lunch at Naam Thai Restaurant",
          location: "Pantai Cenang",
          duration: "1.5h",
          type: "food" as const,
          contextAlert: "Popular spot - consider reservation",
          cost: 80,
        },
        {
          id: "act-4",
          time: "15:00",
          title: "Langkawi Sky Bridge",
          location: "Oriental Village",
          duration: "3h",
          type: "attraction" as const,
          contextAlert: "Best visited before 4 PM to avoid crowds",
          cost: 65,
        },
        {
          id: "act-5",
          time: "19:00",
          title: "Sunset dinner at beach",
          location: "Pantai Cenang Beach",
          duration: "2h",
          type: "food" as const,
          cost: 120,
        },
      ],
    },
    {
      id: "day-2",
      date: "2026-02-16",
      weather: { condition: "partly-cloudy", temp: "27°C", precipitation: "30%" },
      events: ["Eagle Festival - Main Event"],
      activities: [
        {
          id: "act-6",
          time: "07:00",
          title: "Breakfast at hotel",
          location: "The Datai Langkawi",
          duration: "1h",
          type: "food" as const,
          cost: 0,
        },
        {
          id: "act-7",
          time: "09:00",
          title: "Eagle Festival Main Event",
          location: "Eagle Square (Dataran Lang)",
          duration: "3h",
          type: "activity" as const,
          contextAlert: "Special event - arrive early for best spots!",
          cost: 0,
        },
        {
          id: "act-8",
          time: "13:00",
          title: "Lunch at local hawker",
          location: "Kuah Town",
          duration: "1.5h",
          type: "food" as const,
          cost: 40,
        },
        {
          id: "act-9",
          time: "15:00",
          title: "Kilim Karst Geoforest Park",
          location: "Kilim",
          duration: "4h",
          type: "attraction" as const,
          notes: "Mangrove tour by boat",
          cost: 150,
        },
      ],
    },
    {
      id: "day-3",
      date: "2026-02-17",
      weather: { condition: "sunny", temp: "29°C", precipitation: "5%" },
      events: [],
      activities: [
        {
          id: "act-10",
          time: "08:00",
          title: "Island hopping tour",
          location: "Telaga Harbour",
          duration: "5h",
          type: "activity" as const,
          notes: "Visit Pulau Dayang Bunting, Pulau Singa Besar",
          cost: 180,
        },
        {
          id: "act-11",
          time: "14:00",
          title: "Late lunch at Scarborough Fish & Chips",
          location: "Pantai Cenang",
          duration: "1.5h",
          type: "food" as const,
          cost: 90,
        },
        {
          id: "act-12",
          time: "16:00",
          title: "Duty-free shopping",
          location: "Langkawi Fair Shopping Mall",
          duration: "3h",
          type: "activity" as const,
          cost: 300,
        },
        {
          id: "act-13",
          time: "20:00",
          title: "Night market",
          location: "Temonyong Night Market",
          duration: "2h",
          type: "food" as const,
          contextAlert: "Wednesday night market - perfect timing!",
          cost: 50,
        },
      ],
    },
    {
      id: "day-4",
      date: "2026-02-18",
      weather: { condition: "sunny", temp: "28°C", precipitation: "15%" },
      events: [],
      activities: [
        {
          id: "act-14",
          time: "07:00",
          title: "Sunrise at Tanjung Rhu Beach",
          location: "Tanjung Rhu",
          duration: "2h",
          type: "attraction" as const,
          cost: 0,
        },
        {
          id: "act-15",
          time: "10:00",
          title: "Hotel check-out",
          location: "The Datai Langkawi",
          duration: "1h",
          type: "accommodation" as const,
          cost: 0,
        },
        {
          id: "act-16",
          time: "12:00",
          title: "Departure from Langkawi Airport",
          location: "LGK Airport",
          duration: "1h",
          type: "transport" as const,
          notes: "Flight MH1445 to KLIA",
          cost: 0,
        },
      ],
    },
  ] as Day[],
};

const activityIcons: Record<string, React.ElementType> = {
  attraction: Camera,
  food: Utensils,
  transport: Car,
  accommodation: Hotel,
  activity: Sparkles,
};

const activityColors: Record<string, string> = {
  attraction: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  food: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
  transport: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  accommodation: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  activity: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
};

function ItineraryContent() {
  const searchParams = useSearchParams();
  const destinationParam = searchParams.get("destination");

  const [trip, setTrip] = React.useState(sampleTrip);
  const [expandedDays, setExpandedDays] = React.useState<string[]>(["day-1", "day-2"]);
  const [showAIAssistant, setShowAIAssistant] = React.useState(false);

  const toggleDay = (dayId: string) => {
    setExpandedDays((prev) =>
      prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]
    );
  };

  const totalCost = trip.days.reduce(
    (sum, day) => sum + day.activities.reduce((daySum, act) => daySum + (act.cost || 0), 0),
    0
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const WeatherIcon = ({ condition }: { condition: string }) => {
    if (condition === "sunny") return <Sun className="size-4 text-amber-500" />;
    if (condition === "partly-cloudy") return <Sun className="size-4 text-amber-400" />;
    return <CloudRain className="size-4 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Trip Header */}
        <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20 py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Link href="/search" className="hover:text-foreground transition-colors">
                    Search
                  </Link>
                  <span>/</span>
                  <span>Trip Planning</span>
                </div>
                <header className="flex items-center gap-7 py-2">
                  <div className="shrink-0 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-4 transition-transform duration-300 group-hover:scale-110">
                    <MapPin className="size-8 text-white" strokeWidth={2} />
                  </div>
                  <h1 className="text-4xl font-bold text-slate-900">{destinationParam || trip.destination} Trip</h1>
                </header>
                <p className="text-muted-foreground mt-1">
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)} · {trip.days.length} days
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-card rounded-lg border">
                  <Users className="size-4 text-muted-foreground" />
                  <span className="font-medium">{trip.travelers}</span>
                  <span className="text-muted-foreground text-sm">travelers</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-card rounded-lg border">
                  <DollarSign className="size-4 text-muted-foreground" />
                  <span className="font-medium">RM {totalCost.toLocaleString()}</span>
                  <span className="text-muted-foreground text-sm">/ RM {trip.budget.toLocaleString()}</span>
                </div>
                <Button
                  onClick={() => setShowAIAssistant(!showAIAssistant)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                >
                  <Sparkles className="size-4 mr-2" />
                  AI Assistant
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Itinerary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Context Alerts */}
              <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="size-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-1">
                        Context-Aware Insights
                      </h4>
                      <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                        <li>• <strong>Eagle Festival</strong> on Feb 16 - Your itinerary is optimized around this event!</li>
                        <li>• <strong>Weather:</strong> Mostly sunny with occasional clouds. Perfect beach weather!</li>
                        <li>• <strong>Traffic Alert:</strong> Expect increased traffic around Kuah Town on Feb 16.</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Days */}
              {trip.days.map((day, dayIndex) => {
                const isExpanded = expandedDays.includes(day.id);
                const dayNumber = dayIndex + 1;
                const dayCost = day.activities.reduce((sum, act) => sum + (act.cost || 0), 0);

                return (
                  <Card key={day.id} className="overflow-hidden">
                    <CardHeader
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleDay(day.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                            {dayNumber}
                          </div>
                          <div>
                            <CardTitle className="text-lg">Day {dayNumber}</CardTitle>
                            <CardDescription className="flex items-center gap-3">
                              <span>{formatDate(day.date)}</span>
                              {day.weather && (
                                <span className="flex items-center gap-1">
                                  <WeatherIcon condition={day.weather.condition} />
                                  {day.weather.temp}
                                </span>
                              )}
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                RM {dayCost.toLocaleString()}
                              </span>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {day.events && day.events.length > 0 && (
                            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full flex items-center gap-1">
                              <Sparkles className="size-3" />
                              Event
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="size-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="size-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      {/* Events Banner */}
                      {day.events && day.events.length > 0 && (
                        <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <p className="text-sm text-amber-700 dark:text-amber-300">
                            <Sparkles className="size-3 inline mr-1" />
                            <strong>Local Event:</strong> {day.events.join(", ")}
                          </p>
                        </div>
                      )}
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {day.activities.map((activity, actIndex) => {
                            const Icon = activityIcons[activity.type] || Sparkles;
                            const colorClass = activityColors[activity.type] || activityColors.activity;

                            return (
                              <div
                                key={activity.id}
                                className="flex gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow group"
                              >
                                {/* Time & Line */}
                                <div className="flex flex-col items-center">
                                  <span className="text-sm font-medium text-muted-foreground">
                                    {activity.time}
                                  </span>
                                  {actIndex < day.activities.length - 1 && (
                                    <div className="flex-1 w-px bg-border mt-2" />
                                  )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <div className={`p-2 rounded-lg ${colorClass}`}>
                                        <Icon className="size-4" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium">{activity.title}</h4>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                          <MapPin className="size-3" />
                                          {activity.location}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button variant="ghost" size="icon-sm">
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon-sm" className="text-destructive">
                                        <Trash2 className="size-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="size-3" />
                                      {activity.duration}
                                    </span>
                                    {activity.cost !== undefined && activity.cost > 0 && (
                                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                        <DollarSign className="size-3" />
                                        RM {activity.cost}
                                      </span>
                                    )}
                                  </div>

                                  {activity.notes && (
                                    <p className="text-sm text-muted-foreground mt-2 flex items-start gap-1">
                                      <Info className="size-3 mt-0.5 shrink-0" />
                                      {activity.notes}
                                    </p>
                                  )}

                                  {activity.contextAlert && (
                                    <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg">
                                      <p className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-1">
                                        <AlertTriangle className="size-3 mt-0.5 shrink-0" />
                                        {activity.contextAlert}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* Add Activity Button */}
                          <Button variant="outline" className="w-full" size="sm">
                            <Plus className="size-4 mr-2" />
                            Add Activity
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}

              {/* Add Day Button */}
              <Button variant="outline" className="w-full">
                <Plus className="size-4 mr-2" />
                Add Another Day
              </Button>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Assistant Panel */}
              {showAIAssistant && (
                <Card className="border-emerald-200 dark:border-emerald-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="size-5 text-emerald-600" />
                      AI Trip Assistant
                    </CardTitle>
                    <CardDescription>
                      Get context-aware suggestions for your trip
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">
                        &quot;Based on your itinerary, I notice you have free time on Day 3 afternoon. 
                        Would you like me to suggest activities that complement your existing plans?&quot;
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Quick suggestions:</p>
                      <Button variant="outline" size="sm" className="w-full justify-start text-left">
                        <Lightbulb className="size-4 mr-2 text-amber-500" />
                        Optimize for less crowds
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start text-left">
                        <DollarSign className="size-4 mr-2 text-emerald-500" />
                        Budget-friendly alternatives
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start text-left">
                        <Calendar className="size-4 mr-2 text-blue-500" />
                        Check local events
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Input placeholder="Ask anything about your trip..." className="flex-1" />
                      <Button size="icon" className="bg-emerald-600 hover:bg-emerald-700">
                        <MessageCircle className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Trip Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Trip Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Destination</span>
                      <span className="font-medium">{trip.destination}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{trip.days.length} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Travelers</span>
                      <span className="font-medium">{trip.travelers} people</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Activities</span>
                      <span className="font-medium">
                        {trip.days.reduce((sum, day) => sum + day.activities.length, 0)} planned
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">Estimated Cost</span>
                      <span className="font-bold text-lg">RM {totalCost.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((totalCost / trip.budget) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((totalCost / trip.budget) * 100).toFixed(0)}% of RM {trip.budget.toLocaleString()} budget
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Weather Forecast */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sun className="size-5 text-amber-500" />
                    Weather Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trip.days.map((day, index) => (
                      <div key={day.id} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Day {index + 1}</span>
                        {day.weather && (
                          <div className="flex items-center gap-2">
                            <WeatherIcon condition={day.weather.condition} />
                            <span className="text-sm font-medium">{day.weather.temp}</span>
                            <span className="text-xs text-muted-foreground">
                              {day.weather.precipitation} rain
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Plane className="size-4 mr-2" />
                    Add flights
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Hotel className="size-4 mr-2" />
                    Add accommodation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Car className="size-4 mr-2" />
                    Add transportation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="size-4 mr-2" />
                    Invite travelers
                  </Button>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">
                    <CheckCircle className="size-4 mr-2" />
                    Save Itinerary
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ItineraryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <ItineraryContent />
    </Suspense>
  );
}
