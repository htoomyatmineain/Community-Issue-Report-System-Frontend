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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { REPORT_STATUS } from "@/lib/constants";
import { useLanguage } from "@/app/providers/LanguageProvider";

/** database-schema.md's allowed transitions, minus PENDING_APPROVAL's — those go through the approve/reject queue, not this dialog. */
const STATUS_TRANSITIONS = {
  ASSIGNED: ["IN_PROGRESS", "RESOLVED"],
  IN_PROGRESS: ["RESOLVED"],
  RESOLVED: ["CLOSED", "IN_PROGRESS"],
};

export default function StatusChangeDialog({ open, onOpenChange, report, onChangeStatus, onUploadPhoto }) {
  const { t } = useLanguage();
  const options = STATUS_TRANSITIONS[report?.status] ?? [];
  const hasResolutionPhoto = report?.images?.some((img) => img.imageType === "RESOLUTION_PHOTO");

  const [targetStatus, setTargetStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTargetStatus(options[0] ?? "");
      setRemarks("");
      setPhoto(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const needsPhoto = targetStatus === "RESOLVED" && !hasResolutionPhoto;

  async function handleSubmit(e) {
    e.preventDefault();
    if (needsPhoto && !photo) {
      setError(t("Attach a completion photo before resolving."));
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      if (photo) await onUploadPhoto([photo]);
      await onChangeStatus({ status: targetStatus, remarks: remarks.trim() || undefined });
      onOpenChange(false);
    } catch (err) {
      setError(err?.response?.data?.message ?? t("Failed to change status"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isSaving && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Change status")}</DialogTitle>
          <DialogDescription>
            {options.length === 0
              ? t("This report has no further status changes available.")
              : t("Currently {status}.", { status: t(REPORT_STATUS[report.status]?.label ?? report.status) })}
          </DialogDescription>
        </DialogHeader>

        {options.length > 0 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status-target">{t("New status")}</Label>
              <Select value={targetStatus} onValueChange={setTargetStatus}>
                <SelectTrigger id="status-target">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {t(REPORT_STATUS[opt]?.label ?? opt)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status-remarks">{t("Remarks")}</Label>
              <Textarea
                id="status-remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                placeholder={t("Optional note for the citizen's timeline…")}
              />
            </div>

            {needsPhoto && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="status-photo">{t("Completion photo *")}</Label>
                <input
                  id="status-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                  className="text-sm"
                />
                <span className="text-xs text-ink-muted">
                  {t("Required to move a report to Resolved (ui-rules.md).")}
                </span>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                {t("Cancel")}
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? t("Saving…") : t("Save status")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
