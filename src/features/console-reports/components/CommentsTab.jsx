import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import EmptyState from "@/components/common/EmptyState";
import { useLanguage } from "@/app/providers/LanguageProvider";

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

/** Console Report Detail's "Comments" tab — internal department notes, never shown to citizens. */
export default function CommentsTab({ comments, onAddComment }) {
  const { t } = useLanguage();
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!body.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddComment({ body: body.trim() });
      setBody("");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? t("Failed to add comment"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {!comments?.length ? (
        <EmptyState title="No comments yet" description="Internal notes for the handling department." />
      ) : (
        <ul className="flex flex-col gap-4">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-console border border-console-border p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">{comment.authorName ?? t("Staff")}</span>
                <span className="text-xs text-ink-muted">{formatDateTime(comment.createdAt)}</span>
              </div>
              <p className="text-sm text-ink-muted">{comment.body}</p>
              {comment.mentionedDepartmentName && (
                <span className="mt-1 inline-block text-xs font-medium text-brand">
                  @{comment.mentionedDepartmentName}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-2">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={t("Add an internal comment…")}
          rows={3}
        />
        <Button className="self-end" disabled={!body.trim() || isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? t("Adding…") : t("Add comment")}
        </Button>
      </div>
    </div>
  );
}
