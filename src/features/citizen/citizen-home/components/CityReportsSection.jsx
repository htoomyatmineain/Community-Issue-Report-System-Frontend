import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Heart, ImageOff, MapPin, VenetianMask } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import PriorityBadge from "@/components/common/PriorityBadge";
import { categoryIcon } from "@/lib/categoryIcons";
import { cn } from "@/lib/utils";
import { assetUrl } from "@/lib/assetUrl";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useCityReports } from "../hooks/useCityReports";
import { useCommunitySupport } from "../hooks/useCommunitySupport";
import { escalatedPriority, reportScore } from "../supportEngine";

// The section only ever teases the feed — "View all" (CitizenHomePage) takes
// the citizen to the full map for the rest.
const MAX_VISIBLE = 3;

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

function ReportImage({ src, alt, color, className }) {
  const [broken, setBroken] = useState(false);
  const resolved = assetUrl(src);
  if (!resolved || broken) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border border-border bg-muted",
          className
        )}
        style={color ? { borderColor: `${color}33` } : undefined}
      >
        <ImageOff className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }
  return (
    <img
      src={resolved}
      alt={alt}
      loading="lazy"
      onError={() => setBroken(true)}
      className={cn("rounded-lg border border-border object-cover", className)}
    />
  );
}

function CardSkeleton() {
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <div className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />
        <div className="flex flex-col gap-1">
          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
          <div className="h-2.5 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="flex gap-3">
        <div className="size-24 shrink-0 animate-pulse rounded-lg bg-muted" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="h-7 w-full animate-pulse rounded-full bg-muted" />
    </li>
  );
}

export default function CityReportsSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { reports, isLoading, error } = useCityReports();
  const { isSupported, isPending, toggleSupport } = useCommunitySupport();
  // The feed snapshot's supportCount goes stale the moment a toggle succeeds —
  // this overlays the server's fresh count from that response until the next fetch.
  const [countOverrides, setCountOverrides] = useState({});

  async function handleSupport(report) {
    const result = await toggleSupport(report.id);
    if (result.ok) {
      if (typeof result.supportCount === "number") {
        setCountOverrides((prev) => ({ ...prev, [report.id]: result.supportCount }));
      }
      if (result.removed) {
        toast(t("Support removed"));
      } else {
        toast.success(
          t("You earned +{points} points for supporting this report", { points: result.reward })
        );
      }
      return;
    }
    if (result.reason === "PENDING") return;
    if (result.reason === "LIMIT_REACHED") {
      toast.error(t("Daily limit reached: You can only support 5 reports per day"));
    } else if (result.reason === "ALREADY_SUPPORTED" || result.reason === "NOT_SUPPORTED") {
      // Local red state drifted from the server; it's now reconciled — no toast.
    } else {
      toast.error(result.message ?? t("Could not update your support. Please try again."));
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
      {reports.slice(0, MAX_VISIBLE).map((report) => {
        const supported = isSupported(report.id);
        // The server's real, shared count — not a per-viewer local tally —
        // overlaid with this session's freshest known value once a toggle succeeds.
        const votes = countOverrides[report.id] ?? report.supportCount ?? 0;
        // Score drives priority escalation only — it is never shown on the card.
        const priority = escalatedPriority(report, reportScore(report, votes));
        const reporter = report.reporterName?.trim();
        const isAnon = report.anonymous || !reporter;

        return (
          <li
            key={report.id}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/map?focus=${report.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") navigate(`/map?focus=${report.id}`);
            }}
            className="flex cursor-pointer flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-all duration-150 hover:border-border active:scale-[0.99]"
          >
            {/* Reporter (name + date) · urgency */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-start gap-2">
                {isAnon ? (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <VenetianMask className="size-4" />
                  </span>
                ) : (
                  <Avatar name={reporter} size="sm" />
                )}
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-[13px] font-semibold text-foreground">
                    {isAnon ? t("Anonymous Citizen") : reporter}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {relativeTime(report.createdAt)}
                  </span>
                </div>
              </div>
              <PriorityBadge priority={priority} />
            </div>

            {/* Image · category + description */}
            <div className="flex gap-3">
              <ReportImage
                src={report.imageUrl}
                alt={report.categoryName || ""}
                color={report.categoryColor}
                className="size-24 shrink-0 rounded-xl"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span
                  className="flex w-fit items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold"
                  style={{
                    color: report.categoryColor ?? undefined,
                    borderColor: report.categoryColor ? `${report.categoryColor}55` : undefined,
                    backgroundColor: report.categoryColor ? `${report.categoryColor}14` : undefined,
                  }}
                >
                  {(() => {
                    const CatIcon = categoryIcon(report);
                    return <CatIcon className="size-3 shrink-0" />;
                  })()}
                  {report.categoryName}
                </span>
                {report.description && (
                  <span className="line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
                    {report.description}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSupport(report);
                }}
                disabled={isPending(report.id)}
                aria-pressed={supported}
                title={supported ? t("Tap to remove your support") : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60",
                  supported
                    ? "border-rose-600 bg-rose-600 text-white shadow-sm hover:bg-rose-700 dark:border-rose-500 dark:bg-rose-500 dark:hover:bg-rose-600"
                    : "border-border text-rose-600 hover:bg-rose-500/5 dark:text-rose-400"
                )}
              >
                <Heart className={cn("size-3.5", supported && "fill-current")} />
                {supported ? t("Supported") : t("Support")}
                <span
                  className={cn(
                    "tabular-nums",
                    supported ? "text-white/80" : "text-rose-600/70 dark:text-rose-400/70"
                  )}
                >
                  {votes}
                </span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/map?focus=${report.id}`);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-primary px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
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
