"use client";

import { useState } from "react";
import { FileImage } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DropZone } from "@/components/ui/DropZone";
import { Segmented } from "@/components/ui/Segmented";
import { baseName } from "@/lib/download";
import { canvasToBlob, renderPages } from "@/lib/pdf-render";
import { plural } from "./files";
import { ActionBar, ErrorNote, FileRow, ResultCard, Working } from "./Parts";
import { remember, toBlob, type Result } from "./save";
import { useSinglePdf } from "./useSinglePdf";
import s from "./Pdf.module.css";

type Format = "jpg" | "png";
type Quality = "screen" | "print";

/** Scale 1 is 72 DPI, the PDF's own point size. */
const SCALE: Record<Quality, number> = { screen: 1.5, print: 3 };

export function ToImagesTool() {
  const pdf = useSinglePdf();
  const [format, setFormat] = useState<Format>("jpg");
  const [quality, setQuality] = useState<Quality>("screen");
  const [progress, setProgress] = useState<{ done: number; total: number; label: string } | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const total = pdf.item?.pages ?? 0;

  function reset() {
    pdf.clear();
    setResult(null);
  }

  async function convert() {
    const item = pdf.item;
    if (!item) return;
    const base = baseName(item.file.name);
    const type = format === "png" ? "image/png" : "image/jpeg";
    const width = String(total).length;
    setProgress({ done: 0, total, label: "Reading the PDF…" });
    try {
      const images: { name: string; blob: Blob }[] = [];
      const pages = await renderPages(item.file, { scale: SCALE[quality] }, (page, count) => {
        setProgress({ done: page.index + 1, total: count, label: `Drawing page ${page.index + 1} of ${count} in this tab…` });
      });
      for (const page of pages) {
        const blob = await canvasToBlob(page.canvas, type, format === "jpg" ? 0.9 : undefined);
        images.push({ name: `${base}-${String(page.index + 1).padStart(width, "0")}.${format}`, blob });
        // Free the canvas memory as soon as it is encoded.
        page.canvas.width = 0;
      }

      let done: Result;
      const only = images[0];
      if (images.length === 1 && only) {
        // One page needs no zip.
        done = { blob: only.blob, name: only.name, facts: ["1 image"] };
      } else {
        setProgress({ done: total, total, label: "Packing the zip…" });
        const { default: JSZip } = await import("jszip");
        const zip = new JSZip();
        for (const image of images) zip.file(image.name, image.blob);
        const archive = await zip.generateAsync({ type: "uint8array" });
        done = {
          blob: toBlob(archive, "application/zip"),
          name: `${base}-images.zip`,
          facts: [plural(images.length, format.toUpperCase())],
        };
      }
      remember(done, "PDF to images", "image");
      setResult(done);
    } catch {
      pdf.setError("This PDF couldn't be turned into images. Check it opens in a PDF reader.");
    } finally {
      setProgress(null);
    }
  }

  if (result) return <ResultCard result={result} onReset={reset} />;
  if (progress) return <Working label={progress.label} done={progress.done} total={progress.total} />;
  if (pdf.loading) return <Working label="Reading the PDF…" done={0} total={1} />;
  if (!pdf.item) {
    return <DropZone files={[]} error={pdf.error} onFiles={pdf.accept} onRemove={() => {}} noun="a PDF" />;
  }

  return (
    <div className={s.stack}>
      <FileRow item={pdf.item} onRemove={reset} />
      {pdf.error && <ErrorNote>{pdf.error}</ErrorNote>}

      <div className={s.panel}>
        <div className={s.options}>
          <Segmented<Format>
            legend="Format"
            value={format}
            onChange={setFormat}
            options={[
              { value: "jpg", label: "JPG" },
              { value: "png", label: "PNG" },
            ]}
          />
          <Segmented<Quality>
            legend="Quality"
            value={quality}
            onChange={setQuality}
            options={[
              { value: "screen", label: "Screen" },
              { value: "print", label: "Print" },
            ]}
          />
        </div>
        <p className={s.helper}>
          {format === "jpg" ? "JPG files are smaller. " : "PNG keeps text perfectly sharp. "}
          {quality === "screen" ? (
            <>
              Screen is <b>108 DPI</b>, fine for sharing.
            </>
          ) : (
            <>
              Print is <b>216 DPI</b>, sharp on paper.
            </>
          )}{" "}
          {total > 1 ? "All pages come in one zip." : ""}
        </p>
      </div>

      <ActionBar total={`${plural(total, "page")} → ${plural(total, format.toUpperCase())}`}>
        <Button variant="primary" icon={FileImage} onClick={convert}>
          {`Convert ${plural(total, "page")}`}
        </Button>
      </ActionBar>
    </div>
  );
}
