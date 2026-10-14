import { REPORT_STATUS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

/** Colored pill for a report status value (matches the backend's ReportStatus enum). */
export default function StatusBadge({ status, variant = "badge", className }) {
  const config = REPORT_STATUS[status?.toUpperCase()];
  const { t } = useLanguage();

  if (variant === "text") {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wider",
          config ? config.textClass : "text-muted-foreground",
          className
        )}
      >
        {config?.icon && <config.icon className="h-3.5 w-3.5" />}
        {t(config?.label ?? status ?? "Unknown")}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-wider",
        config ? cn(config.bgClass, config.textClass) : "bg-muted text-muted-foreground",
        className
      )}
    >
      {config?.icon && <config.icon className="h-3.5 w-3.5" />}
      {t(config?.label ?? status ?? "Unknown")}
    </span>
  );
}
