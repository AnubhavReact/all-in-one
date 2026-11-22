"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.querySelector<HTMLElement>("h1, main")?.focus({ preventScroll: true });
      }}
    >
      <ArrowUp aria-hidden strokeWidth={2} />
      Back to top
    </button>
  );
}
