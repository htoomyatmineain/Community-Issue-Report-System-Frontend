import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, LogOut, Shield } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/app/providers/AuthProvider";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function AdminProfilePage() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const detailRows = user && [
    { icon: Mail, label: "Email", value: user.email },
    { icon: Shield, label: "Role", value: "Administrator" },
  ];

  function handleLogout() {
    setLogoutOpen(false);
    logout();
    navigate("/login");
  }

  return (
    <div>
      <PageHeader title="Profile" description="Your account details." />

      <div className="rounded-xl border border-console-border/70 bg-surface p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 pb-2">
            <Avatar name={user?.fullName} size="lg" />
            <span className="font-display text-[17px] font-semibold tracking-tight text-ink">{user?.fullName}</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {t("Administrator")}
            </span>
          </div>

          <div className="rounded-xl border border-console-border/70 overflow-hidden divide-y divide-console-border/60">
            {detailRows.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-3.5 hover:bg-surface-muted/30 transition-colors"
              >
                <Icon className="h-4 w-4 shrink-0 text-ink-muted" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] text-ink-muted">{t(label)}</span>
                  <span className="text-[13px] font-medium tracking-tight text-ink">{value}</span>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="destructive"
            className="gap-2"
            onClick={() => setLogoutOpen(true)}
          >
            <LogOut className="size-4" />
            {t("Log out")}
          </Button>
        </div>
      </div>

      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("Log out")}</DialogTitle>
            <DialogDescription>{t("Are you sure you want to log out?")}</DialogDescription>
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
    </div>
  );
}
