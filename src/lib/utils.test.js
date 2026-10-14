import { describe, it, expect } from "vitest";
import { formatOverdueDuration, formatDuration, getInitials } from "./utils";

describe("formatOverdueDuration", () => {
  it("formats zero and negative durations gracefully", () => {
    expect(formatOverdueDuration(0)).toBe("0h");
    expect(formatOverdueDuration(-5)).toBe("0h");
    expect(formatOverdueDuration(null)).toBe("0h");
  });

  it("formats hours under 24", () => {
    expect(formatOverdueDuration(5)).toBe("5h");
    expect(formatOverdueDuration(12.4)).toBe("12.4h");
    expect(formatOverdueDuration(23)).toBe("23h");
  });

  it("formats 24 hours as 1 day and counts days + hours", () => {
    expect(formatOverdueDuration(24)).toBe("1 day");
    expect(formatOverdueDuration(26)).toBe("1 day 2hr");
    expect(formatOverdueDuration(48)).toBe("2 days");
    expect(formatOverdueDuration(53)).toBe("2 days 5hr");
  });

  it("formats weeks when between 7 and 29 days", () => {
    expect(formatOverdueDuration(168)).toBe("1 week"); // 7 days
    expect(formatOverdueDuration(200)).toBe("1 week"); // 8.3 days
    expect(formatOverdueDuration(336)).toBe("2 weeks"); // 14 days
    expect(formatOverdueDuration(504)).toBe("3 weeks"); // 21 days
    expect(formatOverdueDuration(672)).toBe("4 weeks"); // 28 days
  });

  it("formats months when 30 days or greater", () => {
    expect(formatOverdueDuration(720)).toBe("1 month"); // 30 days
    expect(formatOverdueDuration(765)).toBe("1 month"); // ~32 days
    expect(formatOverdueDuration(1440)).toBe("2 months"); // 60 days
    expect(formatOverdueDuration(2160)).toBe("3 months"); // 90 days
  });

  it("formats years when 365 days or greater", () => {
    expect(formatOverdueDuration(8760)).toBe("1 year");
    expect(formatOverdueDuration(17520)).toBe("2 years");
  });

  it("formatDuration is an alias for formatOverdueDuration", () => {
    expect(formatDuration(26)).toBe("1 day 2hr");
  });
});

describe("getInitials", () => {
  it("returns uppercase initials from full name", () => {
    expect(getInitials("Aung Thanlwin")).toBe("AT");
    expect(getInitials("Daw Tin Tin Win")).toBe("DW");
    expect(getInitials("Admin")).toBe("A");
    expect(getInitials("")).toBe("");
  });
});
