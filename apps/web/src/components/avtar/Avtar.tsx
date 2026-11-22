"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { MessageCircle, SendHorizontal, Bot, X } from "lucide-react";
import { avtarReply, type AvtarReply } from "@aio/core";
import { IconButton } from "@/components/ui/Button";
import { LinkChip, SuggestionChip } from "@/components/ui/Chip";
import { IconTile } from "@/components/ui/IconTile";
import s from "./Avtar.module.css";

type Turn = { id: number; q: string; a: AvtarReply };

const KEY = "aio-avtar";
const STARTERS = ["How do I merge PDFs?", "Old or new tax regime?", "Are my files uploaded?", "What is Structura?"];

/* The thread lives outside React and in localStorage, so it survives
 * closing the panel and reloads. Nothing is sent anywhere. */
let turns: Turn[] | null = null;
const listeners = new Set<() => void>();
const EMPTY: Turn[] = [];

function load(): Turn[] {
  if (turns) return turns;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    turns = Array.isArray(parsed) ? (parsed as Turn[]).filter((t) => t && typeof t.q === "string" && t.a) : [];
  } catch {
    turns = [];
  }
  return turns;
}
function save(next: Turn[]) {
  turns = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next.slice(-40)));
  } catch {
    /* storage blocked: keep it in memory */
  }
  listeners.forEach((l) => l());
}
function ask(text: string) {
  const q = text.trim();
  if (!q) return;
  save([...load(), { id: Date.now(), q, a: avtarReply(q) }]);
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/**
 * AVTAR, the help bot: a charcoal launcher bottom-right, a 400×600 panel on
 * desktop and a bottom sheet on phones. Answers come from the fixed FAQ in
 * @aio/core, so it works offline and can't make things up.
 */
export function Avtar({ open, seed, onOpen, onClose }: { open: boolean; seed: { text: string; id: number } | null; onOpen: () => void; onClose: () => void }) {
  const thread = useSyncExternalStore(subscribe, load, () => EMPTY);
  const [draft, setDraft] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const lastSeed = useRef<number | null>(null);
  const wasOpen = useRef(false);
  const touchY = useRef<number | null>(null);

  // A question handed over from elsewhere (CTA, ask bar) is asked once.
  useEffect(() => {
    if (seed && seed.id !== lastSeed.current) {
      lastSeed.current = seed.id;
      if (seed.text) ask(seed.text);
    }
  }, [seed]);

  // Focus moves in on open and back to the launcher on close.
  useEffect(() => {
    if (open) input.current?.focus();
    else if (wasOpen.current) launcher.current?.focus();
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight });
  }, [thread, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) {
    return (
      <button ref={launcher} type="button" className={s.launcher} onClick={onOpen} aria-label="Ask AVTAR (Ctrl or Command J)">
        <span className={s.orb} aria-hidden>
          <MessageCircle strokeWidth={2} />
        </span>
        <span className={s.label}>Ask AVTAR</span>
        <kbd aria-hidden>⌘J</kbd>
      </button>
    );
  }

  return (
    <>
      <button type="button" className={s.scrim} aria-label="Close AVTAR" onClick={onClose} />
      <section className={s.panel} role="dialog" aria-modal="false" aria-labelledby="avtar-title">
        <button
          type="button"
          className={s.handle}
          aria-label="Close AVTAR"
          onClick={onClose}
          onTouchStart={(e) => (touchY.current = e.touches[0].clientY)}
          onTouchEnd={(e) => {
            if (touchY.current !== null && e.changedTouches[0].clientY - touchY.current > 60) onClose();
            touchY.current = null;
          }}
        />
        <header className={s.head}>
          <IconTile icon={Bot} tone="brand" />
          <h2 id="avtar-title">AVTAR &middot; Help</h2>
          <p>Answers from a fixed FAQ · works offline · never makes things up</p>
          {thread.length > 0 ? (
            <button type="button" className={s.clear} onClick={() => save([])}>
              Clear
            </button>
          ) : (
            <span />
          )}
          <IconButton icon={X} label="Close AVTAR" onClick={onClose} />
        </header>

        <div ref={body} className={s.body} aria-live="polite">
          <p className={s.hello}>Hi, I&rsquo;m AVTAR. Ask me how a tool works, or pick a question.</p>
          {thread.length === 0 && (
            <div className={s.chips}>
              {STARTERS.map((q) => (
                <SuggestionChip key={q} onClick={() => ask(q)}>
                  {q}
                </SuggestionChip>
              ))}
            </div>
          )}
          {thread.map((t) => (
            <div key={t.id} style={{ display: "grid", gap: 8 }}>
              <p className={s.me}>{t.q}</p>
              <div className={s.bot}>
                <p>{t.a.text}</p>
                {t.a.topic === null && t.a.links.length === 0 && (
                  <div className={s.chips}>
                    {STARTERS.map((q) => (
                      <SuggestionChip key={q} onClick={() => ask(q)}>
                        {q}
                      </SuggestionChip>
                    ))}
                  </div>
                )}
                {t.a.links.length > 0 && (
                  // Following a link closes the panel so the page isn't hidden under it.
                  <div className={s.links} onClickCapture={(e) => (e.target as HTMLElement).closest("a") && onClose()}>
                    {t.a.links.map((l) => (
                      <LinkChip key={l.href} href={l.href}>
                        {l.label}
                      </LinkChip>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <form
          className={s.form}
          onSubmit={(e) => {
            e.preventDefault();
            ask(draft);
            setDraft("");
          }}
        >
          <label htmlFor="avtar-input" className="sr-only">
            Ask AVTAR a question
          </label>
          <input
            ref={input}
            id="avtar-input"
            className={s.input}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask about a tool…"
            autoComplete="off"
          />
          <button type="submit" className={s.send} aria-label="Send" disabled={!draft.trim()}>
            <SendHorizontal aria-hidden strokeWidth={2} />
          </button>
        </form>
      </section>
    </>
  );
}
