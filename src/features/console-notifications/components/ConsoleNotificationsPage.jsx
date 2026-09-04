import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD:src/features/staff/staff-notifications/components/StaffNotificationsPage.jsx
import { useStaffNotifications } from "../hooks/useStaffNotifications";
import { useLanguage } from "@/app/providers/LanguageProvider";
=======
import { useAuth } from "@/app/providers/AuthProvider";
import { ROLE_HOME_PATH } from "@/lib/rbac";
import { useNotifications } from "@/hooks/useNotifications";
>>>>>>> 7cf4f8dc839b5455f8361d8b28f0ee198937f3ea:src/features/console-notifications/components/ConsoleNotificationsPage.jsx

const formatRelativeTime = (iso, t) => {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return t("just now");
  if (minutes < 60) return t("{n}m ago", { n: minutes });
  const hours = Math.round(minutes / 60);
  if (hours < 24) return t("{n}h ago", { n: hours });
  const days = Math.round(hours / 24);
  if (days < 7) return t("{n}d ago", { n: days });
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

<<<<<<< HEAD:src/features/staff/staff-notifications/components/StaffNotificationsPage.jsx
export default function StaffNotificationsPage() {
  const { t } = useLanguage();
  const { notifications, isLoading, error, markRead, markAllRead, unreadCount } = useStaffNotifications();
=======
/** Shared /admin/notifications + /staff/notifications page — content is identical for both roles. */
export default function ConsoleNotificationsPage() {
  const { role } = useAuth();
  const { notifications, isLoading, error, markRead, markAllRead, unreadCount } = useNotifications();
  const reportsBase = `${ROLE_HOME_PATH[role] ?? ""}/reports`;
>>>>>>> 7cf4f8dc839b5455f8361d8b28f0ee198937f3ea:src/features/console-notifications/components/ConsoleNotificationsPage.jsx

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="New reports, status changes, and mentions relevant to you."
        action={
          unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              {t("Mark all as read")}
            </Button>
          )
        }
      />

      <div className="rounded-console border border-console-border bg-surface">
        {isLoading ? (
          <div className="p-6 text-sm text-ink-muted">{t("Loading notifications…")}</div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">{error}</div>
        ) : notifications.length === 0 ? (
          <EmptyState
            title="No notifications yet"
            description="New reports, status changes, and mentions will show up here."
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
                    <p className="mt-1 text-xs text-ink-muted">{formatRelativeTime(n.createdAt, t)}</p>
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
                      {t("Mark read")}
                    </Button>
                  )}
                </div>
              );

              return (
                <li key={n.id}>
                  {n.reportId ? (
                    <Link to={`${reportsBase}/${n.reportId}`} onClick={() => !n.read && markRead(n.id)}>
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
