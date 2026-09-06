import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

/** "How did we do?" card — star rating + optional comment, or a read-only summary if already submitted. */
export default function FeedbackForm({ feedback, onSubmit, isSubmitting, error }) {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  if (feedback) {
    return (
      <section className="flex flex-col gap-3 rounded-lg bg-muted p-6">
        <h2 className="font-display text-sm font-bold text-foreground">{t("Your feedback")}</h2>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={cn(
                "h-6 w-6",
                n <= feedback.rating ? "fill-amber-500 text-amber-500" : "text-border"
              )}
            />
          ))}
        </div>
        {feedback.comment && <p className="text-sm text-muted-foreground">{feedback.comment}</p>}
      </section>
    );
  }

  const shownRating = hoverRating || rating;

  return (
    <section className="flex flex-col gap-3 rounded-lg bg-muted p-6">
      <h2 className="font-display text-sm font-bold text-foreground">{t("How did we do?")}</h2>

      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={n > 1 ? t("{n} stars", { n }) : t("{n} star", { n })}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <Star
              className={cn(
                "h-6 w-6",
                n <= shownRating ? "fill-amber-500 text-amber-500" : "text-border"
              )}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t("Comment (optional)")}
        rows={3}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        disabled={!rating || isSubmitting}
        onClick={() => onSubmit({ rating, comment: comment.trim() })}
      >
        {isSubmitting ? t("Submitting…") : t("Submit feedback")}
      </Button>
    </section>
  );
}
