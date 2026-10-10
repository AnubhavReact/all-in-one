"use client";

import { useState } from "react";
import JSZip from "jszip";
import { ToolShell } from "@/components/ui/ToolShell";
import { FileDrop } from "@/components/ui/FileDrop";
import { Button } from "@/components/ui/Button";
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
      setError("This file could not be read as a PDF.");
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
        const label = String(index + 1).padStart(width, "0");
        zip.file(`${baseName(file.name)}-${label}.pdf`, bytes);
      }
      const archive = await zip.generateAsync({ type: "uint8array" });
      saveFile(archive, `${baseName(file.name)}-pages.zip`, "application/zip");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell
      category="pdf"
      title="Split PDF"
      blurb="Take out the pages you need, or break the whole document into one file per page."
    >
      {!file ? (
        <>
          <FileDrop
            accept="application/pdf"
            label="Add a PDF"
            hint="We'll read how many pages it has"
            onFiles={accept}
          />
          {error && (
            <p className="mt-4 border-l-4 border-cat-pdf bg-card py-2 pl-4 text-[14px]">
              {error}
            </p>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <p className="text-[14px] text-ink-70">
            <strong className="font-semibold text-ink">{file.name}</strong>{" "}
            &middot; {total} {total === 1 ? "page" : "pages"}
          </p>

          <div className="rounded-tile border-2 border-rule bg-card p-5">
            <label
              htmlFor="range"
              className="block text-[14px] font-semibold"
            >
              Pages to keep
            </label>
            <p className="mt-1 text-[13px] text-ink-70">
              Use commas and dashes, the same as a print dialog. Leaving a
              dash open means &ldquo;to the end&rdquo;.
            </p>
            <input
              id="range"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              placeholder={`1-3, 7, 10-${total}`}
              className="mt-3 w-full rounded-tile border-2 border-rule bg-paper px-3 py-2 text-[15px] focus:border-ink focus:outline-none"
            />
            <p className="mt-2 text-[13px] text-ink-70">
              {selected.length === 0
                ? "No pages match that yet."
                : `${selected.length} ${
                    selected.length === 1 ? "page" : "pages"
                  }: ${selected.map((i) => i + 1).join(", ")}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={extract} disabled={selected.length === 0 || busy}>
              {busy ? "Working…" : "Download these pages"}
            </Button>
            <Button variant="quiet" onClick={splitEvery} disabled={busy}>
              Every page as its own file
            </Button>
            <Button
              variant="quiet"
              onClick={() => {
                setFile(null);
                setTotal(0);
                setRange("");
              }}
            >
              Use a different PDF
            </Button>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
