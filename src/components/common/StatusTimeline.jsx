import { Check, X } from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { cn } from "@/lib/utils";

const formatDateTime = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const CANONICAL_WORKFLOW = [
  {
    key: "SUBMITTED",
    matchTerms: ["report submitted", "pending approval", "pending_approval", "submitted"],
    labelKey: "Report submitted",
    defaultRemarks: "Citizen submitted incident report",
  },
  {
    key: "ASSIGNED",
    matchTerms: ["assigned", "approved"],
    labelKey: "Assigned",
    defaultRemarks: "Approved and dispatched to department queue",
  },
  {
    key: "IN_PROGRESS",
    matchTerms: ["in progress", "in_progress"],
    labelKey: "In progress",
    defaultRemarks: "Field crew deployed on site for inspection/repair",
  },
  {
    key: "RESOLVED",
    matchTerms: ["resolved", "completed"],
    labelKey: "Resolved",
    defaultRemarks: "Repair works completed and verified",
  },
  {
    key: "CLOSED",
    matchTerms: ["closed", "archived"],
    labelKey: "Closed",
    defaultRemarks: "Citizen satisfaction confirmed, ticket archived",
  },
];

/**
 * Vertical status stepper showing the full workflow stages.
 * Completed states have a brand blue circle with checkmark.
 * Incomplete states have a gray circle without checkmark.
 */
export default function StatusTimeline({ steps = [] }) {
  const { t } = useLanguage();

  const historyList = Array.isArray(steps) ? steps : [];

  // Check if the report was rejected
  const rejectionStep = historyList.find((s) => {
    const l = (s.labelKey ?? s.label ?? "").toLowerCase();
    return l.includes("reject");
  });

  let displayItems = [];

  if (rejectionStep) {
    const firstStep = historyList[0] || {
      labelKey: "Report submitted",
      remarks: "Citizen submitted incident report",
    };
    displayItems = [
      {
        id: "submitted",
        label: t(firstStep.labelKey ?? "Report submitted"),
        remarks: firstStep.remarks ? t(firstStep.remarks) : t("Citizen submitted incident report"),
        at: firstStep.at,
        isCompleted: true,
        isRejected: false,
      },
      {
        id: "rejected",
        label: t("Rejected"),
        remarks: rejectionStep.remarks ? t(rejectionStep.remarks) : t("Report was rejected by administrator"),
        at: rejectionStep.at,
        isCompleted: true,
        isRejected: true,
      },
    ];
  } else {
    // Normal 5-stage progression
    let highestCompletedIndex = -1;

    const matchedSteps = CANONICAL_WORKFLOW.map((stage, idx) => {
      const found = historyList.find((h) => {
        const text = (h.labelKey ?? h.label ?? "").toLowerCase();
        return stage.matchTerms.some((term) => text.includes(term));
      });
      if (found) {
        highestCompletedIndex = Math.max(highestCompletedIndex, idx);
      }
      return found;
    });

    if (highestCompletedIndex === -1 && historyList.length > 0) {
      highestCompletedIndex = 0;
    }

    displayItems = CANONICAL_WORKFLOW.map((stage, idx) => {
      const stepMatch = matchedSteps[idx];
      const isCompleted = idx <= highestCompletedIndex;
      const at = stepMatch?.at ?? (isCompleted && idx === 0 ? historyList[0]?.at : null);
      const remarks = stepMatch?.remarks || stage.defaultRemarks;

      return {
        id: stage.key,
        label: t(stage.labelKey),
        remarks: t(remarks),
        at,
        isCompleted,
        isRejected: false,
      };
    });
  }

  return (
    <div className="flex flex-col">
      <h2 className="mb-3 font-display text-sm font-bold text-foreground">
        {t("Status timeline")}
      </h2>
      <ol className="flex flex-col">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const nextItem = !isLast ? displayItems[index + 1] : null;
          const isLineActive = item.isCompleted && nextItem?.isCompleted;

          return (
            <li key={item.id} className="flex gap-3">
              <div className="flex w-6 flex-col items-center">
                {/* Node icon */}
                {item.isRejected ? (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white shadow-xs ring-2 ring-rose-500/20">
                    <X className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                ) : item.isCompleted ? (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-xs ring-2 ring-brand/20">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-border/80 bg-muted/40 transition-colors" />
                )}

                {/* Connecting line to next stage */}
                {!isLast && (
                  <span
                    className={cn(
                      "w-0.5 flex-1 my-1 transition-colors",
                      isLineActive ? "bg-brand" : "bg-border/80"
                    )}
                  />
                )}
              </div>

              <div className={isLast ? "flex flex-col gap-0.5 pt-0.5" : "flex flex-col gap-0.5 pb-5 pt-0.5"}>
                <span
                  className={cn(
                    "text-[13px] leading-snug",
                    item.isCompleted
                      ? "font-semibold text-foreground"
                      : "font-medium text-muted-foreground/75"
                  )}
                >
                  {item.label}
                  {item.remarks ? ` — ${item.remarks}` : ""}
                </span>

                {item.at ? (
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {formatDateTime(item.at)}
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-muted-foreground/50 tracking-wider">
                    {t("Upcoming")}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
