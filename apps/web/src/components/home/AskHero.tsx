"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Bot, Search } from "lucide-react";
import { isLive, searchTools } from "@aio/core";
import { SuggestionChip } from "@/components/ui/Chip";
import { IconTile } from "@/components/ui/IconTile";
import { Accent } from "@/components/ui/SectionIntro";
import { askAvtar } from "@/components/shell/events";
import { toolIcon, toneFor } from "@/lib/tool-ui";
import s from "./Home.module.css";

const INTENTS = [
  { label: "Merge my PDFs", href: "/pdf/merge" },
  { label: "Which tax regime saves more?", href: "/tax" },
  { label: "Turn photos into a PDF", href: "/pdf/from-images" },
  { label: "Start DSA prep", href: "/learn#dsa" },
];

/**
 * "What do you want to do today?" Typing filters the live tools; the last
 * option hands the question to AVTAR. Enter opens the top match.
 */
export function AskHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const id = useId();

  const q = query.trim();
  const tools = q ? searchTools(q, 5).filter(isLive) : [];
  const options = [
    ...tools.map((t) => ({ key: t.slug, label: t.name, sub: t.blurb, icon: toolIcon(t), tone: toneFor(t.hue), run: () => router.push(t.href) })),
    ...(q ? [{ key: "ask", label: `Ask AVTAR: “${q}”`, sub: "Answers from the help FAQ", icon: Bot, tone: "brand" as const, run: () => askAvtar(q) }] : []),
  ];
  const showList = open && options.length > 0;
  const current = Math.min(active, Math.max(options.length - 1, 0));

  return (
    <section className={s.hero} aria-labelledby="home-title">
      <span className="t-eyebrow">Free · Private · No account</span>
      <h1 id="home-title" className="t-display-l">
        What do you want to do <Accent>today?</Accent>
      </h1>

      <div className={s.askWrap}>
        <div className={s.ask}>
          <Search aria-hidden strokeWidth={1.8} />
          <label htmlFor={`${id}-q`} className="sr-only">
            Ask AVTAR, or name a tool
          </label>
          <input
            id={`${id}-q`}
            role="combobox"
            aria-expanded={showList}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-activedescendant={showList ? `${id}-${current}` : undefined}
            autoComplete="off"
            placeholder="Ask AVTAR, or name a tool — e.g. ‘merge PDFs’"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" && options.length) {
                e.preventDefault();
                setOpen(true);
                setActive((current + 1) % options.length);
              } else if (e.key === "ArrowUp" && options.length) {
                e.preventDefault();
                setActive((current - 1 + options.length) % options.length);
              } else if (e.key === "Enter" && options[current]) {
                e.preventDefault();
                options[current].run();
                setOpen(false);
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }}
          />
          <kbd aria-hidden>⌘K</kbd>
        </div>
        {showList && (
          <div id={`${id}-list`} role="listbox" aria-label="Matches" className={s.drop}>
            {options.map((o, i) => (
              <div
                key={o.key}
                id={`${id}-${i}`}
                role="option"
                aria-selected={i === current}
                className={s.opt}
                onMouseDown={(e) => {
                  e.preventDefault();
                  o.run();
                  setOpen(false);
                }}
                onMouseMove={() => setActive(i)}
              >
                <IconTile icon={o.icon} tone={o.tone} />
                <strong>{o.label}</strong>
                <small>{o.sub}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={s.chips}>
        {INTENTS.map((intent) => (
          <SuggestionChip key={intent.label} onClick={() => router.push(intent.href)}>
            {intent.label}
          </SuggestionChip>
        ))}
      </div>
    </section>
  );
}
