import { recordFile } from "@/lib/history";

/** What a finished tool hands to the result card. */
export type Result = {
  blob: Blob;
  name: string;
  /** Extra mono facts after the name, e.g. "4 pages". */
  facts: string[];
};

/** Copy a pdf-lib/JSZip byte array into a Blob (see lib/download.ts for why). */
export function toBlob(data: Uint8Array, type: string): Blob {
  const copy = new ArrayBuffer(data.byteLength);
  new Uint8Array(copy).set(data);
  return new Blob([copy], { type });
}

/** Note the finished file in this browser's history: metadata only. */
export function remember(result: Result, tool: string, icon: string) {
  recordFile({ name: result.name, tool, icon, bytes: result.blob.size, detail: result.facts.join(" · ") || undefined });
}

/**
 * Hand the browser the file to save. Unlike lib/download's saveFile this does
 * not touch the history: the tools record a file once, when it is made, not
 * every time the Download button is pressed.
 */
export function download(result: Result) {
  const url = URL.createObjectURL(result.blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = result.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give the browser a moment to start the download before letting go.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
