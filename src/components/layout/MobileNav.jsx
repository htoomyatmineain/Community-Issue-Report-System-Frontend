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
    <nav className="fixed inset-x-0 bottom-3 z-40 mx-auto flex h-16 w-full max-w-md items-center gap-2.5 px-3">
      {/* Solid rounded navigation container */}
      <div className="flex h-full flex-1 items-center justify-around gap-1 rounded-2xl border border-border bg-card/95 backdrop-blur-md p-1.5 shadow-lg">
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
                  "relative flex h-full flex-1 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 py-1 transition-all duration-200 ease-out active:scale-95",
                  isActive
                    ? "bg-brand/10 font-bold text-brand shadow-xs"
                    : "text-muted-foreground hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "size-4.5 shrink-0 transition-transform duration-200",
                      isActive ? "text-brand scale-110" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "truncate text-[10px] leading-tight tracking-tight",
                      isActive ? "font-bold text-brand" : "font-medium text-muted-foreground"
                    )}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Luxury Gradient CTA Button — #237FEA gradient with inner shimmer + shadow + tooltip */}
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
            className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-[#1d63d8] via-[#237fea] to-[#38bdf8] text-white border border-white/25 shadow-[0_8px_20px_-4px_rgba(35,127,234,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all duration-200 hover:scale-105 hover:shadow-[0_12px_24px_-4px_rgba(35,127,234,0.65)] active:scale-95"
          >
            {FabIcon && (
              <FabIcon size={24} className="text-white drop-shadow-sm" strokeWidth={2.6} />
            )}
            <span className="text-[10px] font-bold tracking-tight text-white/95 leading-tight mt-0.5">
              {fab.label}
            </span>
          </NavLink>
        </div>
      )}
    </nav>
  );
}
