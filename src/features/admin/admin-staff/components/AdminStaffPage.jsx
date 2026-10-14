import { useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import AccountStatusBadge from "@/components/common/AccountStatusBadge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import TableSummary from "@/components/common/TableSummary";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useAdminStaff } from "../hooks/useAdminStaff";
import CreateStaffDialog from "./CreateStaffDialog";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function AdminStaffPage() {
  const { t } = useLanguage();
  const { staff, departments, isLoading, error, search, setSearch, create, remove } = useAdminStaff();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleCreate(payload) {
    const created = await create(payload);
    toast.success(
      t('Staff account created for {name} ({department}).', {
        name: created.fullName,
        department: created.departmentName ? t(created.departmentName) : t("no department"),
      })
    );
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success(t("Staff account for {name} deleted.", { name: deleteTarget.fullName }));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? t("Action failed"));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Staff"
        description="Government staff accounts, scoped to one department each."
        action={
          <Button onClick={() => setIsDialogOpen(true)} disabled={departments.length === 0}>
            <Plus /> {t("New staff")}
          </Button>
        }
      />

      <div className="mb-4">
        <label className="flex h-10 w-72 items-center gap-2 rounded-lg border border-console-border/80 bg-surface px-3 shadow-xs transition-colors focus-within:border-brand/70">
          <Search className="size-4 text-ink-muted" />
          <input
            type="search"
            placeholder={t("Search name or email…")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none"
          />
        </label>
      </div>

      <div className="rounded-xl border border-console-border/70 bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-ink-muted">{t("Loading staff…")}</div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">{error}</div>
        ) : staff.length === 0 ? (
          <EmptyState
            title="No staff accounts yet"
            description="Create a staff account so departments have someone assigned."
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-right">{t("No.")}</TableHead>
                  <TableHead>{t("Name")}</TableHead>
                  <TableHead>{t("Email")}</TableHead>
                  <TableHead>{t("Department")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                  <TableHead className="text-right">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member, i) => (
                  <TableRow key={member.id}>
                    <TableCell className="text-right font-mono text-xs text-ink-muted">{i + 1}</TableCell>
                    <TableCell className="font-medium text-ink tracking-tight">{member.fullName}</TableCell>
                    <TableCell className="text-xs text-ink-muted">{member.email}</TableCell>
                    <TableCell className="text-xs text-ink-muted">
                      {member.departmentName ? t(member.departmentName) : "—"}
                    </TableCell>
                    <TableCell>
                      <AccountStatusBadge status={member.accountStatus} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t("Delete {name}", { name: member.fullName })}
                        aria-label={t("Delete {name}", { name: member.fullName })}
                        className="size-8 rounded-lg text-ink-muted hover:bg-destructive/10 hover:text-destructive active:scale-95 transition-all"
                        onClick={() => setDeleteTarget(member)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TableSummary count={staff.length} noun="staff accounts" filtered={Boolean(search)} />
          </>
        )}
      </div>

      <CreateStaffDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        departments={departments}
        onCreate={handleCreate}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete staff account"
        description={
          deleteTarget &&
          t('This removes "{name}"\'s staff account and their access to the console.', {
            name: deleteTarget.fullName,
          })
        }
        confirmLabel="Delete"
        loadingLabel="Deleting…"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
