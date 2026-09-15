import { FileText, CheckCircle2, LoaderCircle, FileClock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/common/StatCard";
import ReportMap from "@/components/map/ReportMap";
import { useReportMap } from "@/features/report-map";
import { useStaffDashboard } from "../hooks/useStaffDashboard";
import RecentReportsTable from "./RecentReportsTable";
import { useLanguage } from "@/app/providers/LanguageProvider";

const STAT_CARDS = [
  { key: "totalReports", label: "Total Reports", icon: FileText, tone: "blue", to: "/staff/reports" },
  {
    key: "resolvedReports",
    label: "Resolved",
    icon: CheckCircle2,
    tone: "green",
    to: "/staff/reports?status=RESOLVED",
  },
  { key: "remainingReports", label: "Remaining", icon: LoaderCircle, tone: "amber", to: "/staff/reports" },
  // Backend's "new" bucket is reports routed into this department since the
  // start of today (approvedAt), regardless of their current status.
  { key: "newReports", label: "New Today", icon: FileClock, tone: "violet", to: "/staff/reports" },
];

/** Entry page for the staff-dashboard feature — GET /api/dashboard/staff. */
export default function StaffDashboardPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { summary, isLoading, error } = useStaffDashboard();
  const { pins } = useReportMap();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">{t("Staff Dashboard")}</h1>
        <p className="text-sm text-ink-muted">{t("Your reports overview and department performance")}</p>
      </div>

      {error ? (
        <div className="rounded-console border border-console-border bg-surface p-6 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <>
          <div className="flex gap-4">
            {STAT_CARDS.map((card) => (
              <StatCard
                key={card.key}
                label={card.label}
                value={isLoading ? "…" : (summary?.[card.key] ?? 0).toLocaleString()}
                to={card.to}
              />
            ))}
          </div>

          <div className="rounded-console border border-console-border bg-surface p-6">
            <h2 className="font-display text-base font-bold text-ink">{t("Report locations")}</h2>
            <div className="mt-4 h-[234px] overflow-hidden rounded-md">
              <ReportMap
                pins={pins}
                interactive={false}
                cluster
                fitToPins
                onPinClick={(pin) => navigate(`/staff/reports/${pin.id}`)}
              />
            </div>
          </div>

          <RecentReportsTable reports={summary?.recentReports} />
        </>
      )}
    </div>
  );
}
