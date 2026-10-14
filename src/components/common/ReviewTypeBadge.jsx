import { Sparkles, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

export function isReportAiReviewed(report) {
  if (!report) return false;
  if (report.aiTriageDecision === "AUTO_ROUTED") return true;
  if (
    report.aiTriageDecision === "FLAGGED_FOR_REVIEW" ||
    report.aiTriageDecision === "MANUALLY_OVERRIDDEN"
  ) {
    return false;
  }
  if (report.aiTriaged || report.isAiTriaged) {
    return (report.aiConfidenceScore ?? 0) >= 85;
  }
  return false;
}

/**
 * Distinguishes tickets processed via automated AI routing vs. human manual oversight.
 * Renders an "AI Review" or "Manual Review" badge.
 */
export default function ReviewTypeBadge({ report, isAi, size = "sm", className }) {
  const { t } = useLanguage();
  const isAiReview = isAi !== undefined ? Boolean(isAi) : isReportAiReviewed(report);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border font-medium tracking-tight shadow-2xs transition-colors",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        isAiReview
          ? "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300"
          : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
        className
      )}
    >
      {isAiReview ? (
        <>
          <Sparkles className={size === "sm" ? "size-2.5 text-purple-600 dark:text-purple-400" : "size-3 text-purple-600 dark:text-purple-400"} />
          <span>{t("AI Review")}</span>
        </>
      ) : (
        <>
          <UserCheck className={size === "sm" ? "size-2.5 text-amber-600 dark:text-amber-400" : "size-3 text-amber-600 dark:text-amber-400"} />
          <span>{t("Manual Review")}</span>
        </>
      )}
    </span>
  );
}
