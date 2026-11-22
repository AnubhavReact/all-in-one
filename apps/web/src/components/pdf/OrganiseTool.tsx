"use client";

import { useState } from "react";
import clsx from "clsx";
import { RotateCcw, RotateCw, Save, Trash2, Undo2 } from "lucide-react";
import { Button, IconButton } from "@/components/ui/Button";
import { DropZone } from "@/components/ui/DropZone";
import { baseName } from "@/lib/download";
import { renderPages } from "@/lib/pdf-render";
import { plural, type Picked } from "./files";
import { ActionBar, ErrorNote, FileRow, ResultCard, Working } from "./Parts";
import { remember, toBlob, type Result } from "./save";
import { useSinglePdf } from "./useSinglePdf";
import s from "./Pdf.module.css";

type Thumb = { index: number; src: string };

export function OrganiseTool() {
  const [thumbs, setThumbs] = useState<Thumb[]>([]);
  const [drawn, setDrawn] = useState<{ done: number; total: number } | null>(null);
  const [rotations, setRotations] = useState<Record<number, number>>({});
  const [removed, setRemoved] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function draw(item: Picked) {
    setThumbs([]);
    setRotations({});
    setRemoved(new Set());
    setDrawn({ done: 0, total: item.pages ?? 1 });
    try {
      await renderPages(item.file, { maxWidth: 220 }, (page, total) => {
        const src = page.canvas.toDataURL("image/jpeg", 0.8);
        setThumbs((current) => [...current, { index: page.index, src }]);
        setDrawn({ done: page.index + 1, total });
      });
    } finally {
      setDrawn(null);
    }
  }

  const pdf = useSinglePdf(draw);
  const total = pdf.item?.pages ?? 0;
  const keep = Array.from({ length: total }, (_, i) => i).filter((i) => !removed.has(i));
  const turned = Object.entries(rotations).filter(([i, deg]) => deg !== 0 && !removed.has(Number(i))).length;
  const changed = turned > 0 || removed.size > 0;

  function turn(index: number, by: number) {
    setRotations((current) => ({ ...current, [index]: ((current[index] ?? 0) + by + 360) % 360 }));
  }

  function toggle(index: number) {
    setRemoved((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function reset() {
    pdf.clear();
    setThumbs([]);
    setResult(null);
    setRotations({});
    setRemoved(new Set());
  }

  async function save() {
    const item = pdf.item;
    if (!item || keep.length === 0) return;
    setSaving(true);
    try {
      const { rewritePages } = await import("@/lib/pdf");
      const data = await rewritePages(item.file, keep, rotations);
      const done: Result = {
        blob: toBlob(data, "application/pdf"),
        name: `${baseName(item.file.name)}-edited.pdf`,
        facts: [plural(keep.length, "page")],
      };
      remember(done, "Rotate & delete pages", "rotate");
      setResult(done);
    } catch {
      pdf.setError("This PDF couldn't be saved. Check it opens in a PDF reader.");
    } finally {
      setSaving(false);
    }
  }

  if (result) return <ResultCard result={result} onReset={reset} />;
  if (saving) return <Working label={`Saving ${plural(keep.length, "page")} in this tab…`} done={1} total={2} />;
  if (pdf.loading) return <Working label="Reading the PDF…" done={0} total={1} />;
  if (!pdf.item) {
    return <DropZone files={[]} error={pdf.error} onFiles={pdf.accept} onRemove={() => {}} noun="a PDF" />;
  }

  const summary = [
    `Keeping ${keep.length} of ${total}`,
    turned > 0 ? `${turned} turned` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className={s.stack}>
      <FileRow item={pdf.item} onRemove={reset} />
      {pdf.error && <ErrorNote>{pdf.error}</ErrorNote>}
      {drawn && <Working label={`Drawing page ${drawn.done} of ${drawn.total}…`} done={drawn.done} total={drawn.total} />}

      <ul className={s.pages} aria-label="Pages">
        {thumbs.map(({ index, src }) => {
          const n = index + 1;
          const gone = removed.has(index);
          const angle = rotations[index] ?? 0;
          return (
            <li key={index} className={clsx(s.page, gone && s.removed)}>
              <div className={s.shot}>
                {gone && <span className={s.removedTag}>Deleted</span>}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Page ${n}${angle ? `, turned ${angle} degrees` : ""}${gone ? ", will be deleted" : ""}`}
                  style={{ transform: `rotate(${angle}deg)${angle % 180 ? " scale(0.72)" : ""}` }}
                />
              </div>
              <div className={s.pageBar}>
                <span className={s.pageNum}>{n}</span>
                <span className={s.pageOps}>
                  <IconButton icon={RotateCcw} label={`Rotate page ${n} left`} onClick={() => turn(index, -90)} disabled={gone} />
                  <IconButton icon={RotateCw} label={`Rotate page ${n} right`} onClick={() => turn(index, 90)} disabled={gone} />
                  <IconButton
                    icon={gone ? Undo2 : Trash2}
                    label={gone ? `Keep page ${n}` : `Delete page ${n}`}
                    onClick={() => toggle(index)}
                  />
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <ActionBar total={summary}>
        <Button variant="primary" icon={Save} onClick={save} disabled={!changed || keep.length === 0 || !!drawn}>
          {keep.length === 0 ? "Keep at least 1 page" : changed ? "Save new PDF" : "Rotate or delete a page"}
        </Button>
      </ActionBar>
    </div>
  );
}
