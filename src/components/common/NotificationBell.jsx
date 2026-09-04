import { Bell } from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";

/** Bell icon with an unread-count badge. `count` of 0 hides the badge. */
export default function NotificationBell({ count = 0 }) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      aria-label={count > 0 ? t("{count} unread notifications", { count }) : t("Notifications")}
      className="relative flex h-10 w-10 shrink-0 items-center justify-center"
    >
      <Bell className="h-[22px] w-[22px] text-foreground" />
      {count > 0 && (
        <span className="absolute right-1.5 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
