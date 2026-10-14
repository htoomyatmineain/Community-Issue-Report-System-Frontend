import { useState, useCallback, useEffect } from "react";
import PageShell from "./PageShell";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * Desktop console shell (navbar + collapsible sidebar drawer) shared by admin-* and staff-* shells.
 * `navGroups`: [{ title?, items: [{ href, label, icon, end? }] }]. `user`: { name, role, initials } | null.
 * `topbarHeading`: optional leading label in the navbar.
 */
export default function ConsoleShell({
  navGroups,
  user,
  unreadCount = 0,
  notificationsHref,
  profileHref,
  topbarHeading,
  children,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem("kinnhtout_sidebar_open");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("kinnhtout_sidebar_open", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  return (
    <PageShell
      sidebar={
        <Sidebar
          navGroups={navGroups}
          user={user}
          profileHref={profileHref}
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
        />
      }
      topbar={
        <Topbar
          unreadCount={unreadCount}
          notificationsHref={notificationsHref}
          heading={topbarHeading}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />
      }
    >
      {children}
    </PageShell>
  );
}
