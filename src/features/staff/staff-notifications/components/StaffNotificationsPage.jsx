import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useStaffNotifications } from "../hooks/useStaffNotifications";

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

export default function StaffNotificationsPage() {
  const { notifications, isLoading, error, markRead, markAllRead, unreadCount } = useStaffNotifications();

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="New reports, urgent items, and department mentions for your department."
        action={
          unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              Mark all as read
            </Button>
          )
        }
      />

      <div className="rounded-console border border-console-border bg-surface">
        {isLoading ? (
          <div className="p-6 text-sm text-ink-muted">Loading notifications…</div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">{error}</div>
        ) : notifications.length === 0 ? (
          <EmptyState
            title="No notifications yet"
            description="New reports, urgent items, and mentions for your department will show up here."
          />
        ) : (
          <ul>
            {notifications.map((n, index) => {
              const content = (
                <div
                  className={
                    "flex items-start gap-3 p-4" +
                    (index < notifications.length - 1 ? " border-b border-console-border" : "") +
                    (!n.read ? " bg-brand/5" : "")
                  }
                >
                  <span
                    className={"mt-1.5 size-2 shrink-0 rounded-full " + (n.read ? "bg-transparent" : "bg-brand")}
                    aria-hidden="true"
                  />
                  <Bell className="mt-0.5 size-4 shrink-0 text-ink-muted" />
                  <div className="flex-1">
                    <p className={"text-sm text-ink" + (!n.read ? " font-semibold" : "")}>{n.title}</p>
                    <p className="mt-0.5 text-sm text-ink-muted">{n.message}</p>
                    <p className="mt-1 text-xs text-ink-muted">{formatRelativeTime(n.createdAt)}</p>
                  </div>
                  {!n.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        markRead(n.id);
                      }}
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              );

              return (
                <li key={n.id}>
                  {n.reportId ? (
                    <Link to={`/staff/reports/${n.reportId}`} onClick={() => !n.read && markRead(n.id)}>
                      {content}
                    </Link>
                  ) : (
                    content
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
