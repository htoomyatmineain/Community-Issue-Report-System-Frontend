import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";
import { useLanguage } from "@/app/providers/LanguageProvider";

/** Bell icon with an unread-count badge, linking to the notifications list. Polls its own count (GET /api/notifications/unread-count). */
export default function NotificationBell() {
  const { t } = useLanguage();
  const count = useUnreadNotificationCount();

  return (
    <Link
      to="/notifications"
      aria-label={count > 0 ? t("{count} unread notifications", { count }) : t("Notifications")}
      className="relative flex h-10 w-10 shrink-0 items-center justify-center"
    >
      <Bell className="h-[22px] w-[22px] text-foreground" />
      {count > 0 && (
        <span className="absolute right-1.5 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
