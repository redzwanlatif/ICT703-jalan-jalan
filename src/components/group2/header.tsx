"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/group2/tabs"
import { useRouter, usePathname } from "next/navigation"
import { Home } from "lucide-react";

export default function Header() {
    const router = useRouter()
    const pathname = usePathname()
    return (
        <header className="flex items-center justify-between border-b bg-white px-6 py-4">

            {/* Left: Dashboard name */}
            <h1 className="text-2xl font-bold text-slate-900">
                WanderBoard
            </h1>

            {/* Middle: Tabs */}
            <Tabs defaultValue="live" value={pathname === "/group2-booking-details" ? "booking" : "live"}
                onValueChange={(value) => {
                    router.push(value === "booking" ? "/group2-booking-details" : "/group2-dashboard")
                }}>
                <TabsList>
                    <TabsTrigger value="live">Live Itinerary</TabsTrigger>
                    <TabsTrigger value="booking">Booking Details</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Right: placeholder */}
            <div className="w-24">
                <button
                    onClick={() => router.push("/")}
                    className="p-2 rounded hover:bg-slate-100 transition"
                    aria-label="Go to Home"
                >
                    <Home className="w-6 h-6 text-slate-700" />
                </button>
            </div>
        </header>
    )
}
