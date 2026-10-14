import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MapStyleSwitcher from "./MapStyleSwitcher";
import { MAP_STYLES } from "./useMapStyle";

describe("MapStyleSwitcher Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the switcher trigger button with active style name and English badge", () => {
    render(<MapStyleSwitcher currentStyle="osm" onSelectStyle={() => {}} />);

    const button = screen.getByRole("button", { name: /map style/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText("OpenStreetMap")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("opens options cards when clicked showing OpenStreetMap, Dark OSM, and Satellite modes", () => {
    render(<MapStyleSwitcher currentStyle="osm" onSelectStyle={() => {}} />);

    const trigger = screen.getByRole("button", { name: /map style/i });
    fireEvent.click(trigger);

    expect(screen.getByText(/map options & layers/i)).toBeInTheDocument();
    expect(screen.getByText(/language set to/i)).toBeInTheDocument();

    // Check all 3 option cards are visible by their unique descriptions
    expect(screen.getByText("Classic OpenStreetMap with English street & place labels")).toBeInTheDocument();
    expect(screen.getByText("Sleek dark OpenStreetMap with clear English labels")).toBeInTheDocument();
    expect(screen.getByText("High-resolution satellite view with English roads & boundaries")).toBeInTheDocument();
  });

  it("calls onSelectStyle with chosen style when an option card is clicked", () => {
    const handleSelect = vi.fn();
    render(<MapStyleSwitcher currentStyle="osm" onSelectStyle={handleSelect} />);

    // Open options
    fireEvent.click(screen.getByRole("button", { name: /map style/i }));

    // Click Dark OpenStreetMap option card
    const darkCard = screen.getByText("Dark OpenStreetMap").closest("button");
    fireEvent.click(darkCard);

    expect(handleSelect).toHaveBeenCalledWith("osm_dark");
  });

  it("closes the panel on Escape key", () => {
    render(<MapStyleSwitcher currentStyle="osm" onSelectStyle={() => {}} />);

    // Open options
    fireEvent.click(screen.getByRole("button", { name: /map style/i }));
    expect(screen.getByText(/map options & layers/i)).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByText(/map options & layers/i)).not.toBeInTheDocument();
  });

  it("provides valid keyless tile URLs for all map styles without watermarks", () => {
    expect(MAP_STYLES.osm.url).toContain("tile.openstreetmap.org");
    expect(MAP_STYLES.osm.labelsUrl).toContain("Reference/World_Boundaries_and_Places");
    expect(MAP_STYLES.osm_dark.url).toContain("tile.openstreetmap.org");
    expect(MAP_STYLES.osm_dark.tileClassName).toBe("osm-dark-tiles");
    expect(MAP_STYLES.osm_dark.labelsClassName).toBe("osm-dark-labels");
    expect(MAP_STYLES.satellite.url).toContain("arcgisonline.com/ArcGIS/rest/services/World_Imagery");
    expect(MAP_STYLES.satellite.labelsUrl).toContain("Reference/World_Boundaries_and_Places");
  });
});
