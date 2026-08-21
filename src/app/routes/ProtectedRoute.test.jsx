import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const mockUseAuth = vi.fn();
vi.mock("@/app/providers/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

function renderProtected({ allow = [], fallback, initialPath = "/secret" } = {}) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/" element={<div>Citizen Home</div>} />
        <Route path="/staff" element={<div>Staff Home</div>} />
        <Route element={<ProtectedRoute allow={allow} fallback={fallback} />}>
          <Route path="/secret" element={<div>Protected Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("renders nothing while auth is still initializing", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isInitializing: true, role: null });
    const { container } = renderProtected();
    expect(container).toBeEmptyDOMElement();
  });

  it("redirects to /login when unauthenticated", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isInitializing: false, role: null });
    renderProtected();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders the protected content when authenticated and the role is allowed", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isInitializing: false, role: "CITIZEN" });
    renderProtected({ allow: ["CITIZEN"] });
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("renders the content when no `allow` restriction is given", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isInitializing: false, role: "CITIZEN" });
    renderProtected({ allow: [] });
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to an explicit fallback on a role mismatch when one is given", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isInitializing: false, role: "CITIZEN" });
    renderProtected({ allow: ["ADMIN"], fallback: "/staff" });
    expect(screen.getByText("Staff Home")).toBeInTheDocument();
  });

  it("redirects to the user's own role home when no fallback is given, instead of looping back to /", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isInitializing: false, role: "STAFF" });
    renderProtected({ allow: ["ADMIN"] });
    expect(screen.getByText("Staff Home")).toBeInTheDocument();
  });
});
