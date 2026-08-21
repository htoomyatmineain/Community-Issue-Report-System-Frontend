import { describe, it, expect, beforeEach } from "vitest";
import { api, TOKEN_STORAGE_KEY } from "./apiClient";

describe("apiClient", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("attaches the Authorization header when a token is stored", async () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, "abc123");
    let capturedConfig;
    api.defaults.adapter = async (config) => {
      capturedConfig = config;
      return { data: {}, status: 200, statusText: "OK", headers: {}, config };
    };

    await api.get("/ping");

    expect(capturedConfig.headers.Authorization).toBe("Bearer abc123");
  });

  it("omits the Authorization header when no token is stored", async () => {
    let capturedConfig;
    api.defaults.adapter = async (config) => {
      capturedConfig = config;
      return { data: {}, status: 200, statusText: "OK", headers: {}, config };
    };

    await api.get("/ping");

    expect(capturedConfig.headers.Authorization).toBeUndefined();
  });

  it("clears the stored token on a 401 response", async () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, "abc123");
    api.defaults.adapter = async (config) => {
      const error = new Error("Unauthorized");
      error.response = { status: 401, data: {}, headers: {}, config };
      error.config = config;
      throw error;
    };

    await expect(api.get("/ping")).rejects.toThrow();
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });

  it("keeps the stored token on a non-401 error", async () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, "abc123");
    api.defaults.adapter = async (config) => {
      const error = new Error("Server error");
      error.response = { status: 500, data: {}, headers: {}, config };
      error.config = config;
      throw error;
    };

    await expect(api.get("/ping")).rejects.toThrow();
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe("abc123");
  });
});
