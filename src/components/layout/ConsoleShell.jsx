import PageShell from "./PageShell";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * Desktop console shell (navbar + sidebar) shared by admin-* and staff-* shells.
 * `navGroups`: [{ title?, items: [{ href, label, icon, end? }] }]. `user`: { name, role, initials } | null.
 * `topbarHeading`: optional leading label in the navbar (staff console shows the department name here).
 */
export default function ConsoleShell({ navGroups, user, unreadCount = 0, notificationsHref, profileHref, topbarHeading, children }) {
  return (
    <PageShell
      sidebar={<Sidebar navGroups={navGroups} user={user} profileHref={profileHref} />}
      topbar={<Topbar unreadCount={unreadCount} notificationsHref={notificationsHref} heading={topbarHeading} />}
    >
      {children}
    </PageShell>
  );
}
