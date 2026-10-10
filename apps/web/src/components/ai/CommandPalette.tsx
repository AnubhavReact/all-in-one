"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SECTIONS, TOOLS, searchTools, liveTools } from "@aio/core";
import { Icon } from "@/components/ui/Icon";

type Row = {
  key: string;
  group: string;
  label: string;
  sub: string;
  icon: string;
  hue: string;
  href: string;
};

function toRows(query: string): Row[] {
  const tools = query ? searchTools(query, 6) : liveTools();
  const rows: Row[] = tools.map((tool) => ({
    key: `tool:${tool.slug}`,
    group: "Tools",
    label: tool.name,
    sub: tool.status === "soon" ? "coming soon" : tool.blurb,
    icon: tool.icon,
    hue: tool.hue,
    href: tool.href,
  }));

  const q = query.trim().toLowerCase();
  for (const section of SECTIONS) {
    if (q && !section.name.toLowerCase().includes(q)) continue;
    if (rows.some((row) => row.href === section.href)) continue;
    rows.push({
      key: `section:${section.id}`,
      group: "Pages",
      label: section.name,
      sub: "section",
      icon: TOOLS.find((t) => t.hue === section.hue)?.icon ?? "grid",
      hue: section.hue,
      href: section.href,
    });
  }
  return rows;
}

/**
 * The ⌘K palette from the v2 handoff. Arrow keys move, Enter opens, Tab hands
 * the query to the assistant, Esc closes.
 *
 * It is mounted only while open, so every opening starts from a blank field
 * without an effect having to reset the state.
 */
export function CommandPalette({
  onClose,
  onAskAi,
}: {
  onClose: () => void;
  onAskAi: (query: string) => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  // Typing should go straight into the field.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const rows = toRows(query);
  const groups = [...new Set(rows.map((row) => row.group))];
  const selected = rows[Math.min(cursor, rows.length - 1)];

  function go(href: string) {
    onClose();
    router.push(href);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((c) => (rows.length ? (c + 1) % rows.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((c) => (rows.length ? (c - 1 + rows.length) % rows.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (selected) go(selected.href);
    } else if (event.key === "Tab") {
      event.preventDefault();
      onClose();
      onAskAi(query);
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  }

  return (
    <>
      <button
        type="button"
        className="aio-p-cmdscrim"
        aria-label="Close search"
        onClick={onClose}
      />
      <div className="aio-p-cmdwrap">
        <div className="aio-cmd" role="dialog" aria-label="Search AllInOne">
          <div className="aio-cmd-input">
            <Icon name="search" />
            <input
              ref={inputRef}
              value={query}
              aria-label="Search tools and pages"
              placeholder="Search tools, or ask AllInOne AI"
              onChange={(event) => {
                setQuery(event.target.value);
                setCursor(0);
              }}
              onKeyDown={onKeyDown}
            />
            <span className="aio-kbd">Esc</span>
          </div>

          <div className="aio-cmd-list" role="listbox" aria-label="Results">
            {groups.map((group) => (
              <div key={group}>
                <h6>{group}</h6>
                {rows
                  .filter((row) => row.group === group)
                  .map((row) => (
                    <button
                      type="button"
                      className="aio-cmd-item aio-p-cmd-item"
                      key={row.key}
                      role="option"
                      aria-selected={row.key === selected?.key}
                      onMouseEnter={() =>
                        setCursor(rows.findIndex((r) => r.key === row.key))
                      }
                      onClick={() => go(row.href)}
                    >
                      <span
                        className={`aio-tile aio-tile--sm aio-tile--${row.hue}`}
                      >
                        <Icon name={row.icon} />
                      </span>
                      <div className="m">
                        {row.label}
                        <span>{row.sub}</span>
                      </div>
                      {row.key === selected?.key && (
                        <span className="aio-kbd">&crarr;</span>
                      )}
                    </button>
                  ))}
              </div>
            ))}

            <h6>Ask AI</h6>
            <button
              type="button"
              className="aio-cmd-item aio-p-cmd-item"
              role="option"
              aria-selected={false}
              onClick={() => {
                onClose();
                onAskAi(query);
              }}
            >
              <span className="aio-tile aio-tile--sm aio-tile--brand">
                <Icon name="ai" />
              </span>
              <div className="m">
                {query ? `“${query}”` : "Open AllInOne AI"}
                <span>needs an API key — not connected yet</span>
              </div>
              <span className="aio-kbd">Tab</span>
            </button>

            {rows.length === 0 && (
              <p className="aio-p-cmd-empty">
                Nothing matches &ldquo;{query}&rdquo;. Try &ldquo;merge&rdquo;,
                &ldquo;itr&rdquo; or &ldquo;resume&rdquo;.
              </p>
            )}
          </div>

          <div className="aio-cmd-foot">
            <span>
              <span className="aio-kbd">&uarr;&darr;</span> navigate
            </span>
            <span>
              <span className="aio-kbd">&crarr;</span> open
            </span>
            <span>
              <span className="aio-kbd">Tab</span> ask AI
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
