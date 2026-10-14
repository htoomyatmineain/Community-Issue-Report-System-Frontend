import { describe, expect, it } from "vitest";
import {
  evaluateStaffReportSla,
  computeStaffDashboardAnalytics,
  STAFF_SLA_TARGETS_HOURS,
  computeMedian,
} from "./staffAnalytics";

describe("staffAnalytics", () => {
  it("evaluates urgent reports correctly against 24h SLA target", () => {
    const report = {
      id: 1,
      priority: "URGENT",
      createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), // 26h ago -> breached
      status: "ASSIGNED",
    };
    const sla = evaluateStaffReportSla(report);
    expect(sla.status).toBe("BREACHED");
    expect(sla.targetHours).toBe(STAFF_SLA_TARGETS_HOURS.URGENT);
    expect(sla.overdueHours).toBeGreaterThan(0);
  });

  it("marks reports nearing SLA deadline as AT_RISK", () => {
    const report = {
      id: 2,
      priority: "HIGH", // 48h target
      createdAt: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(), // 40h elapsed -> 8h left (<= 12h)
      status: "IN_PROGRESS",
    };
    const sla = evaluateStaffReportSla(report);
    expect(sla.status).toBe("AT_RISK");
  });

  it("computes median correctly for odd and even number arrays", () => {
    expect(computeMedian([10, 20, 30])).toBe(20);
    expect(computeMedian([10, 20, 30, 40])).toBe(25);
    expect(computeMedian([])).toBe(0);
  });

  it("computes overall staff DSS analytics payload", () => {
    const summary = {
      totalReports: 20,
      resolvedReports: 12,
      remainingReports: 8,
      newReports: 3,
      monthlySeries: [{ month: "Oct", reportCount: 20 }],
    };
    const reports = [
      {
        id: 101,
        title: "Burst Pipe",
        priority: "URGENT",
        status: "IN_PROGRESS",
        createdAt: new Date().toISOString(),
        categoryName: "Water Works",
      },
      {
        id: 102,
        title: "Pothole",
        priority: "NORMAL",
        status: "RESOLVED",
        createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
        categoryName: "Roads",
        feedback: { rating: 5 },
      },
    ];

    const analytics = computeStaffDashboardAnalytics({ summary, reports, pins: [] });

    expect(analytics.workload.totalActive).toBe(8);
    expect(analytics.csat.averageRating).toBe(5);
    expect(analytics.quality.firstTimeFixRate).toBeGreaterThan(0);
    expect(analytics.speed.medianHours).toBeGreaterThan(0);
    expect(analytics.escalationQueue.length).toBeGreaterThan(0);
    expect(analytics.monthlySeries.length).toBeGreaterThan(0);
  });
});
