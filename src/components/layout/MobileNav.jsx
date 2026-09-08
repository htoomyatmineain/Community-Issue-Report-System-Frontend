import { NavLink } from "react-router-dom";
import { Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";

/**
 * Bottom mobile navigation — closely matching ref-img/citizen/nav-01.jpg:
 * - Glassmorphism pill with thin outline and subtle backdrop blur
 * - Active tab renders as a capsule with theme color #237FEA + icon + label
 * - Inactive tabs render as icons only
 * - Circular CTA button with #237FEA + Lucide Megaphone icon + "Report" hover tooltip
 */
export default function MobileNav({ items = [] }) {
  const tabs = items.filter((item) => !item.isFab);
  const fab = items.find((item) => item.isFab);
  const unreadCount = useUnreadNotificationCount();

  return (
    <nav className="fixed inset-x-0 bottom-5 z-40 mx-auto flex w-full max-w-md items-center justify-center gap-2.5 px-4">
      {/* Glassmorphism pill with small, equal padding and gaps all along */}
      <div className="flex flex-1 items-center gap-1 rounded-full border border-white/60 bg-white/75 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.8)] ring-1 ring-black/[0.05] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/75 dark:ring-white/[0.06]">
        {tabs.map(({ href, label, icon: Icon, end }) => {
          const isNotificationTab = href === "/notifications";

          return (
            <NavLink
              key={href}
              to={href}
              end={end}
              className={({ isActive }) =>
                cn(
                  "relative flex h-10 items-center justify-center transition-all duration-200",
                  isActive
                    ? "flex-[1.25] gap-1.5 rounded-full bg-[#237FEA] px-3 font-semibold text-white shadow-sm shadow-[#237FEA]/30"
                    : "flex-1 rounded-full text-neutral-600 hover:bg-black/[0.04] hover:text-[#237FEA] dark:text-neutral-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-transform duration-150",
                      isActive
                        ? "text-white stroke-[2.2]"
                        : "text-neutral-700 dark:text-neutral-300"
                    )}
                  />
                  {isActive && (
                    <span className="text-xs font-semibold whitespace-nowrap text-white animate-in fade-in duration-150">
                      {label}
                    </span>
                  )}
                  {/* Show indicator dot ONLY when inactive — when clicked/active, it is strictly just "Noti" */}
                  {isNotificationTab && unreadCount > 0 && !isActive && (
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-zinc-900" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Circular CTA Button — #237FEA with Lucide Megaphone icon + Report tooltip */}
      {fab && (
        <div className="group relative shrink-0">
          {/* Tooltip */}
          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-150 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 z-50">
            <div className="relative rounded-md bg-neutral-900/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md whitespace-nowrap backdrop-blur-sm">
              Report
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900/90" />
            </div>
          </div>

          <NavLink
            to={fab.href}
            aria-label={fab.label}
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full shadow-lg shadow-[#237FEA]/30 transition-all duration-150 hover:scale-105 hover:shadow-[#237FEA]/45 active:scale-95"
            style={{ backgroundColor: "#237FEA" }}
          >
            <Megaphone size={24} className="text-white" strokeWidth={2.2} />
          </NavLink>
        </div>
      )}
    </nav>
  );
}


