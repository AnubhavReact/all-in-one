"use client";

import { useState } from "react";
import { isPdf, pick, rejectMessage, type Picked } from "./files";

/**
 * The single-file tools (split, organise, to images) all start the same way:
 * take the first PDF dropped, say why anything else was turned away, and read
 * its page count with pdf-lib, fetched only now.
 */
export function useSinglePdf(onLoaded?: (item: Picked) => void | Promise<void>) {
  const [item, setItem] = useState<Picked | null>(null);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function accept(dropped: File[]) {
    const pdfs = dropped.filter(isPdf);
    const bad = dropped.filter((f) => !isPdf(f));
    const first = pdfs[0];
    if (!first) {
      setError(bad.length ? rejectMessage(bad, 0, "pdf") : undefined);
      return;
    }
    setError(
      pdfs.length > 1
        ? `This tool works on one PDF at a time, so it's using ${first.name}.`
        : bad.length
          ? rejectMessage(bad, 1, "pdf")
          : undefined,
    );
    setLoading(true);
    try {
      const { pageCount } = await import("@/lib/pdf");
      const next = { ...pick(first), pages: await pageCount(first) };
      setItem(next);
      await onLoaded?.(next);
    } catch {
      setItem(null);
      setError(`${first.name} couldn't be opened. It may be damaged; check it opens in a PDF reader.`);
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setItem(null);
    setError(undefined);
  }

  return { item, error, setError, loading, accept, clear };
}
