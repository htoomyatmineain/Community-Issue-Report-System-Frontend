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
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/app/providers/LanguageProvider";

/** Deny dialog — ui-rules.md: "Approve / deny dialogs require a reason field when denying." */
export default function DenyReportDialog({ open, onOpenChange, report, onDeny }) {
  const { t } = useLanguage();
  const [reason, setReason] = useState("");
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setReason("");
      setError(null);
    }
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await onDeny(report.id, reason.trim());
      onOpenChange(false);
    } catch (err) {
      setError(err?.response?.data?.message ?? t("Failed to deny report"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isSaving && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Deny report")}</DialogTitle>
          <DialogDescription>
            {report && t('"{title}" will be rejected and the reporter notified.', { title: report.title })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deny-report-reason">{t("Reason *")}</Label>
            <Textarea
              id="deny-report-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              placeholder={t("Explain why this report is being denied…")}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              {t("Cancel")}
            </Button>
            <Button type="submit" variant="destructive" disabled={isSaving || !reason.trim()}>
              {isSaving ? t("Denying…") : t("Deny report")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
