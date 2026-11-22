/**
 * Indian income tax for one person on salary and other income at slab rates,
 * worked out under both regimes so they can be compared.
 *
 * Plain arithmetic, no DOM: the website and the mobile app both call this, so
 * they can never show different figures for the same inputs.
 *
 * Scope, stated so nobody mistakes it for more: income taxed at slab rates
 * only. Capital gains at special rates (STCG on shares, LTCG) and lottery
 * winnings are left out. The 87A rebate does not apply to them anyway, so
 * mixing them in here would give a wrong answer, not a rough one.
 *
 * Rates are for tax year 2026-27 (1 April 2026 to 31 March 2027), the first
 * under the Income-tax Act, 2025. Budget 2026 kept the slabs it inherited.
 *
 * VERIFY before launch: check NEW_SLABS, oldSlabs(), SURCHARGE, the 87A
 * limits and TAX_LIMITS against the Income Tax Department's official
 * FY 2026-27 documents.
 */

export const TAX_YEAR = "2026-27";

export type Regime = "old" | "new";

/** Age on the last day of the tax year. Only the old regime cares. */
export type AgeBand = "below60" | "senior" | "superSenior";

export type TaxInputs = {
  /** Gross salary for the year, HRA included, before any exemption. */
  salary: number;
  /** Interest, rent already net of its own deductions, anything at slab rates. */
  otherIncome: number;
  age: AgeBand;

  /** Basic pay plus DA. Sets the HRA exemption and the employer NPS cap. */
  basicSalary: number;

  // Old regime only.
  hraReceived: number;
  rentPaid: number;
  /** Lives in a city where the HRA exemption is 50% of basic, not 40%. */
  metro: boolean;
  section80C: number;
  section80D: number;
  section80CCD1B: number;
  /** Interest on a loan for a home you live in. */
  homeLoanInterest: number;
  professionalTax: number;
  /** 80E, 80G, 80TTA and the rest, already within their own limits. */
  otherDeductions: number;

  // Both regimes.
  /** Your employer's contribution to your NPS account, 80CCD(2). */
  employerNps: number;
};

export const EMPTY_TAX_INPUTS: TaxInputs = {
  salary: 0,
  otherIncome: 0,
  age: "below60",
  basicSalary: 0,
  hraReceived: 0,
  rentPaid: 0,
  metro: false,
  section80C: 0,
  section80D: 0,
  section80CCD1B: 0,
  homeLoanInterest: 0,
  professionalTax: 0,
  otherDeductions: 0,
  employerNps: 0,
};

/** The statutory caps, in one place so the form can show them as hints. */
export const TAX_LIMITS = {
  standardDeduction: { old: 50_000, new: 75_000 },
  section80C: 150_000,
  /** Self and family plus parents, both senior: the most anyone can claim. */
  section80D: 100_000,
  section80CCD1B: 50_000,
  homeLoanInterest: 200_000,
  professionalTax: 2_500,
  /** Employer NPS as a share of basic plus DA. */
  employerNpsShare: { old: 0.1, new: 0.14 },
  rebate: {
    old: { upTo: 500_000, max: 12_500 },
    new: { upTo: 1_200_000, max: 60_000 },
  },
  cess: 0.04,
} as const;

type Slab = { upTo: number; rate: number };

const NEW_SLABS: Slab[] = [
  { upTo: 400_000, rate: 0 },
  { upTo: 800_000, rate: 0.05 },
  { upTo: 1_200_000, rate: 0.1 },
  { upTo: 1_600_000, rate: 0.15 },
  { upTo: 2_000_000, rate: 0.2 },
  { upTo: 2_400_000, rate: 0.25 },
  { upTo: Infinity, rate: 0.3 },
];

function oldSlabs(age: AgeBand): Slab[] {
  const exempt = age === "superSenior" ? 500_000 : age === "senior" ? 300_000 : 250_000;
  return [
    { upTo: exempt, rate: 0 },
    ...(exempt < 500_000 ? [{ upTo: 500_000, rate: 0.05 }] : []),
    { upTo: 1_000_000, rate: 0.2 },
    { upTo: Infinity, rate: 0.3 },
  ];
}

/** Surcharge bands. The new regime stops at 25%. */
const SURCHARGE: { above: number; rate: number }[] = [
  { above: 50_000_000, rate: 0.37 },
  { above: 20_000_000, rate: 0.25 },
  { above: 10_000_000, rate: 0.15 },
  { above: 5_000_000, rate: 0.1 },
];

export type TaxLine = {
  label: string;
  /** What was entered. */
  claimed: number;
  /** What the law lets through, after its cap. */
  allowed: number;
};

export type SlabRow = { from: number; to: number; rate: number; tax: number };

export type RegimeResult = {
  regime: Regime;
  /** Salary plus other income, before anything comes off. */
  grossIncome: number;
  /** Exemptions and deductions, in the order they are applied. */
  lines: TaxLine[];
  taxableIncome: number;
  slabs: SlabRow[];
  /** Tax from the slabs alone. */
  slabTax: number;
  /** 87A, including the marginal relief just above the new regime's ₹12L. */
  rebate: number;
  surcharge: number;
  cess: number;
  /** What you owe for the year, rounded to the nearest ₹10. */
  total: number;
  /** total / grossIncome, 0 when there is no income. */
  effectiveRate: number;
};

