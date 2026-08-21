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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const EMPTY_FORM = { fullName: "", email: "", phone: "", password: "", departmentId: "" };

/** Create-staff dialog. `role = STAFF` and `accountStatus = APPROVED` are forced server-side (database-schema.md). */
export default function CreateStaffDialog({ open, onOpenChange, departments, onCreate }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      setFieldErrors({});
      setError(null);
    }
  }, [open]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setFieldErrors({});
    try {
      await onCreate({ ...form, departmentId: Number(form.departmentId) });
      onOpenChange(false);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to create staff account");
      setFieldErrors(err?.response?.data?.errors ?? {});
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isSaving && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create staff account</DialogTitle>
          <DialogDescription>
            Staff accounts are approved immediately and scoped to one department.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="staff-fullName">Full name *</Label>
            <Input id="staff-fullName" name="fullName" value={form.fullName} onChange={handleChange} required />
            {fieldErrors.fullName && <span className="text-xs text-destructive">{fieldErrors.fullName}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="staff-email">Email *</Label>
            <Input
              id="staff-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {fieldErrors.email && <span className="text-xs text-destructive">{fieldErrors.email}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="staff-phone">Phone</Label>
            <Input id="staff-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
            {fieldErrors.phone && <span className="text-xs text-destructive">{fieldErrors.phone}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="staff-department">Department *</Label>
            <Select
              value={form.departmentId}
              onValueChange={(value) => setForm((f) => ({ ...f, departmentId: value }))}
            >
              <SelectTrigger id="staff-department">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={String(dept.id)} disabled={!dept.active}>
                    {dept.name}
                    {!dept.active ? " (inactive)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.departmentId && (
              <span className="text-xs text-destructive">{fieldErrors.departmentId}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="staff-password">Temporary password *</Label>
            <Input
              id="staff-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            {fieldErrors.password && <span className="text-xs text-destructive">{fieldErrors.password}</span>}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || !form.departmentId}>
              {isSaving ? "Creating…" : "Create staff account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
