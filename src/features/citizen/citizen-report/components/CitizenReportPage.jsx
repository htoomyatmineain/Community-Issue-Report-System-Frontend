import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/app/providers/AuthProvider";
import { useLanguage } from "@/app/providers/LanguageProvider";
import EmptyState from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";
import NewReportForm from "./NewReportForm";
import ReportHistoryList from "./ReportHistoryList";

const TABS = [
  { id: "new", label: "New report" },
  { id: "history", label: "History" },
];

export default function CitizenReportPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("new");

  // Login itself blocks PENDING accounts (api-standards.md), so this only
  // matters for a stale session whose status changed after token issue —
  // still worth guarding per ui-rules.md's Report Submission Flow rules.
  const isApproved = user?.accountStatus !== "PENDING";

  function handleSubmitted(report, { confirmed } = {}) {
    if (!report?.id) return;
    toast.success(
      confirmed
        ? "Thanks — we've added your confirmation to the existing report"
        : "Report submitted — an admin will review it before it appears on the map"
    );
    navigate(`/report/${report.id}`);
  }

  return (
    <div className="flex w-full max-w-md flex-col px-5 pb-8 pt-4">
      {!isApproved ? (
        <EmptyState
          title="Your account is awaiting approval"
          description="You'll be able to submit reports once an admin approves your account."
        />
      ) : (
        <>
          <div className="mb-5 flex gap-1 rounded-lg bg-muted p-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 rounded-md py-1.5 text-sm font-semibold",
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                {t(tab.label)}
              </button>
            ))}
          </div>

          {activeTab === "new" ? (
            <NewReportForm onSubmitted={handleSubmitted} />
          ) : (
            <ReportHistoryList />
          )}
        </>
      )}
    </div>
  );
}
