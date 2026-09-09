import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Heart, ImageOff, MapPin, VenetianMask } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import StatusBadge from "@/components/common/StatusBadge";
import PriorityBadge from "@/components/common/PriorityBadge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useCityReports } from "../hooks/useCityReports";
import { useCommunitySupport } from "../hooks/useCommunitySupport";
import { escalatedPriority, reportScore, supportCount } from "../supportEngine";

const relativeTime = (iso) => {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

function ReportImage({ src, alt, color }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div
        className="flex h-36 w-full items-center justify-center rounded-lg border border-border bg-muted"
        style={color ? { borderColor: `${color}33` } : undefined}
      >
        <ImageOff className="size-6 text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setBroken(true)}
      className="h-36 w-full rounded-lg border border-border object-cover"
    />
  );
}

function CardSkeleton() {
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <div className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />
        <div className="h-3 w-28 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-36 w-full animate-pulse rounded-lg bg-muted" />
      <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
      <div className="h-3 w-full animate-pulse rounded bg-muted" />
      <div className="h-7 w-40 animate-pulse rounded-full bg-muted" />
    </li>
  );
}

export default function CityReportsSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { reports, isLoading, error } = useCityReports();
  const { isSupported, support } = useCommunitySupport();

  function handleSupport(report) {
    const result = support(report.id);
    if (result.ok) {
      toast.success(
        t("You earned +{points} points for supporting this report", { points: result.reward })
      );
      return;
    }
    if (result.reason === "LIMIT_REACHED") {
      toast.error(t("Daily limit reached: You can only support 5 reports per day"));
    } else {
      toast(t("You already supported this report"));
    }
  }

  if (isLoading) {
    return (
      <ul className="flex flex-col gap-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </ul>
    );
  }

  if (error) {
    return <p className="py-4 text-sm text-destructive">{t("Failed to load the community feed")}</p>;
  }

  if (!reports.length) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        {t("No active issues reported right now")}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {reports.map((report) => {
        const supported = isSupported(report.id);
        const extra = supported ? 1 : 0;
        const score = reportScore(report, extra);
        const priority = escalatedPriority(report, score);
        const votes = supportCount(report, extra);
        const reporter = report.reporterName?.trim();
        const isAnon = report.anonymous || !reporter;

        return (
          <li
            key={report.id}
            className="flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            {/* Reporter + status */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                {isAnon ? (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <VenetianMask className="size-4" />
                  </span>
                ) : (
                  <Avatar name={reporter} size="sm" />
                )}
                <span className="truncate text-[13px] font-semibold text-foreground">
                  {isAnon ? t("Anonymous Citizen") : reporter}
                </span>
              </div>
              <StatusBadge status={report.status} />
            </div>

            <ReportImage
              src={report.imageUrl}
              alt={report.title || report.categoryName || ""}
              color={report.categoryColor}
            />

            {/* Category tag */}
            <span
              className="w-fit rounded-full border px-2 py-0.5 text-[11px] font-semibold"
              style={{
                color: report.categoryColor ?? undefined,
                borderColor: report.categoryColor ? `${report.categoryColor}55` : undefined,
                backgroundColor: report.categoryColor ? `${report.categoryColor}14` : undefined,
              }}
            >
              {report.categoryName}
            </span>

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
              {relativeTime(report.createdAt)}
              {report.reportCode ? ` · ${report.reportCode}` : ""}
            </span>

            {/* Score / priority */}
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground">
                {t("Score")} {score}
              </span>
              <PriorityBadge priority={priority} />
            </div>

            {/* Actions */}
            <div className="mt-0.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSupport(report)}
                disabled={supported}
                aria-pressed={supported}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors dark:text-rose-400",
                  supported
                    ? "border-rose-500 bg-rose-500/10"
                    : "border-border hover:bg-rose-500/5"
                )}
              >
                <Heart className={cn("size-3.5", supported && "fill-current")} />
                {supported ? t("Supported") : t("Support")}
                <span className="tabular-nums text-rose-600/70 dark:text-rose-400/70">
                  {votes}
                </span>
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
