import { Calendar, CalendarPlus, CircleCheck, IdCard, Mail, Pencil, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import { useCitizenProfile } from "../hooks/useCitizenProfile";

const ACCOUNT_STATUS_STYLES = {
  APPROVED: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  REJECTED: "bg-red-100 text-red-700",
  SUSPENDED: "bg-slate-100 text-slate-600",
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

const DETAIL_ROWS = (profile) => [
  { icon: Mail, label: "Email", value: profile.email },
  { icon: Phone, label: "Phone", value: profile.phone },
  { icon: Calendar, label: "Date of birth", value: formatDate(profile.dateOfBirth) },
  { icon: IdCard, label: "NRC number", value: profile.nrcNumber },
  { icon: CalendarPlus, label: "Joined", value: formatDate(profile.joinedAt) },
];

export default function CitizenProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { profile, isLoading, error } = useCitizenProfile();
  const fullName = user?.fullName ?? profile?.fullName;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex w-full max-w-md flex-col px-5 pb-8 pt-4">
      <header className="flex items-center justify-between pb-2">
        <h1 className="font-display text-lg font-bold text-foreground">Profile</h1>
        <Pencil className="h-[18px] w-[18px] text-muted-foreground" />
      </header>

      {isLoading ? (
        <p className="py-6 text-sm text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="py-6 text-sm text-destructive">{error}</p>
      ) : (
        <div className="flex flex-col gap-6 pt-2">
          <div className="flex flex-col items-center gap-2 py-6">
            <Avatar name={fullName} size="lg" />
            <span className="font-display text-[17px] font-bold text-foreground">{fullName}</span>
            <span
              className={
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold " +
                (ACCOUNT_STATUS_STYLES[profile.accountStatus] ?? "bg-muted text-muted-foreground")
              }
            >
              <CircleCheck className="h-3.5 w-3.5" />
              {profile.accountStatus === "APPROVED" ? "Approved" : profile.accountStatus}
            </span>
          </div>

          <div className="rounded-lg border border-border">
            {DETAIL_ROWS(profile).map(({ icon: Icon, label, value }, index, arr) => (
              <div
                key={label}
                className={
                  "flex items-center gap-3 p-3.5" +
                  (index < arr.length - 1 ? " border-b border-border" : "")
                }
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] text-muted-foreground">{label}</span>
                  <span className="text-[13px] font-semibold text-foreground">{value}</span>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full">
            Edit profile
          </Button>
          <Button
            variant="outline"
            className="w-full border-destructive text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      )}
    </div>
  );
}
