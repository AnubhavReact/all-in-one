import { describe, expect, it } from "vitest";
import { EMPTY_TAX_INPUTS, calculateTax, compareRegimes, hraExemption, type TaxInputs } from "./tax";

const withInputs = (overrides: Partial<TaxInputs>): TaxInputs => ({ ...EMPTY_TAX_INPUTS, ...overrides });

describe("new regime", () => {
  it("owes nothing on a ₹12.75L salary: ₹12L after the standard deduction, fully rebated", () => {
    const result = calculateTax(withInputs({ salary: 1_275_000 }), "new");
    expect(result.taxableIncome).toBe(1_200_000);
    expect(result.slabTax).toBe(60_000);
    expect(result.rebate).toBe(60_000);
    expect(result.total).toBe(0);
  });

  it("gives marginal relief just over ₹12L: tax is capped at the income above it", () => {
    // ₹12.1L taxable: slabs say ₹61,500, but only ₹10,000 is above ₹12L.
    const result = calculateTax(withInputs({ salary: 1_285_000 }), "new");
    expect(result.taxableIncome).toBe(1_210_000);
    expect(result.slabTax).toBe(61_500);
    expect(result.rebate).toBe(51_500);
    expect(result.total).toBe(10_400); // ₹10,000 plus 4% cess
  });

  it("stops the relief once the slabs cost less than the excess", () => {
    const result = calculateTax(withInputs({ salary: 1_375_000 }), "new");
    expect(result.taxableIncome).toBe(1_300_000);
    expect(result.slabTax).toBe(75_000);
    expect(result.rebate).toBe(0);
    expect(result.total).toBe(78_000);
  });

  it("caps the surcharge just over ₹50L at the income that crossed the line", () => {
    const result = calculateTax(withInputs({ otherIncome: 5_010_000 }), "new");
    expect(result.slabTax).toBe(1_083_000);
    expect(result.surcharge).toBeCloseTo(7_000);
    expect(result.total).toBe(1_133_600);
  });

  it("never charges more than 25% surcharge", () => {
    const result = calculateTax(withInputs({ otherIncome: 60_000_000 }), "new");
    expect(result.surcharge).toBeCloseTo(result.slabTax * 0.25);
  });

  it("allows employer NPS up to 14% of basic", () => {
    const result = calculateTax(withInputs({ salary: 2_000_000, basicSalary: 1_000_000, employerNps: 200_000 }), "new");
    const nps = result.lines.find((l) => l.label.startsWith("Employer NPS"));
    expect(nps?.allowed).toBe(140_000);
  });

  it("ignores the old regime's deductions", () => {
    const plain = calculateTax(withInputs({ salary: 1_800_000 }), "new");
    const claimed = calculateTax(withInputs({ salary: 1_800_000, section80C: 150_000, hraReceived: 200_000, rentPaid: 300_000, basicSalary: 900_000 }), "new");
    expect(claimed.total).toBe(plain.total);
  });
});

describe("old regime", () => {
  it("taxes ₹10L of salary with no deductions", () => {
    // ₹9.5L taxable: 5% of 2.5L + 20% of 4.5L = ₹1,02,500, plus 4% cess.
    const result = calculateTax(withInputs({ salary: 1_000_000 }), "old");
    expect(result.taxableIncome).toBe(950_000);
    expect(result.total).toBe(106_600);
  });

  it("rebates the whole tax up to ₹5L taxable, with no relief above it", () => {
    expect(calculateTax(withInputs({ salary: 550_000 }), "old").total).toBe(0);
    const above = calculateTax(withInputs({ salary: 560_000 }), "old");
    expect(above.taxableIncome).toBe(510_000);
    expect(above.rebate).toBe(0);
  });

  it("caps 80C at ₹1.5L", () => {
    const result = calculateTax(withInputs({ salary: 1_500_000, section80C: 300_000 }), "old");
    expect(result.lines.find((l) => l.label === "80C")?.allowed).toBe(150_000);
  });

  it("gives seniors a higher exemption", () => {
    const young = calculateTax(withInputs({ salary: 900_000 }), "old");
    const senior = calculateTax(withInputs({ salary: 900_000, age: "senior" }), "old");
    const superSenior = calculateTax(withInputs({ salary: 900_000, age: "superSenior" }), "old");
    expect(young.slabTax - senior.slabTax).toBe(2_500);
    expect(superSenior.slabTax).toBe(70_000); // 20% of 3.5L above ₹5L
  });
});

describe("HRA exemption", () => {
  it("takes the smallest of the three limits", () => {
    expect(hraExemption({ basicSalary: 600_000, hraReceived: 300_000, rentPaid: 360_000, metro: true })).toBe(300_000);
    expect(hraExemption({ basicSalary: 600_000, hraReceived: 300_000, rentPaid: 360_000, metro: false })).toBe(240_000);
    expect(hraExemption({ basicSalary: 600_000, hraReceived: 300_000, rentPaid: 200_000, metro: true })).toBe(140_000);
  });

  it("is zero when rent is under 10% of basic", () => {
    expect(hraExemption({ basicSalary: 600_000, hraReceived: 300_000, rentPaid: 50_000, metro: true })).toBe(0);
  });
});

describe("compareRegimes", () => {
  it("picks old when the deductions are large enough", () => {
    const result = compareRegimes(
      withInputs({
        salary: 1_500_000,
        basicSalary: 750_000,
        hraReceived: 300_000,
        rentPaid: 360_000,
        metro: true,
        section80C: 150_000,
        section80D: 25_000,
        section80CCD1B: 50_000,
        homeLoanInterest: 200_000,
      }),
    );
    expect(result.better).toBe("old");
    expect(result.saving).toBe(result.new.total - result.old.total);
  });

  it("picks new for a plain salary, and on a tie", () => {
    expect(compareRegimes(withInputs({ salary: 1_500_000 })).better).toBe("new");
    expect(compareRegimes(withInputs({})).better).toBe("new");
  });

  it("treats junk input as zero", () => {
    const result = compareRegimes(withInputs({ salary: Number.NaN, otherIncome: -5 }));
    expect(result.new.total).toBe(0);
    expect(result.old.grossIncome).toBe(0);
  });
});
