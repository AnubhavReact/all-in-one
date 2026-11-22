"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { IconButton } from "./Button";

type Theme = "light" | "dark";

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const read = (): Theme => {
  const t = document.documentElement.getAttribute("data-theme");
  return t === "dark" || t === "dusk" ? "dark" : "light";
};

/** Flips <html data-theme> and remembers it in localStorage("aio-theme"). */
export function ThemeToggle({ outline }: { outline?: boolean }) {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);
  const next: Theme = theme === "light" ? "dark" : "light";
  return (
    <IconButton
      icon={theme === "light" ? Moon : Sun}
      outline={outline}
      label={`Switch to ${next} theme`}
      onClick={() => {
        document.documentElement.setAttribute("data-theme", next);
        try {
          localStorage.setItem("aio-theme", next);
        } catch {
          /* private mode: applies for this visit only */
        }
      }}
    />
  );
}
