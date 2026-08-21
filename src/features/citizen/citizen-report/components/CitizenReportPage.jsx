import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/app/providers/AuthProvider";
import EmptyState from "@/components/common/EmptyState";
import NotificationBell from "@/components/common/NotificationBell";
import { cn } from "@/lib/utils";
import NewReportForm from "./NewReportForm";
import ReportHistoryList from "./ReportHistoryList";

const TABS = [
  { id: "new", label: "New report" },
  { id: "history", label: "History" },
];

export default function CitizenReportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("new");

  // Login itself blocks PENDING accounts (api-standards.md), so this only
  // matters for a stale session whose status changed after token issue —
  // still worth guarding per ui-rules.md's Report Submission Flow rules.
  const isApproved = user?.accountStatus !== "PENDING";

  function handleSubmitted(created) {
    toast.success("Report submitted — it will appear on the map once approved");
    navigate(`/report/${created.id}`);
  }

  return (
    <div className="flex w-full max-w-md flex-col px-5 pb-8 pt-4">
      <header className="flex items-center justify-between pb-3">
        <h1 className="font-display text-lg font-bold text-foreground">Report an issue</h1>
        <NotificationBell />
      </header>

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
                {tab.label}
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
