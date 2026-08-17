import { Clock, Send, LoaderCircle, CheckCircle2, Archive, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const STYLES = {
  pending: { icon: Clock, text: "text-status-pending", bg: "bg-status-pending-bg", label: "Pending approval" },
  approved: { icon: CheckCircle2, text: "text-status-assigned", bg: "bg-status-assigned-bg", label: "Approved" },
  assigned: { icon: Send, text: "text-status-assigned", bg: "bg-status-assigned-bg", label: "Assigned" },
  in_progress: { icon: LoaderCircle, text: "text-status-progress", bg: "bg-status-progress-bg", label: "In progress" },
  resolved: { icon: CheckCircle2, text: "text-status-resolved", bg: "bg-status-resolved-bg", label: "Resolved" },
  closed: { icon: Archive, text: "text-status-closed", bg: "bg-status-closed-bg", label: "Closed" },
  rejected: { icon: XCircle, text: "text-status-rejected", bg: "bg-status-rejected-bg", label: "Denied" },
};

/** Colored pill for a report/account status value. Icon + label, never color-only. */
export default function StatusBadge({ status }) {
  const style = STYLES[status];
  const Icon = style?.icon ?? Clock;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        style ? `${style.bg} ${style.text}` : "bg-muted text-muted-foreground"
      )}
    >
      <Icon className="size-3.5" />
      {style?.label ?? status?.replace("_", " ")}
    </span>
  );
}
