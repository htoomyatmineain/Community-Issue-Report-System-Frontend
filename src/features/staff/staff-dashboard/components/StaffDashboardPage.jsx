import { FileText, CheckCircle2, LoaderCircle, FileClock } from "lucide-react";
import StatCard from "@/components/common/StatCard";
import ReportMap from "@/components/map/ReportMap";
import { useReportMap } from "@/features/report-map";
import { useStaffDashboard } from "../hooks/useStaffDashboard";
import DepartmentsChart from "./DepartmentsChart";
import RecentReportsTable from "./RecentReportsTable";
import { useLanguage } from "@/app/providers/LanguageProvider";

const STAT_CARDS = [
  { key: "totalReports", label: "Total Reports", icon: FileText, tone: "blue" },
  { key: "resolvedReports", label: "Resolved", icon: CheckCircle2, tone: "green" },
  { key: "remainingReports", label: "Remaining", icon: LoaderCircle, tone: "amber" },
  { key: "newTodayReports", label: "New Today", icon: FileClock, tone: "violet" },
];

/** Entry page for the staff-dashboard feature — GET /api/dashboard/staff. */
export default function StaffDashboardPage() {
  const { t } = useLanguage();
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
                icon={card.icon}
                tone={card.tone}
              />
            ))}
          </div>

          <div className="flex gap-6">
            <div className="flex-1 rounded-console border border-console-border bg-surface p-6">
              <h2 className="font-display text-base font-bold text-ink">{t("Report locations")}</h2>
              <div className="mt-4 h-[234px] overflow-hidden rounded-md">
                <ReportMap pins={pins} interactive={false} cluster fitToPins />
              </div>
            </div>

            <div className="flex-1 rounded-console border border-console-border bg-surface p-6">
              <h2 className="font-display text-base font-bold text-ink">{t("Monthly reports per department")}</h2>
              <div className="mt-4">
                <DepartmentsChart data={summary?.volumeByDepartment} />
              </div>
            </div>
          </div>

          <RecentReportsTable reports={summary?.recentReports} />
        </>
      )}
    </div>
  );
}
