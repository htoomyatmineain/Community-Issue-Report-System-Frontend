import { useEffect, useState } from "react";
import { ChevronLeft, MessageSquarePlus, Download, Check, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/app/providers/AuthProvider";
import { ROLES } from "@/lib/rbac";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/common/StatusBadge";
import PriorityBadge from "@/components/common/PriorityBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { REPORT_PRIORITY, REPORT_STATUS } from "@/lib/constants";
import { useConsoleReportDetail } from "../hooks/useConsoleReportDetail";
import { consoleReportsApi } from "../api/consoleReportsApi";
import OverviewTab from "./OverviewTab";
import TimelineTab, { stepLabelKey } from "./TimelineTab";
import CommentsTab from "./CommentsTab";
import ResolutionTab from "./ResolutionTab";
import StatusChangeDialog from "./StatusChangeDialog";
import AssignDialog from "./AssignDialog";
import DenyReportDialog from "@/features/admin/admin-report-approvals/components/DenyReportDialog";
import { useLanguage } from "@/app/providers/LanguageProvider";

const ALL_TABS = [
  { id: "overview", label: "Overview" },
  { id: "timeline", label: "Timeline" },
  { id: "comments", label: "Comments" },
  { id: "resolution", label: "Resolution" },
];
// Admins route/approve/reject reports but don't run the day-to-day workflow —
// status changes, comments, and resolution evidence are staff's job.
const ADMIN_TAB_IDS = new Set(["overview", "timeline"]);

export default function ConsoleReportDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const { role } = useAuth();
  const isAdmin = role === ROLES.ADMIN;
  const navigate = useNavigate();
  const basePath = isAdmin ? "/admin/reports" : "/staff/reports";

  const {
    report,
    history,
    comments,
    isLoading,
    error,
    changeStatus,
    approve,
    reject,
    setPriority,
    assign,
    addComment,
    uploadResolutionPhotos,
  } = useConsoleReportDetail(id);

  const [activeTab, setActiveTab] = useState("overview");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isDenyDialogOpen, setIsDenyDialogOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  // Draft priority pick, applied only when the admin/staff explicitly confirms
  // — a Select's onValueChange used to commit (and notify) immediately on
  // every click, before the reviewer had actually decided on a value.
  const [priorityDraft, setPriorityDraft] = useState(null);
  const [isSavingPriority, setIsSavingPriority] = useState(false);

  const isPendingApproval = report?.status === "PENDING_APPROVAL";
  const canExport = report?.status === "RESOLVED" || report?.status === "CLOSED";
  const TABS = isAdmin ? ALL_TABS.filter((tab) => ADMIN_TAB_IDS.has(tab.id)) : ALL_TABS;

  useEffect(() => {
    setPriorityDraft(null);
  }, [report?.priority]);

  async function handleApprove() {
    setIsApproving(true);
    try {
      await approve();
      toast.success(t("Report {code} approved — routed to its department.", { code: report.reportCode }));
    } catch (err) {
      toast.error(err?.response?.data?.message ?? t("Failed to approve report"));
    } finally {
      setIsApproving(false);
    }
  }

  async function handleDeny(_id, reason) {
    await reject(reason);
    toast.success(t("Report {code} denied and the reporter notified.", { code: report.reportCode }));
  }

  async function handleAssign(payload) {
    await assign(payload);
    const departmentName = departments.find((d) => d.id === payload.departmentId)?.name;
    toast.success(
      t("Report {code} routed to {department}.", {
        code: report.reportCode,
        department: departmentName ? t(departmentName) : t("the selected department"),
      })
    );
  }

  async function handleChangeStatus(payload) {
    await changeStatus(payload);
    toast.success(
      t("Report {code} status changed to {status}.", {
        code: report.reportCode,
        status: t(REPORT_STATUS[payload.status]?.label ?? payload.status),
      })
    );
  }

  function openAssignDialog() {
    consoleReportsApi.listDepartments().then(setDepartments).catch(() => setDepartments([]));
    setIsAssignDialogOpen(true);
  }

  async function handleExport() {
    setIsExporting(true);
    try {
      const { exportReportPdf } = await import("@/lib/reportPdf");
      const steps = (history ?? []).map((h) => ({
        label: t(stepLabelKey(h)) + (h.remarks ? ` — ${h.remarks}` : ""),
        at: h.changedAt,
      }));
      await exportReportPdf(report, { steps, comments });
    } catch {
      toast.error(t("Failed to export PDF"));
    } finally {
      setIsExporting(false);
    }
  }

  async function handleConfirmPriority() {
    const priority = priorityDraft;
    if (!priority || priority === report.priority) return;
    setIsSavingPriority(true);
    try {
      await setPriority(priority);
      toast.success(
        t("Report {code} priority set to {priority}.", {
          code: report.reportCode,
          priority: t(REPORT_PRIORITY[priority]?.label ?? priority),
        })
      );
      setPriorityDraft(null);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? t("Failed to update priority"));
    } finally {
      setIsSavingPriority(false);
    }
  }

  if (isLoading) return <p className="p-6 text-sm text-ink-muted">{t("Loading…")}</p>;
  if (error || !report) {
    return (
      <div className="flex flex-col items-start gap-3 p-6">
        <p className="text-sm text-destructive">{error ?? t("Report not found")}</p>
        <Link to={basePath} className="text-sm font-semibold text-brand">
          {t("Back to reports")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            aria-label={t("Back")}
            onClick={() => navigate(basePath)}
            className="mt-1 text-ink-muted hover:text-ink"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-ink">{report.categoryName}</h1>
              <StatusBadge status={report.status} />
              <PriorityBadge priority={report.priority} />
            </div>
            <p className="mt-1 text-sm text-ink-muted">{report.reportCode}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={priorityDraft ?? report.priority} onValueChange={setPriorityDraft}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(REPORT_PRIORITY).map((p) => (
                <SelectItem key={p} value={p}>
                  {t(REPORT_PRIORITY[p].label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {priorityDraft && priorityDraft !== report.priority && (
            <Button size="sm" className="gap-1.5" disabled={isSavingPriority} onClick={handleConfirmPriority}>
              <Check className="size-4" /> {isSavingPriority ? t("Saving…") : t("Confirm")}
            </Button>
          )}
          {isAdmin && (
            <Button variant="outline" onClick={openAssignDialog}>
              {t("Assign department")}
            </Button>
          )}
          {!isAdmin && (
            <Button variant="outline" className="gap-2" onClick={() => setActiveTab("comments")}>
              <MessageSquarePlus className="size-4" />
              {t("Add comment")}
            </Button>
          )}
          {canExport && (
            <Button
              variant="outline"
              className="gap-2"
              title={t("Export report")}
              disabled={isExporting}
              onClick={handleExport}
            >
              <Download className="size-4" />
              {isExporting ? t("Exporting…") : t("Export PDF")}
            </Button>
          )}
          {isPendingApproval && isAdmin ? (
            <>
              <Button
                variant="outline"
                className="gap-2 border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => setIsDenyDialogOpen(true)}
              >
                <X className="size-4" /> {t("Reject")}
              </Button>
              <Button className="gap-2" disabled={isApproving} onClick={handleApprove}>
                <Check className="size-4" /> {isApproving ? t("Approving…") : t("Approve")}
              </Button>
            </>
          ) : (
            !isPendingApproval && !isAdmin && (
              <Button onClick={() => setIsStatusDialogOpen(true)}>{t("Change status")}</Button>
            )
          )}
        </div>
      </div>

      <div className="mb-5 inline-flex items-center gap-1 rounded-xl border border-console-border/70 bg-surface-muted/60 p-1 select-none">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95",
              activeTab === tab.id
                ? "bg-brand text-white shadow-xs font-semibold"
                : "text-ink-muted hover:text-ink"
            )}
          >
            {t(tab.label)}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-console-border/70 bg-surface p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        {activeTab === "overview" && (
          <OverviewTab report={report} mapHref={isAdmin ? "/admin/map" : "/staff/map"} />
        )}
        {activeTab === "timeline" && <TimelineTab history={history} report={report} />}
        {!isAdmin && activeTab === "comments" && (
          <CommentsTab comments={comments} onAddComment={addComment} />
        )}
        {!isAdmin && activeTab === "resolution" && <ResolutionTab report={report} />}
      </div>

      {!isAdmin && (
        <StatusChangeDialog
          open={isStatusDialogOpen}
          onOpenChange={setIsStatusDialogOpen}
          report={report}
          onChangeStatus={handleChangeStatus}
          onUploadPhoto={uploadResolutionPhotos}
        />
      )}

      <DenyReportDialog
        open={isDenyDialogOpen}
        onOpenChange={setIsDenyDialogOpen}
        report={report}
        onDeny={handleDeny}
      />

      {isAdmin && (
        <AssignDialog
          open={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          report={report}
          departments={departments}
          onAssign={handleAssign}
        />
      )}
    </div>
  );
}
