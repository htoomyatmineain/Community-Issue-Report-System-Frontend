import { describe, expect, it } from "vitest";
import {
  generateSlaBreachRecommendations,
  generateWorkloadRecommendations,
  generateTriageQueueRecommendations,
  generateAdminRecommendations,
} from "./dssRules";

describe("Municipal DSS Rules Engine", () => {
  describe("generateSlaBreachRecommendations", () => {
    it("returns critical recommendation with evidence when breached reports exist", () => {
      const slaSummary = {
        breachedCount: 2,
        atRiskCount: 1,
        breachedReports: [
          {
            id: 101,
            reportCode: "RPT-2026-0001",
            title: "Dangerous Sinkhole",
            priority: "URGENT",
            sla: { status: "BREACHED", overdueHours: 14.5 },
          },
          {
            id: 102,
            reportCode: "RPT-2026-0002",
            title: "Exposed Power Line",
            priority: "HIGH",
            sla: { status: "BREACHED", overdueHours: 5.2 },
          },
        ],
      };

      const recs = generateSlaBreachRecommendations([], slaSummary);
      expect(recs.length).toBe(1);
      expect(recs[0].severity).toBe("CRITICAL");
      expect(recs[0].category).toBe("SLA_BREACH");
      expect(recs[0].title).toContain("2 Overdue Reports");
      expect(recs[0].evidence.some((e) => e.includes("RPT-2026-0001"))).toBe(true);
      expect(recs[0].evidence.some((e) => e.includes("Highest delay: +14.5h"))).toBe(true);
      expect(recs[0].suggestedAction).toBeDefined();
      expect(recs[0].actionLink).toBe("/admin/reports?status=IN_PROGRESS");
    });

    it("returns warning recommendation when tickets are at risk but none breached", () => {
      const slaSummary = {
        breachedCount: 0,
        atRiskCount: 3,
        breachedReports: [
          {
            id: 103,
            reportCode: "RPT-2026-0003",
            title: "Clogged Storm Drain",
            priority: "NORMAL",
            sla: { status: "AT_RISK", overdueHours: 0, elapsedHours: 56 },
          },
        ],
      };

      const recs = generateSlaBreachRecommendations([], slaSummary);
      expect(recs.length).toBe(1);
      expect(recs[0].severity).toBe("WARNING");
      expect(recs[0].title).toContain("3 Reports Approaching SLA");
      expect(recs[0].evidence.some((e) => e.includes("RPT-2026-0003"))).toBe(true);
    });

    it("returns no recommendations when all reports are on track", () => {
      const slaSummary = { breachedCount: 0, atRiskCount: 0, breachedReports: [] };
      const recs = generateSlaBreachRecommendations([], slaSummary);
      expect(recs).toEqual([]);
    });
  });

  describe("generateWorkloadRecommendations", () => {
    it("flags department carrying disproportionate share with explicit capacity caveat", () => {
      const departments = [
        {
          id: 1,
          name: "Drainage Management Department",
          openCount: 14,
          resolvedCount: 6,
          shareOfOpenLoad: 58,
          resolutionRate: 30,
          averageResolutionHours: 32.5,
        },
        {
          id: 2,
          name: "Roads & Bridges Department",
          openCount: 6,
          resolvedCount: 20,
          shareOfOpenLoad: 25,
          resolutionRate: 77,
          averageResolutionHours: 18.0,
        },
        {
          id: 3,
          name: "Buildings Department",
          openCount: 4,
          resolvedCount: 12,
          shareOfOpenLoad: 17,
          resolutionRate: 75,
          averageResolutionHours: 22.0,
        },
      ];

      const recs = generateWorkloadRecommendations(departments);
      expect(recs.length).toBe(1);
      expect(recs[0].severity).toBe("CRITICAL"); // >= 50% is CRITICAL
      expect(recs[0].title).toContain("Drainage Management Department Holds 58%");
      expect(recs[0].evidence.some((e) => e.includes("14 active unresolved tickets"))).toBe(true);
      expect(recs[0].actionLink).toBe("/admin/reports?departmentId=1");
      // Explicit limitation requirement from Phase 2/3
      expect(recs[0].limitation).toContain("Staffing roster and crew capacity data are not currently configured");
    });

    it("returns no recommendations when workload is reasonably balanced", () => {
      const departments = [
        { id: 1, name: "Dept A", openCount: 5, shareOfOpenLoad: 25, resolvedCount: 10, resolutionRate: 67 },
        { id: 2, name: "Dept B", openCount: 5, shareOfOpenLoad: 25, resolvedCount: 10, resolutionRate: 67 },
        { id: 3, name: "Dept C", openCount: 5, shareOfOpenLoad: 25, resolvedCount: 10, resolutionRate: 67 },
        { id: 4, name: "Dept D", openCount: 5, shareOfOpenLoad: 25, resolvedCount: 10, resolutionRate: 67 },
      ];

      const recs = generateWorkloadRecommendations(departments);
      expect(recs).toEqual([]);
    });
  });

  describe("generateTriageQueueRecommendations", () => {
    it("flags administrative backlog when reports awaiting approval pile up", () => {
      const summary = {
        pendingReportCount: 7,
        pendingAccountCount: 3,
      };

      const recs = generateTriageQueueRecommendations(summary);
      expect(recs.length).toBe(1);
      expect(recs[0].category).toBe("TRIAGE_BACKLOG");
      expect(recs[0].title).toContain("10 Submissions Pending Administrative Verification");
      expect(recs[0].evidence.some((e) => e.includes("7 citizen report"))).toBe(true);
      expect(recs[0].actionLink).toBe("/admin/approvals");
    });

    it("returns no recommendations when pending triage queues are clear", () => {
      const summary = { pendingReportCount: 1, pendingAccountCount: 1 };
      const recs = generateTriageQueueRecommendations(summary);
      expect(recs).toEqual([]);
    });
  });

  describe("generateAdminRecommendations aggregator", () => {
    it("aggregates and orders recommendations by severity (CRITICAL before WARNING)", () => {
      const analytics = {
        sla: {
          breachedCount: 1,
          atRiskCount: 0,
          breachedReports: [
            {
              id: 1,
              reportCode: "RPT-001",
              title: "Broken Bridge Rail",
              priority: "URGENT",
              sla: { status: "BREACHED", overdueHours: 12 },
            },
          ],
        },
        departments: [
          {
            id: 2,
            name: "Water & Sanitation",
            openCount: 6,
            resolvedCount: 5,
            shareOfOpenLoad: 40,
            resolutionRate: 45,
          },
        ],
      };
      const summary = {
        pendingReportCount: 5,
        pendingAccountCount: 2,
      };

      const result = generateAdminRecommendations({ summary, analytics });
      expect(result.length).toBe(3);
      expect(result[0].severity).toBe("CRITICAL"); // SLA Breach
      expect(result[1].severity).toBe("WARNING"); // Workload 40%
      expect(result[2].severity).toBe("WARNING"); // Triage 7
    });

    it("safely handles empty or missing parameters", () => {
      expect(generateAdminRecommendations({})).toEqual([]);
    });
  });
});
