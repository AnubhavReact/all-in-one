"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * The drop target used inside a tool page.
 *
 * Once something has been added the big empty target is in the way — the
 * files are what matters — so it collapses to a single row that still takes
 * a drop.
 */
export function DropField({
  accept,
  multiple = false,
  title,
  hint,
  compact = false,
  onFiles,
}: {
  accept: string;
  multiple?: boolean;
  title: string;
  hint: string;
  /** Collapses to a one-line bar. */
  compact?: boolean;
  onFiles: (files: File[]) => void;
}) {
  const id = useId();
  const [over, setOver] = useState(false);

  function take(list: FileList | null) {
    if (!list || list.length === 0) return;
    onFiles(Array.from(list));
  }

  const hidden = (
    <input
      id={id}
      type="file"
      accept={accept}
      multiple={multiple}
      style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
      onChange={(event) => {
        take(event.target.files);
        event.target.value = "";
      }}
    />
  );

  if (compact) {
    return (
      <label
        htmlFor={id}
        className="aio-drop aio-p-dropbar"
        data-over={over}
        onDragOver={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setOver(false);
          take(event.dataTransfer.files);
        }}
      >
        <Icon name="plus" />
        {title}
        <small>
          <Icon name="lock" />
          Nothing is uploaded
        </small>
        {hidden}
      </label>
    );
  }

  return (
    <div
      className="aio-drop"
      data-over={over}
      onDragOver={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setOver(false);
        take(event.dataTransfer.files);
      }}
      style={{ transition: "border-color .15s, background .15s" }}
    >
      <span className="aio-drop-icon">
        <Icon name="upload" />
      </span>
      <strong className="aio-p-droptitle">{title}</strong>
      <p>{hint}</p>

      <label htmlFor={id} className="aio-btn aio-btn--primary" style={{ cursor: "pointer" }}>
        Choose {multiple ? "files" : "a file"}
      </label>
      {hidden}

      <small>
        <Icon name="lock" />
        Processed in your browser &middot; nothing is uploaded
      </small>
    </div>
  );
}
