import { X } from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "@/components/common/StatusBadge";
import PriorityBadge from "@/components/common/PriorityBadge";
import { Button } from "@/components/ui/button";

const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

/** Console full map view's slide-over — a report summary shown when a pin is clicked (ui-rules.md). */
export default function PinDetailPanel({ pin, basePath, onClose }) {
  if (!pin) return null;

  return (
    <div className="absolute right-0 top-0 z-[1000] flex h-full w-80 flex-col gap-4 border-l border-console-border bg-surface p-5 shadow-lg">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={pin.status} />
          <PriorityBadge priority={pin.priority} />
        </div>
        <button type="button" aria-label="Close" onClick={onClose} className="text-ink-muted hover:text-ink">
          <X className="size-4" />
        </button>
      </div>

      <div>
        <span className="block text-xs text-ink-muted">Category</span>
        <span className="text-sm font-semibold text-ink">{pin.categoryName}</span>
      </div>

      <div>
        <span className="block text-xs text-ink-muted">Report code</span>
        <span className="font-mono text-sm text-ink">{pin.reportCode}</span>
      </div>

      <div>
        <span className="block text-xs text-ink-muted">Submitted</span>
        <span className="text-sm text-ink">{formatDateTime(pin.createdAt)}</span>
      </div>

      <Button asChild className="mt-auto w-full">
        <Link to={`${basePath}/${pin.id}`}>View full report</Link>
      </Button>
    </div>
  );
}
