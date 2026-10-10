/**
 * Turning PDF pages into pictures needs pdf.js, which is large and only works
 * in a browser. It is imported on demand so it never lands in the first page
 * load, and its worker is served from /public.
 */

type PdfjsModule = typeof import("pdfjs-dist");

let pdfjs: Promise<PdfjsModule> | null = null;

function getPdfjs() {
  pdfjs ??= import("pdfjs-dist").then((module) => {
    module.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    return module;
  });
  return pdfjs;
}

export type RenderedPage = {
  /** Zero-based page index in the source document. */
  index: number;
  canvas: HTMLCanvasElement;
};

/**
 * Draw every page onto its own canvas.
 *
 * `scale` of 1 is the PDF's own point size, so 2 gives roughly 144 DPI, which
 * is sharp enough to read. `maxWidth` instead fits each page to a pixel width,
 * which is what thumbnails want.
 */
export async function renderPages(
  file: File,
  options: { scale?: number; maxWidth?: number } = {},
  /** Called as each page finishes, with the document's total. */
  onPage?: (page: RenderedPage, total: number) => void,
): Promise<RenderedPage[]> {
  const { getDocument } = await getPdfjs();
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await getDocument({ data }).promise;

  const rendered: RenderedPage[] = [];
  try {
    for (let number = 1; number <= doc.numPages; number++) {
      const page = await doc.getPage(number);
      const base = page.getViewport({ scale: 1 });
      const scale = options.maxWidth
        ? options.maxWidth / base.width
        : (options.scale ?? 2);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("This browser cannot draw to a canvas.");

      await page.render({ canvasContext: context, viewport }).promise;
      page.cleanup();

      const result = { index: number - 1, canvas };
      rendered.push(result);
      onPage?.(result, doc.numPages);
    }
  } finally {
    await doc.destroy();
  }
  return rendered;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: "image/png" | "image/jpeg",
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Could not encode the image.")),
      type,
      quality,
    );
  });
}
