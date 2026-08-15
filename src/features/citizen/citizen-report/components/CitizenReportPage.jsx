import { useState } from "react";
import NotificationBell from "@/components/common/NotificationBell";
import { cn } from "@/lib/utils";
import NewReportForm from "./NewReportForm";
import ReportHistoryList from "./ReportHistoryList";

const TABS = [
  { id: "new", label: "New report" },
  { id: "history", label: "History" },
];

export default function CitizenReportPage() {
  const [activeTab, setActiveTab] = useState("new");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  return (
    <div className="flex w-full max-w-md flex-col px-5 pb-8 pt-4">
      <header className="flex items-center justify-between pb-3">
        <h1 className="font-display text-lg font-bold text-foreground">Report an issue</h1>
        <NotificationBell />
      </header>

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
        <NewReportForm
          onSubmitted={() => {
            setHistoryRefreshKey((k) => k + 1);
            setActiveTab("history");
          }}
        />
      ) : (
        <ReportHistoryList refreshKey={historyRefreshKey} />
      )}
    </div>
  );
}
