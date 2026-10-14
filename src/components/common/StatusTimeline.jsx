import { Check, XCircle } from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { cn } from "@/lib/utils";

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

/**
 * Standard civic report lifecycle stages in Kinn Htout.
 * Explicitly describes all stages so citizens clearly understand the entire roadmap.
 */
const LIFECYCLE_STAGES = [
  {
    key: "SUBMITTED",
    label: "Report Submitted",
    description: "Report received and queued for administrative review",
    order: 1,
  },
  {
    key: "ASSIGNED",
    label: "Assigned to Department",
    description: "Dispatched to responsible municipal engineering team",
    order: 2,
  },
  {
    key: "IN_PROGRESS",
    label: "In Progress (Field Work)",
    description: "Repair crew deployed on-site for inspection and maintenance",
    order: 3,
  },
  {
    key: "RESOLVED",
    label: "Resolved & Verified",
    description: "Repairs completed and verified with photographic evidence",
    order: 4,
  },
  {
    key: "CLOSED",
    label: "Case Closed",
    description: "Resolution confirmed and report archived in municipal records",
    order: 5,
  },
];

const STAGE_ORDER_MAP = {
  PENDING_APPROVAL: 1,
  ASSIGNED: 2,
  IN_PROGRESS: 3,
  RESOLVED: 4,
  CLOSED: 5,
};

function findHistoryForStage(steps = [], stageKey) {
  if (!Array.isArray(steps)) return null;
  return steps.find((s) => {
    const status = s.newStatus || s.status;
    const label = s.labelKey || s.label;
    if (stageKey === "SUBMITTED") {
      return s.oldStatus == null || status === "PENDING_APPROVAL" || label?.toLowerCase()?.includes("submitted");
    }
    if (stageKey === "ASSIGNED") {
      return status === "ASSIGNED" || label?.toLowerCase()?.includes("assigned");
    }
    if (stageKey === "IN_PROGRESS") {
      return status === "IN_PROGRESS" || label?.toLowerCase()?.includes("progress");
    }
    if (stageKey === "RESOLVED") {
      return status === "RESOLVED" || label?.toLowerCase()?.includes("resolved");
    }
    if (stageKey === "CLOSED") {
      return status === "CLOSED" || label?.toLowerCase()?.includes("closed");
    }
    return false;
  });
}

/**
 * Comprehensive Status Timeline showing ALL stages in the lifecycle.
 * - Completed stages show a vibrant blue check mark.
 * - Incomplete upcoming stages remain neutral gray with clear descriptions.
 */
export default function StatusTimeline({ steps = [], currentStatus }) {
  const { t } = useLanguage();

  // Deduce current status from props or the latest transition step
  const latestStep = steps?.[steps.length - 1];
  const effectiveStatus = currentStatus || latestStep?.newStatus || latestStep?.status || "PENDING_APPROVAL";
  const isRejected = effectiveStatus === "REJECTED";
  const currentStageOrder = STAGE_ORDER_MAP[effectiveStatus] ?? 1;

  if (isRejected) {
    const initialStep = steps?.[0];
    const rejectStep = steps?.find((s) => (s.newStatus || s.status) === "REJECTED") || latestStep;

    return (
      <div className="flex flex-col">
        <h2 className="mb-3 font-display text-sm font-bold text-foreground">{t("Status timeline")}</h2>
        <ol className="relative flex flex-col">
          {/* Stage 1: Submitted (Completed) */}
          <li className="flex gap-3">
            <div className="flex w-6 flex-col items-center">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs">
                <Check className="size-3.5 stroke-[2.5]" />
              </span>
              <span className="w-0.5 flex-1 bg-rose-500 my-1 min-h-6" />
            </div>
            <div className="flex flex-col pb-5">
              <span className="text-[13px] font-semibold text-foreground">{t("Report Submitted")}</span>
              <span className="text-xs text-muted-foreground">{t("Received and logged into intake queue")}</span>
              {initialStep?.at && (
                <span className="text-[11px] text-muted-foreground mt-0.5">{formatDateTime(initialStep.at)}</span>
              )}
            </div>
          </li>

          {/* Stage 2: Rejected */}
          <li className="flex gap-3">
            <div className="flex w-6 flex-col items-center">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white shadow-xs">
                <XCircle className="size-3.5 stroke-[2.5]" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-rose-600 dark:text-rose-400">{t("Report Rejected")}</span>
              <span className="text-xs text-muted-foreground">{rejectStep?.remarks || t("Report did not meet municipal guidelines.")}</span>
              {rejectStep?.at && (
                <span className="text-[11px] text-muted-foreground mt-0.5">{formatDateTime(rejectStep.at)}</span>
              )}
            </div>
          </li>
        </ol>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-foreground">{t("Status timeline")}</h2>
        <span className="rounded-full bg-brand/10 border border-brand/20 px-2 py-0.5 text-[11px] font-semibold text-brand">
          {t("Stage {current} of 5", { current: currentStageOrder })}
        </span>
      </div>

      <ol className="relative flex flex-col">
        {LIFECYCLE_STAGES.map((stage, index) => {
          const isLast = index === LIFECYCLE_STAGES.length - 1;
          const isCompleted = stage.order <= currentStageOrder;
          const isCurrentActive = stage.order === currentStageOrder && stage.order < 5;
          const historyEntry = findHistoryForStage(steps, stage.key);
          const timestamp = historyEntry?.at || historyEntry?.changedAt;
          const remarks = historyEntry?.remarks;

          // Connecting line styling
          const nextStageCompleted = stage.order < currentStageOrder;

          return (
            <li key={stage.key} className="flex gap-3">
              {/* Stepper Dot & Connecting Line */}
              <div className="flex w-6 flex-col items-center">
                {isCompleted ? (
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs ring-2 ring-blue-600/20">
                    <Check className="size-3.5 stroke-[2.5]" />
                  </span>
                ) : (
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-400 shadow-2xs">
                    <span className="size-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                  </span>
                )}

                {!isLast && (
                  <span
                    className={cn(
                      "w-0.5 flex-1 my-1 min-h-6 transition-colors",
                      nextStageCompleted ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                    )}
                  />
                )}
              </div>

              {/* Stage Content */}
              <div className={cn("flex flex-col gap-0.5", !isLast && "pb-5")}>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-[13px] font-semibold",
                      isCompleted ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {t(stage.label)}
                  </span>

                  {isCurrentActive && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.2 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                      <span className="size-1.5 rounded-full bg-blue-600 animate-pulse" />
                      {t("Active Stage")}
                    </span>
                  )}
                </div>

                <span
                  className={cn(
                    "text-xs leading-normal",
                    isCompleted ? "text-muted-foreground" : "text-muted-foreground/75"
                  )}
                >
                  {t(stage.description)}
                </span>

                {/* Staff remarks if recorded in history */}
                {remarks && (
                  <div className="mt-1 rounded-md bg-surface-muted/70 px-2 py-1 text-xs text-foreground/90 border border-border/60">
                    <span className="font-semibold">{t("Update:")} </span>
                    <span>{remarks}</span>
                  </div>
                )}

                {/* Timestamp if reached */}
                {timestamp && (
                  <span className="text-[11px] text-muted-foreground/70 mt-0.5">
                    {formatDateTime(timestamp)}
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
