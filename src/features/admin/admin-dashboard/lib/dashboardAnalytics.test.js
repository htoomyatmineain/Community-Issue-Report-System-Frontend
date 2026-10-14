import { describe, expect, it } from "vitest";
import {
  computeMedian,
  evaluateReportSla,
  analyzeSlaPerformance,
  analyzeResolutionSpeed,
  analyzeDepartmentWorkload,
  analyzeCitizenSatisfaction,
  analyzeFixQuality,
  computeDashboardAnalytics,
} from "./dashboardAnalytics";

describe("dashboardAnalytics Engine", () => {
  describe("computeMedian", () => {
    it("returns 0 for empty array", () => {
      expect(computeMedian([])).toBe(0);
    });

    it("calculates median for odd-length numbers", () => {
      expect(computeMedian([10, 40, 20])).toBe(20);
    });

    it("calculates median for even-length numbers", () => {
      expect(computeMedian([10, 20, 30, 40])).toBe(25);
    });
  });

  describe("evaluateReportSla", () => {
    it("correctly identifies on-track reports", () => {
      const recentDate = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(); // 2 hours ago
      const result = evaluateReportSla({ priority: "NORMAL", createdAt: recentDate });
      expect(result.status).toBe("ON_TRACK");
      expect(result.targetHours).toBe(72);
      expect(result.overdueHours).toBe(0);
    });

    it("correctly identifies breached reports", () => {
      const oldDate = new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(); // 50 hours ago
      const result = evaluateReportSla({ priority: "URGENT", createdAt: oldDate }); // target is 24h
      expect(result.status).toBe("BREACHED");
      expect(result.targetHours).toBe(24);
      expect(result.overdueHours).toBeGreaterThan(20);
    });
  });

  describe("analyzeSlaPerformance", () => {
    it("summarizes active reports and identifies breaches", () => {
      const reports = [
        { id: 1, status: "IN_PROGRESS", priority: "URGENT", createdAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString() }, // Breached (30 > 24)
        { id: 2, status: "ASSIGNED", priority: "NORMAL", createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString() }, // On track
        { id: 3, status: "RESOLVED", priority: "URGENT", createdAt: new Date(Date.now() - 100 * 3600 * 1000).toISOString() }, // Resolved (not active)
      ];
      const result = analyzeSlaPerformance(reports);
      expect(result.totalActive).toBe(2);
      expect(result.breachedCount).toBe(1);
      expect(result.breachedReports.length).toBe(1);
      expect(result.complianceRate).toBe(50);
    });
  });

  describe("analyzeDepartmentWorkload", () => {
    it("computes workload shares and resolution rates correctly", () => {
      const deptStats = [
        { departmentId: 1, departmentName: "Roads", openCount: 10, resolvedCount: 30, averageResolutionHours: 24, averageRating: 4.5 },
        { departmentId: 2, departmentName: "Water", openCount: 5, resolvedCount: 15, averageResolutionHours: 36, averageRating: 4.2 },
      ];
      const result = analyzeDepartmentWorkload(deptStats);
      expect(result[0].name).toBe("Roads");
      expect(result[0].shareOfOpenLoad).toBe(67); // 10 / 15 = 66.6% -> 67%
      expect(result[0].resolutionRate).toBe(75); // 30 / 40 = 75%
    });
  });

  describe("computeDashboardAnalytics aggregator", () => {
    it("produces full executive decision dataset", () => {
      const result = computeDashboardAnalytics({
        summary: { totalReportCount: 30 },
        departmentStats: [{ departmentId: 1, departmentName: "YESC", openCount: 4, resolvedCount: 10, averageResolutionHours: 22, averageRating: 4.6 }],
        categoryVolume: [{ categoryName: "Pothole", reportCount: 12 }],
        reports: [],
      });
      expect(result.isDemoData).toBe(true);
      expect(result.speed.medianHours).toBe(22);
      expect(result.speed.isAheadOfSla).toBe(true);
      expect(result.departments.length).toBe(1);
      expect(result.monthlyTrends.series.length).toBe(12);
      expect(result.monthlyTrends.year).toBe(2026);
      expect(result.monthlyTrends.avgMonthlyIntake).toBeGreaterThan(0);
    });
  });
});
