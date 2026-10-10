"use client";

import { useState } from "react";
import { formatBytes } from "@aio/core";
import { ToolShell } from "@/components/ui/ToolShell";
import { FileDrop } from "@/components/ui/FileDrop";
import { Button } from "@/components/ui/Button";
import { imagesToPdf } from "@/lib/pdf";
import { saveFile } from "@/lib/download";

const ALLOWED = ["image/png", "image/jpeg"];

export default function ImagesToPdf() {
  const [images, setImages] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function move(index: number, by: number) {
    const next = [...images];
    const target = index + by;
    if (target < 0 || target >= next.length) return;
    const a = next[index];
    const b = next[target];
    if (!a || !b) return;
    next[index] = b;
    next[target] = a;
    setImages(next);
  }

  async function build() {
    setBusy(true);
    setError(null);
    try {
      const bytes = await imagesToPdf(images);
      saveFile(bytes, "images.pdf", "application/pdf");
    } catch {
      setError(
        "One of these images could not be read. PNG and JPEG both work; HEIC photos from an iPhone do not yet.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell
      category="pdf"
      title="Images to PDF"
      blurb="Photos of documents, screenshots or scans, stacked into one PDF in the order you set."
    >
      <FileDrop
        accept="image/png,image/jpeg"
        multiple
        label="Add images"
        hint="PNG or JPEG, one page per image"
        onFiles={(picked) => {
          const good = picked.filter((f) => ALLOWED.includes(f.type));
          if (good.length < picked.length) {
            setError("Skipped files that were not PNG or JPEG.");
          }
          setImages((current) => [...current, ...good]);
        }}
      />

      {images.length > 0 && (
        <div className="space-y-4">
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((image, index) => (
              <li
                key={`${image.name}-${index}`}
                className="rounded-tile border-2 border-rule bg-card p-2.5"
              >
                <div className="flex h-28 items-center justify-center overflow-hidden bg-paper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(image)}
                    alt={image.name}
                    className="max-h-full max-w-full"
                  />
                </div>
                <p className="mt-2 truncate text-[13px] font-medium">
                  {image.name}
                </p>
                <p className="text-[12px] text-ink-40">
                  {formatBytes(image.size)}
                </p>
                <div className="mt-1.5 flex gap-1">
                  <button
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${image.name} earlier`}
                    className="rounded-tile border-2 border-rule px-2 py-0.5 text-[13px] enabled:hover:border-ink disabled:opacity-30"
                  >
                    &larr;
                  </button>
                  <button
                    onClick={() => move(index, 1)}
                    disabled={index === images.length - 1}
                    aria-label={`Move ${image.name} later`}
                    className="rounded-tile border-2 border-rule px-2 py-0.5 text-[13px] enabled:hover:border-ink disabled:opacity-30"
                  >
                    &rarr;
                  </button>
                  <button
                    onClick={() =>
                      setImages(images.filter((_, i) => i !== index))
                    }
                    aria-label={`Remove ${image.name}`}
                    className="ml-auto rounded-tile border-2 border-rule px-2 py-0.5 text-[13px] hover:border-cat-pdf hover:text-cat-pdf"
                  >
                    &times;
                  </button>
                </div>
              </li>
            ))}
          </ol>

          {error && (
            <p className="border-l-4 border-cat-pdf bg-card py-2 pl-4 text-[14px]">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button onClick={build} disabled={busy}>
              {busy
                ? "Building…"
                : `Make a PDF of ${images.length} ${
                    images.length === 1 ? "image" : "images"
                  }`}
            </Button>
            <Button variant="quiet" onClick={() => setImages([])}>
              Clear
            </Button>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
