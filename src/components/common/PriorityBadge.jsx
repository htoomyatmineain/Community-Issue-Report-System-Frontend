import { REPORT_PRIORITY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

/** Colored pill for a report's priority value (matches the backend's ReportPriority enum). */
export default function PriorityBadge({ priority }) {
  const config = REPORT_PRIORITY[priority?.toUpperCase()];
  const { t } = useLanguage();

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-wider",
        config ? cn(config.bgClass, config.textClass) : "bg-muted text-muted-foreground"
      )}
    >
      {config?.icon && <config.icon className="h-3.5 w-3.5" />}
      {t(config?.label ?? priority ?? "Unknown")}
    </span>
  );
}
