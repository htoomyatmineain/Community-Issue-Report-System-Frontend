import { useState } from "react";
import { ChevronLeft, MessageSquarePlus } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/app/providers/AuthProvider";
import { ROLES } from "@/lib/rbac";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/common/StatusBadge";
import PriorityBadge from "@/components/common/PriorityBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { REPORT_PRIORITY } from "@/lib/constants";
import { useConsoleReportDetail } from "../hooks/useConsoleReportDetail";
import { consoleReportsApi } from "../api/consoleReportsApi";
import OverviewTab from "./OverviewTab";
import TimelineTab from "./TimelineTab";
import CommentsTab from "./CommentsTab";
import ResolutionTab from "./ResolutionTab";
import StatusChangeDialog from "./StatusChangeDialog";
import AssignDialog from "./AssignDialog";
import { useLanguage } from "@/app/providers/LanguageProvider";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "timeline", label: "Timeline" },
  { id: "comments", label: "Comments" },
  { id: "resolution", label: "Resolution" },
];

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
    setPriority,
    assign,
    addComment,
    uploadResolutionPhotos,
  } = useConsoleReportDetail(id);

  const [activeTab, setActiveTab] = useState("overview");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [departments, setDepartments] = useState([]);

  function openAssignDialog() {
    consoleReportsApi.listDepartments().then(setDepartments).catch(() => setDepartments([]));
    setIsAssignDialogOpen(true);
  }

  async function handlePriorityChange(priority) {
    try {
      await setPriority(priority);
      toast.success(t("Priority updated"));
    } catch (err) {
      toast.error(err?.response?.data?.message ?? t("Failed to update priority"));
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
              <h1 className="font-display text-2xl font-bold text-ink">{report.title}</h1>
              <StatusBadge status={report.status} />
              <PriorityBadge priority={report.priority} />
            </div>
            <p className="mt-1 text-sm text-ink-muted">{report.reportCode}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={report.priority} onValueChange={handlePriorityChange}>
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
          {isAdmin && (
            <Button variant="outline" onClick={openAssignDialog}>
              {t("Assign department")}
            </Button>
          )}
          <Button variant="outline" className="gap-2" onClick={() => setActiveTab("comments")}>
            <MessageSquarePlus className="size-4" />
            {t("Add comment")}
          </Button>
          <Button onClick={() => setIsStatusDialogOpen(true)}>{t("Change status")}</Button>
        </div>
      </div>

      <div className="mb-5 flex w-fit gap-1 rounded-lg bg-surface-muted p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-semibold",
              activeTab === tab.id ? "bg-surface text-ink shadow-sm" : "text-ink-muted"
            )}
          >
            {t(tab.label)}
          </button>
        ))}
      </div>

      <div className="rounded-console border border-console-border bg-surface p-6">
        {activeTab === "overview" && <OverviewTab report={report} />}
        {activeTab === "timeline" && <TimelineTab history={history} />}
        {activeTab === "comments" && <CommentsTab comments={comments} onAddComment={addComment} />}
        {activeTab === "resolution" && (
          <ResolutionTab report={report} onUpload={uploadResolutionPhotos} />
        )}
      </div>

      <StatusChangeDialog
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        report={report}
        onChangeStatus={changeStatus}
        onUploadPhoto={uploadResolutionPhotos}
      />

      {isAdmin && (
        <AssignDialog
          open={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          report={report}
          departments={departments}
          onAssign={assign}
        />
      )}
    </div>
  );
}
