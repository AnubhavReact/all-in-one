"use client";

import { useState } from "react";
import { formatBytes } from "@aio/core";
import { ToolShell } from "@/components/ui/ToolShell";
import { FileDrop } from "@/components/ui/FileDrop";
import { Button } from "@/components/ui/Button";
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
          : "One of these files could not be read.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell
      category="pdf"
      title="Merge PDFs"
      blurb="Add two or more PDFs, put them in the order you want, and download one file."
    >
      <FileDrop
        accept="application/pdf"
        multiple
        label="Add PDFs"
        hint="Drop them here, or add a few at a time"
        onFiles={(picked) =>
          setFiles((current) => [
            ...current,
            ...picked.filter((f) => f.type === "application/pdf"),
          ])
        }
      />

      {files.length > 0 && (
        <div className="space-y-4">
          <ol className="space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-tile border-2 border-rule bg-card px-3 py-2.5"
              >
                <span className="w-6 shrink-0 text-[13px] text-ink-40">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-[14px] font-medium">
                  {file.name}
                </span>
                <span className="shrink-0 text-[13px] text-ink-40">
                  {formatBytes(file.size)}
                </span>
                <span className="flex shrink-0 gap-1">
                  <button
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${file.name} up`}
                    className="rounded-tile border-2 border-rule px-2 py-0.5 text-[13px] enabled:hover:border-ink disabled:opacity-30"
                  >
                    &uarr;
                  </button>
                  <button
                    onClick={() => move(index, 1)}
                    disabled={index === files.length - 1}
                    aria-label={`Move ${file.name} down`}
                    className="rounded-tile border-2 border-rule px-2 py-0.5 text-[13px] enabled:hover:border-ink disabled:opacity-30"
                  >
                    &darr;
                  </button>
                  <button
                    onClick={() =>
                      setFiles(files.filter((_, i) => i !== index))
                    }
                    aria-label={`Remove ${file.name}`}
                    className="rounded-tile border-2 border-rule px-2 py-0.5 text-[13px] hover:border-cat-pdf hover:text-cat-pdf"
                  >
                    &times;
                  </button>
                </span>
              </li>
            ))}
          </ol>

          {error && (
            <p className="border-l-4 border-cat-pdf bg-card py-2 pl-4 text-[14px]">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={merge} disabled={files.length < 2 || busy}>
              {busy ? "Merging…" : `Merge ${files.length} PDFs`}
            </Button>
            <Button variant="quiet" onClick={() => setFiles([])}>
              Clear
            </Button>
            {files.length < 2 && (
              <span className="text-[13px] text-ink-40">
                Add one more to merge.
              </span>
            )}
          </div>
        </div>
      )}
    </ToolShell>
  );
}
