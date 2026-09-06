import { useLanguage } from "@/app/providers/LanguageProvider";

/** Title + description + primary action, used at the top of every console list page. */
export default function PageHeader({ title, description, action }) {
  const { t } = useLanguage();

  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">{t(title)}</h1>
        {description && <p className="mt-1 text-sm text-ink-muted">{t(description)}</p>}
      </div>
      {action}
    </div>
  );
}
