"use client";

import { useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { CheckCircle2, CircleAlert, Download, FileText, RotateCcw, Upload, X } from "lucide-react";
import { Button, IconButton } from "@/components/ui/Button";
import { bytes } from "@/lib/format";
import { fileMeta, type Picked } from "./files";
import { download, type Result } from "./save";
import s from "./Pdf.module.css";

/** The red note under a drop area, same as DropZone's. */
export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p className={s.error} role="alert">
      <CircleAlert aria-hidden strokeWidth={2} />
      {children}
    </p>
  );
}

/**
 * The compact "add more" drop bar shown once a list has files. It matches
 * DropZone's compact state; DropZone itself renders its own list, which the
 * sortable list replaces.
 */
export function AddMore({
  onFiles,
  accept,
  noun,
}: {
  onFiles: (files: File[]) => void;
  accept: string;
  noun: string;
}) {
  const picker = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const depth = useRef(0);
  return (
    <div
      className={clsx(s.addMore, over && s.over)}
      onDragEnter={(event) => {
        event.preventDefault();
        depth.current += 1;
        setOver(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => {
        depth.current -= 1;
        if (depth.current <= 0) setOver(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        depth.current = 0;
        setOver(false);
        onFiles(Array.from(event.dataTransfer.files));
      }}
    >
      <strong>{over ? "Release to add them" : `Drop more ${noun} here, or`}</strong>
      <Button variant="secondary" icon={Upload} onClick={() => picker.current?.click()}>
        Add more
      </Button>
      <input
        ref={picker}
        type="file"
        accept={accept}
        multiple
        hidden
        onChange={(event) => {
          if (event.target.files) onFiles(Array.from(event.target.files));
          event.target.value = "";
        }}
      />
    </div>
  );
}

/** One chosen file, for the single-file tools. Remove goes back to the drop area. */
export function FileRow({ item, onRemove }: { item: Picked; onRemove: () => void }) {
  return (
    <div className={clsx(s.row, s.single)}>
      <span className={s.fileTile} aria-hidden>
        <FileText strokeWidth={1.8} />
      </span>
      <span className={s.name}>
        <strong>{item.file.name}</strong>
        <span className={s.meta}>{fileMeta(item)}</span>
      </span>
      <IconButton icon={X} label={`Remove ${item.file.name}`} onClick={onRemove} />
    </div>
  );
}

/** Summary on the left, the one primary action on the right. */
export function ActionBar({ total, children }: { total: ReactNode; children: ReactNode }) {
  return (
    <div className={s.bar}>
      <span className={s.total}>{total}</span>
      <div className={s.barActions}>{children}</div>
    </div>
  );
}

/** A progress bar and a sentence, announced as it changes. */
export function Working({ label, done, total }: { label: string; done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className={s.working}>
      <p aria-live="polite">{label}</p>
      <div
        className={s.track}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div className={s.fill} style={{ width: `${Math.max(pct, 4)}%` }} />
      </div>
      <small>Nothing leaves this tab while it works.</small>
    </div>
  );
}

/** "merged.pdf is ready · 4 pages · 1.5 MB · 0 bytes uploaded", Download, Start over. */
export function ResultCard({ result, onReset }: { result: Result; onReset: () => void }) {
  return (
    <section className={s.result} aria-live="polite" aria-label="Result">
      <CheckCircle2 aria-hidden strokeWidth={1.8} />
      <div>
        <h2>{result.name} is ready</h2>
        <p className={s.resultMeta}>
          {[...result.facts, bytes(result.blob.size)].map((fact) => (
            <span key={fact}>{fact} ·</span>
          ))}
          <span className={s.zero}>0 bytes uploaded</span>
        </p>
      </div>
      <div className={s.resultActions}>
        <Button variant="primary" icon={Download} onClick={() => download(result)}>
          Download
        </Button>
        <Button variant="secondary" icon={RotateCcw} onClick={onReset}>
          Start over
        </Button>
      </div>
    </section>
  );
}
