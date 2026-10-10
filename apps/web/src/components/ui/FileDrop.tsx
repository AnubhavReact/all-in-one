"use client";

import { useId, useRef, useState } from "react";

export function FileDrop({
  accept,
  multiple = false,
  label,
  hint,
  onFiles,
}: {
  accept: string;
  multiple?: boolean;
  label: string;
  hint: string;
  onFiles: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const id = useId();

  function take(list: FileList | null) {
    if (!list || list.length === 0) return;
    onFiles(Array.from(list));
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        take(e.dataTransfer.files);
      }}
      className={`rounded-tile border-2 border-dashed p-8 text-center transition-colors ${
        over ? "border-ink bg-signal/20" : "border-rule bg-card"
      }`}
    >
      <label htmlFor={id} className="cursor-pointer">
        <span className="block text-[17px] font-semibold">{label}</span>
        <span className="mt-1 block text-[13px] text-ink-70">{hint}</span>
        <span className="mt-4 inline-block rounded-tile border-2 border-ink bg-ink px-4 py-2 text-[14px] font-semibold text-paper">
          Choose {multiple ? "files" : "a file"}
        </span>
      </label>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          take(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
