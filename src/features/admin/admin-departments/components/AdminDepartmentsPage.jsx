import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useAdminDepartments } from "../hooks/useAdminDepartments";
import DepartmentFormDialog from "./DepartmentFormDialog";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function AdminDepartmentsPage() {
  const { t } = useLanguage();
  const { departments, isLoading, error, create, update, remove } = useAdminDepartments();
  const [formState, setFormState] = useState({ open: false, department: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSave(payload, id) {
    if (id) {
      await update(id, payload);
      toast.success(t("Department updated"));
    } else {
      await create(payload);
      toast.success(t("Department created"));
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success(t("Department deleted"));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? t("Failed to delete department"));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Departments"
        description="The default routing target for report categories."
        action={
          <Button onClick={() => setFormState({ open: true, department: null })}>
            <Plus /> {t("New department")}
          </Button>
        }
      />

      <div className="rounded-console border border-console-border bg-surface">
        {isLoading ? (
          <div className="p-6 text-sm text-ink-muted">{t("Loading departments…")}</div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">{error}</div>
        ) : departments.length === 0 ? (
          <EmptyState
            title="No departments yet"
            description="Create a department so categories have somewhere to route to."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Name")}</TableHead>
                <TableHead>{t("Description")}</TableHead>
                <TableHead>{t("Contact email")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead className="text-right">{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium text-ink">{dept.name}</TableCell>
                  <TableCell className="text-ink-muted">{dept.description || "—"}</TableCell>
                  <TableCell className="text-ink-muted">{dept.contactEmail || "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        dept.active
                          ? "border-none bg-status-resolved-bg text-status-resolved"
                          : "border-none bg-status-closed-bg text-status-closed"
                      }
                    >
                      {dept.active ? t("Active") : t("Inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("Edit {name}", { name: dept.name })}
                      onClick={() => setFormState({ open: true, department: dept })}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("Delete {name}", { name: dept.name })}
                      disabled={!dept.active}
                      onClick={() => setDeleteTarget(dept)}
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

      <DepartmentFormDialog
        open={formState.open}
        onOpenChange={(open) => setFormState((s) => ({ ...s, open }))}
        department={formState.department}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete department"
        description={
          deleteTarget &&
          t(
            'This deactivates "{name}". Existing categories keep their link to it, but new categories can\'t be created against it until it\'s reactivated.',
            { name: deleteTarget.name }
          )
        }
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
