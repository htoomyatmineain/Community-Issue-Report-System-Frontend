import { Outlet } from "react-router-dom";
import { LayoutDashboard, FileText, Map, Building2, Bell, Settings } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

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
  const user = { name: "Aung Thanlwin", role: "Government Staff", initials: "AT" };

  return (
    <PageShell
      sidebar={<Sidebar items={NAV_ITEMS} user={user} />}
      topbar={<Topbar user={user} unreadCount={3} />}
    >
      <Outlet />
    </PageShell>
  );
}
