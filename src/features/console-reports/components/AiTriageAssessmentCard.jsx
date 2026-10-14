import { Bot, Sparkles, AlertTriangle, CheckCircle2, ShieldCheck, ArrowRightLeft, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function AiTriageAssessmentCard({ report, isAdmin, onOpenOverride }) {
  const { t } = useLanguage();

  if (!report?.aiTriaged && !report?.aiConfidenceScore && !report?.aiTriageDecision) {
    return null;
  }

  const confidence = report.aiConfidenceScore ?? 0;
  const isAutoRouted = report.aiTriageDecision === "AUTO_ROUTED";
  const isOverridden = report.aiTriageDecision === "MANUALLY_OVERRIDDEN";
  const isFlagged = report.aiTriageDecision === "FLAGGED_FOR_REVIEW" || (!isAutoRouted && !isOverridden);

  const flagsList = report.aiFlags
    ? report.aiFlags.split(",").map((f) => f.trim()).filter(Boolean)
    : [];

  return (
    <div className="flex flex-col gap-3.5 rounded-xl border border-console-border/80 bg-surface p-4.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] relative overflow-hidden">
      {/* Decorative background accent glow */}
      <div
        className={cn(
          "absolute -top-12 -right-12 size-36 rounded-full blur-3xl pointer-events-none opacity-20",
          isAutoRouted ? "bg-emerald-500" : isOverridden ? "bg-purple-500" : "bg-amber-500"
        )}
      />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-console-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-7 items-center justify-center rounded-lg border",
              isAutoRouted
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : isOverridden
                ? "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400"
                : "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
            )}
          >
            <Sparkles className="size-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-tight text-ink flex items-center gap-1.5">
              <span>{t("AI Image Analysis & Auto-Triage")}</span>
              <span className="text-[10px] font-mono font-normal text-ink-muted">v2.1</span>
            </h4>
          </div>
        </div>

        {/* Triage Decision Badge */}
        <div>
          {isAutoRouted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="size-3" />
              {t("Auto-Approved & Routed")}
            </span>
          )}
          {isOverridden && (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 border border-purple-500/25 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700 dark:text-purple-300">
              <ArrowRightLeft className="size-3" />
              {t("Manually Overridden by Admin")}
            </span>
          )}
          {isFlagged && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/25 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
              <AlertTriangle className="size-3" />
              {t("Held for Human Review")}
            </span>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Confidence Gauge */}
        <div className="rounded-lg border border-console-border/70 bg-surface-muted/40 p-3">
          <div className="flex items-center justify-between text-xs text-ink-muted mb-1.5">
            <span className="font-medium text-ink">{t("Confidence Score")}</span>
            <span className="font-mono font-bold text-ink text-sm">{confidence}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                confidence >= 85
                  ? "bg-emerald-500"
                  : confidence >= 60
                  ? "bg-amber-500"
                  : "bg-rose-500"
              )}
              style={{ width: `${Math.min(confidence, 100)}%` }}
            />
          </div>
          <span className="mt-1.5 block text-[10px] text-ink-muted">
            {confidence >= 85
              ? t("Exceeds 85% fast-track threshold for direct dispatch.")
              : t("Below 85% threshold; requires administrative sign-off.")}
          </span>
        </div>

        {/* Image Health Check */}
        <div className="rounded-lg border border-console-border/70 bg-surface-muted/40 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-muted">
            <span className="font-medium text-ink flex items-center gap-1.5">
              <ImageIcon className="size-3.5 text-ink-muted" />
              {t("Image Clarity Check")}
            </span>
            <span
              className={cn(
                "font-medium text-[11px] px-1.5 py-0.5 rounded",
                report.aiImageQuality === "CLEAR"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : report.aiImageQuality === "BLURRY"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : report.aiImageQuality === "MISMATCH"
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : "bg-surface-muted text-ink-muted"
              )}
            >
              {report.aiImageQuality ?? t("UNSPECIFIED")}
            </span>
          </div>

          <p className="mt-1 text-[11px] text-ink-muted leading-relaxed">
            {report.aiImageQuality === "CLEAR" && t("Photo exhibits sharp edges, clear focus, and verified municipal scene context.")}
            {report.aiImageQuality === "BLURRY" && t("Photo exhibits motion blur or underexposure; human verification advised.")}
            {report.aiImageQuality === "MISMATCH" && t("Visual content or description does not match selected department category.")}
            {report.aiImageQuality === "LOW_RESOLUTION" && t("File resolution or dimension is below reliable automated detection standards.")}
            {report.aiImageQuality === "NO_IMAGE" && t("No photo attached; report held in pending queue.")}
          </p>
        </div>
      </div>

      {/* Explainability Callout Box */}
      {report.aiReasoning && (
        <div className="rounded-lg border border-console-border/60 bg-surface-muted/30 p-3">
          <span className="text-[11px] font-semibold text-ink flex items-center gap-1 mb-1">
            <Bot className="size-3 text-ink-muted" />
            {t("Explainable AI Rationale:")}
          </span>
          <p className="text-xs text-ink-muted leading-relaxed italic">
            "{report.aiReasoning}"
          </p>
        </div>
      )}

      {/* Diagnostic Flag Badges */}
      {flagsList.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-medium text-ink-muted">{t("Signals:")}</span>
          {flagsList.map((flag) => (
            <span
              key={flag}
              className={cn(
                "rounded-md px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-tight border",
                flag.includes("VERIFIED") || flag.includes("FAST_TRACK")
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : flag.includes("HAZARD")
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              )}
            >
              {flag}
            </span>
          ))}
        </div>
      )}

      {/* Admin Override Action */}
      {isAdmin && (
        <div className="flex items-center justify-between border-t border-console-border/50 pt-2.5 mt-0.5">
          <div className="flex items-center gap-1.5 text-[11px] text-ink-muted">
            <ShieldCheck className="size-3.5 text-ink-muted" />
            <span>{t("Municipal Administrator Human Oversight")}</span>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onOpenOverride}
            className="h-7 text-xs px-2.5 rounded-lg border-console-border hover:bg-surface-muted active:scale-95 transition-all flex items-center gap-1.5"
          >
            <ArrowRightLeft className="size-3" />
            <span>{t("Override AI Decision")}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
