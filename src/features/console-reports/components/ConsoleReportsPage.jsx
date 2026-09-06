import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { ROLES } from "@/lib/rbac";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import StatusBadge from "@/components/common/StatusBadge";
import PriorityBadge from "@/components/common/PriorityBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useConsoleReportsList } from "../hooks/useConsoleReportsList";
import { useLanguage } from "@/app/providers/LanguageProvider";

const STATUS_FILTERS = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING_APPROVAL", label: "Pending approval" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
  { value: "REJECTED", label: "Rejected" },
];

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function ConsoleReportsPage() {
  const { t } = useLanguage();
  const { role } = useAuth();
  const isAdmin = role === ROLES.ADMIN;
  const basePath = isAdmin ? "/admin/reports" : "/staff/reports";

  const {
    reports,
    totalElements,
    totalPages,
    page,
    setPage,
    pageSize,
    isLoading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    categoryId,
    setCategoryId,
    departmentId,
    setDepartmentId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    categories,
    departments,
  } = useConsoleReportsList();

  const rangeStart = totalElements === 0 ? 0 : page * pageSize + 1;
  const rangeEnd = Math.min((page + 1) * pageSize, totalElements);

  return (
    <div>
      <PageHeader title="Reports" description="Every report routed through the system." />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="flex h-10 w-64 items-center gap-2 rounded-md border border-input bg-background px-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            type="search"
            placeholder={t("Search title, code…")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </label>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t("Category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("All categories")}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isAdmin && (
          <Select value={departmentId} onValueChange={setDepartmentId}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder={t("Department")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("All departments")}</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-10 w-[150px] rounded-md border border-input bg-background px-2 text-sm"
            aria-label={t("From date")}
          />
          <span>–</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-10 w-[150px] rounded-md border border-input bg-background px-2 text-sm"
            aria-label={t("To date")}
          />
        </div>
      </div>

      <div className="rounded-console border border-console-border bg-surface">
        {isLoading ? (
          <div className="p-6 text-sm text-ink-muted">{t("Loading reports…")}</div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">{error}</div>
        ) : reports.length === 0 ? (
          <EmptyState title="No reports found" description="Try a different search or filter." />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Code")}</TableHead>
                  <TableHead>{t("Title")}</TableHead>
                  <TableHead>{t("Category")}</TableHead>
                  {isAdmin && <TableHead>{t("Department")}</TableHead>}
                  <TableHead>{t("Priority")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                  <TableHead>{t("Submitted")}</TableHead>
                  <TableHead className="text-right">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-mono text-xs text-ink-muted">{report.reportCode}</TableCell>
                    <TableCell className="font-medium text-ink">{report.title}</TableCell>
                    <TableCell className="text-ink-muted">{report.categoryName}</TableCell>
                    {isAdmin && <TableCell className="text-ink-muted">{report.departmentName ?? "—"}</TableCell>}
                    <TableCell>
                      <PriorityBadge priority={report.priority} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={report.status} />
                    </TableCell>
                    <TableCell className="text-ink-muted">{formatDate(report.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`${basePath}/${report.id}`}>{t("View")}</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between border-t border-console-border px-4 py-3 text-sm text-ink-muted">
              <span>{t("Showing {start}–{end} of {total}", { start: rangeStart, end: rangeEnd, total: totalElements })}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                  {t("Previous")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t("Next")}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
