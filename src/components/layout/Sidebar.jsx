import { NavLink } from "react-router-dom";
import { Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

/** Desktop navigation sidebar — used by staff-* and admin-* shells. */
export default function Sidebar({ items = [], user }) {
  return (
    <aside className="flex h-full w-[250px] shrink-0 flex-col gap-6 border-r border-console-border bg-surface px-4 py-6">
      <div className="flex items-center gap-2 px-1">
        <Landmark className="size-[22px] text-brand" />
        <span className="font-display text-lg font-bold text-ink">SCIRS</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map(({ href, label, icon: Icon, end }) => (
          <NavLink
            key={href}
            to={href}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold",
                isActive ? "bg-nav-active text-brand" : "text-ink-muted hover:bg-surface-muted"
              )
            }
          >
            {Icon && <Icon className="size-[18px]" />}
            {label}
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="flex items-center gap-2.5 border-t border-console-border pt-2.5">
          <div className="flex size-9 items-center justify-center rounded-full bg-brand">
            <span className="font-display text-[13px] font-bold text-ink-onbrand">{user.initials}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-ink">{user.name}</span>
            <span className="text-xs text-ink-muted">{user.role}</span>
          </div>
        </div>
      )}
    </aside>
  );
}
