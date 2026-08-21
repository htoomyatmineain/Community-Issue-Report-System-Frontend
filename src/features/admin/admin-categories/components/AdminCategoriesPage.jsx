import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { CATEGORY_ICON_MAP } from "@/lib/constants";
import { useAdminCategories } from "../hooks/useAdminCategories";
import CategoryFormDialog from "./CategoryFormDialog";

export default function AdminCategoriesPage() {
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
      toast.success("Category updated");
    } else {
      await create(payload);
      toast.success("Category created");
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success("Category deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to delete category");
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
            <Plus /> New category
          </Button>
        }
      />

      <div className="rounded-console border border-console-border bg-surface">
        {isLoading ? (
          <div className="p-6 text-sm text-ink-muted">Loading categories…</div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">{error}</div>
        ) : categories.length === 0 ? (
          <EmptyState
            title="No categories yet"
            description="Create a category so citizens have something to select when reporting."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Colour</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => {
                const Icon = CATEGORY_ICON_MAP[cat.icon];
                return (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium text-ink">
                      <span className="flex items-center gap-2">
                        {Icon && <Icon className="size-4 text-ink-muted" />}
                        {cat.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-ink-muted">
                      {cat.departmentName ?? departmentNameById[cat.departmentId] ?? "—"}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span
                          className="size-4 rounded-full border border-console-border"
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
                        {cat.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${cat.name}`}
                        onClick={() => setFormState({ open: true, category: cat })}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${cat.name}`}
                        disabled={!cat.active}
                        onClick={() => setDeleteTarget(cat)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
          deleteTarget && `This deactivates "${deleteTarget.name}". It will no longer appear in the citizen report form.`
        }
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
