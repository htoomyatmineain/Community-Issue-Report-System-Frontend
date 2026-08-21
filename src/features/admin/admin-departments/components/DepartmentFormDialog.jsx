import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const EMPTY_FORM = { name: "", description: "", contactEmail: "" };

/** Create/edit dialog for a department. `department` null means create. */
export default function DepartmentFormDialog({ open, onOpenChange, department, onSave }) {
  const isEditing = Boolean(department);
  const [form, setForm] = useState(EMPTY_FORM);
  const [active, setActive] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      department
        ? {
            name: department.name ?? "",
            description: department.description ?? "",
            contactEmail: department.contactEmail ?? "",
          }
        : EMPTY_FORM
    );
    setActive(department ? department.active : true);
    setFieldErrors({});
    setError(null);
  }, [open, department]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setFieldErrors({});
    try {
      const payload = isEditing ? { ...form, active } : form;
      await onSave(payload, department?.id);
      onOpenChange(false);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to save department");
      setFieldErrors(err?.response?.data?.errors ?? {});
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isSaving && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit department" : "New department"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this department's details."
              : "Departments are the default routing target for report categories."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dept-name">Name *</Label>
            <Input id="dept-name" name="name" value={form.name} onChange={handleChange} required />
            {fieldErrors.name && <span className="text-xs text-destructive">{fieldErrors.name}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dept-description">Description</Label>
            <Textarea
              id="dept-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
            {fieldErrors.description && (
              <span className="text-xs text-destructive">{fieldErrors.description}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dept-contactEmail">Contact email</Label>
            <Input
              id="dept-contactEmail"
              name="contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={handleChange}
            />
            {fieldErrors.contactEmail && (
              <span className="text-xs text-destructive">{fieldErrors.contactEmail}</span>
            )}
          </div>

          {isEditing && (
            <div className="flex items-center justify-between rounded-md border border-console-border px-3 py-2.5">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-ink">Active</span>
                <span className="text-xs text-ink-muted">
                  Inactive departments can't be assigned to new categories.
                </span>
              </div>
              <Switch checked={active} onCheckedChange={setActive} aria-label="Department active" />
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving…" : isEditing ? "Save changes" : "Create department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
