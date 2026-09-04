import StatusTimeline from "@/components/common/StatusTimeline";
import { REPORT_STATUS } from "@/lib/constants";
import { useLanguage } from "@/app/providers/LanguageProvider";

/** First history row has oldStatus === null (database-schema.md: "nullable (null on creation)"). */
function stepLabelKey({ oldStatus, newStatus }) {
  return oldStatus == null ? "Report submitted" : REPORT_STATUS[newStatus]?.label ?? newStatus;
}

/** Console Report Detail's "Timeline" tab — the full status_history, remarks included. */
export default function TimelineTab({ history }) {
  const { t } = useLanguage();

  if (!history?.length) {
    return <p className="py-6 text-sm text-ink-muted">{t("No status changes yet.")}</p>;
  }

  const steps = history.map((h) => ({ labelKey: stepLabelKey(h), remarks: h.remarks, at: h.changedAt }));
  return <StatusTimeline steps={steps} />;
}
