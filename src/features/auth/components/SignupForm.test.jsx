import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import SignupForm from "./SignupForm";
import { authApi } from "../api/authApi";

vi.mock("../api/authApi", () => ({
  authApi: { signup: vi.fn() },
}));

function renderSignupForm() {
  return render(
    <MemoryRouter initialEntries={["/signup"]}>
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

async function fillValidForm() {
  await userEvent.type(screen.getByPlaceholderText("Aung Aung"), "Nandar Win");
  await userEvent.type(screen.getByPlaceholderText("you@example.com"), "nandar@example.com");
  await userEvent.type(screen.getByPlaceholderText("+959123456789"), "+959123456789");
  fireEvent.change(screen.getByLabelText("Date of birth"), { target: { value: "2000-01-01" } });
  await userEvent.type(screen.getByPlaceholderText("12/ABC(N)123456"), "12/ABC(N)654321");
  await userEvent.type(screen.getByPlaceholderText("••••••••"), "securePass123");
}

describe("SignupForm", () => {
  beforeEach(() => vi.clearAllMocks());

  it("submits the full CitizenRegisterDTO shape to /auth/register and redirects to /login", async () => {
    authApi.signup.mockResolvedValue({ data: {} });
    renderSignupForm();

    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(authApi.signup).toHaveBeenCalledWith({
      fullName: "Nandar Win",
      email: "nandar@example.com",
      phone: "+959123456789",
      dateOfBirth: "2000-01-01",
      nrcNumber: "12/ABC(N)654321",
      password: "securePass123",
    });
    await waitFor(() => expect(screen.getByText("Login Page")).toBeInTheDocument());
  });

  it("shows per-field validation errors returned by the backend", async () => {
    authApi.signup.mockRejectedValue({
      response: { data: { message: "Validation failed", errors: { email: "Email already in use" } } },
    });
    renderSignupForm();

    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => expect(screen.getByText("Email already in use")).toBeInTheDocument());
  });
});
