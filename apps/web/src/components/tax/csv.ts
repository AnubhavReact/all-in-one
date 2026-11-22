import { TAX_YEAR, type Regime, type RegimeResult, type TaxInputs } from "@aio/core";

const LABEL: Record<Regime, string> = { old: "Old regime", new: "New regime" };

/** Inputs, then both regimes side by side, then each regime's slabs. */
export function taxCsv(inputs: TaxInputs, results: Record<Regime, RegimeResult>): string {
  const rows: (string | number)[][] = [["Tax year", `FY ${TAX_YEAR}`], [], ["Inputs"]];
  for (const [key, value] of Object.entries(inputs)) rows.push([key, String(value)]);

  rows.push([], ["", LABEL.old, LABEL.new]);
  const both = (label: string, pick: (r: RegimeResult) => number) =>
    rows.push([label, Math.round(pick(results.old)), Math.round(pick(results.new))]);

  both("Gross income", (r) => r.grossIncome);
  const labels = [...new Set([...results.old.lines, ...results.new.lines].map((l) => l.label))];
  for (const label of labels) both(label, (r) => r.lines.find((l) => l.label === label)?.allowed ?? 0);
  both("Taxable income", (r) => r.taxableIncome);
  both("Tax on slabs", (r) => r.slabTax);
  both("Rebate 87A", (r) => r.rebate);
  both("Surcharge", (r) => r.surcharge);
  both("Cess 4%", (r) => r.cess);
  both("Total tax", (r) => r.total);

  for (const regime of ["old", "new"] as const) {
    rows.push([], [`${LABEL[regime]} slabs`], ["From", "To", "Rate", "Taxable in slab", "Tax"]);
    for (const slab of results[regime].slabs) {
      rows.push([slab.from, slab.to, `${Number((slab.rate * 100).toFixed(1))}%`, Math.round(slab.to - slab.from), Math.round(slab.tax)]);
    }
  }

  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
}

/**
 * Hands the browser the file. Deliberately not lib/download's saveFile: that
 * one records the file in recent history, and this page promises to save nothing.
 */
export function downloadCsv(text: string, filename: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
