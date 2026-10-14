import { useState, useRef, useEffect } from "react";
import { Moon, Globe, Check, Layers, X, Sparkles, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAP_STYLES } from "./useMapStyle";

/**
 * Visual miniature preview mockup for each map layer mode.
 */
function StylePreviewMockup({ styleId }) {
  if (styleId === "osm") {
    return (
      <div className="relative h-12 w-16 overflow-hidden rounded-md border border-slate-300 bg-[#f2efe9] shadow-inner">
        {/* River */}
        <div className="absolute -left-1 top-3 h-8 w-6 rotate-45 rounded-full bg-[#aad3df]" />
        {/* Park */}
        <div className="absolute right-1 top-1 h-5 w-7 rounded-sm bg-[#c8df9f]" />
        {/* Main Road */}
        <div className="absolute inset-x-0 top-6 h-1.5 bg-[#fcd6a4] border-y border-[#e2a868]" />
        {/* Cross Street */}
        <div className="absolute bottom-0 left-7 top-0 w-1 bg-white border-x border-[#dcd6c5]" />
      </div>
    );
  }

  if (styleId === "osm_dark") {
    return (
      <div className="relative h-12 w-16 overflow-hidden rounded-md border border-slate-700 bg-[#161a23] shadow-inner">
        {/* River */}
        <div className="absolute -left-1 top-3 h-8 w-6 rotate-45 rounded-full bg-[#0d2238]" />
        {/* Park */}
        <div className="absolute right-1 top-1 h-5 w-7 rounded-sm bg-[#16291a]" />
        {/* Main Road */}
        <div className="absolute inset-x-0 top-6 h-1.5 bg-[#3a4964] border-y border-[#52668a]" />
        {/* Cross Street */}
        <div className="absolute bottom-0 left-7 top-0 w-1 bg-[#263347] border-x border-[#435472]" />
      </div>
    );
  }

  // Satellite
  return (
    <div className="relative h-12 w-16 overflow-hidden rounded-md border border-emerald-900 bg-gradient-to-br from-[#1d2b1f] via-[#243322] to-[#14231b] shadow-inner">
      {/* Land vegetation texture */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3a5333_1px,transparent_1px)] [background-size:4px_4px]" />
      {/* Coast / Water */}
      <div className="absolute -left-2 top-4 h-9 w-7 rotate-45 rounded-full bg-[#0a1826]" />
      {/* Overlay English Road Line */}
      <div className="absolute inset-x-0 top-6 h-1 bg-[#ffdd67]/90 shadow-sm" />
      <div className="absolute bottom-0 left-7 top-0 w-0.5 bg-white/70" />
    </div>
  );
}

/**
 * Solid Interactive Map Style Switcher Card (No Glassmorphism)
 * Supported Modes:
 *  - OpenStreetMap (English)
 *  - Dark OpenStreetMap (English)
 *  - Satellite (Aerial + English Labels)
 */
export default function MapStyleSwitcher({
  currentStyle = "osm",
  onSelectStyle,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const activeConfig = MAP_STYLES[currentStyle] || MAP_STYLES.osm;

  const getStyleIcon = (styleId) => {
    switch (styleId) {
      case "osm_dark":
        return <Moon className="size-4 text-indigo-400" />;
      case "satellite":
        return <Globe className="size-4 text-emerald-400" />;
      case "osm":
      default:
        return <Map className="size-4 text-emerald-500" />;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-auto absolute z-[600]", className ?? "right-4 top-4")}
    >
      {/* Floating Solid Toggle Button (No Glassmorphism) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-2 rounded-xl border border-border bg-card dark:bg-[#1c1c1c] px-3.5 py-2 text-xs font-semibold text-foreground shadow-md transition-all hover:bg-surface-muted active:scale-95",
          isOpen && "ring-2 ring-primary/40 border-primary/50"
        )}
        aria-label="Map Style and Layer Options"
        title="Choose Map Style (OpenStreetMap in English, Dark OpenStreetMap, Satellite)"
      >
        <span className="flex items-center justify-center rounded-lg bg-surface-muted p-1 text-primary">
          <Layers className="size-4" />
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          {getStyleIcon(currentStyle)}
          <span>{activeConfig.name}</span>
        </span>
        <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
          {activeConfig.badge}
        </span>
      </button>

      {/* Options Cards Popover Panel: 100% Solid & Opaque (No Glassmorphism) */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-[340px] sm:w-[380px] animate-in fade-in-0 zoom-in-95 duration-150 rounded-2xl border border-border bg-card dark:bg-[#1c1c1c] p-3.5 shadow-2xl">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Layers className="size-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Map Options & Layers
                </h4>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Sparkles className="size-3 text-amber-500" />
                  Language set to <strong className="text-foreground">English (EN)</strong>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
              aria-label="Close options"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* 3 Selectable Option Cards */}
          <div className="space-y-2">
            {Object.values(MAP_STYLES).map((style) => {
              const isSelected = style.id === currentStyle;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => {
                    onSelectStyle(style.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "group relative flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-all hover:bg-surface-muted active:scale-[0.98]",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40"
                      : "border-border/70 bg-surface-muted/40 dark:bg-[#141414] hover:border-border"
                  )}
                >
                  {/* Miniature Graphic Preview */}
                  <StylePreviewMockup styleId={style.id} />

                  {/* Card Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                        {getStyleIcon(style.id)}
                        {style.name}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-medium tracking-wide",
                          isSelected
                            ? "bg-primary text-primary-foreground font-bold"
                            : "bg-surface-muted text-muted-foreground"
                        )}
                      >
                        {style.badge}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                      {style.description}
                    </p>
                  </div>

                  {/* Active Indicator Checkmark */}
                  {isSelected && (
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                      <Check className="size-3.5 stroke-[2.5]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Solid Micro Footer Note */}
          <div className="mt-3 flex items-center justify-between rounded-lg bg-surface-muted/70 px-2.5 py-1.5 text-[10px] text-muted-foreground">
            <span>🌐 Verified English place names & road labels</span>
            <span className="font-semibold text-foreground">Worldwide</span>
          </div>
        </div>
      )}
    </div>
  );
}
