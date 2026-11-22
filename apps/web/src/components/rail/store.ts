/** A tiny localStorage-backed store for the rail's per-browser settings. */
export function localStore<T>(key: string, fallback: T, valid: (v: unknown) => v is T) {
  const listeners = new Set<() => void>();
  let cache: T | undefined;
  const read = (): T => {
    if (cache !== undefined) return cache;
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? "null");
      cache = valid(parsed) ? parsed : fallback;
    } catch {
      cache = fallback;
    }
    return cache;
  };
  return {
    read,
    server: () => fallback,
    write(next: T) {
      cache = next;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* storage blocked: this visit only */
      }
      listeners.forEach((l) => l());
    },
    subscribe(l: () => void) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}
