import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/common/StatusBadge";
import { useLanguage } from "@/app/providers/LanguageProvider";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

/**
 * "Is this the same issue?" prompt — shown when POST /api/reports returns a
 * DuplicateCheckResultDTO instead of creating the report (api-standards.md
 * § "Submit a report — duplicate check"). The citizen either confirms one of
 * the nearby reports is the same issue, or forces a new report through.
 */
export default function DuplicateCheckDialog({
  open,
  onOpenChange,
  duplicates,
  isSubmitting,
  onConfirm,
  onSubmitAnyway,
}) {
  const { t } = useLanguage();
  const [pendingId, setPendingId] = useState(null);

  async function handleConfirm(reportId) {
    setPendingId(reportId);
    try {
      await onConfirm(reportId);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isSubmitting && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Is this the same issue?")}</DialogTitle>
          <DialogDescription>
            {t(
              "We found nearby report(s) in the same category. If one of these is the issue you're reporting, confirm it instead of creating a duplicate."
            )}
          </DialogDescription>
        </DialogHeader>

        <ul className="flex max-h-[45vh] flex-col gap-2 overflow-y-auto">
          {(duplicates ?? []).map((dup) => (
            <li
              key={dup.reportId}
              className="flex items-center justify-between gap-3 rounded-md border border-border p-3"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-sm font-semibold text-foreground">{dup.title}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {dup.reportCode} · {Math.round(dup.distanceMeters)} m {t("away")} · {formatDate(dup.createdAt)}
                </span>
                <StatusBadge status={dup.status} />
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleConfirm(dup.reportId)}
              >
                {pendingId === dup.reportId ? t("Confirming…") : t("Same issue")}
              </Button>
            </li>
          ))}
        </ul>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            className="w-full"
            disabled={isSubmitting}
            onClick={onSubmitAnyway}
          >
            {isSubmitting && pendingId == null ? t("Submitting…") : t("No, mine is different — submit anyway")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            {t("Cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
