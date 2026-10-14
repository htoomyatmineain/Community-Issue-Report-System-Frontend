import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  CheckCircle2,
  Check,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * Municipal Decision Support System (DSS) Recommendation Panel.
 * Translates municipal ticket telemetry into explainable, evidence-backed operational guidance.
 *
 * Each card explains:
 * 1. What requires attention right now (Title & Severity)
 * 2. Why it requires attention (Operational Rationale)
 * 3. What evidence supports the recommendation (Real metrics & ticket codes)
 * 4. What action to consider (Direct Link to filtered workflow)
 * 5. Transparent Data Limitations (Caveats regarding missing capacity data)
 */
export default function AdminDecisionSupportPanel({
  recommendations = [],
  onDismiss,
  isLoading = false,
  isDemoData = true,
}) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("ALL"); // 'ALL' | 'CRITICAL' | 'WARNING'
  const [acknowledgedIds, setAcknowledgedIds] = useState([]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-console-border/70 bg-surface p-5 animate-pulse">
        <div className="h-4 w-48 rounded bg-surface-muted" />
        <div className="mt-3 h-20 rounded bg-surface-muted/60" />
      </div>
    );
  }

  const handleDismiss = (id) => {
    setAcknowledgedIds((prev) => [...prev, id]);
    if (onDismiss) {
      onDismiss(id);
    }
  };

  const filteredRecommendations = recommendations
    .filter((r) => !acknowledgedIds.includes(r.id))
    .filter((r) => {
      if (filter === "CRITICAL") return r.severity === "CRITICAL";
      if (filter === "WARNING") return r.severity === "WARNING";
      return true;
    });

  const criticalCount = recommendations.filter((r) => r.severity === "CRITICAL").length;
  const warningCount = recommendations.filter((r) => r.severity === "WARNING").length;

  return (
    <div className="flex flex-col rounded-xl border border-console-border/70 bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* Panel Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-console-border/50 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Sparkles className="size-3.5" />
            </span>
            <h2 className="font-display text-sm font-semibold tracking-tight text-ink">
              {t("Decision Support & Operational Recommendations")}
            </h2>
            <span className="inline-flex items-center rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
              DSS
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ink-muted">
            {t("Deterministic, evidence-based municipal guidance derived from active SLAs, department load, and queue depth.")}
          </p>
        </div>

        {/* Data Provenance & Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Data Provenance Indicator */}
          <div
            className="flex items-center gap-1.5 rounded-lg border border-console-border/60 bg-surface-muted/40 px-2.5 py-1 text-[11px] font-medium text-ink-muted"
            title={
              isDemoData
                ? "Calculated dynamically from the municipal database seed."
                : "Real-time production data from municipal system."
            }
          >
            <span className={cn("size-1.5 rounded-full", isDemoData ? "bg-amber-500" : "bg-emerald-500 animate-pulse")} />
            <span>{isDemoData ? t("Simulated Stream") : t("Live Telemetry")}</span>
          </div>

          {/* Severity Filter Pills */}
          <div className="flex items-center rounded-lg border border-console-border/70 bg-surface-muted/50 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={cn(
                "rounded-md px-2 py-0.5 font-medium transition-colors",
                filter === "ALL" ? "bg-surface text-ink shadow-xs" : "text-ink-muted hover:text-ink"
              )}
            >
              {t("All ({count})", { count: recommendations.length })}
            </button>
            <button
              type="button"
              onClick={() => setFilter("CRITICAL")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-0.5 font-medium transition-colors",
                filter === "CRITICAL" ? "bg-surface text-rose-600 dark:text-rose-400 shadow-xs" : "text-ink-muted hover:text-ink"
              )}
            >
              <span className="size-1.5 rounded-full bg-rose-500" />
              {t("Critical ({count})", { count: criticalCount })}
            </button>
            <button
              type="button"
              onClick={() => setFilter("WARNING")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-0.5 font-medium transition-colors",
                filter === "WARNING" ? "bg-surface text-amber-600 dark:text-amber-400 shadow-xs" : "text-ink-muted hover:text-ink"
              )}
            >
              <span className="size-1.5 rounded-full bg-amber-500" />
              {t("Warnings ({count})", { count: warningCount })}
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="mt-4 flex flex-col gap-3">
        {filteredRecommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
              <CheckCircle2 className="size-5" />
            </div>
            <span className="text-sm font-semibold text-ink">
              {t("All Municipal Operations Within Thresholds")}
            </span>
            <p className="mt-1 max-w-md text-xs text-ink-muted">
              {t("Zero SLA breaches, balanced department workloads, and clear triage queues detected. The system will alert you when action is required.")}
            </p>
          </div>
        ) : (
          filteredRecommendations.map((rec) => {
            const isCritical = rec.severity === "CRITICAL";

            return (
              <div
                key={rec.id}
                className={cn(
                  "relative flex flex-col rounded-xl border border-console-border/80 p-4 sm:p-5 transition-all duration-150 shadow-xs",
                  isCritical
                    ? "border-l-4 border-l-rose-500 bg-rose-500/[0.025] dark:bg-rose-950/[0.08]"
                    : "border-l-4 border-l-amber-500 bg-amber-500/[0.025] dark:bg-amber-950/[0.08]"
                )}
              >
                {/* Level 1: Meta Bar (Severity Pill, Category Pill, Dismiss Button) */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase border",
                        isCritical
                          ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      )}
                    >
                      {isCritical ? (
                        <>
                          <AlertOctagon className="size-3.5 shrink-0" />
                          <span>{t("CRITICAL ATTENTION")}</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="size-3.5 shrink-0" />
                          <span>{t("ACTION ADVISORY")}</span>
                        </>
                      )}
                    </span>

                    <span className="inline-flex items-center rounded-md bg-brand/10 border border-brand/20 px-2 py-0.5 text-[11px] font-semibold text-brand">
                      {rec.category ? rec.category.replace(/_/g, " ") : "MUNICIPAL OPERATIONS"}
                    </span>
                  </div>

                  {/* Dismiss / Acknowledge 'X' */}
                  <button
                    type="button"
                    onClick={() => handleDismiss(rec.id)}
                    className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-console-border/70 text-ink-muted/70 hover:border-console-border hover:bg-surface-muted hover:text-ink transition-colors"
                    title={t("Acknowledge recommendation")}
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Level 2: Directive Headline */}
                <h3 className="mt-2.5 font-display text-sm sm:text-[15px] font-bold tracking-tight text-ink leading-snug">
                  {rec.title}
                </h3>

                {/* Level 3: Operational Rationale */}
                <p className="mt-1.5 text-xs text-ink/85 leading-relaxed">
                  <strong className="font-semibold text-ink">{t("Why it requires attention:")} </strong>
                  {rec.reason}
                </p>

                {/* Level 4: Supporting Evidence Chips */}
                {rec.evidence?.length > 0 && (
                  <div className="mt-3 rounded-lg border border-console-border/60 bg-surface/90 p-3 shadow-2xs">
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                      {t("Supporting Evidence")}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {rec.evidence.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 rounded-md border border-console-border/70 bg-surface-muted/50 px-2.5 py-1 text-xs font-medium text-ink leading-tight"
                        >
                          <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transparent Limitations Note */}
                {rec.limitation && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-ink-muted">
                    <Info className="size-3.5 text-ink-muted/70 shrink-0" />
                    <span className="italic leading-normal">{rec.limitation}</span>
                  </div>
                )}

                {/* Level 5: Action Tray */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-console-border/50 pt-3">
                  <div className="text-xs text-ink-muted min-w-0">
                    <span className="font-semibold text-ink">{t("Recommended Action:")} </span>
                    <span className="leading-normal">{rec.suggestedAction}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDismiss(rec.id)}
                      className="rounded-lg border border-console-border px-3 py-1.5 text-xs font-medium text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors active:scale-95"
                    >
                      {t("Acknowledge")}
                    </button>

                    {rec.actionLink && (
                      <Link
                        to={rec.actionLink}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-brand/90 hover:shadow active:scale-95"
                      >
                        <span>{t(rec.actionLabel || "Inspect Now")}</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
