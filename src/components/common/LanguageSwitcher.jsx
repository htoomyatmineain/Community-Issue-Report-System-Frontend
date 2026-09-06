import { Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

const OPTIONS = [
  { value: "en", label: "EN", name: "English" },
  { value: "my", label: "မြန်မာ", name: "Myanmar" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-console-border bg-surface-muted p-1"
      role="group"
      aria-label={t("Language: English")}
    >
      <Globe2 className="ml-2 size-4 text-ink-muted" aria-hidden="true" />
      {OPTIONS.map((option) => {
        const isActive = language === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            aria-label={t(`Language: ${option.name}`)}
            onClick={() => setLanguage(option.value)}
            className={cn(
              "min-h-8 rounded-full px-2.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1",
              isActive ? "bg-surface text-brand shadow-sm" : "text-ink-muted hover:text-ink"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}