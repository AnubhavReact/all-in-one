"use client";

import { useState } from "react";
import { ToolPage } from "@/components/ui/ToolPage";
import { DropField } from "@/components/ui/DropField";
import { Note } from "@/components/ui/Note";
import { Icon } from "@/components/ui/Icon";
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
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const keep = pages.map((p) => p.index).filter((i) => !removed.has(i));

  async function accept(picked: File[]) {
    const next = picked[0];
    if (!next) return;
    setError(null);
    setStatus("Drawing pages…");
    setFile(next);
    setPages([]);
    setRotations({});
    setRemoved(new Set());
    try {
      await renderPages(next, { maxWidth: 240 }, (page) => {
        setPages((current) => [
          ...current,
          { index: page.index, thumbnail: page.canvas.toDataURL("image/png") },
        ]);
      });
      setStatus(null);
    } catch {
      setStatus(null);
      setError("That file could not be read as a PDF. Check it opens in a PDF reader.");
      setFile(null);
    }
  }

  function turn(index: number, by: number) {
    setRotations((current) => ({
      ...current,
      [index]: ((current[index] ?? 0) + by + 360) % 360,
    }));
  }

  function toggle(index: number) {
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
    <ToolPage
      hue="pdf"
      icon="rotate"
      section="PDF tools"
      sectionHref="/pdf"
      title="Rotate & delete pages"
      blurb="Sideways scans and blank pages, fixed. Turn any page, mark the ones you don't want, then save a new PDF."
    >
      {!file ? (
        <>
          <DropField
            accept="application/pdf"
            title="Add a PDF"
            hint="Every page is drawn so you can see what you're changing"
            onFiles={accept}
          />
          {error && <Note tone="error">{error}</Note>}
        </>
      ) : (
        <>
          <div className="aio-card-head" style={{ marginBottom: 0 }}>
            <h3>{file.name}</h3>
            {pages.length > 0 && (
              <span className="aio-badge aio-badge--plain">
                keeping {keep.length} of {pages.length}
              </span>
            )}
          </div>

          {status && <Note icon="clock">{status}</Note>}

          <ul className="aio-p-pages">
            {pages.map((page) => {
              const gone = removed.has(page.index);
              const angle = rotations[page.index] ?? 0;
              return (
                <li
                  key={page.index}
                  className={gone ? "aio-p-page aio-p-page--off" : "aio-p-page"}
                >
                  <div className="shot">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={page.thumbnail}
                      alt={`Page ${page.index + 1}`}
                      style={{ transform: `rotate(${angle}deg)` }}
                    />
                  </div>
                  <div className="bar">
                    <span className="num">{page.index + 1}</span>
                    <span className="ops" style={{ display: "flex", gap: 4 }}>
                      <button
                        type="button"
                        className="aio-btn aio-btn--ghost aio-btn--sm"
                        onClick={() => turn(page.index, -90)}
                        aria-label={`Rotate page ${page.index + 1} left`}
                      >
                        &#8634;
                      </button>
                      <button
                        type="button"
                        className="aio-btn aio-btn--ghost aio-btn--sm"
                        onClick={() => turn(page.index, 90)}
                        aria-label={`Rotate page ${page.index + 1} right`}
                      >
                        &#8635;
                      </button>
                      <button
                        type="button"
                        className="aio-btn aio-btn--ghost aio-btn--sm"
                        onClick={() => toggle(page.index)}
                        aria-pressed={gone}
                      >
                        {gone ? "Keep" : "Delete"}
                      </button>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="aio-p-actions">
            <button
              type="button"
              className="aio-btn aio-btn--primary"
              onClick={save}
              disabled={keep.length === 0 || busy}
            >
              <Icon name="download" />
              {busy ? "Saving…" : "Save as new PDF"}
            </button>
            <button
              type="button"
              className="aio-btn aio-btn--ghost"
              onClick={() => {
                setFile(null);
                setPages([]);
              }}
            >
              Use a different PDF
            </button>
            {keep.length === 0 && pages.length > 0 && (
              <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>
                Keep at least one page.
              </span>
            )}
          </div>
        </>
      )}
    </ToolPage>
  );
}
