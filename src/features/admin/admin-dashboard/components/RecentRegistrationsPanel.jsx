import { Link } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "—";

/** Admin dashboard panel — ui-rules.md: "10 most recent registrations", each linking to its account detail page to approve/deny. */
export default function RecentRegistrationsPanel({ registrations }) {
  const pending = (registrations ?? []).filter(
    (user) => !user.accountStatus || user.accountStatus === "PENDING",
  );

  return (
    <div className="flex-1 rounded-xl border border-console-border/70 bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold tracking-tight text-ink">Recent registrations</h2>
        <Link to="/admin/approvals" className="text-xs font-medium text-brand hover:underline">
          View all
        </Link>
      </div>

      <div className="mt-3">
        {!pending.length ? (
          <EmptyState title="No new registrations" description="New citizen signups will show up here." />
        ) : (
          <ul className="divide-y divide-console-border/60">
            {pending.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between gap-3 py-3 px-2 -mx-2 rounded-lg hover:bg-surface-muted/40 transition-colors"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-[13px] font-medium tracking-tight text-ink">{user.fullName}</span>
                  <span className="truncate text-xs text-ink-muted">
                    {user.email} · {formatDate(user.createdAt)}
                  </span>
                </div>
                <Button asChild size="sm" variant="outline" className="h-7 shrink-0 px-2.5 text-xs rounded-lg active:scale-95">
                  <Link to={`/admin/approvals/${user.id}`}>View Detail</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
