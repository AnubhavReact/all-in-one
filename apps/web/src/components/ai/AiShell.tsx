"use client";

import { useCallback, useEffect, useState } from "react";
import { Assistant } from "@/components/ai/Assistant";
import { CommandPalette } from "@/components/ai/CommandPalette";
import { Icon } from "@/components/ui/Icon";

/**
 * Mounts the three AI surfaces once for the whole app and owns the state they
 * share: ⌘K opens the palette, ⌘J the assistant, and Tab in the palette hands
 * the query over to the assistant.
 */
export function AiShell() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [assistOpen, setAssistOpen] = useState(false);
  const [seed, setSeed] = useState("");

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey;
      if (!mod) return;
      const key = event.key.toLowerCase();
      if (key === "k") {
        event.preventDefault();
        setCmdOpen((open) => !open);
      } else if (key === "j") {
        event.preventDefault();
        setAssistOpen((open) => !open);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // The navbar's and the top bar's search boxes open the palette too.
  useEffect(() => {
    function onOpen() {
      setCmdOpen(true);
    }
    window.addEventListener("aio:palette", onOpen);
    return () => window.removeEventListener("aio:palette", onOpen);
  }, []);

  const ask = useCallback((query: string) => {
    setSeed(query);
    setAssistOpen(true);
  }, []);

  useEffect(() => {
    function onAsk(event: Event) {
      const detail = (event as CustomEvent<string>).detail;
      ask(typeof detail === "string" ? detail : "");
    }
    window.addEventListener("aio:ask", onAsk);
    return () => window.removeEventListener("aio:ask", onAsk);
  }, [ask]);

  return (
    <>
      {!assistOpen && (
        <button
          type="button"
          className="aio-launcher aio-p-launcher"
          onClick={() => setAssistOpen(true)}
        >
          <span className="orb">
            <Icon name="ai" />
          </span>
          Ask AI
        </button>
      )}
      <Assistant
        open={assistOpen}
        seed={seed}
        onClose={() => setAssistOpen(false)}
      />
      {cmdOpen && (
        <CommandPalette onClose={() => setCmdOpen(false)} onAskAi={ask} />
      )}
    </>
  );
}

/** Opens the ⌘K palette from anywhere, without threading props through. */
export function openPalette() {
  window.dispatchEvent(new Event("aio:palette"));
}

/** Hands a question to the assistant from anywhere. */
export function askAssistant(query: string) {
  window.dispatchEvent(new CustomEvent("aio:ask", { detail: query }));
}
