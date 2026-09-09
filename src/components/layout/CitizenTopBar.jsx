import { Bell, ChevronLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Avatar from "@/components/common/Avatar";
import { useAuth } from "@/app/providers/AuthProvider";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";

/**
 * Shared citizen top bar — fixed to the top of the phone-width column, glass
 * background with a hairline bottom border. Only the title changes per route;
 * the notifications bell and avatar hold the same spot on every page.
 */
export default function CitizenTopBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const fullName = user?.fullName || "Citizen";
  const unreadCount = useUnreadNotificationCount();

  const isHome = pathname === "/";
  const isReportDetail = pathname.startsWith("/report/") && pathname !== "/report";
  const isScore = pathname === "/score";
  const showBack = isReportDetail || isScore;

  const title = isReportDetail
    ? t("Report detail")
    : isScore
      ? t("My score")
      : pathname === "/map"
        ? t("Community map")
        : pathname === "/leaderboard"
          ? t("Leaderboard")
          : pathname === "/notifications"
            ? t("Notifications")
            : pathname === "/report"
              ? t("Report an issue")
              : pathname === "/profile"
                ? t("Profile")
                : pathname === "/settings"
                  ? t("Settings")
                  : "";

  return (
    <header className="fixed inset-x-0 top-0 z-40 mx-auto flex h-14 w-full max-w-md items-center justify-between gap-3 border-b border-border bg-background/70 px-5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 md:border-x md:border-border">
      <div className="flex min-w-0 items-center gap-2.5">
        {showBack && (
          <button
            type="button"
            aria-label={t("Back")}
            onClick={() => navigate(-1)}
            className="-ml-1 flex size-8 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}
        {isHome ? (
          <img
            src="/assets/Kinn Htout Logo.png"
            alt="Kinn Htout"
            className="h-12 w-auto min-w-0 max-w-full object-contain object-left"
          />
        ) : (
          <h1 className="truncate font-display text-xl font-bold text-foreground">{title}</h1>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Link
          to="/notifications"
          aria-label={
            unreadCount > 0
              ? t("{count} unread notifications", { count: unreadCount })
              : t("Notifications")
          }
          className="relative flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background" />
          )}
        </Link>
        <Link
          to="/profile"
          aria-label={t("My profile")}
          className="flex shrink-0 items-center justify-center rounded-full transition-transform active:scale-95"
        >
          <Avatar name={fullName} size="sm" />
        </Link>
      </div>
    </header>
  );
}
