import { Map } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NotificationBell from "@/components/common/NotificationBell";
import StatusBadge from "@/components/common/StatusBadge";
import { ISSUE_CATEGORIES, REPORT_STATUS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useCitizenMap } from "../hooks/useCitizenMap";

const FILTERS = [{ id: "all", label: "All" }, ...ISSUE_CATEGORIES];

export default function CitizenMapPage() {
  const { pins, isLoading, error, activeCategory, setActiveCategory, selectedPin, selectPin } =
    useCitizenMap();

  return (
    <div className="flex w-full max-w-md flex-col">
      <header className="flex items-center justify-between px-5 pb-2 pt-4">
        <h1 className="font-display text-lg font-bold text-foreground">Community map</h1>
        <NotificationBell />
      </header>

      <div className="flex gap-2 overflow-x-auto px-5 pb-3">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => {
              setActiveCategory(filter.id);
              selectPin(null);
            }}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-[13px] font-semibold",
              activeCategory === filter.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="relative h-[480px] w-full overflow-hidden bg-muted">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading map…
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center px-8 text-center text-sm text-destructive">
            {error}
          </div>
        ) : (
          <>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-10 text-center">
              <Map className="h-8 w-8 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Leaflet map — pins load from approved reports
              </p>
            </div>

            {pins.map((pin) => {
              const status = REPORT_STATUS[pin.status];
              return (
                <button
                  key={pin.id}
                  type="button"
                  aria-label={pin.title}
                  onClick={() => selectPin(pin.id)}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  className={cn(
                    "absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow",
                    status?.dotClass ?? "bg-muted-foreground"
                  )}
                />
              );
            })}
          </>
        )}

        {selectedPin && (
          <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2.5 rounded-lg border border-border bg-background p-4 shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-foreground">{selectedPin.title}</span>
              <StatusBadge status={selectedPin.status} />
            </div>
            <p className="text-xs text-muted-foreground">
              {ISSUE_CATEGORIES.find((c) => c.id === selectedPin.category)?.label} ·{" "}
              {selectedPin.address} · {selectedPin.reportedAgo}
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
