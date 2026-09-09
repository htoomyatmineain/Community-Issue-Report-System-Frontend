import { useMemo, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
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
import { AUDIT_ACTIONS } from "../auditLogStore";
import { useAuditLog } from "../hooks/useAuditLog";

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/** Approvals/creations read green/blue, denials/deletions red, updates amber. */
const ACTION_BADGE = {
  APPROVE_USER: "bg-emerald-500/10 text-emerald-400",
  RESOLVE_ISSUE: "bg-emerald-500/10 text-emerald-400",
  CREATE_DEPT: "bg-[#237FEA]/10 text-[#237FEA]",
  DENY_USER: "bg-rose-500/10 text-rose-400",
  UPDATE_ROLE: "bg-amber-500/10 text-amber-400",
};

const BADGE_BASE =
  "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[0.75rem] uppercase tracking-wider";

export default function AuditLogsPage() {
  const { t } = useLanguage();
  const entries = useAuditLog();
  const [query, setQuery] = useState("");
  const [action, setAction] = useState("ALL");
  const [actor, setActor] = useState("ALL");

  const actors = useMemo(
    () => Array.from(new Set(entries.map((e) => e.actor))).sort(),
    [entries]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (action !== "ALL" && entry.action !== action) return false;
      if (actor !== "ALL" && entry.actor !== actor) return false;
      if (!q) return true;
      return [entry.actor, entry.actorEmail, entry.target, entry.details, entry.action]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [entries, query, action, actor]);

  return (
    <div>
      <PageHeader
        title="System Audit Logs"
        description="Track all administrative operations, reviews, and system modifications."
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("Search by entity, actor, or keyword…")}
          className="sm:max-w-xs"
        />
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className="sm:w-48">
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
        <Select value={actor} onValueChange={setActor}>
          <SelectTrigger className="sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("All actors")}</SelectItem>
            {actors.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-console border border-console-border bg-surface">
        {filtered.length === 0 ? (
          <EmptyState
            title="No audit entries"
            description="Nothing matches the current filters."
          />
        ) : (
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
              {filtered.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="whitespace-nowrap text-ink-muted">
                    {formatDateTime(entry.timestamp)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-ink">{entry.actor}</span>
                      {entry.actorEmail && (
                        <span className="text-xs text-ink-muted">{entry.actorEmail}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(BADGE_BASE, ACTION_BADGE[entry.action] ?? "bg-white/5 text-ink-muted")}
                    >
                      {entry.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-ink">{entry.target}</TableCell>
                  <TableCell className="text-ink-muted">{entry.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
