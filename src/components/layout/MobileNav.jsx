import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * Bottom mobile navigation — closely matching ref-img/citizen/nav-01.jpg:
 * - Glassmorphism pill stretched to the page column's edges with a thin outline
 *   and subtle backdrop blur
 * - Every tab shows its icon with the label directly underneath
 * - Active tab renders as a filled capsule with theme color #237FEA
 * - Circular CTA button beside the bar with #237FEA + the FAB item's Lucide
 *   icon + "Report an issue" hover tooltip
 */
export default function MobileNav({ items = [] }) {
  const { t } = useLanguage();
  const tabs = items.filter((item) => !item.isFab);
  const fab = items.find((item) => item.isFab);
  const FabIcon = fab?.icon;
  const unreadCount = useUnreadNotificationCount();

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-full max-w-md items-stretch gap-2.5 px-3">
      {/* Glassmorphism pill — stretches to fill the row */}
      <div className="flex flex-1 items-stretch gap-1 rounded-full border border-white/10 bg-[#1c1c1c]/85 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.06] backdrop-blur-2xl">
        {tabs.map(({ href, label, icon: Icon, end }) => {
          const isNotificationTab = href === "/notifications";

          return (
            <NavLink
              key={href}
              to={href}
              end={end}
              className={({ isActive }) =>
                cn(
                  "relative flex flex-1 flex-col items-center justify-center gap-1 rounded-full px-1 py-2 transition-all duration-200",
                  isActive
                    ? "bg-[#237FEA] font-medium text-white shadow-sm shadow-[#237FEA]/30"
                    : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-transform duration-150",
                      isActive ? "stroke-[2.2] text-white" : "text-current"
                    )}
                  />
                  <span className="text-[11px] font-medium leading-none whitespace-nowrap">
                    {label}
                  </span>
                  {/* Indicator dot only when inactive */}
                  {isNotificationTab && unreadCount > 0 && !isActive && (
                    <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#1c1c1c]" />
                  )}
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
              {t("Report an issue")}
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
