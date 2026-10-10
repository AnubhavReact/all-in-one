/**
 * What the PDF tools have produced, kept in this browser.
 *
 * Only the name, the tool, the size and the time are stored — never the file.
 * The file was never uploaded and is gone the moment the download finishes,
 * so the list is a record of what you did, not a place to get it back from.
 * localStorage, because it has to survive a reload and nothing here is worth
 * a database.
 */
const KEY = "aio-history";
const LIMIT = 20;

/** Fires on the window whenever the list changes, so open pages can redraw. */
export const HISTORY_EVENT = "aio:history";

export type HistoryEntry = {
  name: string;
  /** The tool's display name, e.g. "Merge PDFs". */
  tool: string;
  /** An icon name from the design system's set. */
  icon: string;
  bytes: number;
  /** Epoch milliseconds. */
  at: number;
};

function isEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== "object" || value === null) return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.name === "string" &&
    typeof row.tool === "string" &&
    typeof row.icon === "string" &&
    typeof row.bytes === "number" &&
    typeof row.at === "number"
  );
}

/** Newest first. Returns [] on the server, or if the store is unreadable. */
export function readHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isEntry) : [];
  } catch {
    // Private mode, blocked storage, or someone else's JSON under our key.
    return [];
  }
}

export function recordFile(entry: Omit<HistoryEntry, "at">): void {
  if (typeof window === "undefined") return;
  const next = [{ ...entry, at: Date.now() }, ...readHistory()].slice(0, LIMIT);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(HISTORY_EVENT));
  } catch {
    // A full or blocked store is not a reason to fail someone's download.
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(HISTORY_EVENT));
  } catch {
    // Nothing to do; the list is already as empty as we can make it.
  }
}

/** "2 min ago", "Yesterday", "3 Oct" — the three the design shows. */
export function timeAgo(at: number, now = Date.now()): string {
  const minutes = Math.round((now - at) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return new Date(at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

/**
 * useSyncExternalStore needs a snapshot that keeps the same identity between
 * renders, so the parsed list is cached and thrown away on every change.
 */
let cache: HistoryEntry[] | null = null;
const EMPTY: HistoryEntry[] = [];

export function getHistorySnapshot(): HistoryEntry[] {
  if (cache === null) cache = readHistory();
  return cache;
}

/** The server has no localStorage, so it renders the empty list. */
export function getHistoryServerSnapshot(): HistoryEntry[] {
  return EMPTY;
}

export function subscribeHistory(onChange: () => void): () => void {
  function handle() {
    cache = null;
    onChange();
  }
  window.addEventListener(HISTORY_EVENT, handle);
  // Another tab writing the same key.
  window.addEventListener("storage", handle);
  return () => {
    window.removeEventListener(HISTORY_EVENT, handle);
    window.removeEventListener("storage", handle);
  };
}
