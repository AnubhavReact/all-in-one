import { describe, expect, it } from "vitest";
import { checkPageRange } from "./range";

describe("checkPageRange", () => {
  it("reads ranges and single pages", () => {
    expect(checkPageRange("3-5, 10", 12)).toEqual({ ok: true, pages: [2, 3, 4, 9] });
    expect(checkPageRange("11-", 12)).toEqual({ ok: true, pages: [10, 11] });
  });

  it("says how to fix what it cannot use", () => {
    const fail = (input: string) => {
      const result = checkPageRange(input, 12);
      return result.ok ? "" : result.error;
    };
    expect(fail("")).toMatch(/like 1-3/);
    expect(fail("abc")).toMatch(/isn't a page/);
    expect(fail("7-3")).toMatch(/Write it as 3-7/);
    expect(fail("14")).toMatch(/no page 14.*1 to 12/);
    expect(fail("0")).toMatch(/start at 1/);
  });
});
