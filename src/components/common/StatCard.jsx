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
        "flex flex-1 flex-col gap-2.5 rounded-xl border border-console-border/70 bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-150 select-none",
        to && "hover:border-brand/40 hover:bg-surface-muted/50 hover:shadow-xs active:scale-[0.99]"
      )}
    >
      <span className="text-[13px] font-medium tracking-tight text-ink-muted">{t(label)}</span>

      <span className="font-display text-3xl font-semibold tracking-tight text-ink tabular-nums leading-none">
        {value}
      </span>

      {trend && (
        <div className="flex items-center gap-1 text-xs text-ink-muted">
          <span>{t(trend.direction === "up" ? "increased" : "decreased")}</span>
          <span
            className={cn(
              "font-medium tabular-nums",
              trend.direction === "up"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            )}
          >
            {trend.value}
          </span>
          <span>{t("than last month")}</span>
        </div>
      )}
    </Wrapper>
  );
}
