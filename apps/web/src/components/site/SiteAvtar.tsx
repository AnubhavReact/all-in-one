"use client";

import { useCallback, useEffect, useState } from "react";
import { Avtar } from "@/components/avtar/Avtar";
import { ASK_EVENT } from "@/components/shell/events";

/**
 * AVTAR for the public pages: the same panel as the app shell, wired the
 * same way — ⌘J toggles it and `askAvtar()` (the `aio:ask` event) opens it
 * with a first question.
 */
export function SiteAvtar() {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState<{ text: string; id: number } | null>(null);

  const ask = useCallback((text: string) => {
    setSeed({ text, id: Date.now() });
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onAsk = (e: Event) => ask(String((e as CustomEvent).detail ?? ""));
    document.addEventListener("keydown", onKey);
    window.addEventListener(ASK_EVENT, onAsk);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener(ASK_EVENT, onAsk);
    };
  }, [ask]);

  return <Avtar open={open} seed={seed} onOpen={() => setOpen(true)} onClose={() => setOpen(false)} />;
}
