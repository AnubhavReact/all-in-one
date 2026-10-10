import { TOOLS } from "@aio/core";
import { recordFile } from "./history";

/**
 * pdf-lib and friends hand back a Uint8Array whose backing buffer TypeScript
 * only knows as ArrayBufferLike, which Blob will not take. Copying the bytes
 * into a plain ArrayBuffer is the one fix that needs no cast, and it also
 * detaches the result from whatever produced it.
 */
function toArrayBuffer(view: Uint8Array): ArrayBuffer {
  const copy = new ArrayBuffer(view.byteLength);
  new Uint8Array(copy).set(view);
  return copy;
}

/** Hand the browser a file to save, then release the temporary URL. */
export function saveFile(
  data: Uint8Array | Blob | string,
  filename: string,
  type: string,
) {
  const blob =
    data instanceof Blob
      ? data
      : new Blob([typeof data === "string" ? data : toArrayBuffer(data)], {
          type,
        });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);

  // Every tool hands its result to this one function, so this is the only
  // place that has to remember the file — no tool can forget to.
  const tool = TOOLS.find((t) => t.href === window.location.pathname);
  recordFile({
    name: filename,
    tool: tool?.name ?? "PDF tools",
    icon: tool?.icon ?? "file",
    bytes: blob.size,
  });
}

/** "report.pdf" -> "report" */
export function baseName(filename: string) {
  return filename.replace(/\.[^.]+$/, "");
}
