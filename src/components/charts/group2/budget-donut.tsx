"use client"

import { PieChart, Pie, Cell } from "recharts"

const data = [
    { name: "Actual", value: 4200 },
    { name: "Expected", value: 5000 },
]

const COLORS = ["#2563eb", "#e5e7eb"]

export function BudgetDonut() {
    return (
        <>
            <h3 className="mb-4 font-medium">Actual vs Expected Budget</h3>
            <PieChart width={250} height={250}>
                <Pie
                    data={data}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={90}
                >
                    {data.map((_, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                    ))}
                </Pie>
            </PieChart>
        </>
    )
}
