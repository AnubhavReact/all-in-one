import { PDFDocument, degrees } from "pdf-lib";

/**
 * Everything in this file runs in the browser. No file is ever sent anywhere,
 * which is why these tools work offline and cost nothing to run.
 */

export async function loadDocument(file: File) {
  const bytes = await file.arrayBuffer();
  // Some PDFs are marked as "no editing allowed". We still let the owner of
  // the file work on it locally, which is what every desktop reader does.
  return PDFDocument.load(bytes, { ignoreEncryption: true });
}

export async function pageCount(file: File) {
  return (await loadDocument(file)).getPageCount();
}

export async function mergeDocuments(files: File[]): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  for (const file of files) {
    const doc = await loadDocument(file);
    const pages = await out.copyPages(doc, doc.getPageIndices());
    for (const page of pages) out.addPage(page);
  }
  return out.save();
}

/** Build a new PDF from the given zero-based page indices, in that order. */
export async function extractPages(
  file: File,
  indices: number[],
): Promise<Uint8Array> {
  const source = await loadDocument(file);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(source, indices);
  for (const page of pages) out.addPage(page);
  return out.save();
}

/**
 * Apply a rotation to each kept page and drop the rest.
 * `rotations` is keyed by the page's original index, in degrees.
 */
export async function rewritePages(
  file: File,
  keep: number[],
  rotations: Record<number, number>,
): Promise<Uint8Array> {
  const source = await loadDocument(file);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(source, keep);
  keep.forEach((originalIndex, position) => {
    const page = pages[position];
    if (!page) return;
    const turn = rotations[originalIndex] ?? 0;
    if (turn !== 0) {
      page.setRotation(degrees((page.getRotation().angle + turn) % 360));
    }
    out.addPage(page);
  });
  return out.save();
}

export async function imagesToPdf(files: File[]): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const isPng = file.type === "image/png";
    const image = isPng
      ? await out.embedPng(bytes)
      : await out.embedJpg(bytes);
    // One page per image, sized exactly to the image so nothing is cropped.
    const page = out.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }
  return out.save();
}

/**
 * Parse a page range the way a print dialog does: "1-3, 7, 11-" over a
 * 12-page document gives pages 1,2,3,7,11,12. Returns zero-based indices.
 */
export function parsePageRange(input: string, total: number): number[] {
  const kept = new Set<number>();
  for (const chunk of input.split(",")) {
    const part = chunk.trim();
    if (!part) continue;
    const match = /^(\d+)?\s*(-)?\s*(\d+)?$/.exec(part);
    if (!match) continue;
    const [, rawStart, dash, rawEnd] = match;
    if (!dash) {
      if (!rawStart) continue;
      const only = Number(rawStart);
      if (only >= 1 && only <= total) kept.add(only - 1);
      continue;
    }
    const start = rawStart ? Number(rawStart) : 1;
    const end = rawEnd ? Number(rawEnd) : total;
    for (let page = Math.max(1, start); page <= Math.min(total, end); page++) {
      kept.add(page - 1);
    }
  }
  return [...kept].sort((a, b) => a - b);
}
