"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { CircleAlert, FileText, GripVertical, ShieldCheck, Upload, X } from "lucide-react";
import { bytes } from "@/lib/format";
import { Button, IconButton } from "./Button";
import { IconTile } from "./IconTile";
import s from "./DropZone.module.css";

export type DropFile = { id: string; name: string; size: number; pages?: number };

/**
 * Four states: empty, drag-over, files added, error. The parent owns the
 * list and the error; this only reports what was dropped or picked.
 *
 * The zone is clickable with a mouse; keyboard users get the real
 * "Choose files" button inside it (a focusable zone around a button would
 * be two nested controls).
 */
export function DropZone({
  files,
  error,
  onFiles,
  onRemove,
  accept = ".pdf,application/pdf",
  noun = "PDFs",
  previewDragOver,
}: {
  files: DropFile[];
  error?: string;
  onFiles: (files: File[]) => void;
  onRemove: (id: string) => void;
  accept?: string;
  noun?: string;
  /** Kitchen sink only: show the drag-over state without dragging. */
  previewDragOver?: number;
}) {
  const picker = useRef<HTMLInputElement>(null);
  const [dragCount, setDragCount] = useState(0);
  const depth = useRef(0);
  const over = previewDragOver ?? dragCount;
  const hasFiles = files.length > 0;

  const open = () => picker.current?.click();

  return (
    <div className={s.wrap}>
      <div
        className={clsx(s.zone, hasFiles && !over && s.compact, over > 0 && s.over, error && !over && s.bad)}
        onClick={(event) => {
          if (event.target === event.currentTarget || !(event.target as HTMLElement).closest("button")) open();
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          depth.current += 1;
          setDragCount(event.dataTransfer.items.length || 1);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => {
          depth.current -= 1;
          if (depth.current <= 0) setDragCount(0);
        }}
        onDrop={(event) => {
          event.preventDefault();
          depth.current = 0;
          setDragCount(0);
          onFiles(Array.from(event.dataTransfer.files));
        }}
      >
        {over > 0 ? (
          <>
            <IconTile icon={Upload} tone="brand" size={48} />
            <strong>
              Release to add {over} {over === 1 ? "file" : "files"}
            </strong>
          </>
        ) : hasFiles ? (
          <>
            <strong>Drop more {noun} here, or</strong>
            <Button variant="secondary" icon={Upload} onClick={open}>
              Add more
            </Button>
          </>
        ) : (
          <>
            <IconTile icon={Upload} tone="pdf" size={48} />
            <div>
              <strong>Drop {noun} here</strong>
              <p>or pick them from your device</p>
            </div>
            <Button variant="primary" onClick={open}>
              Choose files
            </Button>
            <span className={s.safe}>
              <ShieldCheck aria-hidden strokeWidth={2} />
              Stays on your device
            </span>
          </>
        )}
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

      {error && (
        <p className={s.error} role="alert">
          <CircleAlert aria-hidden strokeWidth={2} />
          {error}
        </p>
      )}

      {hasFiles && (
        <ul className={s.list} aria-label="Files added">
          {files.map((file) => (
            <li key={file.id} className={s.row}>
              <span className={s.grip} aria-hidden>
                <GripVertical strokeWidth={1.8} />
              </span>
              <span className={s.fileTile} aria-hidden>
                <FileText strokeWidth={1.8} />
              </span>
              <span className={s.name}>
                <strong>{file.name}</strong>
                <span>
                  {file.pages !== undefined && `${file.pages} ${file.pages === 1 ? "page" : "pages"} · `}
                  {bytes(file.size)}
                </span>
              </span>
              <IconButton icon={X} label={`Remove ${file.name}`} onClick={() => onRemove(file.id)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
