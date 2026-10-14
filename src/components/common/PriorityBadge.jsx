import { REPORT_PRIORITY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

/** Colored text for a report's priority value (Normal: green, High: yellow, Urgent: red, Low: blue). */
export default function PriorityBadge({ priority, variant = "text", showIcon = false, className }) {
  const config = REPORT_PRIORITY[priority?.toUpperCase()];
  const { t } = useLanguage();

  if (variant === "badge") {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-wider",
          config ? cn(config.bgClass, config.textClass) : "bg-muted text-muted-foreground",
          className
        )}
      >
        {config?.icon && <config.icon className="h-3.5 w-3.5" />}
        {t(config?.label ?? priority ?? "Unknown")}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-wider",
        config?.textClass ?? "text-muted-foreground",
        className
      )}
    >
      {showIcon && config?.icon && <config.icon className="size-3.5 shrink-0" />}
      <span>{t(config?.label ?? priority ?? "Unknown")}</span>
    </span>
  );
}

