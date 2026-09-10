import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import DenyReasonDialog from "./DenyReasonDialog";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "—";

/** Admin dashboard panel — ui-rules.md: "10 most recent registrations" with inline Approve / Deny. */
export default function RecentRegistrationsPanel({ registrations, onApprove, onReject }) {
  const [denyTarget, setDenyTarget] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  // Inline approve/deny only works on accounts still awaiting a decision. The
  // API scopes this list to PENDING; keep a guard so a stale response can't
  // put action buttons on an already-approved citizen.
  const pending = (registrations ?? []).filter(
    (user) => !user.accountStatus || user.accountStatus === "PENDING",
  );

  async function handleApprove(user) {
    setApprovingId(user.id);
    try {
      await onApprove(user.id);
      toast.success("Approved");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to approve account");
    } finally {
      setApprovingId(null);
    }
  }

  return (
    <div className="flex-1 rounded-console border border-console-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-bold text-ink">Recent registrations</h2>
        <Link to="/admin/approvals" className="text-xs font-semibold text-brand hover:underline">
          View all
        </Link>
      </div>

      <div className="mt-4">
        {!pending.length ? (
          <EmptyState title="No new registrations" description="New citizen signups will show up here." />
        ) : (
          <ul>
            {pending.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between gap-3 border-b border-console-border py-3 last:border-0"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-[13px] font-semibold text-ink">{user.fullName}</span>
                  <span className="truncate text-xs text-ink-muted">
                    {user.email} · {formatDate(user.createdAt)}
                  </span>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-status-resolved text-status-resolved hover:bg-status-resolved-bg"
                    disabled={approvingId === user.id}
                    onClick={() => handleApprove(user)}
                  >
                    <Check className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => setDenyTarget(user)}
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
        title="Deny account"
        description={denyTarget && `"${denyTarget.fullName}" will be notified with the reason below.`}
        onDeny={async (reason) => {
          await onReject(denyTarget.id, reason);
          toast.success("Denied");
        }}
      />
    </div>
  );
}
