import { describe, expect, it } from "vitest";
import { bytes, inr, words } from "./format";

describe("format", () => {
  it("groups rupees the Indian way", () => {
    expect(inr(1_800_000)).toBe("₹18,00,000");
    expect(inr(150_800)).toBe("₹1,50,800");
  });
  it("says amounts in words", () => {
    expect(words(1_800_000)).toBe("₹18 lakh");
    expect(words(150_000)).toBe("₹1.5 lakh");
    expect(words(25_000_000)).toBe("₹2.5 crore");
    expect(words(25_000)).toBe("₹25 thousand");
  });
  it("sizes files", () => {
    expect(bytes(500)).toBe("500 B");
    expect(bytes(188_416)).toBe("184 KB");
    expect(bytes(1_572_864)).toBe("1.5 MB");
  });
});
