"use client"

import * as React from "react"
import { Navigation } from "@/components/shared/navigation"
import TabBar from "@/components/ui/TabBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ItineraryTimeline } from '../../../components/dashboard/cards/itinerary-timeline';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MapPin,
  Wallet,
  CalendarDays,
  Clock,
  AlertCircle,
  Lightbulb,
  X,
  Plus,
  ChevronRight,
} from "lucide-react"

import {
  initialMembers,
  initialDestinations,
} from "@/data/seed"

type ConflictIssue = {
  id: string
  member: string
  description: string
  severity: "high" | "medium" | "low"
}

type Destination = {
  id: string
  name: string
  description: string
  cost: number
  duration: string
  season: string
  interests: string[]
  groupMatch: number
  individualMatches: {
    name: string
    percentage: number
  }[]
  note?: string
}

// Function to calculate group match percentage
const calculateGroupMatch = (destination: Destination, members: typeof initialMembers): number => {
  let totalScore = 0
  const maxScore = members.length * 3 // 3 criteria: budget, season, interests

  members.forEach(member => {
    let memberScore = 0

    // Budget match
    if (destination.cost <= member.budgetMax) {
      memberScore += 1
    }

    // Season match
    if (member.seasons.includes(destination.season)) {
      memberScore += 1
    }

    // Interest match (at least one common interest)
    const commonInterests = destination.interests.filter(interest =>
      member.interests.includes(interest)
    )
    if (commonInterests.length > 0) {
      memberScore += 1
    }

    totalScore += memberScore
  })

  return Math.round((totalScore / maxScore) * 100)
}

// Function to calculate individual match percentage
const calculateIndividualMatch = (destination: Destination, member: typeof initialMembers[0]): number => {
  let score = 0;
  const maxScore = 3; // budget, season, interests

  // Budget match
  if (destination.cost <= member.budgetMax) {
    score += 1;
  }

  // Season match
  if (member.seasons.includes(destination.season)) {
    score += 1;
  }

  // Interest match
  const commonInterests = destination.interests.filter(interest =>
    member.interests.includes(interest)
  );
  if (commonInterests.length > 0) {
    score += 1;
  }

  return Math.round((score / maxScore) * 100);
};


