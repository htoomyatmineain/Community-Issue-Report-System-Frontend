import { Sparkles } from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * Transparent demonstration banner indicating that the dashboard metrics
 * are dynamically calculated from the municipal mock stream.
 */
export default function DemoNoticeBanner({ meta }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-2.5 text-xs text-ink-muted">
      <div className="flex items-center gap-2.5">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <Sparkles className="size-3.5" />
        </span>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="font-semibold text-ink">
            {t("Simulated Municipal Dataset")}
          </span>
          <span className="hidden sm:inline text-ink-muted/50">·</span>
          <span>
            {t("Executive decision KPIs dynamically derived from simulated ticket telemetry.")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 font-mono text-[11px] text-ink-muted shrink-0">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-console-border bg-surface px-2 py-0.5 font-medium">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {meta?.totalReports ?? 32} {t("Records")}
        </span>
        <span className="inline-flex items-center rounded-md border border-console-border bg-surface px-2 py-0.5 font-medium">
          {meta?.activeDepartments ?? 7} {t("Departments")}
        </span>
      </div>
    </div>
  );
}
