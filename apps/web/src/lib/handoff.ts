/**
 * Files dropped somewhere else (the home page's drop target) waiting for a
 * tool to pick them up after navigation. Memory only: nothing is stored or
 * sent, and a reload forgets them.
 */
let pending: File[] = [];

export function handOff(files: File[]) {
  pending = files;
}

/** Returns the waiting files once, then forgets them. */
export function takeHandOff(): File[] {
  const files = pending;
  pending = [];
  return files;
}
