"use client";

import { useState } from "react";
import { formatBytes } from "@aio/core";
import { ToolPage } from "@/components/ui/ToolPage";
import { DropField } from "@/components/ui/DropField";
import { Note } from "@/components/ui/Note";
import { Icon } from "@/components/ui/Icon";
import { mergeDocuments } from "@/lib/pdf";
import { saveFile } from "@/lib/download";

export default function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const bytes = await mergeDocuments(files);
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
      title="Merge PDFs"
      blurb="Add two or more PDFs, put them in the order you want, and download one file."
    >
      <DropField
        accept="application/pdf"
        multiple
        title="Add PDFs"
        hint="Drop them here, or add a few at a time"
        onFiles={(picked) =>
          setFiles((current) => [
            ...current,
            ...picked.filter((f) => f.type === "application/pdf"),
          ])
        }
      />

      {files.length > 0 && (
        <>
          <ol className="aio-p-files">
            {files.map((file, index) => (
              <li className="aio-p-file" key={`${file.name}-${index}`}>
                <span className="idx">{index + 1}</span>
                <span className="name">{file.name}</span>
                <span className="size">{formatBytes(file.size)}</span>
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
              {busy ? "Merging…" : `Merge ${files.length} PDFs`}
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
