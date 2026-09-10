import { describe, it, expect, afterEach } from "vitest";
import { api } from "@/services/apiClient";
import { authApi } from "./authApi";

/**
 * Locks the auth endpoint contract — login must POST to `/auth/login` with an
 * `{ email, password }` body. A drift on either side breaks sign-in.
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

  it("login POSTs credentials to /auth/login", async () => {
    const getConfig = capture(200, { token: "jwt" });

    await authApi.login({ email: "a@b.com", password: "pw" });

    const config = getConfig();
    expect(config.url).toBe("/auth/login");
    expect(JSON.parse(config.data)).toEqual({ email: "a@b.com", password: "pw" });
  });
});
