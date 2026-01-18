"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Shield,
  FileWarning,
  Clock,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { DuoResponsiveLayout } from "@/components/shared";
import { DuoMascot } from "@/components/shared/duo-mascot";
import { cn } from "@/lib/utils";

// Mock report data
const reports = [
  {
    id: 1,
    name: "Ali Abu bin Aniq",
    dateOfReport: "1 January 2025",
    typeOfReport: "Misinformation",
    status: "Resolved",
    actionTaken: "The story has been taken down.",
  },
  {
    id: 2,
    name: "Aminah binti Salman",
    dateOfReport: "1 January 2025",
    typeOfReport: "Inappropriate Content",
    status: "Resolved",
    actionTaken: "Report is rejected.",
  },
  {
    id: 3,
    name: "Nurul Azizah binti Abdullah",
    dateOfReport: "2 January 2025",
    typeOfReport: "Fraud or Scam",
    status: "Pending",
    actionTaken: "Pending review",
  },
  {
    id: 4,
    name: "Amirul Hafiz bin Ismail",
    dateOfReport: "2 January 2025",
    typeOfReport: "Hate Speech or Harrasment",
    status: "Pending",
    actionTaken: "Pending review",
  },
  {
    id: 5,
    name: "Siti Aminah binti Mohamad",
    dateOfReport: "3 January 2025",
    typeOfReport: "Irrelevant Content",
    status: "Pending",
    actionTaken: "Pending review",
  },
];

export default function AdminDashboardPage() {
  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === "Pending").length;
  const resolvedReports = reports.filter((r) => r.status === "Resolved").length;

  return (
    <DuoResponsiveLayout showTopBar showBottomNav>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-[var(--duo-green)]/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-[var(--duo-green)]" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage community reports</p>
          </div>
          <DuoMascot mood="thinking" size="sm" />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {/* Total Reports */}
          <div className="duo-card p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--duo-blue)]/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[var(--duo-blue)]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Reports</p>
                <p className="text-3xl font-extrabold">{totalReports}</p>
              </div>
            </div>
          </div>

          {/* Pending Reports */}
          <div
            className="duo-card p-5"
            style={{
              background: "linear-gradient(135deg, var(--duo-orange) 0%, #F97316 100%)",
              borderColor: "#EA580C",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80 font-medium">Pending</p>
                <p className="text-3xl font-extrabold text-white">{pendingReports}</p>
              </div>
            </div>
          </div>

          {/* Resolved Reports */}
          <div
            className="duo-card p-5"
            style={{
              background: "linear-gradient(135deg, var(--duo-green) 0%, var(--duo-green-dark) 100%)",
              borderColor: "var(--duo-green-dark)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80 font-medium">Resolved</p>
                <p className="text-3xl font-extrabold text-white">{resolvedReports}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reports Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="duo-card overflow-hidden"
        >
          <div className="p-5 border-b-2 border-border">
            <h2 className="text-lg font-extrabold flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-[var(--duo-purple)]" />
              Community Story Reports
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-5 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Reporter
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reports.map((report, index) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-bold">{report.id}</td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium">{report.name}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {report.dateOfReport}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-bold px-2 py-1 rounded-lg bg-[var(--duo-purple)]/10 text-[var(--duo-purple)]">
                        {report.typeOfReport}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full",
                          report.status === "Resolved"
                            ? "bg-[var(--duo-green)]/10 text-[var(--duo-green)]"
                            : "bg-[var(--duo-orange)]/10 text-[var(--duo-orange)]"
                        )}
                      >
                        {report.status === "Resolved" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {report.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/reports/${report.id}`}>
                        <button className="inline-flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-xl bg-[var(--duo-green)] text-white hover:bg-[var(--duo-green-dark)] transition-colors shadow-[0_2px_0_var(--duo-green-dark)]">
                          View
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t-2 border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <strong>1-{reports.length}</strong> of <strong>{reports.length}</strong> reports
            </p>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-xl bg-[var(--duo-green)] text-white font-bold shadow-[0_3px_0_var(--duo-green-dark)]">
                1
              </button>
              <button className="px-4 h-10 rounded-xl border-2 border-border font-bold hover:bg-muted transition-colors">
                Next
              </button>
            </div>
          </div>
        </motion.div>

        {/* XP Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-4"
        >
          <Sparkles className="w-4 h-4 text-[var(--duo-yellow)]" />
          <span>
            Earn <strong className="text-[var(--duo-green)]">+15 XP</strong> for each report reviewed!
          </span>
        </motion.div>
      </div>
    </DuoResponsiveLayout>
  );
}
