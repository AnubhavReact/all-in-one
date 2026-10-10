"use client";

import { useEffect, useRef, useState } from "react";
import { formatBytes } from "@aio/core";
import { ToolPage } from "@/components/ui/ToolPage";
import { DropField } from "@/components/ui/DropField";
import { Note } from "@/components/ui/Note";
import { Icon } from "@/components/ui/Icon";
import { imagesToPdf } from "@/lib/pdf";
import { saveFile } from "@/lib/download";

const ALLOWED = ["image/png", "image/jpeg"];

/** A chosen image together with the object URL that previews it. */
type Picked = { file: File; url: string };

export default function ImagesToPdf() {
  const [images, setImages] = useState<Picked[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Every URL ever created, so none is left behind when the page unmounts.
  const created = useRef<string[]>([]);
  useEffect(() => {
    const urls = created.current;
    return () => urls.forEach(URL.revokeObjectURL);
  }, []);

  function add(files: File[]) {
    const picked = files.map((file) => {
      const url = URL.createObjectURL(file);
      created.current.push(url);
      return { file, url };
    });
    setImages((current) => [...current, ...picked]);
  }

  function remove(index: number) {
    const gone = images[index];
    if (gone) URL.revokeObjectURL(gone.url);
    setImages(images.filter((_, i) => i !== index));
  }

  function clear() {
    images.forEach((image) => URL.revokeObjectURL(image.url));
    setImages([]);
  }

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
      const bytes = await imagesToPdf(images.map((image) => image.file));
      saveFile(bytes, "images.pdf", "application/pdf");
    } catch {
      setError(
        "One of these images could not be read. PNG and JPEG both work; HEIC photos from an iPhone do not yet — save them as JPEG first.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPage
      hue="pdf"
      icon="file"
      section="PDF tools"
      sectionHref="/pdf"
      steps={[
        "Add JPGs or PNGs",
        "Put them in the order you want",
        "Download one PDF",
      ]}
      title="Images to PDF"
      blurb="Photos of documents, screenshots or scans, stacked into one PDF in the order you set."
    >
      <DropField
        accept="image/png,image/jpeg"
        multiple
        title="Add images"
        hint="PNG or JPEG, one page per image"
        onFiles={(picked) => {
          const good = picked.filter((f) => ALLOWED.includes(f.type));
          setError(
            good.length < picked.length
              ? "Skipped files that were not PNG or JPEG."
              : null,
          );
          add(good);
        }}
      />

      {images.length > 0 && (
        <>
          <ol className="aio-p-pages">
            {images.map((image, index) => (
              <li className="aio-p-page" key={`${image.file.name}-${index}`}>
                <div className="shot" style={{ height: 120 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.url} alt={image.file.name} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 13,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {image.file.name}
                  </strong>
                  <span className="num">{formatBytes(image.file.size)}</span>
                </div>
                <div className="bar">
                  <span style={{ display: "flex", gap: 4 }}>
                    <button
                      type="button"
                      className="aio-btn aio-btn--ghost aio-btn--sm"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label={`Move ${image.file.name} earlier`}
                    >
                      &larr;
                    </button>
                    <button
                      type="button"
                      className="aio-btn aio-btn--ghost aio-btn--sm"
                      onClick={() => move(index, 1)}
                      disabled={index === images.length - 1}
                      aria-label={`Move ${image.file.name} later`}
                    >
                      &rarr;
                    </button>
                  </span>
                  <button
                    type="button"
                    className="aio-btn aio-btn--ghost aio-btn--sm"
                    onClick={() => remove(index)}
                    aria-label={`Remove ${image.file.name}`}
                  >
                    &times;
                  </button>
                </div>
              </li>
            ))}
          </ol>

          {error && <Note tone="error">{error}</Note>}

          <div className="aio-p-actions">
            <button
              type="button"
              className="aio-btn aio-btn--primary"
              onClick={build}
              disabled={busy}
            >
              <Icon name="download" />
              {busy
                ? "Building…"
                : `Make a PDF of ${images.length} ${images.length === 1 ? "image" : "images"}`}
            </button>
            <button
              type="button"
              className="aio-btn aio-btn--secondary"
              onClick={clear}
            >
              Clear
            </button>
          </div>
        </>
      )}
    </ToolPage>
  );
}
