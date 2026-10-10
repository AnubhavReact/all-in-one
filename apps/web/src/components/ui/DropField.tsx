"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/** The drop target used inside a tool page. */
export function DropField({
  accept,
  multiple = false,
  title,
  hint,
  onFiles,
}: {
  accept: string;
  multiple?: boolean;
  title: string;
  hint: string;
  onFiles: (files: File[]) => void;
}) {
  const id = useId();
  const [over, setOver] = useState(false);

  function take(list: FileList | null) {
    if (!list || list.length === 0) return;
    onFiles(Array.from(list));
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

      <small>
        <Icon name="lock" />
        Processed in your browser &middot; nothing is uploaded
      </small>
    </div>
  );
}
