"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { initialMembers } from "@/data/seed";
import { Member } from "@/types";
import { MemberCard } from "@/components/members/MemberCard";
import { Navigation } from "@/components/shared/navigation";
import TabBar from "@/components/ui/TabBar";
import { GroupAggregate } from "@/components/members/GroupAggregate";
import { PreferenceChart } from "@/components/members/PreferenceChart";
import { IndividualMemberDetails } from "@/components/members/IndividualMemberDetails";
import { Users } from "lucide-react";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const pathname = usePathname(); // get current route

  const handleUpdateMember = (updatedMember: Member) => {
    setMembers((prevMembers) =>
      prevMembers.map((m) => (m.id === updatedMember.id ? updatedMember : m))
    );
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #f5f3ff 0%, #F1F5F9 20%)' }}>
      <div className="sticky top-0 z-20">
        <Navigation />
        <TabBar />
      </div>

      <main className="container mx-auto px-6 lg:px-24 py-4">
        <header className="flex items-center gap-7  pt-11 mb-8">
          <div className="shrink-0 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-4 transition-transform duration-300 group-hover:scale-110">
            <Users className="size-8 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">My Members</h1>
        </header>

        {pathname === "/dashboard/member" && (
          <div className="space-y-6">
            <PreferenceChart members={members} />
            <IndividualMemberDetails members={members} />
            <GroupAggregate members={members} />

            <div>
              <h2 className="text-xl font-semibold mb-4">Group Members</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {members.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onUpdate={handleUpdateMember}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
