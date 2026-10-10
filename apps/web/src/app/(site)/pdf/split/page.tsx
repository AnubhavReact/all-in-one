"use client";

import { useState } from "react";
import JSZip from "jszip";
import { ToolPage } from "@/components/ui/ToolPage";
import { DropField } from "@/components/ui/DropField";
import { Note } from "@/components/ui/Note";
import { Icon } from "@/components/ui/Icon";
import { extractPages, pageCount, parsePageRange } from "@/lib/pdf";
import { baseName, saveFile } from "@/lib/download";

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [total, setTotal] = useState(0);
  const [range, setRange] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = total > 0 ? parsePageRange(range, total) : [];

  async function accept(picked: File[]) {
    const next = picked[0];
    if (!next) return;
    setError(null);
    try {
      const count = await pageCount(next);
      setFile(next);
      setTotal(count);
      setRange(`1-${count}`);
    } catch {
      setError("That file could not be read as a PDF. Check it opens in a PDF reader.");
    }
  }

  async function extract() {
    if (!file || selected.length === 0) return;
    setBusy(true);
    try {
      const bytes = await extractPages(file, selected);
      saveFile(bytes, `${baseName(file.name)}-pages.pdf`, "application/pdf");
    } finally {
      setBusy(false);
    }
  }

  async function splitEvery() {
    if (!file) return;
    setBusy(true);
    try {
      const zip = new JSZip();
      const width = String(total).length;
      for (let index = 0; index < total; index++) {
        const bytes = await extractPages(file, [index]);
        zip.file(
          `${baseName(file.name)}-${String(index + 1).padStart(width, "0")}.pdf`,
          bytes,
        );
      }
      const archive = await zip.generateAsync({ type: "uint8array" });
      saveFile(archive, `${baseName(file.name)}-pages.zip`, "application/zip");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPage
      hue="pdf"
      icon="split"
      section="PDF tools"
      sectionHref="/pdf"
      title="Split PDF"
      blurb="Take out the pages you need, or break the whole document into one file per page."
    >
      {!file ? (
        <>
          <DropField
            accept="application/pdf"
            title="Add a PDF"
            hint="We'll read how many pages it has"
            onFiles={accept}
          />
          {error && <Note tone="error">{error}</Note>}
        </>
      ) : (
        <>
          <div className="aio-card">
            <div className="aio-card-head">
              <h3>{file.name}</h3>
              <span className="aio-badge aio-badge--plain">
                {total} {total === 1 ? "page" : "pages"}
              </span>
            </div>

            <div className="aio-field">
              <label htmlFor="range">Pages to keep</label>
              <span className="hint">
                Commas and dashes, the same as a print dialog. Leave a dash open
                to mean &ldquo;to the end&rdquo;.
              </span>
              <div className="aio-input">
                <Icon name="file" />
                <input
                  id="range"
                  value={range}
                  onChange={(event) => setRange(event.target.value)}
                  placeholder={`1-3, 7, 10-${total}`}
                />
              </div>
              <span className="hint">
                {selected.length === 0
                  ? "No pages match that yet."
                  : `${selected.length} ${selected.length === 1 ? "page" : "pages"}: ${selected
                      .map((i) => i + 1)
                      .join(", ")}`}
              </span>
            </div>
          </div>

          <div className="aio-p-actions">
            <button
              type="button"
              className="aio-btn aio-btn--primary"
              onClick={extract}
              disabled={selected.length === 0 || busy}
            >
              <Icon name="download" />
              {busy ? "Working…" : "Download these pages"}
            </button>
            <button
              type="button"
              className="aio-btn aio-btn--secondary"
              onClick={splitEvery}
              disabled={busy}
            >
              Every page as its own file
            </button>
            <button
              type="button"
              className="aio-btn aio-btn--ghost"
              onClick={() => {
                setFile(null);
                setTotal(0);
                setRange("");
              }}
            >
              Use a different PDF
            </button>
          </div>
        </>
      )}
    </ToolPage>
  );
}
