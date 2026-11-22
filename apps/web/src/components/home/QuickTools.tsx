"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { TOOLS, isLive } from "@aio/core";
import { IconTile } from "@/components/ui/IconTile";
import { toolIcon, toneFor } from "@/lib/tool-ui";
import s from "./Home.module.css";

const HINT_KEY = "aio-hint-merge";
const listeners = new Set<() => void>();
const readHint = () => {
  try {
    return localStorage.getItem(HINT_KEY) !== "done";
  } catch {
    return false;
  }
};
const dismiss = () => {
  try {
    localStorage.setItem(HINT_KEY, "done");
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** The six live tools, one click each. First visit: a nudge towards Merge. */
export function QuickTools() {
  const showHint = useSyncExternalStore(subscribe, readHint, () => false);
  const tools = TOOLS.filter(isLive);
  return (
    <div>
    <ul className={s.quick} aria-label="Quick tools">
      {tools.map((tool) => (
        <li key={tool.slug} className={s.qWrap}>
          <Link href={tool.href} className={s.q}>
            <IconTile icon={toolIcon(tool)} tone={toneFor(tool.hue)} />
            {tool.name}
          </Link>
        </li>
      ))}
    </ul>
      {showHint && (
        <div className={s.hint} role="note">
          <span>New here? Start with Merge PDFs, the first tool above.</span>
          <button type="button" aria-label="Dismiss tip" onClick={dismiss}>
            <X aria-hidden strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}
