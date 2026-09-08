import { Link } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import StatusBadge from "@/components/common/StatusBadge";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useCitizenHome } from "../hooks/useCitizenHome";
import NewsCampaignsCarousel from "./NewsCampaignsCarousel";
import CityReportsSection from "./CityReportsSection";

export default function CitizenHomePage() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useCitizenHome();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-7 px-5 pb-6 pt-4">
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">{t("News and Campaigns")}</h2>
        <NewsCampaignsCarousel />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">{t("What is happening in Yangon?")}</h2>
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
