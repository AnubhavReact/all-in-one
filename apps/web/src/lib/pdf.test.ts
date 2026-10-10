import { describe, expect, it } from "vitest";
import { PDFDocument, degrees } from "pdf-lib";
import {
  extractPages,
  imagesToPdf,
  mergeDocuments,
  pageCount,
  parsePageRange,
  rewritePages,
} from "./pdf";

/** A real PDF with `pages` numbered pages, wrapped as a File. */
async function makePdf(pages: number, tag: string) {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) {
    doc.addPage([300, 400]).drawText(`${tag}${i + 1}`, { x: 20, y: 350, size: 24 });
  }
  const bytes = await doc.save();
  return new File([new Uint8Array(bytes)], `${tag}.pdf`, {
    type: "application/pdf",
  });
}

/** A 1x1 red PNG. */
const RED_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==",
  "base64",
);

describe("parsePageRange", () => {
  it("reads the print-dialog syntax", () => {
    expect(parsePageRange("1-3, 7, 11-", 12)).toEqual([0, 1, 2, 6, 10, 11]);
  });

  it("takes a single page", () => {
    expect(parsePageRange("5", 12)).toEqual([4]);
  });

  it("clamps a range that runs past the end", () => {
    expect(parsePageRange("10-99", 12)).toEqual([9, 10, 11]);
  });

  it("treats an open start as page one", () => {
    expect(parsePageRange("-3", 12)).toEqual([0, 1, 2]);
  });

  it("removes duplicates and sorts", () => {
    expect(parsePageRange("5,1-3,2", 12)).toEqual([0, 1, 2, 4]);
  });

  it("ignores text and page zero rather than throwing", () => {
    expect(parsePageRange("abc, 2", 12)).toEqual([1]);
    expect(parsePageRange("0", 12)).toEqual([]);
    expect(parsePageRange("", 12)).toEqual([]);
  });
});

describe("pageCount", () => {
  it("counts the pages in a document", async () => {
    expect(await pageCount(await makePdf(3, "A"))).toBe(3);
  });
});

describe("mergeDocuments", () => {
  it("adds up the pages of every input, in order", async () => {
    const merged = await mergeDocuments([
      await makePdf(3, "A"),
      await makePdf(2, "B"),
    ]);
    expect((await PDFDocument.load(merged)).getPageCount()).toBe(5);
  });
});

describe("extractPages", () => {
  it("keeps only the pages asked for", async () => {
    const out = await extractPages(await makePdf(3, "A"), [2, 0]);
    expect((await PDFDocument.load(out)).getPageCount()).toBe(2);
  });
});

describe("rewritePages", () => {
  it("drops the pages not kept and rotates the ones named", async () => {
    const out = await rewritePages(await makePdf(3, "A"), [0, 2], { 0: 90 });
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(2);
    expect(doc.getPage(0).getRotation().angle).toBe(90);
    expect(doc.getPage(1).getRotation().angle).toBe(0);
  });

  it("adds to a rotation the page already had", async () => {
    const source = await PDFDocument.create();
    source.addPage([300, 400]).setRotation(degrees(90));
    const file = new File([new Uint8Array(await source.save())], "r.pdf", {
      type: "application/pdf",
    });

    const out = await rewritePages(file, [0], { 0: 90 });
    const doc = await PDFDocument.load(out);
    expect(doc.getPage(0).getRotation().angle).toBe(180);
  });
});

describe("imagesToPdf", () => {
  it("gives each image its own page", async () => {
    const out = await imagesToPdf([
      new File([RED_PNG], "a.png", { type: "image/png" }),
      new File([RED_PNG], "b.png", { type: "image/png" }),
    ]);
    expect((await PDFDocument.load(out)).getPageCount()).toBe(2);
  });

  it("sizes each page to its image", async () => {
    const out = await imagesToPdf([
      new File([RED_PNG], "a.png", { type: "image/png" }),
    ]);
    const page = (await PDFDocument.load(out)).getPage(0);
    expect(page.getWidth()).toBe(1);
    expect(page.getHeight()).toBe(1);
  });
});
