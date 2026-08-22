import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NotificationBell from "@/components/common/NotificationBell";
import StatusBadge from "@/components/common/StatusBadge";
import ReportMap from "@/components/map/ReportMap";
import { cn } from "@/lib/utils";
import { useReportMap } from "@/features/report-map";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function CitizenMapPage() {
  const { pins, isLoading, error, categories, categoryId, setCategoryId, setBounds, selectedPin, selectedPinId, selectPin } =
    useReportMap();

  return (
    <div className="flex w-full max-w-md flex-col">
      <header className="flex items-center justify-between px-5 pb-2 pt-4">
        <h1 className="font-display text-lg font-bold text-foreground">Community map</h1>
        <NotificationBell />
      </header>

      <div className="flex gap-2 overflow-x-auto px-5 pb-3">
        <button
          type="button"
          onClick={() => {
            setCategoryId("ALL");
            selectPin(null);
          }}
          className={cn(
            "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-[13px] font-semibold",
            categoryId === "ALL"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-foreground"
          )}
        >
          All
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
              "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-[13px] font-semibold",
              categoryId === String(c.id)
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="relative h-[calc(100vh-11rem)] w-full overflow-hidden bg-muted">
        {isLoading && pins.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading map…
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
            onBoundsChange={setBounds}
            className="h-full"
          />
        )}

        {selectedPin && (
          <div className="absolute inset-x-4 bottom-4 z-[1000] flex flex-col gap-2.5 rounded-lg border border-border bg-background p-4 shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-foreground">{selectedPin.categoryName}</span>
              <StatusBadge status={selectedPin.status} />
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedPin.reportCode} · {formatDate(selectedPin.createdAt)}
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to={`/report/${selectedPin.id}`}>View details</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