/** Section 288A/288B: income and tax are rounded to the nearest ₹10. */
const round10 = (value: number) => Math.round(value / 10) * 10;
const pos = (value: number) => (Number.isFinite(value) && value > 0 ? value : 0);

function line(label: string, claimed: number, cap: number): TaxLine {
  const value = pos(claimed);
  return { label, claimed: value, allowed: Math.min(value, cap) };
}

/** HRA exemption: the smallest of HRA received, rent over 10% of basic, and 50% or 40% of basic. */
export function hraExemption(input: Pick<TaxInputs, "hraReceived" | "rentPaid" | "basicSalary" | "metro">): number {
  const basic = pos(input.basicSalary);
  return Math.max(
    0,
    Math.min(
      pos(input.hraReceived),
      pos(input.rentPaid) - 0.1 * basic,
      (input.metro ? 0.5 : 0.4) * basic,
    ),
  );
}

function slabTax(income: number, slabs: Slab[]): { rows: SlabRow[]; tax: number } {
  const rows: SlabRow[] = [];
  let from = 0;
  let tax = 0;
  for (const slab of slabs) {
    if (income <= from) break;
    const to = Math.min(income, slab.upTo);
    const part = (to - from) * slab.rate;
    rows.push({ from, to, rate: slab.rate, tax: part });
    tax += part;
    from = slab.upTo;
  }
  return { rows, tax };
}

/**
 * Surcharge with marginal relief: crossing a band may not cost more in
 * surcharge than the income that crossed it.
 */
function surchargeFor(income: number, tax: number, regime: Regime, slabs: Slab[]): number {
  const bands = regime === "new" ? SURCHARGE.filter((b) => b.rate <= 0.25) : SURCHARGE;
  const index = bands.findIndex((b) => income > b.above);
  if (index === -1) return 0;

  const band = bands[index]!;
  const full = tax * band.rate;
  // What tax plus surcharge would be at exactly the band's threshold.
  const lowerRate = bands[index + 1]?.rate ?? 0;
  const atThreshold = slabTax(band.above, slabs).tax * (1 + lowerRate);
  const capped = atThreshold + (income - band.above) - tax;
  return Math.max(0, Math.min(full, capped));
}

export function calculateTax(input: TaxInputs, regime: Regime): RegimeResult {
  const salary = pos(input.salary);
  const grossIncome = salary + pos(input.otherIncome);
  const basic = pos(input.basicSalary);
  const lines: TaxLine[] = [];

  if (regime === "old") {
    const hra = hraExemption(input);
    if (pos(input.hraReceived) > 0) lines.push({ label: "HRA exemption", claimed: pos(input.hraReceived), allowed: hra });
  }

  if (salary > 0) {
    lines.push(line("Standard deduction", TAX_LIMITS.standardDeduction[regime], salary));
  }

  if (regime === "old") {
    lines.push(
      line("Professional tax", input.professionalTax, TAX_LIMITS.professionalTax),
      line("Home loan interest, 24(b)", input.homeLoanInterest, TAX_LIMITS.homeLoanInterest),
      line("80C", input.section80C, TAX_LIMITS.section80C),
      line("80D, health insurance", input.section80D, TAX_LIMITS.section80D),
      line("80CCD(1B), your own NPS", input.section80CCD1B, TAX_LIMITS.section80CCD1B),
      line("Other deductions", input.otherDeductions, Infinity),
    );
  }

  // Without basic pay there is no way to apply the cap, so take it as entered.
  const npsCap = basic > 0 ? basic * TAX_LIMITS.employerNpsShare[regime] : Infinity;
  lines.push(line("Employer NPS, 80CCD(2)", input.employerNps, npsCap));

  const kept = lines.filter((l) => l.claimed > 0);
  const off = kept.reduce((sum, l) => sum + l.allowed, 0);
  const taxableIncome = round10(Math.max(0, grossIncome - off));

  const slabs = regime === "new" ? NEW_SLABS : oldSlabs(input.age);
  const { rows, tax } = slabTax(taxableIncome, slabs);

  const limit = TAX_LIMITS.rebate[regime];
  let rebate = 0;
  if (taxableIncome <= limit.upTo) rebate = Math.min(tax, limit.max);
  else if (regime === "new") rebate = Math.max(0, tax - (taxableIncome - limit.upTo));
  const afterRebate = tax - rebate;

  const surcharge = surchargeFor(taxableIncome, afterRebate, regime, slabs);
  const cess = (afterRebate + surcharge) * TAX_LIMITS.cess;
  const total = round10(afterRebate + surcharge + cess);

  return {
    regime,
    grossIncome,
    lines: kept,
    taxableIncome,
    slabs: rows,
    slabTax: tax,
    rebate,
    surcharge,
    cess,
    total,
    effectiveRate: grossIncome > 0 ? total / grossIncome : 0,
  };
}

export type RegimeComparison = {
  old: RegimeResult;
  new: RegimeResult;
  /** The cheaper one. A tie goes to new, the default regime. */
  better: Regime;
  saving: number;
};

export function compareRegimes(input: TaxInputs): RegimeComparison {
  const old = calculateTax(input, "old");
  const next = calculateTax(input, "new");
  const better: Regime = old.total < next.total ? "old" : "new";
  return { old, new: next, better, saving: Math.abs(old.total - next.total) };
}
