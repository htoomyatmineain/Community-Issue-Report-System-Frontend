import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Bottom mobile navigation — used by citizen-* shells (mobile-first).
 * `items`: [{ href, label, icon: LucideIcon, end?, isFab? }]. `isFab` renders
 * a raised circular action button (used for "Report"), floating beside the
 * main pill rather than inside it (ref: ref-img/citizen/nav-00.jpg).
 */
export default function MobileNav({ items = [] }) {
  const tabs = items.filter((item) => !item.isFab);
  const fab = items.find((item) => item.isFab);

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-full max-w-md items-center justify-center gap-2.5 px-5">
      <div className="flex flex-1 items-center justify-between gap-0.5 rounded-full border border-border/60 bg-background/85 px-2 py-1.5 shadow-lg shadow-black/5 backdrop-blur-md">
        {tabs.map(({ href, label, icon: Icon, end }) => (
          <NavLink
            key={href}
            to={href}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 rounded-full px-3.5 py-2 text-muted-foreground transition-colors",
                isActive && "bg-primary/10 text-primary"
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-semibold">{label}</span>
          </NavLink>
        ))}
      </div>

      {fab && (
        <NavLink
          to={fab.href}
          aria-label={fab.label}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30"
        >
          <fab.icon className="h-6 w-6" />
        </NavLink>
      )}
    </nav>
  );
}
