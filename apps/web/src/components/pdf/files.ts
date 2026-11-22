import { bytes } from "@/lib/format";

/** A picked file with a stable id for keys and drag-and-drop. */
export type Picked = {
  id: string;
  file: File;
  /** Page count once read, for PDFs. */
  pages?: number;
  /** Object URL preview, for images. */
  preview?: string;
};

let counter = 0;
export function pick(file: File): Picked {
  counter += 1;
  return { id: `f${counter}-${file.name}`, file };
}

export function isPdf(file: File) {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

export function isImage(file: File) {
  return file.type === "image/png" || file.type === "image/jpeg" || /\.(png|jpe?g)$/i.test(file.name);
}

export function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

/** "a.docx and b.jpg" / "a.docx, b.jpg and 2 more" */
function listNames(names: string[]) {
  if (names.length === 1) return names[0];
  if (names.length <= 3) return `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
  return `${names.slice(0, 2).join(", ")} and ${names.length - 2} more`;
}

/**
 * "resume.docx isn't a PDF. Add .pdf files only. Your other 2 files are still here."
 * `kept` is how many good files are in the list after this drop.
 */
export function rejectMessage(rejected: File[], kept: number, kind: "pdf" | "image") {
  const names = listNames(rejected.map((f) => f.name));
  const one = rejected.length === 1;
  const what = kind === "pdf" ? (one ? "a PDF" : "PDFs") : one ? "a JPG or PNG" : "JPGs or PNGs";
  const fix = kind === "pdf" ? "Add .pdf files only." : "Add .jpg or .png images only. Save HEIC photos as JPG first.";
  const rest = kept === 1 ? " Your other file is still here." : kept > 1 ? ` Your other ${kept} files are still here.` : "";
  return `${names} ${one ? "isn't" : "aren't"} ${what}. ${fix}${rest}`;
}

/** "2 pages · 184 KB" */
export function fileMeta(item: Picked) {
  const size = bytes(item.file.size);
  return item.pages !== undefined ? `${plural(item.pages, "page")} · ${size}` : size;
}
