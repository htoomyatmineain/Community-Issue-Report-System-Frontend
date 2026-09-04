import { useState } from "react";
import { Search, UserX, Trash2 } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import AccountStatusBadge from "@/components/common/AccountStatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useAdminCitizens } from "../hooks/useAdminCitizens";
import { useLanguage } from "@/app/providers/LanguageProvider";

const STATUS_FILTERS = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "SUSPENDED", label: "Suspended" },
];

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function AdminCitizensPage() {
  const { t } = useLanguage();
  const { citizens, isLoading, error, search, setSearch, status, setStatus, suspend, remove } =
    useAdminCitizens();
  const [confirmAction, setConfirmAction] = useState(null); // { type: "suspend" | "delete", citizen }
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleConfirm() {
    setIsSubmitting(true);
    try {
      if (confirmAction.type === "suspend") {
        await suspend(confirmAction.citizen.id);
        toast.success(t("Citizen suspended"));
      } else {
        await remove(confirmAction.citizen.id);
        toast.success(t("Citizen deleted"));
      }
      setConfirmAction(null);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? t("Action failed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader title="Citizens" description="All citizen accounts on the platform." />

      <div className="mb-4 flex items-center gap-3">
        <label className="flex h-10 w-72 items-center gap-2 rounded-md border border-input bg-background px-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            type="search"
            placeholder={t("Search name or email…")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </label>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-console border border-console-border bg-surface">
        {isLoading ? (
          <div className="p-6 text-sm text-ink-muted">{t("Loading citizens…")}</div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">{error}</div>
        ) : citizens.length === 0 ? (
          <EmptyState title="No citizens found" description="Try a different search or status filter." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Name")}</TableHead>
                <TableHead>{t("Email")}</TableHead>
                <TableHead>{t("Phone")}</TableHead>
                <TableHead>{t("Joined")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead className="text-right">{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {citizens.map((citizen) => (
                <TableRow key={citizen.id}>
                  <TableCell className="font-medium text-ink">{citizen.fullName}</TableCell>
                  <TableCell className="text-ink-muted">{citizen.email}</TableCell>
                  <TableCell className="text-ink-muted">{citizen.phone || "—"}</TableCell>
                  <TableCell className="text-ink-muted">{formatDate(citizen.createdAt)}</TableCell>
                  <TableCell>
                    <AccountStatusBadge status={citizen.accountStatus} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("Suspend {name}", { name: citizen.fullName })}
                      disabled={citizen.accountStatus !== "APPROVED"}
                      onClick={() => setConfirmAction({ type: "suspend", citizen })}
                    >
                      <UserX className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("Delete {name}", { name: citizen.fullName })}
                      disabled={citizen.active === false}
                      onClick={() => setConfirmAction({ type: "delete", citizen })}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(confirmAction)}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={confirmAction?.type === "suspend" ? "Suspend citizen" : "Delete citizen"}
        description={
          confirmAction &&
          (confirmAction.type === "suspend"
            ? t('"{name}" won\'t be able to log in or submit reports until reinstated.', {
                name: confirmAction.citizen.fullName,
              })
            : t('This deactivates "{name}"\'s account. Their existing reports are kept.', {
                name: confirmAction.citizen.fullName,
              }))
        }
        confirmLabel={confirmAction?.type === "suspend" ? "Suspend" : "Delete"}
        loadingLabel={confirmAction?.type === "suspend" ? "Suspending…" : "Deleting…"}
        onConfirm={handleConfirm}
        isLoading={isSubmitting}
      />
    </div>
  );
}
