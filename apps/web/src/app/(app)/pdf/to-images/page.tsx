"use client";

import { useState } from "react";
import JSZip from "jszip";
import { ToolPage } from "@/components/ui/ToolPage";
import { DropField } from "@/components/ui/DropField";
import { Note } from "@/components/ui/Note";
import { Icon } from "@/components/ui/Icon";
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
  const [done, setDone] = useState({ page: 0, total: 0 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function convert() {
    if (!file || busy) return;
    setError(null);
    setBusy(true);
    setDone({ page: 0, total: 0 });
    setProgress("Reading the PDF…");
    try {
      const zip = new JSZip();
      const pages = await renderPages(
        file,
        { scale: QUALITY[quality].scale },
        (page, total) => {
          setDone({ page: page.index + 1, total });
          setProgress(`Drawing page ${page.index + 1} of ${total}`);
        },
      );
      const width = String(pages.length).length;
      for (const page of pages) {
        const blob = await canvasToBlob(page.canvas, "image/png");
        zip.file(
          `${baseName(file.name)}-${String(page.index + 1).padStart(width, "0")}.png`,
          blob,
        );
      }
      setProgress("Packing the zip…");
      const archive = await zip.generateAsync({ type: "uint8array" });
      saveFile(archive, `${baseName(file.name)}-images.zip`, "application/zip");
      setProgress(`${pages.length} images saved.`);
    } catch (cause) {
      setProgress(null);
      setDone({ page: 0, total: 0 });
      setError(
        cause instanceof Error
          ? cause.message
          : "That file could not be converted. Check it opens in a PDF reader.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPage
      hue="pdf"
      icon="image"
      section="PDF tools"
      sectionHref="/pdf"
      steps={[
        "Add a PDF",
        "Every page is drawn to a PNG in this tab",
        "Download them together in one zip",
      ]}
      title="PDF to images"
      blurb="Save every page as a PNG. They come down together in a zip, so a 40-page document is still one download."
    >
      {!file ? (
        <DropField
          accept="application/pdf"
          title="Add a PDF"
          hint="Each page becomes one PNG"
          onFiles={(picked) => picked[0] && setFile(picked[0])}
        />
      ) : (
        <>
          <div className="aio-card">
            <div className="aio-card-head">
              <h3>{file.name}</h3>
            </div>
            <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
              <legend
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: "var(--space-3)",
                }}
              >
                Quality
              </legend>
              <div style={{ display: "grid", gap: 12 }}>
                {(Object.keys(QUALITY) as QualityKey[]).map((key) => (
                  <label
                    key={key}
                    style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                  >
                    <input
                      type="radio"
                      name="quality"
                      checked={quality === key}
                      onChange={() => setQuality(key)}
                      style={{ marginTop: 4, accentColor: "var(--brand)" }}
                    />
                    <span>
                      <strong style={{ display: "block", fontSize: 14 }}>
                        {QUALITY[key].label}
                      </strong>
                      <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>
                        {QUALITY[key].note}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {error && <Note tone="error">{error}</Note>}
          {progress && !error && (
            <div className="aio-p-busy" aria-live="polite">
              <span>{progress}</span>
              {done.total > 0 && (
                <div className="aio-progress">
                  <i style={{ width: `${(done.page / done.total) * 100}%` }} />
                </div>
              )}
            </div>
          )}

          <div className="aio-p-actions">
            <button
              type="button"
              className="aio-btn aio-btn--primary"
              onClick={convert}
              disabled={busy}
            >
              <Icon name="download" />
              {busy ? "Converting…" : "Convert to PNGs"}
            </button>
            <button
              type="button"
              className="aio-btn aio-btn--ghost"
              onClick={() => setFile(null)}
            >
              Use a different PDF
            </button>
          </div>
        </>
      )}
    </ToolPage>
  );
}
