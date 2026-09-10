import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { citizenHomeApi } from "../api/citizenHomeApi";
import { useCityReports } from "./useCityReports";

vi.mock("../api/citizenHomeApi", () => ({
  citizenHomeApi: { getCityPulse: vi.fn() },
}));

/**
 * The city feed must stay current without a manual refresh: it re-pulls on a
 * timer and again whenever the tab regains focus, and a background refresh
 * never clears the feed that's already on screen.
 */
describe("useCityReports auto-refresh", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    citizenHomeApi.getCityPulse.mockReset();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const report = (id) => ({ id, title: `Report ${id}` });
  const flush = () => act(async () => { await vi.advanceTimersByTimeAsync(0); });

  it("loads once on mount, then re-pulls on the interval", async () => {
    citizenHomeApi.getCityPulse
      .mockResolvedValueOnce([report(1)])
      .mockResolvedValueOnce([report(2), report(1)]);

    const { result } = renderHook(() => useCityReports());
    await flush();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.reports).toEqual([report(1)]);

    await act(async () => { await vi.advanceTimersByTimeAsync(45_000); });

    expect(citizenHomeApi.getCityPulse).toHaveBeenCalledTimes(2);
    expect(result.current.reports).toEqual([report(2), report(1)]);
    expect(result.current.isLoading).toBe(false);
  });

  it("re-pulls when the tab regains focus", async () => {
    citizenHomeApi.getCityPulse.mockResolvedValue([report(1)]);

    renderHook(() => useCityReports());
    await flush();
    expect(citizenHomeApi.getCityPulse).toHaveBeenCalledTimes(1);

    await act(async () => {
      window.dispatchEvent(new Event("focus"));
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(citizenHomeApi.getCityPulse).toHaveBeenCalledTimes(2);
  });

  it("keeps the current feed when a background refresh fails", async () => {
    citizenHomeApi.getCityPulse
      .mockResolvedValueOnce([report(1)])
      .mockRejectedValueOnce(new Error("network"));

    const { result } = renderHook(() => useCityReports());
    await flush();
    expect(result.current.reports).toEqual([report(1)]);

    await act(async () => { await vi.advanceTimersByTimeAsync(45_000); });

    expect(result.current.reports).toEqual([report(1)]);
    expect(result.current.error).toBeNull();
  });
});
