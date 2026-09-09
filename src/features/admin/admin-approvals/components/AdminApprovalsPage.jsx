import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useAdminApprovals } from "../hooks/useAdminApprovals";
import DenyAccountDialog from "./DenyAccountDialog";
import { useLanguage } from "@/app/providers/LanguageProvider";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const BADGE_BASE =
  "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[0.75rem] uppercase tracking-wider";
const REVIEW_BADGE = {
  approved: "bg-emerald-500/10 text-emerald-400",
  denied: "bg-rose-500/10 text-rose-400",
};

export default function AdminApprovalsPage() {
  const { t } = useLanguage();
  const { pending, approved, denied, isLoading, error, approve, reject } = useAdminApprovals();
  const [tab, setTab] = useState("pending");
  const [denyTarget, setDenyTarget] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  async function handleApprove(citizen) {
    setApprovingId(citizen.id);
    try {
      await approve(citizen.id);
      toast.success(t("Approved"));
    } catch (err) {
      toast.error(err?.response?.data?.message ?? t("Failed to approve account"));
    } finally {
      setApprovingId(null);
    }
  }

  async function handleDeny(id, reason) {
    await reject(id, reason);
    toast.success(t("Denied"));
  }

  const isPending = tab === "pending";
  const rows = isPending ? pending : tab === "approved" ? approved : denied;

  const TABS = [
    { id: "pending", label: `${t("Pending")} (${pending.length})` },
    { id: "approved", label: t("Approved") },
    { id: "denied", label: t("Denied") },
  ];

  const emptyCopy = {
    pending: { title: "No accounts waiting", description: "New citizen signups will show up here." },
    approved: {
      title: "No approved accounts yet",
      description: "Reviewed accounts appear here with who actioned them and when.",
    },
    denied: {
      title: "No denied accounts yet",
      description: "Reviewed accounts appear here with who actioned them and when.",
    },
  }[tab];

  return (
    <div>
      <PageHeader
        title="Account approvals"
        description="Review new citizen signups and track who actioned each account."
      />

      <div className="mb-4 flex w-fit items-center gap-1 rounded-console border border-console-border bg-surface p-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              tab === item.id ? "bg-brand text-ink-onbrand" : "text-ink-muted hover:text-ink"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="rounded-console border border-console-border bg-surface">
        {isLoading ? (
          <div className="p-6 text-sm text-ink-muted">{t("Loading pending accounts…")}</div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">{error}</div>
        ) : rows.length === 0 ? (
          <EmptyState title={emptyCopy.title} description={emptyCopy.description} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Name")}</TableHead>
                <TableHead>{t("Email")}</TableHead>
                <TableHead>{t("Phone")}</TableHead>
                <TableHead>{t("NRC number")}</TableHead>
                <TableHead>{t("Submitted")}</TableHead>
                {isPending ? (
                  <TableHead className="text-right">{t("Actions")}</TableHead>
                ) : (
                  <>
                    <TableHead>{t("Status")}</TableHead>
                    <TableHead>{t("Reviewed By")}</TableHead>
                    <TableHead>{t("Reviewed At")}</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((citizen) => (
                <TableRow key={citizen.id}>
                  <TableCell className="font-medium text-ink">{citizen.fullName}</TableCell>
                  <TableCell className="text-ink-muted">{citizen.email}</TableCell>
                  <TableCell className="text-ink-muted">{citizen.phone || "—"}</TableCell>
                  <TableCell className="text-ink-muted">{citizen.nrcNumber || "—"}</TableCell>
                  <TableCell className="text-ink-muted">{formatDate(citizen.createdAt)}</TableCell>

                  {isPending ? (
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-emerald-600/40 text-emerald-400 hover:bg-emerald-500/10"
                        disabled={approvingId === citizen.id}
                        onClick={() => handleApprove(citizen)}
                      >
                        <Check className="size-4" /> {t("Approve")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-2 border-rose-600/40 text-rose-400 hover:bg-rose-500/10"
                        onClick={() => setDenyTarget(citizen)}
                      >
                        <X className="size-4" /> {t("Deny")}
                      </Button>
                    </TableCell>
                  ) : (
                    <>
                      <TableCell>
                        <span className={cn(BADGE_BASE, REVIEW_BADGE[tab])}>
                          {tab === "approved" ? t("Approved") : t("Denied")}
                        </span>
                      </TableCell>
                      <TableCell className="text-ink">{citizen.reviewedBy || "System Administrator"}</TableCell>
                      <TableCell className="whitespace-nowrap text-ink-muted">
                        {formatDateTime(citizen.reviewedAt)}
                      </TableCell>
                    </>
                  )}
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
