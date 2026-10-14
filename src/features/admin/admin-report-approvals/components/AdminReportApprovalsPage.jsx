import { useState } from "react";
import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useAdminReportApprovals } from "../hooks/useAdminReportApprovals";
import DenyReportDialog from "./DenyReportDialog";
import { useLanguage } from "@/app/providers/LanguageProvider";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function AdminReportApprovalsPage() {
  const { t } = useLanguage();
  const { pending, isLoading, error, approve, reject } = useAdminReportApprovals();
  const [denyTarget, setDenyTarget] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

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
      <PageHeader title="Report approvals" description="New citizen reports waiting for review." />

      <div className="rounded-xl border border-console-border/70 bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-ink-muted">{t("Loading pending reports…")}</div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">{error}</div>
        ) : pending.length === 0 ? (
          <EmptyState title="No reports waiting" description="New citizen reports will show up here." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Code")}</TableHead>
                <TableHead>{t("Title")}</TableHead>
                <TableHead>{t("Category")}</TableHead>
                <TableHead>{t("Reporter")}</TableHead>
                <TableHead>{t("Submitted")}</TableHead>
                <TableHead className="text-right">{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-mono text-xs text-ink-muted">{report.reportCode}</TableCell>
                  <TableCell className="font-medium text-ink tracking-tight">
                    <Link to={`/admin/reports/${report.id}`} className="hover:underline">
                      {report.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs text-ink-muted">{report.categoryName}</TableCell>
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
