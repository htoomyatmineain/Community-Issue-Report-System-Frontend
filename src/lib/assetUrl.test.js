import { describe, it, expect } from "vitest";
import { assetUrl } from "./assetUrl";

// VITE_API_BASE_URL is "http://localhost:8080/api" in .env / test env, so the
// derived asset origin is "http://localhost:8080".
describe("assetUrl", () => {
  it("prefixes the API origin onto a server-relative upload path", () => {
    expect(assetUrl("/uploads/reports/abc.png")).toBe(
      "http://localhost:8080/uploads/reports/abc.png"
    );
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
