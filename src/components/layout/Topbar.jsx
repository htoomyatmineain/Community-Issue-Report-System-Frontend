import { Search, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/app/providers/LanguageProvider";

/** Top navbar — search + notifications. Page titles live in page content, not here. */
export default function Topbar({ unreadCount = 0, notificationsHref }) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b border-console-border bg-surface px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <label className="hidden w-[260px] items-center gap-2 rounded-full bg-surface-muted px-3.5 py-2 sm:flex">
          <Search className="size-4 text-ink-muted" />
          <input
            type="search"
            placeholder={t("Search reports, users…")}
            className="w-full bg-transparent text-[13px] text-ink placeholder:text-ink-muted focus:outline-none"
          />
        </label>
      </div>

      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <LanguageSwitcher />
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
