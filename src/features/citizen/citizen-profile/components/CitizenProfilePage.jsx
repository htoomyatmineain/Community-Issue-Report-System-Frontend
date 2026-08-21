import { useEffect, useState } from "react";
import { Calendar, CalendarPlus, IdCard, Mail, Pencil, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import Avatar from "@/components/common/Avatar";
import AccountStatusBadge from "@/components/common/AccountStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCitizenProfile } from "../hooks/useCitizenProfile";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function CitizenProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { profile, isLoading, error, updateProfile } = useCitizenProfile();
  const fullName = user?.fullName ?? profile?.fullName;

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "" });
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) setForm({ fullName: profile.fullName ?? "", phone: profile.phone ?? "" });
  }, [profile]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function startEditing() {
    setSaveError(null);
    setIsEditing(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateProfile(form);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err?.response?.data?.message ?? "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  }

  const detailRows = profile && [
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Phone, label: "Phone", value: profile.phone || "—" },
    { icon: Calendar, label: "Date of birth", value: formatDate(profile.dateOfBirth) },
    { icon: IdCard, label: "NRC number", value: profile.nrcNumber },
    { icon: CalendarPlus, label: "Joined", value: formatDate(profile.createdAt) },
  ];

  return (
    <div className="flex w-full max-w-md flex-col px-5 pb-8 pt-4">
      <header className="flex items-center justify-between pb-2">
        <h1 className="font-display text-lg font-bold text-foreground">Profile</h1>
        {!isEditing && profile && (
          <button type="button" aria-label="Edit profile" onClick={startEditing}>
            <Pencil className="h-[18px] w-[18px] text-muted-foreground" />
          </button>
        )}
      </header>

      {isLoading ? (
        <p className="py-6 text-sm text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="py-6 text-sm text-destructive">{error}</p>
      ) : isEditing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-5 pt-2">
          <div className="flex flex-col items-center gap-2 py-6">
            <Avatar name={fullName} size="lg" />
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-foreground">Full name</span>
            <Input
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              required
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-foreground">Phone</span>
            <Input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </label>

          <p className="text-xs text-muted-foreground">
            Email, date of birth and NRC number were verified at signup and can't be changed here.
          </p>

          {saveError && <p className="text-sm text-destructive">{saveError}</p>}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSaving}>
              {isSaving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-6 pt-2">
          <div className="flex flex-col items-center gap-2 py-6">
            <Avatar name={fullName} size="lg" />
            <span className="font-display text-[17px] font-bold text-foreground">{fullName}</span>
            <AccountStatusBadge status={profile.accountStatus} />
          </div>

          <div className="rounded-lg border border-border">
            {detailRows.map(({ icon: Icon, label, value }, index, arr) => (
              <div
                key={label}
                className={
                  "flex items-center gap-3 p-3.5" + (index < arr.length - 1 ? " border-b border-border" : "")
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

          <Button variant="outline" className="w-full" onClick={startEditing}>
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
