import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { api } from "@/services/apiClient";
import { useCommunitySupport } from "./useCommunitySupport";

/**
 * The reversible feed "Support" toggle must move the supporter's leaderboard
 * score by exactly +3 on support and −3 on withdrawal — and net to zero over
 * any number of toggles. These tests pin that vice-versa contract against the
 * ReportSupportResultDTO shape the backend returns from
 * POST / DELETE `/api/reports/{id}/support`.
 */
describe("useCommunitySupport toggle", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    delete api.defaults.adapter;
    localStorage.clear();
  });

  // Fakes both endpoints off a running score: POST => +3, DELETE => −3.
  function stubEndpoints({ startTotal = 0, startCount = 7 } = {}) {
    let total = startTotal;
    let count = startCount;
    const calls = [];
    api.defaults.adapter = async (config) => {
      const adding = config.method.toLowerCase() === "post";
      calls.push(adding ? "POST" : "DELETE");
      total += adding ? 3 : -3;
      count += adding ? 1 : -1;
      return {
        data: {
          supportCount: count,
          awardedPoints: adding ? 3 : -3,
          totalPoints: total,
          remainingToday: adding ? 4 : 5,
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };
    return () => calls;
  }

  const render = () => renderHook(() => useCommunitySupport(), { wrapper: AuthProvider });

  it("first click backs the report and reports +3", async () => {
    stubEndpoints();
    const { result } = render();

    let outcome;
    await act(async () => {
      outcome = await result.current.toggleSupport(11);
    });

    expect(outcome).toMatchObject({ ok: true, removed: false, reward: 3, totalPoints: 3 });
    expect(result.current.isSupported(11)).toBe(true);
  });

  it("second click withdraws it and reports −3, returning to the start", async () => {
    const getCalls = stubEndpoints({ startTotal: 0 });
    const { result } = render();

    await act(async () => {
      await result.current.toggleSupport(11);
    });
    let removal;
    await act(async () => {
      removal = await result.current.toggleSupport(11);
    });

    expect(removal).toMatchObject({ ok: true, removed: true, reward: 3, totalPoints: 0 });
    expect(result.current.isSupported(11)).toBe(false);
    expect(getCalls()).toEqual(["POST", "DELETE"]);
  });

  it("nets to zero over four toggles", async () => {
    stubEndpoints({ startTotal: 0 });
    const { result } = render();

    for (let i = 0; i < 4; i++) {
      // eslint-disable-next-line no-await-in-loop
      await act(async () => {
        await result.current.toggleSupport(11);
      });
    }

    expect(result.current.isSupported(11)).toBe(false);
  });

  it("keeps the red state across a remount (localStorage-backed)", async () => {
    stubEndpoints();
    const first = render();
    await act(async () => {
      await first.result.current.toggleSupport(11);
    });

    const second = render();
    expect(second.result.current.isSupported(11)).toBe(true);
  });

  it("rolls the optimistic flip back when the request fails", async () => {
    api.defaults.adapter = async () => {
      const err = new Error("boom");
      err.response = { status: 500, data: {} };
      throw err;
    };
    const { result } = render();

    let outcome;
    await act(async () => {
      outcome = await result.current.toggleSupport(11);
    });

    expect(outcome).toMatchObject({ ok: false, reason: "ERROR" });
    expect(result.current.isSupported(11)).toBe(false);
  });

  it("blocks a 6th support in the same day without moving the score", async () => {
    api.defaults.adapter = async () => {
      const err = new Error("Request failed with status code 400");
      err.response = { status: 400, data: { message: "Daily limit reached" } };
      throw err;
    };
    const { result } = render();

    let outcome;
    await act(async () => {
      outcome = await result.current.toggleSupport(11);
    });

    expect(outcome).toEqual({ ok: false, reason: "LIMIT_REACHED" });
    expect(result.current.isSupported(11)).toBe(false);
  });
});
