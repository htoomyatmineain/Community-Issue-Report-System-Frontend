import { Link } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "—";

/** Admin dashboard panel — ui-rules.md: "10 most recent registrations", each linking to its account detail page to approve/deny. */
export default function RecentRegistrationsPanel({ registrations }) {
  // Only accounts still awaiting a decision belong here. The API scopes this
  // list to PENDING; keep a guard so a stale response can't show a "View
  // Detail" link for an already-approved citizen.
  const pending = (registrations ?? []).filter(
    (user) => !user.accountStatus || user.accountStatus === "PENDING",
  );

  return (
    <div className="flex-1 rounded-console border border-console-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-bold text-ink">Recent registrations</h2>
        <Link to="/admin/approvals" className="text-xs font-semibold text-brand hover:underline">
          View all
        </Link>
      </div>

      <div className="mt-4">
        {!pending.length ? (
          <EmptyState title="No new registrations" description="New citizen signups will show up here." />
        ) : (
          <ul>
            {pending.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between gap-3 border-b border-console-border py-3 last:border-0"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-[13px] font-semibold text-ink">{user.fullName}</span>
                  <span className="truncate text-xs text-ink-muted">
                    {user.email} · {formatDate(user.createdAt)}
                  </span>
                </div>
                <Button asChild size="sm" variant="outline" className="shrink-0">
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
