/** Common page frame (Sidebar + Topbar) wrapping routed content. */
export default function PageShell({ sidebar, topbar, children }) {
  return (
    <div className="flex min-h-screen bg-surface-muted">
      {sidebar}
      <div className="flex flex-1 flex-col">
        {topbar}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
