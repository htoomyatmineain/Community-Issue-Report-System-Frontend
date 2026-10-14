import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Bottom mobile navigation:
 * - Solid rounded container stretched to the page column's edges with a thin outline
 * - Every tab shows its icon with the label directly underneath
 * - Active tab renders as a low-opacity brand-tinted rounded square with brand-colored
 *   icon + label (matching the admin/staff sidebar's active item)
 * - Rounded-square CTA button beside the bar with #237FEA + the FAB item's Lucide
 *   icon + "Report an issue" hover tooltip
 */
export default function MobileNav({ items = [] }) {
  const tabs = items.filter((item) => !item.isFab);
  const fab = items.find((item) => item.isFab);
  const FabIcon = fab?.icon;

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 mx-auto flex h-14 w-full max-w-md items-center gap-2.5 px-3">
      {/* Solid rounded navigation container */}
      <div className="flex h-full flex-1 items-center gap-1 rounded-2xl border border-border bg-card p-1.5 shadow-lg">
        {tabs.map(({ href, label, icon: Icon, end }) => {
          return (
            <NavLink
              key={href}
              to={href}
              end={end}
              aria-label={label}
              title={label}
              className={({ isActive }) =>
                cn(
                  "relative flex h-full min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 transition-all duration-300 ease-out",
                  isActive
                    ? "flex-[1.4] bg-nav-active font-medium text-brand shadow-sm"
                    : "flex-1 text-muted-foreground hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06] active:scale-95"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "size-5 shrink-0 transition-transform duration-200",
                      isActive ? "text-brand scale-105" : "text-current"
                    )}
                  />
                  {isActive && (
                    <span className="truncate text-xs font-semibold leading-none animate-in fade-in zoom-in-95 duration-200">
                      {label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Rounded-square CTA Button — #237FEA with the FAB item's Lucide icon + tooltip */}
      {fab && (
        <div className="group relative flex shrink-0 items-center">
          {/* Tooltip */}
          <div className="pointer-events-none absolute -top-10 left-1/2 z-50 -translate-x-1/2 -translate-y-1 opacity-0 transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="relative whitespace-nowrap rounded-md bg-neutral-900 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md">
              Report an issue
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
            </div>
          </div>

          <NavLink
            to={fab.href}
            aria-label={fab.label}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/30 transition-all duration-150 hover:bg-brand-hover hover:scale-105 hover:shadow-brand/45 active:scale-95"
          >
            {FabIcon && (
              <FabIcon size={26} className="text-white" strokeWidth={2.4} />
            )}
          </NavLink>
        </div>
      )}
    </nav>
  );
}
