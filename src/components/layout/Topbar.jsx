/** Top bar — page title/breadcrumb + user menu. */
export default function Topbar({ title }) {
  return (
    <header className="flex h-14 items-center border-b px-4">
      <h1 className="text-sm font-medium">{title}</h1>
    </header>
  );
}
