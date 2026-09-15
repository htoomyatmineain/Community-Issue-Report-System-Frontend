import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * Console dashboard metric card: a plain label, a large value, and an optional
 * month-over-month trend line ("increased 1,234 than last month").
 *
 * `trend`: `{ direction: "up" | "down", value: string | number }`.
 * `to`: when given, the whole card becomes a link to that route (e.g. the
 * matching pre-filtered slice of the Reports list) with a hover/focus state.
 */
export default function StatCard({ label, value, trend, to }) {
  const { t } = useLanguage();
  const Wrapper = to ? Link : "div";

  return (
    <Wrapper
      {...(to ? { to } : {})}
      className={cn(
        "flex flex-1 flex-col gap-3 rounded-console border border-console-border bg-surface p-6",
        to && "transition-colors hover:border-brand hover:bg-surface-muted"
      )}
    >
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
    </Wrapper>
  );
}
