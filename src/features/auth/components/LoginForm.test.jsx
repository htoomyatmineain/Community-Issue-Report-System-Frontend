import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/app/providers/AuthProvider";
import LoginForm from "./LoginForm";
import { authApi } from "../api/authApi";

vi.mock("../api/authApi", () => ({
  authApi: { login: vi.fn(), me: vi.fn() },
}));

function renderLoginForm() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<div>Citizen Home</div>} />
          <Route path="/staff" element={<div>Staff Home</div>} />
          <Route path="/admin" element={<div>Admin Home</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("LoginForm", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("submits email/password to authApi.login and redirects to the role's home", async () => {
    authApi.login.mockResolvedValue({
      data: { token: "tok-1", userId: 1, fullName: "Test Citizen", role: "CITIZEN" },
    });
    renderLoginForm();

    await userEvent.type(screen.getByPlaceholderText("you@example.com"), "citizen@example.com");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(authApi.login).toHaveBeenCalledWith({ email: "citizen@example.com", password: "password123" });
    await waitFor(() => expect(screen.getByText("Citizen Home")).toBeInTheDocument());
  });

  it("shows the server error message on failed login", async () => {
    authApi.login.mockRejectedValue({ response: { data: { message: "Bad credentials" } } });
    renderLoginForm();

    await userEvent.type(screen.getByPlaceholderText("you@example.com"), "x@example.com");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "wrong");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => expect(screen.getByText("Bad credentials")).toBeInTheDocument());
  });

  it("the demo Staff button signs in without calling the real API and lands on /staff", async () => {
    renderLoginForm();

    await userEvent.click(screen.getByRole("button", { name: /continue as staff \(demo\)/i }));

    expect(authApi.login).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByText("Staff Home")).toBeInTheDocument());
  });

  it("the demo Admin button signs in and lands on /admin", async () => {
    renderLoginForm();

    await userEvent.click(screen.getByRole("button", { name: /continue as admin \(demo\)/i }));

    await waitFor(() => expect(screen.getByText("Admin Home")).toBeInTheDocument());
  });
});
