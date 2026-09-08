import { Award, Plus, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";
import Avatar from "@/components/common/Avatar";
import StatusBadge from "@/components/common/StatusBadge";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useCitizenHome } from "../hooks/useCitizenHome";

export default function CitizenHomePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { data, isLoading, error } = useCitizenHome();

  const fullName = user?.fullName ?? data?.citizen?.fullName ?? "Citizen";

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 pb-6 pt-4">
      <header className="flex items-center justify-between gap-3">
        <img
          src="/assets/Kinn Htout Logo.png"
          alt="Kinn Htout"
          className="h-14 w-auto min-w-0 max-w-full object-contain object-left"
        />
        <div className="flex shrink-0 items-center gap-1">
          <Link
            to="/settings"
            aria-label={t("Settings")}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
          >
            <Settings className="size-5" />
          </Link>
          <Link
            to="/profile"
            aria-label={t("My profile")}
            className="flex shrink-0 items-center justify-center rounded-full transition-transform active:scale-95"
          >
            <Avatar name={fullName} size="sm" />
          </Link>
        </div>
      </header>

      <Link
        to="/score"
        className="flex items-center justify-between rounded-lg bg-primary p-6 text-primary-foreground"
      >
        <div className="flex flex-col gap-1">
          <span className="text-xs text-cyan-100">{t("Your score")}</span>
          <span className="font-display text-[26px] font-bold leading-none">
            {isLoading ? "…" : `${(data?.score?.points ?? 0).toLocaleString()} pts`}
          </span>
          <span className="text-[11px] text-cyan-100">
            Ranked #{data?.score?.leaderboardRank ?? "—"} on the leaderboard
          </span>
        </div>
        <Award className="h-9 w-9 shrink-0 text-white" />
      </Link>

      <Button asChild variant="highlight" size="lg" className="w-full gap-2 text-base">
        <Link to="/report">
          <Plus className="h-4 w-4" />
          {t("Report an issue")}
        </Link>
      </Button>

      <section className="flex flex-col gap-2.5">
        <h2 className="text-sm font-semibold text-foreground">{t("Your recent reports")}</h2>

        {isLoading ? (
          <p className="py-4 text-sm text-muted-foreground">Loading…</p>
        ) : error ? (
          <p className="py-4 text-sm text-destructive">{error}</p>
        ) : !data?.recentReports?.length ? (
          <EmptyState
            title={t("No reports yet")}
            description={t("Reports you file will show up here.")}
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
                      {report.categoryName} · {report.reportCode}
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
