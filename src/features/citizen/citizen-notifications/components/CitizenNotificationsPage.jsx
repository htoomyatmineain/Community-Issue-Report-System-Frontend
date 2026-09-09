import { Link } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import { Card } from "@/components/ui/card";
import { useNotifications } from "@/hooks/useNotifications";

const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

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

const isRecent = (iso) => iso && Date.now() - new Date(iso).getTime() < RECENT_WINDOW_MS;

export default function CitizenNotificationsPage() {
  const { notifications, isLoading, error, markRead, markAllRead, unreadCount } = useNotifications();

  const recent = notifications.filter((n) => isRecent(n.createdAt));
  const earlier = notifications.filter((n) => !isRecent(n.createdAt));

  const renderItem = (n) => {
    const content = (
      <div className={"flex items-start gap-3 px-4 py-3" + (!n.read ? " bg-primary/5" : "")}>
        <span
          className={"mt-1.5 h-2 w-2 shrink-0 rounded-full " + (n.read ? "bg-transparent" : "bg-primary")}
          aria-hidden="true"
        />
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
      <li key={n.id} className="border-b border-border last:border-0">
        {n.reportId ? (
          <Link
            to={`/report/${n.reportId}`}
            className="block"
            onClick={() => !n.read && markRead(n.id)}
          >
            {content}
          </Link>
        ) : (
          <button
            type="button"
            className="block w-full text-left"
            onClick={() => !n.read && markRead(n.id)}
          >
            {content}
          </button>
        )}
      </li>
    );
  };

  const renderGroup = (title, items) =>
    items.length > 0 && (
      <Card className="overflow-hidden">
        <h2 className="border-b border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h2>
        <ul>{items.map(renderItem)}</ul>
      </Card>
    );

  return (
    <div className="flex w-full max-w-md flex-col">
      <div className="flex flex-col gap-4 px-5 pb-8 pt-4">
        {unreadCount > 0 && (
          <div className="flex justify-end">
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
          <>
            {renderGroup("Recent", recent)}
            {renderGroup("Earlier", earlier)}
          </>
        )}
      </div>
    </div>
  );
}
