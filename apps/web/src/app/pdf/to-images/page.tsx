"use client";

import { useState } from "react";
import JSZip from "jszip";
import { ToolShell } from "@/components/ui/ToolShell";
import { FileDrop } from "@/components/ui/FileDrop";
import { Button } from "@/components/ui/Button";
import { canvasToBlob, renderPages } from "@/lib/pdf-render";
import { baseName, saveFile } from "@/lib/download";

const QUALITY = {
  screen: { scale: 1.5, label: "Screen", note: "Smaller files, fine on a phone" },
  print: { scale: 3, label: "Print", note: "Sharp enough to print" },
} as const;

type QualityKey = keyof typeof QUALITY;

export default function PdfToImages() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<QualityKey>("screen");
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function convert() {
    if (!file) return;
    setError(null);
    setProgress("Reading the PDF…");
    try {
      const zip = new JSZip();
      const pages = await renderPages(
        file,
        { scale: QUALITY[quality].scale },
        (page) => setProgress(`Page ${page.index + 1} done`),
      );
      const width = String(pages.length).length;
      for (const page of pages) {
        const blob = await canvasToBlob(page.canvas, "image/png");
        const label = String(page.index + 1).padStart(width, "0");
        zip.file(`${baseName(file.name)}-${label}.png`, blob);
      }
      setProgress("Packing the zip…");
      const archive = await zip.generateAsync({ type: "uint8array" });
      saveFile(archive, `${baseName(file.name)}-images.zip`, "application/zip");
      setProgress(`${pages.length} images saved.`);
    } catch (cause) {
      setProgress(null);
      setError(
        cause instanceof Error
          ? cause.message
          : "This file could not be converted.",
      );
    }
  }

  return (
    <ToolShell
      category="pdf"
      title="PDF to images"
      blurb="Save every page as a PNG. They come down together in a zip, so a 40-page document is still one download."
    >
      {!file ? (
        <FileDrop
          accept="application/pdf"
          label="Add a PDF"
          hint="Each page becomes one PNG"
          onFiles={(picked) => picked[0] && setFile(picked[0])}
        />
      ) : (
        <div className="space-y-6">
          <p className="text-[14px] text-ink-70">
            <strong className="font-semibold text-ink">{file.name}</strong>
          </p>

          <fieldset className="rounded-tile border-2 border-rule bg-card p-5">
            <legend className="px-1 text-[14px] font-semibold">Quality</legend>
            <div className="mt-1 space-y-2.5">
              {(Object.keys(QUALITY) as QualityKey[]).map((key) => (
                <label key={key} className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="quality"
                    checked={quality === key}
                    onChange={() => setQuality(key)}
                    className="mt-1 accent-ink"
                  />
                  <span>
                    <span className="block text-[14px] font-medium">
                      {QUALITY[key].label}
                    </span>
                    <span className="block text-[13px] text-ink-70">
                      {QUALITY[key].note}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {error && (
            <p className="border-l-4 border-cat-pdf bg-card py-2 pl-4 text-[14px]">
              {error}
            </p>
          )}
          {progress && !error && (
            <p aria-live="polite" className="text-[14px] text-ink-70">
              {progress}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button onClick={convert}>Convert to PNGs</Button>
            <Button variant="quiet" onClick={() => setFile(null)}>
              Use a different PDF
            </Button>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
