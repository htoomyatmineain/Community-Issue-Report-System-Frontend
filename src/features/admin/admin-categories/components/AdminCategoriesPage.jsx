import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import TableSummary from "@/components/common/TableSummary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { categoryIcon } from "@/lib/categoryIcons";
import { useAdminCategories } from "../hooks/useAdminCategories";
import CategoryFormDialog from "./CategoryFormDialog";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function AdminCategoriesPage() {
  const { t } = useLanguage();
  const { categories, departments, isLoading, error, create, update, remove } = useAdminCategories();
  const [formState, setFormState] = useState({ open: false, category: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const departmentNameById = useMemo(
    () => Object.fromEntries(departments.map((d) => [d.id, d.name])),
    [departments]
  );

  async function handleSave(payload, id) {
    if (id) {
      await update(id, payload);
      toast.success(t("Category updated"));
    } else {
      await create(payload);
      toast.success(t("Category created"));
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success(t("Category deleted"));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? t("Failed to delete category"));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Each category routes reports to a department by default."
        action={
          <Button
            onClick={() => setFormState({ open: true, category: null })}
            disabled={isLoading || departments.length === 0}
          >
            <Plus /> {t("New category")}
          </Button>
        }
      />

      <div className="rounded-console border border-console-border bg-surface">
        {isLoading ? (
          <div className="p-6 text-sm text-ink-muted">{t("Loading categories…")}</div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">{error}</div>
        ) : categories.length === 0 ? (
          <EmptyState
            title="No categories yet"
            description="Create a category so citizens have something to select when reporting."
          />
        ) : (
          <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-right">{t("No.")}</TableHead>
                <TableHead>{t("Category")}</TableHead>
                <TableHead>{t("Department")}</TableHead>
                <TableHead>{t("Colour")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead className="text-right">{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat, i) => {
                const Icon = categoryIcon(cat);
                return (
                  <TableRow key={cat.id}>
                    <TableCell className="text-right font-mono text-xs text-ink-muted">{i + 1}</TableCell>
                    <TableCell className="font-medium text-ink">
                      <span className="flex items-center gap-2.5">
                        <span
                          className="flex size-7 shrink-0 items-center justify-center rounded-md"
                          style={{
                            color: cat.colorHex ?? "var(--ink-muted)",
                            backgroundColor: cat.colorHex ? `${cat.colorHex}1f` : "var(--surface-muted)",
                          }}
                        >
                          <Icon className="size-4" />
                        </span>
                        {cat.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-ink-muted">
                      {(() => {
                        const deptName = cat.departmentName ?? departmentNameById[cat.departmentId];
                        return deptName ? t(deptName) : "—";
                      })()}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span
                          className="size-4 rounded-[4px] border border-console-border"
                          style={{ backgroundColor: cat.colorHex }}
                        />
                        <span className="font-mono text-xs uppercase text-ink-muted">{cat.colorHex}</span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          cat.active
                            ? "border-none bg-status-resolved-bg text-status-resolved"
                            : "border-none bg-status-closed-bg text-status-closed"
                        }
                      >
                        {cat.active ? t("Active") : t("Inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title={t("Edit {name}", { name: cat.name })}
                          aria-label={t("Edit {name}", { name: cat.name })}
                          className="text-ink-muted hover:bg-primary/10 hover:text-primary"
                          onClick={() => setFormState({ open: true, category: cat })}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={t("Delete {name}", { name: cat.name })}
                          aria-label={t("Delete {name}", { name: cat.name })}
                          className="text-ink-muted hover:bg-destructive/10 hover:text-destructive"
                          disabled={!cat.active}
                          onClick={() => setDeleteTarget(cat)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <TableSummary count={categories.length} noun="categories" />
          </>
        )}
      </div>

      <CategoryFormDialog
        open={formState.open}
        onOpenChange={(open) => setFormState((s) => ({ ...s, open }))}
        category={formState.category}
        departments={departments}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete category"
        description={
          deleteTarget &&
          t('This deactivates "{name}". It will no longer appear in the citizen report form.', {
            name: deleteTarget.name,
          })
        }
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
