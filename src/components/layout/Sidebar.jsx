import { NavLink } from "react-router-dom";
import { Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

/** Desktop navigation sidebar — used by staff-* and admin-* shells. */
export default function Sidebar({ items = [], user }) {
  const { t } = useLanguage();

  return (
    <aside className="sticky top-0 flex h-screen w-[250px] shrink-0 flex-col gap-6 overflow-y-auto border-r border-console-border bg-surface px-4 py-6">
      <div className="flex items-center gap-2.5 px-1">
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand">
          <Landmark className="size-[18px] text-ink-onbrand" />
        </span>
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
                "flex items-center gap-3 rounded-full px-3.5 py-2.5 text-sm font-semibold transition-colors",
                isActive ? "bg-nav-active text-brand" : "text-ink-muted hover:bg-surface-muted"
              )
            }
          >
            {Icon && <Icon className="size-[18px]" />}
            {t(label)}
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
            <span className="text-xs text-ink-muted">{t(user.role)}</span>
          </div>
        </div>
      )}
    </aside>
  );
}
