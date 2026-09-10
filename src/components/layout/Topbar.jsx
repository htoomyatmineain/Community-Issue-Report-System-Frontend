import { Bell, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTheme } from "@/app/providers/ThemeProvider";

/**
 * Top navbar — optional leading label + language + dark-mode + notifications.
 * Page titles live in page content, not here. `heading` is used by the staff
 * console to show the signed-in staff member's department official name.
 */
export default function Topbar({ unreadCount = 0, notificationsHref, heading }) {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b border-console-border bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {heading && (
          <span className="truncate text-sm font-semibold text-ink" title={heading}>
            {heading}
          </span>
        )}
      </div>

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <LanguageSwitcher />

        <button
          type="button"
          onClick={toggleTheme}
          className="flex size-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
          aria-label={isDark ? t("Switch to light mode") : t("Switch to dark mode")}
          aria-pressed={isDark}
        >
          {isDark ? <Sun className="size-[22px]" /> : <Moon className="size-[22px]" />}
        </button>

        <Link
          to={notificationsHref ?? "#"}
          className="relative flex size-10 items-center justify-center"
          aria-label={unreadCount > 0 ? t("{count} unread notifications", { count: unreadCount }) : t("Notifications")}
        >
          <Bell className="size-[22px] text-ink" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-status-rejected text-[9px] font-bold text-ink-onbrand">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
