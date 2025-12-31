export function Timeline() {
    const steps = [
        { date: "Day 1", activity: "Arrival & Hotel Check-in" },
        { date: "Day 2", activity: "City Tour & Museum" },
        { date: "Day 3", activity: "Shopping & Departure" },
    ]

    return (
        <>
            <h3 className="mb-4 font-medium">Suggested Itinerary Schedule</h3>

            <ul className="space-y-4">
                {steps.map((step, index) => (
                    <li key={index} className="flex gap-4">
                        <div className="h-3 w-3 mt-1 rounded-full bg-blue-600" />
                        <div>
                            <p className="font-semibold">{step.date}</p>
                            <p className="text-sm text-slate-600">{step.activity}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}
