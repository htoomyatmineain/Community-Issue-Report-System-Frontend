import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminActionQueuesHub from "./AdminActionQueuesHub";
import { LanguageProvider } from "@/app/providers/LanguageProvider";

function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <LanguageProvider>{ui}</LanguageProvider>
    </BrowserRouter>
  );
}

describe("AdminActionQueuesHub Component", () => {
  const mockBreachedReports = [
    {
      id: 1,
      reportCode: "RPT-2026-0001",
      title: "Broken Water Pipe",
      priority: "URGENT",
      status: "IN_PROGRESS",
      categoryName: "Water Pipe Leak",
      departmentName: "Water Department",
      sla: { status: "BREACHED", overdueHours: 12.4, elapsedHours: 36.4 },
    },
  ];

  const mockReportsAwaitingApproval = [
    {
      id: 2,
      reportCode: "RPT-2026-0002",
      title: "Damaged Road Surface",
      categoryName: "Pothole",
      createdAt: new Date().toISOString(),
    },
  ];

  const mockRecentRegistrations = [
    {
      id: 3,
      fullName: "Ko Aung",
      email: "aung@example.com",
      accountStatus: "PENDING",
      createdAt: new Date().toISOString(),
    },
  ];

  it("renders with tabs and badges for each queue", () => {
    renderWithProviders(
      <AdminActionQueuesHub
        breachedReports={mockBreachedReports}
        reportsAwaitingApproval={mockReportsAwaitingApproval}
        recentRegistrations={mockRecentRegistrations}
        breachedCount={1}
        pendingReportCount={1}
        pendingAccountCount={1}
      />
    );

    expect(screen.getByText("Administrative Triage & Work Queues")).toBeInTheDocument();
    expect(screen.getByText("SLA Escalations")).toBeInTheDocument();
    expect(screen.getByText("Report Approvals")).toBeInTheDocument();
    expect(screen.getByText("Citizen Signups")).toBeInTheDocument();

    // Default tab is SLA Escalations
    expect(screen.getByText("Broken Water Pipe")).toBeInTheDocument();
    expect(screen.getByText("+12.4h overdue")).toBeInTheDocument();
  });

  it("switches to Report Approvals tab when clicked", () => {
    renderWithProviders(
      <AdminActionQueuesHub
        breachedReports={mockBreachedReports}
        reportsAwaitingApproval={mockReportsAwaitingApproval}
        recentRegistrations={mockRecentRegistrations}
      />
    );

    const reportTab = screen.getByRole("button", { name: /Report Approvals/i });
    fireEvent.click(reportTab);

    expect(screen.getByText("Damaged Road Surface")).toBeInTheDocument();
    expect(screen.getByText("Review & Approve")).toBeInTheDocument();
  });

  it("switches to Citizen Signups tab when clicked", () => {
    renderWithProviders(
      <AdminActionQueuesHub
        breachedReports={mockBreachedReports}
        reportsAwaitingApproval={mockReportsAwaitingApproval}
        recentRegistrations={mockRecentRegistrations}
      />
    );

    const accountsTab = screen.getByRole("button", { name: /Citizen Signups/i });
    fireEvent.click(accountsTab);

    expect(screen.getByText("Ko Aung")).toBeInTheDocument();
    expect(screen.getByText("Verify Account")).toBeInTheDocument();
  });
});
