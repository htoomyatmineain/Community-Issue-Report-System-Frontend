import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Heart, MapPin } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useCityReports } from "../hooks/useCityReports";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "";

export default function CityReportsSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { reports, isLoading, error } = useCityReports();
  // Client-only for now — no endorse/support endpoint on the backend yet.
  const [supported, setSupported] = useState({});

  function toggleSupport(id) {
    setSupported((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) toast(t("Thanks for supporting this report"));
      return next;
    });
  }

  if (isLoading) {
    return <p className="py-4 text-sm text-muted-foreground">{t("Loading…")}</p>;
  }
  if (error) {
    return <p className="py-4 text-sm text-destructive">{error}</p>;
  }
  if (!reports.length) {
    return <p className="py-4 text-sm text-muted-foreground">{t("No reports to show yet")}</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {reports.map((report) => {
        const isSupported = !!supported[report.id];
        return (
          <li
            key={report.id}
            className="flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-semibold text-muted-foreground">
                {report.categoryName}
              </span>
              <StatusBadge status={report.status} />
            </div>

            <Link to={`/report/${report.id}`} className="flex flex-col gap-1">
              {report.title && (
                <span className="text-[13px] font-semibold leading-snug text-foreground">
                  {report.title}
                </span>
              )}
              {report.description && (
                <span className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                  {report.description}
                </span>
              )}
            </Link>

            <span className="truncate text-[11px] text-muted-foreground">
              {report.addressText ? `${report.addressText} · ` : ""}
              {report.reportCode} · {formatDate(report.createdAt)}
            </span>

            <div className="mt-0.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleSupport(report.id)}
                aria-pressed={isSupported}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors dark:text-rose-400",
                  isSupported
                    ? "border-rose-500 bg-rose-500/10"
                    : "border-border hover:bg-rose-500/5"
                )}
              >
                <Heart className={cn("size-3.5", isSupported && "fill-current")} />
                {isSupported ? t("Supported") : t("Support")}
              </button>

              <button
                type="button"
                onClick={() => navigate(`/map?focus=${report.id}`)}
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                <MapPin className="size-3.5" />
                {t("View Location")}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
