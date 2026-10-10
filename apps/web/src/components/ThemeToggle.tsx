"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/Icon";

type Theme = "dusk" | "light";

/** Watch the attribute the inline bootstrap script already set. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dusk";
}

/**
 * Flips data-theme on <html> and remembers the choice.
 *
 * The attribute is the single source of truth — the inline script in the
 * layout sets it before the first paint, and this reads from it rather than
 * keeping a second copy in state that could disagree.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, () => "dusk");

  const flip = useCallback(() => {
    const next: Theme = readTheme() === "light" ? "dusk" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("aio-theme", next);
    } catch {
      // Private windows can refuse storage. The theme still applies for now.
    }
  }, []);

  return (
    <button
      type="button"
      className="aio-icon-btn"
      onClick={flip}
      aria-label={
        theme === "light" ? "Switch to dusk theme" : "Switch to light theme"
      }
    >
      <Icon name="moon" />
    </button>
  );
}
