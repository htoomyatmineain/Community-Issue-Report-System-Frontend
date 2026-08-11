/** Desktop navigation sidebar — used by staff-* and admin-* shells. */
export default function Sidebar({ items = [] }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r md:block">
      <nav className="flex flex-col gap-1 p-4">
        {items.map((item) => (
          <a key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm">
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
