import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminDecisionSupportPanel from "./AdminDecisionSupportPanel";
import { LanguageProvider } from "@/app/providers/LanguageProvider";

function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <LanguageProvider>{ui}</LanguageProvider>
    </BrowserRouter>
  );
}

describe("AdminDecisionSupportPanel Component", () => {
  const mockRecommendations = [
    {
      id: "rec-sla-1",
      title: "2 Overdue Reports Exceeded Municipal SLA Target",
      severity: "CRITICAL",
      category: "SLA_BREACH",
      reason: "Civic reports have exceeded their official resolution deadlines.",
      evidence: [
        "2 tickets currently past SLA threshold",
        "Sample ticket codes: RPT-2026-0001, RPT-2026-0002",
      ],
      suggestedAction: "Triage overdue cases with responsible department dispatchers.",
      actionLabel: "Triage Overdue Reports",
      actionLink: "/admin/reports?status=IN_PROGRESS",
      limitation: "Calculated deterministically from report creation timestamps.",
      isSimulated: true,
    },
    {
      id: "rec-workload-2",
      title: "Roads & Bridges Department Holds 45% of All City-Wide Active Tickets",
      severity: "WARNING",
      category: "WORKLOAD_BALANCE",
      reason: "Report volume is heavily concentrated in Roads & Bridges Department.",
      evidence: ["12 active unresolved tickets out of 27 city-wide (45%)"],
      suggestedAction: "Review active assignments in Roads & Bridges Department.",
      actionLabel: "Inspect Queue",
      actionLink: "/admin/reports?departmentId=2",
      limitation: "Staffing roster and crew capacity data are not currently configured.",
      isSimulated: true,
    },
  ];

  it("renders recommendations with severity badges, reasons, and evidence", () => {
    renderWithProviders(<AdminDecisionSupportPanel recommendations={mockRecommendations} />);

    expect(screen.getByText(/Decision Support & Operational Recommendations/i)).toBeInTheDocument();
    expect(screen.getByText("2 Overdue Reports Exceeded Municipal SLA Target")).toBeInTheDocument();
    expect(screen.getByText(/Civic reports have exceeded their official resolution deadlines/i)).toBeInTheDocument();
    expect(screen.getByText(/Sample ticket codes: RPT-2026-0001/i)).toBeInTheDocument();
    expect(screen.getByText(/Staffing roster and crew capacity data are not currently configured/i)).toBeInTheDocument();
    expect(screen.getByText("Triage Overdue Reports")).toBeInTheDocument();
  });

  it("calls onDismiss when acknowledge button is clicked", () => {
    const handleDismiss = vi.fn();
    renderWithProviders(
      <AdminDecisionSupportPanel recommendations={mockRecommendations} onDismiss={handleDismiss} />
    );

    const acknowledgeButtons = screen.getAllByRole("button", { name: /Acknowledge/i });
    fireEvent.click(acknowledgeButtons[0]);

    expect(handleDismiss).toHaveBeenCalledWith("rec-sla-1");
  });

  it("filters recommendations by severity when filter pills are clicked", () => {
    renderWithProviders(<AdminDecisionSupportPanel recommendations={mockRecommendations} />);

    // Click Critical filter
    const criticalFilter = screen.getByRole("button", { name: /Critical/i });
    fireEvent.click(criticalFilter);

    expect(screen.getByText("2 Overdue Reports Exceeded Municipal SLA Target")).toBeInTheDocument();
    expect(screen.queryByText(/Roads & Bridges Department Holds 45%/i)).not.toBeInTheDocument();

    // Click Warnings filter
    const warningsFilter = screen.getByRole("button", { name: /Warnings/i });
    fireEvent.click(warningsFilter);

    expect(screen.queryByText("2 Overdue Reports Exceeded Municipal SLA Target")).not.toBeInTheDocument();
    expect(screen.getByText(/Roads & Bridges Department Holds 45%/i)).toBeInTheDocument();
  });

  it("renders healthy empty state when zero recommendations exist", () => {
    renderWithProviders(<AdminDecisionSupportPanel recommendations={[]} />);

    expect(screen.getByText("All Municipal Operations Within Thresholds")).toBeInTheDocument();
  });
});
