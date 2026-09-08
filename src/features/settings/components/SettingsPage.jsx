import { Globe, Languages, Moon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import MyanmarFlagCircle from "@/components/common/MyanmarFlagCircle";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useLanguage } from "@/app/providers/LanguageProvider";

const LANGS = [
  { value: "en", native: "English" },
  { value: "my", native: "မြန်မာ" },
];

/**
 * Personal preferences — reached from the settings gear in the citizen header
 * and the console topbar. Two cards: dark-mode toggle and language.
 */
export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const isDark = theme === "dark";

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-5 pb-10 pt-6">
      <h1 className="text-xl font-semibold text-foreground">{t("Settings")}</h1>

      {/* Appearance */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Moon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">{t("Dark mode")}</p>
            <p className="text-xs text-muted-foreground">
              {t("Use the dark theme across Kinn Htout")}
            </p>
          </div>
          <Switch
            checked={isDark}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            aria-label={t("Dark mode")}
          />
        </div>
      </Card>

      {/* Language */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Languages className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">{t("Language")}</p>
            <p className="text-xs text-muted-foreground">
              {t("Choose your preferred language")}
            </p>
          </div>
        </div>

        <div className="border-t border-border">
          {LANGS.map((lang) => {
            const selected = language === lang.value;
            return (
              <button
                key={lang.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setLanguage(lang.value)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60",
                  selected && "bg-muted/40"
                )}
              >
                {lang.value === "my" ? (
                  <MyanmarFlagCircle className="size-6" />
                ) : (
                  <Globe className="size-6 text-muted-foreground" aria-hidden="true" />
                )}
                <span className="flex-1 text-sm font-medium text-foreground">
                  {lang.native}
                </span>
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    selected ? "border-primary" : "border-muted-foreground/40"
                  )}
                  aria-hidden="true"
                >
                  {selected && <span className="size-2.5 rounded-full bg-primary" />}
                </span>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
