import { Moon, Globe, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAP_STYLES } from "./useMapStyle";

/**
 * Sleek bottom-right icon set for 1-click map style switching.
 * Supported Modes:
 *  - Street: OpenStreetMap (English Edition)
 *  - Dark: Dark OpenStreetMap (English Edition)
 *  - Satellite: High-Res Aerial Imagery + English Labels
 */
export default function MapStyleSwitcher({
  currentStyle = "osm",
  onSelectStyle,
  className,
}) {
  const getStyleIcon = (styleId) => {
    switch (styleId) {
      case "osm_dark":
        return <Moon className="size-4" />;
      case "satellite":
        return <Globe className="size-4" />;
      case "osm":
      default:
        return <Map className="size-4" />;
    }
  };

  return (
    <div
      className={cn(
        "pointer-events-auto absolute z-[500] bottom-6 right-4 sm:bottom-6 sm:right-6",
        className
      )}
    >
      {/* Compact Solid Icon Set Toolbar (No Cards, No Dropdowns, 1-Click Instant) */}
      <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-card dark:bg-[#1c1c1c] p-1 shadow-lg backdrop-blur-none">
        {Object.values(MAP_STYLES).map((style) => {
          const isSelected = style.id === currentStyle;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all active:scale-95",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
              )}
              aria-label={`Switch to ${style.name}`}
              title={`${style.name} (${style.sublabel})`}
            >
              {getStyleIcon(style.id)}
              <span className="hidden sm:inline">{style.shortName || style.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
