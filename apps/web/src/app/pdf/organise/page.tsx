"use client";

import { useState } from "react";
import { ToolShell } from "@/components/ui/ToolShell";
import { FileDrop } from "@/components/ui/FileDrop";
import { Button } from "@/components/ui/Button";
import { rewritePages } from "@/lib/pdf";
import { renderPages } from "@/lib/pdf-render";
import { baseName, saveFile } from "@/lib/download";

type Page = { index: number; thumbnail: string };

export default function OrganisePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [rotations, setRotations] = useState<Record<number, number>>({});
  const [removed, setRemoved] = useState<Set<number>>(new Set());
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const keep = pages.map((p) => p.index).filter((i) => !removed.has(i));

  async function accept(picked: File[]) {
    const next = picked[0];
    if (!next) return;
    setStatus("Drawing pages…");
    setFile(next);
    setPages([]);
    setRotations({});
    setRemoved(new Set());
    try {
      await renderPages(next, { maxWidth: 220 }, (page) => {
        setPages((current) => [
          ...current,
          { index: page.index, thumbnail: page.canvas.toDataURL("image/png") },
        ]);
      });
      setStatus(null);
    } catch {
      setStatus("This file could not be read as a PDF.");
      setFile(null);
    }
  }

  function turn(index: number, by: number) {
    setRotations((current) => ({
      ...current,
      [index]: ((current[index] ?? 0) + by + 360) % 360,
    }));
  }

  function toggleRemoved(index: number) {
    setRemoved((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  async function save() {
    if (!file || keep.length === 0) return;
    setBusy(true);
    try {
      const bytes = await rewritePages(file, keep, rotations);
      saveFile(bytes, `${baseName(file.name)}-edited.pdf`, "application/pdf");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell
      category="pdf"
      title="Rotate & delete pages"
      blurb="Sideways scans and blank pages, fixed. Turn any page, mark the ones you don't want, then save a new PDF."
    >
      {!file ? (
        <FileDrop
          accept="application/pdf"
          label="Add a PDF"
          hint="Every page is drawn so you can see what you're changing"
          onFiles={accept}
        />
      ) : (
        <div className="space-y-6">
          <p className="text-[14px] text-ink-70">
            <strong className="font-semibold text-ink">{file.name}</strong>
            {pages.length > 0 && (
              <>
                {" "}
                &middot; keeping {keep.length} of {pages.length}
              </>
            )}
          </p>

          {status && <p className="text-[14px] text-ink-70">{status}</p>}

          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {pages.map((page) => {
              const gone = removed.has(page.index);
              const angle = rotations[page.index] ?? 0;
              return (
                <li
                  key={page.index}
                  className={`rounded-tile border-2 bg-card p-2.5 ${
                    gone ? "border-dashed border-rule" : "border-ink"
                  }`}
                >
                  <div className="flex h-36 items-center justify-center overflow-hidden bg-paper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={page.thumbnail}
                      alt={`Page ${page.index + 1}`}
                      style={{ transform: `rotate(${angle}deg)` }}
                      className={`max-h-full max-w-full transition-transform ${
                        gone ? "opacity-25" : ""
                      }`}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <span className="text-[13px] text-ink-40">
                      {page.index + 1}
                    </span>
                    <span className="flex gap-1">
                      <button
                        onClick={() => turn(page.index, -90)}
                        aria-label={`Rotate page ${page.index + 1} left`}
                        className="rounded-tile border-2 border-rule px-1.5 py-0.5 text-[13px] hover:border-ink"
                      >
                        &#8634;
                      </button>
                      <button
                        onClick={() => turn(page.index, 90)}
                        aria-label={`Rotate page ${page.index + 1} right`}
                        className="rounded-tile border-2 border-rule px-1.5 py-0.5 text-[13px] hover:border-ink"
                      >
                        &#8635;
                      </button>
                      <button
                        onClick={() => toggleRemoved(page.index)}
                        aria-pressed={gone}
                        className="rounded-tile border-2 border-rule px-1.5 py-0.5 text-[12px] font-medium hover:border-cat-pdf hover:text-cat-pdf"
                      >
                        {gone ? "Keep" : "Delete"}
                      </button>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={save} disabled={keep.length === 0 || busy}>
              {busy ? "Saving…" : "Save as new PDF"}
            </Button>
            <Button
              variant="quiet"
              onClick={() => {
                setFile(null);
                setPages([]);
              }}
            >
              Use a different PDF
            </Button>
            {keep.length === 0 && pages.length > 0 && (
              <span className="text-[13px] text-ink-40">
                Keep at least one page.
              </span>
            )}
          </div>
        </div>
      )}
    </ToolShell>
  );
}
