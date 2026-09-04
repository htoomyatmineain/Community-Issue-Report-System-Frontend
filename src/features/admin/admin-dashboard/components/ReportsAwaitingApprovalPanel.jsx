import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import DenyReasonDialog from "./DenyReasonDialog";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "—";

/** Admin dashboard panel — ui-rules.md: "Reports awaiting approval" with inline Approve / Deny. */
export default function ReportsAwaitingApprovalPanel({ reports, onApprove, onReject }) {
  const [denyTarget, setDenyTarget] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  async function handleApprove(report) {
    setApprovingId(report.id);
    try {
      await onApprove(report.id);
      toast.success("Approved");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to approve report");
    } finally {
      setApprovingId(null);
    }
  }

  return (
    <div className="flex-1 rounded-console border border-console-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-bold text-ink">Reports awaiting approval</h2>
        <Link to="/admin/report-approvals" className="text-xs font-semibold text-brand hover:underline">
          View all
        </Link>
      </div>

      <div className="mt-4">
        {!reports?.length ? (
          <EmptyState title="No reports waiting" description="New citizen reports will show up here." />
        ) : (
          <ul>
            {reports.map((report) => (
              <li
                key={report.id}
                className="flex items-center justify-between gap-3 border-b border-console-border py-3 last:border-0"
              >
                <div className="flex min-w-0 flex-col">
                  <Link to={`/admin/reports/${report.id}`} className="truncate text-[13px] font-semibold text-ink hover:underline">
                    {report.title}
                  </Link>
                  <span className="truncate text-xs text-ink-muted">
                    {report.categoryName} · {formatDate(report.createdAt)}
                  </span>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-status-resolved text-status-resolved hover:bg-status-resolved-bg"
                    disabled={approvingId === report.id}
                    onClick={() => handleApprove(report)}
                  >
                    <Check className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => setDenyTarget(report)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <DenyReasonDialog
        open={Boolean(denyTarget)}
        onOpenChange={(open) => !open && setDenyTarget(null)}
        title="Deny report"
        description={denyTarget && `"${denyTarget.title}" will be sent back to the reporter with the reason below.`}
        onDeny={async (reason) => {
          await onReject(denyTarget.id, reason);
          toast.success("Denied");
        }}
      />
    </div>
  );
}
