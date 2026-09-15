import { useState } from "react";
import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import { toast } from "sonner";
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
import ReportPhoto from "@/components/common/ReportPhoto";
import { cn } from "@/lib/utils";
import { useCommunitySupport } from "@/features/citizen/citizen-home/hooks/useCommunitySupport";
import { useLanguage } from "@/app/providers/LanguageProvider";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

/**
 * "Is this the same issue?" prompt — shown when POST /api/reports returns a
 * DuplicateCheckResultDTO instead of creating the report (api-standards.md
 * § "Submit a report — duplicate check"). The citizen can expand a candidate
 * to see its full details and either Support it directly (backing the
 * existing report instead of filing a new one) or confirm it's the same
 * issue; otherwise they exit this dialog and submit their own report.
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
  const [expandedId, setExpandedId] = useState(null);
  const { isSupported, isPending, toggleSupport } = useCommunitySupport();

  async function handleConfirm(reportId) {
    setPendingId(reportId);
    try {
      await onConfirm(reportId);
    } finally {
      setPendingId(null);
    }
  }

  async function handleSupport(dup) {
    const result = await toggleSupport(dup.reportId);
    if (result.ok) {
      toast.success(
        result.removed
          ? t("Support removed")
          : t("You earned +{points} points for supporting this report", { points: result.reward })
      );
      if (!result.removed) onOpenChange(false);
      return;
    }
    if (result.reason === "PENDING") return;
    if (result.reason === "LIMIT_REACHED") {
      toast.error(t("Daily limit reached: You can only support 5 reports per day"));
    } else if (result.reason === "ALREADY_SUPPORTED" || result.reason === "NOT_SUPPORTED") {
      // Local state drifted from the server; it's now reconciled — no toast.
    } else {
      toast.error(result.message ?? t("Could not update your support. Please try again."));
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isSubmitting && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Is this the same issue?")}</DialogTitle>
          <DialogDescription>
            {t(
              "We found nearby report(s) in the same category. If one of these is the issue you're reporting, view its details and back it instead of creating a duplicate."
            )}
          </DialogDescription>
        </DialogHeader>

        <ul className="flex max-h-[55vh] flex-col gap-2 overflow-y-auto">
          {(duplicates ?? []).map((dup) => {
            const isExpanded = expandedId === dup.reportId;
            const supported = isSupported(dup.reportId);
            return (
              <li key={dup.reportId} className="rounded-md border border-border">
                <div className="flex items-center justify-between gap-3 p-3">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : dup.reportId)}
                    className="flex min-w-0 flex-1 flex-col items-start gap-1 text-left"
                  >
                    <span className="truncate text-sm font-semibold text-foreground">{dup.title}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {dup.reportCode} · {Math.round(dup.distanceMeters)} m {t("away")} · {formatDate(dup.createdAt)}
                    </span>
                    <StatusBadge status={dup.status} />
                  </button>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={() => handleConfirm(dup.reportId)}
                    >
                      {pendingId === dup.reportId ? t("Confirming…") : t("Same issue")}
                    </Button>
                    <button
                      type="button"
                      aria-label={isExpanded ? t("Hide details") : t("View details")}
                      onClick={() => setExpandedId(isExpanded ? null : dup.reportId)}
                      className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                    >
                      {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="flex flex-col gap-3 border-t border-border p-3">
                    <div className="flex gap-3">
                      {dup.thumbnailUrl && (
                        <ReportPhoto src={dup.thumbnailUrl} alt={dup.title} className="size-20 shrink-0" />
                      )}
                      <div className="flex min-w-0 flex-col gap-1">
                        {dup.categoryName && (
                          <span className="text-xs font-semibold text-muted-foreground">{dup.categoryName}</span>
                        )}
                        {dup.description && (
                          <p className="text-[13px] leading-snug text-foreground">{dup.description}</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSupport(dup)}
                      disabled={isPending(dup.reportId)}
                      aria-pressed={supported}
                      className={cn(
                        "flex w-full items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-60",
                        supported
                          ? "border-rose-600 bg-rose-600 text-white hover:bg-rose-700 dark:border-rose-500 dark:bg-rose-500 dark:hover:bg-rose-600"
                          : "border-border text-rose-600 hover:bg-rose-500/5 dark:text-rose-400"
                      )}
                    >
                      <Heart className={cn("size-4", supported && "fill-current")} />
                      {supported ? t("Supported") : t("Support")}
                      <span className={cn("tabular-nums", supported ? "text-white/80" : "text-rose-600/70 dark:text-rose-400/70")}>
                        {dup.supportCount ?? 0}
                      </span>
                    </button>
                  </div>
                )}
              </li>
            );
          })}
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
