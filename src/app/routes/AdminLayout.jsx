import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  ClipboardCheck,
  Building2,
  Tag,
  FileText,
  FileCheck2,
} from "lucide-react";
import ConsoleShell from "@/components/layout/ConsoleShell";
import { useAuth } from "@/app/providers/AuthProvider";
import { getInitials } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { href: "/admin/reports", label: "Reports", icon: FileText },
  { href: "/admin/report-approvals", label: "Report Approvals", icon: FileCheck2 },
  { href: "/admin/citizens", label: "Citizens", icon: Users },
  { href: "/admin/staff", label: "Staff", icon: UserCog },
  { href: "/admin/approvals", label: "Account Approvals", icon: ClipboardCheck },
  { href: "/admin/departments", label: "Departments", icon: Building2 },
  { href: "/admin/categories", label: "Categories", icon: Tag },
];

/** Console shell (sidebar + navbar) wrapping every /admin page. */
export default function AdminLayout() {
  const { user } = useAuth();
  const shellUser = user && {
    name: user.fullName,
    role: "Administrator",
    initials: getInitials(user.fullName),
  };

  return (
    <ConsoleShell navItems={NAV_ITEMS} user={shellUser}>
      <Outlet />
    </ConsoleShell>
  );
}
