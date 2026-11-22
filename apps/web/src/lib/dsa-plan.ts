/**
 * A 30-day DSA plan, ten minutes a day, tracked only in this browser.
 *
 * AllInOne can't see what you do on DSA Atlas, so it never claims to. It
 * remembers two things locally: the day you started, and the days you pressed
 * "Continue". The day number and the streak come from those, nothing else.
 */
export const DSA_PLAN: string[] = [
  "Arrays & hashing", "Arrays & hashing", "Two pointers", "Two pointers", "Sliding window",
  "Sliding window", "Prefix sums", "Stack", "Monotonic stack", "Binary search",
  "Binary search on answers", "Linked list", "Linked list", "Fast & slow pointers", "Trees: traversal",
  "Trees: BFS", "Binary search trees", "Heap / priority queue", "Intervals", "Greedy",
  "Backtracking", "Backtracking", "Tries", "Graphs: BFS & DFS", "Graphs: topological sort",
  "Union-find", "1-D dynamic programming", "2-D dynamic programming", "Bit manipulation", "Mock interview mix",
];

const KEY = "aio-dsa-plan";
const DAY = 86_400_000;

export type DsaState = { start: string; visits: string[] } | null;

/** Local calendar date, YYYY-MM-DD. */
export function today(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const toTime = (iso: string) => new Date(`${iso}T00:00:00`).getTime();

export function dayNumber(state: NonNullable<DsaState>, now = new Date()): number {
  const days = Math.round((toTime(today(now)) - toTime(state.start)) / DAY);
  return Math.min(Math.max(days + 1, 1), DSA_PLAN.length);
}

/** Consecutive days with a visit, ending today (or yesterday, so it isn't lost before you open it today). */
export function streak(state: NonNullable<DsaState>, now = new Date()): number {
  const set = new Set(state.visits);
  let cursor = toTime(today(now));
  if (!set.has(today(new Date(cursor)))) cursor -= DAY;
  let count = 0;
  while (set.has(today(new Date(cursor)))) {
    count += 1;
    cursor -= DAY;
  }
  return count;
}

/* -------------------------------------------------- the local store */

const listeners = new Set<() => void>();
let cache: DsaState | undefined;

export function readDsa(): DsaState {
  if (cache !== undefined) return cache;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "null");
    const ok =
      parsed && typeof parsed === "object" && typeof (parsed as { start?: unknown }).start === "string" &&
      Array.isArray((parsed as { visits?: unknown }).visits);
    cache = ok ? (parsed as NonNullable<DsaState>) : null;
  } catch {
    cache = null;
  }
  return cache;
}

function write(next: DsaState) {
  cache = next;
  try {
    if (next) localStorage.setItem(KEY, JSON.stringify(next));
    else localStorage.removeItem(KEY);
  } catch {
    /* storage blocked: keep it for this visit */
  }
  listeners.forEach((l) => l());
}

/** Starts the plan today (if not started) and counts today as a visit. */
export function markDsaVisit() {
  const state = readDsa();
  const day = today();
  if (!state) write({ start: day, visits: [day] });
  else if (!state.visits.includes(day)) write({ ...state, visits: [...state.visits, day].slice(-60) });
}

export function resetDsa() {
  write(null);
}

export function subscribeDsa(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = undefined;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}
