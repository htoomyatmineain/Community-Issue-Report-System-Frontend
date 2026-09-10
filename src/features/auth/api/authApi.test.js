import { describe, it, expect, afterEach } from "vitest";
import { api } from "@/services/apiClient";
import { authApi } from "./authApi";

/**
 * Locks the auth endpoint contract. `loginWithGoogle` in particular must POST
 * to `/auth/google` with a `{ idToken }` body — the backend route
 * (POST /api/auth/google) is what makes "Continue with Google" work; a drift
 * on either side brings back the "Google sign-in failed" bug.
 */
describe("authApi", () => {
  afterEach(() => {
    delete api.defaults.adapter;
  });

  function capture(status = 200, data = {}) {
    let config;
    api.defaults.adapter = async (cfg) => {
      config = cfg;
      return { data, status, statusText: "OK", headers: {}, config: cfg };
    };
    return () => config;
  }

  it("loginWithGoogle POSTs the Google ID token to /auth/google as { idToken }", async () => {
    const getConfig = capture(200, { token: "jwt", role: "CITIZEN" });

    await authApi.loginWithGoogle("google-id-token-xyz");

    const config = getConfig();
    expect(config.method).toBe("post");
    expect(config.url).toBe("/auth/google");
    expect(JSON.parse(config.data)).toEqual({ idToken: "google-id-token-xyz" });
  });

  it("login POSTs credentials to /auth/login", async () => {
    const getConfig = capture(200, { token: "jwt" });

    await authApi.login({ email: "a@b.com", password: "pw" });

    const config = getConfig();
    expect(config.url).toBe("/auth/login");
    expect(JSON.parse(config.data)).toEqual({ email: "a@b.com", password: "pw" });
  });
});
