import { Bell } from "lucide-react";
<<<<<<< HEAD
import { useLanguage } from "@/app/providers/LanguageProvider";

/** Bell icon with an unread-count badge. `count` of 0 hides the badge. */
export default function NotificationBell({ count = 0 }) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      aria-label={count > 0 ? t("{count} unread notifications", { count }) : t("Notifications")}
=======
import { Link } from "react-router-dom";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";

/** Bell icon with an unread-count badge, linking to the notifications list. Polls its own count (GET /api/notifications/unread-count). */
export default function NotificationBell() {
  const count = useUnreadNotificationCount();

  return (
    <Link
      to="/notifications"
      aria-label={count > 0 ? `${count} unread notifications` : "Notifications"}
>>>>>>> 7cf4f8dc839b5455f8361d8b28f0ee198937f3ea
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
