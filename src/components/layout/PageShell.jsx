/** Common page frame (Sidebar + Topbar) wrapping routed content. */
export default function PageShell({ sidebar, topbar, children }) {
  return (
    <div className="flex min-h-screen">
      {sidebar}
      <div className="flex flex-1 flex-col">
        {topbar}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
