import { Link } from "react-router-dom";
import { ClipboardCheck, FileCheck2, Users, FileText } from "lucide-react";
import StatCard from "@/components/common/StatCard";
import SimpleBarChart from "@/components/common/SimpleBarChart";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import RecentRegistrationsPanel from "./RecentRegistrationsPanel";
import ReportsAwaitingApprovalPanel from "./ReportsAwaitingApprovalPanel";

const STAT_CARDS = [
  { key: "pendingAccountCount", label: "Pending accounts", icon: ClipboardCheck, tone: "amber", href: "/admin/approvals" },
  { key: "pendingReportCount", label: "Pending reports", icon: FileCheck2, tone: "amber", href: "/admin/report-approvals" },
  { key: "totalCitizenCount", label: "Total citizens", icon: Users, tone: "blue", href: "/admin/citizens" },
  { key: "totalReportCount", label: "Total reports", icon: FileText, tone: "violet", href: "/admin/reports" },
];

/** api-standards.md GET /api/dashboard/admin + /api/dashboard/categories. */
export default function AdminDashboardPage() {
  const {
    summary,
    categoryVolume,
    isLoading,
    error,
    approveAccount,
    rejectAccount,
    approveReport,
    rejectReport,
  } = useAdminDashboard();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Admin Dashboard</h1>
        <p className="text-sm text-ink-muted">City-wide account and report activity at a glance.</p>
      </div>

      {error ? (
        <div className="rounded-console border border-console-border bg-surface p-6 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <>
          <div className="flex gap-4">
            {STAT_CARDS.map((card) => (
              <Link key={card.key} to={card.href} className="flex flex-1">
                <StatCard
                  label={card.label}
                  value={isLoading ? "…" : (summary?.[card.key] ?? 0).toLocaleString()}
                  icon={card.icon}
                  tone={card.tone}
                />
              </Link>
            ))}
          </div>

          <div className="flex gap-6">
            <RecentRegistrationsPanel
              registrations={summary?.recentRegistrations}
              onApprove={approveAccount}
              onReject={rejectAccount}
            />
            <ReportsAwaitingApprovalPanel
              reports={summary?.reportsAwaitingApproval}
              onApprove={approveReport}
              onReject={rejectReport}
            />
          </div>

          <div className="rounded-console border border-console-border bg-surface p-6">
            <h2 className="font-display text-base font-bold text-ink">Issue volume by category</h2>
            <div className="mt-4">
              <SimpleBarChart data={categoryVolume} xKey="categoryName" yKey="reportCount" color="var(--status-progress)" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
