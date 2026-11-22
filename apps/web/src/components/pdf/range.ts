/** Kept apart from lib/pdf.ts so checking a range never loads pdf-lib. */
export type RangeCheck =
  | { ok: true; pages: number[] }
  | { ok: false; error: string };

/**
 * A strict version of parsePageRange for a form: instead of quietly skipping
 * what it cannot read, it says what is wrong and how to fix it.
 */
export function checkPageRange(input: string, total: number): RangeCheck {
  const chunks = input
    .split(",")
    .map((chunk) => chunk.trim())
    .filter(Boolean);
  if (chunks.length === 0) {
    return { ok: false, error: "Type the pages you want, like 1-3, 7." };
  }
  const pageWord = total === 1 ? "page" : "pages";
  const kept = new Set<number>();
  for (const part of chunks) {
    const match = /^(\d+)?\s*(-)?\s*(\d+)?$/.exec(part);
    if (!match || (!match[1] && !match[3])) {
      return {
        ok: false,
        error: `"${part}" isn't a page or a range. Use numbers and dashes, like 3-7.`,
      };
    }
    const [, rawStart, dash, rawEnd] = match;
    const start = rawStart ? Number(rawStart) : 1;
    const end = dash ? (rawEnd ? Number(rawEnd) : total) : start;
    if (start < 1 || end < 1) {
      return { ok: false, error: "Pages start at 1. Change the 0 to 1." };
    }
    if (start > end) {
      return {
        ok: false,
        error: `"${part}" runs backwards. Write it as ${end}-${start}.`,
      };
    }
    const outside = start > total ? start : end > total ? end : 0;
    if (outside) {
      return {
        ok: false,
        error: `There's no page ${outside}. This PDF has ${total} ${pageWord}, so use 1 to ${total}.`,
      };
    }
    for (let page = start; page <= end; page++) kept.add(page - 1);
  }
  return { ok: true, pages: [...kept].sort((a, b) => a - b) };
}