export default function ItineraryPage() {
  const [selectedDay, setSelectedDay] = React.useState("1")
  const [conflictFilter, setConflictFilter] = React.useState<string>("all")

  const [currentSelectedDestinations, setCurrentSelectedDestinations] = React.useState<Destination[]>(() => {
    const selected = initialDestinations.slice(0, 2).map(dest => {
      const destinationForCalc = {
        ...dest,
        cost: dest.cost,
        interests: dest.category,
        groupMatch: 0,
        individualMatches: [],
        note: '',
        duration: `${dest.duration} days`,
        season: dest.season,
        id: dest.id,
        name: dest.name,
        description: dest.description
      };
      return {
        ...destinationForCalc,
        groupMatch: calculateGroupMatch(destinationForCalc, initialMembers),
        individualMatches: initialMembers.map(member => ({
          name: member.name.split(' ')[0],
          percentage: calculateIndividualMatch(destinationForCalc, member)
        })),
      }
    });
    return selected;
  });

  const [currentAvailableDestinations, setCurrentAvailableDestinations] = React.useState<Destination[]>(() => {
    const available = initialDestinations.slice(2, 4).map(dest => {
      const destinationForCalc = {
        ...dest,
        cost: dest.cost,
        interests: dest.category,
        groupMatch: 0,
        individualMatches: [],
        note: '',
        duration: `${dest.duration} days`,
        season: dest.season,
        id: dest.id,
        name: dest.name,
        description: dest.description
      };
      return {
        ...destinationForCalc,
        groupMatch: calculateGroupMatch(destinationForCalc, initialMembers),
        individualMatches: initialMembers.map(member => ({
          name: member.name.split(' ')[0],
          percentage: calculateIndividualMatch(destinationForCalc, member)
        })),
      }
    });
    return available;
  });

  const totalCost = currentSelectedDestinations.reduce((acc, dest) => acc + dest.cost, 0);
  const memberCount = 4; // Assuming a fixed member count for now

  const handleSelectDestination = (destination: Destination) => {
    setCurrentAvailableDestinations(prev => prev.filter(d => d.id !== destination.id));
    setCurrentSelectedDestinations(prev => [...prev, destination]);
  };

  const handleDeselectDestination = (destination: Destination) => {
    setCurrentSelectedDestinations(prev => prev.filter(d => d.id !== destination.id));
    setCurrentAvailableDestinations(prev => [...prev, destination]);
  };

  const getSeverityColor = (severity: ConflictIssue["severity"]) => {
    switch (severity) {
      case "high":
        return "bg-red-50 border-red-200 text-red-900"
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-900"
      case "low":
        return "bg-blue-50 border-blue-200 text-blue-900"
    }
  }

  const getSeverityDotColor = (severity: ConflictIssue["severity"]) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-400"
      case "low":
        return "bg-blue-500"
    }
  }

  const getMatchColor = (percentage: number) => {
    if (percentage > 60) return "bg-green-100 text-green-800"
    if (percentage >= 50) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const day1Activities = [
    "Morning: Arrive in Melaka, check into hotel.",
    "Afternoon: Explore A Famosa fortress and St. Paul's Hill.",
    "Evening: Dinner and shopping at Jonker Street Night Market.",
  ];

  const conflictIssues: ConflictIssue[] = [
    {
      id: "1",
      member: "Wong",
      description: "Budget for shopping is too low.",
      severity: "high",
    },
    {
      id: "2",
      member: "Nurul",
      description: "Accommodation budget exceeds limit.",
      severity: "high",
    },
    {
      id: "3",
      member: "Ahmad",
      description: "Food and dining budget is insufficient.",
      severity: "high",
    },
    {
      id: "4",
      member: "Priya",
      description: "Transportation costs are too high.",
      severity: "high",
    },
    {
      id: "5",
      member: "Ahmad",
      description: "Not interested in historical sites.",
      severity: "medium",
    },
    {
      id: "6",
      member: "Wong",
      description: "Prefers adventure activities over cultural tours.",
      severity: "medium",
    },
    {
      id: "7",
      member: "Priya",
      description: "Prefers different travel season.",
      severity: "low",
    },
  ];

  const filteredConflicts = conflictIssues.filter((c) => {
    if (conflictFilter === "all") return true
    return c.severity === conflictFilter
  })

  const conflictCounts = {
    high: conflictIssues.filter((c) => c.severity === "high").length,
    medium: conflictIssues.filter((c) => c.severity === "medium").length,
    low: conflictIssues.filter((c) => c.severity === "low").length,
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #f5f3ff 0%, #F1F5F9 20%)' }}>
      <div className="sticky top-0 z-20">
        <Navigation />
        <TabBar totalCost={totalCost} memberCount={memberCount} />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-2">

        <header className="flex items-center gap-7 pt-13 mb-8">
          <div className="shrink-0 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-4 transition-transform duration-300 group-hover:scale-110">
            <MapPin className="size-8 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">My Itinerary</h1>
        </header>


        <div className="flex flex-col gap-6">
          {/* Full Trip Itinerary */}
          <Card className="border-[#AD46FF] bg-white">
            <CardHeader>
              <div className="flex flex-col gap-1">
                <CardTitle className="text-xl font-bold">
                  Full Trip Itinerary
                </CardTitle>
                <p className="text-sm text-slate-500">3 days • {currentSelectedDestinations.length} destinations</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Day Tabs */}
                <Tabs
                  value={selectedDay}
                  onValueChange={setSelectedDay}
                  className="w-full lg:w-auto"
                >
                  <TabsList className="bg-slate-100 h-auto p-1 flex-col lg:flex-col">
                    <TabsTrigger
                      value="1"
                      className="w-full lg:w-auto data-[state=active]:bg-violet-500 data-[state=active]:text-white"
                    >
                      Day 1
                    </TabsTrigger>
                    <TabsTrigger
                      value="2"
                      className="w-full lg:w-auto data-[state=active]:bg-violet-500 data-[state=active]:text-white"
                    >
                      Day 2
                    </TabsTrigger>
                    <TabsTrigger
                      value="3"
                      className="w-full lg:w-auto data-[state=active]:bg-violet-500 data-[state=active]:text-white"
                    >
                      Day 3
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Day Content */}
                <div className="flex-1 border-l-4 border-[#AD46FF] bg-linear-to-r from-violet-50 to-pink-50 rounded-r-xl p-6">
                  <Tabs value={selectedDay} onValueChange={setSelectedDay}>
                    <TabsContent value="1" className="mt-0">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="size-5 text-violet-700" />
                          <h3 className="text-lg font-bold text-slate-900">
                            Jonker Street & A Famosa
                          </h3>
                        </div>
                        <p className="text-sm text-slate-600">
                          Explore UNESCO World Heritage sites including A Famosa
                          fortress, St. Paul's Hill, and vibrant Jonker Street
                          with its night market, antiques, and authentic Peranakan
                          cuisine
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Wallet className="size-4 text-slate-500" />
                            RM600
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="size-4 text-slate-500" />
                            1 day
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="size-4 text-slate-500" />
                            CNY
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600">
                            Group Match:
                          </span>
                          <div className="flex-1 max-w-xs">
                            <Progress
                              value={47}
                              className="h-2 bg-slate-200 **:data-[slot=progress-indicator]:bg-violet-500"
                            />
                          </div>
                          <span className="text-xs font-bold text-violet-700">
                            47%
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {["Culture", "Food", "Shopping"].map((interest) => (
                            <Badge
                              key={interest}
                              className="bg-violet-100 text-violet-800 border-0 px-2 py-1 text-xs"
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>

                        <div className="border-t border-violet-200 pt-4 mt-4">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="size-4 text-violet-700" />
                            <h4 className="text-sm font-bold text-slate-900">
                              Day 1 Activities:
                            </h4>
                          </div>
                          <ul className="space-y-2">
                            {day1Activities.map((activity, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3 text-sm text-slate-700"
                              >
                                <span className="text-violet-700 font-bold mt-0.5">
                                  •
                                </span>
                                <span>{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="2" className="mt-0">
                      <p className="text-sm text-slate-600">
                        Day 2 itinerary content...
                      </p>
                    </TabsContent>
                    <TabsContent value="3" className="mt-0">
                      <p className="text-sm text-slate-600">
                        Day 3 itinerary content...
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conflict Analysis & Suggestions */}
          <Card className="border-[#AD46FF] bg-white">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl font-bold">
                Conflict Analysis & Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="space-y-6">
                {/* Conflict Filter Dropdown */}
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-semibold text-slate-800">Conflict Level:</span>
                  <span className="inline-flex items-center gap-1 text-sm"><span className="size-3 rounded-full bg-red-500 inline-block" /> High</span>
                  <span className="inline-flex items-center gap-1 text-sm"><span className="size-3 rounded-full bg-yellow-400 inline-block" /> Medium</span>
                  <span className="inline-flex items-center gap-1 text-sm"><span className="size-3 rounded-full bg-blue-500 inline-block" /> Low</span>
                </div>

                {/* Conflict Summary */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-900 mb-4">
                    Conflict Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-red-50">
                        <AlertCircle className="size-5 text-red-700" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-700">Budget Issues</p>
                        <p className="text-3xl font-bold text-red-600">4</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-yellow-50">
                        <AlertCircle className="size-5 text-yellow-700" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-700">
                          Interest Mismatches
                        </p>
                        <p className="text-3xl font-bold text-yellow-600">2</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <AlertCircle className="size-5 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-700">
                          Season Preferences
                        </p>
                        <p className="text-3xl font-bold text-blue-600">1</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Issues */}
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="text-base font-semibold text-slate-900 mb-4">
                    Detailed Issues:
                  </h3>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <button
                      className={`px-4 py-1 rounded-full font-semibold text-sm border transition-all duration-150 ${conflictFilter === "all" ? "bg-violet-500 text-white" : "bg-white text-slate-700 border-slate-200"}`}
                      onClick={() => setConflictFilter("all")}
                    >
                      All ({conflictIssues.length})
                    </button>
                    <button
                      className={`px-4 py-1 rounded-full font-semibold text-sm border transition-all duration-150 ${conflictFilter === "high" ? "bg-red-500 text-white" : "bg-white text-slate-700 border-slate-200"}`}
                      onClick={() => setConflictFilter("high")}
                    >
                      High ({conflictCounts.high})
                    </button>
                    <button
                      className={`px-4 py-1 rounded-full font-semibold text-sm border transition-all duration-150 ${conflictFilter === "medium" ? "bg-yellow-500 text-white" : "bg-white text-slate-700 border-slate-200"}`}
                      onClick={() => setConflictFilter("medium")}
                    >
                      Medium ({conflictCounts.medium})
                    </button>
                    <button
                      className={`px-4 py-1 rounded-full font-semibold text-sm border transition-all duration-150 ${conflictFilter === "low" ? "bg-blue-500 text-white" : "bg-white text-slate-700 border-slate-200"}`}
                      onClick={() => setConflictFilter("low")}
                    >
                      Low ({conflictCounts.low})
                    </button>
                  </div>
                  <div className="max-h-[260px] overflow-y-auto flex flex-col gap-2">
                    {filteredConflicts.map((issue) => {
                      const s = getSeverityColor(issue.severity);
                      let bg = "";
                      let border = "";
                      if (issue.severity === "high") {
                        bg = "bg-red-50";
                        border = "border-red-200";
                      } else if (issue.severity === "medium") {
                        bg = "bg-yellow-50";
                        border = "border-yellow-200";
                      } else if (issue.severity === "low") {
                        bg = "bg-blue-50";
                        border = "border-blue-200";
                      }
                      return (
                        <div
                          key={issue.id}
                          className={`p-3 rounded-xl border ${bg} ${border}`}
                        >
                          <p className="text-sm font-medium">{issue.member}</p>
                          <p className="text-xs mt-1">{issue.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="size-5 text-violet-700 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-violet-900 mb-2">
                        Recommendations:
                      </h3>
                      <ul className="space-y-1 text-sm text-violet-800">
                        <li className="flex items-start gap-2">
                          <span>•</span>
                          <span>
                            Add destinations that match underserved interests to
                            improve group satisfaction
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span>•</span>
                          <span>
                            Consider flexible travel dates to accommodate
                            different season preferences
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Destinations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Selected Destinations
              </h2>
              <p className="text-sm text-slate-500">
                {currentSelectedDestinations.length} destination(s) selected
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {currentSelectedDestinations.map((destination) => (
                <Card
                  key={destination.id}
                  className="border-[#AD46FF] bg-white"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900 mb-1">
                            {destination.name}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {destination.description}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeselectDestination(destination)}>
                          <X className="size-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Wallet className="size-4 text-slate-500" />
                          RM{destination.cost}
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="size-4 text-slate-500" />
                          {destination.season}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="size-4 text-slate-500" />
                          {destination.interests.join(", ")}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="size-4 text-violet-700" />
                            <span className="text-xs text-slate-600">
                              Group Match
                            </span>
                          </div>
                          <span className="text-sm font-bold text-violet-700">
                            {destination.groupMatch}%
                          </span>
                        </div>
                        <Progress
                          value={destination.groupMatch}
                          className="h-2 bg-slate-200 **:data-[slot=progress-indicator]:bg-violet-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-slate-600">
                          Individual Matches:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {destination.individualMatches.map((match) => (
                            <Badge
                              key={match.name}
                              className={`${getMatchColor(match.percentage)} border-0 px-2 py-1 text-xs`}
                            >
                              {match.name}: {match.percentage}%
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {destination.note && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                          <p className="text-xs text-yellow-900">
                            <span className="font-bold">Note:</span>{" "}
                            {destination.note}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Available Destinations */}
          <Card className="border-[#AD46FF] bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Available Destinations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {currentAvailableDestinations.map((destination) => (
                  <Card
                    key={destination.id}
                    className="border border-slate-200 bg-white"
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-bold text-slate-900">
                            {destination.name}
                          </h3>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSelectDestination(destination)}>
                            <Plus className="size-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-slate-600">
                          {destination.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <Wallet className="size-3 text-slate-500" />
                            RM{destination.cost}
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="size-3 text-slate-500" />
                            {destination.season}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="size-3 text-slate-500" />
                            {destination.duration}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {destination.interests.map((interest) => (
                            <Badge
                              key={interest}
                              className="bg-slate-100 text-slate-700 border-0 px-2 py-1 text-xs"
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>

                        <div className="border-t border-violet-200 pt-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="size-4 text-violet-700" />
                              <span className="text-xs text-slate-600">
                                Group Match
                              </span>
                            </div>
                            <span className="text-sm font-bold text-violet-700">
                              {destination.groupMatch}%
                            </span>
                          </div>
                          <Progress
                            value={destination.groupMatch}
                            className="h-2 mt-2 bg-slate-200 **:data-[slot=progress-indicator]:bg-violet-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs text-slate-600">
                            Individual Matches:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {destination.individualMatches.map((match) => (
                              <Badge
                                key={match.name}
                                className={`${getMatchColor(match.percentage)} border-0 px-2 py-1 text-xs`}
                              >
                                {match.name}: {match.percentage}%
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
