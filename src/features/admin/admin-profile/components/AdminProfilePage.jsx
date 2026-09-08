import { Mail, Shield } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import Avatar from "@/components/common/Avatar";
import { useAuth } from "@/app/providers/AuthProvider";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function AdminProfilePage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const detailRows = user && [
    { icon: Mail, label: "Email", value: user.email },
    { icon: Shield, label: "Role", value: "Administrator" },
  ];

  return (
    <div>
      <PageHeader title="Profile" description="Your account details." />

      <div className="rounded-console border border-console-border bg-surface p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 pb-2">
            <Avatar name={user?.fullName} size="lg" />
            <span className="font-display text-[17px] font-bold text-ink">{user?.fullName}</span>
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {t("Administrator")}
            </span>
          </div>

          <div className="rounded-md border border-console-border">
            {detailRows.map(({ icon: Icon, label, value }, index, arr) => (
              <div
                key={label}
                className={"flex items-center gap-3 p-3.5" + (index < arr.length - 1 ? " border-b border-console-border" : "")}
              >
                <Icon className="h-4 w-4 shrink-0 text-ink-muted" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] text-ink-muted">{t(label)}</span>
                  <span className="text-[13px] font-semibold text-ink">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
