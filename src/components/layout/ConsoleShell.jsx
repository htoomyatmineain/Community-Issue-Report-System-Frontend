import PageShell from "./PageShell";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * Desktop console shell (navbar + sidebar) shared by admin-* and staff-* shells.
 * `navItems`: [{ href, label, icon, end? }]. `user`: { name, role, initials } | null.
 */
export default function ConsoleShell({ navItems, user, unreadCount = 0, notificationsHref, children }) {
  return (
    <PageShell
      sidebar={<Sidebar items={navItems} user={user} />}
      topbar={<Topbar user={user} unreadCount={unreadCount} notificationsHref={notificationsHref} />}
    >
      {children}
    </PageShell>
  );
}
