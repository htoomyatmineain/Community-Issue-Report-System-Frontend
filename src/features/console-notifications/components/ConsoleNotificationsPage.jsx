import { Bell, Star } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/providers/AuthProvider";
import { ROLE_HOME_PATH } from "@/lib/rbac";
import { useNotifications } from "@/hooks/useNotifications";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { cn } from "@/lib/utils";

/** Read-only 1-5 star row for notifications carrying a citizen's feedback rating. */
const RatingStars = ({ rating }) => (
  <div className="mt-1 flex gap-0.5" aria-label={`${rating}/5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={cn("size-3.5", n <= rating ? "fill-amber-500 text-amber-500" : "text-border")}
      />
    ))}
  </div>
);

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

/** Shared /admin/notifications + /staff/notifications page — content is identical for both roles. */
export default function ConsoleNotificationsPage() {
  const { t } = useLanguage();
  const { role } = useAuth();
  const { notifications, isLoading, error, markRead, markAllRead, unreadCount } = useNotifications();
  const reportsBase = `${ROLE_HOME_PATH[role] ?? ""}/reports`;

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

      <div className="rounded-xl border border-console-border/70 bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
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
          <ul className="divide-y divide-console-border/60">
            {notifications.map((n) => {
              const content = (
                <div
                  className={cn(
                    "flex items-start gap-3 p-4 transition-colors hover:bg-surface-muted/40",
                    !n.read && "bg-brand/[0.03]"
                  )}
                >
                  <span
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      n.read ? "bg-transparent" : "bg-brand"
                    )}
                    aria-hidden="true"
                  />
                  <Bell className="mt-0.5 size-4 shrink-0 text-ink-muted" />
                  <div className="flex-1">
                    <p className={cn("text-sm text-ink tracking-tight", !n.read ? "font-semibold text-brand" : "font-medium")}>
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-muted leading-relaxed">{n.message}</p>
                    {n.rating != null && <RatingStars rating={n.rating} />}
                    <p className="mt-1 text-[11px] text-ink-muted/80 tabular-nums">{formatRelativeTime(n.createdAt, t)}</p>
                  </div>
                  {!n.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2.5 text-xs rounded-lg text-brand hover:bg-nav-active hover:text-brand font-medium active:scale-95 transition-all"
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

              const linkTo = n.reportId
                ? `${reportsBase}/${n.reportId}`
                : n.type === "NEW_ACCOUNT" && n.subjectUserId
                  ? `${ROLE_HOME_PATH[role] ?? ""}/approvals/${n.subjectUserId}`
                  : null;

              return (
                <li key={n.id}>
                  {linkTo ? (
                    <Link to={linkTo} onClick={() => !n.read && markRead(n.id)}>
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
