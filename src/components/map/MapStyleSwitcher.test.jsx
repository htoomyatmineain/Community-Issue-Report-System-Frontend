import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MapStyleSwitcher from "./MapStyleSwitcher";
import { MAP_STYLES } from "./useMapStyle";

describe("MapStyleSwitcher Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the switcher trigger button with active style name and EN badge", () => {
    render(<MapStyleSwitcher currentStyle="light" onSelectStyle={() => {}} />);

    const button = screen.getByRole("button", { name: /map style/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText("Light Mode")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
  });

  it("opens options cards when clicked showing Light, Dark, and Satellite modes", () => {
    render(<MapStyleSwitcher currentStyle="light" onSelectStyle={() => {}} />);

    const trigger = screen.getByRole("button", { name: /map style/i });
    fireEvent.click(trigger);

    expect(screen.getByText(/map options & layers/i)).toBeInTheDocument();
    expect(screen.getByText(/language set to/i)).toBeInTheDocument();

    // Check all 3 option cards are visible
    expect(screen.getByRole("button", { name: /light mode/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /dark mode/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /satellite/i })).toBeInTheDocument();
  });

  it("calls onSelectStyle with chosen style when an option card is clicked", () => {
    const handleSelect = vi.fn();
    render(<MapStyleSwitcher currentStyle="light" onSelectStyle={handleSelect} />);

    // Open options
    fireEvent.click(screen.getByRole("button", { name: /map style/i }));

    // Click Satellite option card
    const satelliteCard = screen.getByRole("button", { name: /satellite/i });
    fireEvent.click(satelliteCard);

    expect(handleSelect).toHaveBeenCalledWith("satellite");
  });

  it("closes the panel on Escape key", () => {
    render(<MapStyleSwitcher currentStyle="light" onSelectStyle={() => {}} />);

    // Open options
    fireEvent.click(screen.getByRole("button", { name: /map style/i }));
    expect(screen.getByText(/map options & layers/i)).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByText(/map options & layers/i)).not.toBeInTheDocument();
  });

  it("provides valid English tile URLs for all map styles", () => {
    expect(MAP_STYLES.light.url).toContain("cartocdn.com/rastertiles/voyager");
    expect(MAP_STYLES.dark.url).toContain("cartocdn.com/dark_all");
    expect(MAP_STYLES.satellite.url).toContain("arcgisonline.com");
    expect(MAP_STYLES.satellite.labelsUrl).toContain("cartocdn.com/rastertiles/voyager_only_labels");
  });
});
