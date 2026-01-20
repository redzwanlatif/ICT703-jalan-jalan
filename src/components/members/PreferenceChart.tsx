import { useState } from 'react';
import { Member } from '../../types';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

interface PreferenceChartProps {
    members: Member[];
}

const seasonDetails: { [key: string]: { description: string; monthRange: string } } = {
    Raya: {
        description: "Eid celebration - vibrant festivities and family gatherings",
        monthRange: "April - May",
    },
    CNY: {
        description: "Chinese New Year - colorful celebrations and cultural traditions",
        monthRange: "January - February",
    },
    Merdeka: {
        description: "Malaysia Independence Day - patriotic celebrations and festivities",
        monthRange: "August",
    },
    Deepavali: {
        description: "Festival of Lights - cultural and spiritual celebrations",
        monthRange: "October - November",
    },
};

const RADIAN = Math.PI / 180;

const CustomSeasonTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        const season = data.payload.season;
        const actualCount = data.value - 1; // Subtract the padding we added
        const percentage = ((actualCount / data.payload.totalMembers) * 100).toFixed(0);

        return (
            <div className="rounded-md border border-gray-300 bg-white px-2 py-1 shadow-md">
                <p className="text-xs font-semibold text-gray-900">{season}</p>
                <p className="text-xs text-violet-700">
                    {actualCount} / {data.payload.totalMembers} ({percentage}%)
                </p>
            </div>
        );
    }

    return null;
};

export function PreferenceChart({ members }: PreferenceChartProps) {
    // Always show pie labels
    const showPieLabels = true;

    const renderInterestLabel = ({
        cx = 0,
        cy = 0,
        midAngle = 0,
        outerRadius = 0,
        name,
        percent,
        fill,
        index,
    }: any) => {
        if (!showPieLabels || !name || percent === undefined) return null;

        const radius = outerRadius + 18;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        const labelColor = fill ?? COLORS[(index ?? 0) % COLORS.length];

        return (
            <text
                x={x}
                y={y}
                fill={labelColor}
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-xs font-medium"
            >
                {`${name} ${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    // Calculate interest distribution
    const interestCounts: { [key: string]: number } = {};
    members.forEach((member) => {
        member.interests.forEach((interest) => {
            interestCounts[interest] = (interestCounts[interest] || 0) + 1;
        });
    });

    const pieData = Object.entries(interestCounts).map(([name, value]) => ({
        name,
        value,
    }));

    // Calculate season preferences
    const allSeasons = ['Raya', 'CNY', 'Merdeka', 'Deepavali'];
    const seasonCounts: { [key: string]: number } = {};
    
    // Initialize all seasons with 0
    allSeasons.forEach((season) => {
        seasonCounts[season] = 0;
    });
    
    // Count member preferences
    members.forEach((member) => {
        member.seasons.forEach((season) => {
            seasonCounts[season] = (seasonCounts[season] || 0) + 1;
        });
    });

    const radarData = allSeasons.map((season) => ({
        season,
        count: (seasonCounts[season] || 0) + 1, // Add 1 for better visualization
        totalMembers: members.length,
    }));

    // Calculate max count for proper scaling
    const maxCount = Math.max(...Object.values(seasonCounts), 1);
    const scaledMax = Math.ceil((maxCount + 1) * 1.2); // Add 20% padding to the scale (account for +1)

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#6366f1'];

    return (
        <div className="bg-white rounded-xl border-1 border-purple-500 p-6">
            <h2 className="text-xl font-bold mb-6">Group Preferences Overview</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Interest Distribution */}
                <div className="px-8 py-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">
                        Interest Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={showPieLabels}
                                label={renderInterestLabel}
                                outerRadius={70}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Season Preferences */}
                <div className="px-8 py-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">
                        Season Preferences
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={radarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <PolarGrid gridType="polygon" />
                            <PolarAngleAxis dataKey="season" />
                            <PolarRadiusAxis 
                                angle={90} 
                                domain={[0, scaledMax]}
                                tick={false}
                            />
                            <Tooltip
                                content={<CustomSeasonTooltip />}
                                contentStyle={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    padding: 0,
                                }}
                                cursor={{ fill: "rgba(139, 92, 246, 0.1)" }}
                            />
                            <Radar
                                name="Preferences"
                                dataKey="count"
                                stroke="#8b5cf6"
                                fill="#8b5cf6"
                                fillOpacity={0.6}
                                strokeWidth={2}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}