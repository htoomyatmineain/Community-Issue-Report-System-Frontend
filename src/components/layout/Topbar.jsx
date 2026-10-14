import { Bell, Moon, Sun, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTheme } from "@/app/providers/ThemeProvider";

/**
 * Top navbar — sidebar drawer toggle + optional leading label + language + dark-mode + notifications.
 * Page titles live in page content, not here.
 */
export default function Topbar({
  unreadCount = 0,
  notificationsHref,
  heading,
  isSidebarOpen = true,
  onToggleSidebar,
}) {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-console-border bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex size-9 items-center justify-center rounded-xl border border-console-border/70 bg-surface text-ink-muted/80 shadow-xs transition-all duration-150 hover:bg-surface-muted hover:text-ink active:scale-95"
            aria-label={isSidebarOpen ? t("Collapse sidebar") : t("Expand sidebar")}
            title={isSidebarOpen ? t("Collapse sidebar (Ctrl+B)") : t("Expand sidebar (Ctrl+B)")}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="size-[18px] stroke-[1.8]" />
            ) : (
              <PanelLeftOpen className="size-[18px] stroke-[1.8] text-brand" />
            )}
          </button>
        )}

        {heading && (
          <span
            className="inline-flex max-w-[360px] items-center truncate rounded-md border border-console-border/70 bg-surface-muted/60 px-2.5 py-1 text-xs font-semibold tracking-tight text-ink"
            title={heading}
          >
            {heading}
          </span>
        )}
      </div>

      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
        <LanguageSwitcher />

        <button
          type="button"
          onClick={toggleTheme}
          className="flex size-9 items-center justify-center rounded-xl text-ink-muted/80 transition-all duration-150 hover:bg-surface-muted hover:text-ink active:scale-95"
          aria-label={isDark ? t("Switch to light mode") : t("Switch to dark mode")}
          aria-pressed={isDark}
        >
          {isDark ? <Sun className="size-[18px] stroke-[1.8]" /> : <Moon className="size-[18px] stroke-[1.8]" />}
        </button>

        <Link
          to={notificationsHref ?? "#"}
          className="relative flex size-9 items-center justify-center rounded-xl text-ink-muted/80 transition-all duration-150 hover:bg-surface-muted hover:text-ink active:scale-95"
          aria-label={unreadCount > 0 ? t("{count} unread notifications", { count: unreadCount }) : t("Notifications")}
        >
          <Bell className="size-[18px] stroke-[1.8] text-ink" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-status-rejected font-mono text-[9px] font-bold text-ink-onbrand shadow-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
