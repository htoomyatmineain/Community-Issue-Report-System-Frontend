import { useEffect, useState } from "react";
import { Building2, LogOut, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/providers/AuthProvider";
import { useStaffSettings } from "../hooks/useStaffSettings";

export default function StaffSettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { profile, departmentName, isLoading, error, updateProfile } = useStaffSettings();
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
    { icon: Building2, label: "Department", value: departmentName ?? "—" },
  ];

  return (
    <div>
      <PageHeader title="Settings" description="Your account details." />

      <div className="max-w-lg rounded-console border border-console-border bg-surface p-6">
        {isLoading ? (
          <p className="text-sm text-ink-muted">Loading…</p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : isEditing ? (
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-2 pb-2">
              <Avatar name={fullName} size="lg" />
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-ink">Full name</span>
              <Input
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                required
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-ink">Phone</span>
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </label>

            <p className="text-xs text-ink-muted">
              Email and department are managed by an administrator and can't be changed here.
            </p>

            {saveError && <p className="text-sm text-destructive">{saveError}</p>}

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditing(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSaving}>
                {isSaving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 pb-2">
              <Avatar name={fullName} size="lg" />
              <span className="font-display text-[17px] font-bold text-ink">{fullName}</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Government Staff</span>
            </div>

            <div className="rounded-md border border-console-border">
              {detailRows.map(({ icon: Icon, label, value }, index, arr) => (
                <div
                  key={label}
                  className={"flex items-center gap-3 p-3.5" + (index < arr.length - 1 ? " border-b border-console-border" : "")}
                >
                  <Icon className="h-4 w-4 shrink-0 text-ink-muted" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-ink-muted">{label}</span>
                    <span className="text-[13px] font-semibold text-ink">{value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setIsEditing(true)}>
                Edit profile
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="size-4" /> Log out
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
