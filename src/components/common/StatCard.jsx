import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

const TONES = {
  blue: "bg-status-assigned-bg text-status-assigned",
  green: "bg-status-resolved-bg text-status-resolved",
  amber: "bg-status-pending-bg text-status-pending",
  red: "bg-status-rejected-bg text-status-rejected",
  violet: "bg-status-progress-bg text-status-progress",
};

/**
 * Single metric card used on console dashboards (ref: ref-img/gov-staff/DB-card-00.jpg).
 * `tone` picks the pastel color for the label chip. `trend` is optional:
 * `{ direction: "up" | "down", value: "20%", caption? }`.
 */
export default function StatCard({ label, value, icon: Icon, tone = "blue", trend }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-console border border-console-border bg-surface p-5">
      <span
        className={cn(
          "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold",
          TONES[tone] ?? TONES.blue
        )}
      >
        {Icon && <Icon className="size-4" />}
        {t(label)}
      </span>

      <span className="font-display text-3xl font-bold text-ink">{value}</span>

      {trend && (
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          {t(trend.caption ?? "Since Last Week")}
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold",
              trend.direction === "up" ? TONES.green : TONES.red
            )}
          >
            {trend.direction === "up" ? (
              <ArrowUp className="size-3" />
            ) : (
              <ArrowDown className="size-3" />
            )}
            {trend.value}
          </span>
        </div>
      )}
    </div>
  );
}
