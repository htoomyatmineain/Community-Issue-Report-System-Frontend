import { Search, Bell, ChevronDown } from "lucide-react";
<<<<<<< HEAD
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/app/providers/LanguageProvider";

/** Top navbar — search + notifications + user menu. Page titles live in page content, not here. */
export default function Topbar({ user, unreadCount = 0 }) {
  const { t } = useLanguage();

=======
import { Link } from "react-router-dom";

/** Top navbar — search + notifications + user menu. Page titles live in page content, not here. */
export default function Topbar({ user, unreadCount = 0, notificationsHref }) {
>>>>>>> 7cf4f8dc839b5455f8361d8b28f0ee198937f3ea
  return (
    <header className="flex min-h-16 items-center justify-between gap-3 border-b border-console-border bg-surface px-4 sm:px-6">
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

<<<<<<< HEAD
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <LanguageSwitcher />
        <button type="button" className="relative flex size-10 items-center justify-center" aria-label="Notifications">
=======
      <div className="flex items-center gap-4">
        <Link
          to={notificationsHref ?? "#"}
          className="relative flex size-10 items-center justify-center"
          aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
        >
>>>>>>> 7cf4f8dc839b5455f8361d8b28f0ee198937f3ea
          <Bell className="size-[22px] text-ink" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-status-rejected text-[9px] font-bold text-ink-onbrand">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        {user && (
          <button type="button" className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-brand">
              <span className="font-display text-[13px] font-bold text-ink-onbrand">{user.initials}</span>
            </div>
            <span className="text-[13px] font-semibold text-ink">{user.name}</span>
            <ChevronDown className="size-3.5 text-ink-muted" />
          </button>
        )}
      </div>
    </header>
  );
}
