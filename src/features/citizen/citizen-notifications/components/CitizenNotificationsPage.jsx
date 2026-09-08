import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import { useNotifications } from "@/hooks/useNotifications";

const formatRelativeTime = (iso) => {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

export default function CitizenNotificationsPage() {
  const { notifications, isLoading, error, markRead, markAllRead, unreadCount } = useNotifications();

  return (
    <div className="flex w-full max-w-md flex-col">
      <div className="flex flex-col px-5 pb-8 pt-4">
        {unreadCount > 0 && (
          <div className="flex justify-end pb-2">
            <button
              type="button"
              onClick={markAllRead}
              className="text-xs font-semibold text-primary"
            >
              Mark all read
            </button>
          </div>
        )}
        {isLoading ? (
          <p className="py-6 text-sm text-muted-foreground">Loading…</p>
        ) : error ? (
          <p className="py-6 text-sm text-destructive">{error}</p>
        ) : notifications.length === 0 ? (
          <EmptyState
            title="No notifications yet"
            description="Updates about your reports and account will show up here."
          />
        ) : (
          <ul>
            {notifications.map((n) => {
              const content = (
                <div
                  className={
                    "flex items-start gap-3 border-b border-border py-3 last:border-0" +
                    (!n.read ? " -mx-5 bg-primary/5 px-5" : "")
                  }
                >
                  <span
                    className={"mt-1.5 h-2 w-2 shrink-0 rounded-full " + (n.read ? "bg-transparent" : "bg-primary")}
                    aria-hidden="true"
                  />
                  <Bell className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1">
                    <p className={"text-[13px] text-foreground" + (!n.read ? " font-bold" : " font-semibold")}>
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">{n.message}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{formatRelativeTime(n.createdAt)}</p>
                  </div>
                </div>
              );

              return (
                <li key={n.id}>
                  {n.reportId ? (
                    <Link to={`/report/${n.reportId}`} onClick={() => !n.read && markRead(n.id)}>
                      {content}
                    </Link>
                  ) : (
                    <button type="button" className="w-full text-left" onClick={() => !n.read && markRead(n.id)}>
                      {content}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
