import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import s from "./IconTile.module.css";

/** Section colours: PDF coral, Career teal, Tax green, Learn/AI sky, AVTAR indigo. */
export type Tone = "pdf" | "career" | "tax" | "learn" | "brand" | "soon";

export function IconTile({ icon: I, tone, size = 40, className }: { icon: LucideIcon; tone: Tone; size?: 40 | 48; className?: string }) {
  return (
    <span className={clsx(s.tile, s[tone], size === 48 ? s.s48 : s.s40, className)} aria-hidden>
      <I strokeWidth={1.8} />
    </span>
  );
}
