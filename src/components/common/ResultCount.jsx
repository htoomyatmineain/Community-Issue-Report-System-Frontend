import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * One-line summary strip that sits directly above a data table.
 *
 * - no search / filter active → "7 staff accounts exist for now"
 * - a search or filter is active → "3 results found in this search"
 *
 * `noun` must already be translated (pass `t("staff accounts")`), since the
 * interpolated value isn't run through `t()` again.
 */
export default function ResultCount({ count, noun, filtered = false, className }) {
  const { t } = useLanguage();
  const text = filtered
    ? t("{count} results found in this search", { count })
    : t("{count} {noun} exist for now", { count, noun });

  return (
    <p
      className={cn(
        "border-b border-console-border px-4 py-2.5 text-xs text-ink-muted",
        className
      )}
    >
      {text}
    </p>
  );
}
