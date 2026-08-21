import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useAdminApprovals } from "../hooks/useAdminApprovals";
import DenyAccountDialog from "./DenyAccountDialog";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function AdminApprovalsPage() {
  const { pending, isLoading, error, approve, reject } = useAdminApprovals();
  const [denyTarget, setDenyTarget] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  async function handleApprove(citizen) {
    setApprovingId(citizen.id);
    try {
      await approve(citizen.id);
      toast.success("Approved");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to approve account");
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
      <PageHeader title="Account approvals" description="New citizen signups waiting for review." />

      <div className="rounded-console border border-console-border bg-surface">
        {isLoading ? (
          <div className="p-6 text-sm text-ink-muted">Loading pending accounts…</div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">{error}</div>
        ) : pending.length === 0 ? (
          <EmptyState title="No accounts waiting" description="New citizen signups will show up here." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>NRC number</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((citizen) => (
                <TableRow key={citizen.id}>
                  <TableCell className="font-medium text-ink">{citizen.fullName}</TableCell>
                  <TableCell className="text-ink-muted">{citizen.email}</TableCell>
                  <TableCell className="text-ink-muted">{citizen.phone || "—"}</TableCell>
                  <TableCell className="text-ink-muted">{citizen.nrcNumber || "—"}</TableCell>
                  <TableCell className="text-ink-muted">{formatDate(citizen.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-status-resolved text-status-resolved hover:bg-status-resolved-bg"
                      disabled={approvingId === citizen.id}
                      onClick={() => handleApprove(citizen)}
                    >
                      <Check className="size-4" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2 border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => setDenyTarget(citizen)}
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

      <DenyAccountDialog
        open={Boolean(denyTarget)}
        onOpenChange={(open) => !open && setDenyTarget(null)}
        citizen={denyTarget}
        onDeny={handleDeny}
      />
    </div>
  );
}
