import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Bottom mobile navigation — used by citizen-* shells (mobile-first).
 * `items`: [{ href, label, icon: LucideIcon, end?, isFab? }]. `isFab` renders
 * a raised circular action button (used for "Report") instead of a plain tab.
 */
export default function MobileNav({ items = [] }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-md items-center justify-between border-t border-border bg-background px-5 py-2 md:hidden">
      {items.map(({ href, label, icon: Icon, end, isFab }) =>
        isFab ? (
          <NavLink key={href} to={href} className="flex w-14 flex-col items-center gap-[3px]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Icon className="h-6 w-6" />
            </span>
            <span className="text-[10px] font-semibold text-primary">{label}</span>
          </NavLink>
        ) : (
          <NavLink
            key={href}
            to={href}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex w-14 flex-col items-center gap-[3px] text-muted-foreground",
                isActive && "text-primary"
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-semibold">{label}</span>
          </NavLink>
        )
      )}
    </nav>
  );
}
