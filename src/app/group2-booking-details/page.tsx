import Header from "@/components/group2/header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/group2/tabs"
import { Card } from "@/components/ui/group2/card"
import { BudgetDonut } from "@/components/charts/group2/budget-donut"
import { SpendingBar } from "@/components/charts/group2/spending-bar"
import { Timeline } from "@/components/group2/timeline"
import { BookingTable } from "@/components/group2/booking-table"

export default function BookingDetailsPage() {
    return (
        <div className="min-h-screen bg-slate-100">
            <Header />

            <main className="p-6">
                <h2 className="mb-6 text-2xl font-semibold">
                    Check your booking details
                </h2>

                <Tabs defaultValue="budget">
                    <TabsList className="mb-6">
                        <TabsTrigger value="budget">Overall Budget</TabsTrigger>
                        <TabsTrigger value="schedule">Update & Schedule</TabsTrigger>
                    </TabsList>

                    {/* Overall Budget */}
                    <TabsContent value="budget">
                        <div className="grid grid-cols-2 gap-6">
                            <Card className="p-4 border">
                                <BudgetDonut />
                            </Card>

                            <Card className="p-4 border">
                                <SpendingBar />
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Update & Schedule */}
                    <TabsContent value="schedule">
                        <div className="grid grid-cols-2 gap-6">
                            <Card className="p-4 border">
                                <Timeline />
                            </Card>

                            <Card className="p-4 border">
                                <BookingTable />
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
