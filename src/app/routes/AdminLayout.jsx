import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  ClipboardCheck,
  Building2,
  Tag,
  FileText,
  Map,
} from "lucide-react";
import ConsoleShell from "@/components/layout/ConsoleShell";
import { useAuth } from "@/app/providers/AuthProvider";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";
import { getInitials } from "@/lib/utils";

const NAV_GROUPS = [
  {
    title: "Monitoring",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
      { href: "/admin/reports", label: "Reports", icon: FileText },
      { href: "/admin/map", label: "Map View", icon: Map },
    ],
  },
  {
    title: "User Management",
    items: [
      { href: "/admin/citizens", label: "Citizens", icon: Users },
      { href: "/admin/staff", label: "Staff", icon: UserCog },
      { href: "/admin/approvals", label: "Account Approvals", icon: ClipboardCheck },
    ],
  },
  {
    title: "Organization Setup",
    items: [
      { href: "/admin/departments", label: "Departments", icon: Building2 },
      { href: "/admin/categories", label: "Categories", icon: Tag },
    ],
  },
];

/** Console shell (sidebar + navbar) wrapping every /admin page. */
export default function AdminLayout() {
  const { user } = useAuth();
  const unreadCount = useUnreadNotificationCount();
  const shellUser = user && {
    name: user.fullName,
    role: "Administrator",
    initials: getInitials(user.fullName),
  };

  return (
    <ConsoleShell
      navGroups={NAV_GROUPS}
      user={shellUser}
      unreadCount={unreadCount}
      notificationsHref="/admin/notifications"
      settingsHref="/admin/preferences"
      profileHref="/admin/profile"
    >
      <Outlet />
    </ConsoleShell>
  );
}
