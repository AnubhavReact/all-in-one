/** Indian formats, in one place. */

const INR = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** 1800000 → "₹18,00,000" */
export function inr(amount: number): string {
  return `₹${INR.format(Math.round(amount))}`;
}

/** 1800000 → "18,00,000" (no symbol, for inputs) */
export function lakhDigits(amount: number): string {
  return INR.format(Math.round(amount));
}

/** 1536000 → "1.5 MB" */
export function bytes(size: number): string {
  if (size < 1024) return `${size} B`;
  const units = ["KB", "MB", "GB"];
  let value = size / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 100 || unit === 0 ? Math.round(value) : value.toFixed(1).replace(/\.0$/, "")} ${units[unit]}`;
}

const trim = (n: number) => (Math.round(n * 100) / 100).toString();

/** 1800000 → "₹18 lakh", 25000000 → "₹2.5 crore", 25000 → "₹25 thousand" */
export function words(amount: number): string {
  if (amount >= 1e7) return `₹${trim(amount / 1e7)} crore`;
  if (amount >= 1e5) return `₹${trim(amount / 1e5)} lakh`;
  if (amount >= 1e3) return `₹${trim(amount / 1e3)} thousand`;
  return inr(amount);
}
