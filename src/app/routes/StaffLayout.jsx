import { Outlet } from "react-router-dom";
import { LayoutDashboard, FileText, Map, Building2, Bell, Settings } from "lucide-react";
import ConsoleShell from "@/components/layout/ConsoleShell";
import { useAuth } from "@/app/providers/AuthProvider";
import { getInitials } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/staff", label: "Dashboard", icon: LayoutDashboard, end: true },
  { href: "/staff/reports", label: "Reports", icon: FileText },
  { href: "/staff/map", label: "Map View", icon: Map },
  { href: "/staff/departments", label: "Departments", icon: Building2 },
  { href: "/staff/notifications", label: "Notifications", icon: Bell },
  { href: "/staff/settings", label: "Settings", icon: Settings },
];

/** Console shell (sidebar + navbar) wrapping every /staff page. */
export default function StaffLayout() {
  const { user } = useAuth();
  const shellUser = user && {
    name: user.fullName,
    role: "Government Staff",
    initials: getInitials(user.fullName),
  };

  return (
    <ConsoleShell navItems={NAV_ITEMS} user={shellUser}>
      <Outlet />
    </ConsoleShell>
  );
}
