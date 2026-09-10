import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LoaderCircle, LocateFixed } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/common/StatusBadge";
import ReportMap from "@/components/map/ReportMap";
import { cn } from "@/lib/utils";
import { useReportMap } from "@/features/report-map";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useLanguage } from "@/app/providers/LanguageProvider";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function CitizenMapPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const { pins, isLoading, error, categories, categoryId, setCategoryId, selectedPin, selectedPinId, selectPin } =
    useReportMap({ publicPins: true });

  const geo = useGeolocation();
  const [focusLatLng, setFocusLatLng] = useState(null);

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
        {/* Category filter — floats over the map, no backdrop of its own */}
        <div className="absolute inset-x-0 top-0 z-[500] flex gap-2 overflow-x-auto scrollbar-none px-5 py-3">
          <button
            type="button"
            onClick={() => {
              setCategoryId("ALL");
              selectPin(null);
            }}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-[13px] font-semibold shadow-sm",
              categoryId === "ALL"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground"
            )}
          >
            {t("All")}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setCategoryId(String(c.id));
                selectPin(null);
              }}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-[13px] font-semibold shadow-sm",
                categoryId === String(c.id)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground"
              )}
            >
              {c.name}
            </button>
          ))}
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
            className="h-full"
          />
        )}

        {/* Self-Locate — bottom of the screen, within thumb reach */}
        <button
          type="button"
          onClick={geo.locate}
          disabled={geo.isLocating}
          className={cn(
            "absolute right-4 z-[600] flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-lg transition-all active:scale-95 disabled:opacity-70",
            selectedPin ? "bottom-[232px]" : "bottom-24"
          )}
        >
          {geo.isLocating ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <LocateFixed className="size-4 text-primary" />
          )}
          {t("Self-Locate")}
        </button>

        {selectedPin && (
          <div className="absolute inset-x-4 bottom-24 z-[1000] flex flex-col gap-2.5 rounded-lg border border-border bg-background p-4 shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-foreground">{selectedPin.categoryName}</span>
              <StatusBadge status={selectedPin.status} />
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedPin.anonymous || !selectedPin.reporterName
                ? t("Anonymous Citizen")
                : selectedPin.reporterName}{" "}
              · {formatDate(selectedPin.createdAt)}
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to={`/report/${selectedPin.id}`}>{t("View details")}</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
