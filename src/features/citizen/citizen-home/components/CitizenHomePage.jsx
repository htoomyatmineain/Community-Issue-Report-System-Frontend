import { Award, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";
import NotificationBell from "@/components/common/NotificationBell";
import StatusBadge from "@/components/common/StatusBadge";
import { useCitizenHome } from "../hooks/useCitizenHome";

export default function CitizenHomePage() {
  const { user } = useAuth();
  const { data, isLoading, error } = useCitizenHome();

  const fullName = user?.fullName ?? data?.citizen?.fullName ?? "Citizen";
  const firstName = fullName.split(" ")[0];

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 pb-6 pt-4">
      <header className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-display text-xl font-bold text-foreground">Hello, {firstName}</h1>
          <p className="text-xs text-muted-foreground">Let&apos;s make our community better.</p>
        </div>
        <NotificationBell count={data?.unreadNotifications ?? 0} />
      </header>

      <section className="flex items-center justify-between rounded-lg bg-primary p-6 text-primary-foreground">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-blue-100">Your score</span>
          <span className="font-display text-[26px] font-bold leading-none">
            {isLoading ? "…" : `${(data?.score?.points ?? 0).toLocaleString()} pts`}
          </span>
          <span className="text-[11px] text-blue-100">
            Ranked #{data?.score?.leaderboardRank ?? "—"} on the leaderboard
          </span>
        </div>
        <Award className="h-9 w-9 shrink-0 text-white" />
      </section>

      <Button asChild size="lg" className="w-full gap-2 text-base">
        <Link to="/report">
          <Plus className="h-4 w-4" />
          Report an issue
        </Link>
      </Button>

      <section className="flex flex-col gap-2.5">
        <h2 className="text-sm font-semibold text-foreground">Your recent reports</h2>

        {isLoading ? (
          <p className="py-4 text-sm text-muted-foreground">Loading…</p>
        ) : error ? (
          <p className="py-4 text-sm text-destructive">{error}</p>
        ) : !data?.recentReports?.length ? (
          <EmptyState
            title="No reports yet"
            description="Reports you file will show up here."
          />
        ) : (
          <ul>
            {data.recentReports.map((report) => (
              <li key={report.id} className="border-b border-border last:border-0">
                <Link
                  to={`/report/${report.id}`}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-[13px] font-semibold text-foreground">
                      {report.title}
                    </span>
                    <span className="truncate text-[11px] text-muted-foreground">
                      {report.category} · {report.reportCode}
                    </span>
                  </div>
                  <StatusBadge status={report.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
