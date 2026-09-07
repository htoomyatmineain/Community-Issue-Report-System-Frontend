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
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(authApi.login).toHaveBeenCalledWith({ email: "citizen@example.com", password: "password123" });
    await waitFor(() => expect(screen.getByText("Citizen Home")).toBeInTheDocument());
  });

  it("shows the server error message on failed login", async () => {
    authApi.login.mockRejectedValue({ response: { data: { message: "Bad credentials" } } });
    renderLoginForm();

    await userEvent.type(screen.getByPlaceholderText("you@example.com"), "x@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "wrong");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => expect(screen.getByText("Bad credentials")).toBeInTheDocument());
  });

  it("links to the citizen signup page", () => {
    renderLoginForm();

    expect(screen.getByRole("link", { name: /create account/i })).toHaveAttribute("href", "/signup");
  });
});
