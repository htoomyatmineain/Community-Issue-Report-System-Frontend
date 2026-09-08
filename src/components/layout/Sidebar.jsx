import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/** Desktop navigation sidebar — used by staff-* and admin-* shells. */
export default function Sidebar({ navGroups = [], user, profileHref = "#" }) {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  function handleLogout() {
    setLogoutOpen(false);
    setMenuOpen(false);
    logout();
    navigate("/login");
  }

  return (
    <aside className="sticky top-0 flex h-screen w-[250px] shrink-0 flex-col gap-3 overflow-y-auto border-r border-console-border bg-surface px-3 py-1">
      <div className="-mx-3 flex items-center border-b border-console-border px-3 pb-1">
        <img
          src="/assets/Kinn Htout Logo.png"
          alt="Kinn Htout"
          className="h-14 w-auto object-contain"
        />
      </div>

      <nav className="flex flex-1 flex-col gap-4">
        {navGroups.map((group, i) => (
          <div key={group.title ?? i} className="flex flex-col gap-1">
            {group.title && (
              <span className="px-3.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-ink/80">
                {t(group.title)}
              </span>
            )}
            {group.items.map(({ href, label, icon: Icon, end }) => (
              <NavLink
                key={href}
                to={href}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-full px-3.5 py-2.5 text-sm font-semibold transition-colors",
                    isActive ? "bg-nav-active text-brand" : "text-ink/80 hover:bg-surface-muted hover:text-ink"
                  )
                }
              >
                {Icon && <Icon className="size-[18px]" />}
                {t(label)}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {user && (
        <div className="relative -mx-3 border-t border-console-border px-3 pt-2" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex w-full items-center gap-2.5 rounded-lg px-1 py-1 text-left transition-colors hover:bg-surface-muted"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand">
              <span className="font-display text-[13px] font-bold text-ink-onbrand">{user.initials}</span>
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-[13px] font-semibold text-ink">{user.name}</span>
              <span className="truncate text-xs text-ink-muted">{t(user.role)}</span>
            </div>
          </button>

          {menuOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-56 rounded-lg border border-console-border bg-surface shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate(profileHref);
                }}
                className="flex w-full items-center gap-3 rounded-t-lg px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-muted"
              >
                <User className="size-4 text-ink-muted" />
                {t("View Profile")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setLogoutOpen(true);
                }}
                className="flex w-full items-center gap-3 rounded-b-lg px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-surface-muted"
              >
                <LogOut className="size-4" />
                {t("Log out")}
              </button>
            </div>
          )}
        </div>
      )}

      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("Log out")}</DialogTitle>
            <DialogDescription>
              {t("Are you sure you want to log out?")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutOpen(false)}>
              {t("Cancel")}
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              {t("Log out")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
