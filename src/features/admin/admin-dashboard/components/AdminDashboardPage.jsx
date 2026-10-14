import { useState } from "react";
import ActivityOverviewCard from "./ActivityOverviewCard";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import ActionableKpiGrid from "./ActionableKpiGrid";
import AdminDecisionSupportPanel from "./AdminDecisionSupportPanel";
import AtRiskReportsPanel from "./AtRiskReportsPanel";
import ReportsAwaitingApprovalPanel from "./ReportsAwaitingApprovalPanel";
import RecentRegistrationsPanel from "./RecentRegistrationsPanel";
import DepartmentWorkloadPanel from "./DepartmentWorkloadPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, BarChart3, Clock, CheckSquare, Layers } from "lucide-react";

/**
 * Executive Municipal Decision-Support Dashboard (/admin).
 * Groups municipal data into clearly labeled, cohesive operational sections:
 * 1. Executive Decision Support & City-Wide Velocity (DSS + KPI Grid)
 * 2. Administrative Approvals & Verification (Reports Awaiting Approval + Citizen Signups)
 * 3. Immediate Escalation Queue (SLA-Breached & At-Risk Reports)
 * 4. Municipal Operations & Workload Balance (Department Workload + Activity Trends)
 */
export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState("ALL"); // 'ALL' | 'DECISIONS' | 'APPROVALS' | 'ESCALATIONS' | 'OPERATIONS'
  const { summary, categoryVolume, analytics, recommendations, dismissRecommendation, isLoading, error } =
    useAdminDashboard();

  const pendingApprovalsCount =
    (summary?.pendingReportCount || 0) + (summary?.pendingAccountCount || 0);
  const slaIssuesCount =
    (analytics?.sla?.breachedCount || 0) + (analytics?.sla?.atRiskCount || 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Executive Header with Perspective Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            {t("Admin Dashboard")}
          </h1>
          <p className="mt-1 text-sm text-ink-muted leading-relaxed">
            {t("City-wide operational velocity, SLA compliance, and municipal workload dispatch.")}
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

              <SelectItem value="DECISIONS" className="rounded-lg py-2 text-xs font-medium cursor-pointer">
                <div className="flex items-center justify-between w-full pr-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-3.5 text-brand shrink-0" />
                    <span>{t("Decision Support")}</span>
                  </div>
                  {recommendations.length > 0 && (
                    <span className="rounded-full bg-brand/10 px-1.5 py-0.2 text-[10px] font-bold text-brand">
                      {recommendations.length}
                    </span>
                  )}
                </div>
              </SelectItem>

              <SelectItem value="APPROVALS" className="rounded-lg py-2 text-xs font-medium cursor-pointer">
                <div className="flex items-center justify-between w-full pr-1">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="size-3.5 text-amber-500 shrink-0" />
                    <span>{t("Approvals Queue")}</span>
                  </div>
                  {pendingApprovalsCount > 0 && (
                    <span className="rounded-full bg-amber-500/15 px-1.5 py-0.2 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      {pendingApprovalsCount}
                    </span>
                  )}
                </div>
              </SelectItem>

              <SelectItem value="ESCALATIONS" className="rounded-lg py-2 text-xs font-medium cursor-pointer">
                <div className="flex items-center justify-between w-full pr-1">
                  <div className="flex items-center gap-2">
                    <Clock className="size-3.5 text-rose-500 shrink-0" />
                    <span>{t("SLA Escalations")}</span>
                  </div>
                  {slaIssuesCount > 0 && (
                    <span className="rounded-full bg-rose-500/15 px-1.5 py-0.2 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                      {slaIssuesCount}
                    </span>
                  )}
                </div>
              </SelectItem>

              <SelectItem value="OPERATIONS" className="rounded-lg py-2 text-xs font-medium cursor-pointer">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-3.5 text-brand shrink-0" />
                  <span>{t("Operations & Trends")}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-console-border/70 bg-surface p-6 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <>
          {/* GROUP 1: Executive Decision Support & City-Wide Velocity */}
          {(activeSection === "ALL" || activeSection === "DECISIONS") && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  {t("1. Executive Decision Support & Velocity")}
                </span>
                <span className="h-px flex-1 bg-console-border/70" />
              </div>

              {/* Explainable Decision Support System (DSS) Recommendations */}
              <AdminDecisionSupportPanel
                recommendations={recommendations}
                onDismiss={dismissRecommendation}
                isLoading={isLoading}
                isDemoData={analytics?.isDemoData ?? true}
              />

              {/* Actionable Executive KPIs Grid */}
              <ActionableKpiGrid analytics={analytics} isLoading={isLoading} />
            </section>
          )}

          {/* GROUP 2: Administrative Approvals & Verification Queues */}
          {(activeSection === "ALL" || activeSection === "APPROVALS") && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                    {t("2. Administrative Approvals & Verification")}
                  </span>
                  <span className="h-px flex-1 bg-console-border/70 mr-4" />
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-ink-muted font-medium">
                  <span>{summary?.reportsAwaitingApproval?.length ?? 0} {t("reports pending")}</span>
                  <span>·</span>
                  <span>
                    {(summary?.recentRegistrations ?? []).filter((u) => !u.accountStatus || u.accountStatus === "PENDING").length}{" "}
                    {t("signups pending")}
                  </span>
                </div>
              </div>

              {/* Directly visible side-by-side: Reports Awaiting Approval & Citizen Registrations */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ReportsAwaitingApprovalPanel reports={summary?.reportsAwaitingApproval} />
                <RecentRegistrationsPanel registrations={summary?.recentRegistrations} />
              </div>
            </section>
          )}

          {/* GROUP 3: Immediate Escalation Queue (SLA-Breached & At-Risk Reports) */}
          {(activeSection === "ALL" || activeSection === "ESCALATIONS") && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  {t("3. Incident Escalation & SLA Queue")}
                </span>
                <span className="h-px flex-1 bg-console-border/70" />
              </div>

              <AtRiskReportsPanel reports={analytics?.sla?.breachedReports} />
            </section>
          )}

          {/* GROUP 4: Municipal Operations & Capacity Balance */}
          {(activeSection === "ALL" || activeSection === "OPERATIONS") && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  {t("4. Municipal Operations & Service Trends")}
                </span>
                <span className="h-px flex-1 bg-console-border/70" />
              </div>

              {/* Department Workload & Activity Overview Grid */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <DepartmentWorkloadPanel departments={analytics?.departments} />

                <ActivityOverviewCard
                  monthlyTrends={analytics?.monthlyTrends}
                  categoryVolume={categoryVolume}
                />
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}


