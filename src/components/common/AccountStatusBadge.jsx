import { ACCOUNT_STATUS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Colored pill for a user's accountStatus value (matches the backend's AccountStatus enum). */
export default function AccountStatusBadge({ status }) {
  const config = ACCOUNT_STATUS[status?.toUpperCase()];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        config ? cn(config.bgClass, config.textClass) : "bg-muted text-muted-foreground"
      )}
    >
      {config?.icon && <config.icon className="h-3.5 w-3.5" />}
      {config?.label ?? status ?? "Unknown"}
    </span>
  );
}
