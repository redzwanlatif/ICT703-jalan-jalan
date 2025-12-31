import Header from "@/components/group2/header"
import { SearchBar } from "@/components/group2/search-bar"
import { GPSFinder } from "@/components/group2/gps-finder"
import { Button } from "@/components/ui/group2/button"
import { DashboardCard } from "@/components/group2/dashboard-card"

export default function LiveItineraryPage() {
    return (
        <div className="min-h-screen bg-slate-100">

            <Header />

            {/* Search Section */}
            <section className="flex gap-4 p-6">
                <SearchBar />
                <GPSFinder />
                <Button>Go to Another Page</Button>
            </section>

            {/* Dashboard Grid */}
            <section className="grid grid-cols-3 grid-rows-[auto_auto_auto] gap-6 px-6 pb-6">

                {/* Row 1 */}
                <DashboardCard title="Attraction Operating Status">
                    Open / Closed info
                </DashboardCard>

                <DashboardCard title="Safety Level">
                    Low • Medium • High
                </DashboardCard>

                <DashboardCard title="Crowd Level & Traffic Movement" className="row-span-2">
                    Crowd + Traffic
                </DashboardCard>

                {/* Row 2 */}
                <DashboardCard title="Price Comparison">
                    Hotel / Flight prices
                </DashboardCard>

                <DashboardCard title="Halal Spots Nearby">
                    Mosque • Restaurant
                </DashboardCard>

                {/* Row 3 */}
                <DashboardCard title="Weather">
                    🌤️ 30°C
                </DashboardCard>

                <DashboardCard title="Now Trending">
                    Popular attractions
                </DashboardCard>

                <DashboardCard title="Budget Level Metrics">
                    $ • $$ • $$$
                </DashboardCard>

            </section>
        </div>
    )
}
