"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Calendar,
  Wallet,
  ChevronRight,
  Sparkles,
  Plane,
  Hotel,
  Utensils,
  Activity,
  Car,
  MoreHorizontal,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";

const upcomingTrips = [
  {
    id: 1,
    destination: "Paris",
    country: "France",
    dates: "Dec 20 - Dec 30",
    budget: 9500,
    status: "planning",
    image: "🗼",
  },
  {
    id: 2,
    destination: "Langkawi",
    country: "Malaysia",
    dates: "Jan 5 - Jan 8",
    budget: 1800,
    status: "confirmed",
    image: "🏝️",
  },
  {
    id: 3,
    destination: "Barcelona",
    country: "Spain",
    dates: "Feb 14 - Feb 21",
    budget: 7200,
    status: "planning",
    image: "⛪",
  },
  {
    id: 4,
    destination: "Cameron Highlands",
    country: "Malaysia",
    dates: "Mar 1 - Mar 3",
    budget: 800,
    status: "confirmed",
    image: "🌿",
  },
];

const pastTrips = [
  {
    id: 5,
    destination: "London",
    country: "United Kingdom",
    dates: "Sep 5 - Sep 15",
    spent: 6800,
    budget: 6500,
    image: "🎡",
  },
  {
    id: 6,
    destination: "Penang",
    country: "Malaysia",
    dates: "Aug 12 - Aug 14",
    spent: 650,
    budget: 900,
    image: "🍜",
  },
  {
    id: 7,
    destination: "Amsterdam",
    country: "Netherlands",
    dates: "Jul 20 - Jul 27",
    spent: 5200,
    budget: 5000,
    image: "🌷",
  },
  {
    id: 8,
    destination: "Melaka",
    country: "Malaysia",
    dates: "Jun 8 - Jun 10",
    spent: 450,
    budget: 600,
    image: "🏛️",
  },
  {
    id: 9,
    destination: "Rome",
    country: "Italy",
    dates: "May 1 - May 10",
    spent: 7100,
    budget: 6800,
    image: "🏟️",
  },
];

