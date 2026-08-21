import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "./AuthProvider";
import { TOKEN_STORAGE_KEY } from "@/services/apiClient";
import { authApi } from "@/features/auth/api/authApi";

vi.mock("@/features/auth/api/authApi", () => ({
  authApi: { me: vi.fn() },
}));

function Probe() {
  const { user, role, isAuthenticated, isInitializing, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="initializing">{String(isInitializing)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="role">{role ?? ""}</span>
      <span data-testid="name">{user?.fullName ?? ""}</span>
      <button onClick={() => login({ token: "tok-1", userId: 1, fullName: "Test User", role: "CITIZEN" })}>
        login
      </button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("starts unauthenticated with no stored token, past the initial loading window", async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId("initializing")).toHaveTextContent("false"));
    expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
    expect(authApi.me).not.toHaveBeenCalled();
  });

  it("rehydrates the session from a stored token via GET /auth/me", async () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, "existing-token");
    authApi.me.mockResolvedValue({ data: { userId: 1, fullName: "Restored User", role: "STAFF" } });

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId("authenticated")).toHaveTextContent("true"));
    expect(screen.getByTestId("name")).toHaveTextContent("Restored User");
    expect(screen.getByTestId("role")).toHaveTextContent("STAFF");
  });

  it("clears an invalid stored token when /auth/me rejects", async () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, "stale-token");
    authApi.me.mockRejectedValue(new Error("401"));

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId("initializing")).toHaveTextContent("false"));
    expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });

  it("login stores the token and sets the user, minus the token field", async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await waitFor(() => expect(screen.getByTestId("initializing")).toHaveTextContent("false"));

    await userEvent.click(screen.getByText("login"));

    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe("tok-1");
    expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
    expect(screen.getByTestId("name")).toHaveTextContent("Test User");
  });

  it("logout clears the token and the session", async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await waitFor(() => expect(screen.getByTestId("initializing")).toHaveTextContent("false"));
    await userEvent.click(screen.getByText("login"));
    expect(screen.getByTestId("authenticated")).toHaveTextContent("true");

    await userEvent.click(screen.getByText("logout"));

    expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });

  it("useAuth throws when used outside an AuthProvider", () => {
    function Bare() {
      useAuth();
      return null;
    }
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Bare />)).toThrow("useAuth must be used within an AuthProvider");
    spy.mockRestore();
  });
});
