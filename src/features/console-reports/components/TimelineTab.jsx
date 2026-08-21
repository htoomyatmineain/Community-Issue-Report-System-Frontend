import StatusTimeline from "@/components/common/StatusTimeline";
import { REPORT_STATUS } from "@/lib/constants";

/** First history row has oldStatus === null (database-schema.md: "nullable (null on creation)"). */
function stepLabel({ oldStatus, newStatus, remarks }) {
  const label = oldStatus == null ? "Report submitted" : REPORT_STATUS[newStatus]?.label ?? newStatus;
  return remarks ? `${label} — ${remarks}` : label;
}

/** Console Report Detail's "Timeline" tab — the full status_history, remarks included. */
export default function TimelineTab({ history }) {
  if (!history?.length) {
    return <p className="py-6 text-sm text-ink-muted">No status changes yet.</p>;
  }

  const steps = history.map((h) => ({ label: stepLabel(h), at: h.changedAt }));
  return <StatusTimeline steps={steps} />;
}
