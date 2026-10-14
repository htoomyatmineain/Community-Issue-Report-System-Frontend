import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, ArrowRightLeft } from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function AiOverrideDialog({ open, onOpenChange, report, departments = [], onOverride }) {
  const { t } = useLanguage();
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedDeptId(report?.departmentId ? String(report.departmentId) : "");
      setReason("");
    }
  }, [open, report]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedDeptId || !reason.trim()) return;

    setIsSubmitting(true);
    try {
      await onOverride({
        newDepartmentId: Number(selectedDeptId),
        reason: reason.trim(),
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
              <ArrowRightLeft className="size-4" />
            </div>
            <DialogTitle>{t("Override AI Triage Decision")}</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-ink-muted">
            {t("Reroute this report to a different municipal department. An audit log entry will be created.")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="rounded-lg bg-surface-muted/50 border border-console-border p-3 text-xs text-ink-muted space-y-1">
            <div className="flex items-center justify-between font-medium text-ink">
              <span>{t("Current AI Assessment:")}</span>
              <span className="font-mono text-amber-600 dark:text-amber-400">
                {report?.aiConfidenceScore ? `${report.aiConfidenceScore}%` : "—"}
              </span>
            </div>
            <p className="line-clamp-2 text-[11px] text-ink-muted/90 italic">
              "{report?.aiReasoning ?? t("No AI reasoning available.")}"
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="target-dept" className="text-xs font-semibold text-ink">
              {t("New Destination Department")} *
            </Label>
            <Select value={selectedDeptId} onValueChange={setSelectedDeptId}>
              <SelectTrigger id="target-dept" className="h-9 text-xs">
                <SelectValue placeholder={t("Select responsible department…")} />
              </SelectTrigger>
              <SelectContent>
                {departments
                  .filter((d) => d.active)
                  .map((dept) => (
                    <SelectItem key={dept.id} value={String(dept.id)} className="text-xs">
                      {t(dept.name)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="override-reason" className="text-xs font-semibold text-ink">
              {t("Operational Rationale & Justification")} *
            </Label>
            <Textarea
              id="override-reason"
              placeholder={t("e.g. Issue involves electrical wiring beneath road surface; rerouting to Roads & Bridges Department.")}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[85px] text-xs resize-none"
              required
            />
          </div>

          <div className="flex items-start gap-2 rounded-md bg-amber-500/5 p-2.5 text-[11px] text-amber-700 dark:text-amber-300 border border-amber-500/15">
            <ShieldAlert className="size-4 shrink-0 mt-0.5" />
            <span>
              {t("Mandatory audit logging: Overrides are attributed to your account and stored in permanent system audit records.")}
            </span>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="text-xs h-8"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!selectedDeptId || !reason.trim() || isSubmitting}
              className="text-xs h-8 bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isSubmitting ? t("Applying Override…") : t("Confirm & Reroute")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
