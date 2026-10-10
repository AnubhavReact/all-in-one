"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getHistorySnapshot,
  getHistoryServerSnapshot,
  subscribeHistory,
} from "@/lib/history";
import { Icon } from "@/components/ui/Icon";

/**
 * Whether a theme was ever chosen. The attribute on <html> changes at exactly
 * the moment the choice is written, so watching it is enough to re-read the
 * stored value.
 */
function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function readChosenTheme(): string | null {
  try {
    return localStorage.getItem("aio-theme");
  } catch {
    return null;
  }
}

/**
 * The "Get set up" checklist. Each row reflects something real: two are
 * genuinely done or not, and two are honest about waiting on work that has
 * not started. The design shows a button on the AI-key row; there is nowhere
 * to put a key yet, so that row links to the page that explains the plan.
 */
export function Setup() {
  const history = useSyncExternalStore(
    subscribeHistory,
    getHistorySnapshot,
    getHistoryServerSnapshot,
  );
  const theme = useSyncExternalStore(subscribeTheme, readChosenTheme, () => null);

  const items = [
    {
      title: "Try a PDF tool",
      detail:
        history.length > 0
          ? `${history.length} file${history.length > 1 ? "s" : ""} made here`
          : "Merge, split or convert something",
      done: history.length > 0,
      action: history.length === 0 && { label: "Open", href: "/pdf" },
    },
    {
      title: "Pick a theme",
      detail: theme ? (theme === "light" ? "Light" : "Dusk") : "Dusk, or light",
      done: theme !== null,
      action: false as const,
    },
    {
      title: "Add your AI key",
      detail: "Waiting on the AI route — nothing to paste into yet",
      done: false,
      action: { label: "The plan", href: "/ai" } as const,
    },
    {
      title: "Create an account",
      detail: "Not built. Everything here works without one",
      done: false,
      action: { label: "Why", href: "/welcome" } as const,
    },
  ];

  const done = items.filter((item) => item.done).length;

  return (
    <div className="aio-card aio-p-setup">
      <div className="aio-section-head">
        <div>
          <h2>Get set up</h2>
          <p>
            {done} of {items.length} done
          </p>
        </div>
      </div>

      <div className="aio-progress aio-p-setupbar">
        <i style={{ width: `${(done / items.length) * 100}%` }} />
      </div>

      <div className="aio-check">
        {items.map((item) => (
          <div
            className={item.done ? "aio-check-item done" : "aio-check-item"}
            key={item.title}
          >
            <span className="c">
              <Icon name="check" />
            </span>
            <div className="m">
              <strong>{item.title}</strong>
              <span className="d">{item.detail}</span>
            </div>
            {item.action && (
              <Link
                className="aio-btn aio-btn--ghost aio-btn--sm"
                href={item.action.href}
              >
                {item.action.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
