import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Heart, LoaderCircle, LocateFixed } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/common/StatusBadge";
import ReportMap from "@/components/map/ReportMap";
import { categoryIcon } from "@/lib/categoryIcons";
import { cn } from "@/lib/utils";
import { useReportMap } from "@/features/report-map";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useCommunitySupport } from "@/features/citizen/citizen-home/hooks/useCommunitySupport";
import { useLanguage } from "@/app/providers/LanguageProvider";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

const STATUS_FILTERS = [
  { value: "ALL", label: "All" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
];

export default function CitizenMapPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const {
    pins,
    isLoading,
    error,
    categories,
    categoryId,
    setCategoryId,
    status,
    setStatus,
    selectedPin,
    selectedPinId,
    selectPin,
  } = useReportMap({ publicPins: true });

  const geo = useGeolocation();
  const [focusLatLng, setFocusLatLng] = useState(null);
  const { isSupported, isPending, toggleSupport } = useCommunitySupport();
  const [countOverrides, setCountOverrides] = useState({});
  // Bumped on every status-filter tap so ReportMap zooms out to reframe
  // whichever pins the new filter leaves, instead of keeping the old viewport.
  const [statusFitSignal, setStatusFitSignal] = useState(0);

  async function handleSupport(pin) {
    const result = await toggleSupport(pin.id);
    if (result.ok) {
      if (typeof result.supportCount === "number") {
        setCountOverrides((prev) => ({ ...prev, [pin.id]: result.supportCount }));
      }
      toast(
        result.removed
          ? t("Support removed")
          : t("You earned +{points} points for supporting this report", { points: result.reward })
      );
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

  // Deep link from "What's happening in Yangon" — /map?focus=<reportId>.
  useEffect(() => {
    const focus = searchParams.get("focus");
    if (focus) selectPin(Number(focus));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // A fresh object each fix so ReportMapImpl re-centres even on repeat taps.
  useEffect(() => {
    if (geo.position) {
      setFocusLatLng({ lat: geo.position.latitude, lng: geo.position.longitude });
    }
  }, [geo.position]);

  useEffect(() => {
    if (geo.error) toast.error(geo.error);
  }, [geo.error]);

  return (
    <div className="fixed inset-0 z-30 mx-auto flex w-full max-w-md flex-col bg-background pt-14">
      <div className="relative min-h-0 w-full flex-1 overflow-hidden bg-muted">
        {/* Category + status filters — float over the map, no backdrop of their own */}
        <div className="absolute inset-x-0 top-0 z-[500] flex flex-col gap-2 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-none px-5">
            <button
              type="button"
              onClick={() => {
                setCategoryId("ALL");
                selectPin(null);
              }}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-lg border px-3.5 py-2 text-[13px] font-semibold shadow-sm",
                categoryId === "ALL"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground"
              )}
            >
              {t("All")}
            </button>
            {categories.map((c) => {
              const CatIcon = categoryIcon(c);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCategoryId(String(c.id));
                    selectPin(null);
                  }}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3.5 py-2 text-[13px] font-semibold shadow-sm",
                    categoryId === String(c.id)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground"
                  )}
                >
                  <CatIcon
                    className="size-3.5 shrink-0"
                    style={categoryId === String(c.id) ? undefined : { color: c.colorHex ?? undefined }}
                  />
                  {c.name}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-none px-5">
            {STATUS_FILTERS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setStatus(opt.value);
                  selectPin(null);
                  setStatusFitSignal((s) => s + 1);
                }}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-lg border px-3.5 py-2 text-[13px] font-semibold shadow-sm",
                  status === opt.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground"
                )}
              >
                {t(opt.label)}
              </button>
            ))}
          </div>
        </div>

        {isLoading && pins.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {t("Loading…")}
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center px-8 text-center text-sm text-destructive">
            {error}
          </div>
        ) : (
          <ReportMap
            pins={pins}
            selectedPinId={selectedPinId}
            onPinClick={(pin) => selectPin(pin.id)}
            zoomControl={false}
            focusLatLng={focusLatLng}
            fitSignal={statusFitSignal}
            switcherClassName="top-32 right-4 sm:top-28 sm:right-6"
            className="h-full"
          />
        )}

        {/* Self-Locate + selected-pin card — one bottom-anchored column so a
            real gap (gap-3) separates them regardless of the card's height. */}
        <div className="absolute inset-x-4 bottom-24 z-[600] flex flex-col items-end gap-3">
          <button
            type="button"
            onClick={geo.locate}
            disabled={geo.isLocating}
            className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-lg transition-all active:scale-95 disabled:opacity-70"
          >
            {geo.isLocating ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <LocateFixed className="size-4 text-primary" />
            )}
            {t("Self-Locate")}
          </button>

          {selectedPin && (
            <div className="flex w-full flex-col gap-2.5 rounded-lg border border-border bg-background p-4 shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                  {(() => {
                    const CatIcon = categoryIcon(selectedPin);
                    return (
                      <CatIcon
                        className="size-4 shrink-0"
                        style={{ color: selectedPin.categoryColor ?? undefined }}
                      />
                    );
                  })()}
                  {selectedPin.categoryName}
                </span>
                <StatusBadge status={selectedPin.status} />
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedPin.anonymous || !selectedPin.reporterName
                  ? t("Anonymous Citizen")
                  : selectedPin.reporterName}{" "}
                · {formatDate(selectedPin.createdAt)}
              </p>
              <div className="flex items-center gap-2">
                {selectedPin.status === "ASSIGNED" &&
                  (() => {
                    const supported = isSupported(selectedPin.id);
                    const votes = countOverrides[selectedPin.id] ?? selectedPin.supportCount ?? 0;
                    return (
                      <button
                        type="button"
                        onClick={() => handleSupport(selectedPin)}
                        disabled={isPending(selectedPin.id)}
                        aria-pressed={supported}
                        title={supported ? t("Tap to remove your support") : undefined}
                        className={cn(
                          "flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-60",
                          supported
                            ? "border-rose-600 bg-rose-600 text-white hover:bg-rose-700 dark:border-rose-500 dark:bg-rose-500 dark:hover:bg-rose-600"
                            : "border-border text-rose-600 hover:bg-rose-500/5 dark:text-rose-400"
                        )}
                      >
                        <Heart className={cn("size-4", supported && "fill-current")} />
                        {supported ? t("Supported") : t("Support")}
                        <span className={cn("tabular-nums", supported ? "text-white/80" : "text-rose-600/70 dark:text-rose-400/70")}>
                          {votes}
                        </span>
                      </button>
                    );
                  })()}
                <Button asChild className="flex-1">
                  <Link to={`/report/${selectedPin.id}`}>{t("View details")}</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
