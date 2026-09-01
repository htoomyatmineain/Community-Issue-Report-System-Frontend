import { FileText, CheckCircle2, LoaderCircle, FileClock, Map } from "lucide-react";
import StatCard from "@/components/common/StatCard";
import DepartmentsChart from "./DepartmentsChart";
import RecentReportsTable from "./RecentReportsTable";

const STATS = [
  { label: "Total Reports", value: "642", icon: FileText, tone: "blue", trend: { direction: "up", value: "8%" } },
  { label: "Resolved", value: "518", icon: CheckCircle2, tone: "green", trend: { direction: "up", value: "20%" } },
  { label: "Remaining", value: "124", icon: LoaderCircle, tone: "amber", trend: { direction: "down", value: "9%" } },
  { label: "New Today", value: "9", icon: FileClock, tone: "violet", trend: { direction: "up", value: "13%" } },
];

/** Entry page for the staff-dashboard feature. */
export default function StaffDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Staff Dashboard</h1>
        <p className="text-sm text-ink-muted">Your reports overview and department performance</p>
      </div>

      <div className="flex gap-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="flex gap-6">
        <div className="flex-1 rounded-console border border-console-border bg-surface p-6">
          <h2 className="font-display text-base font-bold text-ink">Report locations</h2>
          <div className="mt-4 flex h-[234px] flex-col items-center justify-center gap-2 rounded-md bg-surface-muted">
            <Map className="size-8 text-ink-muted" />
            <span className="text-[13px] font-semibold text-ink-muted">Map preview</span>
            <span className="text-xs text-ink-muted">No data available for the selected period.</span>
          </div>
        </div>

        <div className="flex-1 rounded-console border border-console-border bg-surface p-6">
          <h2 className="font-display text-base font-bold text-ink">Monthly reports per department</h2>
          <div className="mt-4">
            <DepartmentsChart />
          </div>
        </div>
      </div>

      <RecentReportsTable />
    </div>
  );
}
