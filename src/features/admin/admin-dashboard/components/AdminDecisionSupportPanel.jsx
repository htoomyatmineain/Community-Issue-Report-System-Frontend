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
                  "relative flex flex-col rounded-xl border p-4 transition-all duration-150",
                  isCritical
                    ? "border-rose-500/30 bg-rose-500/[0.02] dark:bg-rose-950/[0.04]"
                    : "border-amber-500/30 bg-amber-500/[0.02] dark:bg-amber-950/[0.04]"
                )}
              >
                {/* Header Row: Severity Badge, Title, Dismiss */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide border",
                        isCritical
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      )}
                    >
                      {isCritical ? (
                        <>
                          <AlertOctagon className="size-3" />
                          <span>{t("CRITICAL ATTENTION")}</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="size-3" />
                          <span>{t("ACTION ADVISORY")}</span>
                        </>
                      )}
                    </span>

                    <span className="font-display text-[13px] font-semibold text-ink">
                      {rec.title}
                    </span>
                  </div>

                  {/* Acknowledge Button */}
                  <button
                    type="button"
                    onClick={() => handleDismiss(rec.id)}
                    className="flex size-6 shrink-0 items-center justify-center rounded-md border border-console-border text-ink-muted/70 hover:border-ink-muted hover:text-ink transition-colors"
                    title={t("Acknowledge recommendation")}
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                {/* Why It Requires Attention (Operational Rationale) */}
                <p className="mt-2 text-xs text-ink/80 leading-relaxed">
                  <strong className="font-semibold text-ink">{t("Why it requires attention:")} </strong>
                  {rec.reason}
                </p>

                {/* Concrete Supporting Evidence */}
                {rec.evidence?.length > 0 && (
                  <div className="mt-2.5 rounded-lg border border-console-border/60 bg-surface p-2.5">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-muted/80">
                      {t("Supporting Evidence")}
                    </span>
                    <ul className="mt-1 flex flex-col gap-1 text-xs text-ink">
                      {rec.evidence.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-brand" />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Data Transparency & Limitations Note */}
                {rec.limitation && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-muted">
                    <Info className="size-3 text-ink-muted/70 shrink-0" />
                    <span className="italic leading-normal">{rec.limitation}</span>
                  </div>
                )}

                {/* Action Bar */}
                <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-console-border/40 pt-3">
                  <div className="text-xs text-ink-muted">
                    <span className="font-medium text-ink">{t("Recommended Action:")} </span>
                    <span>{rec.suggestedAction}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDismiss(rec.id)}
                      className="rounded-lg border border-console-border px-2.5 py-1.5 text-xs font-medium text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors"
                    >
                      {t("Acknowledge")}
                    </button>

                    {rec.actionLink && (
                      <Link
                        to={rec.actionLink}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-transform hover:bg-brand/90 active:scale-95"
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
