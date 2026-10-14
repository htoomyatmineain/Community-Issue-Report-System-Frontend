import { useState } from "react";
import { Check, X, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useAdminReportApprovals } from "../hooks/useAdminReportApprovals";
import DenyReportDialog from "./DenyReportDialog";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function AdminReportApprovalsPage() {
  const { t } = useLanguage();
  const { pending, isLoading, error, approve, reject } = useAdminReportApprovals();
  const [denyTarget, setDenyTarget] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [filter, setFilter] = useState("ALL"); // 'ALL' | 'FLAGGED' | 'STANDARD'

  const flaggedReports = pending.filter(
    (r) => r.aiFlags && (r.aiFlags.includes("BLURRY") || r.aiFlags.includes("MISMATCH") || r.aiFlags.includes("HAZARD"))
  );
  const standardReports = pending.filter(
    (r) => !flaggedReports.some((f) => f.id === r.id)
  );

  const displayedReports =
    filter === "FLAGGED" ? flaggedReports : filter === "STANDARD" ? standardReports : pending;

  async function handleApprove(report) {
    setApprovingId(report.id);
    try {
      await approve(report.id);
      toast.success(t('Report {code} approved — routed to its department.', { code: report.reportCode }));
    } catch (err) {
      toast.error(err?.response?.data?.message ?? t("Failed to approve report"));
    } finally {
      setApprovingId(null);
    }
  }

  async function handleDeny(id, reason) {
    const report = pending.find((r) => r.id === id);
    await reject(id, reason);
    toast.success(
      report
        ? t("Report {code} denied and the reporter notified.", { code: report.reportCode })
        : t("Report denied and the reporter notified.")
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <PageHeader title="Report approvals" description="New citizen reports waiting for review." />

        {/* Filter pills */}
        <div className="flex items-center gap-1 self-start sm:self-auto rounded-lg border border-console-border/70 bg-surface-muted/40 p-1 text-xs">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium transition-colors",
              filter === "ALL" ? "bg-surface text-ink shadow-xs" : "text-ink-muted hover:text-ink"
            )}
          >
            {t("All Pending")} ({pending.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("FLAGGED")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-colors",
              filter === "FLAGGED" ? "bg-surface text-ink shadow-xs" : "text-ink-muted hover:text-ink"
            )}
          >
            <AlertTriangle className="size-3 text-amber-500" />
            <span>{t("AI Flagged")}</span>
            {flaggedReports.length > 0 && (
              <span className="rounded-full bg-amber-500/15 px-1.5 py-0.2 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                {flaggedReports.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setFilter("STANDARD")}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium transition-colors",
              filter === "STANDARD" ? "bg-surface text-ink shadow-xs" : "text-ink-muted hover:text-ink"
            )}
          >
            {t("Standard")} ({standardReports.length})
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-console-border/70 bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-ink-muted">{t("Loading pending reports…")}</div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">{error}</div>
        ) : displayedReports.length === 0 ? (
          <EmptyState title="No reports waiting" description="No reports match this queue filter." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Code")}</TableHead>
                <TableHead>{t("Title")}</TableHead>
                <TableHead>{t("Category")}</TableHead>
                <TableHead>{t("AI Triage")}</TableHead>
                <TableHead>{t("Reporter")}</TableHead>
                <TableHead>{t("Submitted")}</TableHead>
                <TableHead className="text-right">{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-mono text-xs text-ink-muted">{report.reportCode}</TableCell>
                  <TableCell className="font-medium text-ink tracking-tight">
                    <Link to={`/admin/reports/${report.id}`} className="hover:underline">
                      {report.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs text-ink-muted">{report.categoryName}</TableCell>
                  <TableCell>
                    {report.aiFlags?.includes("BLURRY_PHOTO") ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                        <AlertTriangle className="size-2.5" /> {t("Blurry Photo")}
                      </span>
                    ) : report.aiFlags?.includes("DESCRIPTION_MISMATCH") ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/25 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-300">
                        <AlertTriangle className="size-2.5" /> {t("Mismatch")}
                      </span>
                    ) : report.aiFlags?.includes("HIGH_RISK_HAZARD") ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/25 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-300">
                        <AlertTriangle className="size-2.5" /> {t("Safety Hazard")}
                      </span>
                    ) : report.aiConfidenceScore ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted border border-console-border px-2 py-0.5 text-[10px] font-mono text-ink-muted">
                        <Sparkles className="size-2.5 text-brand" /> {report.aiConfidenceScore}%
                      </span>
                    ) : (
                      <span className="text-xs text-ink-muted">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-ink-muted">{report.reporterName ?? "—"}</TableCell>
                  <TableCell className="text-xs text-ink-muted tabular-nums">{formatDate(report.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2.5 text-xs rounded-lg border-status-resolved/30 text-status-resolved hover:bg-status-resolved-bg active:scale-95 transition-all"
                      disabled={approvingId === report.id}
                      onClick={() => handleApprove(report)}
                    >
                      <Check className="size-3.5 mr-1" /> {t("Approve")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-1.5 h-7 px-2.5 text-xs rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10 active:scale-95 transition-all"
                      onClick={() => setDenyTarget(report)}
                    >
                      <X className="size-3.5 mr-1" /> {t("Deny")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <DenyReportDialog
        open={Boolean(denyTarget)}
        onOpenChange={(open) => !open && setDenyTarget(null)}
        report={denyTarget}
        onDeny={handleDeny}
      />
    </div>
  );
}
