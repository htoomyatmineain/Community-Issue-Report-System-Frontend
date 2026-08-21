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

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function AdminReportApprovalsPage() {
  const { pending, isLoading, error, approve, reject } = useAdminReportApprovals();
  const [denyTarget, setDenyTarget] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  async function handleApprove(report) {
    setApprovingId(report.id);
    try {
      await approve(report.id);
      toast.success("Approved");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to approve report");
    } finally {
      setApprovingId(null);
    }
  }

  async function handleDeny(id, reason) {
    await reject(id, reason);
    toast.success("Denied");
  }

  return (
    <div>
      <PageHeader title="Report approvals" description="New citizen reports waiting for review." />

      <div className="rounded-console border border-console-border bg-surface">
        {isLoading ? (
          <div className="p-6 text-sm text-ink-muted">Loading pending reports…</div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">{error}</div>
        ) : pending.length === 0 ? (
          <EmptyState title="No reports waiting" description="New citizen reports will show up here." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-mono text-xs text-ink-muted">{report.reportCode}</TableCell>
                  <TableCell className="font-medium text-ink">
                    <Link to={`/admin/reports/${report.id}`} className="hover:underline">
                      {report.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-ink-muted">{report.categoryName}</TableCell>
                  <TableCell className="text-ink-muted">{report.reporterName ?? "—"}</TableCell>
                  <TableCell className="text-ink-muted">{formatDate(report.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-status-resolved text-status-resolved hover:bg-status-resolved-bg"
                      disabled={approvingId === report.id}
                      onClick={() => handleApprove(report)}
                    >
                      <Check className="size-4" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2 border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => setDenyTarget(report)}
                    >
                      <X className="size-4" /> Deny
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
