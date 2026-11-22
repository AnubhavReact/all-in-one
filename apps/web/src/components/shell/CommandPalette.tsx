"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState, useEffect } from "react";
import { BookOpen, Bot, Clock, Home, Search } from "lucide-react";
import { LEARN_TRACKS, TOOLS, isLive, searchTools } from "@aio/core";
import { IconTile, type Tone } from "@/components/ui/IconTile";
import { toolIcon, toneFor } from "@/lib/tool-ui";
import s from "./Palette.module.css";

type Row = {
  key: string;
  group: "Recent" | "Tools" | "Pages" | "AVTAR";
  label: string;
  sub: string;
  icon: typeof Home;
  tone: Tone;
  run: () => void;
};

const RECENT_KEY = "aio-palette-recent";

function readRecent(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string").slice(0, 4) : [];
  } catch {
    return [];
  }
}
function pushRecent(q: string) {
  const query = q.trim();
  if (!query) return;
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify([query, ...readRecent().filter((x) => x !== query)].slice(0, 4)));
  } catch {
    /* ignore */
  }
}

/**
 * ⌘K. Arrow keys move, Enter opens, Esc closes. Only things that work are
 * listed; Soon tools are left out rather than shown and refused. Mounted only
 * while open, so it always starts blank.
 */
export function CommandPalette({ filter, onClose, onAsk }: { filter: "tools" | null; onClose: () => void; onAsk: (q: string) => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [recent] = useState(readRecent);
  const listId = useId();
  const dialog = useRef<HTMLDivElement>(null);
  const restore = useRef<HTMLElement | null>(null);

  useEffect(() => {
    restore.current = document.activeElement as HTMLElement | null;
    const back = restore.current;
    return () => back?.focus?.();
  }, []);

  const go = (href: string) => {
    pushRecent(query);
    onClose();
    router.push(href);
  };

  const rows = useMemo<Row[]>(() => {
    const q = query.trim();
    const out: Row[] = [];
    if (!q && filter !== "tools") {
      for (const r of recent) {
        out.push({ key: `r:${r}`, group: "Recent", label: r, sub: "Search again", icon: Clock, tone: "soon", run: () => setQuery(r) });
      }
    }
    const tools = (q ? searchTools(q, 8) : TOOLS).filter(isLive);
    for (const t of tools) {
      out.push({ key: `t:${t.slug}`, group: "Tools", label: t.name, sub: t.blurb, icon: toolIcon(t), tone: toneFor(t.hue), run: () => go(t.href) });
    }
    if (filter !== "tools") {
      const pages = [
        { label: "Home", sub: "What do you want to do today?", href: "/", icon: Home, tone: "brand" as Tone },
        { label: "Learn", sub: "System design, databases and DSA", href: "/learn", icon: BookOpen, tone: "learn" as Tone },
        ...LEARN_TRACKS.map((tr) => ({ label: tr.name, sub: tr.area, href: `/learn#${tr.id}`, icon: BookOpen, tone: "learn" as Tone })),
      ].filter((p) => !q || `${p.label} ${p.sub}`.toLowerCase().includes(q.toLowerCase()));
      for (const p of pages) out.push({ key: `p:${p.href}`, group: "Pages", label: p.label, sub: p.sub, icon: p.icon, tone: p.tone, run: () => go(p.href) });
      if (q) {
        out.push({
          key: "ask",
          group: "AVTAR",
          label: `Ask AVTAR: “${q}”`,
          sub: "Answers from the help FAQ",
          icon: Bot,
          tone: "brand",
          run: () => {
            pushRecent(q);
            onClose();
            onAsk(q);
          },
        });
      }
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filter, recent]);

  const current = Math.min(active, Math.max(rows.length - 1, 0));

  return (
    <div
      className={s.scrim}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={dialog} className={s.dialog} role="dialog" aria-modal="true" aria-label="Search tools, or ask AVTAR">
        <div className={s.search}>
          <Search aria-hidden strokeWidth={1.8} />
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={rows[current] ? `${listId}-${current}` : undefined}
            placeholder={filter === "tools" ? "Find a tool…" : "Search tools, or ask AVTAR…"}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((current + 1) % Math.max(rows.length, 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((current - 1 + rows.length) % Math.max(rows.length, 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                rows[current]?.run();
              } else if (e.key === "Escape") {
                e.preventDefault();
                onClose();
              } else if (e.key === "Tab") {
                // Keep focus in the dialog: the input is its only tab stop.
                e.preventDefault();
              }
            }}
          />
          <kbd aria-hidden>Esc</kbd>
        </div>

        <div id={listId} className={s.list} role="listbox" aria-label="Results">
          {rows.length === 0 && <p className={s.empty}>No tool matches that.</p>}
          {rows.map((row, i) => (
            <div key={row.key} style={{ display: "contents" }}>
              {(i === 0 || rows[i - 1].group !== row.group) && (
                <div className={s.group} role="presentation">
                  {row.group}
                </div>
              )}
              <div
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === current}
                className={s.row}
                onMouseMove={() => setActive(i)}
                onClick={row.run}
              >
                <IconTile icon={row.icon} tone={row.tone} />
                <strong>{row.label}</strong>
                <small>{row.sub}</small>
              </div>
            </div>
          ))}
        </div>

        <div className={s.foot} aria-hidden>
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> move
          </span>
          <span>
            <kbd>Enter</kbd> open
          </span>
          <span>
            <kbd>Esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
