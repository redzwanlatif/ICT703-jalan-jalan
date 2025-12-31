"use client"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

const data = [
    { category: "Accommodation", amount: 2000 },
    { category: "Transportation", amount: 900 },
    { category: "Food", amount: 700 },
    { category: "Shopping", amount: 400 },
    { category: "Others", amount: 200 },
]

export function SpendingBar() {
    return (
        <div className="h-[300px]">
            <h3 className="mb-4 font-medium">My Spending</h3>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"   // 🔑 This makes it horizontal
                    margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />

                    {/* X-axis = values */}
                    <XAxis type="number" />

                    {/* Y-axis = labels */}
                    <YAxis
                        dataKey="category"
                        type="category"
                        width={120}
                    />

                    <Tooltip />

                    <Bar
                        dataKey="amount"
                        fill="#2563eb"
                        radius={[0, 6, 6, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
