import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ArrowRightLeft,
  Image as ImageIcon,
  Bot,
} from "lucide-react";
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
  const isFlagged =
    report.aiTriageDecision === "FLAGGED_FOR_REVIEW" || (!isAutoRouted && !isOverridden);

  const flagsList = report.aiFlags
    ? report.aiFlags.split(",").map((f) => f.trim()).filter(Boolean)
    : [];

  return (
    <div className="flex flex-col gap-6 sm:gap-7 rounded-2xl border border-border/70 bg-card p-6 sm:p-7 shadow-xs">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                {t("AI Image Analysis & Auto-Triage")}
              </h3>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
                v2.1
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {t("Automated visual verification & routing model")}
            </span>
          </div>
        </div>

        {/* Triage Decision Badge */}
        <div>
          {isAutoRouted && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-xs">
              <CheckCircle2 className="h-4 w-4" />
              {t("Auto-Approved & Routed")}
            </span>
          )}
          {isOverridden && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/25 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400 shadow-xs">
              <ArrowRightLeft className="h-4 w-4" />
              {t("Manually Overridden by Admin")}
            </span>
          )}
          {isFlagged && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 shadow-xs">
              <AlertTriangle className="h-4 w-4" />
              {t("Held for Human Review")}
            </span>
          )}
        </div>
      </div>

      {/* Metrics Row with proper gaps and prominent numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Confidence Score Card */}
        <div className="flex flex-col justify-between gap-3.5 rounded-xl border border-border/60 bg-muted/20 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {t("Confidence Score")}
            </span>
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                confidence >= 85
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : confidence >= 60
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              )}
            >
              {confidence >= 85 ? t("High") : confidence >= 60 ? t("Moderate") : t("Low")}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-foreground font-mono">
              {confidence}%
            </span>
          </div>

          {/* Sleek track */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
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

          <p className="text-[11px] text-muted-foreground leading-normal">
            {confidence >= 85
              ? t("Exceeds 85% fast-track threshold for direct dispatch.")
              : t("Below 85% threshold; requires administrative sign-off.")}
          </p>
        </div>

        {/* Image Clarity Card */}
        <div className="flex flex-col justify-between gap-3.5 rounded-xl border border-border/60 bg-muted/20 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
              {t("Image Clarity Check")}
            </span>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide uppercase",
                report.aiImageQuality === "CLEAR"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : report.aiImageQuality === "BLURRY"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  : report.aiImageQuality === "MISMATCH"
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {report.aiImageQuality ?? t("UNSPECIFIED")}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {report.aiImageQuality === "CLEAR" ? (
              <span className="text-xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                {t("Clear Resolution")}
              </span>
            ) : (
              <span className="text-xl font-bold tracking-tight text-foreground">
                {report.aiImageQuality ?? t("Quality Check")}
              </span>
            )}
          </div>

          {/* Quality indicator bar matching confidence track */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                report.aiImageQuality === "CLEAR"
                  ? "w-full bg-emerald-500"
                  : report.aiImageQuality === "BLURRY"
                  ? "w-1/2 bg-amber-500"
                  : "w-1/3 bg-rose-500"
              )}
            />
          </div>

          <p className="text-[11px] text-muted-foreground leading-normal">
            {report.aiImageQuality === "CLEAR" &&
              t("Photo exhibits sharp edges, clear focus, and verified municipal scene context.")}
            {report.aiImageQuality === "BLURRY" &&
              t("Photo exhibits motion blur or underexposure; human verification advised.")}
            {report.aiImageQuality === "MISMATCH" &&
              t("Visual content or description does not match selected department category.")}
            {report.aiImageQuality === "LOW_RESOLUTION" &&
              t("File resolution or dimension is below reliable automated detection standards.")}
            {report.aiImageQuality === "NO_IMAGE" &&
              t("No photo attached; report held in pending queue.")}
          </p>
        </div>
      </div>

      {/* Explainable AI Rationale */}
      {report.aiReasoning && (
        <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/20 p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Bot className="h-4 w-4 text-brand" />
            <span>{t("Explainable AI Rationale:")}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-normal">
            {report.aiReasoning}
          </p>
        </div>
      )}

      {/* Diagnostic Signal Badges */}
      {flagsList.length > 0 && (
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <span className="text-xs font-medium text-muted-foreground">{t("Signals:")}</span>
          {flagsList.map((flag) => (
            <span
              key={flag}
              className={cn(
                "rounded-md border px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-tight",
                flag.includes("VERIFIED") || flag.includes("FAST_TRACK")
                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : flag.includes("HAZARD")
                  ? "border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              )}
            >
              {flag}
            </span>
          ))}
        </div>
      )}

      {/* Admin Override Action */}
      {isAdmin && (
        <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <span>{t("Municipal Administrator Human Oversight")}</span>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onOpenOverride}
            className="h-8 rounded-lg border-border px-3 text-xs font-medium hover:bg-muted active:scale-95 transition-all flex items-center gap-1.5"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            <span>{t("Override AI Decision")}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
