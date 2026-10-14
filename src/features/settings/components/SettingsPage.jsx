import { Globe, Languages, Moon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/common/PageHeader";
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
  const { pathname } = useLocation();
  const isDark = theme === "dark";
  const isCitizen = pathname === "/settings";

  return (
    <div className={cn("mx-auto flex w-full max-w-lg flex-col gap-4 px-5 pb-10", isCitizen ? "pt-4" : "pt-6")}>
      {!isCitizen && (
        <PageHeader
          title={t("Preferences")}
          description={t("Manage appearance and language settings.")}
        />
      )}

      {/* Appearance */}
      <Card className="rounded-2xl border-border/80 p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Moon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold tracking-tight text-foreground">{t("Dark mode")}</p>
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
      <Card className="overflow-hidden rounded-2xl border-border/80 shadow-xs">
        <div className="flex items-center gap-3 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Languages className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold tracking-tight text-foreground">{t("Language")}</p>
            <p className="text-xs text-muted-foreground">
              {t("Choose your preferred language")}
            </p>
          </div>
        </div>

        <div className="divide-y divide-border/60 border-t border-border/70">
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
