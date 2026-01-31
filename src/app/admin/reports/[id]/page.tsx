"use client";

import Link from "next/link";
import { AlertCircle, ChevronLeft, ChevronRight, PlaneTakeoff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GroupLabel } from "@/components/shared/group-label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Mock report data
const reportData = {
  id: 1,
  reportDate: "21/1/2026",
  email: "ali@gmail.com",
  typeOfReport: "Misinformation",
  justification:
    "The community story claims the resort offered activity such as fitness classes. However, according to the official website and my visit on 31 December 2025, the activity is actually not available at their resort. This information mislead others during their trip.",
  story: {
    location: "Club Med Finolhu, Maldives",
    address: "N 2051, Gasfinolhu, Kaafu Atoll, Maldives",
    author: {
      name: "Alif Haikal",
      badge: "Frequent Traveller",
      avatar: "AH",
    },
    title: "The Finolhu Villas: All-inclusive Resort in Maldives",
    content: `Club Med Maldives is an excellent choice for travelers seeking a relaxing yet well-organized all-inclusive island getaway. The resort is located on a private island with crystal-clear waters, white sandy beaches, and beautiful marine life, creating a truly tropical and peaceful atmosphere. Guests frequently praise the friendly and professional staff, who provide attentive service while maintaining a warm and welcoming environment. The all-inclusive concept is a major advantage, offering a good variety of international and Asian cuisine, quality drinks, and snacks throughout the day, allowing guests to enjoy their stay without worrying about additional costs. Activities such as snorkeling, water sports, fitness classes, and evening entertainment add to the overall experience, while the calm setting also makes it ideal for couples and honeymooners.`,
    images: [
      { id: 1, src: "/placeholder.svg" },
      { id: 2, src: "/placeholder.svg" },
      { id: 3, src: "/placeholder.svg" },
    ],
  },
};

export default function AdminReportDetailPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <GroupLabel group={4} />
      {/* Left Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-white border-r border-[#D9D9D9]">
        {/* Logo */}
        <div className="flex justify-center py-6">
          <span className="text-[23px] font-semibold text-black">Jalan²</span>
        </div>

        {/* Menu */}
        <div className="flex flex-col items-center gap-4 px-8 pt-6">
          <span className="self-start text-xs font-bold tracking-[0.19em] text-[#232323]">
            MENU
          </span>

          <div className="flex flex-col items-center gap-2 w-full">
            <Link
              href="/admin"
              className="w-full flex items-center gap-3 px-8 py-4 bg-emerald-50 border-l-[5px] border-emerald-700"
            >
              <AlertCircle className="w-6 h-6 text-emerald-700" />
              <span className="text-base font-bold text-emerald-700">Report</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[260px]">
        <div className="p-10">
          {/* Page Title */}
          <h1 className="text-[30px] font-semibold tracking-tight text-slate-700 mb-6">
            Community Story Report
          </h1>

          {/* Story Preview Section */}
          <div className="mb-8">
            {/* Location Header */}
            <div className="p-6">
              <h2 className="text-base font-semibold text-slate-700">
                {reportData.story.location}
              </h2>
              <p className="text-sm text-slate-500">
                {reportData.story.address}
              </p>
            </div>

            {/* Main Image */}
            <div className="w-[675px] h-[450px] bg-gradient-to-br from-emerald-700 to-emerald-500 rounded-lg mx-auto" />

            {/* Image Carousel */}
            <div className="flex items-center gap-4 mt-6 px-6 max-w-[720px] mx-auto">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg border border-white shadow-sm bg-white/10"
              >
                <ChevronLeft className="h-4 w-4 text-slate-700" />
              </Button>

              <div className="flex-1 flex gap-4">
                {reportData.story.images.map((image) => (
                  <div
                    key={image.id}
                    className="flex-1 h-[180px] bg-gradient-to-br from-sky-200 to-sky-400 rounded-lg border border-white shadow-sm"
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg border border-white shadow-sm bg-white/10"
              >
                <ChevronRight className="h-4 w-4 text-slate-700" />
              </Button>
            </div>
          </div>

          {/* Story Content Section */}
          <div className="max-w-[600px] mx-auto mb-8">
            {/* Author Info */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center">
                <span className="text-[10px] font-semibold text-white">
                  {reportData.story.author.avatar}
                </span>
              </div>
              <span className="text-base font-semibold text-slate-700">
                {reportData.story.author.name}
              </span>
              <PlaneTakeoff className="w-6 h-6 text-emerald-700" />
              <span
                className="px-2 py-[3px] text-xs font-semibold rounded-lg border-0"
                style={{
                  backgroundColor: reportData.story.author.badge === "Verified Local" ? "#E6F3FF" : "#FE9A01",
                  color: reportData.story.author.badge === "Verified Local" ? "#1d4ed8" : "white"
                }}
              >
                {reportData.story.author.badge}
              </span>
            </div>

            {/* Story Title & Content */}
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              {reportData.story.title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {reportData.story.content}
            </p>
          </div>

          {/* Report Details Card */}
          <div className="bg-white rounded-xl p-8 max-w-[1052px] mx-auto">
            <h2 className="text-[30px] font-semibold tracking-tight text-slate-700 mb-6">
              Report Details
            </h2>

            <div className="flex flex-col gap-2 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-slate-700 w-[120px]">
                  Report Date:
                </span>
                <span className="text-base font-semibold text-slate-700">
                  {reportData.reportDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-slate-700 w-[120px]">
                  Email:
                </span>
                <span className="text-base font-semibold text-slate-700">
                  {reportData.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-slate-700 w-[120px]">
                  Type of Report:
                </span>
                <span className="text-base font-semibold text-slate-700">
                  {reportData.typeOfReport}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-base font-semibold text-slate-700 w-[120px] shrink-0">
                  Justification:
                </span>
                <span className="text-base font-semibold text-slate-700">
                  {reportData.justification}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="w-[420px] h-[51px] border-emerald-700 text-emerald-700 text-sm font-semibold"
              >
                Reject Report
              </Button>
              <Button
                className="w-[420px] h-[51px] bg-[#DC2626] hover:bg-[#DC2626]/90 text-slate-50 text-sm font-semibold"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Community Story
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-[20px] w-[593px] p-8 flex flex-col gap-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-[30px] font-semibold tracking-tight text-slate-700">
                Delete Community Story
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-500 w-[37px] h-[37px]"
                onClick={() => setShowDeleteModal(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-2">
              <label className="text-base font-semibold text-slate-700">
                Reasons
              </label>
              <Select defaultValue="misleading">
                <SelectTrigger className="w-full border-emerald-700 shadow-sm">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="misleading">
                    The community story contains misleading informations
                  </SelectItem>
                  <SelectItem value="inappropriate">
                    Inappropriate content
                  </SelectItem>
                  <SelectItem value="spam">Spam or promotional</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Input
                type="button"
                value="Back"
                className="w-[243px] border-emerald-700 shadow-sm text-center text-slate-500 cursor-pointer hover:bg-slate-50"
                onClick={() => setShowDeleteModal(false)}
              />
              <Button className="w-[243px] bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-slate-50 text-sm font-semibold">
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

