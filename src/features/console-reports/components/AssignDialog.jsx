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
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { consoleReportsApi } from "../api/consoleReportsApi";
import { useLanguage } from "@/app/providers/LanguageProvider";

const UNASSIGNED = "UNASSIGNED";

/** Admin-only — reassign a report's department and/or staff member (api-standards.md: assign is Admin-only). */
export default function AssignDialog({ open, onOpenChange, report, departments, onAssign }) {
  const { t } = useLanguage();
  const [departmentId, setDepartmentId] = useState("");
  const [assignedStaffId, setAssignedStaffId] = useState(UNASSIGNED);
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDepartmentId(report?.departmentId != null ? String(report.departmentId) : "");
    setAssignedStaffId(report?.assignedStaffId != null ? String(report.assignedStaffId) : UNASSIGNED);
    setError(null);
    consoleReportsApi.listStaff().then(setStaff).catch(() => setStaff([]));
  }, [open, report]);

  const staffInDepartment = staff.filter((s) => String(s.departmentId) === departmentId);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await onAssign({
        departmentId: Number(departmentId),
        assignedStaffId: assignedStaffId === UNASSIGNED ? null : Number(assignedStaffId),
      });
      onOpenChange(false);
    } catch (err) {
      setError(err?.response?.data?.message ?? t("Failed to reassign report"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isSaving && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Assign department")}</DialogTitle>
          <DialogDescription>{t("Reassign this report to a different department or staff member.")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="assign-department">{t("Department *")}</Label>
            <Select
              value={departmentId}
              onValueChange={(value) => {
                setDepartmentId(value);
                setAssignedStaffId(UNASSIGNED);
              }}
            >
              <SelectTrigger id="assign-department">
                <SelectValue placeholder={t("Select a department")} />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={String(dept.id)} disabled={!dept.active}>
                    {dept.name}
                    {!dept.active ? ` ${t("(inactive)")}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="assign-staff">{t("Staff member")}</Label>
            <Select value={assignedStaffId} onValueChange={setAssignedStaffId}>
              <SelectTrigger id="assign-staff">
                <SelectValue placeholder={t("Unassigned")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UNASSIGNED}>{t("Unassigned")}</SelectItem>
                {staffInDepartment.map((member) => (
                  <SelectItem key={member.id} value={String(member.id)}>
                    {member.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              {t("Cancel")}
            </Button>
            <Button type="submit" disabled={isSaving || !departmentId}>
              {isSaving ? t("Saving…") : t("Save assignment")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
