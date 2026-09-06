import { useLanguage } from "@/app/providers/LanguageProvider";

/** Placeholder shown for empty tables/lists. */
export default function EmptyState({ title = "Nothing here yet", description, action }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <p className="text-sm font-medium">{t(title)}</p>
      {description && <p className="text-sm text-muted-foreground">{t(description)}</p>}
      {action}
    </div>
  );
}
