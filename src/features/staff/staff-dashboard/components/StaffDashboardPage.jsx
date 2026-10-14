import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { useDepartmentName } from "@/hooks/useDepartmentName";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useStaffDashboard } from "../hooks/useStaffDashboard";
import DemoNoticeBanner from "@/features/admin/admin-dashboard/components/DemoNoticeBanner";
import StaffKpiGrid from "./StaffKpiGrid";
import StaffTrendsCard from "./StaffTrendsCard";
import StaffWorkloadPanel from "./StaffWorkloadPanel";
import StaffEscalationPanel from "./StaffEscalationPanel";
import RecentReportsTable from "./RecentReportsTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Layers,
  Activity,
  BarChart3,
  Clock,
  FileText,
} from "lucide-react";

/**
 * Operational Decision-Support System Dashboard (/staff).
 * Groups municipal department operations into 4 structured, cohesive tiers:
 * 1. Operational Velocity & Telemetry KPIs (StaffKpiGrid)
 * 2. Immediate Incident Escalation & SLA Queue (StaffEscalationPanel)
 * 3. Department Workload Balance & Intake Trends (StaffTrendsCard + StaffWorkloadPanel)
 * 4. Department Report Activity Feed (RecentReportsTable)
 * Includes a responsive view selection dropdown for focused workflows.
 */
