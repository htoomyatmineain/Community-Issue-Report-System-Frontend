import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Clock,
  ShieldCheck,
  ArrowRight,
  FileText,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import PriorityBadge from "@/components/common/PriorityBadge";
import StatusBadge from "@/components/common/StatusBadge";
import { categoryIcon } from "@/lib/categoryIcons";
import { Button } from "@/components/ui/button";
import { cn, formatDuration } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "—";

/**
 * Administrative Work Queues & Triage Hub.
 * Consolidates fragmented escalation and approval queues into a unified, high-density tabbed workbench:
 * 1. Overdue & At-Risk Incidents (SLA escalation queue)
 * 2. Reports Awaiting Approval (New incident verification queue)
 * 3. Citizen Registrations (New citizen identity/NRC verification queue)
 */
export default function AdminActionQueuesHub({
  breachedReports = [],
  reportsAwaitingApproval = [],
  recentRegistrations = [],
  breachedCount = 0,
  atRiskCount = 0,
  pendingReportCount = 0,
  pendingAccountCount = 0,
}) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("ESCALATIONS"); // 'ESCALATIONS' | 'REPORTS' | 'ACCOUNTS'

  const pendingRegistrations = (recentRegistrations ?? []).filter(
    (user) => !user.accountStatus || user.accountStatus === "PENDING"
  );

  const totalEscalations = breachedCount + atRiskCount;
  const effectivePendingReports = pendingReportCount || reportsAwaitingApproval?.length || 0;
  const effectivePendingAccounts = pendingAccountCount || pendingRegistrations?.length || 0;

  return (
    <div className="flex flex-col rounded-xl border border-console-border/70 bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* Header and Queue Tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-console-border/50 pb-4">
        <div>
          <h2 className="font-display text-sm font-semibold tracking-tight text-ink flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-rose-500 animate-pulse" />
            {t("Administrative Triage & Work Queues")}
          </h2>
          <p className="mt-0.5 text-xs text-ink-muted">
            {t("Consolidated action center for SLA escalations, pending report verification, and citizen registration review.")}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-lg border border-console-border/70 bg-surface-muted/50 p-0.5 text-xs">
          {/* Tab 1: SLA Escalations */}
          <button
            type="button"
            onClick={() => setActiveTab("ESCALATIONS")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors",
              activeTab === "ESCALATIONS"
                ? "bg-surface text-ink shadow-xs"
                : "text-ink-muted hover:text-ink"
            )}
          >
            <Clock className="size-3 text-rose-500" />
            <span>{t("SLA Escalations")}</span>
            {totalEscalations > 0 && (
              <span className="rounded-full bg-rose-500/15 px-1.5 py-0.2 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                {totalEscalations}
              </span>
            )}
          </button>

          {/* Tab 2: Report Approvals */}
          <button
            type="button"
            onClick={() => setActiveTab("REPORTS")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors",
              activeTab === "REPORTS"
                ? "bg-surface text-ink shadow-xs"
                : "text-ink-muted hover:text-ink"
            )}
          >
            <FileText className="size-3 text-brand" />
            <span>{t("Report Approvals")}</span>
            {effectivePendingReports > 0 && (
              <span className="rounded-full bg-brand/15 px-1.5 py-0.2 text-[10px] font-bold text-brand">
                {effectivePendingReports}
              </span>
            )}
          </button>

          {/* Tab 3: Citizen Signups */}
          <button
            type="button"
            onClick={() => setActiveTab("ACCOUNTS")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors",
              activeTab === "ACCOUNTS"
                ? "bg-surface text-ink shadow-xs"
                : "text-ink-muted hover:text-ink"
            )}
          >
            <UserCheck className="size-3 text-amber-500" />
            <span>{t("Citizen Signups")}</span>
            {effectivePendingAccounts > 0 && (
              <span className="rounded-full bg-amber-500/15 px-1.5 py-0.2 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                {effectivePendingAccounts}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab 1 Content: SLA Escalations */}
      {activeTab === "ESCALATIONS" && (
        <div className="mt-4 flex flex-col">
          <div className="flex items-center justify-between text-xs text-ink-muted mb-3">
            <span>
              {t("Active tickets requiring immediate operational intervention due to approaching or passed deadlines.")}
            </span>
            <Link
              to="/admin/reports?status=IN_PROGRESS"
              className="text-xs font-medium text-brand hover:underline shrink-0"
            >
              {t("View all active")} →
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-console-border/50">
            {breachedReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-xs text-ink-muted">
                <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
                  <ShieldCheck className="size-5" />
                </div>
                <span className="font-semibold text-ink">{t("Zero SLA Breaches")}</span>
                <span className="mt-0.5 text-ink-muted/80">
                  {t("All active tickets are within target municipal resolution windows.")}
                </span>
              </div>
            ) : (
              breachedReports.slice(0, 6).map((r) => {
                const CatIcon = categoryIcon(r);
                const isBreached = r.sla?.status === "BREACHED";

                return (
                  <div
                    key={r.id}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 py-3 transition-colors hover:bg-surface-muted/30 -mx-2 px-2 rounded-lg"
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-console-border bg-surface-muted/60 mt-0.5">
                        <CatIcon className="size-4" style={{ color: r.categoryColor ?? undefined }} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/reports/${r.id}`}
                            className="truncate text-[13px] font-semibold text-ink hover:text-brand"
                          >
                            {r.title}
                          </Link>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                          <span className="font-mono text-[11px]">{r.reportCode}</span>
                          <span>·</span>
                          <span className="truncate">{r.categoryName}</span>
                          {r.departmentName && (
                            <>
                              <span>·</span>
                              <span className="truncate font-medium">{r.departmentName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                      <PriorityBadge priority={r.priority} />
                      <StatusBadge status={r.status} />

                      <div
                        className={cn(
                          "flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold",
                          isBreached
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        )}
                      >
                        <Clock className="size-3" />
                        <span>
                          {isBreached
                            ? `+${formatDuration(r.sla?.overdueHours)} overdue`
                            : `${formatDuration(r.sla?.elapsedHours)} elapsed`}
                        </span>
                      </div>

                      <Link
                        to={`/admin/reports/${r.id}`}
                        className="flex size-7 items-center justify-center rounded-md border border-console-border text-ink-muted hover:border-brand hover:text-brand hover:bg-surface-muted transition-colors"
                        title={t("Open ticket detail")}
                      >
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2 Content: Reports Awaiting Approval */}
      {activeTab === "REPORTS" && (
        <div className="mt-4 flex flex-col">
          <div className="flex items-center justify-between text-xs text-ink-muted mb-3">
            <span>
              {t("Newly submitted citizen reports requiring verification before automated department dispatch.")}
            </span>
            <Link
              to="/admin/report-approvals"
              className="text-xs font-medium text-brand hover:underline shrink-0"
            >
              {t("Manage approvals queue")} →
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-console-border/60">
            {!reportsAwaitingApproval?.length ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-xs text-ink-muted">
                <CheckCircle2 className="size-6 text-emerald-500 mb-2" />
                <span className="font-semibold text-ink">{t("No Reports Awaiting Approval")}</span>
                <span className="mt-0.5 text-ink-muted/80">{t("New citizen reports will show up here.")}</span>
              </div>
            ) : (
              reportsAwaitingApproval.slice(0, 6).map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between gap-3 py-3 px-2 -mx-2 rounded-lg hover:bg-surface-muted/40 transition-colors"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-[13px] font-semibold tracking-tight text-ink">
                      {report.title}
                    </span>
                    <span className="truncate text-xs text-ink-muted mt-0.5">
                      <span className="font-mono text-[11px]">{report.reportCode}</span> ·{" "}
                      {report.categoryName} · {formatDate(report.createdAt)}
                    </span>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-7 shrink-0 px-2.5 text-xs rounded-lg active:scale-95"
                  >
                    <Link to={`/admin/reports/${report.id}`}>{t("Review & Approve")}</Link>
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3 Content: Citizen Registrations */}
      {activeTab === "ACCOUNTS" && (
        <div className="mt-4 flex flex-col">
          <div className="flex items-center justify-between text-xs text-ink-muted mb-3">
            <span>
              {t("Citizen signup applications awaiting NRC identity verification and activation.")}
            </span>
            <Link
              to="/admin/approvals"
              className="text-xs font-medium text-brand hover:underline shrink-0"
            >
              {t("Manage account approvals")} →
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-console-border/60">
            {!pendingRegistrations.length ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-xs text-ink-muted">
                <CheckCircle2 className="size-6 text-emerald-500 mb-2" />
                <span className="font-semibold text-ink">{t("No Pending Registrations")}</span>
                <span className="mt-0.5 text-ink-muted/80">{t("New citizen signups will show up here.")}</span>
              </div>
            ) : (
              pendingRegistrations.slice(0, 6).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-3 py-3 px-2 -mx-2 rounded-lg hover:bg-surface-muted/40 transition-colors"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-[13px] font-semibold tracking-tight text-ink">
                      {user.fullName}
                    </span>
                    <span className="truncate text-xs text-ink-muted mt-0.5">
                      {user.email} · {formatDate(user.createdAt)}
                    </span>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-7 shrink-0 px-2.5 text-xs rounded-lg active:scale-95"
                  >
                    <Link to={`/admin/approvals/${user.id}`}>{t("Verify Account")}</Link>
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
