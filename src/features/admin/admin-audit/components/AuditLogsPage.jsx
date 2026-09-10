import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { AUDIT_ACTIONS } from "../api/auditLogsApi";
import { useAuditLog } from "../hooks/useAuditLog";

const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

/** Creations / approvals read green, rejections / removals red, the rest amber. */
const ACTION_TONE = {
  USER_APPROVED: "bg-emerald-500/10 text-emerald-400",
  STAFF_CREATED: "bg-emerald-500/10 text-emerald-400",
  DEPARTMENT_CREATED: "bg-emerald-500/10 text-emerald-400",
  CATEGORY_CREATED: "bg-emerald-500/10 text-emerald-400",
  REPORT_APPROVED: "bg-emerald-500/10 text-emerald-400",

  USER_REJECTED: "bg-rose-500/10 text-rose-400",
  USER_SUSPENDED: "bg-rose-500/10 text-rose-400",
  DEPARTMENT_DEACTIVATED: "bg-rose-500/10 text-rose-400",
  CATEGORY_DEACTIVATED: "bg-rose-500/10 text-rose-400",
  REPORT_REJECTED: "bg-rose-500/10 text-rose-400",
};
const DEFAULT_TONE = "bg-amber-500/10 text-amber-400";

const BADGE_BASE =
  "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider";

export default function AuditLogsPage() {
  const { t } = useLanguage();
  const {
    entries,
    totalElements,
    totalPages,
    page,
    setPage,
    pageSize,
    isLoading,
    error,
    search,
    setSearch,
    action,
    setAction,
    actorId,
    setActorId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    actors,
  } = useAuditLog();

  const rangeStart = totalElements === 0 ? 0 : page * pageSize + 1;
  const rangeEnd = Math.min((page + 1) * pageSize, totalElements);

  return (
    <div>
      <PageHeader
        title="System Audit Logs"
        description="Every administrative and staff operation, recorded as it happens."
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("Search by actor, target, or keyword…")}
          className="sm:max-w-xs"
        />

        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className="sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("All actions")}</SelectItem>
            {AUDIT_ACTIONS.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={actorId} onValueChange={setActorId}>
          <SelectTrigger className="sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("All actors")}</SelectItem>
            {actors.map((a) => (
              <SelectItem key={a.id} value={String(a.id)}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1.5 text-sm text-ink-muted">
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
          <div className="p-6 text-sm text-ink-muted">{t("Loading audit logs…")}</div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">{error}</div>
        ) : entries.length === 0 ? (
          <EmptyState
            title="No audit entries"
            description="Nothing matches the current filters."
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Timestamp")}</TableHead>
                  <TableHead>{t("Actor")}</TableHead>
                  <TableHead>{t("Action")}</TableHead>
                  <TableHead>{t("Target Entity")}</TableHead>
                  <TableHead>{t("Details / State Change")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="whitespace-nowrap text-ink-muted">
                      {formatDateTime(entry.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-ink">{entry.actorName}</span>
                        {entry.actorEmail && (
                          <span className="text-xs text-ink-muted">{entry.actorEmail}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn(BADGE_BASE, ACTION_TONE[entry.action] ?? DEFAULT_TONE)}>
                        {entry.action}
                      </span>
                    </TableCell>
                    <TableCell className="text-ink">{entry.targetLabel}</TableCell>
                    <TableCell className="text-ink-muted">{entry.details ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between border-t border-console-border px-4 py-3 text-sm text-ink-muted">
              <span>
                {t("Showing {start}–{end} of {total}", {
                  start: rangeStart,
                  end: rangeEnd,
                  total: totalElements,
                })}
              </span>
              <div className="flex gap-2">
                <Button size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                  {t("Previous")}
                </Button>
                <Button
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
