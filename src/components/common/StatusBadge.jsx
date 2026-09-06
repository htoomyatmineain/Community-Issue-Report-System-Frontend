import { REPORT_STATUS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

/** Colored pill for a report status value (matches the backend's ReportStatus enum). */
export default function StatusBadge({ status }) {
  const config = REPORT_STATUS[status?.toUpperCase()];
  const { t } = useLanguage();

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        config ? cn(config.bgClass, config.textClass) : "bg-muted text-muted-foreground"
      )}
    >
      {config?.icon && <config.icon className="h-3.5 w-3.5" />}
      {t(config?.label ?? status ?? "Unknown")}
    </span>
  );
}
