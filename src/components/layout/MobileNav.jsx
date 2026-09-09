import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Bottom mobile navigation — closely matching ref-img/citizen/nav-01.jpg:
 * - Frosted-glass pill stretched to the page column's edges with a thin outline
 *   and pronounced backdrop blur
 * - Every tab shows its icon with the label directly underneath
 * - Active tab renders as a low-opacity brand-tinted capsule with brand-colored
 *   icon + label (matching the admin/staff sidebar's active item)
 * - Circular CTA button beside the bar with #237FEA + the FAB item's Lucide
 *   icon + "Report an issue" hover tooltip
 */
export default function MobileNav({ items = [] }) {
  const tabs = items.filter((item) => !item.isFab);
  const fab = items.find((item) => item.isFab);
  const FabIcon = fab?.icon;

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-full max-w-md items-stretch gap-2.5 px-3">
      {/* Frosted-glass pill — stretches to fill the row */}
      <div className="flex flex-1 items-stretch gap-1 rounded-full border border-white/40 bg-white/70 p-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6)] ring-1 ring-black/[0.04] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/50 dark:border-white/10 dark:bg-[#1c1c1c]/70 dark:shadow-[0_8px_28px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] dark:ring-white/[0.06] dark:supports-[backdrop-filter]:bg-[#1c1c1c]/55">
        {tabs.map(({ href, label, icon: Icon, end }) => {
          return (
            <NavLink
              key={href}
              to={href}
              end={end}
              className={({ isActive }) =>
                cn(
                  "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-full px-1 py-2 transition-all duration-200",
                  isActive
                    ? "bg-nav-active font-medium text-brand"
                    : "text-muted-foreground hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-transform duration-150",
                      isActive ? "text-brand" : "text-current"
                    )}
                  />
                  <span className="max-w-full truncate text-[11px] font-medium leading-none">
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Circular CTA Button — #237FEA with the FAB item's Lucide icon + tooltip */}
      {fab && (
        <div className="group relative flex shrink-0 items-center">
          {/* Tooltip */}
          <div className="pointer-events-none absolute -top-10 left-1/2 z-50 -translate-x-1/2 -translate-y-1 opacity-0 transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="relative whitespace-nowrap rounded-md bg-neutral-900/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md backdrop-blur-sm">
              Report an issue
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900/90" />
            </div>
          </div>

          <NavLink
            to={fab.href}
            aria-label={fab.label}
            className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-[#237FEA]/30 transition-all duration-150 hover:scale-105 hover:shadow-[#237FEA]/45 active:scale-95"
            style={{ backgroundColor: "#237FEA" }}
          >
            {FabIcon && (
              <FabIcon size={24} className="text-white" strokeWidth={2.2} />
            )}
          </NavLink>
        </div>
      )}
    </nav>
  );
}
