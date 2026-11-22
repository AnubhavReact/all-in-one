import { describe, expect, it } from "vitest";
import { DSA_PLAN, dayNumber, streak } from "./dsa-plan";

const at = (iso: string) => new Date(`${iso}T12:00:00`);

describe("dsa plan", () => {
  it("has 30 days", () => expect(DSA_PLAN).toHaveLength(30));
  it("counts days from the start, capped at 30", () => {
    expect(dayNumber({ start: "2026-11-19", visits: [] }, at("2026-11-22"))).toBe(4);
    expect(dayNumber({ start: "2026-01-01", visits: [] }, at("2026-11-22"))).toBe(30);
  });
  it("counts a streak ending today or yesterday", () => {
    const visits = ["2026-11-19", "2026-11-20", "2026-11-21"];
    expect(streak({ start: "2026-11-19", visits }, at("2026-11-22"))).toBe(3);
    expect(streak({ start: "2026-11-19", visits: [...visits, "2026-11-22"] }, at("2026-11-22"))).toBe(4);
    expect(streak({ start: "2026-11-19", visits: ["2026-11-19"] }, at("2026-11-22"))).toBe(0);
  });
});
