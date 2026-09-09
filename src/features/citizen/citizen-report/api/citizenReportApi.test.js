import { describe, it, expect, afterEach } from "vitest";
import { api } from "@/services/apiClient";
import { citizenReportApi } from "./citizenReportApi";

/**
 * api-standards.md § "Submit a report — duplicate check": POST /api/reports
 * can answer with a created report OR a DuplicateCheckResultDTO (nothing
 * persisted). submitReport() must normalise the two so the caller never
 * treats a duplicate prompt as a created report — that bug silently dropped
 * citizen reports before they ever reached the admin approval queue.
 */
describe("citizenReportApi.submitReport", () => {
  afterEach(() => {
    delete api.defaults.adapter;
  });

  const baseArgs = {
    categoryId: 1,
    description: "Streetlight out on Main St",
    latitude: 16.8,
    longitude: 96.15,
    photos: [],
  };

  function stubResponse(status, data) {
    let captured;
    api.defaults.adapter = async (config) => {
      captured = config;
      return { data, status, statusText: "OK", headers: {}, config };
    };
    return () => captured;
  }

  it("returns a CREATED outcome with the report on 201", async () => {
    stubResponse(201, { id: 42, status: "PENDING_APPROVAL" });

    const result = await citizenReportApi.submitReport(baseArgs);

    expect(result).toEqual({ outcome: "CREATED", report: { id: 42, status: "PENDING_APPROVAL" } });
  });

  it("returns a DUPLICATES_FOUND outcome when the backend answers with possibleDuplicates", async () => {
    stubResponse(200, {
      possibleDuplicates: [{ reportId: 7, reportCode: "R-007", title: "Light out", status: "ASSIGNED", distanceMeters: 12 }],
    });

    const result = await citizenReportApi.submitReport(baseArgs);

    expect(result.outcome).toBe("DUPLICATES_FOUND");
    expect(result.possibleDuplicates).toHaveLength(1);
    expect(result.report).toBeUndefined();
  });

  it("sends forceCreate / confirmDuplicateOfId in the JSON data part when provided", async () => {
    const getConfig = stubResponse(201, { id: 99 });

    await citizenReportApi.submitReport({ ...baseArgs, forceCreate: true });

    const dataPart = getConfig().data.get("data");
    const json = JSON.parse(await dataPart.text());
    expect(json.forceCreate).toBe(true);
    expect(json).not.toHaveProperty("confirmDuplicateOfId");
  });

  it("sends isAnonymous only when the citizen opts in", async () => {
    const getAnon = stubResponse(201, { id: 1 });
    await citizenReportApi.submitReport({ ...baseArgs, isAnonymous: true });
    const anonJson = JSON.parse(await getAnon().data.get("data").text());
    expect(anonJson.isAnonymous).toBe(true);

    const getPlain = stubResponse(201, { id: 2 });
    await citizenReportApi.submitReport({ ...baseArgs, isAnonymous: false });
    const plainJson = JSON.parse(await getPlain().data.get("data").text());
    expect(plainJson).not.toHaveProperty("isAnonymous");
  });
});
