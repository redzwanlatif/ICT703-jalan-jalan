import { Member } from '../../types';
import { DollarSign, Calendar, Users2 } from 'lucide-react';

interface GroupAggregateProps {
    members: Member[];
}

export function GroupAggregate({ members }: GroupAggregateProps) {
    // Calculate group aggregates
    const avgMinBudget = Math.round(
        members.reduce((sum, m) => sum + m.budgetMin, 0) / members.length
    );
    const avgMaxBudget = Math.round(
        members.reduce((sum, m) => sum + m.budgetMax, 0) / members.length
    );
    const avgBudget = Math.round((avgMinBudget + avgMaxBudget) / 2);

    // Season distribution
    const seasonCounts = members.reduce((acc, member) => {
        member.seasons.forEach(season => {
            acc[season] = (acc[season] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const topSeasons = Object.entries(seasonCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    // Crowd preference distribution
    const crowdCounts = members.reduce((acc, member) => {
        acc[member.crowdPreference] = (acc[member.crowdPreference] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const getCrowdLabel = (pref: string) => {
        switch (pref) {
            case 'avoid': return 'Avoid Crowds';
            case 'okay': return 'Okay with Crowds';
            default: return 'No Preference';
        }
    };

    return (
        <div className="bg-white rounded-xl border-1 border-purple-500 p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Group Aggregate</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Average Budget */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <h4 className="font-medium text-gray-900">Average Budget</h4>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">RM{avgBudget.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 mt-1">
                        Range: RM{avgMinBudget.toLocaleString()} - RM{avgMaxBudget.toLocaleString()}
                    </p>
                </div>

                {/* Top Seasons */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <h4 className="font-medium text-gray-900">Popular Seasons</h4>
                    </div>
                    <div className="space-y-2">
                        {topSeasons.map(([season, count]) => (
                            <div key={season} className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-900">{season}</span>
                                <span className="text-sm text-gray-600">
                                    {count}/{members.length} members
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Crowd Preference */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-pink-100 rounded-lg">
                            <Users2 className="w-5 h-5 text-pink-600" />
                        </div>
                        <h4 className="font-medium text-gray-900">Crowd Preference</h4>
                    </div>
                    <div className="space-y-2">
                        {Object.entries(crowdCounts).map(([pref, count]) => (
                            <div key={pref} className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-900">{getCrowdLabel(pref)}</span>
                                <span className="text-sm text-gray-600">
                                    {count}/{members.length}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
