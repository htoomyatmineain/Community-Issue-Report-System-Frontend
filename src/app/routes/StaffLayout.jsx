import { Outlet } from "react-router-dom";
import { LayoutDashboard, FileText, Map, Building2, Settings } from "lucide-react";
import ConsoleShell from "@/components/layout/ConsoleShell";
import { useAuth } from "@/app/providers/AuthProvider";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";
import { useDepartmentName } from "@/hooks/useDepartmentName";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { getInitials } from "@/lib/utils";

const NAV_GROUPS = [
  {
    title: "Monitoring",
    items: [
      { href: "/staff", label: "Dashboard", icon: LayoutDashboard, end: true },
      { href: "/staff/reports", label: "Reports", icon: FileText },
      { href: "/staff/map", label: "Map View", icon: Map },
    ],
  },
  {
    title: "Organization Setup",
    items: [
      { href: "/staff/departments", label: "Departments", icon: Building2 },
      { href: "/staff/settings", label: "Settings", icon: Settings },
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
