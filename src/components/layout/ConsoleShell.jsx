import PageShell from "./PageShell";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * Desktop console shell (navbar + sidebar) shared by admin-* and staff-* shells.
 * `navGroups`: [{ title?, items: [{ href, label, icon, end? }] }]. `user`: { name, role, initials } | null.
 */
export default function ConsoleShell({ navGroups, user, unreadCount = 0, notificationsHref, settingsHref, profileHref, children }) {
  return (
    <PageShell
      sidebar={<Sidebar navGroups={navGroups} user={user} profileHref={profileHref} />}
      topbar={<Topbar unreadCount={unreadCount} notificationsHref={notificationsHref} settingsHref={settingsHref} />}
    >
      {children}
    </PageShell>
  );
}