export default function StaffDashboardPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const departmentName = useDepartmentName(user?.departmentId);
  const [activeSection, setActiveSection] = useState("ALL"); // 'ALL' | 'KPIS' | 'ESCALATIONS' | 'TRENDS' | 'REPORTS'
  const { summary, analytics, isLoading, error } = useStaffDashboard();

  const escalationCount =
    (analytics?.sla?.breachedCount ?? 0) + (analytics?.sla?.atRiskCount ?? 0);
  const activeWorkloadCount = analytics?.workload?.totalActive ?? 0;
  const recentReportsCount = summary?.recentReports?.length ?? 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Executive Operational Header with View Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            {departmentName ? `${t(departmentName)} — ${t("Operations Cockpit")}` : t("Staff Operations Cockpit")}
          </h1>
          <p className="mt-1 text-sm text-ink-muted leading-relaxed">
            {t("Real-time decision support, municipal SLA compliance, and field crew workload dispatch.")}
          </p>
        </div>

        {/* Section View Dropdown Menu */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <label className="text-xs font-medium text-ink-muted">
            {t("Dashboard View Selection")}
          </label>
          <Select value={activeSection} onValueChange={setActiveSection}>
            <SelectTrigger className="w-[230px] h-9 rounded-xl border-console-border/80 bg-surface px-3 text-xs font-semibold text-ink shadow-xs hover:border-brand/40 focus:ring-1 focus:ring-brand">
              <SelectValue placeholder={t("Select View")} />
            </SelectTrigger>
            <SelectContent align="end" className="w-[240px] rounded-xl border-console-border bg-surface p-1 shadow-lg text-xs">
              <SelectItem value="ALL" className="rounded-lg py-2 text-xs font-medium cursor-pointer">
                <div className="flex items-center gap-2">
                  <Layers className="size-3.5 text-brand shrink-0" />
                  <span>{t("All Overview")}</span>
                </div>
              </SelectItem>

              <SelectItem value="KPIS" className="rounded-lg py-2 text-xs font-medium cursor-pointer">
                <div className="flex items-center gap-2">
                  <Activity className="size-3.5 text-brand shrink-0" />
                  <span>{t("Operational KPIs")}</span>
                </div>
              </SelectItem>

              <SelectItem value="ESCALATIONS" className="rounded-lg py-2 text-xs font-medium cursor-pointer">
                <div className="flex items-center justify-between w-full pr-1">
                  <div className="flex items-center gap-2">
                    <Clock className="size-3.5 text-rose-500 shrink-0" />
                    <span>{t("SLA Escalations")}</span>
                  </div>
                  {escalationCount > 0 && (
                    <span className="rounded-full bg-rose-500/15 px-1.5 py-0.2 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                      {escalationCount}
                    </span>
                  )}
                </div>
              </SelectItem>

              <SelectItem value="TRENDS" className="rounded-lg py-2 text-xs font-medium cursor-pointer">
                <div className="flex items-center justify-between w-full pr-1">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="size-3.5 text-brand shrink-0" />
                    <span>{t("Workload & Trends")}</span>
                  </div>
                  {activeWorkloadCount > 0 && (
                    <span className="rounded-full bg-brand/10 px-1.5 py-0.2 text-[10px] font-bold text-brand">
                      {activeWorkloadCount}
                    </span>
                  )}
                </div>
              </SelectItem>

              <SelectItem value="REPORTS" className="rounded-lg py-2 text-xs font-medium cursor-pointer">
                <div className="flex items-center justify-between w-full pr-1">
                  <div className="flex items-center gap-2">
                    <FileText className="size-3.5 text-brand shrink-0" />
                    <span>{t("Recent Activity")}</span>
                  </div>
                  {recentReportsCount > 0 && (
                    <span className="rounded-full bg-surface-muted px-1.5 py-0.2 text-[10px] font-bold text-ink-muted">
                      {recentReportsCount}
                    </span>
                  )}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Simulated Dataset Transparency Notice */}
      <DemoNoticeBanner
        meta={{
          totalReports: analytics?.totalRecords ?? summary?.totalReports ?? 28,
          activeDepartments: 1,
        }}
      />

      {error ? (
        <div className="rounded-xl border border-console-border/70 bg-surface p-6 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <>
          {/* GROUP 1: Operational Velocity & Telemetry KPIs */}
          {(activeSection === "ALL" || activeSection === "KPIS") && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  {t("1. Operational Velocity & Telemetry KPIs")}
                </span>
                <span className="h-px flex-1 bg-console-border/70" />
              </div>

              {/* Actionable Decision-Support KPI Grid */}
              <StaffKpiGrid analytics={analytics} isLoading={isLoading} />
            </section>
          )}

          {/* GROUP 2: Immediate Incident Escalation & SLA Queue */}
          {(activeSection === "ALL" || activeSection === "ESCALATIONS") && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                    {t("2. Immediate Incident Escalation & SLA Queue")}
                  </span>
                  <span className="h-px flex-1 bg-console-border/70 mr-4" />
                </div>
                {escalationCount > 0 && (
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    {escalationCount} {t("tickets breached or at-risk")}
                  </span>
                )}
              </div>

              {/* Immediate Action & Escalation Queue */}
              <StaffEscalationPanel reports={analytics?.escalationQueue} />
            </section>
          )}

          {/* GROUP 3: Department Workload Balance & Intake Trends */}
          {(activeSection === "ALL" || activeSection === "TRENDS") && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  {t("3. Department Workload & Activity Trends")}
                </span>
                <span className="h-px flex-1 bg-console-border/70" />
              </div>

              {/* Operational Analytics: Trends & Workload Balance */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <StaffTrendsCard monthlySeries={analytics?.monthlySeries} />
                <StaffWorkloadPanel
                  categoryBreakdown={analytics?.categoryBreakdown}
                  totalActive={analytics?.workload?.totalActive}
                />
              </div>
            </section>
          )}

          {/* GROUP 4: Department Report Activity Feed */}
          {(activeSection === "ALL" || activeSection === "REPORTS") && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                    {t("4. Department Report Activity Feed")}
                  </span>
                  <span className="h-px flex-1 bg-console-border/70 mr-4" />
                </div>
                <Link
                  to="/staff/reports"
                  className="text-xs font-medium text-brand hover:underline"
                >
                  {t("View full report archive")}
                </Link>
              </div>

              {/* Recent Department Reports Table */}
              <RecentReportsTable reports={summary?.recentReports} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
