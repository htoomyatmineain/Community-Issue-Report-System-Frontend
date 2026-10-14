import { useLocation } from "react-router-dom";

/** Common page frame (Sidebar + Topbar) wrapping routed content. */
export default function PageShell({ sidebar, topbar, children }) {
  const location = useLocation();
  const isMapPage = location.pathname.endsWith("/map");

  return (
    <div className="flex min-h-screen bg-surface-muted/60">
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col transition-all duration-300 ease-in-out">
        {topbar}
        {isMapPage ? (
          <main className="flex-1 w-full overflow-hidden p-0">{children}</main>
        ) : (
          <main className="flex-1 p-6 lg:p-8 w-full">{children}</main>
        )}
      </div>
    </div>
  );
}