export default function PlannerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tripData, setTripData] = useState({
    destination: "",
    country: "",
    startDate: "",
    endDate: "",
    flights: "",
    accommodation: "",
    food: "",
    activities: "",
    transport: "",
    misc: "",
  });

  const calculateTotal = () => {
    const values = [
      tripData.flights,
      tripData.accommodation,
      tripData.food,
      tripData.activities,
      tripData.transport,
      tripData.misc,
    ];
    return values.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  };

  const handleInputChange = (field: string, value: string) => {
    setTripData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsModalOpen(false);
    setTripData({
      destination: "",
      country: "",
      startDate: "",
      endDate: "",
      flights: "",
      accommodation: "",
      food: "",
      activities: "",
      transport: "",
      misc: "",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-muted-foreground text-sm">Your Journeys</p>
            <h1 className="text-2xl font-bold text-foreground">Trip Planner</h1>
          </div>
          <Button size="sm" className="rounded-xl" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            New Trip
          </Button>
        </div>
      </div>

      {/* Active Trip */}
      <div className="px-6 mb-6">
        <h2 className="font-semibold text-foreground mb-3">Active Trip</h2>
        <Link href="/informatics/planner/1/expenses">
          <Card className="p-4 border-2 border-primary/30 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-2xl">
                🗼
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Paris</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    Active
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">France</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Dec 20 - Dec 30
                  </span>
                  <span className="flex items-center gap-1">
                    <Wallet className="w-3 h-3" />
                    RM 880 / 9,500
                  </span>
                </div>
                {/* Budget Progress */}
                <Progress value={9} className="mt-2 h-1.5" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-[10px] text-muted-foreground">Expenses</span>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Upcoming Trips */}
      <div className="px-6 mb-6">
        <h2 className="font-semibold text-foreground mb-3">Upcoming</h2>
        <div className="space-y-3">
          {upcomingTrips.map((trip) => (
            <Card key={trip.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                  {trip.image}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{trip.destination}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        trip.status === "confirmed"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-yellow-500/10 text-yellow-600"
                      }`}
                    >
                      {trip.status === "confirmed" ? "Confirmed" : "Planning"}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">{trip.country}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {trip.dates}
                    </span>
                    <span className="flex items-center gap-1">
                      <Wallet className="w-3 h-3" />
                      RM {trip.budget.toLocaleString()}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Suggestion */}
      <div className="px-6 mb-6">
        <Card className="p-4 border-primary/20 bg-primary/5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm mb-1">Trip Suggestion</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Based on your budget and preferences, consider visiting Vietnam in February. Flights
                are 30% cheaper and the weather is ideal for exploration.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Past Trips */}
      <div className="px-6 mb-6">
        <h2 className="font-semibold text-foreground mb-3">Past Trips</h2>
        <div className="space-y-3">
          {pastTrips.map((trip) => {
            const overBudget = trip.spent > trip.budget;
            return (
              <Card key={trip.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl">
                    {trip.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">{trip.destination}</h3>
                      <span
                        className={`text-sm font-semibold ${
                          overBudget ? "text-yellow-600" : "text-green-600"
                        }`}
                      >
                        RM {trip.spent.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">{trip.dates}</p>
                    <Progress
                      value={Math.min((trip.spent / trip.budget) * 100, 100)}
                      className="mt-2 h-1.5"
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* New Trip Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Plan New Trip</DialogTitle>
            <DialogDescription>Calculate your trip budget breakdown</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Basic Info */}
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="e.g., Tokyo"
                value={tripData.destination}
                onChange={(e) => handleInputChange("destination", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="e.g., Japan"
                value={tripData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <DatePicker
                  date={tripData.startDate ? new Date(tripData.startDate) : undefined}
                  onSelect={(date) => {
                    handleInputChange("startDate", date ? date.toISOString().split("T")[0] : "");
                  }}
                  placeholder="Select start date"
                  minDate={new Date()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <DatePicker
                  date={tripData.endDate ? new Date(tripData.endDate) : undefined}
                  onSelect={(date) => {
                    handleInputChange("endDate", date ? date.toISOString().split("T")[0] : "");
                  }}
                  placeholder="Select end date"
                  minDate={tripData.startDate ? new Date(tripData.startDate) : new Date()}
                  disabled={!tripData.startDate}
                />
              </div>
            </div>

            {/* Budget Breakdown */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold text-sm mb-3">Budget Breakdown</h3>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="flights" className="flex items-center gap-2">
                    <Plane className="w-4 h-4" />
                    Flights
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      RM
                    </span>
                    <Input
                      id="flights"
                      type="number"
                      placeholder="0.00"
                      className="pl-10"
                      value={tripData.flights}
                      onChange={(e) => handleInputChange("flights", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accommodation" className="flex items-center gap-2">
                    <Hotel className="w-4 h-4" />
                    Accommodation
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      RM
                    </span>
                    <Input
                      id="accommodation"
                      type="number"
                      placeholder="0.00"
                      className="pl-10"
                      value={tripData.accommodation}
                      onChange={(e) => handleInputChange("accommodation", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="food" className="flex items-center gap-2">
                    <Utensils className="w-4 h-4" />
                    Food & Dining
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      RM
                    </span>
                    <Input
                      id="food"
                      type="number"
                      placeholder="0.00"
                      className="pl-10"
                      value={tripData.food}
                      onChange={(e) => handleInputChange("food", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activities" className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Activities & Tours
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      RM
                    </span>
                    <Input
                      id="activities"
                      type="number"
                      placeholder="0.00"
                      className="pl-10"
                      value={tripData.activities}
                      onChange={(e) => handleInputChange("activities", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transport" className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Local Transport
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      RM
                    </span>
                    <Input
                      id="transport"
                      type="number"
                      placeholder="0.00"
                      className="pl-10"
                      value={tripData.transport}
                      onChange={(e) => handleInputChange("transport", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="misc" className="flex items-center gap-2">
                    <MoreHorizontal className="w-4 h-4" />
                    Miscellaneous
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      RM
                    </span>
                    <Input
                      id="misc"
                      type="number"
                      placeholder="0.00"
                      className="pl-10"
                      value={tripData.misc}
                      onChange={(e) => handleInputChange("misc", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                <span className="font-semibold">Total Budget</span>
                <span className="text-xl font-bold text-primary">
                  RM{" "}
                  {calculateTotal().toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Trip</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

