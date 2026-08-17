import StatusBadge from "@/components/common/StatusBadge";

const REPORTS = [
  { code: "RPT-1998", title: "Streetlight flickering on Union Ave", category: "Electricity", status: "IN_PROGRESS", reported: "Aug 10, 2026" },
  { code: "RPT-1997", title: "Large pothole near bus stop", category: "Roads", status: "ASSIGNED", reported: "Aug 10, 2026" },
  { code: "RPT-1995", title: "Blocked storm drain", category: "Sanitation", status: "RESOLVED", reported: "Aug 9, 2026" },
  { code: "RPT-1993", title: "Burst water pipe on 3rd St", category: "Water", status: "IN_PROGRESS", reported: "Aug 9, 2026" },
  { code: "RPT-1991", title: "Broken swing set at Riverside Park", category: "Parks", status: "ASSIGNED", reported: "Aug 8, 2026" },
  { code: "RPT-1988", title: "Crumbling sidewalk edge", category: "Roads", status: "RESOLVED", reported: "Aug 8, 2026" },
  { code: "RPT-1985", title: "Overflowing public bin", category: "Sanitation", status: "CLOSED", reported: "Aug 7, 2026" },
  { code: "RPT-1982", title: "Damaged fire hydrant cap", category: "Water", status: "RESOLVED", reported: "Aug 7, 2026" },
  { code: "RPT-1979", title: "Flickering traffic light", category: "Electricity", status: "IN_PROGRESS", reported: "Aug 6, 2026" },
  { code: "RPT-1975", title: "Cracked window at community hall", category: "Buildings", status: "ASSIGNED", reported: "Aug 6, 2026" },
];

const COLUMNS = [
  { key: "code", header: "Code", width: "w-[100px]" },
  { key: "title", header: "Title", width: "flex-1" },
  { key: "category", header: "Category", width: "w-[140px]" },
  { key: "status", header: "Status", width: "w-[150px]" },
  { key: "reported", header: "Reported", width: "w-[120px]" },
];

/** Recent reports table on the staff dashboard — mock data until wired to the API. */
export default function RecentReportsTable() {
  return (
    <div className="rounded-console border border-console-border bg-surface p-4">
      <h2 className="px-1 py-2 font-display text-base font-bold text-ink">Recent reports</h2>

      <div className="flex border-b border-console-border px-1 py-2.5">
        {COLUMNS.map((col) => (
          <div key={col.key} className={col.width}>
            <span className="text-xs font-bold text-ink-muted">{col.header}</span>
          </div>
        ))}
      </div>

      {REPORTS.map((report) => (
        <div key={report.code} className="flex items-center border-b border-console-border px-1 py-3 last:border-0">
          <div className="w-[100px] text-[13px] font-semibold text-ink">{report.code}</div>
          <div className="flex-1 pr-4 text-[13px] text-ink">{report.title}</div>
          <div className="w-[140px] text-[13px] text-ink-muted">{report.category}</div>
          <div className="w-[150px]">
            <StatusBadge status={report.status} />
          </div>
          <div className="w-[120px] text-[13px] text-ink-muted">{report.reported}</div>
        </div>
      ))}
    </div>
  );
}
