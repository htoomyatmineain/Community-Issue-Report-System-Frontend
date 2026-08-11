/** Bottom/mobile navigation — used by citizen-* shells (mobile-first). */
export default function MobileNav({ items = [] }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t bg-background p-2 md:hidden">
      {items.map((item) => (
        <a key={item.href} href={item.href} className="flex flex-col items-center text-xs">
          {item.label}
        </a>
      ))}
    </nav>
  );
}
