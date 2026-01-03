"use client"

import Header from "@/components/group2/header"
import { DatePicker, PaxInsert, SearchDestination } from "@/components/group2/search-bar"
import { Button } from "@/components/ui/group2/button"
import { useRouter } from "next/navigation"

export default function LandingPage() {
    const router = useRouter()
    return (
        <div className="min-h-screen bg-slate-100">

            <Header />

            {/* Center-left container */}
            <div className="mx-auto max-w-5xl pt-20">

                {/* Heading */}
                <section className="mb-6">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        Get live data from your destination
                    </h2>
                </section>

                {/* Search Card */}
                <section>
                    <div className="flex w-fit flex-wrap items-center gap-3 rounded-xl bg-white p-6 shadow-md">
                        <SearchDestination />
                        <DatePicker />
                        <PaxInsert />

                        <Button
                            className="px-6"
                            onClick={() => router.push("/group2-dashboard")}
                        >
                            Search
                        </Button>
                    </div>
                </section>

            </div>
        </div>
    )
}
