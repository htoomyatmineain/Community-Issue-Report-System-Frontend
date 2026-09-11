import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * One-line count shown as a footer under a console table.
 *  - default:   "12 citizens for now"
 *  - filtered:  "3 found for this search"   (a search box or filter is narrowing the list)
 *
 * `noun` is the plural English noun for the rows ("citizens", "departments", …);
 * it is passed through t() so the Burmese label is picked up too.
 */
export default function TableSummary({ count, noun, filtered = false, className }) {
  const { t } = useLanguage();

  return (
    <p
      className={cn(
        "border-t border-console-border px-4 py-3 text-xs text-ink-muted",
        className
      )}
    >
      {filtered
        ? t("{count} found for this search", { count })
        : t("{count} {noun} for now", { count, noun: t(noun) })}
    </p>
  );
}
