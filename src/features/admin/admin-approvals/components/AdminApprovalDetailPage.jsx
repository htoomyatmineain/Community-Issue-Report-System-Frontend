import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Mail, Phone, IdCard, CalendarDays, Check, X } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import { adminApprovalsApi } from "../api/adminApprovalsApi";
import DenyAccountDialog from "./DenyAccountDialog";
import { useLanguage } from "@/app/providers/LanguageProvider";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

/** Account detail view reached from "Recent registrations" (dashboard) and the approvals queue's "View Detail" button. */
export default function AdminApprovalDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [citizen, setCitizen] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isDenyOpen, setIsDenyOpen] = useState(false);

  const fetchCitizen = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await adminApprovalsApi.getById(id);
      setCitizen(data);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load account");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCitizen();
  }, [fetchCitizen]);

  const isPending = citizen?.accountStatus === "PENDING";

  async function handleApprove() {
    setIsApproving(true);
    try {
      await adminApprovalsApi.approve(id);
      toast.success(t("Approved"));
      navigate("/admin");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? t("Failed to approve account"));
    } finally {
      setIsApproving(false);
    }
  }

  async function handleDeny(reason) {
    await adminApprovalsApi.reject(id, reason);
    toast.success(t("Denied"));
    navigate("/admin");
  }

  const detailRows = citizen && [
    { icon: Mail, label: "Email", value: citizen.email },
    { icon: Phone, label: "Phone", value: citizen.phone || "—" },
    { icon: IdCard, label: "NRC number", value: citizen.nrcNumber || "—" },
    { icon: CalendarDays, label: "Submitted", value: formatDate(citizen.createdAt) },
  ];

  return (
    <div>
      <PageHeader
        title="Account details"
        description="Review this citizen's information before approving or denying."
        action={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/admin")}>
            <ChevronLeft className="size-4" />
            {t("Back")}
          </Button>
        }
      />

      <div className="rounded-console border border-console-border bg-surface p-6">
        {isLoading ? (
          <div className="text-sm text-ink-muted">{t("Loading account…")}</div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 pb-2">
              <Avatar name={citizen.fullName} size="lg" />
              <span className="font-display text-[17px] font-bold text-ink">{citizen.fullName}</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {t("Citizen")}
              </span>
            </div>

            <div className="rounded-md border border-console-border">
              {detailRows.map(({ icon: Icon, label, value }, index, arr) => (
                <div
                  key={label}
                  className={
                    "flex items-center gap-3 p-3.5" + (index < arr.length - 1 ? " border-b border-console-border" : "")
                  }
                >
                  <Icon className="h-4 w-4 shrink-0 text-ink-muted" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-ink-muted">{t(label)}</span>
                    <span className="text-[13px] font-semibold text-ink">{value}</span>
                  </div>
                </div>
              ))}
            </div>

            {isPending && (
              <div className="flex gap-2">
                <Button
                  className="flex-1 gap-2 border-emerald-600/40 text-emerald-400 hover:bg-emerald-500/10"
                  variant="outline"
                  disabled={isApproving}
                  onClick={handleApprove}
                >
                  <Check className="size-4" /> {t("Approve")}
                </Button>
                <Button
                  className="flex-1 gap-2 border-rose-600/40 text-rose-400 hover:bg-rose-500/10"
                  variant="outline"
                  onClick={() => setIsDenyOpen(true)}
                >
                  <X className="size-4" /> {t("Deny")}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <DenyAccountDialog
        open={isDenyOpen}
        onOpenChange={setIsDenyOpen}
        citizen={citizen}
        onDeny={handleDeny}
      />
    </div>
  );
}
