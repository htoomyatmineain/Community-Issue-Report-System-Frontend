import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * Desktop navigation sidebar rail & drawer — used by both staff-* and admin-* shells.
 * In expanded mode (isOpen=true): 256px wide with full logo, group headers, and labels.
 * In collapsed mode (isOpen=false): 72px icon rail with favicon mark, centered nav icons,
 * tooltips, and compact user avatar.
 * Header is exactly h-14 (56px) to align seamlessly with Topbar's bottom border.
 */
export default function Sidebar({
  navGroups = [],
  user,
  profileHref = "#",
  isOpen = true,
  onToggle,
}) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 flex h-screen shrink-0 flex-col border-r border-console-border bg-surface select-none transition-all duration-300 ease-in-out",
        isOpen ? "w-[256px]" : "w-[72px]"
      )}
      aria-label={t("Sidebar")}
    >
      {/* Header with Logo — EXACTLY h-14 (56px) to perfectly align with Topbar bottom border */}
      <div className={cn(
        "flex h-14 shrink-0 items-center border-b border-console-border",
        isOpen ? "px-4" : "justify-center px-2"
      )}>
        {isOpen ? (
          <img
            src="/assets/Kinn Htout Logo.png"
            alt="Kinn Htout"
            className="h-8 w-auto object-contain pl-0.5"
          />
        ) : (
          <button
            type="button"
            onClick={onToggle}
            className="group flex size-9 items-center justify-center rounded-xl transition-all hover:bg-surface-muted active:scale-95"
            title={t("Expand sidebar (Ctrl+B)")}
            aria-label={t("Expand sidebar")}
          >
            <img
              src="/favicon/Kinn Htout Favicon .png"
              alt="Kinn Htout"
              className="size-7 object-contain transition-transform group-hover:scale-105"
            />
          </button>
        )}
      </div>

      {/* Navigation Groups & Items */}
      <nav className={cn(
        "flex flex-1 flex-col gap-4 overflow-y-auto py-3",
        isOpen ? "px-3" : "px-2"
      )}>
        {navGroups.map((group, i) => (
          <div key={group.title ?? i} className="flex flex-col gap-0.5">
            {isOpen ? (
              group.title && (
                <span className={cn(
                  "px-3 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-muted/70 select-none",
                  i > 0 && "pt-2.5"
                )}>
                  {t(group.title)}
                </span>
              )
            ) : (
              i > 0 && <div className="my-1.5 h-px bg-console-border/50 mx-2" />
            )}

            {group.items.map(({ href, label, icon: Icon, end }) => (
              <NavLink
                key={href}
                to={href}
                end={end}
                title={!isOpen ? t(label) : undefined}
                className={({ isActive }) =>
                  cn(
                    "group transition-all duration-150 active:scale-[0.99]",
                    isOpen
                      ? cn(
                          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] tracking-tight transition-all duration-150",
                          isActive
                            ? "bg-nav-active font-semibold text-brand shadow-xs hover:shadow-[0_2px_8px_rgba(35,127,234,0.15)]"
                            : "text-ink-muted font-medium hover:bg-surface-muted/80 hover:text-ink hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                        )
                      : cn(
                          "flex size-11 items-center justify-center rounded-xl mx-auto transition-all duration-150",
                          isActive
                            ? "bg-nav-active font-semibold text-brand shadow-xs border border-brand/20 hover:shadow-[0_2px_8px_rgba(35,127,234,0.15)]"
                            : "text-ink-muted hover:bg-surface-muted/80 hover:text-ink hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                        )
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {Icon && (
                      <Icon
                        className={cn(
                          "shrink-0 transition-transform",
                          isActive
                            ? "text-brand stroke-[2]"
                            : "text-ink-muted/80 group-hover:text-ink stroke-[1.65]",
                          isOpen
                            ? "size-[18px] group-hover:scale-105"
                            : "size-5 group-hover:scale-110"
                        )}
                      />
                    )}
                    {isOpen && <span className="truncate">{t(label)}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User Profile Footer */}
      {user && (
        <div className={cn(
          "border-t border-console-border shrink-0 py-2.5",
          isOpen ? "px-3" : "px-2"
        )}>
          {isOpen ? (
            <button
              type="button"
              onClick={() => navigate(profileHref)}
              className="flex w-full items-center gap-2.5 rounded-xl border border-transparent p-2 text-left transition-all duration-150 hover:border-console-border/60 hover:bg-surface-muted/70 active:scale-[0.99]"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand shadow-xs">
                <span className="font-display text-xs font-semibold text-ink-onbrand">
                  {user.initials}
                </span>
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[13px] font-medium tracking-tight text-ink">
                  {user.name}
                </span>
                <span className="truncate text-[11px] text-ink-muted font-normal">
                  {t(user.role)}
                </span>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate(profileHref)}
              title={`${user.name} (${t(user.role)})`}
              className="flex size-10 mx-auto items-center justify-center rounded-full bg-brand shadow-xs transition-all hover:ring-2 hover:ring-brand/40 active:scale-95"
            >
              <span className="font-display text-xs font-semibold text-ink-onbrand">
                {user.initials}
              </span>
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
