import { Member } from '../../types';

interface IndividualMemberDetailsProps {
    members: Member[];
}

export function IndividualMemberDetails({ members }: IndividualMemberDetailsProps) {
    const getCrowdLabel = (pref: string) => {
        switch (pref) {
            case 'avoid': return 'Avoid Crowds';
            case 'okay': return 'Okay with Crowds';
            default: return 'No Preference';
        }
    };

    return (
        <div className="bg-white rounded-xl border-1 border-purple-500 p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Individual Member Details</h3>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Member</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Budget Range</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Avg Budget</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Preferred Seasons</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Crowd Preference</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member, index) => {
                            const memberAvg = Math.round((member.budgetMin + member.budgetMax) / 2);
                            return (
                                <tr
                                    key={member.id}
                                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50/50' : ''
                                        }`}
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            {member.avatar ? (
                                                <img
                                                    src={member.avatar}
                                                    alt={member.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                                                    {member.name.split(' ').map((n) => n[0]).join('')}
                                                </div>
                                            )}
                                            <span className="font-medium text-gray-900">{member.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-900">
                                            RM{member.budgetMin.toLocaleString()} - RM{member.budgetMax.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm font-semibold text-gray-900">
                                            RM{memberAvg.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            {member.seasons.map((season) => (
                                                <span
                                                    key={season}
                                                    className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                                                >
                                                    {season}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${member.crowdPreference === 'avoid'
                                            ? 'bg-pink-100 text-pink-700'
                                            : member.crowdPreference === 'okay'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {getCrowdLabel(member.crowdPreference)}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
