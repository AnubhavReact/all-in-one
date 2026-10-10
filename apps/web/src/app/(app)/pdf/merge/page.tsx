"use client";

import { useState } from "react";
import { formatBytes } from "@aio/core";
import { ToolPage } from "@/components/ui/ToolPage";
import { DropField } from "@/components/ui/DropField";
import { Note } from "@/components/ui/Note";
import { Icon } from "@/components/ui/Icon";
import { mergeDocuments, pageCount } from "@/lib/pdf";
import { saveFile } from "@/lib/download";

/** A file, with its page count once we have read it. */
type Picked = { file: File; pages: number | null };

export default function MergePdf() {
  const [files, setFiles] = useState<Picked[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = files.reduce((sum, row) => sum + (row.pages ?? 0), 0);
  const counted = files.every((row) => row.pages !== null);

  /**
   * Reading the page count is what tells someone they picked the right file,
   * and it is cheap — pdf-lib has to parse the document to merge it anyway.
   */
  function add(picked: File[]) {
    const rows = picked
      .filter((f) => f.type === "application/pdf")
      .map((file) => ({ file, pages: null }));
    setFiles((current) => [...current, ...rows]);

    for (const row of rows) {
      pageCount(row.file)
        .then((pages) =>
          setFiles((current) =>
            current.map((item) =>
              item.file === row.file ? { ...item, pages } : item,
            ),
          ),
        )
        .catch(() => {
          // A file we cannot read will fail again, with a message, on merge.
        });
    }
  }

  function move(index: number, by: number) {
    const next = [...files];
    const target = index + by;
    if (target < 0 || target >= next.length) return;
    const a = next[index];
    const b = next[target];
    if (!a || !b) return;
    next[index] = b;
    next[target] = a;
    setFiles(next);
  }

  async function merge() {
    setBusy(true);
    setError(null);
    try {
      const bytes = await mergeDocuments(files.map((row) => row.file));
      saveFile(bytes, "merged.pdf", "application/pdf");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? `One of these files could not be read: ${cause.message}`
          : "One of these files could not be read. Try opening it in a PDF reader first.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPage
      hue="pdf"
      icon="merge"
      section="PDF tools"
      sectionHref="/pdf"
      steps={[
        "Add two or more PDFs",
        "Use the arrows to set the order",
        "Download one merged file",
      ]}
      title="Merge PDFs"
      blurb="Add two or more PDFs, put them in the order you want, and download one file."
    >
      <DropField
        accept="application/pdf"
        multiple
        title={files.length > 0 ? "Add more PDFs" : "Add PDFs"}
        hint="Drop them here, or add a few at a time"
        compact={files.length > 0}
        onFiles={add}
      />

      {files.length > 0 && (
        <>
          <ol className="aio-p-files">
            {files.map(({ file, pages }, index) => (
              <li className="aio-p-file" key={`${file.name}-${index}`}>
                <span className="idx">{index + 1}</span>
                <span className="name">{file.name}</span>
                <span className="size">
                  {pages === null ? "…" : `${pages} page${pages === 1 ? "" : "s"}`}
                  {" · "}
                  {formatBytes(file.size)}
                </span>
                <span className="ops">
                  <button
                    type="button"
                    className="aio-btn aio-btn--ghost aio-btn--sm"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${file.name} up`}
                  >
                    &uarr;
                  </button>
                  <button
                    type="button"
                    className="aio-btn aio-btn--ghost aio-btn--sm"
                    onClick={() => move(index, 1)}
                    disabled={index === files.length - 1}
                    aria-label={`Move ${file.name} down`}
                  >
                    &darr;
                  </button>
                  <button
                    type="button"
                    className="aio-btn aio-btn--ghost aio-btn--sm"
                    onClick={() => setFiles(files.filter((_, i) => i !== index))}
                    aria-label={`Remove ${file.name}`}
                  >
                    &times;
                  </button>
                </span>
              </li>
            ))}
          </ol>

          {error && <Note tone="error">{error}</Note>}

          <div className="aio-p-actions">
            <button
              type="button"
              className="aio-btn aio-btn--primary"
              onClick={merge}
              disabled={files.length < 2 || busy}
            >
              <Icon name="download" />
              {busy
                ? "Merging…"
                : counted && total > 0
                  ? `Merge ${files.length} PDFs · ${total} pages`
                  : `Merge ${files.length} PDFs`}
            </button>
            <button
              type="button"
              className="aio-btn aio-btn--secondary"
              onClick={() => setFiles([])}
            >
              Clear
            </button>
            {files.length < 2 && (
              <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>
                Add one more to merge.
              </span>
            )}
          </div>
        </>
      )}
    </ToolPage>
  );
}
