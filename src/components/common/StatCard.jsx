import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * Console dashboard metric card: a plain label, a large value, and an optional
 * month-over-month trend line ("increased 1,234 than last month").
 *
 * `trend`: `{ direction: "up" | "down", value: string | number }`.
 */
export default function StatCard({ label, value, trend }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-1 flex-col gap-3 rounded-console border border-console-border bg-surface p-6">
      <span className="text-[15px] font-medium text-ink">{t(label)}</span>

      <span className="font-display text-4xl font-bold leading-none text-ink">{value}</span>

      {trend && (
        <span className="text-[13px] text-ink-muted">
          {t(trend.direction === "up" ? "increased" : "decreased")}{" "}
          <span
            className={cn(
              "font-bold",
              trend.direction === "up"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            )}
          >
            {trend.value}
          </span>{" "}
          {t("than last month")}
        </span>
      )}
    </div>
  );
}
