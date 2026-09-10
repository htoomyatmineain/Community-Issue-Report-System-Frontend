import { Link } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import StatusBadge from "@/components/common/StatusBadge";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useCitizenHome } from "../hooks/useCitizenHome";
import NewsCampaignsCarousel from "./NewsCampaignsCarousel";
import CityReportsSection from "./CityReportsSection";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "";

export default function CitizenHomePage() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useCitizenHome();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-7 px-5 pb-6 pt-4">
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">{t("News and Campaigns")}</h2>
        <NewsCampaignsCarousel />
      </section>

      <section className="-mx-5 flex flex-col gap-3 border-y border-border px-5 py-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground">
            {t("What is happening in Yangon?")}
          </h2>
          <Link to="/map" className="shrink-0 text-xs font-semibold text-primary">
            {t("View all")}
          </Link>
        </div>
        <CityReportsSection />
      </section>

      <section className="flex flex-col gap-2.5">
        <h2 className="text-sm font-semibold text-foreground">{t("Your Reports Status")}</h2>

        {isLoading ? (
          <p className="py-4 text-sm text-muted-foreground">{t("Loading…")}</p>
        ) : error ? (
          <p className="py-4 text-sm text-destructive">{error}</p>
        ) : !data?.recentReports?.length ? (
          <EmptyState
            title={t("No reports yet")}
            description={t("Reports you file will show up here.")}
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {data.recentReports.map((report) => (
              <li key={report.id}>
                <Link
                  to={`/report/${report.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="truncate text-[15px] font-bold text-foreground">
                      {report.categoryName}
                    </span>
                    <span className="truncate text-xs font-normal text-muted-foreground">
                      {formatDate(report.createdAt)}
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
