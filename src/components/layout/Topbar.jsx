import { Search, Bell, ChevronDown } from "lucide-react";

/** Top navbar — search + notifications + user menu. Page titles live in page content, not here. */
export default function Topbar({ user, unreadCount = 0 }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-console-border bg-surface px-6">
      <div className="flex items-center gap-3">
        <label className="flex w-[260px] items-center gap-2 rounded-full bg-surface-muted px-3.5 py-2">
          <Search className="size-4 text-ink-muted" />
          <input
            type="search"
            placeholder="Search reports, users…"
            className="w-full bg-transparent text-[13px] text-ink placeholder:text-ink-muted focus:outline-none"
          />
        </label>
      </div>

      <div className="flex items-center gap-4">
        <button type="button" className="relative flex size-10 items-center justify-center" aria-label="Notifications">
          <Bell className="size-[22px] text-ink" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-status-rejected text-[9px] font-bold text-ink-onbrand">
              {unreadCount}
            </span>
          )}
        </button>

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
