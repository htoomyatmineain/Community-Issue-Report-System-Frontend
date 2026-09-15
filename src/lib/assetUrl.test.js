import { describe, it, expect } from "vitest";
import { assetUrl } from "./assetUrl";

// Mirrors assetUrl.js's own derivation so these tests aren't hostage to
// whatever VITE_API_BASE_URL happens to be on a given machine (a dev-only
// .env.local override — see PhoneInput.jsx's neighbor, assetUrl.js's own
// comment — is exactly the kind of value this file used to hardcode as a
// literal "8080", which broke the moment the local backend's port drifted).
const CURRENT_API_ORIGIN = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api")
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");

describe("assetUrl", () => {
  it("prefixes the API origin onto a server-relative upload path", () => {
    expect(assetUrl("/uploads/reports/abc.png")).toBe(`${CURRENT_API_ORIGIN}/uploads/reports/abc.png`);
  });

  it("leaves absolute http(s) URLs untouched", () => {
    const url = "https://picsum.photos/seed/scirs-1/800/600";
    expect(assetUrl(url)).toBe(url);
  });

  it("leaves protocol-relative, data: and blob: URLs untouched", () => {
    expect(assetUrl("//cdn.example.com/a.png")).toBe("//cdn.example.com/a.png");
    expect(assetUrl("data:image/png;base64,AAAA")).toBe("data:image/png;base64,AAAA");
    expect(assetUrl("blob:http://localhost:5173/uuid")).toBe("blob:http://localhost:5173/uuid");
  });

  it("passes empty / nullish values straight through", () => {
    expect(assetUrl("")).toBe("");
    expect(assetUrl(null)).toBe(null);
    expect(assetUrl(undefined)).toBe(undefined);
  });
});

describe("assetUrl — stale local-origin rewrite", () => {
  it("rewrites a stale localhost port to the current API origin, preserving the path", () => {
    expect(assetUrl("http://localhost:5173/seed-images/damaged_pavement.jpg")).toBe(
      `${CURRENT_API_ORIGIN}/seed-images/damaged_pavement.jpg`
    );
  });

  it("rewrites a stale 127.0.0.1 origin the same way", () => {
    expect(assetUrl("http://127.0.0.1:5173/seed-images/damaged_pavement.jpg")).toBe(
      `${CURRENT_API_ORIGIN}/seed-images/damaged_pavement.jpg`
    );
  });

  it("is idempotent when the origin already matches the current API origin", () => {
    const url = `${CURRENT_API_ORIGIN}/uploads/reports/abc.png`;
    expect(assetUrl(url)).toBe(url);
  });

  it("does not rewrite a lookalike external host containing 'localhost'", () => {
    const url = "http://localhost.example.com/img.png";
    expect(assetUrl(url)).toBe(url);
  });

  it("still leaves genuinely external absolute URLs and blob: URLs untouched", () => {
    expect(assetUrl("https://picsum.photos/seed/scirs-1/800/600")).toBe(
      "https://picsum.photos/seed/scirs-1/800/600"
    );
    expect(assetUrl("blob:http://localhost:5173/uuid")).toBe("blob:http://localhost:5173/uuid");
  });
});
