import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MapStyleSwitcher from "./MapStyleSwitcher";
import { MAP_STYLES } from "./useMapStyle";

describe("MapStyleSwitcher Component (Bottom-Right Icon Set)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all 3 map style icon buttons directly in the toolbar", () => {
    render(<MapStyleSwitcher currentStyle="osm" onSelectStyle={() => {}} />);

    expect(screen.getByRole("button", { name: /switch to openstreetmap/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /switch to dark openstreetmap/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /switch to satellite/i })).toBeInTheDocument();
  });

  it("calls onSelectStyle with chosen style when an icon button is clicked", () => {
    const handleSelect = vi.fn();
    render(<MapStyleSwitcher currentStyle="osm" onSelectStyle={handleSelect} />);

    // Click Dark OpenStreetMap icon button
    const darkBtn = screen.getByRole("button", { name: /switch to dark openstreetmap/i });
    fireEvent.click(darkBtn);
    expect(handleSelect).toHaveBeenCalledWith("osm_dark");

    // Click Satellite icon button
    const satBtn = screen.getByRole("button", { name: /switch to satellite/i });
    fireEvent.click(satBtn);
    expect(handleSelect).toHaveBeenCalledWith("satellite");
  });

  it("provides valid keyless tile URLs and clean thin font layers without watermarks", () => {
    // Street OSM: uses clean light gray reference with no thick border
    expect(MAP_STYLES.osm.url).toContain("tile.openstreetmap.org");
    expect(MAP_STYLES.osm.labelsUrl).toContain("World_Light_Gray_Reference");

    // Dark OSM: uses clean dark gray reference with no thick border
    expect(MAP_STYLES.osm_dark.url).toContain("tile.openstreetmap.org");
    expect(MAP_STYLES.osm_dark.labelsUrl).toContain("World_Dark_Gray_Reference");
    expect(MAP_STYLES.osm_dark.tileClassName).toBe("osm-dark-tiles");

    // Satellite: high-res imagery + reference
    expect(MAP_STYLES.satellite.url).toContain("World_Imagery");
    expect(MAP_STYLES.satellite.labelsUrl).toContain("World_Boundaries_and_Places");
  });
});
