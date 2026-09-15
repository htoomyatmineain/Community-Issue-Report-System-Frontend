import { Outlet } from "react-router-dom";
import { LayoutDashboard, FileText, Map } from "lucide-react";
import ConsoleShell from "@/components/layout/ConsoleShell";
import { useAuth } from "@/app/providers/AuthProvider";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";
import { useDepartmentName } from "@/hooks/useDepartmentName";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { getInitials } from "@/lib/utils";

// Departments/Categories are admin-only org-setup concerns — staff only need
// their own day-to-day monitoring links here. Settings/profile stay reachable
// via the sidebar's account menu (profileHref below), just not duplicated
// as its own nav group.
const NAV_GROUPS = [
  {
    title: "Monitoring",
    items: [
      { href: "/staff", label: "Dashboard", icon: LayoutDashboard, end: true },
      { href: "/staff/reports", label: "Reports", icon: FileText },
      { href: "/staff/map", label: "Map View", icon: Map },
    ],
  },
];

/** Console shell (sidebar + navbar) wrapping every /staff page. */
export default function StaffLayout() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const unreadCount = useUnreadNotificationCount();
  const departmentName = useDepartmentName(user?.departmentId);
  const shellUser = user && {
    name: user.fullName,
    role: "Government Staff",
    initials: getInitials(user.fullName),
  };

  return (
    <ConsoleShell
      navGroups={NAV_GROUPS}
      user={shellUser}
      unreadCount={unreadCount}
      notificationsHref="/staff/notifications"
      profileHref="/staff/settings"
      topbarHeading={departmentName ? t(departmentName) : departmentName}
    >
      <Outlet />
    </ConsoleShell>
  );
}
